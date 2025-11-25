
import React, { useState, useRef } from 'react';
import { Box, Image, Video, Upload, Search, Circle, Cylinder, Square, Type, Music, Speaker } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AssetType, PrimitiveType, Asset } from '../../types';

export const AssetManager: React.FC = () => {
  const { assets, addObject, addAsset } = useStore();
  const [activeTab, setActiveTab] = useState<AssetType | 'ALL'>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = activeTab === 'ALL' 
    ? assets 
    : assets.filter(a => a.type === activeTab);

  const handleAddPrimitive = (type: PrimitiveType, name: string) => {
    addObject({
      id: `${type.toLowerCase()}-${Date.now()}`,
      name: name,
      type: 'PRIMITIVE',
      primitiveType: type,
      position: { x: 0, y: 0.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      color: '#ffffff'
    });
  };

  const handleAddText = () => {
    addObject({
      id: `text-${Date.now()}`,
      name: '3D Text',
      type: 'TEXT',
      content: 'HELLO AR',
      fontSize: 0.5,
      position: { x: 0, y: 0.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      color: '#ffffff'
    });
  };

  const handleAddAssetToScene = (asset: Asset) => {
    const isVideo = asset.type === AssetType.VIDEO;
    const isAudio = asset.type === AssetType.AUDIO;

    addObject({
      id: `asset-${Date.now()}`,
      name: asset.name,
      type: asset.type,
      assetId: asset.id,
      position: { x: 0, y: 0.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      videoProps: isVideo ? { loop: true, autoplay: true, chromaKey: false, chromaColor: '#00ff00', threshold: 0.1 } : undefined,
      audioProps: isAudio ? { loop: false, autoplay: true, volume: 1.0 } : undefined
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addAsset(e.target.files[0]);
    }
  };

  return (
    <div className="w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Assets & Tools</h3>
        
        <div className="flex gap-1 mb-4">
          <button onClick={() => setActiveTab('ALL')} className={`flex-1 py-1.5 text-[10px] font-medium rounded ${activeTab === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>All</button>
          <button onClick={() => setActiveTab(AssetType.MODEL)} className={`flex-1 py-1.5 text-[10px] font-medium rounded ${activeTab === AssetType.MODEL ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>3D</button>
          <button onClick={() => setActiveTab(AssetType.IMAGE)} className={`flex-1 py-1.5 text-[10px] font-medium rounded ${activeTab === AssetType.IMAGE ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>2D</button>
          <button onClick={() => setActiveTab(AssetType.AUDIO)} className={`flex-1 py-1.5 text-[10px] font-medium rounded ${activeTab === AssetType.AUDIO ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Audio</button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Primitives Section */}
        <div className="mb-6">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Create</h4>
          <div className="grid grid-cols-5 gap-2">
            <button title="Cube" onClick={() => handleAddPrimitive('CUBE', 'Cube')} className="aspect-square bg-zinc-900 border border-zinc-800 rounded hover:border-indigo-500 flex items-center justify-center group transition-colors">
              <Box className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
            </button>
            <button title="Sphere" onClick={() => handleAddPrimitive('SPHERE', 'Sphere')} className="aspect-square bg-zinc-900 border border-zinc-800 rounded hover:border-indigo-500 flex items-center justify-center group transition-colors">
              <Circle className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
            </button>
            <button title="Cylinder" onClick={() => handleAddPrimitive('CYLINDER', 'Cylinder')} className="aspect-square bg-zinc-900 border border-zinc-800 rounded hover:border-indigo-500 flex items-center justify-center group transition-colors">
              <Cylinder className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
            </button>
            <button title="Plane" onClick={() => handleAddPrimitive('PLANE', 'Plane')} className="aspect-square bg-zinc-900 border border-zinc-800 rounded hover:border-indigo-500 flex items-center justify-center group transition-colors">
              <Square className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
            </button>
            <button title="3D Text" onClick={handleAddText} className="aspect-square bg-zinc-900 border border-zinc-800 rounded hover:border-indigo-500 flex items-center justify-center group transition-colors">
              <Type className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Library Section */}
        <div>
           <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Library (Click to Add)</h4>
           {filteredAssets.length === 0 ? (
             <div className="text-zinc-600 text-xs text-center py-4 border border-dashed border-zinc-800 rounded">No assets found</div>
           ) : (
             <div className="grid grid-cols-2 gap-3">
               {filteredAssets.map(asset => (
                 <button 
                   key={asset.id} 
                   onClick={() => handleAddAssetToScene(asset)}
                   className="group relative aspect-square bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-indigo-500 transition-all text-left"
                 >
                   <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-1.5 truncate">
                     <p className="text-[10px] text-zinc-200 truncate">{asset.name}</p>
                   </div>
                   <div className="absolute top-1 right-1 bg-black/50 p-1 rounded-full">
                      {asset.type === AssetType.MODEL && <Box className="w-3 h-3 text-white" />}
                      {asset.type === AssetType.IMAGE && <Image className="w-3 h-3 text-white" />}
                      {asset.type === AssetType.VIDEO && <Video className="w-3 h-3 text-white" />}
                      {asset.type === AssetType.AUDIO && <Music className="w-3 h-3 text-white" />}
                   </div>
                 </button>
               ))}
             </div>
           )}
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
          accept=".jpg,.jpeg,.png,.mp4,.glb,.gltf,.mp3,.wav"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700 hover:border-zinc-600"
        >
          <Upload className="w-4 h-4" />
          Upload Assets
        </button>
      </div>
    </div>
  );
};
