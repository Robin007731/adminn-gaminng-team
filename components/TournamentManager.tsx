
import React, { useState } from 'react';
import { Tournament } from '../types';
import { ICONS } from '../constants';
import { geminiService } from '../services/geminiService';

interface Props {
  tournaments: Tournament[];
  onCreate: (tournament: any) => void;
  onDelete: (id: string) => void;
  onReset: (id: string) => void;
}

const TournamentManager: React.FC<Props> = ({ tournaments, onCreate, onDelete, onReset }) => {
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', // Client logic uses 'nombre'
    description: '',
    capacidad: 16, // Client logic uses 'capacidad'
    bracketUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({ nombre: '', description: '', capacidad: 16, bracketUrl: '' });
    setShowModal(false);
  };

  const handleGenerateAI = async () => {
    if (!formData.nombre) return;
    setIsGenerating(true);
    const desc = await geminiService.generateTournamentDescription(formData.nombre);
    setFormData(prev => ({ ...prev, description: desc || '' }));
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <p className="text-zinc-400">Administra, crea y monitorea los torneos activos.</p>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#FFD700] text-black font-black px-6 py-2 rounded-lg flex items-center gap-2 hover:brightness-110 transition-all font-orbitron text-sm"
        >
          {ICONS.Add} PUBLICAR TORNEO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#FFD700]/50 transition-colors group">
            <div className={`h-2 w-full ${t.status === 'active' ? 'bg-[#FFD700]' : 'bg-zinc-700'}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold font-orbitron text-[#FFD700] group-hover:neon-glow transition-all">
                  {t.nombre}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  t.status === 'active' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-sm text-zinc-400 line-clamp-2 mb-6 h-10">{t.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 uppercase tracking-widest font-bold">Inscritos</span>
                  <span className="text-white font-bold">{t.inscritos_count || 0} / {t.capacidad}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FFD700] h-full rounded-full" 
                    style={{ width: `${((t.inscritos_count || 0) / t.capacidad) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => onReset(t.id)} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-md transition-colors border border-zinc-700">RESETEAR</button>
                <button onClick={() => onDelete(t.id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-md transition-colors border border-red-900/30">{ICONS.Delete}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-[#FFD700]/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-orbitron font-bold text-[#FFD700]">CREAR TORNEO</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nombre del Torneo</label>
                <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors" placeholder="Ej: Masters Warzone 2024" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase">Descripción</label>
                  <button type="button" disabled={isGenerating} onClick={handleGenerateAI} className="text-[10px] text-[#FFD700] flex items-center gap-1 hover:underline disabled:opacity-50">✨ Generar con IA</button>
                </div>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors resize-none" placeholder="Describe las reglas y premios..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Cupos Máx. (Capacidad)</label>
                  <input required type="number" value={formData.capacidad} onChange={e => setFormData({...formData, capacidad: parseInt(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">URL Bracket</label>
                  <input required type="url" value={formData.bracketUrl} onChange={e => setFormData({...formData, bracketUrl: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors" placeholder="Challonge link..." />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-[#FFD700] text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all font-orbitron">PUBLICAR EN ZONA GAMER</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentManager;
