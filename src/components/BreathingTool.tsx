import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Wind, ChevronDown } from 'lucide-react';

const BREATHING_PATTERNS = [
  { 
    id: 'box', 
    name: 'Stabilization (4-4-4-4)', 
    effect: 'Improves focus and grounds you',
    sequence: [
      { phase: 'inhale', time: 4, text: 'Breathe In...' }, 
      { phase: 'hold1', time: 4, text: 'Hold...' }, 
      { phase: 'exhale', time: 4, text: 'Breathe Out...' }, 
      { phase: 'hold2', time: 4, text: 'Hold...' }
    ]
  },
  { 
    id: 'relax', 
    name: 'Deep Relaxation (4-7-8)', 
    effect: 'Reduces anxiety & helps with sleep',
    sequence: [
      { phase: 'inhale', time: 4, text: 'Breathe In...' }, 
      { phase: 'hold1', time: 7, text: 'Hold...' }, 
      { phase: 'exhale', time: 8, text: 'Breathe Out...' }
    ]
  },
  { 
    id: 'energy', 
    name: 'Energizing (6-2)', 
    effect: 'Wakes up the nervous system',
    sequence: [
      { phase: 'inhale', time: 6, text: 'Deep Breathe In...' }, 
      { phase: 'exhale', time: 2, text: 'Quick Breathe Out!' }
    ]
  },
  { 
    id: 'calm', 
    name: 'Calming Pace (5-5)', 
    effect: 'Balances mood & reduces stress',
    sequence: [
      { phase: 'inhale', time: 5, text: 'Breathe In...' }, 
      { phase: 'exhale', time: 5, text: 'Breathe Out...' }
    ]
  }
];

export function BreathingTool() {
  const [isActive, setIsActive] = useState(false);
  const [selectedId, setSelectedId] = useState(BREATHING_PATTERNS[0].id);
  
  const selectedPattern = BREATHING_PATTERNS.find(p => p.id === selectedId)!;
  
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedPattern.sequence[0].time);

  useEffect(() => {
    if (!isActive) {
      setStepIndex(0);
      setTimeLeft(selectedPattern.sequence[0].time);
    }
  }, [selectedId, isActive, selectedPattern]);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const nextIndex = (stepIndex + 1) % selectedPattern.sequence.length;
            setStepIndex(nextIndex);
            return selectedPattern.sequence[nextIndex].time;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, stepIndex, selectedPattern]);

  const currentStep = selectedPattern.sequence[stepIndex];

  return (
    <div className="bg-white/50 backdrop-blur border border-blue-100 rounded-3xl p-6 text-center shadow-sm">
      <div className="flex items-center justify-center space-x-2 text-blue-800 mb-4">
        <Wind className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Breathing Exercise</h3>
      </div>

      {!isActive && (
        <div className="mb-8 max-w-[240px] mx-auto">
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none bg-blue-50 border border-blue-200 text-blue-900 font-medium py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BREATHING_PATTERNS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 pointer-events-none" />
          </div>
          <p className="text-xs text-blue-600/70 mt-2 font-medium">{selectedPattern.effect}</p>
        </div>
      )}
      
      {isActive && (
        <div className="mb-6">
          <h4 className="font-semibold text-blue-900">{selectedPattern.name}</h4>
        </div>
      )}
      
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-6">
        {/* Animated Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={isActive ? {
              scale: currentStep.phase === 'inhale' || currentStep.phase === 'hold1' ? 1.5 : 1,
              opacity: (currentStep.phase === 'inhale' || currentStep.phase === 'exhale') ? 0.8 : 0.5,
            } : { scale: 1, opacity: 0.2 }}
            transition={{ 
              duration: isActive && (currentStep.phase === 'inhale' || currentStep.phase === 'exhale') 
                ? currentStep.time : 0.5, 
              ease: "easeInOut" 
            }}
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
              key={isActive ? currentStep.text : 'ready'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="font-medium text-blue-900 text-xl"
            >
              {isActive ? currentStep.text : 'Ready?'}
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
        {isActive ? 'Stop' : 'Start Exercise'}
      </button>
    </div>
  );
}
