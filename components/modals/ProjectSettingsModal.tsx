
import React, { useRef } from 'react';
import { X, Globe, Image as ImageIcon, ScanFace, MapPin, Upload } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ExperienceType } from '../../types';

export const ProjectSettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, currentProject, updateProjectSettings } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isSettingsModalOpen || !currentProject) return null;

  const handleTypeSelect = (type: ExperienceType) => {
    updateProjectSettings({ experienceType: type });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      updateProjectSettings({ targetImage: url });
    }
  };

  const handleGeoChange = (key: 'lat' | 'lng', value: string) => {
    const num = parseFloat(value);
    const currentGeo = currentProject.geoLocation || { lat: 0, lng: 0 };
    updateProjectSettings({ 
      geoLocation: { ...currentGeo, [key]: num } 
    });
  };

  const types = [
    { id: ExperienceType.PLANE, label: 'World Tracking', icon: Globe, desc: 'Place objects on flat surfaces like floors or tables.' },
    { id: ExperienceType.IMAGE, label: 'Image Target', icon: ImageIcon, desc: 'Trigger AR when the camera sees a specific image.' },
    { id: ExperienceType.FACE, label: 'Face Tracking', icon: ScanFace, desc: 'Attach objects to faces (masks, glasses).' },
    { id: ExperienceType.GEO, label: 'Geo Location', icon: MapPin, desc: 'Place content at specific GPS coordinates.' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white">Project Settings</h2>
          <button onClick={() => setSettingsModalOpen(false)} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Experience Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    currentProject.experienceType === type.id 
                      ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500' 
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${currentProject.experienceType === type.id ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                    <type.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-semibold ${currentProject.experienceType === type.id ? 'text-indigo-400' : 'text-zinc-200'}`}>
                      {type.label}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {type.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {currentProject.experienceType === ExperienceType.IMAGE && (
            <div className="animate-in fade-in slide-in-from-top-4">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Target Image Marker</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                {currentProject.targetImage ? (
                  <div className="relative w-full max-w-xs aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-zinc-700 mb-4">
                    <img src={currentProject.targetImage} alt="Target" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-zinc-500" />
                  </div>
                )}
                
                <p className="text-zinc-400 text-sm mb-4">
                  Upload a high-contrast image (JPG/PNG) to serve as your AR trigger.
                </p>
                <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <button 
                  onClick={() => fileRef.current?.click()}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-zinc-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {currentProject.targetImage ? 'Change Image' : 'Upload Marker'}
                </button>
              </div>
            </div>
          )}

          {currentProject.experienceType === ExperienceType.GEO && (
            <div className="animate-in fade-in slide-in-from-top-4">
               <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Target Location</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Latitude</label>
                    <input 
                      type="number" 
                      step="any"
                      placeholder="e.g. 40.7128"
                      value={currentProject.geoLocation?.lat || ''}
                      onChange={(e) => handleGeoChange('lat', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Longitude</label>
                    <input 
                      type="number" 
                      step="any"
                      placeholder="e.g. -74.0060"
                      value={currentProject.geoLocation?.lng || ''}
                      onChange={(e) => handleGeoChange('lng', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
               </div>
               <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                 <MapPin className="w-3 h-3" /> Coordinates will be used to place content in the real world.
               </p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 flex justify-end">
          <button 
            onClick={() => setSettingsModalOpen(false)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-indigo-900/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
