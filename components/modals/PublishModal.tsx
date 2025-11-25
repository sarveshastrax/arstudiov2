
import React, { useState } from 'react';
import { X, Globe, Lock, EyeOff, Copy, Check, Rocket } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ProjectVisibility } from '../../types';

export const PublishModal: React.FC = () => {
  const { isPublishModalOpen, setPublishModalOpen, currentProject, publishProject } = useStore();
  const [name, setName] = useState(currentProject?.name || '');
  const [slug, setSlug] = useState(currentProject?.slug || '');
  const [visibility, setVisibility] = useState<ProjectVisibility>(currentProject?.visibility || ProjectVisibility.PUBLIC);
  const [copied, setCopied] = useState(false);

  if (!isPublishModalOpen || !currentProject) return null;

  const handlePublish = () => {
    publishProject({ name, slug, visibility });
  };

  const fullUrl = `https://ar.adhvyk.com/v/${slug}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-500" /> Publish Project
          </h2>
          <button onClick={() => setPublishModalOpen(false)} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Project Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Public URL Slug</label>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden focus-within:border-indigo-500 transition-colors">
              <span className="px-3 py-3 text-zinc-500 text-sm border-r border-zinc-800 select-none">ar.adhvyk.com/v/</span>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="flex-1 bg-transparent p-3 text-white outline-none"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1.5">Only lowercase letters, numbers, and hyphens.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Visibility</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setVisibility(ProjectVisibility.PUBLIC)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border gap-2 transition-all ${
                  visibility === ProjectVisibility.PUBLIC ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium">Public</span>
              </button>
              <button 
                onClick={() => setVisibility(ProjectVisibility.UNLISTED)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border gap-2 transition-all ${
                  visibility === ProjectVisibility.UNLISTED ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <EyeOff className="w-5 h-5" />
                <span className="text-xs font-medium">Unlisted</span>
              </button>
              <button 
                onClick={() => setVisibility(ProjectVisibility.PRIVATE)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border gap-2 transition-all ${
                  visibility === ProjectVisibility.PRIVATE ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span className="text-xs font-medium">Private</span>
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-zinc-500 uppercase">Share Link</span>
               <span className="text-xs text-indigo-400">Live Preview</span>
             </div>
             <div className="flex items-center gap-2">
               <code className="flex-1 text-sm text-zinc-300 truncate">{fullUrl}</code>
               <button onClick={copyUrl} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 transition-colors">
                 {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
               </button>
             </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 flex justify-end gap-3">
          <button 
            onClick={() => setPublishModalOpen(false)}
            className="text-zinc-400 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handlePublish}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
};
