import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Wind } from 'lucide-react';

export function BreathingTool() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setPhase((p) => {
              if (p === 'inhale') return 'hold1';
              if (p === 'hold1') return 'exhale';
              if (p === 'exhale') return 'hold2';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPhase('inhale');
      setTimeLeft(4);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const instruction = {
    inhale: 'Breathe In...',
    hold1: 'Hold...',
    exhale: 'Breathe Out...',
    hold2: 'Hold...'
  }[phase];

  return (
    <div className="bg-white/50 backdrop-blur border border-blue-100 rounded-3xl p-6 text-center space-y-6 shadow-sm mb-24">
      <div className="flex items-center justify-center space-x-2 text-blue-800">
        <Wind className="w-5 h-5" />
        <h3 className="font-semibold text-lg">4-4-4-4 Stabilization</h3>
      </div>
      
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        {/* Animated Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={isActive ? {
              scale: phase === 'inhale' || phase === 'hold1' ? 1.5 : 1,
              opacity: (phase === 'inhale' || phase === 'exhale') ? 0.8 : 0.5,
            } : { scale: 1, opacity: 0.2 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className={cn(
              "w-24 h-24 rounded-full mix-blend-multiply",
              isActive ? "bg-blue-300" : "bg-gray-200"
            )}
          />
        </div>
        
        {/* Text UI */}
        <div className="relative z-10 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={instruction}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="font-medium text-blue-900 text-xl"
            >
              {isActive ? instruction : 'Ready?'}
            </motion.p>
          </AnimatePresence>
          {isActive && (
            <p className="text-4xl font-bold text-blue-950 tabular-nums mt-2">{timeLeft}</p>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsActive(!isActive)}
        className={cn(
          "px-8 py-3 rounded-full font-medium transition-all active:scale-95",
          isActive 
            ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
        )}
      >
        {isActive ? 'Stop' : 'Start Exercises'}
      </button>
    </div>
  );
}
