/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  UserCheck, 
  ArrowUp, 
  Settings, 
  AlertTriangle, 
  Terminal,
  Database,
  Cpu,
  RefreshCw,
  Home,
  Users,
  Award,
  BookOpen,
  Calendar,
  Send,
  Trash2,
  Plus,
  Compass,
  Code2,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

// --- DEFINISI TIPE / INTERFACES ---
interface Member {
  id: number;
  name: string;
  role: string;
  status: string;
  joinDate: string;
  avatar?: string;
  achievements?: string[];
}

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  status: string;
  stock: number;
  location: string;
  spec?: any;
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

// --- DATA CADANGAN LOKAL (FALLBACK) ---
const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: "Ahmad Fauzi", role: "Ketua Tim / Programmer", status: "Aktif", joinDate: "2024-01-15", achievements: ["Juara 1 KRTI 2025"] },
  { id: 2, name: "Larasati Putri", role: "Hardware Engineer", status: "Aktif", joinDate: "2024-02-10", achievements: ["Juara 2 FIRA Robot World Cup"] },
  { id: 3, name: "Budi Santoso", role: "Mekanik & Desain 3D", status: "Alumni", joinDate: "2023-05-20", achievements: ["Rektor Award 2024"] }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 1, name: "Arduino Uno R3", category: "Mikrokontroler", status: "Tersedia", stock: 15, location: "Laci A1", spec: { voltage: "5V", MCU: "ATmega328P" } },
  { id: 2, name: "Servo Motor MG996R", category: "Aktuator", status: "Tersedia", stock: 8, location: "Kotak B3", spec: { torque: "11 kg/cm", speed: "0.19s/60deg" } },
  { id: 3, name: "LiPo Battery 3S 2200mAh", category: "Power", status: "Dipakai", stock: 4, location: "Lemari C2", spec: { voltage: "11.1V", capacity: "2200mAh" } }
];

// --- PENANGANAN AMAN TARGET ES2015 UNTUK API_URL ---
const getApiUrl = (): string => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
      // @ts-ignore
      return import.meta.env.VITE_API_URL;
    }
  } catch (e) {
    // Abaikan jika bundler tidak mendukung import.meta
  }
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

