import { useState } from 'react';
import { Utensils, Pill, LayoutDashboard, Cog, PhoneCall } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-48 selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 shadow-sm sticky top-0 z-40 flex items-center justify-between border-b-4 border-primary">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            VitalTracker
          </h1>
          <p className="text-xl font-bold text-slate-600">Care Assistant</p>
        </div>
        <button 
          onClick={() => setView(view === 'home' ? 'settings' : 'home')}
          className={`p-3 rounded-full border-4 transition-colors ${view === 'settings' ? 'bg-slate-200 border-slate-400 text-slate-800' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}
          aria-label="Settings"
        >
          {view === 'home' ? <Cog className="w-10 h-10" /> : <LayoutDashboard className="w-10 h-10" />}
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {view === 'home' ? (
          <div className="flex flex-col space-y-8">
            
            {/* Greeting */}
            <div className="px-2">
              <h2 className="text-3xl font-black text-slate-800 text-center">Good morning!</h2>
            </div>

            {/* Top Big Buttons */}
            <div className="grid grid-cols-1 gap-6 mb-4">
              <button 
                onClick={() => setModalType('med')}
                className="bg-primary rounded-3xl p-10 text-white shadow-2xl active:scale-95 transition-transform flex items-center space-x-6 min-h-[140px]"
              >
                <div className="bg-white/20 p-5 rounded-full">
                  <Pill className="w-14 h-14" />
                </div>
                <span className="text-3xl font-black uppercase">Medicines</span>
              </button>

              <button 
                onClick={() => setModalType('food')}
                className="bg-white border-4 border-primary rounded-3xl p-10 text-primary shadow-xl active:scale-95 transition-transform flex items-center space-x-6 min-h-[140px]"
              >
                <div className="bg-primary/10 p-5 rounded-full">
                  <Utensils className="w-14 h-14" />
                </div>
                <span className="text-3xl font-black uppercase">My Food</span>
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

      {/* Persistent Help Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-50/80 backdrop-blur-sm border-t border-slate-200 z-50">
        <button
          className="w-full bg-alert text-white rounded-3xl py-8 flex items-center justify-center space-x-6 shadow-[0_20px_50px_rgba(186,26,26,0.4)] active:scale-95 transition-transform border-4 border-white/20"
          onClick={() => alert("Help requested. Alerting caregiver...")}
        >
          <PhoneCall className="w-12 h-12" />
          <span className="text-4xl font-black uppercase tracking-tighter">HELP</span>
        </button>
      </div>

      <InputModal type={modalType} onClose={() => setModalType(null)} />
    </div>
  );
}
