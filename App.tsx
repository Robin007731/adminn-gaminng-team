
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
  increment,
  getDoc
} from './services/firebase';
import Dashboard from './components/Dashboard';
import TournamentManager from './components/TournamentManager';
import ChatModerator from './components/ChatModerator';
import UserManager from './components/UserManager';

const MASTER_KEY = "Admin12345";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.DASHBOARD);
  const [users, setUsers] = useState<User[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Auth state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('isZGA') === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [accessKey, setAccessKey] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Simular carga de sistema inicial
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Real-time Listeners (Only if isAdmin)
  useEffect(() => {
    if (!isAdmin) return;

    // Users Listener
    const unsubUsers = onSnapshot(collection(db, "usuarios"), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(data);
      },
      (error) => console.error("Firestore Permission Error (Users): Check security rules.", error)
    );

    // Tournaments Listener
    const unsubTournaments = onSnapshot(collection(db, "torneos"), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
        setTournaments(data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      },
      (error) => console.error("Firestore Permission Error (Tournaments):", error)
    );

    // Chat Listener
    const unsubChat = onSnapshot(collection(db, "chats"), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        setChat(data.sort((a, b) => a.timestamp - b.timestamp));
      },
      (error) => console.error("Firestore Permission Error (Chat):", error)
    );

    return () => {
      unsubUsers();
      unsubTournaments();
      unsubChat();
    };
  }, [isAdmin]);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError('');

    setTimeout(() => {
      if (accessKey === MASTER_KEY) {
        setIsAdmin(true);
        sessionStorage.setItem('isZGA', 'true');
      } else {
        setAuthError('CLAVE INCORRECTA. ACCESO DENEGADO.');
        setAccessKey('');
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isZGA');
  };

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
    await addDoc(collection(db, "chats"), {
      texto: "📢 AVISO: " + texto,
      senderNick: "SISTEMA",
      senderId: "admin_system",
      tipo: "global",
      timestamp: Date.now()
    });
  };

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="font-orbitron text-[#FFD700] tracking-[0.3em] text-sm animate-pulse">INICIALIZANDO COMANDO CENTRAL</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center p-6 font-orbitron">
        <div className="w-full max-w-md bg-zinc-900 border-2 border-[#FFD700]/20 rounded-3xl p-10 shadow-[0_0_50px_rgba(255,215,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50"></div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#FFD700] rounded-2xl flex items-center justify-center text-black font-black text-4xl mx-auto mb-6 shadow-[0_0_30px_rgba(255,215,0,0.3)]">Z</div>
            <h1 className="text-2xl font-black text-white tracking-tighter">ZONA GAMER</h1>
            <p className="text-[#FFD700] text-[10px] tracking-[0.4em] mt-2 opacity-70 uppercase">Acceso Restringido</p>
          </div>
          
          <form onSubmit={handleAccess} className="space-y-6">
            <div className="relative">
              <input 
                type="password" 
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                autoFocus
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 text-center text-2xl tracking-[0.5em] text-[#FFD700] outline-none focus:border-[#FFD700] transition-all placeholder:text-zinc-800"
                placeholder="••••••••"
                required
                disabled={isVerifying}
              />
              <div className="mt-2 text-center">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Ingrese Master Key</label>
              </div>
            </div>

            {authError && (
              <div className="text-red-500 text-[10px] font-black bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center animate-bounce">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={isVerifying}
              className={`w-full bg-[#FFD700] text-black font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${isVerifying ? 'opacity-50' : 'hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:brightness-110'}`}
            >
              {isVerifying ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'AUTORIZAR ACCESO'
              )}
            </button>
          </form>
          
          <p className="text-center text-zinc-700 text-[9px] mt-10 tracking-widest uppercase font-bold">Encrypted connection established</p>
        </div>
      </div>
    );
  }

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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 text-zinc-500 hover:text-red-500 transition-colors group">
             <div className="w-10 h-10 rounded-full border-2 border-[#FFD700] flex items-center justify-center bg-zinc-950 text-[#FFD700] group-hover:border-red-500 group-hover:text-red-500">
                {ICONS.Ban}
             </div>
             {isSidebarOpen && <div className="text-left"><p className="text-[10px] font-black uppercase tracking-widest">Desconectar</p><p className="text-[9px] opacity-40">ADMIN SESIÓN</p></div>}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#09090b] relative">
        <header className="sticky top-0 z-10 flex items-center justify-between p-6 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
          <h2 className="text-2xl font-orbitron font-bold uppercase tracking-wide">{activeTab.replace('_', ' ')}</h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] rounded-full text-[10px] font-black uppercase tracking-tighter">Estado: Online</span>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
