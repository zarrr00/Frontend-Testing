import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles, ChevronRight, Clock, Plus, MessageSquare, ArrowLeft } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";
import { SUGGESTED_QUESTIONS, initialMessage } from "./data/mockData";
export default function AIChatBot() {
  const { theme } = useMode();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("chat"); 
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("kasflow-ai-sessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    localStorage.setItem("kasflow-ai-sessions", JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    if (isOpen && view === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sessions, activeSessionId, isOpen, view, isTyping]);
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentMessages = activeSession ? activeSession.messages : [initialMessage];
  const createNewChat = () => {
    setActiveSessionId(null);
    setView("chat");
  };
  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: "user", content: text };
    let currentSession = activeSessionId;
    if (!currentSession) {
      const newSessionId = `session_${Date.now()}`;
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
      setSessions(prev => prev.map(s => {
        if (s.id === currentSession) {
          return { ...s, messages: [...s.messages, userMsg] };
        }
        return s;
      }));
    }
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        content: `Halo, ini KasBot! Fitur AI beneran bakal segera hadir di sini. Pertanyaanmu: "${text}" sudah tercatat di sistem kami! 🚀`,
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
        <div className="fixed bottom-28 md:bottom-24 right-4 md:right-8 z-[60] w-[calc(100vw-32px)] md:w-[380px] h-[500px] max-h-[75vh] bg-card text-foreground rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 transition-colors">
          {/* HEADER CHAT */}
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
              {view === "chat" && (
                <button onClick={() => setView("history")} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors" title="Riwayat Obrolan">
                  <Clock className="w-4 h-4" />
                </button>
              )}
              <button onClick={createNewChat} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors" title="Chat Baru">
                <Plus className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-white/30 mx-1"></div>
              <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* VIEW: RIWAYAT */}
          {view === "history" && (
            <div className="flex-1 overflow-y-auto p-2 bg-background transition-colors">
              {sessions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-sm">Belum ada riwayat percakapan.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map(session => (
                    <button 
                      key={session.id}
                      onClick={() => { setActiveSessionId(session.id); setView("chat"); }}
                      className="w-full text-left p-3 bg-card border border-border rounded-xl shadow-sm hover:border-indigo-500/50 transition-colors flex flex-col gap-1"
                    >
                      <span className="text-sm font-bold line-clamp-1">{session.title}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(session.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} • {session.messages.length - 1} Pesan
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* VIEW: CHAT ROOM */}
          {view === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-background/50 space-y-4 transition-colors scrollbar-thin">
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === "user" 
                        ? "bg-indigo-600 text-white rounded-br-sm" 
                        : "bg-card border border-border text-foreground rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border p-4 rounded-2xl rounded-bl-sm flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Suggestions */}
              {currentMessages.length <= 1 && !isTyping && (
                <div className="px-3 pb-2 pt-1 bg-background/50 shrink-0 overflow-x-auto no-scrollbar flex gap-2">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button key={idx} onClick={() => handleSend(q)} className="shrink-0 bg-card border border-indigo-500/30 text-indigo-500 dark:text-indigo-400 text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-indigo-500/10 flex items-center gap-1 shadow-sm transition-colors">
                      {q} <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
              {/* Input Area */}
              <div className="p-3 bg-card border-t border-border shrink-0 transition-colors">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex items-center gap-2 bg-background border border-border p-1.5 rounded-full">
                  <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Tanya KasBot..." 
                    className="flex-1 bg-transparent text-sm px-3 outline-none text-foreground" 
                  />
                  <button type="submit" disabled={!input.trim() || isTyping} className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-90">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
      {/* FLOATING BUTTON */}
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed z-50 bottom-28 md:bottom-8 right-4 md:right-8 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all duration-300 group ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
      >
        <Bot className="w-6 h-6 group-hover:animate-bounce" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
      </button>
    </>
  );
}