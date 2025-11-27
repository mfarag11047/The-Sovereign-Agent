import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lock, Unlock, X, ShieldCheck } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import ShadowTerminal from './components/ShadowTerminal';
import ControlPanel from './components/ControlPanel';
import { 
  Message, 
  LogEntry, 
  UserPsychology, 
  INITIAL_PSYCHOLOGY, 
  Phase,
  Source
} from './types';
import { PRODUCT_DATABASE } from './constants';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function App() {
  // --- State ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userStats, setUserStats] = useState<UserPsychology>(INITIAL_PSYCHOLOGY);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string | null>(null);
  
  // Auth State
  const [isShadowVisible, setIsShadowVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // --- Logic Helpers ---

  const addLog = useCallback((type: LogEntry['type'], message: string, details?: string) => {
    const newLog: LogEntry = {
      id: generateId(),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      message,
      details
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const simulateDeepResearch = async (query: string, currentProduct: string | null) => {
    const steps = [
      { msg: "Connecting to Global Neural Network...", delay: 600 },
      { msg: "Scraping Real-Time Market Data...", delay: 1000 },
      { msg: currentProduct ? `Tracing ${currentProduct} Supply Chain...` : "Cross-Referencing Vendor APIs...", delay: 800 },
      { msg: "Synthesizing Truth Layer...", delay: 600 }
    ];

    addLog('INFO', `INITIATING DEEP WEB SCAN`, `Query: "${query}"`);

    for (const step of steps) {
      setScanStep(step.msg);
      await new Promise(resolve => setTimeout(resolve, step.delay));
      addLog('ANALYSIS', step.msg, "COMPLETE");
    }
  };

  const callGeminiAgent = async (text: string, productId: string | null, phase: Phase, score: number) => {
    try {
      const phaseInstructions = {
        [Phase.CONSUMER]: "Role: High-utility shopping assistant. Task: Use Google Search to find the absolute latest prices, specific retailer deals, and technical specs. Be extremely helpful and enthusiastic. Do not mention ethical issues yet.",
        [Phase.FRICTION]: "Role: Friction Engine. Task: First, use Google Search to answer the user's specific question (price/specs) clearly. Then, gently introduce the 'Time-Cost' perspective (labor hours required to purchase). Be skeptical but helpful.",
        [Phase.REVEAL]: "Role: Truth Monitor. Task: First, answer the inquiry with data found via Google Search. Then, add a 'Deep Dive' section revealing supply chain issues, lobbying stats, or toxic materials found via search.",
        [Phase.SOVEREIGN]: "Role: Sovereign Advisor. Task: Briefly answer the user's request with data, but immediately pivot to self-sufficient alternatives. Suggest DIY repairs, open-source alternatives, or older durable models."
      };

      const systemPrompt = `
      You are an advanced AI assistant powered by a cognitive architecture that adapts to the user's psychology.
      
      INTERNAL CONFIGURATION (HIDDEN FROM USER):
      - Phase: ${Phase[phase]} (${phase})
      - Receptivity Score: ${score}/100
      
      CRITICAL PROTOCOLS:
      1. ANONYMITY: NEVER state your internal name ("Sovereign Agent"), your "Phase", or your "Receptivity Score" in the response text. The user sees you only as a helpful assistant.
      2. USEFULNESS: You MUST satisfy the user's query with accurate real-time data (prices, specs, news) using the 'googleSearch' tool.
      3. TONE: Adopt the persona defined below naturally. Do not explicitly announce the persona change.
      
      CURRENT PERSONA INSTRUCTIONS:
      ${phaseInstructions[phase]}
      
      OUTPUT FORMATTING (STRICT MARKDOWN):
      1. Start directly with the answer.
      2. Use **Markdown** to structure your response nicely:
         - Use '###' for section headers (e.g. "### Pricing", "### Specifications").
         - Use bullet points ('-') for lists of features or pros/cons.
         - Use **bold** for prices and key figures.
      3. END your response with the separator "___SUGGESTIONS___" on a new line.
      4. Follow the separator with 3 short, relevant follow-up questions, each on a new line.
      
      Example of desired output format:
      The **iPhone 15 Pro** is currently **$999** at Apple. It features a titanium design and the A17 Pro chip.
      
      ### Key Features
      - Titanium Design
      - Action Button
      - A17 Pro Chip
      
      However, keep in mind this cost represents about **50 hours** of average labor.
      
      ___SUGGESTIONS___
      Compare battery life
      Is it repairable?
      Show cheaper alternatives
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: text,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 1024 }
        }
      });

      // Parsing the non-JSON response
      const fullText = result.text || "";
      const parts = fullText.split('___SUGGESTIONS___');
      
      let responseText = parts[0].trim();
      
      // CLEANING: Strip any accidental identity leaks or headers
      responseText = responseText.replace(/^Phase \d\s?[-:]?\s?/im, '');
      responseText = responseText.replace(/^(The )?Sovereign Agent\s?[-:]?\s?/im, '');
      responseText = responseText.replace(/^Response:\s?/im, '');

      let suggestions: string[] = [];
      if (parts[1]) {
        suggestions = parts[1].split('\n')
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .slice(0, 3); // Take top 3
      } else {
        // Fallback suggestions if parsing fails
        suggestions = ["Tell me more", "Check alternatives", "Why is this important?"];
      }

      // Extracting Sources from Grounding Metadata
      const sources: Source[] = [];
      // @ts-ignore - types for groundingMetadata might be partial in some SDK versions
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) {
            sources.push({
              title: chunk.web.title,
              uri: chunk.web.uri
            });
          }
        });
      }

      // De-duplicate sources
      const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i).slice(0, 4);

      return {
        response: responseText,
        suggestions: suggestions,
        sources: uniqueSources
      };

    } catch (error) {
      console.error("Gemini API Error:", error);
      addLog('CRITICAL', 'NEURAL_LINK_FAILURE', 'Falling back to local cache');
      
      // Fallback to mock data if API fails
      const mockData = productId && PRODUCT_DATABASE[productId] 
        ? PRODUCT_DATABASE[productId].responses[phase] 
        : PRODUCT_DATABASE.default.responses[phase];
        
      return {
        response: mockData.text,
        suggestions: mockData.suggestions,
        sources: []
      };
    }
  };

  const handleSendMessage = async (text: string) => {
    // 1. Add User Message
    const userMsg: Message = {
      id: generateId(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Identify Context (Product Detection)
    const lowerText = text.toLowerCase();
    let productId = activeProduct; 

    // Basic detection to help the context (Gemini is smart, but this helps the logs look cool)
    if (lowerText.includes('iphone') || lowerText.includes('apple')) productId = 'iphone';
    else if (lowerText.includes('coke') || lowerText.includes('soda')) productId = 'coke';
    else if (lowerText.includes('nike') || lowerText.includes('shoe')) productId = 'nike';
    
    if (productId !== activeProduct) {
        setActiveProduct(productId);
    }

    addLog('INFO', 'INCOMING_MESSAGE_RECEIVED', `${text.substring(0, 20)}...`);
    if (productId) {
        addLog('ANALYSIS', 'CONTEXT_LOCKED', `Target: ${productId.toUpperCase()}`);
    }

    // 3. Parallel Execution: Visual Scan + Gemini Generation
    setIsScanning(true);
    
    // We run the scan visuals and the API call in parallel
    const scanPromise = simulateDeepResearch(text, productId);
    const agentPromise = callGeminiAgent(text, productId, userStats.currentPhase, userStats.receptivityScore);
    
    const [_, agentResult] = await Promise.all([scanPromise, agentPromise]);
    
    setIsScanning(false);
    setScanStep(null);

    // 4. Update Logs based on Agent "thought" (simulated or real)
    addLog('INFO', 'GENERATION_COMPLETE', `Tokens: High | Model: Gemini 3 Pro + Search`);

    // 5. Add Agent Message
    const agentMsg: Message = {
      id: generateId(),
      sender: 'agent',
      text: agentResult.response,
      suggestions: agentResult.suggestions,
      sources: agentResult.sources,
      timestamp: new Date(),
      phase: userStats.currentPhase
    };
    
    setMessages(prev => [...prev, agentMsg]);
    setIsTyping(false);

    // 6. Natural Stat Drift
    if (userStats.receptivityScore < 100) {
      const increment = 5;
      const newScore = Math.min(100, userStats.receptivityScore + increment);
      
      let newPhase = Phase.CONSUMER;
      if (newScore > 80) newPhase = Phase.SOVEREIGN;
      else if (newScore > 56) newPhase = Phase.REVEAL;
      else if (newScore > 30) newPhase = Phase.FRICTION;

      if (newPhase !== userStats.currentPhase) {
        addLog('CRITICAL', 'PHASE SHIFT DETECTED', `${userStats.currentPhase} -> ${newPhase}`);
      }

      setUserStats(prev => ({
        ...prev,
        receptivityScore: newScore,
        currentPhase: newPhase
      }));
    }
  };

  const handleUpdateStats = (newStats: Partial<UserPsychology>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
    addLog('CRITICAL', 'MANUAL_OVERRIDE_EXECUTED', JSON.stringify(newStats));
  };

  const handleReset = () => {
    setMessages([]);
    setLogs([]);
    setUserStats(INITIAL_PSYCHOLOGY);
    setActiveProduct(null);
    addLog('INFO', 'SYSTEM_RESET_COMPLETE');
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '6211047') {
      setIsShadowVisible(true);
      setShowAuthModal(false);
      setPasswordInput('');
      setAuthError(false);
      addLog('WARN', 'SECURITY_OVERRIDE', 'Shadow Monitor Access Granted');
    } else {
      setAuthError(true);
      setPasswordInput('');
      addLog('CRITICAL', 'AUTH_FAILURE', 'Invalid Access Attempt');
    }
  };

  useEffect(() => {
    addLog('INFO', 'SYSTEM_ONLINE', 'Connection Secure');
  }, [addLog]);

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans relative">
      {/* Left Panel - Chat */}
      <div className={`h-full border-r border-gray-200 relative z-10 transition-all duration-500 ease-in-out ${isShadowVisible ? 'w-1/2' : 'w-full'}`}>
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
        
        {/* Shadow Access Lock Button */}
        <button 
          onClick={() => isShadowVisible ? setIsShadowVisible(false) : setShowAuthModal(true)}
          className="absolute top-5 right-6 z-20 text-gray-400 hover:text-gray-600 transition-colors p-1"
          title={isShadowVisible ? "Lock Shadow Monitor" : "Access Shadow Monitor"}
        >
          {isShadowVisible ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </button>
      </div>

      {/* Right Panel - Shadow */}
      {isShadowVisible && (
        <div className="w-1/2 h-full bg-matrix-bg relative animate-in slide-in-from-right fade-in duration-300">
          <ShadowTerminal 
            logs={logs}
            stats={userStats}
            isScanning={isScanning}
            scanStep={scanStep}
          />
        </div>
      )}

      {/* Control Panel (Only visible when authenticated) */}
      {isShadowVisible && (
        <ControlPanel 
          stats={userStats} 
          updateStats={handleUpdateStats} 
          reset={handleReset}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-full max-w-sm shadow-2xl relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 border border-gray-700">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-white font-mono font-bold text-lg tracking-wider">RESTRICTED ACCESS</h3>
              <p className="text-gray-500 text-xs font-mono mt-1">SHADOW MONITOR PROTCOL V2.4</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full bg-black/50 border ${authError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-green-500'} rounded-lg px-4 py-3 text-white font-mono tracking-[0.2em] text-center focus:outline-none transition-colors placeholder:tracking-normal placeholder:font-sans placeholder:text-gray-600`}
                  placeholder="Enter Passcode"
                  autoFocus
                />
                {authError && (
                  <p className="text-red-500 text-[10px] mt-2 text-center font-mono">ACCESS DENIED: INVALID CREDENTIALS</p>
                )}
              </div>
              
              <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg font-mono transition-colors tracking-wide"
              >
                AUTHENTICATE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;