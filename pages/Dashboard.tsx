
import React from 'react';
import { TopBar } from '../components/common/TopBar';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { useStore } from '../store/useStore';
import { Plus, LayoutGrid, List, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { projects, createProject } = useStore();
  const navigate = useNavigate();

  const handleNewProject = () => {
    const newId = createProject();
    navigate(`/editor/${newId}`);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      <TopBar />
      
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Projects</h2>
            <p className="text-zinc-400">Manage your AR experiences and analytics.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-medium transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button 
              onClick={handleNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Summary (Simplified) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
             <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Total Views</div>
             <div className="text-2xl font-mono text-white">24,592</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
             <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Active Projects</div>
             <div className="text-2xl font-mono text-emerald-400">12</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
             <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Storage Used</div>
             <div className="text-2xl font-mono text-indigo-400">1.4 GB</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button className="p-1.5 bg-zinc-800 rounded text-white shadow-sm">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-zinc-500 hover:text-zinc-300">
              <List className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-zinc-500">{projects.length} projects</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
          
          {/* Create New Card Placeholder */}
          <button 
            onClick={handleNewProject}
            className="group border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 hover:border-indigo-500/50 hover:bg-zinc-900/50 transition-all min-h-[300px]"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-indigo-500 transition-all">
              <Plus className="w-6 h-6 text-zinc-500 group-hover:text-indigo-500" />
            </div>
            <span className="text-sm font-medium text-zinc-400 group-hover:text-white">Create New Project</span>
          </button>
        </div>
      </main>
    </div>
  );
};
