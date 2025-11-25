
import React from 'react';
import { QrCode, Smartphone, ExternalLink } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ARView: React.FC = () => {
  const { currentProject } = useStore();
  
  if (!currentProject) return null;

  const url = `https://ar.adhvyk.com/v/${currentProject.slug}`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] p-8 text-center animate-in fade-in zoom-in-95">
      <div className="bg-white p-4 rounded-xl shadow-2xl mb-8">
        {/* Placeholder for actual QR Code generation library like react-qr-code */}
        <div className="w-64 h-64 bg-zinc-100 flex items-center justify-center border-2 border-dashed border-zinc-300 rounded-lg">
           <QrCode className="w-32 h-32 text-zinc-800" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Scan to Test on Device</h2>
      <p className="text-zinc-500 max-w-md mb-8">
        Point your phone's camera at the QR code to instantly preview the 
        <span className="text-indigo-400 font-medium mx-1">
          {currentProject.experienceType}
        </span>
        experience.
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-zinc-400 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
          <Smartphone className="w-4 h-4" />
          <span className="text-sm">Works on iOS & Android</span>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 px-4 py-2 hover:bg-indigo-500/10 rounded-full transition-colors"
        >
          <span className="text-sm font-medium">Open in Browser</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
