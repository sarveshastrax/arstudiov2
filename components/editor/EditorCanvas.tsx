
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, Text, Image, Gltf, useVideoTexture, Billboard } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { SceneObject, AssetType, VideoProps, ExperienceType } from '../../types';
import * as THREE from 'three';

// --- Custom Chroma Key Shader Material ---

const ChromaKeyMaterial: React.FC<{ texture: THREE.Texture; color: string; threshold: number; transparent: boolean; side: THREE.Side }> = ({ texture, color, threshold, transparent, side }) => {
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uColor: { value: new THREE.Color(color) },
    uThreshold: { value: threshold },
  }), [texture, color, threshold]);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uThreshold;
    varying vec2 vUv;
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      float dist = distance(texColor.rgb, uColor);
      if (dist < uThreshold) discard;
      gl_FragColor = texColor;
    }
  `;

  return (
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent={transparent}
      side={side}
    />
  );
};

// --- Helper Components ---

const VideoMesh: React.FC<{ url: string; opacity?: number; videoProps?: VideoProps }> = ({ url, opacity = 1, videoProps }) => {
  const texture = useVideoTexture(url, {
    loop: videoProps?.loop ?? true,
    autoplay: videoProps?.autoplay ?? true,
    muted: true // Mute inside editor to prevent annoyance
  });

  if (videoProps?.chromaKey) {
    return (
      <mesh>
        <planeGeometry args={[1.77, 1]} />
        <ChromaKeyMaterial 
          texture={texture} 
          color={videoProps.chromaColor} 
          threshold={videoProps.threshold} 
          transparent 
          side={THREE.DoubleSide} 
        />
      </mesh>
    );
  }

  return (
    <mesh>
      <planeGeometry args={[1.77, 1]} /> 
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} transparent opacity={opacity} />
    </mesh>
  );
};

const AudioVisualizer: React.FC = () => (
  <Billboard>
     <mesh>
       <circleGeometry args={[0.3, 32]} />
       <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
     </mesh>
     <Text position={[0, 0, 0.01]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
       AUDIO
     </Text>
  </Billboard>
);

const TargetImageReference: React.FC<{ url: string }> = ({ url }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
    <planeGeometry args={[3, 3 * (9/16)]} /> {/* Approximate aspect */}
    <meshBasicMaterial map={useMemo(() => new THREE.TextureLoader().load(url), [url])} transparent opacity={0.5} />
  </mesh>
);

const FaceReference: React.FC = () => (
   <mesh position={[0, 0, 0]}>
     <sphereGeometry args={[0.8, 32, 32]} />
     <meshStandardMaterial color="#333" transparent opacity={0.3} wireframe />
   </mesh>
);

// --- Main Object Wrapper ---

const SceneObjectWrapper: React.FC<{ object: SceneObject; isSelected: boolean; onSelect: () => void }> = ({ object, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Group>(null);
  const asset = useStore.getState().assets.find(a => a.id === object.assetId);
  const assetUrl = asset ? asset.url : object.url || '';

  const renderContent = () => {
    // 1. PRIMITIVES
    if (object.type === 'PRIMITIVE') {
      const color = object.color || '#cccccc';
      const material = <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />;
      switch (object.primitiveType) {
        case 'SPHERE': return <mesh>{material}<sphereGeometry args={[0.5, 32, 32]} /></mesh>;
        case 'CYLINDER': return <mesh>{material}<cylinderGeometry args={[0.5, 0.5, 1, 32]} /></mesh>;
        case 'PLANE': return <mesh rotation={[-Math.PI / 2, 0, 0]}>{material}<planeGeometry args={[1, 1]} /></mesh>;
        case 'CUBE': 
        default: return <mesh>{material}<boxGeometry args={[1, 1, 1]} /></mesh>;
      }
    }
    
    // 2. 3D TEXT
    if (object.type === 'TEXT') {
      return (
        <Text fontSize={object.fontSize || 0.5} color={object.color || '#ffffff'} anchorX="center" anchorY="middle">
          {object.content || 'Text'}
        </Text>
      );
    }

    // 3. ASSETS
    if (!assetUrl) return <mesh><boxGeometry /><meshBasicMaterial color="red" wireframe /></mesh>;

    switch (object.type) {
      case AssetType.MODEL:
        return <Gltf src={assetUrl} />;
      case AssetType.IMAGE:
        return <Image url={assetUrl} scale={[1, 1, 1]} transparent side={THREE.DoubleSide} />;
      case AssetType.VIDEO:
        return (
          <React.Suspense fallback={<mesh><planeGeometry /><meshBasicMaterial color="gray" /></mesh>}>
            <VideoMesh url={assetUrl} videoProps={object.videoProps} />
          </React.Suspense>
        );
      case AssetType.AUDIO:
        return <AudioVisualizer />;
      default:
        return null;
    }
  };

  return (
    <group 
      ref={meshRef}
      position={[object.position.x, object.position.y, object.position.z]} 
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {renderContent()}
      {isSelected && (
        <mesh>
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

export const EditorCanvas: React.FC = () => {
  const { sceneObjects, selectedObjectId, selectObject, updateObject, currentProject } = useStore();
  const transformRef = useRef<any>(null);

  const handleTransformEnd = () => {
    if (transformRef.current && selectedObjectId) {
      const { position, rotation, scale } = transformRef.current.object;
      updateObject(selectedObjectId, {
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
        scale: { x: scale.x, y: scale.y, z: scale.z },
      });
    }
  };

  return (
    <div className="w-full h-full bg-[#111] relative">
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#111111']} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
        
        <Grid infiniteGrid fadeDistance={50} fadeStrength={5} cellColor="#333" sectionColor="#444" />

        {/* References */}
        {currentProject?.experienceType === ExperienceType.IMAGE && currentProject.targetImage && (
          <TargetImageReference url={currentProject.targetImage} />
        )}
        {currentProject?.experienceType === ExperienceType.FACE && (
          <FaceReference />
        )}

        {/* Scene Objects */}
        <group>
          {sceneObjects.map(obj => {
             const isSelected = obj.id === selectedObjectId;
             if (isSelected) {
               return (
                 <TransformControls 
                    key={obj.id}
                    ref={transformRef}
                    mode="translate"
                    onMouseUp={handleTransformEnd}
                 >
                   <SceneObjectWrapper object={obj} isSelected={true} onSelect={() => {}} />
                 </TransformControls>
               );
             }
             return <SceneObjectWrapper key={obj.id} object={obj} isSelected={false} onSelect={() => selectObject(obj.id)} />;
          })}
        </group>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};
