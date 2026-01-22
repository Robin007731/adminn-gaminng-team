
import React from 'react';
import { 
  LayoutDashboard, 
  Trophy, 
  MessageSquare, 
  Users, 
  Trash2, 
  Plus, 
  UserX, 
  UserCheck, 
  TrendingUp, 
  ShieldAlert,
  Edit2
} from 'lucide-react';

export const COLORS = {
  neonYellow: '#FFD700',
  zinc950: '#09090b',
  zinc900: '#18181b',
  zinc800: '#27272a',
  zinc700: '#3f3f46'
};

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Tournament: <Trophy size={20} />,
  Chat: <MessageSquare size={20} />,
  Users: <Users size={20} />,
  Delete: <Trash2 size={18} />,
  Add: <Plus size={20} />,
  Ban: <UserX size={18} />,
  Unban: <UserCheck size={18} />,
  Stats: <TrendingUp size={18} />,
  Alert: <ShieldAlert size={18} />,
  Edit: <Edit2 size={16} />
};
