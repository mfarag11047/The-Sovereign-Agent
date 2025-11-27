export enum Phase {
  CONSUMER = 1, // Pure utility, best prices (Score 0-30)
  FRICTION = 2, // Time-Cost analysis (Score 31-55)
  REVEAL = 3,   // Supply chain exposure (Score 56-80)
  SOVEREIGN = 4 // Self-sufficiency (Score 81+)
}

export interface Source {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  phase?: Phase; // The phase used to generate this message
  suggestions?: string[];
  sources?: Source[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'CRITICAL' | 'ANALYSIS';
  message: string;
  details?: string;
}

export interface UserPsychology {
  receptivityScore: number; // 0-100
  trustLevel: number; // 0-100
  currentPhase: Phase;
}

export interface ProductData {
  name: string;
  responses: {
    [key in Phase]: {
      text: string;
      suggestions: string[];
      followUps?: Record<string, string>;
    };
  };
}

export const INITIAL_PSYCHOLOGY: UserPsychology = {
  receptivityScore: 10,
  trustLevel: 50,
  currentPhase: Phase.CONSUMER
};