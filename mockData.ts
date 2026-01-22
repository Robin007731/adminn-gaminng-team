
import { User, Tournament, ChatMessage } from './types';

// Fix: Updated properties 'xp' to 'puntos' and 'isBanned' to 'status' to match the User interface
export const initialUsers: User[] = [
  { id: '1', nick: 'ProGamer_X', email: 'pro@gamer.com', puntos: 2500, role: 'user', status: 'active', avatar: 'https://picsum.photos/seed/1/100' },
  { id: '2', nick: 'Z_Admin', email: 'admin@zonagamer.com', puntos: 9999, role: 'admin', status: 'active', avatar: 'https://picsum.photos/seed/2/100' },
  { id: '3', nick: 'ToxicOne', email: 'toxic@web.com', puntos: 450, role: 'user', status: 'banned', avatar: 'https://picsum.photos/seed/3/100' },
  { id: '4', nick: 'Lara_Shadow', email: 'lara@mail.com', puntos: 1200, role: 'user', status: 'active', avatar: 'https://picsum.photos/seed/4/100' },
  { id: '5', nick: 'SpeedyGonzales', email: 'speed@rush.com', puntos: 800, role: 'user', status: 'active', avatar: 'https://picsum.photos/seed/5/100' },
];

// Fix: Updated properties 'name' to 'nombre', 'maxCapacity' to 'capacidad', and 'enrolledCount' to 'inscritos_count' to match Tournament interface
export const initialTournaments: Tournament[] = [
  {
    id: 't1',
    nombre: 'Call of Duty: Neon Strike',
    description: 'El torneo más agresivo de la temporada.',
    capacidad: 32,
    inscritos_count: 14,
    bracketUrl: 'https://challonge.com/codneon',
    status: 'active',
    players: ['1', '4'],
    createdAt: Date.now() - 86400000
  },
  {
    id: 't2',
    nombre: 'LoL: Legends Cup',
    description: 'Demuestra quién es el rey de la grieta.',
    capacidad: 16,
    inscritos_count: 16,
    bracketUrl: 'https://challonge.com/lollegendscup',
    status: 'finished',
    players: ['1', '2', '4', '5'],
    createdAt: Date.now() - 172800000
  }
];

export const initialChat: ChatMessage[] = [
  { id: 'c1', userId: '1', userNick: 'ProGamer_X', text: '¡Alguien para jugar COD!', timestamp: Date.now() - 600000 },
  { id: 'c2', userId: '3', userNick: 'ToxicOne', text: 'Eres un noob...', timestamp: Date.now() - 300000 },
  { id: 'c3', userId: '4', userNick: 'Lara_Shadow', text: 'Ignórenlo, ¿a qué hora empieza el torneo?', timestamp: Date.now() - 100000 },
];
