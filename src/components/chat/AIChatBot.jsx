import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles, ChevronRight, Clock, Plus, MessageSquare, ArrowLeft } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Bagaimana cara memisahkan uang pribadi & usaha?",
  "Berapa persen idealnya keuntungan ditabung?",
  "Apa itu arus kas (cashflow) yang sehat?",
];

// Pesan pembuka default
const initialMessage = {
  id: "init",
  role: "ai",
  content: "Halo! Aku KasBot. Ada yang bisa kubantu tentang keuangan usahamu hari ini?",
};

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("chat"); // 'chat' atau 'history'
  
  // State Sesi Chat (Menyimpan BANYAK tab chat)
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("kasflow-ai-sessions");
    return saved ? JSON.parse(saved) : [];
  });
  
  // State Sesi Aktif saat ini
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Simpan ke LocalStorage setiap kali ada perubahan pada sessions
  useEffect(() => {
    localStorage.setItem("kasflow-ai-sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Auto-scroll ke bawah
  useEffect(() => {
    if (isOpen && view === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sessions, activeSessionId, isOpen, view, isTyping]);

  // Ambil pesan dari sesi yang sedang aktif, atau kosong jika belum ada
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentMessages = activeSession ? activeSession.messages : [initialMessage];

  // Fungsi Buat Sesi Baru (Chat Kosong)
  const createNewChat = () => {
    setActiveSessionId(null);
    setView("chat");
  };

  // Fungsi Kirim Pesan
  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: "user", content: text };
    let currentSession = activeSessionId;

    // JIKA INI CHAT BARU (Belum ada Session ID)
    if (!currentSession) {
      const newSessionId = `session_${Date.now()}`;
      // Jadikan pertanyaan pertama sebagai Judul Chat (potong max 30 huruf)
      const title = text.length > 30 ? text.substring(0, 30) + "..." : text;
      
      const newSession = {
        id: newSessionId,
        title: title,
        date: new Date().toISOString(),
        messages: [initialMessage, userMsg]
      };
      
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
      currentSession = newSessionId;
    } else {
      // JIKA MELANJUTKAN CHAT YANG ADA
      setSessions(prev => prev.map(s => {
        if (s.id === currentSession) {
          return { ...s, messages: [...s.messages, userMsg] };
        }
        return s;
      }));
    }

    setInput("");
    setIsTyping(true);

    // Simulasi AI Berpikir
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        content: `Jawaban simulasi untuk: "${text}". Ini tersimpan di riwayat tersendiri! 🚀`,
      };
      
      setSessions(prev => prev.map(s => {
        if (s.id === currentSession) {
          return { ...s, messages: [...s.messages, aiMsg] };
        }
        return s;
      }));
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-28 md:bottom-24 right-4 md:right-8 z-[60] w-[calc(100vw-32px)] md:w-[380px] h-[500px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* HEADER CHAT (Bisa pindah tampilan) */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 flex justify-between items-center text-white shrink-0 shadow-md">
            <div className="flex items-center gap-2">
              {view === "history" ? (
                <button onClick={() => setView("chat")} className="p-1.5 hover:bg-white/20 rounded-full transition">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-indigo-100" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-sm">{view === "history" ? "Riwayat Obrolan" : "KasBot AI"}</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Tombol ke halaman Riwayat */}
              {view === "chat" && (
                <button onClick={() => setView("history")} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors tooltip" title="Riwayat Obrolan">
                  <Clock className="w-4 h-4" />
                </button>
              )}
              {/* Tombol Buat Chat Baru */}
              <button onClick={createNewChat} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors" title="Chat Baru">
                <Plus className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-white/30 mx-1"></div>
              <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ============================================== */}
          {/* TAMPILAN 1: RIWAYAT BANYAK CHAT */}
          {/* ============================================== */}
          {view === "history" && (
            <div className="flex-1 overflow-y-auto p-2 bg-slate-50">
              {sessions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-sm">Belum ada riwayat percakapan.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map(session => (
                    <button 
                      key={session.id}
                      onClick={() => { setActiveSessionId(session.id); setView("chat"); }}
                      className="w-full text-left p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-300 transition-colors flex flex-col gap-1"
                    >
                      <span className="text-sm font-bold text-slate-800 line-clamp-1">{session.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(session.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} • {session.messages.length - 1} Pesan
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================== */}
          {/* TAMPILAN 2: RUANG OBROLAN (CHAT ROOM) */}
          {/* ============================================== */}
          {view === "chat" && (
            <>
              {/* Area Percakapan */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-sm shadow-md" : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm shadow-sm"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-sm flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Template Pertanyaan (Hanya muncul jika chat baru) */}
              {currentMessages.length <= 1 && !isTyping && (
                <div className="px-3 pb-2 pt-1 bg-slate-50/50 shrink-0 overflow-x-auto no-scrollbar flex gap-2">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button key={idx} onClick={() => handleSend(q)} className="shrink-0 bg-white border border-indigo-100 text-indigo-600 text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1 shadow-sm">
                      {q} <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tanya KasBot..." className="flex-1 bg-transparent text-sm px-3 outline-none text-slate-700" />
                  <button type="submit" disabled={!input.trim() || isTyping} className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {/* --- TOMBOL FLOATING --- */}
      <button onClick={() => setIsOpen(true)} className={`fixed z-50 bottom-28 md:bottom-8 right-4 md:right-8 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all duration-300 group ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}>
        <Bot className="w-6 h-6 group-hover:animate-wiggle" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
      </button>
    </>
  );
}