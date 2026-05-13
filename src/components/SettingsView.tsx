import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Rule } from '../lib/db';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export function SettingsView() {
  const rules = useLiveQuery(() => db.rules.toArray());
  const [type, setType] = useState<'food' | 'med'>('food');
  const [ruleType, setRuleType] = useState<'restriction' | 'prescription'>('restriction');
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (!item) return;
    await db.rules.add({
      type,
      ruleType,
      item,
      description
    });
    setItem('');
    setDescription('');
  };

  const handleDelete = async (id?: number) => {
    if (id) await db.rules.delete(id);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-6">
      <div className="flex items-center space-x-2 text-rose-600 mb-4">
        <ShieldAlert className="w-5 h-5" />
        <h2 className="text-xl font-semibold text-slate-800">Rules & Requirements</h2>
      </div>
      
      <p className="text-sm text-slate-500 mb-6">
        Log things you need to restrict (e.g., Sodium) and things you are prescribed (e.g., 20mg a day) to help the AI generate safer, tailored plans.
      </p>

      <div className="space-y-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex bg-slate-200/50 p-1 rounded-lg">
          <button
            onClick={() => setType('food')}
            className={cn("flex-1 py-1.5 rounded-md text-sm font-medium transition-colors", type === 'food' ? 'bg-white shadow text-slate-800' : 'text-slate-500')}
          >
            Food/Nutrient
          </button>
          <button
            onClick={() => setType('med')}
            className={cn("flex-1 py-1.5 rounded-md text-sm font-medium transition-colors", type === 'med' ? 'bg-white shadow text-slate-800' : 'text-slate-500')}
          >
            Medication
          </button>
        </div>

        <div className="flex space-x-4 px-1">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="radio" 
              checked={ruleType === 'restriction'} 
              onChange={() => setRuleType('restriction')} 
              className="w-4 h-4 text-rose-600 border-slate-300 focus:ring-rose-500"
            />
            <span className="text-sm font-medium text-slate-700">Restriction / Limit</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="radio" 
              checked={ruleType === 'prescription'} 
              onChange={() => setRuleType('prescription')} 
              className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">Required / Prescribed</span>
          </label>
        </div>

        <div>
          <input 
            type="text" 
            placeholder={type === 'food' ? "e.g., Salt, Sugar" : "e.g., Tylenol, Lisinopril"}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
        </div>
        
        <div>
          <input 
            type="text" 
            placeholder={ruleType === 'restriction' ? "Limit (e.g., < 1500mg, only 2/day)" : "Requirement (e.g., 20mg daily, eat with meals)"}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button 
          onClick={handleAdd}
          disabled={!item}
          className={cn(
            "w-full disabled:opacity-50 font-medium py-3 rounded-xl flex justify-center items-center space-x-2 transition-colors",
            ruleType === 'restriction' ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          )}
        >
          <Plus className="w-4 h-4" />
          <span>Add {ruleType === 'restriction' ? 'Restriction' : 'Prescription'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {rules?.map(r => (
          <div key={r.id} className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <div>
              <div className="flex items-center space-x-2">
                <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0", r.type === 'food' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700')}>
                  {r.type}
                </span>
                <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0", r.ruleType === 'restriction' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')}>
                  {r.ruleType === 'restriction' ? 'Limit/Allergy' : 'Requirement'}
                </span>
                <span className="font-semibold text-slate-800 line-clamp-1">{r.item}</span>
              </div>
              {r.description && <p className="text-sm text-slate-500 mt-1">{r.description}</p>}
            </div>
            <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-full shrink-0 ml-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {rules?.length === 0 && (
          <div className="text-center text-slate-400 py-4 text-sm">
            No rules or requirements added yet.
          </div>
        )}
      </div>
    </div>
  );
}
