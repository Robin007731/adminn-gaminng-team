
export interface User {
  id: string;
  nick: string;
  email: string;
  puntos: number; // Changed from xp to puntos
  role: 'admin' | 'user';
  status: 'active' | 'banned'; // Changed from isBanned to status
  avatar: string;
}

export interface Tournament {
  id: string;
  nombre: string; // Changed from name to nombre
  description: string;
  capacidad: number; // Changed from maxCapacity to capacidad
  inscritos_count: number; // Changed from enrolledCount to inscritos_count
  bracketUrl: string;
  status: 'active' | 'finished';
  players: string[]; // User IDs
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  userId?: string;
  senderId?: string; // Client uses senderId
  userNick?: string;
  senderNick?: string; // Client uses senderNick
  text?: string;
  texto?: string; // Client uses texto
  timestamp: number;
  tipo?: string;
}

export enum AdminTab {
  DASHBOARD = 'dashboard',
  TOURNAMENTS = 'tournaments',
  MODERATION = 'moderation',
  USERS = 'users'
}
