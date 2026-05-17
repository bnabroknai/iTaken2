import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Heart, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export function JournalSlots() {
  const [feeling, setFeeling] = useState<string | null>(null);
  const [painLevel, setPainLevel] = useState(0);
  
  const entries = useLiveQuery(() => db.journal.orderBy('timestamp').reverse().limit(5).toArray());

  const handleSave = async (selectedFeeling: string) => {
    await db.journal.add({
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      content: selectedFeeling === 'Pain' ? `Reported pain level: ${painLevel}/10` : `Feeling ${selectedFeeling}`,
      feeling: selectedFeeling
    });
    setFeeling(null);
    setPainLevel(0);
  };

  const moods = [
    { label: 'Great', icon: '😊', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { label: 'Okay', icon: '😐', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    { label: 'Not Good', icon: '😔', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  ];

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center space-x-3 text-primary mb-6 px-2">
        <Heart className="w-8 h-8 fill-current" />
        <h2 className="text-3xl font-black">How I Feel</h2>
      </div>

      <div className="flex flex-col gap-4">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => handleSave(mood.label)}
            className={cn(
              "w-full p-6 rounded-3xl border-4 flex items-center justify-between active:scale-95 transition-transform shadow-md",
              mood.color
            )}
          >
            <span className="text-5xl">{mood.icon}</span>
            <span className="text-3xl font-black uppercase">{mood.label}</span>
            <div className="w-10 h-10 rounded-full border-4 border-current flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-current opacity-0 transition-opacity" />
            </div>
          </button>
        ))}

        <div className="mt-4 p-6 bg-red-50 border-4 border-alert rounded-3xl shadow-lg">
          <div className="flex items-center space-x-3 text-alert mb-4">
            <Activity className="w-8 h-8" />
            <h3 className="text-2xl font-black uppercase">Report Pain</h3>
          </div>
          <input
            type="range" min="0" max="10" value={painLevel}
            onChange={(e) => setPainLevel(Number(e.target.value))}
            className="w-full h-16 accent-alert"
          />
          <div className="flex justify-between text-xl font-bold text-alert mt-2">
            <span>No Pain</span>
            <span className="text-3xl font-black">{painLevel} / 10</span>
            <span>Severe</span>
          </div>
          <button
            onClick={() => handleSave('Pain')}
            className="w-full mt-6 bg-alert text-white py-5 rounded-2xl text-2xl font-black shadow-xl active:scale-95 transition-transform"
          >
            LOG PAIN LEVEL
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-bold text-slate-500 px-2">Recent Status</h3>
        {entries?.map(entry => (
          <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border-2 border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-400 uppercase">
                {format(entry.timestamp, 'MMM d, h:mm a')}
              </span>
              <span className="text-xl font-black text-slate-800">{entry.content}</span>
            </div>
            {entry.feeling === 'Great' && <span className="text-3xl">😊</span>}
            {entry.feeling === 'Okay' && <span className="text-3xl">😐</span>}
            {entry.feeling === 'Not Good' && <span className="text-3xl">😔</span>}
            {entry.feeling === 'Pain' && <CheckCircle2 className="w-8 h-8 text-alert" />}
          </div>
        ))}
      </div>
    </div>
  );
}
