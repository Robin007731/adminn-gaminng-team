
import React from 'react';
import { User } from '../types';
import { ICONS } from '../constants';

interface Props {
  users: User[];
  onUpdateXP: (id: string, amount: number) => void;
  onToggleBan: (id: string) => void;
}

const UserManager: React.FC<Props> = ({ users, onUpdateXP, onToggleBan }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-orbitron font-bold">BASE DE DATOS DE GAMERS</h3>
          <p className="text-zinc-500 text-sm">Control de economía (XP) y acceso a la plataforma.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Avatar / Nick</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Puntos XP</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right">Moderación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className={`hover:bg-zinc-800/30 transition-colors ${user.status === 'banned' ? 'opacity-60 bg-red-900/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar || 'https://picsum.photos/seed/user/100'} className="w-10 h-10 rounded-lg object-cover grayscale-[50%] group-hover:grayscale-0 border border-zinc-700" alt={user.nick} />
                      <div>
                        <p className="font-bold text-sm">{user.nick}</p>
                        <p className={`text-[10px] font-black uppercase ${user.role === 'admin' ? 'text-[#FFD700]' : 'text-zinc-600'}`}>
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-zinc-400">{user.email}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => onUpdateXP(user.id, -100)} className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 font-bold transition-all">-</button>
                      <span className="text-sm font-orbitron font-bold text-[#FFD700] min-w-[60px] text-center">{user.puntos || 0} XP</span>
                      <button onClick={() => onUpdateXP(user.id, 100)} className="w-8 h-8 flex items-center justify-center bg-[#FFD700]/10 hover:bg-[#FFD700]/20 rounded text-[#FFD700] font-bold transition-all">+</button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${user.status === 'banned' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                      {user.status === 'banned' ? 'Baneado' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onToggleBan(user.id)} className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${user.status === 'banned' ? 'bg-green-500 text-black hover:brightness-110' : 'bg-zinc-800 text-zinc-400 hover:bg-red-900/40 hover:text-red-500'}`} title={user.status === 'banned' ? "Quitar Baneo" : "Banear Usuario"}>
                        {user.status === 'banned' ? ICONS.Unban : ICONS.Ban}
                        <span className="hidden md:inline">{user.status === 'banned' ? 'REINCORPORAR' : 'BANEAR'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
