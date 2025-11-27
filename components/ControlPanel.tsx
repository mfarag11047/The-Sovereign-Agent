import React from 'react';
import { UserPsychology, Phase } from '../types';
import { Shield, Skull, RefreshCcw, ChevronsUp } from 'lucide-react';

interface ControlPanelProps {
  stats: UserPsychology;
  updateStats: (newStats: Partial<UserPsychology>) => void;
  reset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ stats, updateStats, reset }) => {
  const getPhaseFromScore = (score: number): Phase => {
    if (score > 80) return Phase.SOVEREIGN;
    if (score > 55) return Phase.REVEAL;
    if (score > 30) return Phase.FRICTION;
    return Phase.CONSUMER;
  };

  const adjustScore = (amount: number) => {
    const newScore = Math.min(100, Math.max(0, stats.receptivityScore + amount));
    updateStats({
      receptivityScore: newScore,
      currentPhase: getPhaseFromScore(newScore)
    });
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur border border-gray-700 p-2 rounded-xl flex items-center gap-4 text-white shadow-2xl z-50">
      <div className="text-xs font-bold text-gray-500 uppercase px-2 border-r border-gray-700">
        God Mode
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => adjustScore(10)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-900/50 hover:bg-blue-800 rounded border border-blue-800 text-xs transition"
          title="Simulate successful interaction"
        >
          <ChevronsUp className="w-3 h-3" /> +10 Trust
        </button>

        <button 
          onClick={() => {
            updateStats({ receptivityScore: 60, currentPhase: Phase.REVEAL });
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-orange-900/50 hover:bg-orange-800 rounded border border-orange-800 text-xs transition"
          title="Force Phase 3"
        >
          <Shield className="w-3 h-3" /> Red Pill
        </button>

        <button 
          onClick={() => {
            updateStats({ receptivityScore: 90, currentPhase: Phase.SOVEREIGN });
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-900/50 hover:bg-red-800 rounded border border-red-800 text-xs transition"
          title="Force Phase 4"
        >
          <Skull className="w-3 h-3" /> Sovereign
        </button>

        <div className="w-px bg-gray-700 mx-1"></div>

        <button 
          onClick={reset}
          className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition"
          title="Reset System"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;