/**
 * Types & Interfaces globaux de l'application (Mappés sur les entités Doctrine)
 */

interface User {
  id: number;
  email: string;
  username: string;
  roles: string[];
  avatar?: string | null;
}

interface Space {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  isCapsule: boolean;
  state: 'open' | 'archive' | 'trash';
  createdAt: string;
  slug: string;
  is_collaborative?: boolean | null;
  owner: User;
}

interface SpaceMember {
  id: number;
  role: string;
  joinedAt: string;
  user: User;
  space: Space;
  rights?: any | null;
}

interface Todo {
  id: number;
  name: string;
  isCompleted: boolean;
  isImportant: boolean;
  dueDate?: string | null;
  createdAt: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  updatedAt: string;
}

interface Folder {
  id: number;
  name: string;
  state: string;
  createdAt: string;
  files?: File[];
}

interface File {
  id: number;
  name: string;
  originalName: string;
  path: string;
  size: number;
  type: string;
  mimeType: string;
  isPinned: boolean;
  uploadedAt: string;
}

interface UserPreference {
  id: number;
  prefKey: string;
  prefValue: string;
}

interface TrashItem {
  id: number;
  type: 'note' | 'todo' | 'file' | 'folder' | 'space';
  name: string;
  icon: string;
  spaceName: string | null;
  deletedAt: string;
  createdAt: string;
}

export type {
  User,
  Space,
  SpaceMember,
  Todo,
  Note,
  Folder,
  File,
  UserPreference,
  TrashItem,
};
