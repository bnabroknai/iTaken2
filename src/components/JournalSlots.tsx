import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { BookOpen, Send, Mic } from 'lucide-react';
import { useSpeechDictation } from '../hooks/useSpeechDictation';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export function JournalSlots() {
  const [content, setContent] = useState('');
  const [feeling, setFeeling] = useState('');
  const { isListening, transcript, toggleListening, setTranscript } = useSpeechDictation();
  
  const entries = useLiveQuery(() => db.journal.orderBy('timestamp').reverse().limit(10).toArray());

  // Auto-fill from voice
  if (transcript) {
    setContent(prev => prev ? prev + ' ' + transcript : transcript);
    setTranscript('');
  }

  const handleSave = async () => {
    if (!content) return;
    await db.journal.add({
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      content,
      feeling: feeling || 'Neutral'
    });
    setContent('');
    setFeeling('');
  };

  return (
    <div className="mt-6 mb-6">
      <div className="flex items-center space-x-2 text-teal-700 mb-4 px-2">
        <BookOpen className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Daily Reflections</h2>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
        <input 
          type="text"
          placeholder="How are you feeling overall? (e.g., Tired, Great, Anxious)"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        />
        <div className="relative">
          <textarea
            placeholder="Type or dictate your reflection for the day..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={toggleListening}
            className={cn(
              "absolute bottom-3 right-3 p-2 rounded-full transition-all",
              isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-200 text-slate-500"
            )}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!content}
          className="bg-teal-600 text-white rounded-xl py-3 font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>Save Entry</span>
        </button>  
      </div>

      <div className="mt-4 space-y-3">
        {entries?.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {format(entry.timestamp, 'MMM d, h:mm a')}
              </span>
              <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full">
                {entry.feeling}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
