export interface Artwork {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  createdAt: string;
  color?: string;
  isPublic?: boolean;
  user?: { name: string; avatar?: string; familyCode?: string };
  comments?: Array<{
    id: string;
    content: string;
    user: { name: string; avatar?: string };
    createdAt: string;
  }>;
}

export interface UserStats {
  artworkCount: number;
  commentCount: number;
  streak: number;
}

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  earned: boolean;
}

export interface CalendarRecord {
  date: string;
  count: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  artworkCount: number;
}

// When using Vite proxy, API calls should just go to relative paths e.g. /api/...
export const API_BASE_URL = '';
