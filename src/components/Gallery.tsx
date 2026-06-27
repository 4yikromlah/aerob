/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import ScrollReveal from './ScrollReveal';
import { GALLERY_IMGS } from '../data/roboticsData';
import { ActivityImage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, X, ChevronLeft, ChevronRight, Calendar, Info } from 'lucide-react';

type FilterCategory = 'Semua' | 'Workshop' | 'Lomba' | 'Pelatihan' | 'Kunjungan Industri' | 'Seminar' | 'Praktikum';

interface GalleryProps {
  images?: ActivityImage[];
}

export default function Gallery({ images }: GalleryProps) {
  const currentImages = images || GALLERY_IMGS;
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories: FilterCategory[] = [
    'Semua',
    'Workshop',
    'Lomba',
    'Pelatihan',
    'Kunjungan Industri',
    'Seminar',
    'Praktikum'
  ];

  // Filtering images based on selection
  const filteredImages = useMemo(() => {
    if (activeCategory === 'Semua') return currentImages;
    return currentImages.filter(img => img.category === activeCategory);
  }, [activeCategory, currentImages]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + filteredImages.length) % filteredImages.length));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filteredImages.length));
  };

  const currentLightboxImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-24 relative bg-slate-900 overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal variant="fadeUp">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-cyan">
              Dokumentasi Aksi Lapangan
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
              Galeri Kegiatan Terkini
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="w-16 h-1.5 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full mx-auto mt-4" />
          </ScrollReveal>
        </div>

        {/* Filter categories bar */}
        <ScrollReveal variant="fadeUp" delay={0.15} className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null); // Clear lightbox state on filter change
                }}
                className={`px-4 py-2 border rounded-full text-xs font-mono tracking-wide cursor-pointer uppercase transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-bold shadow-md shadow-brand-cyan/5'
                    : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </ScrollReveal>

        {/* Grid Images with AnimatePresence */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
                key={img.id}
                className="group relative rounded-2xl overflow-hidden aspect-video sm:aspect-square bg-slate-950 border border-white/5 cursor-pointer shadow-lg hover:border-brand-cyan/30"
                onClick={() => setLightboxIndex(idx)}
              >
                {/* Image */}
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />

                {/* Cyber Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                  <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="px-2 py-0.5 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan rounded-full text-[8.5px] font-mono tracking-wider font-semibold uppercase">
                      {img.category}
                    </span>
                    <h3 className="text-sm font-display font-medium text-white line-clamp-1">
                      {img.title}
                    </h3>
                    <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight font-light">
                      {img.description}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 pt-1">
                      <Camera className="w-3 h-3 text-brand-cyan" />
                      <span>{img.date}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Quick Icon Indicator */}
                <div className="absolute top-4 right-4 p-2 bg-slate-900/80 border border-white/10 rounded-xl text-brand-cyan opacity-100 group-hover:scale-110 group-hover:bg-brand-cyan group-hover:text-white transition-all shadow-md">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state support */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 bg-slate-950/40 rounded-3xl border border-white/5">
            <Camera className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
            <p className="text-sm font-mono text-slate-400 mt-2">Tidak ada dokumentasi kegiatan dalam kategori ini.</p>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentLightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setLightboxIndex(null)}
            />

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-4xl p-2 rounded-3xl glass-panel border-white/10 shadow-2xl z-20 flex flex-col items-center"
            >
              
              {/* Close Button top-right */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 p-2 bg-slate-950 rounded-full border border-white/10 text-slate-400 hover:text-white cursor-pointer z-30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev/Next arrows navigation */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/80 border border-white/10 text-slate-300 hover:text-brand-cyan rounded-full cursor-pointer z-35"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/80 border border-white/10 text-slate-300 hover:text-brand-cyan rounded-full cursor-pointer z-35"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Inspect Card columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-4 max-h-[85vh] overflow-y-auto">
                
                {/* Photo Viewer */}
                <div className="lg:col-span-8 flex items-center justify-center bg-black/60 rounded-2xl overflow-hidden min-h-[250px] sm:min-h-[400px]">
                  <img
                    src={currentLightboxImage.imageUrl}
                    alt={currentLightboxImage.title}
                    className="max-w-full max-h-[60vh] object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Technical Side Info bar */}
                <div className="lg:col-span-4 p-5 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="px-2.5 py-0.5 bg-brand-cyan/15 border border-brand-cyan/20 text-brand-cyan rounded-full text-[9px] font-mono tracking-wider font-bold uppercase inline-block">
                      {currentLightboxImage.category}
                    </span>
                    <h3 className="text-lg font-display font-extrabold text-white">
                      {currentLightboxImage.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {currentLightboxImage.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5 text-xs font-mono">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar className="w-4 h-4 text-brand-cyan shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-500 block">Tanggal Kegiatan:</span>
                        <span className="text-white font-medium">{currentLightboxImage.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Info className="w-4 h-4 text-brand-purple shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-500 block">Sertifikasi & Kategori Lomba:</span>
                        <span className="text-white font-medium">Internal & Eksternal</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="w-full py-2.5 bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Tutup Dokumentasi
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
