export interface Artwork {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  createdAt: string;
  color?: string;
  user?: { name: string };
  comments?: Array<{
    id: string;
    content: string;
    user: { name: string };
    createdAt: string;
  }>;
}

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
