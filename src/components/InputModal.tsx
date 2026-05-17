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
    setItem('');
    setAmount('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto border-t-8 border-primary"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-primary">
              Log {type === 'food' ? 'My Food' : 'My Medicine'}
            </h2>
            <button onClick={onClose} className="p-3 bg-slate-100 rounded-full text-slate-600 border-2 border-slate-200">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-xl font-bold text-slate-700 block mb-3">What was it?</label>
              <div className="relative">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder={type === 'food' ? "e.g., Apple" : "e.g., Aspirin"}
                  className="w-full bg-slate-50 border-4 border-slate-200 rounded-2xl px-6 py-5 pr-16 text-2xl font-medium focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  onClick={toggleListening}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 right-3 p-3 rounded-full transition-all border-2",
                    isListening ? "bg-alert text-white animate-pulse border-white" : "bg-slate-200 text-slate-700 border-slate-300"
                  )}
                  aria-label="Use Voice"
                >
                  <Mic className="w-7 h-7" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xl font-bold text-slate-700 block mb-3">How much?</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={type === 'food' ? "e.g., 1 bowl" : "e.g., 1 pill"}
                className="w-full bg-slate-50 border-4 border-slate-200 rounded-2xl px-6 py-5 text-2xl font-medium focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="pt-4 border-t-2 border-slate-100">
              <label className="flex items-center space-x-4 cursor-pointer mb-6">
                <input 
                  type="checkbox" 
                  checked={includeMood} 
                  onChange={(e) => setIncludeMood(e.target.checked)} 
                  className="w-8 h-8 text-primary rounded-lg border-4 border-slate-300 focus:ring-primary"
                />
                <span className="text-slate-800 font-bold text-lg text-left">Add how I feel now</span>
              </label>

              {includeMood && (
                <div className="grid grid-cols-1 gap-6 mb-4">
                  <div className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-200">
                    <div className="flex items-center space-x-3 mb-4 text-orange-800">
                      <Smile className="w-8 h-8" />
                      <label className="text-xl font-bold">Mood</label>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={mood} 
                      onChange={(e) => setMood(Number(e.target.value))}
                      className="w-full h-12 accent-orange-500"
                    />
                    <div className="text-center mt-2 text-2xl font-black text-orange-700">{mood} / 10</div>
                  </div>

                  <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-200">
                    <div className="flex items-center space-x-3 mb-4 text-emerald-800">
                      <Activity className="w-8 h-8" />
                      <label className="text-xl font-bold">Energy</label>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={energy} 
                      onChange={(e) => setEnergy(Number(e.target.value))}
                      className="w-full h-12 accent-emerald-500"
                    />
                    <div className="text-center mt-2 text-2xl font-black text-emerald-700">{energy} / 10</div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={!item}
              className="w-full bg-primary text-white rounded-2xl py-6 text-2xl font-black flex items-center justify-center space-x-4 disabled:opacity-50 active:scale-[0.98] transition-transform shadow-xl"
            >
              <Check className="w-8 h-8" strokeWidth={4} />
              <span>SAVE NOW</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
