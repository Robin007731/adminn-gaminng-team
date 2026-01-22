
import React from 'react';
import { User, Tournament, ChatMessage } from '../types';
import { ICONS } from '../constants';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

interface Props {
  users: User[];
  tournaments: Tournament[];
  chat: ChatMessage[];
}

const Dashboard: React.FC<Props> = ({ users, tournaments, chat }) => {
  const activeTournaments = tournaments.filter(t => t.status === 'active').length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;

  const chartData = [
    { name: 'Lun', users: 120, activity: 40 },
    { name: 'Mar', users: 150, activity: 55 },
    { name: 'Mie', users: 140, activity: 65 },
    { name: 'Jue', users: 180, activity: 80 },
    { name: 'Vie', users: 210, activity: 110 },
    { name: 'Sab', users: 250, activity: 140 },
    { name: 'Dom', users: 230, activity: 120 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Jugadores', value: users.length, icon: ICONS.Users, trend: '+12%' },
          { label: 'Torneos Activos', value: activeTournaments, icon: ICONS.Tournament, trend: '+2' },
          { label: 'Mensajes Hoy', value: chat.length, icon: ICONS.Chat, trend: '+45' },
          { label: 'Usuarios Baneados', value: bannedUsers, icon: ICONS.Alert, trend: '-1' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#FFD700]/10 rounded-lg text-[#FFD700]">{stat.icon}</div>
              <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
            </div>
            <div>
              <p className="text-zinc-500 text-sm">{stat.label}</p>
              <h3 className="text-3xl font-orbitron font-black">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-orbitron flex items-center gap-2">
              <span className="text-[#FFD700]">{ICONS.Stats}</span> ACTIVIDAD SEMANAL
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }} itemStyle={{ color: '#FFD700' }} />
                <Area type="monotone" dataKey="users" stroke="#FFD700" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col">
          <h3 className="text-lg font-bold font-orbitron mb-6 flex items-center gap-2">
            <span className="text-[#FFD700]">{ICONS.Chat}</span> CHAT RECIENTE
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-72 pr-2">
            {chat.slice(-5).reverse().map((msg) => (
              <div key={msg.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-[#FFD700]">{msg.senderNick || msg.userNick}</span>
                  <span className="text-[10px] text-zinc-600">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 line-clamp-2">{msg.texto || msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