export default function App() {
  // --- STATE UTAMA ---
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  
  // --- STATE TRACKING KONEKSI NEON DB ---
  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(true);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // --- STATE UTILITIES ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('cyan');
  const [userData, setUserData] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // --- STATE DASHBOARD ---
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Form Inventaris Baru
  const [newInvName, setNewInvName] = useState('');
  const [newInvCat, setNewInvCat] = useState('Mikrokontroler');
  const [newInvStock, setNewInvStock] = useState(1);
  const [newInvLoc, setNewInvLoc] = useState('');

  // Form Anggota Baru
  const [newMemName, setNewMemName] = useState('');
  const [newMemRole, setNewMemRole] = useState('Programmer');
  const [newMemStatus, setNewMemStatus] = useState('Aktif');

  // Simulator Kode Arduino
  const [selectedCodeTemplate, setSelectedCodeTemplate] = useState('blink');
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['Sistem Simulator Siap. Klik Run untuk memulai.']);
  const [isRunningSim, setIsRunningSim] = useState(false);

  // --- ARDUINO CODE TEMPLATES ---
  const CODE_TEMPLATES: Record<string, string> = {
    blink: `void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}`,
    servo: `#include <Servo.h>\nServo myservo;\n\nvoid setup() {\n  myservo.attach(9);\n}\n\nvoid loop() {\n  myservo.write(90);\n  delay(500);\n}`,
    sensor: `void setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int val = analogRead(A0);\n  Serial.println(val);\n  delay(200);\n}`
  };

  // --- FUNGSI TOAST ---
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- AMBIL DATA DARI NEON POSTGRESQL VIA API ---
  const fetchCloudData = async () => {
    setIsLoadingCloud(true);
    setDbError(null);
    try {
      addToast({
        title: 'Koneksi Cloud',
        message: 'Menghubungkan ke Neon PostgreSQL...',
        type: 'info'
      });

      const [resInv, resMem] = await Promise.all([
        fetch(`${API_URL}/api/inventory`),
        fetch(`${API_URL}/api/members`)
      ]);

      if (!resInv.ok || !resMem.ok) {
        throw new Error('Gagal menarik data ter-update dari database Neon cloud.');
      }

      const dataInv = await resInv.json();
      const dataMem = await resMem.json();

      setInventory(dataInv);
      setMembers(dataMem);
      setIsCloudConnected(true);
      
      addToast({
        title: 'Koneksi Sukses',
        message: 'Sinkronisasi data dengan Neon DB berhasil!',
        type: 'success'
      });
    } catch (error: any) {
      console.warn('⚠️ Gagal terhubung ke Neon DB. Menggunakan penyimpanan lokal:', error);
      setDbError(error.message || 'Koneksi server terputus');
      setIsCloudConnected(false);
      
      const localInv = localStorage.getItem('inventory');
      const localMem = localStorage.getItem('members');

      setInventory(localInv ? JSON.parse(localInv) : INITIAL_INVENTORY);
      setMembers(localMem ? JSON.parse(localMem) : INITIAL_MEMBERS);

      addToast({
        title: 'Mode Lokal',
        message: 'Gagal terhubung ke cloud. Berjalan dalam mode penyimpanan lokal.',
        type: 'warning'
      });
    } finally {
      setIsLoadingCloud(false);
    }
  };

  useEffect(() => {
    fetchCloudData();
  }, []);

  // --- DETEKSI SCROLL UNTUK SCROLL TO TOP ---
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- MANIPULASI DATA (CRUD) KONEKSI NEON / LOKAL ---
  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvName.trim()) return;

    const newItem = {
      name: newInvName,
      category: newInvCat,
      status: 'Tersedia',
      stock: newInvStock,
      location: newInvLoc || 'Gudang Utama',
      spec: {}
    };

    if (isCloudConnected) {
      try {
        const res = await fetch(`${API_URL}/api/inventory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        if (res.ok) {
          const savedItem = await res.json();
          setInventory(prev => [savedItem, ...prev]);
          addToast({ title: 'Sukses Cloud', message: 'Item berhasil disimpan ke Neon DB!', type: 'success' });
        }
      } catch (err) {
        addToast({ title: 'Gagal Cloud', message: 'Gagal menyimpan ke cloud, silakan coba lagi.', type: 'danger' });
      }
    } else {
      const offlineItem: InventoryItem = {
        id: Date.now(),
        ...newItem
      };
      const updated = [offlineItem, ...inventory];
      setInventory(updated);
      localStorage.setItem('inventory', JSON.stringify(updated));
      addToast({ title: 'Sukses Lokal', message: 'Item disimpan di penyimpanan browser local.', type: 'success' });
    }

    // Reset Form
    setNewInvName('');
    setNewInvLoc('');
    setNewInvStock(1);
  };

  const handleDeleteInventory = async (id: number) => {
    if (isCloudConnected) {
      try {
        const res = await fetch(`${API_URL}/api/inventory/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setInventory(prev => prev.filter(item => item.id !== id));
          addToast({ title: 'Dihapus', message: 'Item terhapus dari Neon DB.', type: 'success' });
        }
      } catch (err) {
        addToast({ title: 'Gagal', message: 'Gagal menghapus dari Neon DB.', type: 'danger' });
      }
    } else {
      const updated = inventory.filter(item => item.id !== id);
      setInventory(updated);
      localStorage.setItem('inventory', JSON.stringify(updated));
      addToast({ title: 'Dihapus', message: 'Item terhapus dari penyimpanan lokal.', type: 'success' });
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName.trim()) return;

    const newMember = {
      name: newMemName,
      role: newMemRole,
      status: newMemStatus,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: '',
      achievements: []
    };

    if (isCloudConnected) {
      try {
        const res = await fetch(`${API_URL}/api/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMember)
        });
        if (res.ok) {
          const savedMember = await res.json();
          setMembers(prev => [savedMember, ...prev]);
          addToast({ title: 'Sukses Cloud', message: 'Anggota tersimpan di Neon DB!', type: 'success' });
        }
      } catch (err) {
        addToast({ title: 'Gagal', message: 'Gagal menyimpan ke cloud.', type: 'danger' });
      }
    } else {
      const offlineMember: Member = {
        id: Date.now(),
        ...newMember
      };
      const updated = [offlineMember, ...members];
      setMembers(updated);
      localStorage.setItem('members', JSON.stringify(updated));
      addToast({ title: 'Sukses Lokal', message: 'Anggota disimpan di penyimpanan browser.', type: 'success' });
    }

    setNewMemName('');
  };

  // --- RUN ARDUINO SIMULATION ---
  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setConsoleLogs(prev => [...prev, '⚙️ Mengompilasi program...', '📤 Mengunggah ke mikrokontroler virtual...']);
    
    setTimeout(() => {
      let runMessages: string[] = [];
      if (selectedCodeTemplate === 'blink') {
        runMessages = ['[INFO] LED di Pin 13 berkedip (HIGH)', '[INFO] delay(1000)ms', '[INFO] LED di Pin 13 padam (LOW)'];
      } else if (selectedCodeTemplate === 'servo') {
        runMessages = ['[INFO] Menggerakkan Servo ke sudut 90 derajat', '[INFO] Sudut target tercapai.'];
      } else {
        runMessages = ['[SERIAL] Analog Read A0: 412', '[SERIAL] Analog Read A0: 508', '[SERIAL] Analog Read A0: 641'];
      }
      setConsoleLogs(prev => [...prev, ...runMessages, '✔️ Simulasi Berhasil Dijalankan!']);
      setIsRunningSim(false);
    }, 1500);
  };

  // --- FILTERED DATA FOR SEARCH ---
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans`}>
      
      {/* --- TOP CLOUD STATUS BAR --- */}
      <div className="bg-slate-900 border-b border-white/5 py-2 px-4 text-xs z-50 relative">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className={`w-4 h-4 ${isCloudConnected ? 'text-green-400 animate-pulse' : 'text-amber-500'}`} />
            <span className="font-mono text-[10px] tracking-wider uppercase">
              Database Status:{' '}
              {isCloudConnected ? (
                <span className="text-green-400 font-bold">Neon Cloud PostgreSQL Connected</span>
              ) : (
                <span className="text-amber-500 font-bold">Local Backup Storage Mode</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!isCloudConnected && (
              <span className="text-slate-400 text-[10px] hidden sm:inline">
                Hubungkan backend server di {API_URL} untuk sinkronisasi cloud penuh
              </span>
            )}
            <button 
              onClick={fetchCloudData}
              disabled={isLoadingCloud}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingCloud ? 'animate-spin' : ''}`} />
              Re-sync
            </button>
          </div>
        </div>
      </div>

      {/* --- PREMIUM NAVBAR --- */}
      <nav className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-white/5 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
                <Cpu className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  ROBOTIKA
                </h1>
                <p className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase">PORTAL ACADEMY</p>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center gap-6 font-mono text-xs">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`transition-colors cursor-pointer hover:text-cyan-400 flex items-center gap-1.5 ${currentPage === 'home' ? 'text-cyan-400' : 'text-slate-300'}`}
              >
                <Home className="w-3.5 h-3.5" /> Beranda
              </button>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`transition-colors cursor-pointer hover:text-cyan-400 flex items-center gap-1.5 ${currentPage === 'dashboard' ? 'text-cyan-400' : 'text-slate-300'}`}
              >
                <Terminal className="w-3.5 h-3.5" /> Dashboard Admin
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-white/5 px-4 pt-2 pb-4 flex flex-col gap-3 font-mono text-xs">
            <button 
              onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
              className="py-2 text-left text-slate-300 hover:text-cyan-400"
            >
              Beranda
            </button>
            <button 
              onClick={() => { setCurrentPage('dashboard'); setMobileMenuOpen(false); }}
              className="py-2 text-left text-slate-300 hover:text-cyan-400"
            >
              Dashboard Admin
            </button>
          </div>
        )}
      </nav>

      {/* --- UTAMA / KONTEN HALAMAN --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- PAGE 1: HOMEPAGE (BERANDA) --- */}
        {currentPage === 'home' && (
          <div className="space-y-16 py-6">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-slate-900/40 p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none" />
              <div className="space-y-6 max-w-xl">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-950 text-cyan-400 rounded-full text-[10px] font-mono border border-cyan-500/20 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Pintu Gerbang Inovasi Robotika Sekolah
                </span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                  Membangun Masa Depan Melalui <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Teknologi Robotika & IoT</span>
                </h2>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Belajar dasar pemrograman mikrokontroler Arduino, perancangan sirkuit IoT, desain mekanis 3D, hingga berkompetisi dalam kancah nasional dan internasional bersama tim ahli kami.
                </p>
                <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs">
                  <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95 transition-all"
                  >
                    Mulai Dashboard Admin
                  </button>
                  <a 
                    href="#kurikulum"
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-white/5 transition-colors"
                  >
                    Pelajari Kurikulum
                  </a>
                </div>
              </div>
              <div className="relative w-full max-w-xs md:max-w-md aspect-square bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded">
                    <Database className="w-3 h-3" /> NEON CONNECTED
                  </div>
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
                </div>
                
                <div className="my-auto space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-lg"><Cpu className="w-5 h-5 text-cyan-400" /></div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-300">Inventaris Komponen</h4>
                      <p className="text-[10px] text-slate-500">{inventory.length} Jenis Komponen Terdaftar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-lg"><Users className="w-5 h-5 text-blue-400" /></div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-300">Anggota Ekstrakurikuler</h4>
                      <p className="text-[10px] text-slate-500">{members.length} Siswa Terdaftar</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Server latency</span>
                  <span className="text-green-400">~24ms</span>
                </div>
              </div>
            </div>

            {/* Overview / Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 hover:border-cyan-500/20 transition-all">
                <h3 className="text-3xl font-black tracking-tight text-cyan-400">{members.length}</h3>
                <h4 className="font-mono text-xs text-slate-300 font-bold mt-1">Siswa Aktif</h4>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">Bergabung dalam berbagai divisi pengembangan perangkat lunak maupun perangkat keras.</p>
              </div>
              <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 hover:border-cyan-500/20 transition-all">
                <h3 className="text-3xl font-black tracking-tight text-blue-400">{inventory.length}</h3>
                <h4 className="font-mono text-xs text-slate-300 font-bold mt-1">Stok Inventaris</h4>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">Komponen IoT, modul sensor, aktuator, hingga kit sasis robotika berkualitas siap pakai.</p>
              </div>
              <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 hover:border-cyan-500/20 transition-all">
                <h3 className="text-3xl font-black tracking-tight text-indigo-400">4 Divisi</h3>
                <h4 className="font-mono text-xs text-slate-300 font-bold mt-1">Kompetisi Utama</h4>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">Line Follower, Robot Pemadam Api, Kontes Robot Terbang, serta Rekayasa IoT Terapan.</p>
              </div>
            </div>

            {/* Visi Misi Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-black tracking-tight">Visi & Misi Robotika</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Menjadi laboratorium sains terapan unggulan yang mendidik siswa berkarakter mandiri, analitis, adaptif terhadap perkembangan revolusi industri terkini, serta siap berprestasi.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-cyan-950 text-cyan-400 rounded-full flex items-center justify-center font-mono text-xs shrink-0">1</div>
                    <p className="text-xs text-slate-300">Menyediakan fasilitas riset mikrokontroler dan sirkuit elektronik berskala modern.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-cyan-950 text-cyan-400 rounded-full flex items-center justify-center font-mono text-xs shrink-0">2</div>
                    <p className="text-xs text-slate-300">Mencetak prestasi gemilang dalam turnamen kejuaraan rekayasa teknologi nasional.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full filter blur-xl" />
                <h4 className="font-mono text-xs text-cyan-400 font-bold mb-4 uppercase tracking-wider">🎯 TARGET TAHUN INI</h4>
                <div className="space-y-4 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Upgrade ke Neon PostgreSQL</span>
                    <span className="text-green-400">Selesai (100%)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Sertifikasi Mikroelektronik Siswa</span>
                    <span className="text-cyan-400">Progres (75%)</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-slate-400">Perakitan Drone Pemetaan</span>
                    <span className="text-slate-500">Perencanaan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kurikulum Section */}
            <div id="kurikulum" className="space-y-6 pt-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Kurikulum Belajar Terstruktur</h3>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Kami merancang materi dari nol untuk pemula hingga tingkat mahir.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
                <div className="bg-slate-900/20 border border-white/5 rounded-xl p-5 space-y-3">
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">LEVEL 1 - BASIC</span>
                  <h4 className="text-sm font-bold text-slate-200">Algoritma & Arduino C</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">Pengenalan sirkuit listrik dasar, logika percabangan, fungsi input-output pin digital dan analog.</p>
                </div>
                <div className="bg-slate-900/20 border border-white/5 rounded-xl p-5 space-y-3">
                  <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">LEVEL 2 - INTERMEDIATE</span>
                  <h4 className="text-sm font-bold text-slate-200">Sensor & Aktuator Terapan</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">Integrasi sensor ultrasonik, servo, kendali motor DC dengan driver L298N, dan pembacaan sinyal PWM.</p>
                </div>
                <div className="bg-slate-900/20 border border-white/5 rounded-xl p-5 space-y-3">
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">LEVEL 3 - ADVANCED</span>
                  <h4 className="text-sm font-bold text-slate-200">Internet of Things (IoT)</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">Konektivitas Wi-Fi mikrokontroler ESP32/ESP8266, protokol MQTT, database Cloud, dan dashboard monitor.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- PAGE 2: DASHBOARD ADMIN PORTAL --- */}
        {currentPage === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <Settings className="w-6 h-6 text-cyan-400" /> Pusat Kendali Ekstrakurikuler
                </h2>
                <p className="text-slate-400 text-xs mt-1">Lakukan manajemen inventaris komponen hardware dan direktori anggota tim secara real-time.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${isCloudConnected ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span className="text-xs font-mono text-slate-300">
                  Mode: {isCloudConnected ? 'Cloud Postgresql' : 'Local Sandbox Offline'}
                </span>
              </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="flex gap-2 font-mono text-xs border-b border-white/5 pb-1">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 cursor-pointer transition-colors border-b-2 ${activeTab === 'overview' ? 'border-cyan-500 text-cyan-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Ikhtisar Data
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 cursor-pointer transition-colors border-b-2 ${activeTab === 'inventory' ? 'border-cyan-500 text-cyan-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Kelola Inventaris ({inventory.length})
              </button>
              <button 
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 cursor-pointer transition-colors border-b-2 ${activeTab === 'members' ? 'border-cyan-500 text-cyan-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Kelola Anggota ({members.length})
              </button>
              <button 
                onClick={() => setActiveTab('simulator')}
                className={`px-4 py-2 cursor-pointer transition-colors border-b-2 ${activeTab === 'simulator' ? 'border-cyan-500 text-cyan-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                IDE & Simulator IoT
              </button>
            </div>

            {/* TAB SUB-KONTEN 1: IKHTISAR DATA */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold font-mono text-xs text-cyan-400 uppercase tracking-wider">Aktivitas Terkini & Sinkronisasi</h3>
                  <div className="space-y-3 font-mono text-[11px] text-slate-300">
                    <div className="p-3 bg-slate-950 rounded border border-white/5 flex justify-between items-center">
                      <span>Status Endpoint API</span>
                      <span className="text-green-400 font-bold">ACTIVE</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded border border-white/5 flex justify-between items-center">
                      <span>Metode Sinkronisasi</span>
                      <span className="text-cyan-400 uppercase">{isCloudConnected ? 'Neon DB RESTful' : 'Local Storage Cache'}</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded border border-white/5 flex justify-between items-center">
                      <span>Database Host</span>
                      <span className="text-slate-400 truncate max-w-[180px]">{API_URL}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={fetchCloudData}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-xl border border-white/5 transition-colors cursor-pointer"
                    >
                      Segarkan Koneksi Database Cloud
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold font-mono text-xs text-blue-400 uppercase tracking-wider">Panduan Deployment Sempurna</h3>
                  <div className="space-y-3 text-xs leading-relaxed text-slate-400">
                    <p>
                      Aplikasi ini sepenuhnya kompatibel untuk terhubung dengan serverless database <strong className="text-slate-200">Neon PostgreSQL Cloud</strong>.
                    </p>
                    <p>
                      Gunakan database DDL schema berikut di Neon SQL Editor Anda:
                    </p>
                    <pre className="p-3 bg-slate-950 rounded border border-white/5 font-mono text-[9px] text-cyan-300 overflow-x-auto">
{`CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  location VARCHAR(255) NOT NULL,
  spec TEXT
);`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB SUB-KONTEN 2: KELOLA INVENTARIS (CRUD) */}
            {activeTab === 'inventory' && (
              <div className="space-y-8">
                {/* Form Input Item Baru */}
                <form onSubmit={handleAddInventory} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Nama Komponen *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: ESP32 NodeMCU, Sensor Pir..."
                      value={newInvName}
                      onChange={(e) => setNewInvName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Kategori</label>
                    <select 
                      value={newInvCat}
                      onChange={(e) => setNewInvCat(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="Mikrokontroler">Mikrokontroler</option>
                      <option value="Aktuator">Aktuator</option>
                      <option value="Sensor">Sensor</option>
                      <option value="Power">Power & Baterai</option>
                      <option value="Mekanik">Mekanik</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Stok Unit</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newInvStock}
                      onChange={(e) => setNewInvStock(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Lokasi Laci / Penyimpanan</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Kotak Rak A, Lemari B2..."
                      value={newInvLoc}
                      onChange={(e) => setNewInvLoc(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95 transition-all"
                    >
                      Simpan Komponen Ke Database
                    </button>
                  </div>
                </form>

                {/* Search Bar */}
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Cari komponen elektronik..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none pl-10"
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-500 font-mono text-xs">🔍</span>
                </div>

                {/* List Inventaris */}
                <div className="bg-slate-900/20 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 border-b border-white/10 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4">Nama Komponen</th>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Stok</th>
                          <th className="py-3 px-4">Lokasi Penyimpanan</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredInventory.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                              Tidak ada komponen elektronik yang ditemukan.
                            </td>
                          </tr>
                        ) : (
                          filteredInventory.map((item) => (
                            <tr key={item.id} className="hover:bg-white/[2%] transition-colors">
                              <td className="py-3 px-4 font-bold text-slate-200">{item.name}</td>
                              <td className="py-3 px-4 font-mono text-slate-400">{item.category}</td>
                              <td className="py-3 px-4 font-mono text-slate-300">{item.stock} Unit</td>
                              <td className="py-3 px-4 text-slate-400">{item.location}</td>
                              <td className="py-3 px-4 text-right">
                                <button 
                                  onClick={() => handleDeleteInventory(item.id)}
                                  className="p-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB SUB-KONTEN 3: KELOLA ANGGOTA (CRUD) */}
            {activeTab === 'members' && (
              <div className="space-y-8">
                {/* Form Input Anggota Baru */}
                <form onSubmit={handleAddMember} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Nama Lengkap Siswa *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Muhammad Kevin, Amanda..."
                      value={newMemName}
                      onChange={(e) => setNewMemName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Role / Divisi</label>
                    <select 
                      value={newMemRole}
                      onChange={(e) => setNewMemRole(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="Programmer">Programmer</option>
                      <option value="Hardware Engineer">Hardware Engineer</option>
                      <option value="Desainer Mekanik">Desainer Mekanik 3D</option>
                      <option value="Pilot Drone / Operator">Pilot Drone / Operator</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Status Keanggotaan</label>
                    <select 
                      value={newMemStatus}
                      onChange={(e) => setNewMemStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Uji Coba">Uji Coba</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95 transition-all"
                    >
                      Daftarkan Anggota Baru
                    </button>
                  </div>
                </form>

                {/* List Anggota */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <div key={member.id} className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/20 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-200">{member.name}</h4>
                          <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{member.role}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold ${
                          member.status === 'Aktif' ? 'bg-green-950/50 text-green-400 border border-green-500/20' : 
                          member.status === 'Alumni' ? 'bg-slate-800 text-slate-400 border border-white/10' :
                          'bg-amber-950/50 text-amber-400 border border-amber-500/20'
                        }`}>
                          {member.status}
                        </span>
                      </div>

                      <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                        <span>Bergabung:</span>
                        <span>{member.joinDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB SUB-KONTEN 4: SIMULATOR ARDUINO */}
            {activeTab === 'simulator' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Editor Arduino */}
                <div className="md:col-span-2 bg-slate-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div className="p-4 bg-slate-950 border-b border-white/5 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider">Arduino C Code Editor</span>
                    <select 
                      value={selectedCodeTemplate}
                      onChange={(e) => {
                        setSelectedCodeTemplate(e.target.value);
                        setConsoleLogs([`Sistem Simulator beralih ke template [${e.target.value.toUpperCase()}].`]);
                      }}
                      className="bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-[10px] font-mono text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="blink">Blink LED Terintegrasi</option>
                      <option value="servo">Gerak Servo Motor</option>
                      <option value="sensor">Analog Read Sensor</option>
                    </select>
                  </div>

                  <textarea 
                    value={CODE_TEMPLATES[selectedCodeTemplate]}
                    readOnly
                    className="w-full bg-slate-950 p-4 font-mono text-xs text-cyan-300 h-80 resize-none outline-none focus:ring-0 leading-relaxed"
                  />

                  <div className="p-4 bg-slate-950 border-t border-white/5 flex justify-end">
                    <button 
                      onClick={handleRunSimulation}
                      disabled={isRunningSim}
                      className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer active:scale-95"
                    >
                      <Terminal className="w-3.5 h-3.5" /> {isRunningSim ? 'Memproses...' : 'Run Simulation'}
                    </button>
                  </div>
                </div>

                {/* Serial Monitor / Output */}
                <div className="bg-slate-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 h-[440px]">
                  <div className="space-y-1">
                    <h4 className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Terminal / Serial Monitor</h4>
                    <p className="text-[9px] text-slate-500">Output keluaran dari mikrokontroler Arduino virtual</p>
                  </div>

                  <div className="flex-1 bg-slate-900/60 rounded-xl p-4 font-mono text-[10px] text-green-400 overflow-y-auto space-y-2 select-text">
                    {consoleLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed border-b border-white/[1%] pb-1">{log}</div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setConsoleLogs(['Serial Monitor Berhasil Dibersihkan.'])}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Terminal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- SCROLL TO TOP BUTTON --- */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 rounded-xl border border-cyan-500/20 text-cyan-400 shadow-lg cursor-pointer transition-all active:scale-90 z-50"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* --- TOAST NOTIFICATIONS CONTAINER --- */}
      <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border flex flex-col gap-1 shadow-lg transition-all transform animate-slide-up bg-slate-900 ${
              toast.type === 'success' ? 'border-green-500/20 text-green-400' :
              toast.type === 'warning' ? 'border-amber-500/20 text-amber-400' :
              toast.type === 'danger' ? 'border-red-500/20 text-red-400' :
              'border-cyan-500/20 text-cyan-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">{toast.title}</span>
              <button onClick={() => removeToast(toast.id)} className="text-[10px] opacity-60 hover:opacity-100 font-mono">×</button>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{toast.message}</p>
          </div>
        ))}
      </div>

      {/* --- GLOBAL GLOWING FOOTER --- */}
      <footer className="border-t border-white/5 py-12 bg-slate-950 mt-12 text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>&copy; {new Date().getFullYear()} Robotika Portal Academy. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setCurrentPage('home')} className="hover:text-cyan-400 transition-colors">Beranda</button>
            <button onClick={() => setCurrentPage('dashboard')} className="hover:text-cyan-400 transition-colors">Admin Portal</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
