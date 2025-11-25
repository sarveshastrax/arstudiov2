
import React from 'react';
import { useStore } from '../../store/useStore';
import { Trash2, Eye, EyeOff, Layers, Type, Video, Music, Box, PlayCircle, ToggleRight, ToggleLeft } from 'lucide-react';
import { AssetType } from '../../types';

const VectorInput: React.FC<{ 
  label: string; 
  value: { x: number; y: number; z: number }; 
  onChange: (key: 'x' | 'y' | 'z', val: number) => void 
}> = ({ label, value, onChange }) => (
  <div className="mb-4">
    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 flex justify-between">
      <span>{label}</span>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {['x', 'y', 'z'].map((axis) => (
        <div key={axis} className="relative group">
          <div className="absolute left-2 top-1.5 text-[10px] font-mono text-zinc-500 uppercase pointer-events-none group-focus-within:text-indigo-400">
            {axis}
          </div>
          <input
            type="number"
            step={0.1}
            value={value[axis as keyof typeof value]}
            onChange={(e) => onChange(axis as any, parseFloat(e.target.value))}
            className="w-full bg-zinc-900 border border-zinc-800 rounded py-1.5 pl-5 pr-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-600 transition-colors"
          />
        </div>
      ))}
    </div>
  </div>
);

export const PropertiesPanel: React.FC = () => {
  const { sceneObjects, selectedObjectId, updateObject, deleteObject, selectObject } = useStore();
  const selectedObject = sceneObjects.find(obj => obj.id === selectedObjectId);

  const handleVectorChange = (prop: 'position' | 'rotation' | 'scale', axis: 'x'|'y'|'z', val: number) => {
    if (!selectedObject) return;
    updateObject(selectedObject.id, {
      [prop]: { ...selectedObject[prop], [axis]: val }
    });
  };

  const updateVideoProp = (key: keyof import('../../types').VideoProps, value: any) => {
    if (!selectedObject || !selectedObject.videoProps) return;
    updateObject(selectedObject.id, {
      videoProps: { ...selectedObject.videoProps, [key]: value }
    });
  };

  const updateAudioProp = (key: keyof import('../../types').AudioProps, value: any) => {
    if (!selectedObject || !selectedObject.audioProps) return;
    updateObject(selectedObject.id, {
      audioProps: { ...selectedObject.audioProps, [key]: value }
    });
  };

  return (
    <div className="w-72 bg-zinc-950 border-l border-zinc-800 flex flex-col h-full overflow-hidden">
      
      {/* Scene Graph (Layers) */}
      <div className="flex-1 overflow-y-auto border-b border-zinc-800 max-h-[250px]">
        <div className="p-3 bg-zinc-900/50 border-b border-zinc-800 sticky top-0 backdrop-blur-md">
           <h3 className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
             <Layers className="w-3.5 h-3.5" /> Scene Objects
           </h3>
        </div>
        <div className="p-2 space-y-1">
          {sceneObjects.map(obj => (
            <div 
              key={obj.id}
              onClick={() => selectObject(obj.id)}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors text-xs group ${
                obj.id === selectedObjectId ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                 {obj.type === 'PRIMITIVE' && <Box className="w-3.5 h-3.5" />}
                 {obj.type === 'TEXT' && <Type className="w-3.5 h-3.5" />}
                 {obj.type === AssetType.VIDEO && <Video className="w-3.5 h-3.5" />}
                 {obj.type === AssetType.AUDIO && <Music className="w-3.5 h-3.5" />}
                 <span className="truncate max-w-[120px]">{obj.name}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { visible: !obj.visible }); }} className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/20 ${obj.id === selectedObjectId ? 'text-white' : ''}`}>
                 {obj.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </div>
          ))}
          {sceneObjects.length === 0 && <p className="text-zinc-600 text-xs text-center py-4">No objects in scene</p>}
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto bg-zinc-950">
        {selectedObject ? (
          <>
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <input 
                value={selectedObject.name} 
                onChange={(e) => updateObject(selectedObject.id, { name: e.target.value })}
                className="bg-transparent text-sm font-bold text-white border-none outline-none w-full" 
              />
              <button 
                onClick={() => deleteObject(selectedObject.id)}
                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              
              {/* Specialized Controls for Video */}
              {selectedObject.type === AssetType.VIDEO && selectedObject.videoProps && (
                <div className="mb-4 space-y-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Video className="w-3 h-3" /> Video Settings
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-zinc-300">Loop Video</label>
                    <button onClick={() => updateVideoProp('loop', !selectedObject.videoProps?.loop)}>
                      {selectedObject.videoProps.loop ? <ToggleRight className="w-5 h-5 text-indigo-400" /> : <ToggleLeft className="w-5 h-5 text-zinc-600" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-zinc-300">Green Screen</label>
                    <button onClick={() => updateVideoProp('chromaKey', !selectedObject.videoProps?.chromaKey)}>
                      {selectedObject.videoProps.chromaKey ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-zinc-600" />}
                    </button>
                  </div>

                  {selectedObject.videoProps.chromaKey && (
                    <div className="animate-in slide-in-from-top-2 pt-2 border-t border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-xs text-zinc-400">Key Color</span>
                         <input 
                           type="color" 
                           value={selectedObject.videoProps.chromaColor}
                           onChange={(e) => updateVideoProp('chromaColor', e.target.value)}
                           className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                         />
                      </div>
                      <div>
                         <div className="flex justify-between text-xs text-zinc-400 mb-1">
                           <span>Threshold</span>
                           <span>{selectedObject.videoProps.threshold}</span>
                         </div>
                         <input 
                           type="range" min="0" max="1" step="0.01"
                           value={selectedObject.videoProps.threshold}
                           onChange={(e) => updateVideoProp('threshold', parseFloat(e.target.value))}
                           className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                         />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Specialized Controls for Audio */}
              {selectedObject.type === AssetType.AUDIO && selectedObject.audioProps && (
                <div className="mb-4 space-y-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Music className="w-3 h-3" /> Audio Settings
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-zinc-300">Autoplay</label>
                    <button onClick={() => updateAudioProp('autoplay', !selectedObject.audioProps?.autoplay)}>
                      {selectedObject.audioProps.autoplay ? <ToggleRight className="w-5 h-5 text-indigo-400" /> : <ToggleLeft className="w-5 h-5 text-zinc-600" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-zinc-300">Loop</label>
                    <button onClick={() => updateAudioProp('loop', !selectedObject.audioProps?.loop)}>
                      {selectedObject.audioProps.loop ? <ToggleRight className="w-5 h-5 text-indigo-400" /> : <ToggleLeft className="w-5 h-5 text-zinc-600" />}
                    </button>
                  </div>

                  <div>
                     <div className="flex justify-between text-xs text-zinc-400 mb-1">
                       <span>Volume</span>
                       <span>{(selectedObject.audioProps.volume * 100).toFixed(0)}%</span>
                     </div>
                     <input 
                       type="range" min="0" max="1" step="0.1"
                       value={selectedObject.audioProps.volume}
                       onChange={(e) => updateAudioProp('volume', parseFloat(e.target.value))}
                       className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                     />
                  </div>
                </div>
              )}

              {selectedObject.type === 'TEXT' && (
                <div className="mb-4">
                   <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5">Text Content</div>
                   <input
                      type="text"
                      value={selectedObject.content || ''}
                      onChange={(e) => updateObject(selectedObject.id, { content: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white outline-none focus:border-indigo-600"
                    />
                </div>
              )}

              <VectorInput label="Position" value={selectedObject.position} onChange={(a, v) => handleVectorChange('position', a, v)} />
              <VectorInput label="Rotation" value={selectedObject.rotation} onChange={(a, v) => handleVectorChange('rotation', a, v)} />
              <VectorInput label="Scale" value={selectedObject.scale} onChange={(a, v) => handleVectorChange('scale', a, v)} />

              <div className="pt-4 border-t border-zinc-800">
                 <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Color</div>
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded border border-zinc-700 shadow-sm" style={{ backgroundColor: selectedObject.color || '#fff' }}></div>
                   <input 
                     type="text" 
                     value={selectedObject.color || '#ffffff'} 
                     onChange={(e) => updateObject(selectedObject.id, { color: e.target.value })}
                     className="flex-1 bg-zinc-900 border border-zinc-800 rounded py-1.5 px-2 text-xs text-zinc-400 font-mono focus:border-indigo-500 focus:text-white outline-none"
                   />
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-8 text-center">
            <Layers className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-xs">Select an object from the Scene List or Canvas to edit properties.</p>
          </div>
        )}
      </div>
    </div>
  );
};
