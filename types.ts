
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum ProjectVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED'
}

export enum ExperienceType {
  PLANE = 'PLANE', // World Tracking
  IMAGE = 'IMAGE', // Image Target
  FACE = 'FACE',   // Face Tracking
  GEO = 'GEO'      // Geo Location
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  experienceType: ExperienceType;
  targetImage?: string; // URL for image target
  geoLocation?: GeoLocation; // For Geo experience
  updatedAt: string;
  views: number;
}

export enum AssetType {
  MODEL = 'MODEL',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  thumbnail: string;
  size: string;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export type PrimitiveType = 'CUBE' | 'SPHERE' | 'CYLINDER' | 'PLANE';

export interface VideoProps {
  loop: boolean;
  autoplay: boolean;
  chromaKey: boolean;
  chromaColor: string;
  threshold: number;
}

export interface AudioProps {
  loop: boolean;
  autoplay: boolean;
  volume: number;
}

export interface SceneObject {
  id: string;
  name: string;
  type: AssetType | 'PRIMITIVE' | 'TEXT';
  primitiveType?: PrimitiveType;
  assetId?: string;
  content?: string; // For 3D Text
  fontSize?: number;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  color?: string;
  visible: boolean;
  // Media Props
  videoProps?: VideoProps;
  audioProps?: AudioProps;
}
