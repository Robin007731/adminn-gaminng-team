
import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { ICONS } from '../constants';
import { geminiService } from '../services/geminiService';

interface Props {
  chat: ChatMessage[];
  onDelete: (id: string) => void;
  onSendSystem: (text: string) => void;
}

const ChatModerator: React.FC<Props> = ({ chat, onDelete, onSendSystem }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [systemText, setSystemText] = useState('');

  const runAIScan = async () => {
    setIsAnalyzing(true);
    const recentMessages = chat.slice(-10).map(m => `${m.senderNick || m.userNick}: ${m.texto || m.text}`);
    if (recentMessages.length === 0) {
      setIsAnalyzing(false);
      return;
    }
    const result = await geminiService.analyzeChatSafety(recentMessages);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSendAnuncio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!systemText.trim()) return;
    onSendSystem(systemText);
    setSystemText('');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-orbitron font-bold">CONTROL MAESTRO DE CHAT</h3>
          <p className="text-zinc-500 text-sm">Monitoreo en tiempo real del flujo de comunicación.</p>
        </div>
        <button 
          onClick={runAIScan}
          disabled={isAnalyzing}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-bold border border-zinc-700 transition-all disabled:opacity-50"
        >
          ✨ {isAnalyzing ? 'ESCANEANDO...' : 'IA SENTINEL SCAN'}
        </button>
      </div>

      <div className="bg-zinc-900 border border-[#FFD700]/30 p-4 rounded-2xl">
        <h4 className="text-xs font-black text-[#FFD700] uppercase mb-3 tracking-widest flex items-center gap-2">
          {ICONS.Alert} Enviar Anuncio Global
        </h4>
        <form onSubmit={handleSendAnuncio} className="flex gap-2">
          <input type="text" value={systemText} onChange={(e) => setSystemText(e.target.value)} placeholder="Escribe un mensaje que todos los gamers verán..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-[#FFD700] outline-none transition-colors" />
          <button type="submit" className="bg-[#FFD700] text-black font-black px-4 py-2 rounded-lg text-xs font-orbitron hover:brightness-110">ENVIAR PUSH</button>
        </form>
      </div>

      {analysis && (
        <div className={`p-4 rounded-xl border flex items-start gap-4 animate-in slide-in-from-top-2 duration-300 ${analysis.isToxic ? 'bg-red-950/20 border-red-500/50' : 'bg-green-950/20 border-green-500/50'}`}>
          <div className={`p-2 rounded-lg ${analysis.isToxic ? 'bg-red-500 text-black' : 'bg-green-500 text-black'}`}>{ICONS.Alert}</div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-tighter">INFORME DE SENTINEL: {analysis.riskLevel} RIESGO</h4>
            <p className="text-sm opacity-80">{analysis.reason}</p>
            {analysis.suggestedAction && <p className="text-xs mt-1 font-bold italic text-[#FFD700]">Sugerencia: {analysis.suggestedAction}</p>}
          </div>
          <button onClick={() => setAnalysis(null)} className="ml-auto text-zinc-500">✕</button>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Mensaje</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {chat.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-zinc-500 italic">No hay mensajes recientes</td></tr>
              ) : (
                chat.slice().reverse().map((msg) => (
                  <tr key={msg.id} className={`hover:bg-zinc-800/30 transition-colors group ${msg.senderId === 'admin_system' ? 'bg-[#FFD700]/5' : ''}`}>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-sm ${(msg.senderId === 'admin_system' || msg.userId === 'admin_system') ? 'text-[#FFD700] animate-pulse' : 'text-zinc-300'}`}>
                        {msg.senderNick || msg.userNick}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm max-w-md truncate md:whitespace-normal ${(msg.senderId === 'admin_system' || msg.userId === 'admin_system') ? 'text-white font-bold' : 'text-zinc-400'}`}>
                        {msg.texto || msg.text}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onDelete(msg.id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Eliminar Mensaje">{ICONS.Delete}</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChatModerator;
