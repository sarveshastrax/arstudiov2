import React from 'react';
import { MoreVertical, Eye, Calendar, Play } from 'lucide-react';
import { Project, ProjectStatus } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-900/10 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/editor/${project.id}`)}
    >
      <div className="relative aspect-video bg-zinc-950 overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.name} 
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-sm rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4 text-zinc-300" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
          <button className="bg-white/10 hover:bg-indigo-600 backdrop-blur-md text-white rounded-full p-3 transition-colors">
            <Play className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            project.status === ProjectStatus.PUBLISHED 
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
              : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors mb-1 truncate">
          {project.name}
        </h3>
        <p className="text-xs text-zinc-500 font-mono mb-4 truncate">/{project.slug}</p>
        
        <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-3">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{project.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};