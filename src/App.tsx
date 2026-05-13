import { useState } from 'react';
import { Utensils, Pill, LayoutDashboard, Cog } from 'lucide-react';
import { InputModal } from './components/InputModal';
import { SettingsView } from './components/SettingsView';
import { GoalsView } from './components/GoalsView';
import { JournalSlots } from './components/JournalSlots';
import { BreathingTool } from './components/BreathingTool';
import { ExportButton } from './components/ExportButton';

export default function App() {
  const [modalType, setModalType] = useState<'food' | 'med' | null>(null);
  const [view, setView] = useState<'home' | 'settings'>('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 shadow-sm sticky top-0 z-40 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            VitalTracker
          </h1>
          <p className="text-sm text-slate-500">Track, reflect, and stabilize.</p>
        </div>
        <button 
          onClick={() => setView(view === 'home' ? 'settings' : 'home')}
          className={`p-2 rounded-full transition-colors ${view === 'settings' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          {view === 'home' ? <Cog className="w-6 h-6" /> : <LayoutDashboard className="w-6 h-6" />}
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {view === 'home' ? (
          <div className="flex flex-col space-y-2">
            
            {/* Top Big Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                onClick={() => setModalType('food')}
                className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-200 active:scale-95 transition-transform flex flex-col items-center justify-center space-y-3 min-h-[160px]"
              >
                <div className="bg-white/20 p-4 rounded-full">
                  <Utensils className="w-8 h-8" />
                </div>
                <span className="text-xl font-bold">Food</span>
              </button>
              
              <button 
                onClick={() => setModalType('med')}
                className="bg-gradient-to-br from-indigo-400 to-blue-500 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 active:scale-95 transition-transform flex flex-col items-center justify-center space-y-3 min-h-[160px]"
              >
                <div className="bg-white/20 p-4 rounded-full">
                  <Pill className="w-8 h-8" />
                </div>
                <span className="text-xl font-bold">Meds</span>
              </button>
            </div>

            <JournalSlots />
            
            <GoalsView />

            <div className="mt-12">
              <BreathingTool />
            </div>

            <ExportButton />
          </div>
        ) : (
          <SettingsView />
        )}
      </main>

      <InputModal type={modalType} onClose={() => setModalType(null)} />
    </div>
  );
}
