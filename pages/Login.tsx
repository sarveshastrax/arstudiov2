import React from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('admin@adhvyk.com');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
           <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-900/50">
             <Code2 className="text-white w-7 h-7" />
           </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-zinc-500">Sign in to your production studio account.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              defaultValue="admin@adhvyk.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Password</label>
            <input 
              type="password" 
              defaultValue="password"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
            />
          </div>

          <button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-3 rounded-lg transition-colors mt-2">
            Sign In
          </button>

          <div className="pt-4 text-center">
             <a href="#" className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors">Forgot your password?</a>
          </div>
        </form>

        <p className="text-center mt-8 text-zinc-600 text-sm">
          New to Adhvyk? <span className="text-indigo-400 cursor-pointer hover:underline" onClick={() => navigate('/install')}>Run Installer</span>
        </p>
      </div>
    </div>
  );
};