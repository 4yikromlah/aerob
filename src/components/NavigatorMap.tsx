/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Compass, 
  Layers, 
  Activity, 
  Eye, 
  Navigation, 
  CornerDownRight, 
  Radio, 
  Tv, 
  Users, 
  BellRing, 
  Lock, 
  Unlock, 
  Thermometer, 
  Droplets, 
  Zap, 
  Sparkles, 
  Wrench,
  AlertTriangle,
  Info,
  Car,
  Volume2,
  Map,
  Home,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface ZoneData {
  id: string;
  name: string;
  codename: string;
  description: string;
  tools: string[];
  iotMetrics: {
    temp: number;
    humidity: number;
    power: number;
    activeRobots: number;
  };
  locked: boolean;
  activeTechs: string[];
  liveStatus: string;
}

const LAB_ZONES: ZoneData[] = [
  {
    id: 'zone-cad',
    name: 'Zona Perakitan Sasis & Desain Mekanis',
    codename: 'CAD & MECHANICAL DEPT (SEC-A)',
    description: 'Laboratorium desain Autodesk Fusion 3D, pencetakan sasis filamen serat karbon, dan struktur robotika darat berkaki ganda.',
    tools: ['Pencetak 3D Creality Ender K1', 'CNC Laser Engraver 80W', 'Sistem Pengukur Sasis Digital'],
    iotMetrics: { temp: 24.2, humidity: 48, power: 340, activeRobots: 2 },
    locked: false,
    activeTechs: ['Arief Budiman', 'Kurniawan Pratama'],
    liveStatus: 'OPTIMAL_CAD_FEED'
  },
  {
    id: 'zone-pcb',
    name: 'Klinik Servis & Solder PCB Elektronik',
    codename: 'MICROELECTRONICS & PCB CLINIC (SEC-B)',
    description: 'Laboratorium produksi papan sirkuit kustom, penyolderan presisi komponen SMD, dan pengukuran tegangan dengan osiloskop.',
    tools: ['Osiloskop Digital Rigol MSO', 'Hot Air Solder Lab Station', 'Penganalisis Logika Logic-16'],
    iotMetrics: { temp: 25.8, humidity: 45, power: 720, activeRobots: 0 },
    locked: false,
    activeTechs: ['Sarah Amelia', 'Dewi Anggraini'],
    liveStatus: 'PCB_STATION_READY'
  },
  {
    id: 'zone-drone',
    name: 'Area Uji Terbang Drone & Avio-Flight',
    codename: 'AERIAL AVIONICS FLIGHT CAGE (SEC-C)',
    description: 'Tempat peluncuran dan kalibrasi sensor giro drone quadcopter dalam ruang tertutup berpelindung kawat pengaman.',
    tools: ['Flight Controller Simulator', 'Dynamometer Propeler Elektrik', 'ArduPilot Telemetry Terminal'],
    iotMetrics: { temp: 23.5, humidity: 55, power: 120, activeRobots: 3 },
    locked: true,
    activeTechs: ['Rian Ardianto'],
    liveStatus: 'ACTIVE_AERIAL_LOCK'
  },
  {
    id: 'zone-vision',
    name: 'AI Vision Corner & Pusat Komputasi',
    codename: 'NEURAL NODE & EDGE COMPUTER (SEC-D)',
    description: 'Pusat integrasi algoritma kamera deteksi jarak jauh, pemetaan sirkuit ROS2, sistem kendali kemudi otonom, dan kecerdasan Jetson.',
    tools: ['GPU NVIDIA Jetson Orin Workstation', 'Depth Camera Intel RealSense D435i', 'Lidar Scanner RPLIDAR A3'],
    iotMetrics: { temp: 21.1, humidity: 40, power: 1100, activeRobots: 1 },
    locked: false,
    activeTechs: ['Dr. Haris Sanjaya', 'Rahmat Hidayat'],
    liveStatus: 'STREAMING_AI_NODE'
  },
  {
    id: 'zone-seminar',
    name: 'Ruang Rapat & Seminar Kolaboratif',
    codename: 'BRIEFING ROOM & CO-WORKING (SEC-E)',
    description: 'Tempat merumuskan ide-ide kejuaraan, penyusunan proposal logistik kegiatan, serta sarana presentasi multimedia kepada dewan juri.',
    tools: ['Smartboard Monitor Interactive', '3D Holographic Projector Demo', 'AR/VR Robotic Control Headset'],
    iotMetrics: { temp: 24.0, humidity: 50, power: 250, activeRobots: 0 },
    locked: false,
    activeTechs: ['Indra Wijaya', 'Siti Maulida'],
    liveStatus: 'COMMUNICATION_LIVE'
  }
];

const ROUTE_STATIONS = [
  { id: 'start-entrance', name: 'Pintu Masuk Utama Lab' },
  ...LAB_ZONES.map(z => ({ id: z.id, name: z.name }))
];

