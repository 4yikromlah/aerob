/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import { PRODUCTS_DATA } from '../data/roboticsData';
import { ProductItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Settings, 
  Terminal, 
  Tag, 
  Cpu, 
  GitBranch, 
  CheckCircle, 
  Play, 
  X,
  Sparkles,
  CircuitBoard,
  RefreshCw
} from 'lucide-react';

interface ProductsCatalogProps {
  products?: ProductItem[];
}

export default function ProductsCatalog({ products }: ProductsCatalogProps) {
  const currentProducts = products || PRODUCTS_DATA;
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  
  // Filtering & Category states
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const categories = ['Semua', 'Mobile Robotics', 'Artificial Intelligence', 'Internet of Things', 'Smart City', 'Rescue Robotics'];

  // Simulate skeleton screen reloading on category change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Semua') return currentProducts;
    return currentProducts.filter((p) => p.category === activeCategory);
  }, [activeCategory, currentProducts]);

  // Interactive simulator state
  const [simLogs, setSimLogs] = useState<string[]>(['Sistem Pengujian Serial Siap.', 'Pilih fungsi uji untuk memulai...']);
  const [pinState, setPinState] = useState<boolean>(false);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Prototype':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Development':
        return 'bg-brand-purple/10 text-brand-purple border-brand-purple/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  // Run simulated commands
  const handleTestSim = (commandType: string, productName: string) => {
    if (isMeasuring) return;
    setIsMeasuring(true);
    
    let logs: string[] = [];
    if (commandType === 'baud') {
      logs = [
        `[${productName}]`,
        `>> Membuka koneksi COM4...`,
        `>> Sukses terhubung pada 115200 Baudrate.`,
        `>> Memuat memori firmware...`,
        `>> Membaca pin I/O: STABLE`,
        `>> OK`
      ];
    } else if (commandType === 'sensors') {
      logs = [
        `[${productName}]`,
        `>> Menjalankan kalibrasi sensor ADC...`,
        `>> Nilai sensor minimum: 120`,
        `>> Nilai sensor maksimum: 1024`,
        `>> Sinyal filtering Kalmann: AKTIF`,
        `>> Deviasi margin error: <0.12%`,
        `>> Selesai.`
      ];
    } else if (commandType === 'toggle') {
      const nextLed = !pinState;
      setPinState(nextLed);
      logs = [
        `[${productName}]`,
        `>> Menulis sinyal digital Pin 13...`,
        `>> Sinyal diganti ke: ${nextLed ? 'HIGH' : 'LOW'}`,
        `>> Tegangan pin output: ${nextLed ? '3.3V [ON]' : '0.0V [OFF]'}`,
        `>> Indikator LED Hardware berhasil direspon.`
      ];
    }

    setSimLogs(logs);
    setTimeout(() => {
      setIsMeasuring(false);
    }, 400);
  };

  return (
    <section id="products" className="py-24 relative bg-slate-900 bg-circuit-pattern overflow-hidden">
      
      {/* Background neon visual glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <ScrollReveal variant="fadeUp">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-cyan">
              Inkubator Reka Cipta Siswa
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
              Galeri Produk & Karya Robotika
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="w-16 h-1.5 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full mx-auto mt-4" />
          </ScrollReveal>
        </div>

        {/* Category filters bar */}
        <ScrollReveal variant="fadeUp" delay={0.15} className="flex flex-wrap justify-center items-center gap-2 mb-12 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 border rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wide cursor-pointer uppercase transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-md shadow-brand-cyan/5'
                    : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </ScrollReveal>

        {/* Display Products List */}
        {isLoading ? (
          /* Skeleton Loading Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="w-full rounded-2xl glass-panel border-white/5 animate-pulse flex flex-col justify-between overflow-hidden h-[400px]">
                <div className="w-full h-48 bg-slate-950/80 relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 animate-spin-slow flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-slate-700" />
                  </div>
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-950/90 rounded w-3/4" />
                    <div className="h-3 bg-slate-950/90 rounded w-full" />
                    <div className="h-3 bg-slate-950/90 rounded w-5/6" />
                    <div className="flex gap-1.5 pt-2">
                      <div className="h-5 bg-slate-950 w-16 rounded" />
                      <div className="h-5 bg-slate-950 w-20 rounded" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="h-3 bg-slate-950 rounded w-1/3" />
                    <div className="h-3 bg-slate-950 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod, index) => (
              <ScrollReveal
                key={prod.id}
                variant="zoomIn"
                delay={index * 0.08}
                className="group flex"
              >
                <div 
                  className="w-full rounded-2xl glass-panel border-white/5 hover:border-brand-cyan/35 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-blue/10"
                  onClick={() => {
                    setSelectedProduct(prod);
                    setSimLogs(['Sistem Pengujian Serial Siap.', `Terkoneksi ke: ${prod.name}`]);
                    setPinState(false);
                  }}
                >
                  
                  {/* Photo space */}
                  <div className="w-full h-48 aspect-video overflow-hidden border-b border-white/5 relative bg-slate-950">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded-lg border border-white/10 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      {prod.category}
                    </div>
                    <div className={`absolute top-3 right-3 border px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase backdrop-blur tracking-wider ${getStatusBadgeColor(prod.status)}`}>
                      {prod.status}
                    </div>
                  </div>

                  {/* Content info card */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-[15px] font-display font-bold text-white group-hover:text-brand-cyan transition-colors leading-tight line-clamp-2">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-light">
                        {prod.description}
                      </p>

                      {/* Tech tag list capsule */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {prod.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="px-2 py-0.5 bg-white/5 rounded-md text-[9px] font-mono text-slate-300 border border-white/5">
                            #{tech}
                          </span>
                        ))}
                        {prod.technologies.length > 3 && (
                          <span className="text-[9px] font-mono text-brand-cyan self-center ml-1">
                            +{prod.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 font-medium">Inovator: <strong className="text-slate-300">{prod.creator.split(' (')[0]}</strong></span>
                      <span className="text-brand-cyan group-hover:text-brand-purple flex items-center gap-0.5 transition-colors font-semibold">
                        <span>Uji Simulator</span>
                        <Play className="w-3 h-3 fill-current text-current ml-0.5" />
                      </span>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Empty state UI */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-slate-950/40 rounded-3xl border border-white/5 max-w-4xl mx-auto space-y-3 mt-4">
            <CircuitBoard className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
            <p className="text-sm font-mono text-slate-400">Belum ada karya produk robotika terdaftar di kategori ini.</p>
            <button
              onClick={() => setActiveCategory('Semua')}
              className="p-1 px-3 bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 rounded-lg text-xs font-semibold hover:bg-brand-cyan/30 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Kembali Ke Semua Produk</span>
            </button>
          </div>
        )}

      </div>

      {/* Simulator Sandbox Modality Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setSelectedProduct(null)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl glass-panel border-white/10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-1.5 bg-slate-900 rounded-full border border-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan rounded-2xl">
                    <CircuitBoard className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border font-semibold ${getStatusBadgeColor(selectedProduct.status)}`}>
                      Status: {selectedProduct.status}
                    </span>
                    <h3 className="text-lg font-display font-extrabold text-white mt-1">
                      {selectedProduct.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Product Specifications Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Tech specifications left */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-2">
                       Rincian Teknis Komponen:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 font-light list-inside leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                      {selectedProduct.specs.map((spec, i) => (
                        <li key={i} className="flex gap-2 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                    <div className="bg-white/3 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-500 block text-[9px]">Perancang:</span>
                      <span className="text-white font-medium block truncate">{selectedProduct.creator}</span>
                    </div>
                    <div className="bg-white/3 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-500 block text-[9px]">Tahun Karya:</span>
                      <span className="text-white font-medium block">{selectedProduct.year}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Component Hardware Monitor right */}
                <div className="bg-black/90 p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 font-mono select-none">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1.5 uppercase tracking-wide">
                      <Terminal className="w-3.5 h-3.5 text-green-400" /> COM Port Simulator
                    </span>
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                  </div>

                  {/* Serial Console log screen */}
                  <div className="flex-1 bg-black p-3.5 rounded-xl text-[10px] text-green-300 min-h-[140px] max-h-[180px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                    {simLogs.map((log, idx) => (
                      <p key={idx} className="leading-tight break-all">
                        {log}
                      </p>
                    ))}
                  </div>

                  {/* Commands panel */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wide">Klik untuk mendelegasi program:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleTestSim('baud', selectedProduct.name)}
                        disabled={isMeasuring}
                        className="py-1.5 bg-slate-900 border border-white/10 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white hover:border-brand-cyan transition-colors cursor-pointer"
                      >
                        Ping COM
                      </button>
                      <button
                        onClick={() => handleTestSim('sensors', selectedProduct.name)}
                        disabled={isMeasuring}
                        className="py-1.5 bg-slate-900 border border-white/10 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white hover:border-brand-cyan transition-colors cursor-pointer"
                      >
                        Uji ADC
                      </button>
                      <button
                        onClick={() => handleTestSim('toggle', selectedProduct.name)}
                        disabled={isMeasuring}
                        className="py-1.5 bg-slate-900 border border-white/10 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white hover:border-brand-cyan transition-colors cursor-pointer flex justify-center items-center gap-1"
                      >
                        Led Pin13: <span className={`inline-block w-2 h-2 rounded-full ${pinState ? 'bg-orange-500 animate-pulse' : 'bg-slate-600'}`} />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Technologies capsule list footer */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Metodologi & Stack:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedProduct.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl text-xs font-mono text-brand-cyan">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
