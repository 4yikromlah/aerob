/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Cpu, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface FaqItem {
  question: string;
  answer: string;
}

export default function Faq() {
  const faqs: FaqItem[] = [
    {
      question: "Apakah harus memiliki dasar coding atau elektronika untuk mendaftar?",
      answer: "Sama sekali tidak! Kurikulum pelajaran dalam Ekstrakurikuler Robotika kami dirancang secara bertahap dari tingkat dasar. Kami melatih siswa mulai dari pengenalan sirkuit paling sederhana hingga logika pemrograman bahasa C++ otonom pada modul Arduino/ESP32, dipandu intensif oleh pembina & pelatih ahli."
    },
    {
      question: "Kapan jadwal pendaftaran dibuka untuk siswa baru?",
      answer: "Pendaftaran resmi dibuka setiap awal semester ganjil (Tahun Ajaran Baru), biasanya sekitar bulan Juni - Juli. Calon anggota dapat melakukan pendaftaran secara daring melalui portal di website kami dengan mengisi biodata serta divisi minat utama."
    },
    {
      question: "Apakah dikenakan biaya tambahan seperti pembelian kit komparator atau motor?",
      answer: "Tidak ada biaya! Seluruh komponen laboratorium—termasuk Microcontroller ESP32, STM32, Sensor Ultrasonic, Infrared Cam, Motor Servo, Driver Motor, Baterai LiPo, Filament Printer 3D, hingga Laptop Spesifikasi Tinggi—telah difasilitasi oleh sekolah secara gratis untuk mendukung kreativitas belajar siswa."
    },
    {
      question: "Divisi minat atau konsentrasi apa saja yang dapat dipilih anggota?",
      answer: "Kami mengelompokkan kegiatan ke dalam 4 bidang utama: \n1) Divisi Mobile Robotics (Robot Line Follower & Sumo),\n2) Divisi Internet of Things (Sistem IoT Sawah, Otomasi Pintu & Dashboard),\n3) Divisi Drone (Rakit Quadcopter & Navigasi GPS Otonom),\n4) Divisi AI & Computer Vision (Klasifikasi Objek, OpenCV & Model TensorFlow)."
    },
    {
      question: "Apakah anggota akan berkesempatan mengikuti sertifikasi kompetensi & kompetisi?",
      answer: "Ya! Setiap anggota yang lulus modul dasar (6 bulan) akan berhak mengikuti Ujian Kompetensi Sertifikasi Robotika yang beraliansi dengan lembaga sertifikasi nasional. Selain itu, kami menyaring siswa aktif berkinerja tinggi untuk didanai penuh mengikuti kompetisi regional, nasional (seperti IRC/NRO), hingga kancah internasional."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 relative overflow-hidden bg-gradient-to-b from-[#070a13] to-[#0B0F19]">
      {/* Decorative vector background */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal variant="fadeUp" delay={100}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Tanya & Jawab (FAQ)
            </h2>
            <div className="w-16 h-1.5 bg-brand-cyan rounded-full mx-auto mt-4 mb-4" />
            <p className="text-sm font-sans text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Punya hal yang masih membingungkan Anda? Silakan baca beberapa rangkuman pertanyaan yang paling sering diajukan oleh calon siswa maupun orang tua murid.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;

            return (
              <ScrollReveal key={idx} variant="fadeUp" delay={100 + idx * 50}>
                <div 
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'bg-slate-900 border-brand-cyan/40 shadow-lg shadow-brand-cyan/5' 
                      : 'bg-slate-950/60 border-white/5 hover:border-white/10'
                  }`}
                  id={`faq-item-${idx}`}
                >
                  {/* Trigger Header */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer outline-none select-none"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-brand-cyan' : 'text-slate-500'}`} />
                      <span className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className={`p-1.5 rounded-lg border shrink-0 ${isOpen ? 'bg-brand-cyan/15 border-brand-cyan/40 text-brand-cyan' : 'bg-slate-900 border-white/5 text-slate-400'}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  {/* Body Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 pl-14 pr-8 border-t border-white/5 pt-1">
                          <p className="text-xs text-slate-400 font-sans leading-relaxed font-light whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Small footnote */}
        <ScrollReveal variant="zoomIn" delay={300}>
          <div className="mt-12 p-5 bg-brand-cyan/5 border border-brand-cyan/15 rounded-2xl flex items-center justify-between gap-4 max-w-2xl mx-auto flex-col sm:flex-row text-center sm:text-left">
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
              <Cpu className="w-5 h-5 text-brand-cyan shrink-0 animate-spin-slow" />
              <p className="text-[10px] font-mono text-slate-400">
                Punya pertanyaan kustom yang tidak ada dalam daftar FAQ?
              </p>
            </div>
            <a 
              href="#kontak"
              className="p-2 px-4 bg-brand-cyan text-slate-950 text-[10px] font-bold font-mono tracking-wide rounded-xl shadow-md hover:bg-brand-sky outline-none cursor-pointer transition-all shrink-0 uppercase active:scale-95"
            >
              Hubungi Siska
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
