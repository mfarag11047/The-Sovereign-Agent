import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Lock, ShieldAlert, Cpu, Terminal, Eye } from 'lucide-react';
import { LogEntry, UserPsychology, Phase } from '../types';

interface ShadowTerminalProps {
  logs: LogEntry[];
  stats: UserPsychology;
  isScanning: boolean;
  scanStep: string | null;
}

const ShadowTerminal: React.FC<ShadowTerminalProps> = ({ logs, stats, isScanning, scanStep }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getPhaseColor = (phase: Phase) => {
    switch(phase) {
      case Phase.CONSUMER: return "text-blue-400";
      case Phase.FRICTION: return "text-yellow-400";
      case Phase.REVEAL: return "text-orange-500";
      case Phase.SOVEREIGN: return "text-red-500";
      default: return "text-green-500";
    }
  };

  const getPhaseName = (phase: Phase) => {
    switch(phase) {
      case Phase.CONSUMER: return "PHASE 1: CONSUMER PROXY";
      case Phase.FRICTION: return "PHASE 2: FRICTION INJECTION";
      case Phase.REVEAL: return "PHASE 3: SYSTEM REVEAL";
      case Phase.SOVEREIGN: return "PHASE 4: SOVEREIGN EXIT";
    }
  };

  return (
    <div className="h-full bg-matrix-bg text-matrix-text font-mono p-4 flex flex-col border-l border-matrix-dim relative overflow-hidden">
      {/* Background Matrix Effect Overlay (Static for performance, could be canvas) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-matrix-bg pointer-events-none z-10"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-matrix-dim pb-2 z-20">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 animate-pulse" />
          <h2 className="text-lg font-bold tracking-widest">SHADOW_MONITOR_V2.4</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-matrix-dim">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          ONLINE
        </div>
      </div>

      {/* User Psychology Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 z-20">
        <div className="bg-matrix-dim/30 p-3 rounded border border-matrix-dim">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> RECEPTIVITY_SCORE
          </div>
          <div className="text-2xl font-bold flex items-end gap-2">
            {stats.receptivityScore}
            <span className="text-xs text-gray-500 mb-1">/ 100</span>
          </div>
          <div className="w-full bg-gray-800 h-1 mt-2">
            <motion.div 
              className="bg-green-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.receptivityScore}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        <div className="bg-matrix-dim/30 p-3 rounded border border-matrix-dim">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <Lock className="w-3 h-3" /> PROTOCOL_PHASE
          </div>
          <div className={`text-md font-bold ${getPhaseColor(stats.currentPhase)}`}>
            {getPhaseName(stats.currentPhase)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            LOGIC_GATE: {stats.currentPhase > 2 ? 'OPEN' : 'RESTRICTED'}
          </div>
        </div>
      </div>

      {/* Active Scan Visualization */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-black border border-green-500/50 p-4 rounded relative overflow-hidden z-20"
          >
            <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
            <div className="relative flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-400 font-bold uppercase">
                <Eye className="w-4 h-4 animate-spin" />
                Deep Research Active
              </div>
              <div className="font-mono text-sm text-green-300">
                {scanStep || "Initializing scan..."}
              </div>
              <div className="w-full bg-black h-2 rounded border border-green-900 mt-2">
                <motion.div 
                  className="bg-green-500 h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Logs */}
      <div className="flex-1 min-h-0 flex flex-col border border-matrix-dim rounded bg-black/50 z-20">
        <div className="p-2 bg-matrix-dim/50 text-xs font-bold border-b border-matrix-dim flex items-center gap-2">
          <Terminal className="w-3 h-3" /> SYSTEM_LOGS
        </div>
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-2 matrix-scroll"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2 opacity-90 hover:opacity-100">
              <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
              <span className={`font-bold shrink-0 ${
                log.type === 'CRITICAL' ? 'text-red-500' :
                log.type === 'WARN' ? 'text-yellow-500' :
                log.type === 'ANALYSIS' ? 'text-blue-400' : 'text-green-600'
              }`}>
                {log.type}
              </span>
              <span className="text-green-100 break-words">
                {log.message} {log.details && <span className="text-gray-500 italic block ml-2">{`> ${log.details}`}</span>}
              </span>
            </div>
          ))}
          <div className="h-4" /> {/* Spacer */}
        </div>
      </div>

    </div>
  );
};

export default ShadowTerminal;