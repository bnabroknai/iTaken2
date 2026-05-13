import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { generateGoalPlan } from '../lib/gemini';
import { Target, Sparkles, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

export function GoalsView() {
  const goals = useLiveQuery(() => db.goals.orderBy('id').reverse().toArray());
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title) return;
    setLoading(true);
    const plan = await generateGoalPlan(title, targetDate);
    await db.goals.add({
      title,
      targetDate,
      plan,
      progress: 0,
      createdAt: Date.now()
    });
    setLoading(false);
    setTitle('');
    setTargetDate('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-6">
      <div className="flex items-center space-x-2 text-indigo-600 mb-6">
        <Target className="w-5 h-5" />
        <h2 className="text-xl font-semibold text-slate-800">Goals & AI Plans</h2>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100 mb-8">
        <h3 className="font-medium text-indigo-900 mb-3">Add a New Goal</h3>
        <input 
          type="text" 
          placeholder="e.g., Reduce sodium intake by 50%"
          className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-400 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input 
          type="date" 
          className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-400 text-slate-600 mb-4"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        
        <button 
          onClick={handleGenerate}
          disabled={!title || loading}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-medium py-3.5 rounded-xl flex justify-center items-center space-x-2 shadow-md shadow-indigo-200 transition-all active:scale-[0.98]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>Generate Plan with AI</span>
        </button>
        <p className="text-xs text-indigo-400 text-center mt-3">
          AI will generate a plan based on your offline restrictions and logs. Requires internet.
        </p>
      </div>

      <div className="space-y-6">
        {goals?.map((g) => (
          <div key={g.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-slate-800 text-lg mb-1">{g.title}</h3>
            {g.targetDate && <p className="text-sm text-slate-500 mb-4">Target: {new Date(g.targetDate).toLocaleDateString()}</p>}
            
            <div className="bg-white rounded-xl p-4 border border-slate-200 max-h-60 overflow-y-auto mt-2 text-sm text-slate-700 prose prose-sm prose-indigo">
              <Markdown>{g.plan || ''}</Markdown>
            </div>
          </div>
        ))}
        {goals?.length === 0 && (
          <div className="text-center text-slate-400 py-4 text-sm">
            No goals set. Create one to get an AI-generated plan.
          </div>
        )}
      </div>
    </div>
  );
}