interface NavigatorMapProps {
  onAddToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function NavigatorMap({ onAddToast }: NavigatorMapProps) {
  const [activeTab, setActiveTab] = useState<'indoor' | 'outdoor'>('indoor');
  
  // Indoor States
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-cad');
  const [alarmActive, setAlarmActive] = useState<boolean>(false);
  const [simSensorWave, setSimSensorWave] = useState<number[]>([12, 18, 14, 25, 22, 30, 20, 28, 35, 10]);

  // Path Finder States
  const [pathStart, setPathStart] = useState<string>('start-entrance');
  const [pathEnd, setPathEnd] = useState<string>('zone-vision');
  const [computedPath, setComputedPath] = useState<string[]>([]);
  const [pathStepInstructions, setPathStepInstructions] = useState<string[]>([]);

  // Outdoor Campus States
  const [selectedLocationPoint, setSelectedLocationPoint] = useState<string>('gedung-d');
  const [travelMode, setTravelMode] = useState<'motor' | 'bus' | 'jalan'>('motor');
  const [routeSimulationSteps, setRouteSimulationSteps] = useState<string[]>([]);

  // Live simulator updates
  const selectedZone = LAB_ZONES.find(z => z.id === selectedZoneId) || LAB_ZONES[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setSimSensorWave(prev => {
        const next = [...prev.slice(1)];
        // Generate values fluctuating around typical signal amplitude
        next.push(Math.floor(15 + Math.random() * 25));
        return next;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Compute Pathfinder within lab
  const handleFindLabPath = () => {
    if (pathStart === pathEnd) {
      setComputedPath([pathStart]);
      setPathStepInstructions(['Anda sudah berada di zona tujuan Anda sekarang.']);
      return;
    }

    const path: string[] = [pathStart];
    const instructions: string[] = [];

    if (pathStart === 'start-entrance') {
      instructions.push('📍 Berdiri di Pintu Masuk Utama Lantai 2 Gedung D.');
      instructions.push('🚶 Lurus ke koridor utama sepanjang 5 meter.');
      
      if (pathEnd === 'zone-cad') {
        path.push('zone-cad');
        instructions.push('👉 Belok kanan tepat sebelum Ruang Rapat.');
        instructions.push('🛠️ Masuk ke dalam Zona Perakitan Sasis & Desain Mekanis (SEC-A). Selesai!');
      } else if (pathEnd === 'zone-pcb') {
        path.push('zone-cad', 'zone-pcb');
        instructions.push('🚶 Berjalan lurus melewati Bengkel Sasis CAD.');
        instructions.push('⚡ Masuk pintu kaca berlabel Microelectronics di sisi kiri Anda.');
        instructions.push('🔬 Tiba di Klinik Solder PCB Elektronik (SEC-B). Selesai!');
      } else if (pathEnd === 'zone-drone') {
        path.push('zone-cad', 'zone-drone');
        instructions.push('🚶 Lewati koridor dalam Bengkel Perakitan.');
        instructions.push('🚧 Cari kandang pelindung jaring baja di ujung paling utara.');
        instructions.push('🛸 Tiba di Pos Pengawas Drone & Avio-Flight (SEC-C). Selesai!');
      } else if (pathEnd === 'zone-vision') {
        path.push('zone-seminar', 'zone-vision');
        instructions.push('👈 Belok kiri di persimpangan Koridor.');
        instructions.push('🖥️ Masuk ke ruang kaca kedap suara server Jetson.');
        instructions.push('🤖 Tiba di AI Vision Corner & Pusat Komputasi (SEC-D). Selesai!');
      } else if (pathEnd === 'zone-seminar') {
        path.push('zone-seminar');
        instructions.push('👈 Belok kiri langsung dari lorong depan pintu masuk.');
        instructions.push('👥 Masuk ke ruang ber-AC dengan logo Smartboard.');
        instructions.push('💼 Tiba di Ruang Rapat & Seminar Kolaboratif (SEC-E). Selesai!');
      }
    } else {
      // Path between zones
      instructions.push(`📍 Bertolak dari ${ROUTE_STATIONS.find(s => s.id === pathStart)?.name}.`);
      instructions.push('🚪 Keluar menuju ke koridor tengah laboratorium robotika.');
      instructions.push('🚶 Berjalan memotong jalur sensor lalu-lalang robot otonom AGV.');
      
      const targetName = ROUTE_STATIONS.find(s => s.id === pathEnd)?.name;
      instructions.push(`👉 Masuki sekat bertanda khusus menuju ke ${targetName}.`);
      instructions.push('🚀 Navigasi otonom berhasil diselesaikan!');
      path.push(pathEnd);
    }

    setComputedPath(path);
    setPathStepInstructions(instructions);
  };

  useEffect(() => {
    handleFindLabPath();
  }, [pathStart, pathEnd]);

  // Compute outdoor routes to school
  const computeOutdoorRoute = () => {
    const steps: string[] = [];
    if (selectedLocationPoint === 'gedung-d') {
      steps.push('📍 Koordinat Laboratorium: Gedung D Lantai 2, Kampus Terpadu Barat.');
      steps.push('🏫 Akses terdekat: Pintu Gerbang Utama II Jalan Raya Teknologi Nusantara.');
      if (travelMode === 'motor') {
        steps.push('🏍️ Parkir motor langsung di Rubanah Gedung D (Area Khusus Robotik & Teknik).');
        steps.push('🛗 Naik lift utama ke lantai 2, belok kiri sejauh 10 meter.');
      } else if (travelMode === 'bus') {
        steps.push('🚌 Turun di Shelter Trans-Teknologi Halte Pendidikan Tinggi V.');
        steps.push('🚶 Berjalan kaki sejauh 180 meter melintasi taman rekayasa ramah lingkungan.');
      } else {
        steps.push('🚶 Berjalan kaki lewat selasar pejalan kaki beratap panel surya.');
        steps.push('🪜 Naik melalui tangga sirkulasi darurat di sisi kanan Gedung D.');
      }
    } else if (selectedLocationPoint === 'gerbang') {
      steps.push('📍 Posisi: Gerbang Pusat Keamanan & Pusat Informasi Terpadu Kampus.');
      steps.push('🛣️ Ambil jalur lurus searah jarum jam melingkari Tugu Robotika.');
      steps.push('🚗 Kendaraan roda empat dipersilakan parkir di Lapangan Terbuka Gedung A.');
      steps.push('👉 Lanjut berjalan kaki ke arah barat laut menuju kluster Gedung D.');
    } else {
      steps.push('📍 Posisi: Lapangan Uji Terbang Helipad & Drone Outdoor Kelas 4-B.');
      steps.push('🌾 Terletak bersebelahan dengan perkebunan sains cerdas hidroponik sekolah.');
      steps.push('🚶 Ambil lorong penghubung timur langsung ke pintu lobby samping Gedung D.');
    }
    setRouteSimulationSteps(steps);
  };

  useEffect(() => {
    computeOutdoorRoute();
  }, [selectedLocationPoint, travelMode]);

  return (
    <section id="navigator-map" className="py-16 border-t border-white/5 relative overflow-hidden">
      
      {/* Decorative background grid and spheres */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Title Center */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-brand-cyan animate-spin-slow" /> SISTEM NAVIGASI LAB AKTIF
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white">
            Peta Navigator Terpadu & Peta Lantai
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-light leading-relaxed">
            Eksplorasi tata letak ruang laboratorium elektronika kami secara interaktif, pantau status IoT, dan temukan navigasi terbaik langsung menuju titik perakitan sistem kami.
          </p>
        </div>

        {/* Unified Tab Switcher (Indoor blueprint vs Outdoor Maps) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 shadow-lg gap-1.5">
            <button
              onClick={() => setActiveTab('indoor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'indoor'
                  ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Blueprint Indoor Gedung D</span>
            </button>
            <button
              onClick={() => setActiveTab('outdoor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'outdoor'
                  ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Outdoor & Kontak GPS Kampus</span>
            </button>
          </div>
        </div>

        {/* EMERGENCY ALARM CAUTION FLASH OVERLAY */}
        {alarmActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-950/40 border-2 border-red-500 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-red-500/10 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500 text-white rounded-full">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-mono font-bold text-red-400 tracking-wider">SIRENE BAHAYA LAB AKTIF</h4>
                <p className="text-xs text-slate-300 font-light">Sistem pemadaman darurat dan sirkulasi asap menyala. Pengosongan area robot otonom diperintahkan.</p>
              </div>
            </div>
            <button
              onClick={() => setAlarmActive(false)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-red-500 text-red-400 text-xs font-mono font-bold rounded-xl cursor-pointer"
            >
              Matikan Alarm Bahaya
            </button>
          </motion.div>
        )}

        {/* CORE INTERFACE CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TAB 1: INDOOR VIEW */}
          {activeTab === 'indoor' && (
            <>
              {/* Left column: SVG Floor plan (6 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-3xl glass-panel border-white/10 select-none space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-mono text-xs text-brand-cyan">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                      <span>BLUEPRINT ELEKTRONIKA & ROBOTIKA</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-800/80 px-2 py-1 rounded text-slate-400">Gedung D, Lantai 2</span>
                  </div>

                  {/* Interactive Blueprint Canvas using inline SVG vector */}
                  <div className="relative aspect-[16/10] bg-black/90 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center p-2">
                    
                    {/* SVG map representation with interactables */}
                    <svg viewBox="0 0 800 500" className="w-full h-full text-slate-500 transition-all font-mono">
                      
                      {/* Grid background */}
                      <defs>
                        <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

                      {/* Main Outlines / Walls */}
                      <rect x="20" y="20" width="760" height="460" rx="16" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                      <line x1="400" y1="20" x2="400" y2="480" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeDasharray="5" />

                      {/* Central Corridor */}
                      <rect x="250" y="160" width="300" height="120" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                      <text x="400" y="225" fill="rgba(255,255,255,0.3)" fontSize="12" textAnchor="middle" fontWeight="bold">KORIDOR TENGAH UTAMA</text>

                      {/* INTERACTIVE ROOMS / ZONES */}
                      
                      {/* Zone CAD - Top Left */}
                      <g 
                        onClick={() => setSelectedZoneId('zone-cad')}
                        className={`cursor-pointer group transition-all`}
                      >
                        <rect 
                          x="40" y="40" width="200" height="180" rx="12"
                          fill={selectedZoneId === 'zone-cad' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)'}
                          stroke={selectedZoneId === 'zone-cad' ? '#06b6d4' : 'rgba(255,255,255,0.15)'}
                          strokeWidth={selectedZoneId === 'zone-cad' ? '2.5' : '1.5'}
                        />
                        <text x="140" y="110" fill={selectedZoneId === 'zone-cad' ? '#06b6d4' : '#94a3b8'} fontSize="11" textAnchor="middle" fontWeight="bold" className="group-hover:fill-brand-sky">
                          KORIDOR CAD & SASIS
                        </text>
                        <text x="140" y="130" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">
                          SEC-A [Click]
                        </text>
                        {/* Dynamic Active Tech dots */}
                        <circle cx="80" cy="180" r="4" fill="#10b981" />
                        <circle cx="100" cy="180" r="4" fill="#10b981" />
                      </g>

                      {/* Zone PCB - Bottom Left */}
                      <g 
                        onClick={() => setSelectedZoneId('zone-pcb')}
                        className={`cursor-pointer group transition-all`}
                      >
                        <rect 
                          x="40" y="240" width="200" height="200" rx="12"
                          fill={selectedZoneId === 'zone-pcb' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)'}
                          stroke={selectedZoneId === 'zone-pcb' ? '#06b6d4' : 'rgba(255,255,255,0.15)'}
                          strokeWidth={selectedZoneId === 'zone-pcb' ? '2.5' : '1.5'}
                        />
                        <text x="140" y="320" fill={selectedZoneId === 'zone-pcb' ? '#06b6d4' : '#94a3b8'} fontSize="11" textAnchor="middle" fontWeight="bold">
                          KLINIK SOLDER PCB
                        </text>
                        <text x="140" y="340" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">
                          SEC-B [Click]
                        </text>
                        {/* Soldering Iron Spark indicator */}
                        <circle cx="100" cy="380" r="5" fill="#f59e0b" className="animate-pulse" />
                      </g>

                      {/* Zone Aerial/Drone Flight Cage - Top Right */}
                      <g 
                        onClick={() => setSelectedZoneId('zone-drone')}
                        className={`cursor-pointer group transition-all`}
                      >
                        <rect 
                          x="560" y="40" width="200" height="200" rx="12"
                          fill={selectedZoneId === 'zone-drone' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)'}
                          stroke={selectedZoneId === 'zone-drone' ? '#06b6d4' : 'rgba(255,255,255,0.15)'}
                          strokeWidth={selectedZoneId === 'zone-drone' ? '2.5' : '1.5'}
                        />
                        <text x="660" y="115" fill={selectedZoneId === 'zone-drone' ? '#06b6d4' : '#94a3b8'} fontSize="11" textAnchor="middle" fontWeight="bold">
                          KANDANG TERBANG DRONE
                        </text>
                        <text x="660" y="135" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">
                          SEC-C [Kunci Aktif]
                        </text>
                        {/* Simulated Drone rotating flight pathway */}
                        <circle cx="660" cy="170" r="14" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3" className="animate-spin-slow" />
                        <ellipse cx="660" cy="170" rx="14" ry="4" fill="none" stroke="#f43f5e" strokeWidth="1" />
                      </g>

                      {/* Zone AI Computer Vision - Bottom Right */}
                      <g 
                        onClick={() => setSelectedZoneId('zone-vision')}
                        className={`cursor-pointer group transition-all`}
                      >
                        <rect 
                          x="560" y="260" width="200" height="180" rx="12"
                          fill={selectedZoneId === 'zone-vision' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)'}
                          stroke={selectedZoneId === 'zone-vision' ? '#06b6d4' : 'rgba(255,255,255,0.15)'}
                          strokeWidth={selectedZoneId === 'zone-vision' ? '2.5' : '1.5'}
                        />
                        <text x="660" y="330" fill={selectedZoneId === 'zone-vision' ? '#06b6d4' : '#94a3b8'} fontSize="11" textAnchor="middle" fontWeight="bold">
                          AI VISION & SERVER
                        </text>
                        <text x="660" y="350" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">
                          SEC-D [Click]
                        </text>
                        <circle cx="660" cy="400" r="4" fill="#a855f7" className="animate-ping" />
                      </g>

                      {/* Zone Seminar Co-Working - Top Middle */}
                      <g 
                        onClick={() => setSelectedZoneId('zone-seminar')}
                        className={`cursor-pointer group transition-all`}
                      >
                        <rect 
                          x="260" y="40" width="280" height="110" rx="12"
                          fill={selectedZoneId === 'zone-seminar' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)'}
                          stroke={selectedZoneId === 'zone-seminar' ? '#06b6d4' : 'rgba(255,255,255,0.15)'}
                          strokeWidth={selectedZoneId === 'zone-seminar' ? '2.5' : '1.5'}
                        />
                        <text x="400" y="90" fill={selectedZoneId === 'zone-seminar' ? '#06b6d4' : '#94a3b8'} fontSize="11" textAnchor="middle" fontWeight="bold">
                          RUANG SEMINAR & BRAINSTORMING (SEC-E)
                        </text>
                        <circle cx="300" cy="115" r="3" fill="#10b981" />
                        <circle cx="320" cy="115" r="3" fill="#10b981" />
                        <circle cx="340" cy="115" r="3" fill="#10b981" />
                      </g>

                      {/* Main Entrance (Start point) - Bottom Middle */}
                      <rect x="330" y="440" width="140" height="40" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                      <text x="400" y="465" fill="#a5b4fc" fontSize="11" textAnchor="middle" fontWeight="bold">🚪 PINTU MASUK UTAMA</text>

                      {/* DRAW COMPUTED PATH IN REAL-TIME IF SELECTED */}
                      {computedPath.length > 0 && (
                        <g>
                          {/* Entry Entrance point coordinates */}
                          {computedPath.includes('start-entrance') && (
                            <circle cx="400" cy="445" r="10" fill="#06b6d4" fillOpacity="0.4" className="animate-ping" />
                          )}

                          {/* Dynamic SVG polyline paths */}
                          {pathEnd === 'zone-cad' && (
                            <path d="M 400 440 L 400 220 L 140 220 L 140 180" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeDasharray="8,5" className="animate-pulse" />
                          )}
                          {pathEnd === 'zone-pcb' && (
                            <path d="M 400 440 L 400 220 L 140 220 L 140 300" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeDasharray="8,5" className="animate-pulse" />
                          )}
                          {pathEnd === 'zone-drone' && (
                            <path d="M 400 440 L 400 220 L 660 220 L 660 185" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeDasharray="8,5" className="animate-pulse" />
                          )}
                          {pathEnd === 'zone-vision' && (
                            <path d="M 400 440 L 400 220 L 660 220 L 660 280" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeDasharray="8,5" className="animate-pulse" />
                          )}
                          {pathEnd === 'zone-seminar' && (
                            <path d="M 400 440 L 400 120" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeDasharray="8,5" className="animate-pulse" />
                          )}
                        </g>
                      )}

                      {/* Warning Emergency red flashes inside lab */}
                      {alarmActive && (
                        <rect x="0" y="0" width="800" height="500" rx="16" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" strokeWidth="8" className="pointer-events-none" />
                      )}

                    </svg>

                    {/* Floating map controls */}
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <button
                        onClick={() => {
                          setAlarmActive(!alarmActive);
                          if (!alarmActive) {
                            onAddToast?.('Sirene Darurat Laboratorium Diaktifkan untuk Simulasi!', 'error');
                          }
                        }}
                        className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white cursor-pointer shadow flex items-center gap-1.5"
                        title="Simulasi Bahaya"
                      >
                        <Volume2 className="w-4 h-4 animate-bounce" />
                        <span className="text-[10px] font-mono font-bold">Uji Sirene</span>
                      </button>
                    </div>
                  </div>

                  {/* Informational guide */}
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex gap-2.5 items-start text-xs font-light text-slate-400">
                    <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Petunjuk Interaktif:</strong> Klik pada zona-zona bergaris di atas untuk merinci instrumen, daftar penanggung jawab lab, sensor IoT, serta kamera pengawas live telemetry.
                    </p>
                  </div>
                </div>

                {/* Sub-Widget: Pathfinder inside Lab */}
                <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-brand-cyan" />
                    <h3 className="font-display font-extrabold text-base text-white">Navigator Rute Otonom Lab</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-450 uppercase mb-1.5">Titik Awal Keberangkatan:</label>
                      <select
                        value={pathStart}
                        onChange={(e) => setPathStart(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white outline-none focus:border-brand-cyan"
                      >
                        {ROUTE_STATIONS.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-450 uppercase mb-1.5">Destinasi Target:</label>
                      <select
                        value={pathEnd}
                        onChange={(e) => setPathEnd(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white outline-none focus:border-brand-cyan"
                      >
                        {LAB_ZONES.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-black/60 rounded-2xl border border-white/5 text-xs font-mono space-y-2">
                    <span className="text-[10px] text-brand-cyan uppercase font-bold tracking-widest block">Langkah Navigasi Otonom Terhitung:</span>
                    <div className="space-y-1.5 font-light">
                      {pathStepInstructions.map((step, k) => (
                        <div key={k} className="flex gap-2 items-start leading-relaxed text-slate-300">
                          <CornerDownRight className="w-3.5 h-3.5 text-brand-purple shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right column: Sensor IoT & Live Stats feeds (5 cols) */}
              <div className="lg:col-span-5 space-y-6">

                {/* Live Camera Surveillance Feed Simulator */}
                <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
                      <Tv className="w-5 h-5 text-brand-cyan" />
                      Live Feed Kamera Lab
                    </h3>
                    <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono rounded">
                      TELEMETRY_ONLINE
                    </span>
                  </div>

                  <div className="relative aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
                    
                    {/* Retro CCTV monitor simulation */}
                    <div className="absolute inset-x-0 top-3 px-4 flex justify-between z-10 text-[9px] font-mono text-green-400">
                      <span>CAM: {selectedZone.id.toUpperCase()}</span>
                      <span className="animate-pulse">● RECORDING_STREAM</span>
                    </div>

                    {/* Animated visual telemetry (depending on zone selected) */}
                    <div className="p-4 flex flex-col items-center text-center space-y-2 z-10">
                      <div className="w-10 h-10 border border-brand-cyan/20 bg-brand-cyan/5 rounded-full flex items-center justify-center text-brand-cyan animate-pulse">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">{selectedZone.liveStatus}</span>
                      <p className="text-[11px] text-slate-400 max-w-xs">{selectedZone.name}</p>
                    </div>

                    {/* SVG scanlines simulation pattern overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-scanner-overlay opacity-[0.12]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none" />

                  </div>

                  {/* Real-time Oscilloscope/Wave generator chart */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>FREKUENSI KENDALI OTOMATIS:</span>
                      <span className="text-brand-cyan">2.485 GHz</span>
                    </div>
                    {/* Simple pure-CSS responsive flex bar chart for signal wave */}
                    <div className="h-12 bg-black/80 p-2 rounded-xl flex items-end gap-1.5 border border-white/5 overflow-hidden">
                      {simSensorWave.map((val, key) => (
                        <div 
                          key={key} 
                          className="flex-1 bg-gradient-to-t from-brand-blue to-brand-cyan rounded-t transition-all duration-300"
                          style={{ height: `${val * 2}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* IoT Metrics card */}
                <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-brand-cyan tracking-wider uppercase block font-semibold">{selectedZone.codename}</span>
                      <h3 className="font-display font-extrabold text-base text-white mt-0.5">Status Lingkungan IoT</h3>
                    </div>
                    <div className="p-2 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl">
                      <Radio className="w-5 h-5 text-brand-cyan" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {selectedZone.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 text-left flex items-start gap-2.5">
                      <Thermometer className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Suhu Ruang:</span>
                        <span className="text-sm font-semibold text-white font-mono">{selectedZone.iotMetrics.temp} °C</span>
                      </div>
                    </div>
                    <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 text-left flex items-start gap-2.5">
                      <Droplets className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Kelebaban:</span>
                        <span className="text-sm font-semibold text-white font-mono">{selectedZone.iotMetrics.humidity} %</span>
                      </div>
                    </div>
                    <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 text-left flex items-start gap-2.5">
                      <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Daya Server:</span>
                        <span className="text-sm font-semibold text-white font-mono">{selectedZone.iotMetrics.power} W</span>
                      </div>
                    </div>
                    <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 text-left flex items-start gap-2.5">
                      <Cpu className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Robot Aktif:</span>
                        <span className="text-sm font-semibold text-white font-mono">{selectedZone.iotMetrics.activeRobots} Unit</span>
                      </div>
                    </div>
                  </div>

                  {/* Lock system trigger */}
                  <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      {selectedZone.locked ? (
                        <div className="p-2.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl">
                          <Lock className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2.5 bg-green-500/15 border border-green-500/30 text-green-400 rounded-xl">
                          <Unlock className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Otorisasi Kunci Magnetik:</span>
                        <span className="text-xs font-semibold font-mono text-white">
                          {selectedZone.locked ? 'PINTU TERKUNCI (SAFETY)' : 'AKSES UMUM TERBUKA'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        selectedZone.locked = !selectedZone.locked;
                        onAddToast?.(`Sistem Otorisasi Pintu ${selectedZone.locked ? 'MELOCKDOWN' : 'MEMBUKA'} ${selectedZone.codename}!`, selectedZone.locked ? 'error' : 'success');
                      }}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/15 text-[10px] text-slate-300 font-mono font-bold rounded-xl cursor-pointer"
                    >
                      Beralih Sesi
                    </button>
                  </div>

                  {/* Active Technicians */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-450 uppercase block tracking-wider font-semibold">Anggota Log-In di Zona:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedZone.activeTechs.map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs rounded-xl flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>{tech}</span>
                        </span>
                      ))}
                      {selectedZone.activeTechs.length === 0 && (
                        <span className="text-xs text-slate-500 italic font-mono font-light">Tidak ada aktivitas terdeteksi.</span>
                      )}
                    </div>
                  </div>

                  {/* Tech/Tools lists */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-450 uppercase block tracking-wider font-semibold">Perangkat Utama & Presisi:</span>
                    <ul className="space-y-1.5">
                      {selectedZone.tools.map((tool, index) => (
                        <li key={index} className="flex gap-2 items-center text-xs text-slate-300">
                          <Wrench className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                          <span className="truncate">{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            </>
          )}

          {/* TAB 2: OUTDOOR VIEW */}
          {activeTab === 'outdoor' && (
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column Map Simulation (7 cols) */}
              <div className="md:col-span-7 p-6 rounded-3xl glass-panel border-white/10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono text-brand-cyan tracking-wider uppercase font-semibold">SATELIT GEOGRAFIS KAMPUS</span>
                    <span className="px-2 py-0.5 bg-brand-cyan/10 text-brand-cyan text-[10px] font-mono rounded">
                      GPS ACTIVE
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-white">Visualisasi Lokasi Sekolah Menegah</h3>
                  <p className="text-xs text-slate-450 mt-1 font-light leading-relaxed">
                    Peta rute otonom digital dari beberapa gerbang transit utama menuju ke Pusat Elektronika Terpadu, Laboratorium Robotika Lantai 2 Gedung D.
                  </p>
                </div>

                {/* SVG Visual Campus Map Representation */}
                <div className="relative aspect-video bg-sky-950/20 border border-white/10 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-2">
                  <svg viewBox="0 0 700 400" className="w-full h-full text-slate-500 font-mono">
                    <rect width="100%" height="100%" fill="#0a1329" />
                    
                    {/* Streets map styling */}
                    <path d="M 0 350 L 700 150 M 100 0 L 100 400 M 500 0 L 500 400" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="18" strokeLinecap="round" />
                    <path d="M 0 350 L 700 150 M 100 0 L 100 400 M 500 0 L 500 400" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" strokeDasharray="6,4" />

                    {/* Campus Area Ring Boundary */}
                    <circle cx="340" cy="200" r="160" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="2" strokeDasharray="10,5" />
                    <text x="340" y="55" fill="rgba(6, 182, 212, 0.5)" fontSize="10" textAnchor="middle" fontWeight="bold" letterSpacing="4">KAWASAN KAMPUS TEKNOLOGI</text>

                    {/* Campus Buildings Visual Shapes */}

                    {/* Gedung A */}
                    <g 
                      onClick={() => setSelectedLocationPoint('gerbang')}
                      className="cursor-pointer group"
                    >
                      <rect x="150" y="100" width="100" height="70" rx="8" fill="#131e3d" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" className="group-hover:stroke-brand-blue" />
                      <text x="200" y="140" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="semibold">Gedung Utama A</text>
                    </g>

                    {/* Gedung B */}
                    <g className="cursor-pointer">
                      <rect x="290" y="80" width="90" height="60" rx="8" fill="#131e3d" stroke="rgba(255,255,255,0.1)" />
                      <text x="335" y="115" fill="#64748b" fontSize="9" textAnchor="middle">Gedung B</text>
                    </g>

                    {/* Helipad / Outdoor testing field */}
                    <g 
                      onClick={() => setSelectedLocationPoint('helipad')}
                      className="cursor-pointer group"
                    >
                      <circle cx="430" cy="280" r="35" fill="rgba(244, 63, 94, 0.1)" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4" />
                      <text x="430" y="283" fill="#f43f5e" fontSize="9" textAnchor="middle" fontWeight="extrabold">H / HELIPAD</text>
                      <text x="430" y="330" fill="#64748b" fontSize="8" textAnchor="middle">Lapangan Drone</text>
                    </g>

                    {/* Gedung D (Our target!) */}
                    <g 
                      onClick={() => setSelectedLocationPoint('gedung-d')}
                      className="cursor-pointer group"
                    >
                      <rect 
                        x="230" y="220" width="140" height="100" rx="12" 
                        fill={selectedLocationPoint === 'gedung-d' ? 'rgba(6, 182, 212, 0.25)' : '#101f30'} 
                        stroke={selectedLocationPoint === 'gedung-d' ? '#06b6d4' : 'rgba(255,255,255,0.15)'} 
                        strokeWidth="3.5" 
                      />
                      <text x="300" y="265" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">GEDUNG D</text>
                      <text x="300" y="285" fill="#06b6d4" fontSize="9" textAnchor="middle" fontWeight="semibold">LAB ROBOTIKA</text>
                      {/* Interactive glowing signal ring */}
                      <circle cx="340" cy="240" r="6" fill="#06b6d4" className="animate-ping" />
                    </g>

                    {/* Map Marker Pin */}
                    <g transform="translate(340, 215)">
                      <circle cx="0" cy="0" r="4" fill="#06b6d4" />
                    </g>

                    {/* Compass symbol in corner */}
                    <g transform="translate(640, 60)">
                      <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                      <line x1="0" y1="-25" x2="0" y2="25" stroke="rgba(255,255,255,0.3)" />
                      <line x1="-25" y1="0" x2="25" y2="0" stroke="rgba(255,255,255,0.3)" />
                      <polygon points="0,-18 -6,0 6,0" fill="#f43f5e" />
                      <polygon points="0,18 -6,0 6,0" fill="#94a3b8" />
                      <text x="0" y="-28" fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">N</text>
                    </g>

                  </svg>
                </div>

                {/* Sub-Selector for Location and Transit Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-450 uppercase mb-1.5">Pilih Titik Tolak Informasi:</label>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedLocationPoint('gedung-d')}
                        className={`p-2 px-3.5 rounded-xl border text-left text-xs font-mono font-medium flex items-center justify-between cursor-pointer ${selectedLocationPoint === 'gedung-d' ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
                      >
                        <span>Gedung D (Pusat Lab)</span>
                        <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                      </button>
                      <button
                        onClick={() => setSelectedLocationPoint('gerbang')}
                        className={`p-2 px-3.5 rounded-xl border text-left text-xs font-mono font-medium flex items-center justify-between cursor-pointer ${selectedLocationPoint === 'gerbang' ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
                      >
                        <span>Gerbang Utama I Kampus</span>
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                      <button
                        onClick={() => setSelectedLocationPoint('helipad')}
                        className={`p-2 px-3.5 rounded-xl border text-left text-xs font-mono font-medium flex items-center justify-between cursor-pointer ${selectedLocationPoint === 'helipad' ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
                      >
                        <span>Helipad Ring Terbang</span>
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-450 uppercase mb-1.5">Metode Transportasi Anda:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTravelMode('motor')}
                        className={`py-3 rounded-xl border text-center text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer ${travelMode === 'motor' ? 'bg-brand-cyan text-slate-950 border-brand-cyan font-bold' : 'bg-slate-900 border-white/5 text-slate-400'}`}
                      >
                        <Car className="w-4 h-4" />
                        <span>Motor</span>
                      </button>
                      <button
                        onClick={() => setTravelMode('bus')}
                        className={`py-3 rounded-xl border text-center text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer ${travelMode === 'bus' ? 'bg-brand-cyan text-slate-950 border-brand-cyan font-bold' : 'bg-slate-900 border-white/5 text-slate-400'}`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Bus</span>
                      </button>
                      <button
                        onClick={() => setTravelMode('jalan')}
                        className={`py-3 rounded-xl border text-center text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer ${travelMode === 'jalan' ? 'bg-brand-cyan text-slate-950 border-brand-cyan font-bold' : 'bg-slate-900 border-white/5 text-slate-400'}`}
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Kaki</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column details & contacts (5 cols) */}
              <div className="md:col-span-12 lg:col-span-5 p-6 rounded-3xl glass-panel border-white/10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-brand-cyan" />
                    <h3 className="font-display font-extrabold text-base text-white">Panduan Penunjuk Perjalanan</h3>
                  </div>
                  
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/5 text-xs font-mono space-y-3">
                    <span className="text-[10px] text-brand-purple font-bold tracking-widest block uppercase">LOKASI & JARAK TEMPUH LINTASAN:</span>
                    <div className="space-y-2 text-slate-300 font-light">
                      {routeSimulationSteps.map((step, idx) => (
                        <p key={idx} className="flex gap-2 items-start leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-wider font-bold">Rincian Kontak Sekertariat Robotika</h4>
                  <div className="space-y-3 text-xs leading-relaxed font-light text-slate-300">
                    <div className="p-3 bg-white/3 rounded-xl border border-white/5 flex gap-3">
                      <Home className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-white font-mono text-[10px] uppercase">Alamat Lab Presisi:</span>
                        <span>Ruang 214, Lantai 2 Gedung D Elektronika, Kampus Barat Jalan Raya Teknologi No. 42A.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/3 rounded-xl border border-white/5 flex gap-3">
                      <Radio className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-white font-mono text-[10px] uppercase">Sistem Telepon & WhatsApp:</span>
                        <span className="block">+62 821-4554-9900</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated campus facts summary */}
                <div className="p-4 bg-blue-900/10 border border-brand-blue/20 rounded-2xl text-xs flex gap-3 items-center">
                  <Sparkles className="w-5 h-5 text-brand-cyan animate-pulse shrink-0" />
                  <p className="text-slate-350 leading-relaxed font-light">
                    Kawasan laboratorium kami didukung oleh energi ramah lingkungan mandiri panel surya berkekuatan 12 kVA.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
