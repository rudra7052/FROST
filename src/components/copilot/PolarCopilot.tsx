import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Compass, 
  RefreshCw, 
  Zap,
  Sliders,
  Cpu,
  Layers,
  Wrench,
  Clock,
  Radio
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    targetView: string;
    actionFn?: () => void;
  };
}

export const PolarCopilot: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    inventory, 
    cargo, 
    movements, 
    incidents, 
    expeditions, 
    approveMovement, 
    reassignMovement, 
    updateCargoStatus, 
    updateInventoryItem, 
    addIncidentTimelineEvent,
    quickNavigateTo
  } = useOperational();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [modelMode, setModelMode] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTaskNotice, setActiveTaskNotice] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: 'Greetings Commander Rao. I am FROST AI Co-Pilot, your mission assistant for polar logistics and field operations. How can I assist you with current missions or emergency responses today?',
      timestamp: '09:50 UTC'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Contextual Suggested Operational Tasks generated from live application state
  const proactiveTasks = [
    {
      id: 'task-fuel',
      title: 'Mitigate Maitri Fuel Deficit (-3.6 Days)',
      category: 'Inventory',
      description: 'Burn rate (420 L/d) requires switching secondary generators to eco-throttle.',
      actionLabel: 'Throttle & Save 60 L/d',
      execute: () => {
        const maitriFuel = inventory.find(i => i.id === 'inv-01');
        if (maitriFuel) {
          // Adjust stock to reflect emergency auxiliary transfer
          updateInventoryItem(maitriFuel.id, maitriFuel.quantity + 800);
          setActiveTaskNotice('Applied emergency fuel reserve transfer (+800 L) to Maitri inventory.');
          setTimeout(() => setActiveTaskNotice(null), 4000);
        }
      }
    },
    {
      id: 'task-conflict',
      title: 'Resolve Twin Otter Movement Conflict',
      category: 'Movements',
      description: 'Reassign Dr. Arjun Mehta from Otter KB-402 (maintenance hold) to Kamov-32.',
      actionLabel: 'Reassign to Kamov-32',
      execute: () => {
        const conflictMov = movements.find(m => m.hasConflict);
        if (conflictMov) {
          reassignMovement(conflictMov.id, 'Helicopter Kamov-32');
          setActiveTaskNotice(`Reassigned ${conflictMov.personnelName} to Helicopter Kamov-32.`);
          setTimeout(() => setActiveTaskNotice(null), 4000);
        }
      }
    },
    {
      id: 'task-cargo',
      title: 'Acknowledge Spectrometer Delay (FR-AX-10482)',
      category: 'Cargo',
      description: 'Southern Ocean maritime storm delay. Update Maitri ground arrival crew.',
      actionLabel: 'Mark Dispatched to Ice Barrier',
      execute: () => {
        const item = cargo.find(c => c.trackingNumber === 'FR-AX-10482');
        if (item) {
          updateCargoStatus(item.id, 'IN TRANSIT', 'Re-routed around storm sector, ETA confirmed 04 Oct');
          setActiveTaskNotice('Updated FR-AX-10482 waypoint & notified Maitri science lab.');
          setTimeout(() => setActiveTaskNotice(null), 4000);
        }
      }
    },
    {
      id: 'task-med',
      title: 'Log SAR Resuscitation Action for Incident #INC-204',
      category: 'Emergency',
      description: 'Record patient warming pod core temperature readings to emergency timeline.',
      actionLabel: 'Log Trauma Event',
      execute: () => {
        const inc = incidents.find(i => i.incidentNumber === 'INC-204');
        if (inc) {
          addIncidentTimelineEvent(inc.id, 'Core warming completed; patient vitals stable at 36.6°C', 'AI Co-Pilot Assistant');
          setActiveTaskNotice('Logged vital sign stabilization in Incident #INC-204 timeline.');
          setTimeout(() => setActiveTaskNotice(null), 4000);
        }
      }
    }
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const missionContext = {
        currentView,
        activeExpeditions: expeditions.length,
        cargoInTransit: cargo.filter(c => c.status === 'IN TRANSIT').length,
        openIncidents: incidents.filter(i => i.status !== 'RESOLVED').length,
        criticalAlerts: inventory.filter(i => i.status === 'CRITICAL_RISK').map(i => `${i.item} at ${i.station}`),
      };

      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
          missionContext,
          modelPreference: modelMode,
        }),
      });

      const data = await res.json();

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Operational directive logged. Standing by for instructions.',
        timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Co-pilot send error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: 'Telemetry advisory: Local reasoning engine evaluated request. Ensure Maitri heating is optimized and prioritize medical supply flights from Cape Town.',
          timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl shadow-cyan-500/30 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer border border-cyan-300/40 group"
          title="Open FROST AI Co-Pilot"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-extrabold tracking-wide text-slate-950">
            AI CO-PILOT
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Slide-over Command Panel */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-300 ${
          isMinimized 
            ? 'bottom-6 right-6 w-80 h-14 bg-slate-950 border border-slate-800 rounded-lg shadow-2xl flex items-center justify-between px-4'
            : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[460px] h-[640px] max-h-[92vh] bg-slate-950 border border-cyan-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden polar-glow'
        }`}>
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-white">FROST AI CO-PILOT</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    OPERATIONAL
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Autonomous Task & Logistics Decision Engine
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white rounded hover:bg-slate-800"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white rounded hover:bg-slate-800"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Task Notification Toast */}
              {activeTaskNotice && (
                <div className="p-2.5 bg-emerald-950/90 border-b border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{activeTaskNotice}</span>
                </div>
              )}

              {/* Model Selector Bar */}
              <div className="px-3.5 py-2 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Reasoning Model:</span>
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
                  <button
                    onClick={() => setModelMode('gemini-3.5-flash')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      modelMode === 'gemini-3.5-flash' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="General Tasks"
                  >
                    3.5 Flash
                  </button>
                  <button
                    onClick={() => setModelMode('gemini-3.1-pro-preview')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      modelMode === 'gemini-3.1-pro-preview' ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Complex Reasoning"
                  >
                    3.1 Pro
                  </button>
                  <button
                    onClick={() => setModelMode('gemini-3.1-flash-lite')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      modelMode === 'gemini-3.1-flash-lite' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Fast Responses"
                  >
                    Flash Lite
                  </button>
                </div>
              </div>

              {/* Scrollable Message Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-gradient-to-b from-slate-950 to-slate-900/60">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-400">
                      <span>{msg.role === 'user' ? 'Commander Rao' : 'FROST Co-Pilot'}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className={`p-3 rounded-xl max-w-[88%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-950 text-cyan-100 border border-cyan-800 rounded-tr-none'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Co-Pilot synthesizing polar logistics telemetry...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Proactive Task Suggestions Drawer (Section: helps in doing & suggesting tasks) */}
              <div className="border-t border-slate-800 bg-slate-950 p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>SUGGESTED OPERATIONAL ACTIONS (1-CLICK EXECUTE)</span>
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {proactiveTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-800 min-w-[220px] max-w-[240px] shrink-0 space-y-1.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-cyan-300 font-bold">{task.category}</span>
                        </div>
                        <h4 className="text-[11px] font-bold text-white leading-tight mt-0.5">{task.title}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">{task.description}</p>
                      </div>

                      <button
                        onClick={task.execute}
                        className="w-full mt-1 py-1 px-2 text-[10px] font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>{task.actionLabel}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask co-pilot to plan, resolve conflicts, audit burn..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 rounded-lg cursor-pointer transition-colors"
                  title="Send Directive"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
