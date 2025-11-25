import { create } from 'zustand';
import client from '../api/client';
import { User, Project, SceneObject, Asset, UserRole, ProjectStatus, AssetType, ProjectVisibility, ExperienceType } from '../types';

type ViewMode = 'EDITOR' | 'AR' | 'CODE';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
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
  fetchProjects: () => Promise<void>;
  createProject: () => Promise<string>;
  
  // Editor
  currentProject: Project | null;
  sceneObjects: SceneObject[];
  selectedObjectId: string | null;
  assets: Asset[];
  
  // Actions
  loadProject: (id: string) => Promise<void>;
  updateProjectSettings: (settings: Partial<Project>) => Promise<void>;
  publishProject: (data: { name: string; slug: string; visibility: ProjectVisibility }) => Promise<void>;
  
  addObject: (obj: SceneObject) => Promise<void>;
  updateObject: (id: string, updates: Partial<SceneObject>) => Promise<void>;
  selectObject: (id: string | null) => void;
  deleteObject: (id: string) => Promise<void>;
  fetchAssets: () => Promise<void>;
  addAsset: (file: File) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (email: string) => {
    // Note: In a real app, we'd pass password too
    try {
      const res = await client.post('/auth/login', { email, password: 'password' }); 
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      set({ isAuthenticated: true, user: res.data.user });
    } catch (e) {
      console.error('Login failed', e);
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },

  // UI
  activeViewMode: 'EDITOR',
  isSettingsModalOpen: false,
  isPublishModalOpen: false,
  setActiveViewMode: (mode) => set({ activeViewMode: mode }),
  setSettingsModalOpen: (isOpen) => set({ isSettingsModalOpen: isOpen }),
  setPublishModalOpen: (isOpen) => set({ isPublishModalOpen: isOpen }),

  // Data
  projects: [],
  currentProject: null,
  sceneObjects: [],
  selectedObjectId: null,
  assets: [],

  fetchProjects: async () => {
    try {
      const res = await client.get('/projects');
      set({ projects: res.data });
    } catch (e) { console.error(e); }
  },

  createProject: async () => {
    try {
      const res = await client.post('/projects');
      set(state => ({ projects: [res.data, ...state.projects] }));
      return res.data.id;
    } catch (e) { console.error(e); return ''; }
  },

  loadProject: async (id) => {
    try {
      const res = await client.get(`/projects/${id}`);
      set({ 
        currentProject: res.data, 
        sceneObjects: res.data.sceneObjects,
        selectedObjectId: null,
        activeViewMode: 'EDITOR'
      });
      // Also fetch assets when loading editor
      get().fetchAssets();
    } catch (e) { console.error(e); }
  },

  updateProjectSettings: async (settings) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    try {
      const res = await client.put(`/projects/${currentProject.id}`, settings);
      set({ currentProject: { ...currentProject, ...res.data } });
    } catch (e) { console.error(e); }
  },

  publishProject: async ({ name, slug, visibility }) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    try {
      const res = await client.put(`/projects/${currentProject.id}`, { name, slug, visibility, status: ProjectStatus.PUBLISHED });
      set(state => ({
        currentProject: { ...state.currentProject!, ...res.data },
        projects: state.projects.map(p => p.id === res.data.id ? res.data : p),
        isPublishModalOpen: false
      }));
    } catch (e) { console.error(e); }
  },

  addObject: async (obj) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    try {
      // Optimistic update
      const tempId = obj.id;
      set(state => ({ sceneObjects: [...state.sceneObjects, obj], selectedObjectId: obj.id }));
      
      const res = await client.post(`/projects/${currentProject.id}/objects`, obj);
      
      // Replace temp obj with server obj
      set(state => ({
        sceneObjects: state.sceneObjects.map(o => o.id === tempId ? res.data : o),
        selectedObjectId: res.data.id
      }));
    } catch (e) { console.error(e); }
  },

  updateObject: async (id, updates) => {
    set(state => ({
      sceneObjects: state.sceneObjects.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
    }));
    // Debounce this in production, but for now:
    try {
      await client.put(`/objects/${id}`, updates);
    } catch (e) { console.error(e); }
  },

  selectObject: (id) => set({ selectedObjectId: id }),
  
  deleteObject: async (id) => {
    try {
      await client.delete(`/objects/${id}`);
      set(state => ({
        sceneObjects: state.sceneObjects.filter(obj => obj.id !== id),
        selectedObjectId: null
      }));
    } catch (e) { console.error(e); }
  },

  fetchAssets: async () => {
    try {
      const res = await client.get('/assets');
      set({ assets: res.data });
    } catch (e) { console.error(e); }
  },

  addAsset: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await client.post('/assets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set(state => ({ assets: [res.data, ...state.assets] }));
    } catch (e) { console.error(e); }
  }
}));
