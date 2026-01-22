
import React, { useState, useEffect } from 'react';
import { User, Tournament, ChatMessage, AdminTab } from './types';
import { ICONS } from './constants';
import { 
  db, 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  increment 
} from './services/firebase';
import Dashboard from './components/Dashboard';
import TournamentManager from './components/TournamentManager';
import ChatModerator from './components/ChatModerator';
import UserManager from './components/UserManager';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.DASHBOARD);
  const [users, setUsers] = useState<User[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "torneos"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
      setTournaments(data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chats"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setChat(data.sort((a, b) => a.timestamp - b.timestamp));
    });
    return () => unsub();
  }, []);

  const deleteMessage = async (id: string) => {
    await deleteDoc(doc(db, "chats", id));
  };

  const createTournament = async (newT: any) => {
    await addDoc(collection(db, "torneos"), {
      nombre: newT.nombre,
      description: newT.description,
      capacidad: newT.capacidad,
      inscritos_count: 0,
      players: [],
      createdAt: Date.now(),
      status: 'active',
      bracketUrl: newT.bracketUrl || ""
    });
  };

  const deleteTournament = async (id: string) => {
    await deleteDoc(doc(db, "torneos", id));
  };

  const resetTournament = async (id: string) => {
    await updateDoc(doc(db, "torneos", id), {
      players: [],
      inscritos_count: 0
    });
  };

  const updateXP = async (userId: string, amount: number) => {
    // Client expects 'puntos'
    await updateDoc(doc(db, "usuarios", userId), {
      puntos: increment(amount)
    });
  };

  const toggleBan = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    await updateDoc(doc(db, "usuarios", userId), {
      status: newStatus
    });
  };

  const enviarAnuncio = async (texto: string) => {
    // Matching the Client's system message logic
    await addDoc(collection(db, "chats"), {
      texto: "📢 AVISO: " + texto,
      senderNick: "SISTEMA",
      senderId: "admin_system",
      tipo: "global",
      timestamp: Date.now()
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case AdminTab.DASHBOARD:
        return <Dashboard users={users} tournaments={tournaments} chat={chat} />;
      case AdminTab.TOURNAMENTS:
        return (
          <TournamentManager 
            tournaments={tournaments} 
            onCreate={createTournament} 
            onDelete={deleteTournament}
            onReset={resetTournament}
          />
        );
      case AdminTab.MODERATION:
        return <ChatModerator chat={chat} onDelete={deleteMessage} onSendSystem={enviarAnuncio} />;
      case AdminTab.USERS:
        return <UserManager users={users} onUpdateXP={updateXP} onToggleBan={toggleBan} />;
      default:
        return <Dashboard users={users} tournaments={tournaments} chat={chat} />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col transition-all duration-300 bg-zinc-900 border-r border-zinc-800`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#FFD700] flex items-center justify-center text-black font-bold font-orbitron">Z</div>
          {isSidebarOpen && <h1 className="text-xl font-orbitron font-black tracking-tighter text-[#FFD700]">ZONA <span className="text-white">GAMER</span></h1>}
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2">
          {[
            { id: AdminTab.DASHBOARD, label: 'Dashboard', icon: ICONS.Dashboard },
            { id: AdminTab.TOURNAMENTS, label: 'Torneos', icon: ICONS.Tournament },
            { id: AdminTab.MODERATION, label: 'Chat Moderación', icon: ICONS.Chat },
            { id: AdminTab.USERS, label: 'Usuarios', icon: ICONS.Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-[#FFD700] text-black font-bold shadow-lg shadow-yellow-500/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
            >
              <span className={activeTab === item.id ? 'text-black' : 'text-[#FFD700]'}>{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 p-2">
            <img src="https://picsum.photos/seed/admin/100" className="w-10 h-10 rounded-full border-2 border-[#FFD700]" alt="Admin" />
            {isSidebarOpen && <div className="overflow-hidden"><p className="text-sm font-bold truncate text-[#FFD700]">Admin Maestro</p><p className="text-xs text-zinc-500 truncate">admin@zonagamer.com</p></div>}
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#09090b] relative">
        <header className="sticky top-0 z-10 flex items-center justify-between p-6 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
          <h2 className="text-2xl font-orbitron font-bold uppercase tracking-wide">{activeTab.replace('_', ' ')}</h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] rounded-full text-xs font-bold uppercase">Admin Mode</span>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
