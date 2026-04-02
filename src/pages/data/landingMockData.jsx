import React from 'react';
import { PieChart, Shield, Wallet, TrendingUp } from 'lucide-react';

export const menuItems = [
  { label: 'Home', link: '/' },
  { label: 'Features', link: '#features' },
];

export const socialItems = [
  { label: 'GitHub', link: 'https://github.com/ZeroLogicDev/' }
];

export const desktopItems = [
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

export const features = [
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
