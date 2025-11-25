
import React from 'react';
import { Copy } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CodeViewer: React.FC = () => {
  const { currentProject, sceneObjects } = useStore();
  
  // Simple mock generation of A-Frame / MindAR compatible HTML
  const generateCode = () => {
    const objectsHtml = sceneObjects.map(obj => {
      const pos = `${obj.position.x} ${obj.position.y} ${obj.position.z}`;
      const rot = `${(obj.rotation.x * 180 / Math.PI)} ${(obj.rotation.y * 180 / Math.PI)} ${(obj.rotation.z * 180 / Math.PI)}`;
      const scale = `${obj.scale.x} ${obj.scale.y} ${obj.scale.z}`;
      
      if (obj.type === 'MODEL') return `      <a-gltf-model src="${obj.assetId || 'model.glb'}" position="${pos}" rotation="${rot}" scale="${scale}"></a-gltf-model>`;
      if (obj.type === 'IMAGE') return `      <a-image src="${obj.assetId || 'image.png'}" position="${pos}" rotation="${rot}" scale="${scale}"></a-image>`;
      if (obj.type === 'PRIMITIVE') return `      <a-entity geometry="primitive: ${obj.primitiveType?.toLowerCase()}" material="color: ${obj.color}" position="${pos}"></a-entity>`;
      return '';
    }).join('\n');

    return `
<!DOCTYPE html>
<html>
  <head>
    <title>${currentProject?.name}</title>
    <script src="https://aframe.io/releases/1.4.2/aframe.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-aframe.prod.js"></script>
  </head>
  <body>
    <a-scene mindar-image="imageTargetSrc: ./targets.mind;" color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
      
      <a-entity mindar-image-target="targetIndex: 0">
${objectsHtml}
      </a-entity>
    </a-scene>
  </body>
</html>`;
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-zinc-300 font-mono text-sm overflow-hidden flex flex-col">
      <div className="bg-[#252526] p-3 border-b border-zinc-800 flex justify-between items-center">
        <span className="text-xs text-zinc-500">index.html</span>
        <button 
          onClick={() => navigator.clipboard.writeText(generateCode())}
          className="text-xs flex items-center gap-2 hover:text-white transition-colors"
        >
          <Copy className="w-3.5 h-3.5" /> Copy
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="whitespace-pre-wrap break-all">
          <code className="language-html">
            {generateCode()}
          </code>
        </pre>
      </div>
    </div>
  );
};
