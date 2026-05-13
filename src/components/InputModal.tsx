import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Check, Activity, Smile } from 'lucide-react';
import { db } from '../lib/db';
import { useSpeechDictation } from '../hooks/useSpeechDictation';
import { cn } from '../lib/utils';

interface InputModalProps {
  type: 'food' | 'med' | null;
  onClose: () => void;
}

export function InputModal({ type, onClose }: InputModalProps) {
  const { isListening, transcript, toggleListening, setTranscript } = useSpeechDictation();
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [includeMood, setIncludeMood] = useState(false);

  // Auto-fill from voice transcript
  useEffect(() => {
    if (transcript) {
      setItem(prev => prev ? prev + ' ' + transcript : transcript);
      setTranscript(''); // Clear so it doesn't duplicate
    }
  }, [transcript, setTranscript]);

  if (!type) return null;

  const handleSave = async () => {
    if (!item) return;
    
    await db.logs.add({
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      type,
      item,
      amount,
      ...(includeMood ? { mood, energy } : {})
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">
              Log {type === 'food' ? 'Food / Drink' : 'Medication'}
            </h2>
            <button onClick={onClose} className="p-2bg-slate-100 rounded-full text-slate-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Item Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder={type === 'food' ? "e.g., Apple, Salty Soup" : "e.g., Ibuprofen, Tylenol"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
                <button
                  onClick={toggleListening}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 right-2 p-2 rounded-full transition-all",
                    isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                  )}
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Amount / Dose</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={type === 'food' ? "e.g., 1 bowl, 200g" : "e.g., 200mg, 1 pill"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2 cursor-pointer mb-4">
                <input 
                  type="checkbox" 
                  checked={includeMood} 
                  onChange={(e) => setIncludeMood(e.target.checked)} 
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium text-sm">Log current mood & energy (optional)</span>
              </label>

              {includeMood && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                    <div className="flex items-center space-x-2 mb-3 text-orange-700">
                      <Smile className="w-5 h-5" />
                      <label className="font-medium">Mood</label>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={mood} 
                      onChange={(e) => setMood(Number(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                    <div className="text-center mt-1 font-bold text-orange-600">{mood}/10</div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <div className="flex items-center space-x-2 mb-3 text-emerald-700">
                      <Activity className="w-5 h-5" />
                      <label className="font-medium">Energy</label>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={energy} 
                      onChange={(e) => setEnergy(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <div className="text-center mt-1 font-bold text-emerald-600">{energy}/10</div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={!item}
              className="w-full bg-slate-900 text-white rounded-xl py-4 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              <Check className="w-5 h-5" />
              <span>Save Log</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
