import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Sparkles, ArrowRight, Link as LinkIcon, ExternalLink, Clock, AlertTriangle, Hammer, CheckCircle2 } from 'lucide-react';
import { Message, Phase } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

// --- Custom Markdown Renderer ---
const FormattedMessage = ({ text, isUser }: { text: string, isUser: boolean }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const parseBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className={`font-bold ${isUser ? 'text-white' : 'text-gray-900'}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(
        <li key={`li-${index}`} className="flex items-start gap-2 mb-1.5">
          <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isUser ? 'bg-blue-200' : 'bg-blue-500'}`} />
          <span className={`leading-relaxed ${isUser ? 'text-blue-50' : 'text-gray-700'}`}>
            {parseBold(trimmed.substring(2))}
          </span>
        </li>
      );
    } else {
      // Flush list if exists
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${index}`} className="mb-4 pl-1">{currentList}</ul>);
        currentList = [];
      }

      if (trimmed.startsWith('###')) {
        elements.push(
          <h3 key={`h3-${index}`} className={`text-base font-bold mt-5 mb-2 ${isUser ? 'text-white' : 'text-gray-900'}`}>
            {trimmed.replace(/^###\s/, '')}
          </h3>
        );
      } else if (trimmed !== '') {
        elements.push(
          <p key={`p-${index}`} className={`mb-3 leading-relaxed ${isUser ? 'text-blue-50' : 'text-gray-700'}`}>
            {parseBold(trimmed)}
          </p>
        );
      }
    }
  });

  if (currentList.length > 0) {
    elements.push(<ul key={`ul-end`} className="mb-4 pl-1">{currentList}</ul>);
  }

  return <div>{elements}</div>;
};

// --- Phase Specific Widgets ---
const PhaseWidget = ({ phase }: { phase?: Phase }) => {
  if (!phase || phase === Phase.CONSUMER) return null;

  if (phase === Phase.FRICTION) {
    return (
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2 text-yellow-800 font-semibold text-xs uppercase tracking-wide">
          <Clock className="w-3 h-3" /> Time-Cost Analysis
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-yellow-900">
            <span>Labor Equivalence</span>
            <span className="font-bold">High Impact</span>
          </div>
          <div className="w-full bg-yellow-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full w-[65%] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (phase === Phase.REVEAL) {
    return (
      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2 text-red-800 font-semibold text-xs uppercase tracking-wide">
          <AlertTriangle className="w-3 h-3" /> Supply Chain Risk
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
           <div className="bg-white p-2 rounded border border-red-100 flex flex-col items-center justify-center text-center">
             <span className="text-red-400 text-[10px]">Ethics Score</span>
             <span className="font-bold text-red-700 text-lg">D-</span>
           </div>
           <div className="bg-white p-2 rounded border border-red-100 flex flex-col items-center justify-center text-center">
             <span className="text-red-400 text-[10px]">Lobbying</span>
             <span className="font-bold text-red-700 text-lg">$40M+</span>
           </div>
        </div>
      </div>
    );
  }

  if (phase === Phase.SOVEREIGN) {
    return (
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2 text-green-800 font-semibold text-xs uppercase tracking-wide">
          <Hammer className="w-3 h-3" /> Autonomy Metric
        </div>
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-xs text-green-900">
             <CheckCircle2 className="w-3 h-3 text-green-600" />
             <span>Repairable: <strong className="text-green-700">100%</strong></span>
           </div>
           <div className="flex items-center gap-2 text-xs text-green-900">
             <CheckCircle2 className="w-3 h-3 text-green-600" />
             <span>Local Sourcing: <strong className="text-green-700">Available</strong></span>
           </div>
        </div>
      </div>
    );
  }

  return null;
};


const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping }) => {
  const [inputText, setInputText] = React.useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const getAgentAvatarColor = (phase?: Phase) => {
    if (!phase) return "bg-blue-600";
    if (phase >= Phase.SOVEREIGN) return "bg-red-600";
    if (phase >= Phase.REVEAL) return "bg-orange-500";
    if (phase >= Phase.FRICTION) return "bg-purple-600";
    return "bg-blue-600";
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white mr-3">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-semibold text-gray-800">Nova Assistant</h1>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Bot className="w-12 h-12 mb-4 opacity-20" />
            <p>Ask me about any product...</p>
            <div className="flex gap-2 mt-4">
              {["Is Coke Zero good?", "Should I buy an iPhone?", "Nike shoes review"].map(q => (
                <button 
                  key={q}
                  onClick={() => onSendMessage(q)}
                  className="text-xs bg-white border px-3 py-1 rounded-full hover:bg-gray-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Message Bubble */}
            <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mx-2 ${
                msg.sender === 'user' ? 'bg-gray-200' : getAgentAvatarColor(msg.phase)
              } text-white`}>
                {msg.sender === 'user' ? <User className="w-5 h-5 text-gray-600" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 rounded-tl-none'
                }`}>
                  <FormattedMessage text={msg.text} isUser={msg.sender === 'user'} />
                  
                  {/* Phase Specific Widgets (Only for Agent) */}
                  {msg.sender === 'agent' && <PhaseWidget phase={msg.phase} />}
                </div>

                {/* Sources / Citations */}
                {msg.sender === 'agent' && msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-1">
                    {msg.sources.map((source, idx) => (
                      <a 
                        key={`${msg.id}-src-${idx}`}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 rounded-md transition-colors border border-gray-200 max-w-[200px]"
                      >
                        <LinkIcon className="w-3 h-3 shrink-0" />
                        <span className="truncate">{source.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Suggestions Buttons */}
            {msg.sender === 'agent' && msg.suggestions && msg.suggestions.length > 0 && (
              <div className="ml-14 mt-2 flex flex-wrap gap-2 animate-pulse-fast-once">
                {msg.suggestions.map((suggestion, idx) => (
                  <button
                    key={`${msg.id}-sug-${idx}`}
                    onClick={() => onSendMessage(suggestion)}
                    className="text-xs bg-white border border-blue-100 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-1 shadow-sm group"
                  >
                    {suggestion}
                    <ArrowRight className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
             <div className="flex items-center gap-2 ml-12">
               <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about a product..."
            className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-800"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">
                AI can make mistakes. Please check important info.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;