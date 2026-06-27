/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import ScrollReveal from './ScrollReveal';
import { NEWS_DATA } from '../data/roboticsData';
import { NewsItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, User, Clock, ChevronRight, X, Bell, Newspaper, Award, RefreshCw } from 'lucide-react';

interface NewsSectionProps {
  news?: NewsItem[];
  generalInfo?: string;
}

export default function NewsSection({ news, generalInfo }: NewsSectionProps) {
  const currentNews = news || NEWS_DATA;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const categories = ['Semua', 'Pengumuman', 'Jadwal Latihan', 'Agenda', 'Prestasi', 'Event'];

  // Filtering news based on search and category
  const filteredArticles = useMemo(() => {
    return currentNews.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, activeCategory, currentNews]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pengumuman':
        return <Bell className="w-4 h-4 text-brand-cyan" />;
      case 'Prestasi':
        return <Award className="w-4 h-4 text-brand-purple" />;
      default:
        return <Newspaper className="w-4 h-4 text-brand-teal" />;
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Pengumuman':
        return 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20';
      case 'Prestasi':
        return 'bg-brand-purple/10 text-brand-purple border-brand-purple/20';
      case 'Jadwal Latihan':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-brand-sky/10 text-brand-sky border-brand-sky/20';
    }
  };

  return (
    <section id="news" className="py-24 relative bg-slate-950 overflow-hidden">
      
      {/* Background spotlights */}
      <div className="absolute bottom-1/4 left-1/10 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <ScrollReveal variant="fadeUp">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-cyan">
              Papan Pengumuman & Kabar Utama
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
              Informasi Terkini Robotika
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="w-16 h-1.5 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full mx-auto mt-4" />
          </ScrollReveal>
        </div>

        {/* Dynamic General Broadcast Headline Banner */}
        {generalInfo && (
          <ScrollReveal variant="fadeUp" delay={0.25}>
            <div className="mb-10 max-w-4xl mx-auto relative overflow-hidden rounded-3xl border border-brand-cyan/25 bg-brand-cyan/5 p-6 flex items-start gap-4 shadow-lg shadow-brand-cyan/2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
              <div className="p-3 bg-brand-cyan/15 rounded-xl text-brand-cyan shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="p-0.5 px-2 bg-brand-cyan/25 text-brand-cyan rounded-md text-[9px] font-mono tracking-wider font-bold uppercase animate-pulse border border-brand-cyan/20">INFORMASI UTAMA (PENGUMUMAN)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-normal font-sans font-light">
                  {generalInfo}
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Search and Category Filter Tools */}
        <ScrollReveal variant="fadeUp" delay={0.15} className="mb-12">
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/5 space-y-4 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Search input */}
              <div className="md:col-span-12 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pengumuman, prestasi, atau modul latihan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-brand-cyan transition-all font-sans"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

            {/* Quick Categories filter */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono font-semibold text-slate-400 tracking-wider uppercase mr-2 block">
                Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-cyan/20 border-brand-cyan/40 text-brand-cyan'
                      : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Articles Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art, idx) => (
            <ScrollReveal
              key={art.id}
              variant="fadeUp"
              delay={idx * 0.1}
              className="group flex"
            >
              <div 
                className="w-full rounded-3xl glass-panel border-white/5 hover:border-brand-cyan/20 overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-blue/10"
                onClick={() => setSelectedArticle(art)}
              >
                
                {/* Header Image if available */}
                {art.imageUrl && (
                  <div className="w-full h-44 aspect-video overflow-hidden border-b border-white/5 relative">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg border border-white/10 text-[9px] font-mono tracking-wider font-bold uppercase text-brand-cyan">
                      {art.category}
                    </div>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {!art.imageUrl && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] border font-mono font-semibold ${getCategoryTheme(art.category)}`}>
                          {art.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{art.date}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-display font-bold text-white group-hover:text-brand-cyan transition-colors leading-tight line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-light">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-brand-cyan" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 font-semibold truncate max-w-[110px]">
                        {art.author}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-brand-cyan flex items-center gap-1 group-hover:text-brand-purple transition-colors font-semibold">
                      <span>Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Empty state support */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-20 bg-slate-950/40 rounded-3xl border border-white/5 max-w-4xl mx-auto space-y-3">
            <Newspaper className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
            <p className="text-sm font-mono text-slate-400">Tidak ada pengumuman yang sesuai dengan kriteria penelusuran.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('Semua');
              }}
              className="p-1 px-3 bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 rounded-lg text-xs font-semibold hover:bg-brand-cyan/30 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Pencarian</span>
            </button>
          </div>
        )}

      </div>

      {/* Expanded Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setSelectedArticle(null)}
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
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-1.5 bg-slate-900 rounded-full border border-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono border font-semibold ${getCategoryTheme(selectedArticle.category)}`}>
                    {selectedArticle.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{selectedArticle.date}</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight">
                  {selectedArticle.title}
                </h3>

                {/* Sub Metadata rows */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 py-2 border-y border-white/5">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-brand-cyan" />
                    <span>Penulis: <strong className="text-white">{selectedArticle.author}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-purple" />
                    <span>{selectedArticle.readTime}</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="space-y-4 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed font-light py-2">
                  <p className="font-semibold text-slate-300 italic mb-4">
                    "{selectedArticle.summary}"
                  </p>
                  
                  {/* Clean paragraphs spacing simulation */}
                  {selectedArticle.content.split('. ').map((para, i) => (
                    <p key={i}>{para}.</p>
                  ))}
                </div>

                {/* Footer advice */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 flex items-start gap-3">
                  <div className="p-1.5 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan rounded-lg mt-0.5">
                    {getCategoryIcon(selectedArticle.category)}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      Aktivitas Pembelajaran Terjadwal
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Seluruh anggota aktif disarankan mengacu pada instruksi berita ini. Pertanyaan teknis dapat dikoordinasikan langsung ke laboratorium.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan text-xs font-semibold rounded-xl cursor-pointer transition-all border border-brand-cyan/30"
                >
                  Selesai Membaca
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
