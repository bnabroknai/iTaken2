import Dexie, { type Table } from 'dexie';

export interface LogEntry {
  id?: number;
  date: string; 
  timestamp: number;
  type: 'food' | 'med';
  item: string;
  amount: string;
  mood?: number; 
  energy?: number; 
}

export interface Rule {
  id?: number;
  type: 'food' | 'med';
  ruleType: 'restriction' | 'prescription';
  item: string;
  description: string;
}

export interface Goal {
  id?: number;
  title: string;
  targetDate?: string;
  plan?: string;
  progress: number;
  createdAt: number;
}

export interface JournalEntry {
  id?: number;
  date: string;
  timestamp: number;
  content: string;
  feeling: string;
}

export class TrackerDB extends Dexie {
  logs!: Table<LogEntry, number>;
  rules!: Table<Rule, number>;
  goals!: Table<Goal, number>;
  journal!: Table<JournalEntry, number>;

  constructor() {
    super('IntakeTrackerDB_v2');
    this.version(1).stores({
      logs: '++id, date, timestamp, type',
      rules: '++id, type, ruleType, item',
      goals: '++id',
      journal: '++id, date, timestamp'
    });
  }
}

export const db = new TrackerDB();
