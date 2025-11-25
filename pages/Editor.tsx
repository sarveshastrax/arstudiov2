
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Smartphone, Share2, CheckCircle2, Settings, Layers, Code2 } from 'lucide-react';
import { AssetManager } from '../components/editor/AssetManager';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { EditorCanvas } from '../components/editor/EditorCanvas';
import { ARView } from '../components/editor/ARView';
import { CodeViewer } from '../components/editor/CodeViewer';
import { ProjectSettingsModal } from '../components/modals/ProjectSettingsModal';
import { PublishModal } from '../components/modals/PublishModal';
import { useStore } from '../store/useStore';
import { ProjectStatus } from '../types';

export const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    loadProject, 
    currentProject, 
    activeViewMode, 
    setActiveViewMode,
    setSettingsModalOpen,
    setPublishModalOpen
  } = useStore();

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id, loadProject]);

  if (!currentProject) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading project...</div>;

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden relative">
      <ProjectSettingsModal />
      <PublishModal />

      {/* Editor Header */}
      <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-900 px-2 py-1 rounded transition-colors" onClick={() => setPublishModalOpen(true)}>
              <h1 className="text-sm font-semibold text-white">{currentProject.name}</h1>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${currentProject.status === ProjectStatus.PUBLISHED ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                {currentProject.status}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
           <button 
             onClick={() => setActiveViewMode('EDITOR')}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeViewMode === 'EDITOR' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
             <Layers className="w-3.5 h-3.5" /> Editor
           </button>
           <button 
             onClick={() => setActiveViewMode('AR')}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeViewMode === 'AR' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
             <Smartphone className="w-3.5 h-3.5" /> AR View
           </button>
           <button 
             onClick={() => setActiveViewMode('CODE')}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeViewMode === 'CODE' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
             <Code2 className="w-3.5 h-3.5" /> Code
           </button>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={() => setSettingsModalOpen(true)}
             className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
             title="Project Settings"
           >
             <Settings className="w-4 h-4" />
           </button>
           
           <div className="h-4 w-px bg-zinc-800 mx-1"></div>
           
           <button 
             onClick={() => setPublishModalOpen(true)}
             className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-all ${
               currentProject.status === ProjectStatus.PUBLISHED
                 ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/20'
                 : 'bg-indigo-600 hover:bg-indigo-500 text-white'
             }`}
           >
             {currentProject.status === ProjectStatus.PUBLISHED ? (
               <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Published
               </>
             ) : (
               <>
                <Save className="w-3.5 h-3.5" /> Publish
               </>
             )}
           </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {activeViewMode === 'EDITOR' && <AssetManager />}
        
        <div className="flex-1 relative bg-[#111] flex flex-col">
          {activeViewMode === 'EDITOR' && <EditorCanvas />}
          {activeViewMode === 'AR' && <ARView />}
          {activeViewMode === 'CODE' && <CodeViewer />}
        </div>

        {activeViewMode === 'EDITOR' && <PropertiesPanel />}
      </div>
    </div>
  );
};
