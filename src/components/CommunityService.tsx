/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import { PUBLIC_SERVICES } from '../data/roboticsData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Settings, 
  Presentation, 
  Wrench, 
  HelpCircle, 
  Hammer, 
  Send, 
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface CommunityServiceProps {
  publicServices?: {
    id: string;
    title: string;
    description: string;
    badge: string;
    duration: string;
  }[];
}

export default function CommunityService({ publicServices }: CommunityServiceProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [serviceType, setServiceType] = useState('Pelatihan Robotika SD/SMP');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Retrieve past inquiries from localStorage or empty array
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const currentPublicServices = publicServices || PUBLIC_SERVICES;

  useEffect(() => {
    const saved = localStorage.getItem('robotika_services_inquiries');
    if (saved) {
      try {
        setInquiries(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const getServiceIcon = (title: string) => {
    const props = { className: "w-8 h-8 text-brand-cyan" };
    switch (title) {
      case 'Pelatihan Robotika SD/SMP':
        return <GraduationCap {...props} />;
      case 'Workshop Arduino':
        return <Settings {...props} />;
      case 'Seminar Teknologi':
        return <Presentation {...props} />;
      case 'Pembuatan Prototype':
        return <Hammer {...props} />;
      case 'Konsultasi Robotika & Riset':
        return <HelpCircle {...props} />;
      default:
        return <Wrench {...props} />;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name || !email || !message) {
      setErrorMessage('Mohon lengkapi semua field bertanda bintang (*)');
      return;
    }

    setLoading(true);
    
    // Simulate API network lateness
    setTimeout(() => {
      const newInquiry = {
        id: 'inq_' + Date.now(),
        name,
        email,
        org: org || 'Personal/Pribadi',
        serviceType,
        message,
        date: new Date().toLocaleDateString('id-ID'),
        status: 'Diproses'
      };

      const updated = [newInquiry, ...inquiries];
      setInquiries(updated);
      localStorage.setItem('robotika_services_inquiries', JSON.stringify(updated));

      setLoading(false);
      setSubmitted(true);
      setErrorMessage('');
      
      // Clear inputs
      setName('');
      setEmail('');
      setOrg('');
      setMessage('');
    }, 1200);
  };

  return (
    <section id="services" className="py-24 relative bg-slate-900 overflow-hidden">
      
      {/* Decorative circuitry backgrounds */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal variant="fadeUp">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-cyan">
              Pusat Pengabdian IPTEK Sekolah
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
              Pelayanan Masyarakat & Kemitraan
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="w-16 h-1.5 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full mx-auto mt-4" />
          </ScrollReveal>
        </div>

        {/* Services List Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {currentPublicServices.map((serv, index) => (
            <ScrollReveal
              key={serv.id}
              variant="zoomIn"
              delay={index * 0.08}
              className="group"
            >
              <div className="p-6 rounded-3xl glass-panel relative overflow-hidden h-full border-white/5 hover:border-brand-cyan/20 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* Floating larger icon */}
                  <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner transform group-hover:scale-105 group-hover:border-brand-cyan/30 transition-all">
                    {getServiceIcon(serv.title)}
                  </div>

                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan rounded-md text-[8.5px] font-mono font-bold uppercase">
                      {serv.badge}
                    </span>
                    <h3 className="text-base font-display font-bold text-white pt-1">
                      {serv.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {serv.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Skema:</span>
                  <span className="text-slate-300 font-medium">{serv.duration}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Dynamic CTA Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-8 border-t border-white/5">
          
          {/* Explanation Sidebar Left */}
          <div className="lg:col-span-5 flex">
            <ScrollReveal
              variant="slideRight"
              className="p-8 sm:p-10 rounded-3xl glass-panel relative overflow-hidden flex flex-col justify-between border-white/5 w-full bg-slate-950/40"
            >
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  Ajukan Kerja Sama & Konsultasi Teknis
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  Apakah sekolah, komunitas, atau instansi Anda membutuhkan agenda pelatihan robotika? Atau apakah Anda memerlukan bantuan prototip IoT pertanian/otomasi? Tim robotika kami siap menyukseskan kerja sama riset, program CSR, hingga reparasi instrumen sirkuit.
                </p>

                <div className="space-y-4 pt-4 border-t border-white/5 text-xs font-mono">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Waktu Respons: 1x24 Jam Kerja</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
                    <span>Lokasi: Laboratorium Elektronika Utama</span>
                  </div>
                </div>
              </div>

              {/* Inquiry list count if any exists to show dynamic response */}
              {inquiries.length > 0 && (
                <div className="mt-8 p-4 bg-brand-cyan/5 rounded-2xl border border-brand-cyan/20">
                  <p className="text-[10px] font-mono text-brand-cyan font-bold uppercase tracking-wider">
                    Permintaan Saya ({inquiries.length})
                  </p>
                  <div className="mt-2 space-y-2 max-h-[110px] overflow-y-auto pr-1">
                    {inquiries.slice(0, 2).map((inq) => (
                      <div key={inq.id} className="text-[11px] flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-white/5">
                        <span className="text-slate-300 font-semibold truncate max-w-[150px]">{inq.serviceType}</span>
                        <span className="p-0.5 px-1.5 bg-yellow-500/10 text-yellow-500 rounded font-mono text-[8px] uppercase">
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollReveal>
          </div>

          {/* Consultation Form Right */}
          <div className="lg:col-span-7 flex">
            <ScrollReveal variant="slideLeft" className="w-full flex">
              <div className="p-8 sm:p-10 rounded-3xl glass-panel relative flex flex-col justify-between border-white/10 w-full">
                
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleFormSubmit}
                      className="space-y-5"
                    >
                      <h4 className="text-sm font-mono font-bold text-brand-cyan uppercase tracking-widest border-l-2 border-brand-cyan pl-2 mb-2">
                        Formulir Permintaan Layanan
                      </h4>
                      
                      {errorMessage && (
                        <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono">
                          {errorMessage}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-slate-300 font-medium tracking-wide">
                            Nama Lengkap / Kontak *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Bpk. Kurniawan"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-cyan transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-slate-300 font-medium tracking-wide">
                            Email Kontak Aktif *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alamat@email.com"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-cyan transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-slate-300 font-medium tracking-wide">
                            Nama Instansi / Sekolah (Opsional)
                          </label>
                          <input
                            type="text"
                            value={org}
                            onChange={(e) => setOrg(e.target.value)}
                            placeholder="Contoh: SMP IT Cendekia"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-cyan transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-slate-300 font-medium tracking-wide">
                            Pilih Layanan Utama *
                          </label>
                          <select
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-cyan transition-all"
                          >
                            <option value="Pelatihan Robotika SD/SMP">Pelatihan Robotika SD/SMP</option>
                            <option value="Workshop Arduino">Workshop Arduino</option>
                            <option value="Seminar Teknologi">Seminar Teknologi</option>
                            <option value="Pembuatan Prototype">Pembuatan Prototype</option>
                            <option value="Konsultasi Robotika & Riset">Konsultasi Robotika & Riset</option>
                            <option value="Service Robot Edukasi">Service Robot Edukasi</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-300 font-medium tracking-wide">
                          Rincian Kebutuhan & Jadwal Rencana *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Jelaskan detail permohonan Anda (misalnya: pelatihan drone otonom untuk 20 murid sekolah dasar tanggal 10 Juli)..."
                          className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-cyan transition-all font-sans leading-normal"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Memproses Permohonan...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Kirim Pengajuan Layanan</span>
                            </>
                          )}
                        </button>
                      </div>

                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10 space-y-4 h-full flex flex-col justify-center items-center"
                    >
                      <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-display font-bold text-white">Pengajuan Berhasil Dikirim!</h4>
                      <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                        Terima kasih atas kepercayaan Anda. Pengajuan layanan untuk <strong>{serviceType}</strong> telah terekam aman. Admin divisi pengabdian akan mengirimi Anda email konfirmasi berisi jadwal pertemuan dalam kurun waktu 1x24 jam.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="p-2.5 px-5 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-300 hover:text-white hover:border-brand-cyan transition-all cursor-pointer"
                      >
                        Kirim Form Baru / Lihat Form
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
