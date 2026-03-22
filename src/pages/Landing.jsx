import React from 'react';
import { useNavigate } from 'react-router-dom';
import Prism from '../components/shared/Prism';
import StaggeredMenu from '../components/shared/StaggeredMenu';
import CardNav from '../components/shared/CardNav';
import logo from '../assets/icons.svg'; // Ganti dengan path logo nanti
import { ArrowRight, PieChart, Shield, Wallet, TrendingUp } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  // Menu Navigasi Mobile
  const menuItems = [
    { label: 'Home', link: '/' },
    { label: 'Features', link: '#features' },
  ];
  
  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/ZeroLogicDev/' }
  ];

  // Menu Navigasi Desktop
  const desktopItems = [
    {
      label: "Kasflow",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Login", href: "/login" },
        { label: "Dashboard", href: "/dashboard" }
      ]
    }
  ];

  const features = [
    {
      title: 'Pencatatan Mudah',
      description: 'Catat pemasukan dan pengeluaranmu hanya dengan beberapa klik yang intuitif.',
      icon: <Wallet className="text-purple-400" size={32} />
    },
    {
      title: 'Analitik Mendalam',
      description: 'Pahami pola pengeluaranmu melalui grafik dan laporan interaktif real-time.',
      icon: <PieChart className="text-purple-400" size={32} />
    },
    {
      title: 'Keamanan Data',
      description: 'Data keuanganmu tersimpan dengan aman dan terenkripsi dengan cukup baik.',
      icon: <Shield className="text-purple-400" size={32} />
    },
    {
      title: 'Pantau Pertumbuhan',
      description: 'Analisa akumulasi asetmu dari waktu ke waktu secara akurat.',
      icon: <TrendingUp className="text-purple-400" size={32} />
    }
  ];

  return (
    // Wrapper Utama: Full screen dengan auto scroll
    <div className="relative w-full min-h-screen bg-black flex flex-col font-sans text-white">
      
      {/* 1. Background Animasi Prism */}
      <div className="fixed inset-0 z-0">
        <Prism 
          animationType="rotate" 
          timeScale={0.3} 
          height={3.5} 
          baseWidth={5.5} 
          scale={3.6} 
          hueShift={0} 
          colorFrequency={1} 
          noise={0} 
          glow={1} 
          colors={['#B19EEF', '#5227FF']} // Aksen ungu
        />
      </div>

      {/* 2. Navigasi Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        {/* Mobile Nav */}
        <div className="md:hidden h-screen pointer-events-none">
           <StaggeredMenu
             position="right"
             items={menuItems}
             socialItems={socialItems}
             colors={['#170D27', '#271E37']}
             accentColor="#5227FF"
           />
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:block">
           <CardNav
             logo={logo}
             items={desktopItems}
             baseColor="rgba(13, 7, 22, 0.4)" // Dark glass base
             menuColor="#fff"
             buttonBgColor="#5227FF"
             buttonTextColor="#fff"
           />
        </div>
      </div>

      {/* 3. Konten Utama */}
      <main className="relative z-10 flex-1 flex flex-col items-center w-full">
        
        {/* Bagian Hero */}
        <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 pt-20 text-center">
          <div className="max-w-3xl flex flex-col items-center pointer-events-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 leading-tight">
              Masa Depan Keuangan<br/>Ada di Tanganmu
            </h1>
            <p className="text-lg md:text-xl text-purple-200/80 mb-10 max-w-2xl leading-relaxed">
              Kasflow adalah aplikasi pencatatan keuangan modern yang membantumu melacak, mengelola, dan menganalisis arus kas dengan lebih cerdas dan elegan.
            </p>
            
            <button 
              onClick={() => navigate('/login')}
              className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white border border-purple-500/50 hover:border-purple-400 transition-all duration-300 py-4 px-8 rounded-full font-medium text-lg backdrop-blur-md shadow-[0_0_20px_rgba(82,39,255,0.2)] hover:shadow-[0_0_30px_rgba(82,39,255,0.4)] relative overflow-hidden"
            >
              <span className="relative z-10">Mulai Sekarang</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </section>

        {/* Bagian Fitur */}
        <section id="features" className="w-full max-w-6xl mx-auto px-4 py-24 flex flex-col items-center pointer-events-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Fitur Unggulan</h2>
            <p className="text-purple-300/80 max-w-xl mx-auto text-lg leading-relaxed">
              Semua alat yang kamu butuhkan untuk mengelola arus kas dengan efisien, kini dalam balutan antarmuka yang intuitif dan memukau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-start p-8 rounded-2xl backdrop-blur-xl bg-[#0D0716]/60 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 shadow-[0_4_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(82,39,255,0.15)] group"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 mb-6 w-fit shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-purple-200/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ruang Bawah */}
        <div className="h-24"></div>

      </main>
    </div>
  );
};

export default Landing;