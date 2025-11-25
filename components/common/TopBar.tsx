import React from 'react';
import { Bell, Search, Settings, User as UserIcon, LogOut, Code2, Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

export const TopBar: React.FC = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Menu className="w-6 h-6 text-zinc-400" />
        </div>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <Code2 className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white hidden md:block">
            ADHVYK <span className="text-zinc-500 font-medium">AR STUDIO</span>
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search projects, assets..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-indigo-600 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all">
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="h-8 w-px bg-zinc-800 mx-1"></div>

        <div className="flex items-center gap-3 group relative">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-zinc-500">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 m-2 text-zinc-400" />
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className="absolute top-10 right-0 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-2 px-3 text-sm text-red-400 flex items-center gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};