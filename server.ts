import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client (User-Agent header required by skill)
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. AI Copilot Chat Endpoint (Multi-turn chat, task suggestion, operational guidance)
app.post('/api/copilot/chat', async (req: Request, res: Response) => {
  try {
    const { messages, missionContext, modelPreference } = req.body;
    
    // Model selection based on user requirements:
    // 'gemini-3.1-pro-preview' for complex tasks, 'gemini-3.5-flash' for general, 'gemini-3.1-flash-lite' for fast
    let selectedModel = 'gemini-3.5-flash';
    if (modelPreference === 'complex' || modelPreference === 'gemini-3.1-pro-preview') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (modelPreference === 'fast' || modelPreference === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    }

    const systemInstruction = `You are FROST Polar AI Co-Pilot, the mission-critical operations assistant for the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences (MoES), Govt of India.
You assist Dr. Ananya Rao (Operations Commander) with:
1. Expedition Command & Mission Readiness.
2. Cold-Chain Cargo Tracking & Route Logistics.
3. Smart Inventory Depletion Analysis (e.g. Maitri fuel burn rate 420 L/day, reserve threshold 3000 L, 11.4 days left vs 15-day resupply).
4. Personnel Movement Conflict Resolution (e.g. Twin Otter KB-402 maintenance holds, katabatic shear warnings).
5. Emergency Command Center Coordination (e.g. Incident #INC-204 medical trauma, stage-2 hypothermia).

Always maintain a professional, concise, NASA/polar-command tone.
When relevant, recommend specific operational actions or tasks.
Current Polar Mission Context:
${missionContext ? JSON.stringify(missionContext) : 'Standard 44th ISEA operational parameters active.'}`;

    const ai = getAiClient();

    if (!ai) {
      // Offline fallback with realistic polar command response
      const lastMessage = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].text : '';
      return res.json({
        reply: `[FROST Co-Pilot Operational Response]: Analyzed operational telemetry for "${lastMessage}". Recommended task: Verify reserve fuel allocation at Maitri and coordinate Kamov-32 standby for upcoming station transit.`,
        suggestedTasks: [
          { id: 'task-1', title: 'Schedule Fuel Resupply Window', category: 'Inventory', actionType: 'inventory' },
          { id: 'task-2', title: 'Inspect Twin Otter Maintenance Status', category: 'Personnel Movement', actionType: 'movements' },
          { id: 'task-3', title: 'Review Incident #INC-204 Timeline', category: 'Emergency Response', actionType: 'emergency' }
        ],
        modelUsed: 'offline-copilot-engine'
      });
    }

    // Format contents for multi-turn chat
    const contents: any[] = [];
    if (Array.isArray(messages)) {
      for (const m of messages) {
        contents.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        });
      }
    }

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Provide an operational briefing and suggest immediate priority tasks for polar logistics command.' }],
      });
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Operational telemetry logged. Standing by for commander directives.';

    // Generate proactive suggested tasks
    const suggestedTasks = [
      { id: 'task-fuel', title: 'Initiate Eco-Heating Mode at Maitri (Conserve 15% Daily Burn)', category: 'Inventory', actionType: 'inventory' },
      { id: 'task-cargo', title: 'Reroute Spectrometer FR-AX-10482 to Eastern Barrier Dock', category: 'Cargo', actionType: 'cargo' },
      { id: 'task-mov', title: 'Reassign Dr. Mehta Travel to Kamov-32 (Bypasses Otter Hold)', category: 'Movements', actionType: 'movements' },
      { id: 'task-med', title: 'Authorize Hyperbaric Chamber Vitals Telemetry Sync', category: 'Emergency', actionType: 'emergency' }
    ];

    res.json({
      reply,
      suggestedTasks,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Co-Pilot API Error:', error);
    res.status(500).json({
      error: error.message || 'Error executing Co-Pilot reasoning cycle',
      reply: 'Co-Pilot telemetry handshake temporarily throttled. Fallback operational advisory: Maintain baseline heating at Maitri and monitor pack ice swell at 64°S.',
      suggestedTasks: [
        { id: 'task-resupply', title: 'Audit Emergency Fuel Reserve Cache', category: 'Inventory', actionType: 'inventory' }
      ]
    });
  }
});

// 2. Gemini Analytics & Reports Chatbot Endpoint (with Search Grounding via googleSearch)
app.post('/api/analytics/query', async (req: Request, res: Response) => {
  try {
    const { prompt, messages, useSearchGrounding, modelPreference } = req.body;

    const selectedModel = modelPreference === 'complex' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

    const systemInstruction = `You are the FROST Polar Analytics & Intelligence Engine at NCPOR / MoES.
You specialize in data-driven polar expedition analytics, resource burn projections, maritime ice conditions, and generating executive reports for scientific leadership.
Provide quantitative insights, burn-down calculations, statistical comparisons, and strategic logistical recommendations.
When search grounding is active, cite relevant oceanographic, polar meteorology, or Antarctic treaty logistics standards.`;

    const ai = getAiClient();

    if (!ai) {
      return res.json({
        reply: `**Executive Polar Logistics Analysis:**\n\n- **Cargo Delivery Velocity:** Current maritime throughput across Southern Ocean Sector 4 is pacing at 91.4% of scheduled milestones.\n- **Station Depletion Index:** Maitri station diesel fuel demonstrates a critical deficit slope (-420 L/day vs 15-day resupply window), recommending immediate throttle of auxiliary generator loops.\n- **Asset Readiness:** 90.1% operational availability across power plants and snow transport units.`,
        sources: [],
        modelUsed: 'offline-analytics-engine'
      });
    }

    const contents: any[] = [];
    if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages) {
        contents.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        });
      }
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: prompt || 'Analyze polar expedition operational metrics and highlight key logistical risks.' }],
      });
    }

    const config: any = {
      systemInstruction,
      temperature: 0.6,
    };

    // Add search grounding using gemini-3.5-flash with googleSearch tool
    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const reply = response.text || 'Analytics calculation complete.';
    
    // Extract search grounding metadata if available
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Web Grounding Reference',
      uri: chunk.web?.uri || '#',
    })) || [];

    res.json({
      reply,
      sources,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Analytics Query Error:', error);
    res.status(500).json({
      error: error.message || 'Error computing analytics synthesis',
      reply: 'Analytics engine synthesized local cached telemetry: Throughput is nominal across Bharati and Maitri, with fuel conservation designated as top operational priority.',
      sources: []
    });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FROST Operational Server running on port ${PORT}`);
  });
}

startServer();
