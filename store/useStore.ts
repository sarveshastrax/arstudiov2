
import { create } from 'zustand';
import { User, Project, SceneObject, Asset, UserRole, ProjectStatus, AssetType, ProjectVisibility, ExperienceType } from '../types';

type ViewMode = 'EDITOR' | 'AR' | 'CODE';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;

  // UI State
  activeViewMode: ViewMode;
  isSettingsModalOpen: boolean;
  isPublishModalOpen: boolean;
  setActiveViewMode: (mode: ViewMode) => void;
  setSettingsModalOpen: (isOpen: boolean) => void;
  setPublishModalOpen: (isOpen: boolean) => void;

  // Dashboard
  projects: Project[];
  createProject: () => string;
  
  // Editor
  currentProject: Project | null;
  sceneObjects: SceneObject[];
  selectedObjectId: string | null;
  assets: Asset[];
  
  // Actions
  loadProject: (id: string) => void;
  updateProjectSettings: (settings: Partial<Project>) => void;
  publishProject: (data: { name: string; slug: string; visibility: ProjectVisibility }) => void;
  
  addObject: (obj: SceneObject) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  selectObject: (id: string | null) => void;
  deleteObject: (id: string) => void;
  addAsset: (file: File) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Mock Auth
  user: null,
  isAuthenticated: false,
  login: (email: string) => set({ 
    isAuthenticated: true, 
    user: { 
      id: 'u1', 
      email, 
      name: 'Admin User', 
      role: UserRole.ADMIN,
      avatarUrl: 'https://picsum.photos/100/100' 
    } 
  }),
  logout: () => set({ isAuthenticated: false, user: null }),

  // UI State
  activeViewMode: 'EDITOR',
  isSettingsModalOpen: false,
  isPublishModalOpen: false,
  setActiveViewMode: (mode) => set({ activeViewMode: mode }),
  setSettingsModalOpen: (isOpen) => set({ isSettingsModalOpen: isOpen }),
  setPublishModalOpen: (isOpen) => set({ isPublishModalOpen: isOpen }),

  // Mock Data
  projects: [
    {
      id: 'p1',
      name: 'Product Showcase: Sneaker',
      slug: 'product-sneaker-v1',
      thumbnail: 'https://picsum.photos/400/300?random=1',
      status: ProjectStatus.PUBLISHED,
      visibility: ProjectVisibility.PUBLIC,
      experienceType: ExperienceType.PLANE,
      updatedAt: '2023-10-25T10:30:00Z',
      views: 1240
    }
  ],

  createProject: () => {
    const newId = `p${Date.now()}`;
    const newProject: Project = {
      id: newId,
      name: 'Untitled Project',
      slug: `untitled-${Date.now()}`,
      thumbnail: 'https://picsum.photos/400/300?grayscale',
      status: ProjectStatus.DRAFT,
      visibility: ProjectVisibility.PRIVATE,
      experienceType: ExperienceType.PLANE,
      updatedAt: new Date().toISOString(),
      views: 0
    };
    set(state => ({ projects: [newProject, ...state.projects] }));
    return newId;
  },

  currentProject: null,
  sceneObjects: [],
  selectedObjectId: null,
  assets: [
    { id: 'a1', name: 'Logo.png', type: AssetType.IMAGE, url: 'https://picsum.photos/200/200', thumbnail: 'https://picsum.photos/200/200', size: '1.2MB' },
    { id: 'a2', name: 'Demo Video.mp4', type: AssetType.VIDEO, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail: 'https://picsum.photos/200/200?grayscale', size: '15.4MB' },
    { id: 'a3', name: 'Duck.glb', type: AssetType.MODEL, url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', thumbnail: 'https://picsum.photos/200/200?blur', size: '4.5MB' },
  ],

  loadProject: (id) => set((state) => {
    const project = state.projects.find(p => p.id === id);
    if (!project) return {};
    
    // Only reset if loading a different project or if empty
    if (state.currentProject?.id === id) return {};

    return {
      currentProject: project,
      sceneObjects: [
        {
          id: 'obj1',
          name: 'Base Cube',
          type: 'PRIMITIVE',
          primitiveType: 'CUBE',
          position: { x: 0, y: 0.5, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          color: '#6366f1',
          visible: true
        }
      ],
      selectedObjectId: null,
      activeViewMode: 'EDITOR'
    };
  }),

  updateProjectSettings: (settings) => set((state) => {
    if (!state.currentProject) return {};
    const updated = { ...state.currentProject, ...settings };
    return {
      currentProject: updated,
      projects: state.projects.map(p => p.id === updated.id ? updated : p)
    };
  }),

  publishProject: ({ name, slug, visibility }) => set((state) => {
    if (!state.currentProject) return {};
    const updated = { 
      ...state.currentProject, 
      name, 
      slug, 
      visibility, 
      status: ProjectStatus.PUBLISHED 
    };
    return {
      currentProject: updated,
      projects: state.projects.map(p => p.id === updated.id ? updated : p),
      isPublishModalOpen: false
    };
  }),

  addObject: (obj) => set((state) => ({ sceneObjects: [...state.sceneObjects, obj], selectedObjectId: obj.id })),
  
  updateObject: (id, updates) => set((state) => ({
    sceneObjects: state.sceneObjects.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
  })),

  selectObject: (id) => set({ selectedObjectId: id }),
  
  deleteObject: (id) => set((state) => ({
    sceneObjects: state.sceneObjects.filter(obj => obj.id !== id),
    selectedObjectId: null
  })),

  addAsset: (file) => set((state) => {
    let type = AssetType.IMAGE;
    if (file.type.includes('video')) type = AssetType.VIDEO;
    if (file.type.includes('audio')) type = AssetType.AUDIO;
    if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) type = AssetType.MODEL;

    const newAsset: Asset = {
      id: `a-${Date.now()}`,
      name: file.name,
      type,
      url: URL.createObjectURL(file), 
      thumbnail: type === AssetType.IMAGE ? URL.createObjectURL(file) : (type === AssetType.VIDEO ? 'https://picsum.photos/200/200?grayscale' : 'https://picsum.photos/200/200?blur=2'),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    };

    return { assets: [newAsset, ...state.assets] };
  })
}));
