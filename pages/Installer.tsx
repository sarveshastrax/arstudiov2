import React, { useState } from 'react';
import { Check, Database, Server, Shield, HardDrive, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Step: React.FC<{ active: boolean; completed: boolean; label: string; icon: React.ReactNode }> = ({ active, completed, label, icon }) => (
  <div className={`flex items-center gap-3 ${active ? 'text-indigo-400' : completed ? 'text-emerald-400' : 'text-zinc-600'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
      active ? 'border-indigo-400 bg-indigo-400/10' : completed ? 'border-emerald-400 bg-emerald-400/10' : 'border-zinc-700 bg-zinc-900'
    }`}>
      {completed ? <Check className="w-4 h-4" /> : icon}
    </div>
    <span className="text-sm font-medium hidden md:block">{label}</span>
    {completed && <div className="h-0.5 w-8 bg-zinc-800 mx-2 hidden lg:block" />}
  </div>
);

export const Installer: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-900/50 p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-white mb-6">ADHVYK AR STUDIO <span className="text-zinc-500 text-sm font-normal">Installer Wizard</span></h1>
          <div className="flex items-center justify-between">
            <Step active={step === 1} completed={step > 1} label="Database" icon={<Database className="w-4 h-4"/>} />
            <Step active={step === 2} completed={step > 2} label="Admin" icon={<Shield className="w-4 h-4"/>} />
            <Step active={step === 3} completed={step > 3} label="Storage" icon={<HardDrive className="w-4 h-4"/>} />
            <Step active={step === 4} completed={step > 4} label="Finish" icon={<Server className="w-4 h-4"/>} />
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-medium text-white">Database Configuration</h2>
              <p className="text-sm text-zinc-400 mb-4">Connect your MySQL instance via Prisma.</p>
              
              <div className="space-y-3">
                 <input type="text" placeholder="Database Host (e.g., localhost)" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" defaultValue="localhost" />
                 <input type="text" placeholder="Port" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" defaultValue="3306" />
                 <input type="text" placeholder="Database Name" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" defaultValue="adhvyk_ar_prod" />
                 <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="User" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
                   <input type="password" placeholder="Password" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
                 </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-medium text-white">Admin Account</h2>
              <p className="text-sm text-zinc-400 mb-4">Create the initial super admin user.</p>
              <input type="email" placeholder="Admin Email" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
              <input type="password" placeholder="Strong Password" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
          )}

          {step === 3 && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-medium text-white">Asset Storage (AWS S3)</h2>
              <p className="text-sm text-zinc-400 mb-4">Configure S3 bucket for AR assets.</p>
              <input type="text" placeholder="Bucket Name" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
              <input type="text" placeholder="Region (e.g., us-east-1)" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
              <input type="password" placeholder="Access Key ID" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
              <input type="password" placeholder="Secret Access Key" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Installation Complete!</h2>
              <p className="text-zinc-400 max-w-sm mx-auto">Adhvyk AR Studio has been successfully configured. You can now log in to the dashboard.</p>
            </div>
          )}
        </div>

        <div className="bg-zinc-900/30 p-6 border-t border-zinc-800 flex justify-end gap-3">
           {step > 1 && step < 4 && (
             <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">Back</button>
           )}
           {step < 4 ? (
             <button onClick={() => setStep(s => s + 1)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
               Next Step <ChevronRight className="w-4 h-4" />
             </button>
           ) : (
             <button onClick={() => navigate('/login')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">
               Go to Login
             </button>
           )}
        </div>
      </div>
    </div>
  );
};