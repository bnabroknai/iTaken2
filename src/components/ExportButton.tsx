import { Download } from 'lucide-react';
import { db } from '../lib/db';

export function ExportButton() {
  const handleExport = async () => {
    try {
      const logs = await db.logs.toArray();
      const rules = await db.rules.toArray();
      const journal = await db.journal.toArray();

      const data = {
        exportDate: new Date().toISOString(),
        rules,
        logs,
        journal
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `intake-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
      alert("Failed to export data.");
    }
  };

  return (
    <button 
      onClick={handleExport}
      className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-medium transition-colors mt-8"
    >
      <Download className="w-5 h-5" />
      <span>Export Data for Doctor</span>
    </button>
  );
}
