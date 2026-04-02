import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMode } from "@/contexts/ModeContext";
import { Trophy, Sparkles, HeartPulse, Activity, Star, ChevronRight, CheckCircle, Flame, Medal, Lock, X } from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
export default function DesktopGamification() {
  const { mode } = useMode(); 
  const isPersonal = mode === 'personal';
  const themeColor = isPersonal ? 'text-purple-600' : 'text-blue-600';
  const [xp, setXp] = useState(850);
  // State misi menggunakan key translasi agar bisa berubah bahasa
  const [missions, setMissions] = useState([
    { id: 1, titleKey: "mission_daily_exp", xp: 20, done: true, defaultText: "Catat pengeluaran hari ini" },
    { id: 2, titleKey: "mission_review_budget", xp: 50, done: false, defaultText: "Review anggaran mingguan" },
    { id: 3, titleKey: "mission_save_budget", xp: 150, done: false, defaultText: "Simpan 10% sisa budget" },
  ]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([
    "Starter", "Active User", "Sehat Finansial", "Paham Finansial", "Bisa Finansial", "Master Finansial"
  ]);
  const [celebration, setCelebration] = useState({ show: false, title: "", message: "", type: "" });
  const getLevelData = (currentXp) => {
    // Judul level menggunakan fungsi t()
    if (currentXp >= 1500) return { level: 5, title: "Pakar Finansial" || "Pakar Finansial", progress: 100, currentXP: currentXp, maxXP: 1500, nextLevel: 5 };
    if (currentXp >= 1000) return { level: 4, title: "Master Finansial" || "Master Finansial", progress: ((currentXp - 1000) / 500) * 100, currentXP: currentXp, maxXP: 1500, nextLevel: 5 };
    if (currentXp >= 600) return { level: 3, title: "Bisa Finansial" || "Bisa Finansial", progress: ((currentXp - 600) / 400) * 100, currentXP: currentXp, maxXP: 1000, nextLevel: 4 };
    if (currentXp >= 300) return { level: 2, title: "Paham Finansial" || "Paham Finansial", progress: ((currentXp - 300) / 300) * 100, currentXP: currentXp, maxXP: 600, nextLevel: 3 };
    if (currentXp >= 100) return { level: 1, title: "Pelajar Finansial" || "Pelajar Finansial", progress: ((currentXp - 100) / 200) * 100, currentXP: currentXp, maxXP: 300, nextLevel: 2 };
    return { level: 0, title: "Pemula Finansial" || "Pemula Finansial", progress: (currentXp / 100) * 100, currentXP: currentXp, maxXP: 100, nextLevel: 1 };
  };
  const levelData = getLevelData(xp);
  const handleClaimMission = (id, rewardXP) => {
    setMissions(missions.map(m => m.id === id ? { ...m, done: true } : m));
    const oldLevel = getLevelData(xp).level;
    const newXp = xp + rewardXP;
    setXp(newXp);
    const newLevelData = getLevelData(newXp);
    if (newLevelData.level > oldLevel) {
      triggerLevelUpAnimation(newLevelData);
    } else {
      triggerSmallConfetti();
    }
  };
  const triggerLevelUpAnimation = (newLevelData) => {
    setCelebration({ 
      show: true, 
      title: `${"Level Up!" || "Level Up!"} 🎉`, 
      message: `${"Selamat! Kamu mencapai peringkat" || "Selamat! Kamu mencapai peringkat"} ${newLevelData.title}!`, 
      type: "level" 
    });
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#f59e0b', '#10b981', '#3b82f6'], zIndex: 9999 });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#f59e0b', '#10b981', '#3b82f6'], zIndex: 9999 });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    setTimeout(() => setCelebration(prev => ({...prev, show: false})), 4000);
  };
  const triggerAchievementAnimation = (badgeTitle) => {
    setCelebration({ 
      show: true, 
      title: `${"Pencapaian Terbuka!" || "Pencapaian Terbuka!"} 🏆`, 
      message: `${"Satu lagi koleksi badge kamu:" || "Satu lagi koleksi badge kamu:"} ${badgeTitle}`, 
      type: "achievement" 
    });
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 4, angle: 90, spread: 80, origin: { x: 0.5, y: 1 }, startVelocity: 45, colors: ['#eab308', '#3b82f6', '#ec4899', '#8b5cf6'], zIndex: 9999 });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    setTimeout(() => setCelebration(prev => ({...prev, show: false})), 3000);
  };
  const triggerSmallConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 9999 });
  };
  const handleUnlockAchievement = (title) => {
    if (!unlockedAchievements.includes(title)) {
      setUnlockedAchievements([...unlockedAchievements, title]);
      triggerAchievementAnimation(title);
    } else {
      triggerSmallConfetti();
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-10 space-y-8 animate-in fade-in zoom-in-95 duration-500 relative bg-background text-foreground transition-colors" id="snap-main-container">
      {/* Header */}
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">{"Pencapaian" || "Gamification"}</h1>
          <p className="text-sm text-muted-foreground mt-1">{"Lihat Level Finansial & Koleksi Lencana" || "Pantau level finansial dan kesehatan keuanganmu."}</p>
        </header>
      </AnimatedContent>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Level Finansial */}
        <div className="space-y-6">
          <AnimatedContent distance={40} delay={0.2} direction="vertical">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Trophy className={`w-5 h-5 ${themeColor}`} /> {"Level Finansial" || "Level Finansial"}
            </h2>
            <Card className="border-none shadow-sm relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 w-full p-2">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
              <CardContent className="p-6 flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 shrink-0 relative">
                    <span className="text-white font-black text-3xl">{levelData.level}</span>
                    <div className="absolute -bottom-2 font-bold text-[10px] bg-white text-orange-600 px-2 py-0.5 rounded-full shadow-sm dark:bg-slate-800 dark:text-orange-400">
                      LEVEL
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{levelData.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      {"Kamu di top 15% pengguna!" || "Kamu di top 15% pengguna!"} <Sparkles className="w-4 h-4 text-amber-500" />
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{"Progres ke Level" || "Progres ke Level"} {levelData.nextLevel}</span>
                    <span className="text-amber-600 dark:text-amber-400">{levelData.currentXP} / {levelData.maxXP} XP</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${levelData.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {levelData.level < 5 
                      ? `${"Kumpulkan" || "Kumpulkan"} ${levelData.maxXP - levelData.currentXP} XP ${"lagi." || "lagi untuk naik level."}` 
                      : "Selamat, kamu mencapai level maksimal!" || "Selamat, kamu mencapai level maksimal!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedContent>
          <AnimatedContent distance={40} delay={0.3} direction="vertical">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {"Misi Harian" || "Misi Harian"} 
                  <span className="flex items-center gap-1 text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                    <Flame className="w-3.5 h-3.5" /> {"5 Hari Beruntun!" || "5 Day Streak!"}
                  </span>
                </CardTitle>
                <CardDescription className="text-sm">{"Selesaikan untuk dapatkan XP tambahan" || "Selesaikan untuk dapatkan XP tambahan"}</CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {missions.map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      {mission.done ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <button onClick={() => handleClaimMission(mission.id, mission.xp)} className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 transition-colors" />
                      )}
                      <span className={`text-sm font-bold ${mission.done ? 'text-muted-foreground line-through' : ''}`}>
                        {mission.defaultText}
                      </span>
                    </div>
                    {mission.done ? (
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                        {"Selesai" || "Selesai"}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full cursor-pointer hover:bg-amber-200" onClick={() => handleClaimMission(mission.id, mission.xp)}>
                        +{mission.xp} XP
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </AnimatedContent>
        </div>
        {/* Kolom Kanan: Kesehatan Finansial */}
        <div className="space-y-6">
          <AnimatedContent distance={40} delay={0.4} direction="vertical">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <HeartPulse className={`w-5 h-5 ${themeColor}`} /> {"Kesehatan Finansial" || "Kesehatan Finansial"}
            </h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Circular Score Indicator */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" className="text-slate-100 dark:text-slate-800 stroke-current" strokeWidth="12" fill="none" />
                      <circle 
                        cx="64" cy="64" r="56" 
                        className="text-emerald-500 stroke-current drop-shadow-md" 
                        strokeWidth="12" 
                        fill="none" 
                        strokeLinecap="round"
                        strokeDasharray="351.8" 
                        strokeDashoffset="70" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-emerald-500">85</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{"Skor" || "Skor"}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{"Sangat Sehat" || "Sangat Sehat"}</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                      {"Pengeluaran terkendali" || "Pengeluaran terkendali. Lanjutkan kebiasaan ini."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContent>
        </div>
      </div>
      {/* KOLOM BAWAH: ACHIEVEMENTS */}
      <AnimatedContent distance={40} delay={0.6} direction="vertical">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 mt-8">
          <Medal className={`w-5 h-5 ${themeColor}`} /> {"Lencana" || "Badges & Pencapaian"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Starter", descKey: "badge_starter_desc", icon: <CheckCircle className="w-6 h-6" />, color: "bg-blue-500", progress: "100%", defaultDesc: "Capai Transaksi 50" },
            { title: "Active User", descKey: "badge_active_desc", icon: <CheckCircle className="w-6 h-6" />, color: "bg-blue-500", progress: "100%", defaultDesc: "Capai Transaksi 100" },
            { title: "Loyal User", descKey: "badge_loyal_desc", icon: <CheckCircle className="w-6 h-6" />, color: "bg-blue-500", progress: "148/150", defaultDesc: "Capai Transaksi 150" },
            { title: "Super User", descKey: "badge_super_desc", icon: <CheckCircle className="w-6 h-6" />, color: "bg-blue-500", progress: "148/200", defaultDesc: "Capai Transaksi 200" },
            { title: "Sehat Finansial", descKey: "badge_healthy_desc", icon: <HeartPulse className="w-6 h-6" />, color: "bg-emerald-500", progress: "100%", defaultDesc: "Skor Finansial 80" },
            { title: "Konsisten Sehat", descKey: "badge_consistent_desc", icon: <HeartPulse className="w-6 h-6" />, color: "bg-emerald-500", progress: "4/7", defaultDesc: "Tahan 80 > 1 Minggu" },
            { title: "Paham Finansial", descKey: "badge_paham_desc", icon: <Trophy className="w-6 h-6" />, color: "bg-amber-500", progress: "100%", defaultDesc: "Level Finansial 2" },
            { title: "Bisa Finansial", descKey: "badge_bisa_desc", icon: <Trophy className="w-6 h-6" />, color: "bg-amber-500", progress: "100%", defaultDesc: "Level Finansial 3" },
            { title: "Master Finansial", descKey: "badge_master_desc", icon: <Trophy className="w-6 h-6" />, color: "bg-amber-500", progress: "100%", defaultDesc: "Level Finansial 4" },
            { title: "Pakar Finansial", descKey: "badge_pakar_desc", icon: <Trophy className="w-6 h-6" />, color: "bg-amber-500", progress: "Lvl 4", defaultDesc: "Level Finansial 5" },
          ].map((badge, idx) => {
            const isActive = unlockedAchievements.includes(badge.title);
            const displayColor = isActive ? badge.color : "bg-slate-200 dark:bg-slate-800";
            return (
              <Card key={idx} onClick={() => handleUnlockAchievement(badge.title)} className={`border-border shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95`}>
                <CardContent className={`p-4 flex flex-col items-center text-center gap-3 relative transition-all duration-500 ${!isActive ? 'opacity-60 grayscale' : ''}`}>
                  {isActive && <div className="absolute top-2 right-2"><Sparkles className={`w-3 h-3 ${badge.title.includes('Finansial') ? 'text-amber-500' : 'text-blue-500'} animate-pulse`} /></div>}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-inner transition-colors duration-500 ${displayColor}`}>
                    {isActive ? badge.icon : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-tight">{badge.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-1">{badge.defaultDesc}</p>
                  </div>
                  <div className={`w-full py-1 rounded-md mt-1 transition-colors ${isActive ? 'bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                    <span className="text-[10px] font-bold">{isActive ? ("Selesai" || 'Selesai') : badge.progress}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </AnimatedContent>
      {/* Celebration Notification Modal */}
      {celebration.show && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-background border-border border-2 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm text-center mx-4 animate-in zoom-in-90 duration-500">
            <div className={`w-24 h-24 ${celebration.type === 'level' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'} rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-background animate-bounce relative`}>
              {celebration.type === 'level' ? <Flame className="w-12 h-12 text-white" /> : <Trophy className="w-12 h-12 text-white" />}
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <h2 className={`text-3xl font-black mb-3 text-transparent bg-clip-text ${celebration.type === 'level' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}>
              {celebration.title}
            </h2>
            <p className="text-muted-foreground font-medium text-lg leading-snug">
              {celebration.message}
            </p>
            <button 
              onClick={() => setCelebration(prev => ({...prev, show: false}))}
              className="mt-8 px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-bold rounded-xl transition-colors active:scale-95"
            >
              {"Lanjutkan" || "Lanjutkan"}
            </button>
          </div>
        </div>, document.body
      )}
    </div>
  );
}