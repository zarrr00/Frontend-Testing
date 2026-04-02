import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMode } from "@/contexts/ModeContext";
import { Trophy, Sparkles, HeartPulse, Activity, Star, ChevronRight, CheckCircle, Flame, Medal, Lock } from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
export default function MobileGamification() {
  const { mode } = useMode(); 
  const isPersonal = mode === 'personal';
  const themeColor = isPersonal ? 'text-purple-600' : 'text-blue-600';
  const [xp, setXp] = useState(850);
  // Misi menggunakan key translasi
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
    // Judul level dinamis dari t()
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
      title: `${"Pencapaian Terbuka!" || "Achievement!"} 🏆`, 
      message: `${"Satu lagi koleksi badge kamu:" || "Kamu berhasil mengoleksi:"} ${badgeTitle}`, 
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
    <div className="w-full pb-20 pt-6 px-4 space-y-6 bg-background text-foreground transition-colors relative" id="snap-main-container">
      {/* Header Halaman */}
      <AnimatedContent distance={20} delay={0.1} direction="vertical">
        <header className="mb-4">
          <h1 className="text-2xl font-extrabold tracking-tight">{"Pencapaian" || "Gamification"}</h1>
          <p className="text-sm text-muted-foreground mt-1">{"Lihat Level Finansial & Koleksi Lencana" || "Level dan performa keuanganmu."}</p>
        </header>
      </AnimatedContent>
      {/* Bagian Level Finansial */}
      <div className="space-y-4">
        <AnimatedContent distance={30} delay={0.2} direction="vertical">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Trophy className={`w-4 h-4 ${themeColor}`} /> {"Level Finansial" || "Level Finansial"}
          </h2>
          <Card className="border-none shadow-sm relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 w-full mt-3">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
            <CardContent className="p-5 flex flex-col gap-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 shrink-0 relative">
                  <span className="text-white font-black text-2xl">{levelData.level}</span>
                  <div className="absolute -bottom-1.5 font-bold text-[8px] bg-white text-orange-600 px-1.5 py-0.5 rounded-full shadow-sm dark:bg-slate-800 dark:text-orange-400">
                    LEVEL
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{levelData.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 text-foreground">
                    {"Kamu di top 15% pengguna!" || "Top 15% pengguna"} <Sparkles className="w-3 h-3 text-amber-500" />
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-foreground">
                  <span>{"Progres ke Level" || "Progres ke Level"} {levelData.nextLevel}</span>
                  <span className="text-amber-600 dark:text-amber-400">{levelData.currentXP} / {levelData.maxXP} XP</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${levelData.progress}%` }}></div>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">
                  {levelData.level < 5 
                    ? `${"Kumpulkan" || "Kumpulkan"} ${levelData.maxXP - levelData.currentXP} XP ${"lagi." || "lagi."}` 
                    : "Selamat, kamu mencapai level maksimal!" || "Level maksimal!"}
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedContent>
        <AnimatedContent distance={30} delay={0.3} direction="vertical">
          <Card className="bg-card border-border shadow-sm text-foreground">
            <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between text-foreground">
              <CardTitle className="text-sm">{"Misi Harian" || "Misi Harian"}</CardTitle>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3" /> {"5 Hari Beruntun!" || "5 Day Streak!"}
              </span>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {missions.map((mission) => (
                <div key={mission.id} className="flex items-center justify-between bg-muted/50 p-2.5 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    {mission.done ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <button onClick={() => handleClaimMission(mission.id, mission.xp)} className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0 hover:border-emerald-500" />
                    )}
                    <span className={`text-xs font-bold ${mission.done ? 'text-muted-foreground line-through' : ''}`}>
                      {mission.defaultText}
                    </span>
                  </div>
                  {mission.done ? (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full shrink-0">
                      {"Selesai" || "Selesai"}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full shrink-0 cursor-pointer" onClick={() => handleClaimMission(mission.id, mission.xp)}>
                      +{mission.xp} XP
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </AnimatedContent>
      </div>
      {/* Bagian Kesehatan Finansial */}
      <div className="space-y-4 pt-2">
        <AnimatedContent distance={30} delay={0.4} direction="vertical">
          <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
            <HeartPulse className={`w-4 h-4 ${themeColor}`} /> {"Kesehatan Finansial" || "Kesehatan Finansial"}
          </h2>
          <Card className="bg-card border-border shadow-sm mt-3 text-foreground">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
              {/* Circular Score Indicator */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" className="text-slate-100 dark:text-slate-800 stroke-current" strokeWidth="10" fill="none" />
                  <circle 
                    cx="48" cy="48" r="42" 
                    className="text-emerald-500 stroke-current" 
                    strokeWidth="10" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeDasharray="263.8" 
                    strokeDashoffset="52.7" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-emerald-500">85</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">{"Skor" || "Skor"}</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400">{"Sangat Sehat" || "Sangat Sehat"}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {"Pengeluaran terkendali" || "Pengeluaran terkendali."}
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedContent>
      </div>
      {/* Bagian Badges & Achievements */}
      <div className="space-y-4 pt-2">
        <AnimatedContent distance={30} delay={0.6} direction="vertical">
          <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
            <Medal className={`w-4 h-4 ${themeColor}`} /> {"Lencana" || "Badges & Pencapaian"}
          </h2>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[
              { title: "Starter", descKey: "badge_starter_desc", icon: <CheckCircle className="w-5 h-5" />, color: "bg-blue-500", progress: "100%", defaultDesc: "Capai Trans. 50" },
              { title: "Active User", descKey: "badge_active_desc", icon: <CheckCircle className="w-5 h-5" />, color: "bg-blue-500", progress: "100%", defaultDesc: "Capai Trans. 100" },
              { title: "Loyal User", descKey: "badge_loyal_desc", icon: <CheckCircle className="w-5 h-5" />, color: "bg-blue-500", progress: "Klaim!" || "Klaim!", defaultDesc: "Capai Trans. 150" },
              { title: "Super User", descKey: "badge_super_desc", icon: <CheckCircle className="w-5 h-5" />, color: "bg-blue-500", progress: "148/200", defaultDesc: "Capai Trans. 200" },
              { title: "Sehat Finansial", descKey: "badge_healthy_desc", icon: <HeartPulse className="w-5 h-5" />, color: "bg-emerald-500", progress: "100%", defaultDesc: "Skor Finansial 80" },
              { title: "Konsisten Sehat", descKey: "badge_consistent_desc", icon: <HeartPulse className="w-5 h-5" />, color: "bg-emerald-500", progress: "Klaim!" || "Klaim!", defaultDesc: "Tahan 80 > 1 Mgg" },
              { title: "Paham Finansial", descKey: "badge_paham_desc", icon: <Trophy className="w-5 h-5" />, color: "bg-amber-500", progress: "100%", defaultDesc: "Level Finansial 2" },
              { title: "Bisa Finansial", descKey: "badge_bisa_desc", icon: <Trophy className="w-5 h-5" />, color: "bg-amber-500", progress: "100%", defaultDesc: "Level Finansial 3" },
              { title: "Master Finansial", descKey: "badge_master_desc", icon: <Trophy className="w-5 h-5" />, color: "bg-amber-500", progress: "100%", defaultDesc: "Level Finansial 4" },
              { title: "Pakar Finansial", descKey: "badge_pakar_desc", icon: <Trophy className="w-5 h-5" />, color: "bg-amber-500", progress: "Klaim!" || "Klaim!", defaultDesc: "Level Finansial 5" },
            ].map((badge, idx) => {
              const isActive = unlockedAchievements.includes(badge.title);
              const displayColor = isActive ? badge.color : "bg-slate-200 dark:bg-slate-800";
              return (
                <Card key={idx} onClick={() => handleUnlockAchievement(badge.title)} className={`border-border shadow-sm overflow-hidden active:scale-95 transition-transform text-foreground`}>
                  <CardContent className={`p-3 flex flex-col items-center text-center gap-2 relative transition-all duration-500 ${!isActive ? 'opacity-60 grayscale' : ''}`}>
                    {isActive && <div className="absolute top-1.5 right-1.5"><Sparkles className={`w-2 h-2 ${badge.title.includes('Finansial') ? 'text-amber-500' : 'text-blue-500'} animate-pulse`} /></div>}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-inner transition-colors duration-500 ${displayColor}`}>
                      {isActive ? badge.icon : <Lock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-foreground leading-tight">{badge.title}</h4>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{badge.defaultDesc}</p>
                    </div>
                    <div className={`w-full py-0.5 rounded flex items-center justify-center transition-colors ${isActive ? 'bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                      <span className="text-[9px] font-bold">{isActive ? ("Selesai" || 'Selesai') : badge.progress}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </AnimatedContent>
      </div>
      {/* Celebration Notification Modal Mobile */}
      {celebration.show && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-background border-border border-2 p-6 rounded-3xl shadow-2xl flex flex-col items-center max-w-[85%] text-center mx-4 animate-in zoom-in-90 duration-500 text-foreground">
            <div className={`w-20 h-20 ${celebration.type === 'level' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'} rounded-full flex items-center justify-center mb-5 shadow-xl border-4 border-background animate-bounce relative`}>
              {celebration.type === 'level' ? <Flame className="w-10 h-10 text-white" /> : <Trophy className="w-10 h-10 text-white" />}
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <h2 className={`text-2xl font-black mb-2 text-transparent bg-clip-text ${celebration.type === 'level' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}>
              {celebration.title}
            </h2>
            <p className="text-muted-foreground font-medium text-sm leading-snug">
              {celebration.message}
            </p>
            <button 
              onClick={() => setCelebration(prev => ({...prev, show: false}))}
              className="mt-6 px-10 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-bold rounded-xl transition-colors active:scale-95 text-sm"
            >
              {"Lanjutkan" || "Lanjutkan"}
            </button>
          </div>
        </div>, document.body
      )}
    </div>
  );
}