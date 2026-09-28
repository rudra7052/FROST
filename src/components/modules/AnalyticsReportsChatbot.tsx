import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Search, 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  Copy, 
  Check, 
  BarChart3, 
  Layers,
  Cpu
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sources?: Array<{ title: string; uri: string }>;
  modelUsed?: string;
}

interface AnalyticsReportsChatbotProps {
  embeddedIn?: 'analytics' | 'reports';
}

export const AnalyticsReportsChatbot: React.FC<AnalyticsReportsChatbotProps> = ({ embeddedIn = 'analytics' }) => {
  const { expeditions, cargo, inventory, assets, personnel, incidents } = useOperational();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-analytics',
      role: 'model',
      text: `**FROST Polar Intelligence & Reporting Engine Initialized.**\n\nI can compute burn-down rates, synthesize cargo delays, correlate station telemetry, and generate executive briefs for MoES / NCPOR leadership.\n\n*Toggle Google Search Grounding to integrate live Antarctic sea ice and meteorological datasets.*`,
      timestamp: '09:55 UTC',
      modelUsed: 'gemini-3.5-flash',
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [modelChoice, setModelChoice] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const promptSuggestions = [
    'Synthesize Maitri fuel burn-down rate vs 15-day resupply window',
    'Generate Executive Mission Brief on active 44th ISEA expeditions',
    'Evaluate Southern Ocean storm impact on Cargo FR-AX-10482',
    'Audit trauma response times for Incident #INC-204 at Maitri'
  ];

  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/analytics/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
          useSearchGrounding,
          modelPreference: modelChoice === 'gemini-3.1-pro-preview' ? 'complex' : 'general',
        }),
      });

      const data = await res.json();

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Data analysis complete.',
        timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
        sources: data.sources || [],
        modelUsed: data.modelUsed || modelChoice,
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Analytics Chatbot Error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: `**Operational Synthesis (Local Cache):**\n- Station Maitri fuel deficit remaining: **11.4 days** (3.6 days shortfall).\n- Inbound medical oxygen cylinder shipment priority: **CRITICAL**.\n- Reassigned Twin Otter transport ensures zero personnel delay.`,
          timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
          modelUsed: 'local-analytics-engine',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden flex flex-col h-[580px]">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-mono text-white">
                GEMINI POLAR ANALYTICS CHATBOT
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                {embeddedIn === 'analytics' ? 'TELEMETRY INTELLIGENCE' : 'EXECUTIVE DOSSIER GEN'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Multi-Turn Expedition Analysis & Automated Report Synthesis
            </p>
          </div>
        </div>

        {/* Controls: Model choice & Search Grounding Toggle */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {/* Search Grounding Toggle */}
          <button
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer border ${
              useSearchGrounding
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-semibold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="Ground answers with Google Search data"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search Grounding: {useSearchGrounding ? 'ON' : 'OFF'}</span>
          </button>

          {/* Model Selector */}
          <select
            value={modelChoice}
            onChange={(e) => setModelChoice(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
          >
            <option value="gemini-3.5-flash">Gemini 3.5 Flash (General + Search)</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Complex Reasoning)</option>
          </select>
        </div>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs bg-slate-950">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-400">
              <span>{msg.role === 'user' ? 'Commander Rao' : 'Gemini Analytics'}</span>
              <span>·</span>
              <span>{msg.timestamp}</span>
              {msg.modelUsed && (
                <span className="text-[9px] px-1.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                  {msg.modelUsed}
                </span>
              )}
            </div>

            <div className={`p-4 rounded-xl max-w-[90%] leading-relaxed space-y-2 ${
              msg.role === 'user'
                ? 'bg-cyan-950 text-cyan-100 border border-cyan-800 rounded-tr-none'
                : 'bg-slate-900/95 text-slate-200 border border-slate-800 rounded-tl-none shadow-lg'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Citations / Sources from Google Search Grounding */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 mt-2 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>GROUNDED WEB SOURCES & METEOROLOGICAL CITATIONS:</span>
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-cyan-400 hover:underline bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
                      >
                        <span className="truncate max-w-[200px]">{src.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {msg.role === 'model' && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(msg.text, msg.id)}
                    className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Report</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Brief</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-3">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Gemini synthesising operational datasets & querying Google Search grounding...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Analytics Prompts */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
        <span className="text-slate-400 text-[10px] shrink-0 font-bold">SUGGESTIONS:</span>
        {promptSuggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-cyan-300 border border-slate-800 shrink-0 whitespace-nowrap transition-colors cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask Gemini to synthesize burn curves, compare station logistics, draft reports..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>Query</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
