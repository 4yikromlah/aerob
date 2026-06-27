/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Member, InventoryItem, Program, ActivityImage, NewsItem, ProductItem } from '../types';
import { INITIAL_MEMBERS, INITIAL_INVENTORY, PRODUCTS_DATA } from '../data/roboticsData';
import LearningHub, { Module, LearningVideo, Question, MODULES_DATA, VIDEOS_DATA, CBT_QUESTIONS, Exam, DEFAULT_EXAMS } from './LearningHub';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Key, 
  UserPlus, 
  LayoutDashboard, 
  Users, 
  Database, 
  Terminal, 
  Brain, 
  FileCode, 
  Play, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  Sliders, 
  CheckCircle,
  BookOpen,
  HelpCircle,
  Sparkles,
  Send,
  Boxes,
  MapPin,
  Cpu,
  BookmarkCheck,
  UserCheck,
  Edit,
  Upload,
  Image,
  AlertTriangle,
  Palette,
  Info
} from 'lucide-react';

const compressImage = (base64Str: string, maxWidth: number, maxHeight: number, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate the width and height, constraining the proportions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

interface ImageUploaderProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  className?: string;
}

function ImageUploader({ value, onChange, label = "Unggah Gambar", className = "" }: ImageUploaderProps) {
  const fileInputId = React.useId();
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Ukuran file gambar terlalu besar! Maksimal 5MB.");
        return;
      }
      setErrorMsg("");
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          try {
            const compressed = await compressImage(reader.result, 1000, 1000, 0.75);
            onChange(compressed);
          } catch (err) {
            onChange(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Ukuran file gambar terlalu besar! Maksimal 5MB.");
        return;
      }
      setErrorMsg("");
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          try {
            const compressed = await compressImage(reader.result, 1000, 1000, 0.75);
            onChange(compressed);
          } catch (err) {
            onChange(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono font-medium uppercase text-slate-400 block">{label}</label>
        {errorMsg && <span className="text-[9px] text-red-400 font-mono font-bold animate-pulse">{errorMsg}</span>}
      </div>
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border border-dashed rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all text-center min-h-[100px] bg-slate-900/60 ${dragActive ? 'border-brand-cyan bg-brand-cyan/5' : 'border-white/10 hover:border-white/20'}`}
      >
        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {value ? (
          <div className="w-full flex items-center gap-3">
            <img 
              src={value} 
              alt="Preview" 
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-cover rounded-lg border border-white/10 bg-slate-950 flex-shrink-0"
            />
            <div className="flex-1 text-left min-w-0">
              <p className="text-[10px] text-slate-300 font-mono truncate">
                {value.startsWith('data:') ? 'Berhasil Diunggah (Base64)' : value}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <label 
                  htmlFor={fileInputId}
                  className="text-[9px] font-sans text-brand-cyan hover:underline cursor-pointer font-bold"
                >
                  Ganti Gambar
                </label>
                <span className="text-slate-600 text-[9px]">-</span>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="text-[9px] font-sans text-red-400 hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-5 h-5 text-slate-500" />
            <div className="text-[10px] text-slate-400">
              <label 
                htmlFor={fileInputId}
                className="text-brand-cyan hover:underline cursor-pointer font-semibold mr-1"
              >
                Klik untuk unggah
              </label>
              atau seret file ke sini
            </div>
            <p className="text-[8px] text-slate-500">Mendukung file PNG, JPG, WEBP (Maks 5MB)</p>
          </>
        )}
      </div>
    </div>
  );
}

interface DashboardProps {
  onLoginSuccess: (user: { name: string; role: string; memberType?: 'Pemula' | 'Junior' | 'Senior' }) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onClose: () => void;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
  gallery: ActivityImage[];
  setGallery: React.Dispatch<React.SetStateAction<ActivityImage[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  products: ProductItem[];
  setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  userData?: { name: string; role: string; memberType?: 'Pemula' | 'Junior' | 'Senior' } | null;
  summary: any;
  setSummary: (val: any) => void;
  achievements: any[];
  setAchievements: (val: any[]) => void;
  visiMisi: any;
  setVisiMisi: (val: any) => void;
  publicServices: any[];
  setPublicServices: (val: any[]) => void;
  generalInfo: string;
  setGeneralInfo: (val: string) => void;
  onAddToast?: (text: string, type: 'success' | 'error' | 'info') => void;
}

export default function Dashboard({ 
  onLoginSuccess, 
  isLoggedIn, 
  onLogout, 
  onClose,
  members,
  setMembers,
  inventory,
  setInventory,
  programs,
  setPrograms,
  gallery,
  setGallery,
  news,
  setNews,
  products,
  setProducts,
  userData,
  summary,
  setSummary,
  achievements,
  setAchievements,
  visiMisi,
  setVisiMisi,
  publicServices,
  setPublicServices,
  generalInfo,
  setGeneralInfo,
  onAddToast
}: DashboardProps) {
  const isPrivileged = userData?.role === 'Pembina' || userData?.role === 'Admin' || userData?.role === 'Super Admin';
  // --- Confirmation Popup State ---
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batalkan',
    type: 'danger'
  });

  const confirmAction = ({
    title,
    message,
    onConfirm,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batalkan',
    type = 'danger'
  }: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info' | 'success';
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
      confirmText,
      cancelText,
      type
    });
  };
  // --- Portal state ---
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- Registration state ---
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regClass, setRegClass] = useState('X RPL 1');
  const [regInterest, setRegInterest] = useState('Arduino');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMemberType, setRegMemberType] = useState<'Pemula' | 'Junior' | 'Senior'>('Pemula');

  // --- Active Tab inside Dashboard ---
  const [activeTab, setActiveTab ] = useState<'overview' | 'members' | 'inventory' | 'programs' | 'gallery' | 'news' | 'products' | 'simulator' | 'chat' | 'editor' | 'learning'>('overview');

  const [searchQuery, setSearchQuery] = useState('');

  // --- Local States for Content Editor ---
  const [subEditor, setSubEditor] = useState<'summary' | 'visimisi' | 'information' | 'services' | 'instructors' | 'achievements' | 'learning' | 'theme'>('summary');
  const [saveFeedback, setSaveFeedback] = useState('');

  // --- Theme/Design Editor States ---
  const [bgChoice, setBgChoice] = useState(() => {
    const saved = localStorage.getItem('robotika_custom_background') || 'default-robot';
    if (['default-robot', 'blue-grid', 'none'].includes(saved)) {
      return saved;
    }
    return saved ? 'custom' : 'default-robot';
  });
  const [customBgUrl, setCustomBgUrl] = useState(() => {
    const saved = localStorage.getItem('robotika_custom_background') || '';
    if (['default-robot', 'blue-grid', 'none'].includes(saved)) {
      return '';
    }
    return saved;
  });
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('robotika_custom_primary_color') || '#06B6D4';
  });
  const [secondaryColor, setSecondaryColor] = useState(() => {
    return localStorage.getItem('robotika_custom_secondary_color') || '#2563EB';
  });
  const [customLogoUrl, setCustomLogoUrl] = useState(() => {
    return localStorage.getItem('robotika_custom_logo') || '';
  });

  // --- Learning Editor States ---
  const [editModules, setEditModules] = useState<Module[]>([]);
  const [editVideos, setEditVideos] = useState<LearningVideo[]>([]);
  const [editQuestions, setEditQuestions] = useState<Question[]>([]);
  const [learningEditorTab, setLearningEditorTab] = useState<'modules' | 'videos' | 'questions' | 'cbt_settings' | 'exams'>('modules');
  const [editCbtSettings, setEditCbtSettings] = useState<{ duration: number; passingGrade: number; examActive: boolean }>({
    duration: 10,
    passingGrade: 70,
    examActive: true
  });
  const [editExams, setEditExams] = useState<Exam[]>([]);
  const [selectedExamForEditing, setSelectedExamForEditing] = useState<Exam | null>(null);

  // Load initial learning data on startup
  useEffect(() => {
    try {
      const savedModules = localStorage.getItem('robo_learning_modules');
      setEditModules(savedModules ? JSON.parse(savedModules) : MODULES_DATA);
      
      const savedVideos = localStorage.getItem('robo_learning_videos');
      setEditVideos(savedVideos ? JSON.parse(savedVideos) : VIDEOS_DATA);
      
      const savedQuestions = localStorage.getItem('robo_learning_questions');
      setEditQuestions(savedQuestions ? JSON.parse(savedQuestions) : CBT_QUESTIONS);

      const savedCbt = localStorage.getItem('robo_cbt_settings');
      setEditCbtSettings(savedCbt ? JSON.parse(savedCbt) : { duration: 10, passingGrade: 70, examActive: true });

      const savedExams = localStorage.getItem('robo_cbt_exams');
      const loadedExams = savedExams ? JSON.parse(savedExams) : DEFAULT_EXAMS;
      setEditExams(loadedExams);
      setSelectedExamForEditing(loadedExams[0] || null);
    } catch (err) {
      console.error("Error loading learning data inside Dashboard:", err);
    }
  }, []);

  const handleSaveModules = (updatedModules: Module[]) => {
    setEditModules(updatedModules);
    localStorage.setItem('robo_learning_modules', JSON.stringify(updatedModules));
    window.dispatchEvent(new Event('robo_learning_updated'));
    triggerFeedback('Modul Pembelajaran berhasil disimpan!');
  };

  const handleSaveVideos = (updatedVideos: LearningVideo[]) => {
    setEditVideos(updatedVideos);
    localStorage.setItem('robo_learning_videos', JSON.stringify(updatedVideos));
    window.dispatchEvent(new Event('robo_learning_updated'));
    triggerFeedback('Video Media Pembelajaran berhasil disimpan!');
  };

  const handleSaveQuestions = (updatedQuestions: Question[]) => {
    setEditQuestions(updatedQuestions);
    localStorage.setItem('robo_learning_questions', JSON.stringify(updatedQuestions));
    window.dispatchEvent(new Event('robo_learning_updated'));
    triggerFeedback('Soal Evaluasi CBT berhasil disimpan!');
  };

  const handleSaveCbtSettings = (updatedCbt: { duration: number; passingGrade: number; examActive: boolean }) => {
    setEditCbtSettings(updatedCbt);
    localStorage.setItem('robo_cbt_settings', JSON.stringify(updatedCbt));
    window.dispatchEvent(new Event('robo_cbt_settings_updated'));
    triggerFeedback('Pengaturan CBT berhasil disimpan!');
  };

  const handleSaveExams = (updatedExams: Exam[]) => {
    setEditExams(updatedExams);
    localStorage.setItem('robo_cbt_exams', JSON.stringify(updatedExams));
    window.dispatchEvent(new Event('robo_cbt_exams_updated'));
    triggerFeedback('Daftar Ujian CBT berhasil disimpan!');
  };

  const handleUpdateQuestionsForSelectedExam = (updatedQuestions: Question[]) => {
    if (!selectedExamForEditing) return;
    const updatedExam = { ...selectedExamForEditing, questions: updatedQuestions };
    setSelectedExamForEditing(updatedExam);
    setEditQuestions(updatedQuestions);

    const updatedExamsList = editExams.map(ex => ex.id === updatedExam.id ? updatedExam : ex);
    handleSaveExams(updatedExamsList);
  };

  const [editSummaryName, setEditSummaryName] = useState('');
  const [editSummarySchool, setEditSummarySchool] = useState('');
  const [editSummaryFounded, setEditSummaryFounded] = useState(2016);
  const [editSummaryPhilosophy, setEditSummaryPhilosophy] = useState('');
  const [editSummaryWhatsapp, setEditSummaryWhatsapp] = useState('628123456789');
  const [editSummaryDesc, setEditSummaryDesc] = useState('');
  const [editSummaryHistory, setEditSummaryHistory] = useState('');

  const [editInstructors, setEditInstructors] = useState<{ id: string; name: string; role: string; specialty: string; imageUrl: string; bio: string }[]>([]);
  const [editAchievements, setEditAchievements] = useState<{ id: string; title: string; year: string; rank: string; level: 'Nasional' | 'Internasional' | 'Regional'; description: string }[]>([]);

  const [editVisi, setEditVisi] = useState('');
  const [editMissions, setEditMissions] = useState<{ id: number; title: string; desc: string; icon?: string }[]>([]);

  const [editGeneralInfo, setEditGeneralInfo] = useState('');

  const [editServices, setEditServices] = useState<{ id: string; title: string; description: string; badge: string; duration: string }[]>([]);

  // Synchronize with incoming parent state props on load
  useEffect(() => {
    if (summary) {
      setEditSummaryName(summary.name || '');
      setEditSummarySchool(summary.school || '');
      setEditSummaryFounded(summary.foundedYear || 2016);
      setEditSummaryPhilosophy(summary.philosophy || '');
      setEditSummaryWhatsapp(summary.whatsapp || '628123456789');
      setEditSummaryDesc(summary.description || '');
      setEditSummaryHistory(summary.history || '');
      setEditInstructors(summary.instructors || [
        {
          id: "i1",
          name: "Ir. Hermawan Prasetyo, M.T.",
          role: "Pembina Utama & Kurikulum",
          specialty: "Sistem Terbenam & Elektronika Daya",
          imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300",
          bio: "Lebih dari 15 tahun berkecimpung di bidang teknik kontrol komputer dan otomasi industri. Rutin mementor tim robotika dalam berbagai ajang kompetisi nasional."
        },
        {
          id: "i2",
          name: "Siti Rahmawati, S.Kom., M.Cs.",
          role: "Instruktur Pemrograman & AI",
          specialty: "Computer Vision & IoT",
          imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
          bio: "Lulusan S2 Ilmu Komputer dengan fokus pada Machine Learning. Bertanggung jawab atas materi kecerdasan buatan, visual data, dan sistem automasi awan."
        }
      ]);
    }
  }, [summary]);

  useEffect(() => {
    if (achievements) {
      setEditAchievements(achievements);
    }
  }, [achievements]);

  useEffect(() => {
    if (visiMisi) {
      setEditVisi(visiMisi.vision || '');
      setEditMissions(visiMisi.missions || []);
    }
  }, [visiMisi]);

  useEffect(() => {
    if (generalInfo !== undefined) {
      setEditGeneralInfo(generalInfo);
    }
  }, [generalInfo]);

  useEffect(() => {
    if (publicServices) {
      setEditServices(publicServices);
    }
  }, [publicServices]);

  useEffect(() => {
    if (selectedExamForEditing) {
      setEditQuestions(selectedExamForEditing.questions || []);
    }
  }, [selectedExamForEditing]);

  useEffect(() => {
    if (userData) {
      if (userData.role === 'Admin' && activeTab === 'learning') {
        setActiveTab('overview');
      } else if (userData.role !== 'Pembina' && userData.role !== 'Admin' && userData.role !== 'Super Admin') {
        if (['overview', 'members', 'inventory', 'editor'].includes(activeTab)) {
          setActiveTab('programs');
        }
      }
      if (userData.role === 'Admin' && subEditor === 'learning') {
        setSubEditor('summary');
      }
    }
  }, [userData, activeTab, subEditor]);

  const triggerFeedback = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSaveFeedback(msg);
    onAddToast?.(msg, type);
    setTimeout(() => {
      setSaveFeedback('');
    }, 4000);
  };

  const handleSaveSummary = () => {
    const updated = {
      name: editSummaryName,
      school: editSummarySchool,
      foundedYear: editSummaryFounded,
      philosophy: editSummaryPhilosophy,
      whatsapp: editSummaryWhatsapp,
      description: editSummaryDesc,
      history: editSummaryHistory,
      instructors: editInstructors
    };
    setSummary(updated);
    localStorage.setItem('robotika_db_summary', JSON.stringify(updated));
    triggerFeedback('Ringkasan Profil, WhatsApp, & Tim Pembina berhasil diperbarui di pangkalan data!');
  };

  const handleSaveVisiMisi = () => {
    const updated = {
      vision: editVisi,
      missions: editMissions
    };
    setVisiMisi(updated);
    localStorage.setItem('robotika_db_visimisi', JSON.stringify(updated));
    triggerFeedback('Visi & Misi berhasil diperbarui!');
  };

  const handleSaveGeneralInfo = () => {
    setGeneralInfo(editGeneralInfo);
    localStorage.setItem('robotika_db_general_info', JSON.stringify(editGeneralInfo));
    triggerFeedback('Headline Informasi berhasil diperbarui!');
  };

  const handleSaveServices = () => {
    setPublicServices(editServices);
    localStorage.setItem('robotika_db_services', JSON.stringify(editServices));
    triggerFeedback('Daftar Pelayanan berhasil diperbarui!');
  };

  const handleSaveInstructors = () => {
    const updated = {
      name: editSummaryName,
      school: editSummarySchool,
      foundedYear: editSummaryFounded,
      philosophy: editSummaryPhilosophy,
      whatsapp: editSummaryWhatsapp,
      description: editSummaryDesc,
      history: editSummaryHistory,
      instructors: editInstructors
    };
    setSummary(updated);
    localStorage.setItem('robotika_db_summary', JSON.stringify(updated));
    triggerFeedback('Daftar Tim Pembina & Mentor berhasil diperbarui!');
  };

  const handleSaveAchievements = () => {
    setAchievements(editAchievements);
    localStorage.setItem('robotika_db_achievements', JSON.stringify(editAchievements));
    triggerFeedback('Daftar Prestasi & Rekor Juara berhasil diperbarui!');
  };

  // List helpers
  const handleAddNewInstructor = () => {
    const nextId = 'i_' + Date.now();
    setEditInstructors(prev => [
      ...prev,
      {
        id: nextId,
        name: 'Nama Pembina Baru',
        role: 'Mentor / Pembina Divisi',
        specialty: 'Sistem Terbenam & Elektronika',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
        bio: 'Ringkasan singkat latar belakang pendidikan atau karir mentor robobotika pembina.'
      }
    ]);
  };

  const handleRemoveInstructor = (id: string) => {
    setEditInstructors(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateInstructorField = (id: string, field: string, val: string) => {
    setEditInstructors(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const handleAddNewAchievement = () => {
    const nextId = 'ac_' + Date.now();
    setEditAchievements(prev => [
      ...prev,
      {
        id: nextId,
        title: 'Prestasi Juara Baru',
        year: '2026',
        rank: 'Juara 1 / Best Innovation',
        level: 'Nasional',
        description: 'Uraian rincian keberhasilan kejuaraan yang diraih divisi riset teknologi robot pintar.'
      }
    ]);
  };

  const handleRemoveAchievement = (id: string) => {
    setEditAchievements(prev => prev.filter(a => a.id !== id));
  };

  const handleUpdateAchievementField = (id: string, field: string, val: string) => {
    setEditAchievements(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));
  };

  const handleAddNewMission = () => {
    const nextId = editMissions.length > 0 ? Math.max(...editMissions.map(m => m.id)) + 1 : 1;
    setEditMissions(prev => [
      ...prev,
      { id: nextId, title: 'Modul Misi Baru', desc: 'Detail target atau aktivitas pembelajaran otonom baru.', icon: 'CheckCircle2' }
    ]);
  };

  const handleRemoveMission = (id: number) => {
    setEditMissions(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateMissionField = (id: number, field: string, val: string) => {
    setEditMissions(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const handleAddNewService = () => {
    const nextId = 'ps_' + Date.now();
    setEditServices(prev => [
      ...prev,
      { id: nextId, title: 'Pelayanan Baru', description: 'Pelayanan pengabdian masyarakat atau kolaborasi sekolah baru.', badge: 'Riset Baru', duration: 'Kesepakatan bersama' }
    ]);
  };

  const handleRemoveService = (id: string) => {
    setEditServices(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateServiceField = (id: string, field: string, val: string) => {
    setEditServices(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  // --- Simulator Workspace States ---
  const [selectedExample, setSelectedExample] = useState('Blink LED');
  const [ideCode, setIdeCode] = useState(`// Program Blink LED 13
void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("LED Pin 13 ON");
  delay(1000);
  digitalWrite(13, LOW);
  Serial.println("LED Pin 13 OFF");
  delay(1000);
}`);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationSuccess, setCompilationSuccess] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [simSerialOutputs, setSimSerialOutputs] = useState<string[]>([]);
  const [simAngle, setSimAngle] = useState(90);

  // --- AI Chat assistant states ---
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    { sender: 'ai', text: 'Halo! Saya Robotika AI Copilot. Tanyakan apa saja seputar Arduino, ESP32, sensor ultrasonik, atau algoritma PID!', time: '18:10' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Update simulator code based on examples
  useEffect(() => {
    if (selectedExample === 'Blink LED') {
      setIdeCode(`// Program Blink LED 13
void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("LED Pin 13 ON");
  delay(1000);
  digitalWrite(13, LOW);
  Serial.println("LED Pin 13 OFF");
  delay(1000);
}`);
    } else if (selectedExample === 'Servo Sweep') {
      setIdeCode(`// Program Servo Motor Sweep
#include <Servo.h>
Servo myservo;

void setup() {
  myservo.attach(9);
  Serial.begin(115200);
}

void loop() {
  Serial.println("Servo menyapu 0 ke 180...");
  myservo.write(180);
  delay(1500);
  myservo.write(0);
  delay(1500);
}`);
    } else {
      setIdeCode(`// Program Intelligent Line Follower
int sensorPins[4] = {A0, A1, A2, A3};
int motorLeft = 5;
int motorRight = 6;

void setup() {
  Serial.begin(115200);
  pinMode(motorLeft, OUTPUT);
  pinMode(motorRight, OUTPUT);
  Serial.println("PID Line Follower Terkalibrasi.");
}

void loop() {
  int sensorValue = readSensors();
  int speedDifference = calculatePID(sensorValue);
  driveMotors(speedDifference);
}`);
    }
    // Stop any running simulation on code change
    setIsRunning(false);
    setCompilationSuccess(false);
    setSimSerialOutputs([]);
  }, [selectedExample]);

  // Simulation execution ticks (Simulate terminal outputs)
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSimSerialOutputs((prev) => {
        let nextLog = '';
        if (selectedExample === 'Blink LED') {
          nextLog = Math.random() > 0.5 ? 'LED Pin 13 ON (Tegangan: 5V)' : 'LED Pin 13 OFF (Tegangan: 0V)';
        } else if (selectedExample === 'Servo Sweep') {
          const angles = [10, 45, 90, 135, 180, 135, 90, 45];
          const currAngleIndex = Math.floor((Date.now() / 800) % angles.length);
          const ang = angles[currAngleIndex];
          setSimAngle(ang);
          nextLog = `Servo Angle: ${ang}° [PWM Pulse: ${(1000 + ang * 5.5).toFixed(0)}μs]`;
        } else {
          const status = ['PID Error: -1.2, Left: 180, Right: 184', 'Garis Terbaca pada Array Tengah', 'Melaju Lurus 2.1 m/s', 'PID Correction: +0.4, Left: 195, Right: 191'];
          nextLog = status[Math.floor(Math.random() * status.length)];
        }
        return [...prev.slice(-14), `[${new Date().toLocaleTimeString('id-ID')}] ${nextLog}`];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, selectedExample]);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const normUser = username.trim().toLowerCase();

    if (normUser === 'admin' && password === 'admin321') {
      onLoginSuccess({ name: 'Super Admin', role: 'Super Admin', memberType: 'Senior' });
    } else if (normUser === 'pembina' && password === 'pembina321') {
      onLoginSuccess({ name: 'Pak Hermawan (Pembina)', role: 'Pembina', memberType: 'Senior' });
    } else if (normUser === 'admin' && password === 'admin') {
      onLoginSuccess({ name: 'Administrator', role: 'Admin', memberType: 'Senior' });
    } else {
      // Find in existing members (including by username field)
      const found = members.find(m => 
        m.name.toLowerCase() === normUser || 
        m.email.toLowerCase() === normUser || 
        (m.username && m.username.toLowerCase() === normUser)
      );
      if (found) {
        if (found.role === 'Calon Anggota') {
          setErrorMsg(`Peringatan: Akun "${found.name}" belum disetujui. Sila hubungi Pembina (Pak Hermawan) untuk verifikasi.`);
        } else {
          onLoginSuccess({ name: found.name, role: found.role, memberType: found.memberType || 'Pemula' });
        }
      } else if (username.trim().length >= 3 && password.length >= 3) {
        // Fallback for general demo users
        onLoginSuccess({ name: username, role: 'Siswa Anggota', memberType: 'Pemula' });
      } else {
        setErrorMsg('Gagal: Username / Sandi salah atau kurang dari 3 karakter.');
      }
    }
  };

  // Handle Registration intake
  const handleRegisterIntake = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName || !regEmail || !regUsername || !regPassword) {
      setErrorMsg('Harap lengkapi semua field pendaftaran termasuk username dan password.');
      return;
    }

    const normRegName = regName.trim();
    const normUsername = regUsername.trim().toLowerCase();
    
    // Check if name, email, or username already exists
    const exists = members.find(m => 
      m.name.toLowerCase() === normRegName.toLowerCase() || 
      m.email.toLowerCase() === regEmail.trim().toLowerCase() ||
      (m.username && m.username.toLowerCase() === normUsername)
    );
    if (exists) {
      setErrorMsg('Nama, Email, atau Username sudah terdaftar di pangkalan data.');
      return;
    }

    const newCandidate: Member = {
      id: 'm_' + Date.now(),
      name: normRegName,
      class: regClass,
      role: 'Calon Anggota',
      email: regEmail.trim(),
      joinedDate: new Date().toISOString().split('T')[0],
      interests: [regInterest, 'Prototyping'],
      username: regUsername.trim(),
      password: regPassword,
      memberType: regMemberType
    };

    const updated = [...members, newCandidate];
    setMembers(updated);
    localStorage.setItem('robotika_db_members', JSON.stringify(updated));

    // Show beautiful success/pending message instead of autologin
    setSuccessMsg(`Pendaftaran Berhasil! Akun "${normRegName}" dengan username "${regUsername.trim()}" telah didaftarkan sebagai Calon Anggota dan sedang menunggu persetujuan (approval) dari Pembina.`);
    setIsRegisterMode(false);
    setRegName('');
    setRegEmail('');
    setRegUsername('');
    setRegPassword('');
  };

  // --- CRUD Support: Add/Edit Member ---
  const [newMemName, setNewMemName] = useState('');
  const [newMemClass, setNewMemClass] = useState('XI Elektronika 1');
  const [newMemRole, setNewMemRole] = useState<Member['role']>('Anggota');
  const [newMemInterest, setNewMemInterest] = useState('');
  const [newMemUsername, setNewMemUsername] = useState('');
  const [newMemPassword, setNewMemPassword] = useState('');
  const [newMemMemberType, setNewMemMemberType] = useState<'Pemula' | 'Junior' | 'Senior'>('Pemula');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const startEditMember = (m: Member) => {
    setEditingMemberId(m.id);
    setNewMemName(m.name);
    setNewMemClass(m.class);
    setNewMemRole(m.role as any);
    setNewMemInterest(m.interests.join(', '));
    setNewMemUsername(m.username || '');
    setNewMemPassword(m.password || '');
    setNewMemMemberType(m.memberType || 'Pemula');
  };

  const cancelEditMember = () => {
    setEditingMemberId(null);
    setNewMemName('');
    setNewMemClass('XI Elektronika 1');
    setNewMemRole('Anggota');
    setNewMemInterest('');
    setNewMemUsername('');
    setNewMemPassword('');
    setNewMemMemberType('Pemula');
  };  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName.trim()) return;

    const onSave = () => {
      if (editingMemberId) {
        const list = members.map((m) => {
          if (m.id === editingMemberId) {
            return {
              ...m,
              name: newMemName,
              class: newMemClass,
              role: newMemRole as any,
              interests: newMemInterest ? newMemInterest.split(',').map((s) => s.trim()) : ['Arduino'],
              username: newMemUsername.trim(),
              password: newMemPassword,
              memberType: newMemMemberType
            };
          }
          return m;
        });
        setMembers(list);
        localStorage.setItem('robotika_db_members', JSON.stringify(list));
        triggerFeedback(`Data Anggota "${newMemName}" berhasil diperbarui!`, 'success');
        cancelEditMember();
      } else {
        const newM: Member = {
          id: 'member_' + Date.now(),
          name: newMemName,
          class: newMemClass,
          role: newMemRole as any,
          email: `${newMemName.toLowerCase().replace(/\s+/g, '')}@student.sch.id`,
          joinedDate: new Date().toISOString().split('T')[0],
          interests: newMemInterest ? newMemInterest.split(',').map((s) => s.trim()) : ['Arduino'],
          username: newMemUsername.trim(),
          password: newMemPassword,
          memberType: newMemMemberType
        };
        const list = [...members, newM];
        setMembers(list);
        localStorage.setItem('robotika_db_members', JSON.stringify(list));
        triggerFeedback(`Anggota Baru "${newMemName}" berhasil ditambahkan!`, 'success');

        setNewMemName('');
        setNewMemInterest('');
        setNewMemUsername('');
        setNewMemPassword('');
        setNewMemMemberType('Pemula');
      }
    };

    confirmAction({
      title: editingMemberId ? 'Konfirmasi Pembaruan' : 'Konfirmasi Penambahan',
      message: editingMemberId 
        ? `Apakah Anda yakin ingin menyimpan perubahan data anggota "${newMemName}"?`
        : `Apakah Anda yakin ingin menambahkan anggota baru "${newMemName}"?`,
      onConfirm: onSave,
      confirmText: 'Ya, Simpan',
      type: 'success'
    });
  };

  // --- CRUD Support: Delete Member ---
  const handleDeleteMember = (id: string) => {
    const memberToDelete = members.find((m) => m.id === id);
    const memberName = memberToDelete ? memberToDelete.name : 'Anggota';
    
    confirmAction({
      title: 'Konfirmasi Hapus Anggota',
      message: `Apakah Anda yakin ingin menghapus "${memberName}" dari pangkalan data? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: () => {
        const filtered = members.filter((m) => m.id !== id);
        setMembers(filtered);
        localStorage.setItem('robotika_db_members', JSON.stringify(filtered));
        triggerFeedback(`Anggota "${memberName}" berhasil dihapus dari pangkalan data!`, 'info');
      },
      confirmText: 'Ya, Hapus',
      type: 'danger'
    });
  };

  // --- PERSATUAN/APPROVAL CANDIDATE HANDLERS ---
  const handleApproveCandidate = (id: string) => {
    const candidate = members.find((m) => m.id === id);
    const candidateName = candidate ? candidate.name : 'Calon Anggota';
    
    confirmAction({
      title: 'Konfirmasi Persetujuan',
      message: `Apakah Anda yakin ingin menyetujui calon anggota "${candidateName}" untuk bergabung ke dalam Organisasi Robotika?`,
      onConfirm: () => {
        const updated = members.map(m => {
          if (m.id === id) {
            return { ...m, role: 'Siswa Anggota' as any };
          }
          return m;
        });
        setMembers(updated);
        localStorage.setItem('robotika_db_members', JSON.stringify(updated));
        triggerFeedback(`Calon Anggota "${candidateName}" telah disetujui bergabung!`, 'success');
      },
      confirmText: 'Setujui',
      type: 'success'
    });
  };

  const handleRejectCandidate = (id: string) => {
    const candidate = members.find((m) => m.id === id);
    const candidateName = candidate ? candidate.name : 'Calon Anggota';
    
    confirmAction({
      title: 'Konfirmasi Penolakan',
      message: `Apakah Anda yakin ingin menolak pendaftaran calon anggota "${candidateName}"?`,
      onConfirm: () => {
        const updated = members.filter(m => m.id !== id);
        setMembers(updated);
        localStorage.setItem('robotika_db_members', JSON.stringify(updated));
        triggerFeedback(`Calon Anggota "${candidateName}" ditolak bergabung.`, 'info');
      },
      confirmText: 'Tolak',
      type: 'danger'
    });
  };

  // --- CRUD Support: Programs (Add/Edit) ---
  const [newProgTitle, setNewProgTitle] = useState('');
  const [newProgDiff, setNewProgDiff] = useState<'Pemula' | 'Menengah' | 'Mahir'>('Pemula');
  const [newProgDuration, setNewProgDuration] = useState('3 Bulan');
  const [newProgIcon, setNewProgIcon] = useState('Cpu');
  const [newProgDesc, setNewProgDesc] = useState('');
  const [newProgDetail, setNewProgDetail] = useState('');
  const [newProgImg, setNewProgImg] = useState('');
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);

  const startEditProgram = (p: Program) => {
    setEditingProgramId(p.id);
    setNewProgTitle(p.title);
    setNewProgDiff(p.difficulty);
    setNewProgDuration(p.duration);
    setNewProgIcon(p.iconName);
    setNewProgDesc(p.description);
    setNewProgDetail(p.detailedInfo || '');
    setNewProgImg(p.imageUrl || '');
  };

  const cancelEditProgram = () => {
    setEditingProgramId(null);
    setNewProgTitle('');
    setNewProgDiff('Pemula');
    setNewProgDuration('3 Bulan');
    setNewProgIcon('Cpu');
    setNewProgDesc('');
    setNewProgDetail('');
    setNewProgImg('');
  };

  const handleAddNewProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgTitle.trim()) return;

    const onSave = () => {
      if (editingProgramId) {
        const updated = programs.map((p) => {
          if (p.id === editingProgramId) {
            return {
              ...p,
              title: newProgTitle,
              iconName: newProgIcon,
              description: newProgDesc,
              detailedInfo: newProgDetail || newProgDesc,
              difficulty: newProgDiff,
              duration: newProgDuration,
              imageUrl: newProgImg || undefined
            };
          }
          return p;
        });
        setPrograms(updated);
        localStorage.setItem('robotika_db_programs', JSON.stringify(updated));
        triggerFeedback(`Kurikulum Program "${newProgTitle}" berhasil diperbarui!`, 'success');
        cancelEditProgram();
      } else {
        const newP: Program = {
          id: 'prog_' + Date.now(),
          title: newProgTitle,
          iconName: newProgIcon,
          description: newProgDesc,
          detailedInfo: newProgDetail || newProgDesc,
          difficulty: newProgDiff,
          duration: newProgDuration,
          imageUrl: newProgImg || undefined
        };
        const updated = [...programs, newP];
        setPrograms(updated);
        localStorage.setItem('robotika_db_programs', JSON.stringify(updated));
        triggerFeedback(`Kurikulum Baru "${newProgTitle}" berhasil didaftarkan!`, 'success');
        setNewProgTitle('');
        setNewProgDesc('');
        setNewProgDetail('');
        setNewProgImg('');
      }
    };

    confirmAction({
      title: editingProgramId ? 'Konfirmasi Pembaruan Kurikulum' : 'Konfirmasi Registrasi Kurikulum',
      message: editingProgramId
        ? `Apakah Anda yakin ingin menyimpan perubahan kurikulum "${newProgTitle}"?`
        : `Apakah Anda yakin ingin mendaftarkan kurikulum baru "${newProgTitle}"?`,
      onConfirm: onSave,
      confirmText: 'Ya, Simpan',
      type: 'success'
    });
  };

  const handleDeleteProgram = (id: string) => {
    const prog = programs.find((p) => p.id === id);
    const title = prog ? prog.title : 'Program';
    
    confirmAction({
      title: 'Konfirmasi Hapus Kurikulum',
      message: `Apakah Anda yakin ingin menghapus kurikulum "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: () => {
        const filtered = programs.filter(p => p.id !== id);
        setPrograms(filtered);
        localStorage.setItem('robotika_db_programs', JSON.stringify(filtered));
        triggerFeedback(`Kurikulum "${title}" berhasil dihapus!`, 'info');
      },
      confirmText: 'Ya, Hapus',
      type: 'danger'
    });
  };

  // --- CRUD Support: Gallery (Add/Edit) ---
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState<'Workshop' | 'Lomba' | 'Pelatihan' | 'Kunjungan Industri' | 'Seminar' | 'Praktikum'>('Workshop');
  const [newGalImg, setNewGalImg] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600');
  const [newGalDesc, setNewGalDesc] = useState('');
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  const startEditGallery = (g: ActivityImage) => {
    setEditingGalleryId(g.id);
    setNewGalTitle(g.title);
    setNewGalCategory(g.category);
    setNewGalImg(g.imageUrl);
    setNewGalDesc(g.description || '');
  };

  const cancelEditGallery = () => {
    setEditingGalleryId(null);
    setNewGalTitle('');
    setNewGalCategory('Workshop');
    setNewGalImg('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600');
    setNewGalDesc('');
  };

  const handleAddNewGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle.trim()) return;

    const onSave = () => {
      if (editingGalleryId) {
        const updated = gallery.map((g) => {
          if (g.id === editingGalleryId) {
            return {
              ...g,
              title: newGalTitle,
              category: newGalCategory,
              imageUrl: newGalImg,
              description: newGalDesc
            };
          }
          return g;
        });
        setGallery(updated);
        localStorage.setItem('robotika_db_gallery', JSON.stringify(updated));
        triggerFeedback(`Foto Kegiatan "${newGalTitle}" berhasil diperbarui!`, 'success');
        cancelEditGallery();
      } else {
        const newG: ActivityImage = {
          id: 'gal_' + Date.now(),
          title: newGalTitle,
          category: newGalCategory,
          imageUrl: newGalImg,
          description: newGalDesc,
          date: new Date().toISOString().split('T')[0]
        };
        const updated = [...gallery, newG];
        setGallery(updated);
        localStorage.setItem('robotika_db_gallery', JSON.stringify(updated));
        triggerFeedback(`Foto Kegiatan baru "${newGalTitle}" berhasil diunggah!`, 'success');
        setNewGalTitle('');
        setNewGalDesc('');
      }
    };

    confirmAction({
      title: editingGalleryId ? 'Konfirmasi Pembaruan Galeri' : 'Konfirmasi Unggah Galeri',
      message: editingGalleryId
        ? `Apakah Anda yakin ingin menyimpan perubahan foto kegiatan "${newGalTitle}"?`
        : `Apakah Anda yakin ingin mengunggah foto kegiatan baru "${newGalTitle}"?`,
      onConfirm: onSave,
      confirmText: 'Ya, Simpan',
      type: 'success'
    });
  };

  const handleDeleteGallery = (id: string) => {
    const item = gallery.find((g) => g.id === id);
    const title = item ? item.title : 'Foto Kegiatan';
    
    confirmAction({
      title: 'Konfirmasi Hapus Foto Kegiatan',
      message: `Apakah Anda yakin ingin menghapus foto "${title}" dari galeri? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: () => {
        const filtered = gallery.filter(g => g.id !== id);
        setGallery(filtered);
        localStorage.setItem('robotika_db_gallery', JSON.stringify(filtered));
        triggerFeedback(`Foto Kegiatan "${title}" berhasil dihapus!`, 'info');
      },
      confirmText: 'Ya, Hapus',
      type: 'danger'
    });
  };

  // --- CRUD Support: News (Add/Edit) ---
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'Pengumuman' | 'Jadwal Latihan' | 'Agenda' | 'Prestasi' | 'Event'>('Pengumuman');
  const [newNewsSummary, setNewNewsSummary] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newNewsAuthor, setNewNewsAuthor] = useState('Admin');
  const [newNewsImg, setNewNewsImg] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  const startEditNews = (n: NewsItem) => {
    setEditingNewsId(n.id);
    setNewNewsTitle(n.title);
    setNewNewsCategory(n.category);
    setNewNewsSummary(n.summary);
    setNewNewsContent(n.content);
    setNewNewsAuthor(n.author);
    setNewNewsImg(n.imageUrl);
  };

  const cancelEditNews = () => {
    setEditingNewsId(null);
    setNewNewsTitle('');
    setNewNewsCategory('Pengumuman');
    setNewNewsSummary('');
    setNewNewsContent('');
    setNewNewsAuthor('Admin');
    setNewNewsImg('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500');
  };

  const handleAddNewNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle.trim()) return;

    const onSave = () => {
      if (editingNewsId) {
        const updated = news.map((n) => {
          if (n.id === editingNewsId) {
            return {
              ...n,
              title: newNewsTitle,
              category: newNewsCategory,
              summary: newNewsSummary,
              content: newNewsContent,
              author: newNewsAuthor,
              imageUrl: newNewsImg
            };
          }
          return n;
        });
        setNews(updated);
        localStorage.setItem('robotika_db_news', JSON.stringify(updated));
        triggerFeedback(`Berita/Redaksi "${newNewsTitle}" berhasil diperbarui!`, 'success');
        cancelEditNews();
      } else {
        const newN: NewsItem = {
          id: 'news_' + Date.now(),
          title: newNewsTitle,
          category: newNewsCategory,
          summary: newNewsSummary,
          content: newNewsContent,
          author: newNewsAuthor,
          date: new Date().toISOString().split('T')[0],
          readTime: '3 Menit Baca',
          imageUrl: newNewsImg
        };
        const updated = [...news, newN];
        setNews(updated);
        localStorage.setItem('robotika_db_news', JSON.stringify(updated));
        triggerFeedback(`Berita/Redaksi baru "${newNewsTitle}" berhasil diterbitkan!`, 'success');
        setNewNewsTitle('');
        setNewNewsSummary('');
        setNewNewsContent('');
      }
    };

    confirmAction({
      title: editingNewsId ? 'Konfirmasi Pembaruan Berita' : 'Konfirmasi Publikasi Berita',
      message: editingNewsId
        ? `Apakah Anda yakin ingin menyimpan perubahan berita "${newNewsTitle}"?`
        : `Apakah Anda yakin ingin menerbitkan berita baru "${newNewsTitle}"?`,
      onConfirm: onSave,
      confirmText: 'Ya, Simpan',
      type: 'success'
    });
  };

  const handleDeleteNews = (id: string) => {
    const item = news.find((n) => n.id === id);
    const title = item ? item.title : 'Berita';
    
    confirmAction({
      title: 'Konfirmasi Hapus Berita/Pengumuman',
      message: `Apakah Anda yakin ingin menghapus berita "${title}" secara permanen?`,
      onConfirm: () => {
        const filtered = news.filter(n => n.id !== id);
        setNews(filtered);
        localStorage.setItem('robotika_db_news', JSON.stringify(filtered));
        triggerFeedback(`Berita/Pengumuman "${title}" berhasil dihapus!`, 'info');
      },
      confirmText: 'Ya, Hapus',
      type: 'danger'
    });
  };

  // --- CRUD Support: Products (Add/Edit) ---
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Mobile Robotics');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSpecs, setNewProdSpecs] = useState('');
  const [newProdTechs, setNewProdTechs] = useState('');
  const [newProdCreator, setNewProdCreator] = useState('');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400');
  const [newProdStatus, setNewProdStatus] = useState<'Prototype' | 'Ready' | 'Development'>('Prototype');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const startEditProduct = (p: ProductItem) => {
    setEditingProductId(p.id);
    setNewProdName(p.name);
    setNewProdCategory(p.category);
    setNewProdDesc(p.description);
    setNewProdSpecs(p.specs ? p.specs.join(', ') : '');
    setNewProdTechs(p.technologies ? p.technologies.join(', ') : '');
    setNewProdCreator(p.creator);
    setNewProdImg(p.imageUrl);
    setNewProdStatus(p.status);
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setNewProdName('');
    setNewProdCategory('Mobile Robotics');
    setNewProdDesc('');
    setNewProdSpecs('');
    setNewProdTechs('');
    setNewProdCreator('');
    setNewProdImg('https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400');
    setNewProdStatus('Prototype');
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const onSave = () => {
      if (editingProductId) {
        const updated = products.map((p) => {
          if (p.id === editingProductId) {
            return {
              ...p,
              name: newProdName,
              category: newProdCategory,
              description: newProdDesc,
              creator: newProdCreator || 'Tim Dev Robotika',
              status: newProdStatus,
              imageUrl: newProdImg,
              specs: newProdSpecs ? newProdSpecs.split(',').map(s => s.trim()) : [],
              technologies: newProdTechs ? newProdTechs.split(',').map(t => t.trim()) : []
            };
          }
          return p;
        });
        setProducts(updated);
        localStorage.setItem('robotika_db_products', JSON.stringify(updated));
        triggerFeedback(`Data Riset Sasis/Produk "${newProdName}" berhasil diperbarui!`, 'success');
        cancelEditProduct();
      } else {
        const newP: ProductItem = {
          id: 'p_' + Date.now(),
          name: newProdName,
          category: newProdCategory,
          description: newProdDesc,
          creator: newProdCreator || 'Tim Dev Robotika',
          year: new Date().getFullYear().toString(),
          status: newProdStatus,
          imageUrl: newProdImg,
          specs: newProdSpecs ? newProdSpecs.split(',').map(s => s.trim()) : [],
          technologies: newProdTechs ? newProdTechs.split(',').map(t => t.trim()) : []
        };
        const updated = [...products, newP];
        setProducts(updated);
        localStorage.setItem('robotika_db_products', JSON.stringify(updated));
        triggerFeedback(`Produk/Karya baru "${newProdName}" berhasil dirilis!`, 'success');
        setNewProdName('');
        setNewProdDesc('');
        setNewProdSpecs('');
        setNewProdTechs('');
        setNewProdCreator('');
      }
    };

    confirmAction({
      title: editingProductId ? 'Konfirmasi Pembaruan Produk' : 'Konfirmasi Rilis Produk',
      message: editingProductId
        ? `Apakah Anda yakin ingin menyimpan perubahan produk riset "${newProdName}"?`
        : `Apakah Anda yakin ingin merilis karya/produk riset baru "${newProdName}"?`,
      onConfirm: onSave,
      confirmText: 'Ya, Simpan',
      type: 'success'
    });
  };

  const handleDeleteProduct = (id: string) => {
    const item = products.find((p) => p.id === id);
    const name = item ? item.name : 'Produk';
    
    confirmAction({
      title: 'Konfirmasi Hapus Produk Riset',
      message: `Apakah Anda yakin ingin menghapus produk riset "${name}" dari katalog karya?`,
      onConfirm: () => {
        const filtered = products.filter(p => p.id !== id);
        setProducts(filtered);
        localStorage.setItem('robotika_db_products', JSON.stringify(filtered));
        triggerFeedback(`Katalog Karya "${name}" berhasil dihapus!`, 'info');
      },
      confirmText: 'Ya, Hapus',
      type: 'danger'
    });
  };

  // --- CRUD Support: Modify Inventory Stock ---
  const handleStockChange = (id: string, offset: number) => {
    const list = inventory.map((i) => {
      if (i.id === id) {
        const nextQ = Math.max(0, i.quantity + offset);
        return {
          ...i,
          quantity: nextQ,
          status: nextQ === 0 ? ('Habis' as const) : ('Tersedia' as const)
        };
      }
      return i;
    });
    setInventory(list);
    localStorage.setItem('robotika_db_inventory', JSON.stringify(list));
  };

  // --- CRUD Support: Inventory (Add/Edit/Delete) ---
  const [newInvName, setNewInvName] = useState('');
  const [newInvCategory, setNewInvCategory] = useState('Microcontroller');
  const [newInvQuantity, setNewInvQuantity] = useState<number>(10);
  const [newInvUnit, setNewInvUnit] = useState('Pcs');
  const [newInvStatus, setNewInvStatus] = useState<'Tersedia' | 'Dipakai' | 'Habis'>('Tersedia');
  const [newInvLocation, setNewInvLocation] = useState('Loker A-1');
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);

  const startEditInventory = (i: InventoryItem) => {
    setEditingInventoryId(i.id);
    setNewInvName(i.name);
    setNewInvCategory(i.category);
    setNewInvQuantity(i.quantity);
    setNewInvUnit(i.unit);
    setNewInvStatus(i.status);
    setNewInvLocation(i.location);
  };

  const cancelEditInventory = () => {
    setEditingInventoryId(null);
    setNewInvName('');
    setNewInvCategory('Microcontroller');
    setNewInvQuantity(10);
    setNewInvUnit('Pcs');
    setNewInvStatus('Tersedia');
    setNewInvLocation('Loker A-1');
  };

  const handleAddNewInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvName.trim()) return;

    const onSave = () => {
      if (editingInventoryId) {
        const updated = inventory.map((i) => {
          if (i.id === editingInventoryId) {
            return {
              ...i,
              name: newInvName,
              category: newInvCategory,
              quantity: newInvQuantity,
              unit: newInvUnit,
              status: newInvQuantity === 0 ? ('Habis' as const) : newInvStatus,
              location: newInvLocation
            };
          }
          return i;
        });
        setInventory(updated);
        localStorage.setItem('robotika_db_inventory', JSON.stringify(updated));
        triggerFeedback(`Komponen "${newInvName}" berhasil diperbarui!`, 'success');
        cancelEditInventory();
      } else {
        const newI: InventoryItem = {
          id: 'inv_' + Date.now(),
          name: newInvName,
          category: newInvCategory,
          quantity: newInvQuantity,
          unit: newInvUnit,
          status: newInvQuantity === 0 ? 'Habis' : newInvStatus,
          location: newInvLocation
        };
        const updated = [...inventory, newI];
        setInventory(updated);
        localStorage.setItem('robotika_db_inventory', JSON.stringify(updated));
        triggerFeedback(`Komponen baru "${newInvName}" berhasil didaftarkan!`, 'success');
        cancelEditInventory();
      }
    };

    confirmAction({
      title: editingInventoryId ? 'Konfirmasi Pembaruan Komponen' : 'Konfirmasi Registrasi Komponen',
      message: editingInventoryId
        ? `Apakah Anda yakin ingin menyimpan perubahan data komponen "${newInvName}"?`
        : `Apakah Anda yakin ingin mendaftarkan komponen baru "${newInvName}" ke inventaris?`,
      onConfirm: onSave,
      confirmText: 'Ya, Simpan',
      type: 'success'
    });
  };

  const handleDeleteInventory = (id: string) => {
    const item = inventory.find((i) => i.id === id);
    const name = item ? item.name : 'Komponen';
    
    confirmAction({
      title: 'Konfirmasi Hapus Komponen',
      message: `Apakah Anda yakin ingin menghapus komponen "${name}" dari inventaris?`,
      onConfirm: () => {
        const filtered = inventory.filter((i) => i.id !== id);
        setInventory(filtered);
        localStorage.setItem('robotika_db_inventory', JSON.stringify(filtered));
        triggerFeedback(`Komponen "${name}" berhasil dihapus dari inventaris!`, 'info');
      },
      confirmText: 'Ya, Hapus',
      type: 'danger'
    });
  };

  // --- IDE Compilation simulation ---
  const handleCompileCode = () => {
    setIsCompiling(true);
    setCompilationSuccess(false);
    setIsRunning(false);
    setSimSerialOutputs(['[Compiler] Mengontak server riset gcc-arm...', '[Compiler] Mengecek include files...']);

    setTimeout(() => {
      setSimSerialOutputs((prev) => [...prev, '[Compiler] Validating memory blocks...', '[Compiler] Linting syntax...']);
    }, 600);

    setTimeout(() => {
      setIsCompiling(false);
      setCompilationSuccess(true);
      setSimSerialOutputs((prev) => [
        ...prev,
        '>> Compilation SUCCESSFUL.',
        '>> Flash memory used: 12.4 KB (3.8% of ESP32 DevKit)',
        '>> SRAM variable allocations: 1.1 KB',
        '>> Menunggu perintah RUN...'
      ]);
    }, 1500);
  };

  // --- simulated IDE execution ---
  const handleRunSimulation = () => {
    if (!compilationSuccess) return;
    setIsRunning(true);
    setSimSerialOutputs((prev) => [...prev, '>> Memulai siklus Loop()...']);
  };

  // --- AI Chat local responder ---
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user' as const, text: chatInput, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);
    const prompt = chatInput.toLowerCase();
    setChatInput('');

    // Generate educational simulated robotics answers
    setTimeout(() => {
      let aiText = `Pertanyaan yang bagus! Mengenai hal itu, di laboratorium kita biasanya merancang jalur sirkuit dengan ESP32 atau Uno, disolder presisi, dan diberi sensor analog. Ada modul yang bisa dibaca di Tab Silabus lho!`;
      
      if (prompt.includes('arduino') || prompt.includes('materi')) {
        aiText = `Arduino adalah board mikrokontroler berbasis chip AVR. Di tim robotika, program ditulis menggunakan C++ di mana ada struktur 'setup()' untuk konfigurasi inisial pin, dan 'loop()' untuk eksekusi logika konstan berulang.`;
      } else if (prompt.includes('pid') || prompt.includes('line follower')) {
        aiText = `Algoritma PID (Proportional Integral Derivative) adalah kontrol loop tertutup agar robot melaju stabil. Proportional mengatur koreksi sesuai jarak error, Integral menumpuk error berkala untuk melecut tenaga sasis, dan Derivative meredam overshoot goyangan sensor.`;
      } else if (prompt.includes('esp32') || prompt.includes('iot')) {
        aiText = `ESP32 sangat handal karena memiliki Wi-Fi dan Bluetooth bawaan di dalam satu chip SoC. Sangat pas dipakai untuk divisi IoT mengunggah rekap data lingkungan ke Database Realtime/Cloud Firebase.`;
      } else if (prompt.includes('pin') || prompt.includes('sensor')) {
        aiText = `Gunakan fungsi 'analogRead(pin)' untuk membaca sensor resistif seperti LDR atau sensor gas, dan 'digitalRead(pin)' untuk sensor digital biner seperti Infrared Line Detector.`;
      }

      setChatMessages((prev) => [...prev, {
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 950);
  };

  // --- Search Filter inside tables ---
  const filteredMembersList = members.filter((m) => {
    if (userData?.role === 'Admin' && m.role === 'Pembina') {
      return false;
    }
    return (
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredInventoryList = inventory.filter((i) => {
    return (
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoggedIn && !(userData?.role === 'Pembina' || userData?.role === 'Admin' || userData?.role === 'Super Admin')) {
    return null;
  }

  return (
    <section id="portal" className="min-h-screen py-24 relative bg-transparent flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-8">
        
        <AnimatePresence mode="wait">
          
          {/* --- VIEW 1: NOT LOGGED IN / AUTH PORTAL CARD --- */}
          {!isLoggedIn ? (
            <motion.div
              key="auth-card"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl glass-panel border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Circuit background path */}
              <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-brand-cyan/15 rounded-tr-3xl" />
              
              <div className="space-y-6 relative z-10">
                {/* Logo and Greeting */}
                <div className="text-center space-y-1">
                  <div className="inline-flex p-3 bg-brand-cyan/10 rounded-2xl border border-brand-cyan/20 text-brand-cyan mb-2">
                    <Cpu className="w-8 h-8 animate-spin-slow" />
                  </div>
                  <h2 className="text-2xl font-display font-extrabold text-white">
                    {isRegisterMode ? 'Daftar Calon Anggota' : 'Portal Manajemen'}
                  </h2>
                  <p className="text-xs text-slate-400 font-light">
                    {isRegisterMode 
                      ? 'Isi formulir pendaftaran siswa baru secara instan.' 
                      : 'Lakukan autentikasi data keanggotaan aktif Anda.'}
                  </p>
                </div>

                {/* Error/Success Banners */}
                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-brand-teal/10 border border-brand-teal/20 text-brand-cyan text-xs rounded-xl font-sans flex items-start gap-2 leading-relaxed">
                    <Sparkles className="w-4 h-4 text-brand-teal shrink-0 mt-0.5 animate-pulse" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* --- LOGIN FORM --- */}
                {!isRegisterMode ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-medium uppercase text-slate-400">Username *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Masukkan username (e.g., admin)"
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-medium uppercase text-slate-400">Sandi Akses *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan password (e.g., admin)"
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me and helper */}
                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-white/10 bg-slate-950 text-brand-cyan focus:ring-brand-cyan"
                        />
                        <span>Ingat Akun</span>
                      </label>
                      <span className="text-brand-cyan/80">Kredensial: admin/admin321 (Super Admin) | admin/admin (Admin) | pembina/pembina321 (Pembina)</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold rounded-xl hover:shadow-cyan-glow transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Masuk ke Dashboard</span>
                    </button>
                  </form>
                ) : (
                  
                  // --- REGISTER FORM ---
                  <form onSubmit={handleRegisterIntake} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-medium uppercase text-slate-400">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-cyan transitions-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-medium uppercase text-slate-400">Email Sekolah *</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="nama@student.sch.id"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-cyan transitions-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-medium uppercase text-slate-400">Username *</label>
                        <input
                          type="text"
                          required
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          placeholder="e.g. budis"
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-cyan transitions-colors font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-medium uppercase text-slate-400">Sandi Akses *</label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Ketik sandi"
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-cyan transitions-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="space-y-1">
                        <label className="text-[10px] font-medium uppercase text-slate-400">Pilih Kelas *</label>
                        <select
                          value={regClass}
                          onChange={(e) => setRegClass(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="X RPL 1">X RPL 1</option>
                          <option value="XI TKJ 2">XI TKJ 2</option>
                          <option value="XII Elektronika 1">XII Elektronika 1</option>
                          <option value="X Mekatronika">X Mekatronika</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium uppercase text-slate-400 font-mono">Fokus Robotika *</label>
                        <select
                          value={regInterest}
                          onChange={(e) => setRegInterest(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="Arduino Programming">Arduino</option>
                          <option value="Robot Soccer">Soccer Robot</option>
                          <option value="Internet of Things">IoT</option>
                          <option value="Computer Vision">AI Vision</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 font-mono">
                      <label className="text-[10px] font-medium uppercase text-slate-400">Jenis Tingkatan Anggota *</label>
                      <select
                        value={regMemberType}
                        onChange={(e) => setRegMemberType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="Pemula">Pemula (Anggota Baru / Dasar)</option>
                        <option value="Junior">Junior (Pemahaman Menengah / Robot Sederhana)</option>
                        <option value="Senior">Senior (Tingkat Lanjut / Riset & Lomba)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 cursor-pointer pt-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Kirim Daftarkan Account</span>
                    </button>
                  </form>
                )}

                {/* Account Switch links */}
                <div className="pt-4 border-t border-white/5 text-center">
                  <button
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-brand-cyan hover:text-brand-purple font-medium"
                  >
                    {isRegisterMode 
                      ? 'Sudah memiliki akun? Masuk di sini' 
                      : 'Calon anggota? Lakukan Pendaftaran Mandiri'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            
            // --- VIEW 2: AUTHENTICATED INTUITIVE FULL-SCALE INTERACTIVE SYSTEM PANEL ---
            <motion.div
              key="system-cabinet"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full rounded-3xl glass-panel border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Dashboard Internal Header block */}
              <div className="p-6 bg-slate-950 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-cyan/20 border border-brand-cyan/35 text-brand-cyan rounded-xl">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
                      {(userData?.role === 'Pembina' || userData?.role === 'Admin' || userData?.role === 'Super Admin') ? 'Sistem Informasi Internal' : 'Portal Kolaborasi Anggota'} 
                      <span className="p-0.5 px-2 bg-brand-cyan/10 border border-brand-cyan/20 rounded text-[9px] font-mono text-brand-cyan uppercase animate-pulse">
                        ROBO-CORE
                      </span>
                    </h1>
                    <p className="text-xs text-slate-400 font-light mt-0.5">
                      {(userData?.role === 'Pembina' || userData?.role === 'Admin' || userData?.role === 'Super Admin') 
                        ? 'Pangkalan data sasis, inventaris, dan simulasi motor terdistribusi.'
                        : 'Pusat kolaborasi, program kegiatan, modul pembelajaran, dan simulasi robotika.'}
                    </p>
                  </div>
                </div>                 {/* Dashboard top navigational tabs links bar */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/5">
                  {(userData?.role === 'Pembina' || userData?.role === 'Admin' || userData?.role === 'Super Admin') && (
                    <>
                      <button
                        onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'}`}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => { setActiveTab('members'); setSearchQuery(''); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'members' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'}`}
                      >
                        Anggota ({members.length})
                      </button>
                      <button
                        onClick={() => { setActiveTab('inventory'); setSearchQuery(''); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'inventory' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'}`}
                      >
                        Inventaris ({inventory.length})
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => { setActiveTab('programs'); setSearchQuery(''); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'programs' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'}`}
                  >
                    Program ({programs.length})
                  </button>
                  <button
                    onClick={() => { setActiveTab('gallery'); setSearchQuery(''); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'gallery' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'}`}
                  >
                    Galeri ({gallery.length})
                  </button>
                  <button
                    onClick={() => { setActiveTab('news'); setSearchQuery(''); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'news' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'}`}
                  >
                    Berita ({news.length})
                  </button>
                  <button
                    onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'products' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'}`}
                  >
                    Karya ({products.length})
                  </button>
                  <button
                    onClick={() => { setActiveTab('simulator'); setSearchQuery(''); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'simulator' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'}`}
                  >
                    Simulator IDE
                  </button>
                  {userData?.role !== 'Admin' && (
                    <button
                      onClick={() => { setActiveTab('learning'); setSearchQuery(''); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-yellow-400 border border-yellow-400/10 bg-yellow-400/5 transition-all cursor-pointer ${activeTab === 'learning' ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/20' : 'text-slate-400 hover:text-white'}`}
                    >
                      Pembelajaran 📚
                    </button>
                  )}
                  <button
                    onClick={() => { setActiveTab('chat'); setSearchQuery(''); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'chat' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'}`}
                  >
                    Diskusi AI
                  </button>
                  {(userData?.role === 'Pembina' || userData?.role === 'Admin' || userData?.role === 'Super Admin') && (
                    <button
                      onClick={() => { setActiveTab('editor'); setSearchQuery(''); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-brand-cyan border border-brand-cyan/10 animate-pulse bg-brand-cyan/5 transition-all cursor-pointer ${activeTab === 'editor' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/25' : 'text-slate-400 hover:text-white'}`}
                    >
                      Editor Konten ✨
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Interior view frames */}
              <div className="p-6 md:p-8 min-h-[450px]">
                
                {/* --- TAB 1: EXECUTIVE WORKSPACE OVERVIEW --- */}
                {activeTab === 'overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Left welcome widget card */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-brand-cyan/5 border border-brand-cyan/20 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="p-1 px-2.5 bg-brand-cyan/25 border border-brand-cyan/30 text-brand-cyan font-mono text-[9px] font-bold rounded-full uppercase">
                            Aktifitas Terminal
                          </span>
                          <h3 className="text-base font-display font-bold text-white">Platform Terpadu Robotika</h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-light">
                            Gunakan panel inventori, pendaftaran, serta emulator kode mikrokontroler di sebelah kanan untuk mempercepat pembelajaran elektronika.
                          </p>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 space-y-1 bg-black/40 p-3 rounded-xl">
                          <p>COM4 Connection: <strong className="text-green-400">READY</strong></p>
                          <p>Node Server: <strong className="text-brand-cyan">STANDBY</strong></p>
                        </div>
                      </div>

                      {/* Middle total member recap */}
                      <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xs font-mono font-semibold uppercase text-slate-400">Total Anggota</h3>
                          <p className="text-3xl font-display font-extrabold text-white">{members.length} Siswa</p>
                          <p className="text-xs text-slate-400 font-light">Termasuk pendaftar berstatus 'Calon Anggota' baru.</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('members')}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-brand-cyan rounded-xl border border-white/5 cursor-pointer"
                        >
                          Kelola Basis Data Anggota ➔
                        </button>
                      </div>

                      {/* Right inventory status recap */}
                      <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xs font-mono font-semibold uppercase text-slate-400 font-mono">Inventaris Lab</h3>
                          <p className="text-3xl font-display font-extrabold text-brand-purple">
                            {inventory.reduce((a, b) => a + b.quantity, 0)} Unit
                          </p>
                          <p className="text-xs text-slate-400 font-light">Komponen di tabrak, sasis, baterai, motor, sensor.</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('inventory')}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-brand-purple rounded-xl border border-white/5 cursor-pointer"
                        >
                          Kelola Gudang Komponen ➔
                        </button>
                      </div>

                    </div>

                    {/* Fast info notice box */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-cyan/20 text-brand-cyan rounded-xl text-center shrink-0">
                          <Sparkles className="w-5 h-5 text-brand-cyan animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">Mulai Menulis Firmware Robotika Sekarang!</h4>
                          <p className="text-xs text-slate-400 font-light mt-0.5">Ujilah logika Pin 13, sirkuit servo, dan filter PID otonom langsung di Tab "Simulator IDE".</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('simulator')}
                        className="py-2.5 px-5 bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold rounded-xl hover:shadow-cyan-glow transition-all cursor-pointer"
                      >
                        Buka Simulator IDE ➔
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* --- TAB 2: ACTIVE REGISTERED MEMBERS LIST INDEX (CRUD) --- */}
                {activeTab === 'members' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    
                    {/* Persetujuan Calon Anggota Baru (Approval Panel for Pembina) */}
                    {(userData?.role === 'Pembina' || userData?.role === 'Super Admin') && members.some(m => m.role === 'Calon Anggota') && (
                      <div className="bg-slate-950 border border-yellow-500/20 p-5 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
                            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Formulir Persetujuan Anggota Baru</h3>
                          </div>
                          <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded font-mono border border-yellow-500/20">
                            {members.filter(m => m.role === 'Calon Anggota').length} Pendaftaran Menunggu
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {members.filter(m => m.role === 'Calon Anggota').map(candidate => (
                            <div key={candidate.id} className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col justify-between gap-3 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-16 h-16 border-r border-t border-yellow-500/15 rounded-tr-2xl group-hover:scale-105 transition-transform" />
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="text-xs font-bold text-white mb-0.5">{candidate.name}</h4>
                                    <p className="text-[10.5px] text-slate-400 font-mono">{candidate.email}</p>
                                  </div>
                                  <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded font-mono border border-yellow-500/10 uppercase font-semibold shrink-0">
                                    {candidate.class}
                                  </span>
                                </div>
                                {candidate.interests && candidate.interests.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.interests.map(interest => (
                                      <span key={interest} className="text-[8.5px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                        #{interest}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                                <button
                                  type="button"
                                  onClick={() => handleApproveCandidate(candidate.id)}
                                  className="px-3 py-1.5 bg-brand-cyan/20 hover:bg-brand-cyan text-brand-cyan hover:text-white rounded-xl border border-brand-cyan/30 text-[10px] font-semibold cursor-pointer transition-colors"
                                >
                                  Setujui (Approve)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectCandidate(candidate.id)}
                                  className="px-3 py-1.5 bg-red-950/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 text-[10px] font-semibold cursor-pointer transition-colors"
                                >
                                  Tolak (Reject)
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Search panel */}
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Cari anggota, kelas, atau jabatan..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white"
                        />
                      </div>

                      <span className="p-1 px-3 bg-brand-cyan/15 border border-brand-cyan/25 text-brand-cyan rounded-full font-mono text-[10px] uppercase font-bold self-start md:self-center">
                        Total Roster: {filteredMembersList.length} Entri
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Table List of members left */}
                      <div className={`${isPrivileged ? 'lg:col-span-8' : 'lg:col-span-12'} overflow-x-auto bg-slate-950 p-4 border border-white/5 rounded-2xl`}>
                        <table className="w-full text-left text-xs font-sans">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                              <th className="pb-3 pl-2">Nama</th>
                              <th className="pb-3 text-center">Kelas</th>
                              <th className="pb-3">Jabatan</th>
                              <th className="pb-3">Tingkatan</th>
                              <th className="pb-3">Interests</th>
                              {isPrivileged && <th className="pb-3 text-right">Opsi</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-light">
                            {filteredMembersList.map((m) => (
                              <tr key={m.id} className="hover:bg-white/1.5 transition-colors">
                                <td className="py-3 pl-2 max-w-[120px]">
                                  <p className="font-semibold text-slate-200 truncate">{m.name}</p>
                                  <p className="text-[9.5px] text-slate-500 font-mono truncate">{m.email}</p>
                                  {m.role === 'Calon Anggota' && (
                                    <span className="text-[8px] bg-yellow-500/10 text-yellow-500 px-1 py-0.2 rounded font-mono font-bold animate-pulse">Pending</span>
                                  )}
                                </td>
                                <td className="py-3 text-center text-slate-300 font-mono">{m.class}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                    m.role === 'Pembina' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/20' :
                                    m.role === 'Admin' ? 'bg-red-500/10 text-red-400 border border-red-500/10' :
                                    m.role === 'Pengurus' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10' :
                                    m.role === 'Anggota Mitra' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/10' :
                                    m.role === 'Ketua' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/25' :
                                    m.role === 'Calon Anggota' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/10' :
                                    'bg-slate-800 text-slate-300'
                                  }`}>
                                    {m.role}
                                  </span>
                                </td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                    m.memberType === 'Senior' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' :
                                    m.memberType === 'Junior' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' :
                                    'bg-slate-800 text-slate-400 border border-slate-700/50'
                                  }`}>
                                    {m.memberType || 'Pemula'}
                                  </span>
                                </td>
                                <td className="py-3 text-[10px] text-slate-400 max-w-[110px] truncate">
                                  {m.interests.join(', ')}
                                </td>
                                {(userData?.role === 'Pembina' || userData?.role === 'Admin' || userData?.role === 'Super Admin') && (
                                  <td className="py-3 text-right pr-2">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => startEditMember(m)}
                                        className="p-1 px-2 bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25 rounded border border-brand-cyan/20 cursor-pointer"
                                        title="Edit Data Anggota"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      {(m.role !== 'Pembina' || userData?.role === 'Super Admin') ? (
                                        <button
                                          onClick={() => handleDeleteMember(m.id)}
                                          className="p-1 px-2 bg-red-950/20 text-red-400 hover:bg-red-950/40 rounded border border-red-500/10 cursor-pointer"
                                          title="Keluarkan dari Roster"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      ) : (
                                        <span className="text-[10px] font-mono text-slate-600 px-1">Locked</span>
                                      )}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {filteredMembersList.length === 0 && (
                          <div className="text-center py-10 font-mono text-slate-500 text-xs">
                             Syarat pencarian tidak ditemukan.
                          </div>
                        )}
                      </div>

                      {/* Add Member form right (Admins only/any mock login) */}
                      {(userData?.role === 'Pembina' || userData?.role === 'Admin' || userData?.role === 'Super Admin') && (
                        <form onSubmit={handleAddNewMember} className="lg:col-span-4 p-5 bg-gradient-to-br from-white/3 to-transparent rounded-2xl border border-white/5 space-y-4">
                          <h4 className="text-xs font-mono font-bold uppercase text-brand-cyan pl-1 border-l-2 border-brand-cyan flex items-center justify-between">
                             <span>{editingMemberId ? 'Ubah Data Anggota' : 'Tambah Anggota Baru'}</span>
                             {editingMemberId && (
                               <button
                                 type="button"
                                 onClick={cancelEditMember}
                                 className="text-[9px] text-slate-450 hover:text-white uppercase font-mono px-1.5 py-0.5 bg-slate-800 rounded cursor-pointer"
                               >
                                 Batal
                               </button>
                             )}
                          </h4>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Nama Siswa *</label>
                            <input
                              type="text"
                              required
                              value={newMemName}
                              onChange={(e) => setNewMemName(e.target.value)}
                              placeholder="Ketik nama lengkap"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3 font-mono">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase">Kelas *</label>
                              <input
                               type="text"
                               required
                               value={newMemClass}
                               onChange={(e) => setNewMemClass(e.target.value)}
                               placeholder="e.g. XI RPL 1"
                               className="w-full bg-slate-950 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-300 uppercase">Peran *</label>
                              <select
                                value={newMemRole}
                                onChange={(e) => setNewMemRole(e.target.value as any)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-1.5 px-1.5 text-xs text-white focus:outline-none"
                              >
                                <option value="Admin">Admin</option>
                                <option value="Pengurus">Pengurus</option>
                                <option value="Anggota">Anggota</option>
                                <option value="Anggota Mitra">Anggota Mitra</option>
                                <option value="Pembina">Pembina</option>
                                <option value="Ketua">Ketua</option>
                                <option value="Wakil Ketua">Wakil Ketua</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 font-mono">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase">Username</label>
                              <input
                                type="text"
                                value={newMemUsername}
                                onChange={(e) => setNewMemUsername(e.target.value)}
                                placeholder="e.g. budis"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase">Sandi Akses</label>
                              <input
                                type="text"
                                value={newMemPassword}
                                onChange={(e) => setNewMemPassword(e.target.value)}
                                placeholder="Ketik sandi"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-1 font-mono">
                            <label className="text-[10px] text-slate-400 uppercase">Jenis / Tingkat Anggota *</label>
                            <select
                              value={newMemMemberType}
                              onChange={(e) => setNewMemMemberType(e.target.value as any)}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-1.5 px-1.5 text-xs text-white focus:outline-none"
                            >
                              <option value="Pemula">Pemula</option>
                              <option value="Junior">Junior</option>
                              <option value="Senior">Senior</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Keahlian / Minat *</label>
                            <input
                              type="text"
                              value={newMemInterest}
                              onChange={(e) => setNewMemInterest(e.target.value)}
                              placeholder="e.g. Arduino, Drone, Soldering"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan text-xs font-semibold rounded-xl border border-brand-cyan/30 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {editingMemberId ? (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Perubahan</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Simpan Siswa ke Roster</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}

                    </div>
                  </motion.div>
                )}

                {/* --- TAB 3: INTERNAL INVENTORY QUANTITIES WORKSPACE --- */}
                {activeTab === 'inventory' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Cari mikrokontroler, jenis sensor, lokasi..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white"
                        />
                      </div>

                      <span className="p-1 px-3 bg-brand-purple/15 border border-brand-purple/25 text-brand-purple rounded-full font-mono text-[10px] uppercase font-bold self-start md:self-center">
                        Total Kategori: {filteredInventoryList.length} Item
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Inventory Table list of stocks left */}
                      <div className={`${isPrivileged ? 'lg:col-span-8' : 'lg:col-span-12'} overflow-x-auto bg-slate-950 p-4 border border-white/5 rounded-2xl`}>
                        <table className="w-full text-left text-xs font-sans">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                              <th className="pb-3 pl-2">Nama Komponen</th>
                              <th className="pb-3">Klasifikasi</th>
                              <th className="pb-3 text-center">Jumlah Stok</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3">Lemari Lobi</th>
                              {isPrivileged && <th className="pb-3 text-right">Opsi Penyetelan</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-light">
                            {filteredInventoryList.map((i) => (
                              <tr key={i.id} className="hover:bg-white/1.5 transition-colors">
                                <td className="py-3 pl-2 font-semibold text-slate-200 max-w-[150px] truncate">{i.name}</td>
                                <td className="py-3 font-mono text-[10px] text-slate-300">{i.category}</td>
                                <td className="py-3 text-center text-slate-200 font-mono font-semibold">{i.quantity} {i.unit}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                    i.status === 'Tersedia' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                    i.status === 'Dipakai' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20' :
                                    'bg-red-500/10 text-red-500 border border-red-500/20'
                                  }`}>
                                    {i.status}
                                  </span>
                                </td>
                                <td className="py-3 text-[11px] text-slate-400">{i.location}</td>
                                {isPrivileged && (
                                  <td className="py-3 text-right pr-2 font-mono">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        onClick={() => handleStockChange(i.id, -1)}
                                        className="px-1.5 py-0.5 bg-slate-900 border border-white/5 hover:border-red-500 text-slate-300 hover:text-white rounded cursor-pointer text-[10px] font-bold"
                                        title="Kurangi stok"
                                      >
                                        -
                                      </button>
                                      <button
                                        onClick={() => handleStockChange(i.id, 1)}
                                        className="px-1.5 py-0.5 bg-slate-900 border border-white/5 hover:border-brand-teal text-slate-300 hover:text-white rounded cursor-pointer text-[10px] font-bold mr-1"
                                        title="Tambah stok"
                                      >
                                        +
                                      </button>
                                      <button
                                        onClick={() => startEditInventory(i)}
                                        className="p-1 bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25 rounded border border-brand-cyan/20 cursor-pointer text-xs"
                                        title="Edit Alat / Komponen"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteInventory(i.id)}
                                        className="p-1 bg-red-950/20 text-red-400 hover:bg-red-950/40 rounded border border-red-500/10 cursor-pointer text-xs"
                                        title="Hapus Inventaris"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {filteredInventoryList.length === 0 && (
                          <div className="text-center py-10 font-mono text-slate-500 text-xs">
                             Kategori sensor tidak ditemukan.
                          </div>
                        )}
                      </div>

                      {/* Add/Edit Inventory form right */}
                      {isPrivileged && (
                        <form onSubmit={handleAddNewInventory} className="lg:col-span-4 p-5 bg-gradient-to-br from-white/3 to-transparent rounded-2xl border border-white/5 space-y-4">
                          <h4 className="text-xs font-mono font-bold uppercase text-brand-cyan pl-1 border-l-2 border-brand-cyan flex items-center justify-between">
                             <span>{editingInventoryId ? 'Ubah Data Inventaris' : 'Tambah Komponen'}</span>
                             {editingInventoryId && (
                               <button
                                 type="button"
                                 onClick={cancelEditInventory}
                                 className="text-[9px] text-slate-450 hover:text-white uppercase font-mono px-1.5 py-0.5 bg-slate-800 rounded cursor-pointer"
                               >
                                 Batal
                               </button>
                             )}
                          </h4>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Nama Komponen *</label>
                            <input
                              type="text"
                              required
                              value={newInvName}
                              onChange={(e) => setNewInvName(e.target.value)}
                              placeholder="e.g. Arduino Uno"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3 font-mono">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase">Klasifikasi *</label>
                              <select
                                value={newInvCategory}
                                onChange={(e) => setNewInvCategory(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-1.5 px-1.5 text-xs text-white focus:outline-none"
                              >
                                <option value="Microcontroller">Microcontroller</option>
                                <option value="Sensor">Sensor</option>
                                <option value="Actuator">Actuator</option>
                                <option value="Power">Power</option>
                                <option value="Tools">Tools</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase">Satuan *</label>
                              <input
                                type="text"
                                required
                                value={newInvUnit}
                                onChange={(e) => setNewInvUnit(e.target.value)}
                                placeholder="e.g. Pcs"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 font-mono">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase">Jumlah Stok *</label>
                              <input
                                type="number"
                                required
                                value={newInvQuantity}
                                onChange={(e) => setNewInvQuantity(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-405 uppercase">Status *</label>
                              <select
                                value={newInvStatus}
                                onChange={(e) => setNewInvStatus(e.target.value as any)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-1.5 px-1.5 text-xs text-white focus:outline-none"
                              >
                                <option value="Tersedia">Tersedia</option>
                                <option value="Dipakai">Dipakai</option>
                                <option value="Habis">Habis</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Lokasi Penyimpanan *</label>
                            <input
                              type="text"
                              required
                              value={newInvLocation}
                              onChange={(e) => setNewInvLocation(e.target.value)}
                              placeholder="e.g. Loker A-1"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan text-xs font-semibold rounded-xl border border-brand-cyan/30 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {editingInventoryId ? (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Perubahan</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Komponen</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}

                    </div>
                  </motion.div>
                )}

                {/* --- TAB: PROGRAMS INSTRUCTIONAL CURRICULUM (CRUD) --- */}
                {activeTab === 'programs' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white">Program & Kurikulum Robotika</h2>
                        <p className="text-xs text-slate-400 font-light">Kelola silabus, durasi, tingkat kesulitan, dan program studi eksternal.</p>
                      </div>
                      <span className="p-1 px-3 bg-brand-cyan/15 border border-brand-cyan/25 text-brand-cyan rounded-full font-mono text-[10px] uppercase font-bold self-start md:self-center">
                        Total Program: {programs.length} Entri
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: Programs List Table */}
                      <div className={`${isPrivileged ? 'lg:col-span-8' : 'lg:col-span-12'} bg-slate-950 p-4 border border-white/5 rounded-2xl overflow-x-auto`}>
                        <table className="w-full text-left text-xs font-sans">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                              <th className="pb-3 pl-2">Nama Program</th>
                              <th className="pb-3">Durasi</th>
                              <th className="pb-3">Tingkat</th>
                              <th className="pb-3">Deskripsi Ringkat</th>
                              {isPrivileged && <th className="pb-3 text-right">Opsi</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-light">
                            {programs.map((p) => (
                              <tr key={p.id} className="hover:bg-white/1.5 transition-colors">
                                <td className="py-3 pl-2 font-semibold text-slate-200">
                                  <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan rounded font-mono text-xs">
                                      {p.iconName === 'Cpu' ? '⚙️' : p.iconName === 'Wifi' ? '🌐' : p.iconName === 'Layers' ? '📚' : '👁️'}
                                    </span>
                                    <span>{p.title}</span>
                                  </div>
                                </td>
                                <td className="py-3 font-mono text-[11px] text-brand-cyan">{p.duration}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                    p.difficulty === 'Pemula' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                    p.difficulty === 'Menengah' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                    'bg-red-500/10 text-red-500 border border-red-500/20'
                                  }`}>
                                    {p.difficulty}
                                  </span>
                                </td>
                                <td className="py-3 text-[11px] text-slate-400 max-w-[200px] truncate">{p.description}</td>
                                {isPrivileged && (
                                  <td className="py-3 text-right pr-2">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => startEditProgram(p)}
                                        className="p-1 px-2 bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25 rounded border border-brand-cyan/20 cursor-pointer"
                                        title="Edit Program"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProgram(p.id)}
                                        className="p-1 px-2 bg-slate-900 border border-white/5 hover:border-red-500 text-slate-400 hover:text-white rounded cursor-pointer transition-all"
                                        title="Hapus Program"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-500" />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {programs.length === 0 && (
                          <div className="text-center py-10 font-mono text-slate-500 text-xs">
                             Belum ada program studi terdaftar.
                          </div>
                        )}
                      </div>

                      {/* Right: Add Form */}
                      {isPrivileged && (
                        <form onSubmit={handleAddNewProgram} className="lg:col-span-4 bg-slate-950 p-6 border border-white/5 rounded-2xl space-y-4">
                          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Plus className="w-4 h-4 text-brand-cyan" />
                              <span>{editingProgramId ? 'Ubah Kurikulum' : 'Daftarkan Kurikulum baru'}</span>
                            </span>
                            {editingProgramId && (
                              <button
                                type="button"
                                onClick={cancelEditProgram}
                                className="text-[9px] text-slate-450 hover:text-white uppercase font-mono px-1.5 py-0.5 bg-slate-800 rounded cursor-pointer"
                              >
                                Batal
                              </button>
                            )}
                          </h3>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Judul Program *</label>
                            <input
                              type="text"
                              required
                              value={newProgTitle}
                              onChange={(e) => setNewProgTitle(e.target.value)}
                              placeholder="e.g. Robot Beroda Otonom"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-mono">Prasyarat</label>
                              <select
                                value={newProgDiff}
                                onChange={(e) => setNewProgDiff(e.target.value as any)}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white focus:outline-none"
                              >
                                <option value="Pemula">Pemula</option>
                                <option value="Menengah">Menengah</option>
                                <option value="Mahir">Mahir</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-mono">Durasi *</label>
                              <input
                                type="text"
                                required
                                value={newProgDuration}
                                onChange={(e) => setNewProgDuration(e.target.value)}
                                placeholder="e.g. 3 Bulan"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Icon Class</label>
                            <select
                              value={newProgIcon}
                              onChange={(e) => setNewProgIcon(e.target.value)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white focus:outline-none"
                            >
                              <option value="Cpu">CPU (Servo, Controller)</option>
                              <option value="Wifi">Wifi (Internet of Things)</option>
                              <option value="Layers">Layers (Algoritma)</option>
                              <option value="Maximize">Maximize (Vision Sensor)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Deskripsi Singkat *</label>
                            <textarea
                              required
                              value={newProgDesc}
                              onChange={(e) => setNewProgDesc(e.target.value)}
                              placeholder="Tulis ringkasan materi/praktek utama program"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white min-h-[60px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Rincian Kurikulum</label>
                            <textarea
                              value={newProgDetail}
                              onChange={(e) => setNewProgDetail(e.target.value)}
                              placeholder="e.g. Minggu 1-2: Arduino ADC; Minggu 3-4: Sensor Ultrasonik..."
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white min-h-[50px] mb-2"
                            />
                          </div>

                          <ImageUploader
                            value={newProgImg}
                            onChange={setNewProgImg}
                            label="Foto banner kurikulum program"
                          />

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-brand-cyan/25 hover:bg-brand-cyan/35 text-brand-cyan text-xs font-semibold rounded-xl border border-brand-cyan/35 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {editingProgramId ? (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Kurikulum</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Daftarkan Program</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* --- TAB: GALLERY FOTO KEGIATAN (CRUD) --- */}
                {activeTab === 'gallery' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white">Galeri Foto Kegiatan & Event</h2>
                        <p className="text-xs text-slate-400 font-light">Kelola dokumentasi visual robotika, latihan mingguan, dan turnamen robot.</p>
                      </div>
                      <span className="p-1 px-3 bg-brand-teal/15 border border-brand-teal/25 text-brand-teal rounded-full font-mono text-[10px] uppercase font-bold self-start md:self-center">
                        Total Dokumentasi: {gallery.length} Foto
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: Gallery Cards Grid with Delete */}
                      <div className={`${isPrivileged ? 'lg:col-span-8' : 'lg:col-span-12'} bg-slate-950 p-5 border border-white/5 rounded-2xl`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {gallery.map((g) => (
                            <div key={g.id} className="group relative bg-slate-900 border border-white/5 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.01]">
                              <img
                                src={g.imageUrl}
                                alt={g.title}
                                className="w-full h-36 object-cover"
                              />
                              <div className="p-3">
                                <div className="flex items-center justify-between">
                                  <span className="px-2 py-0.5 bg-brand-cyan/10 border border-brand-cyan/15 rounded text-[8px] font-mono text-brand-cyan font-bold uppercase">
                                    {g.category}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">{g.date}</span>
                                </div>
                                <h4 className="text-xs font-semibold text-slate-200 mt-1.5 truncate">{g.title}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5 font-light line-clamp-2 md:h-8">{g.description}</p>
                              </div>
                              {isPrivileged && (
                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                  <button
                                    onClick={() => startEditGallery(g)}
                                    className="p-1.5 bg-slate-950/80 hover:bg-brand-cyan text-brand-cyan hover:text-white rounded-lg border border-white/10 cursor-pointer shadow-lg"
                                    title="Edit Foto"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGallery(g.id)}
                                    className="p-1.5 bg-slate-950/80 hover:bg-red-500 text-red-400 hover:text-white rounded-lg border border-white/10 cursor-pointer shadow-lg"
                                    title="Hapus Gambar"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {gallery.length === 0 && (
                          <div className="text-center py-12 font-mono text-slate-500 text-xs">
                            Belum ada foto kegiatan di galeri.
                          </div>
                        )}
                      </div>

                      {/* Right: Add Form */}
                      {isPrivileged && (
                        <form onSubmit={handleAddNewGallery} className="lg:col-span-4 bg-slate-950 p-6 border border-white/5 rounded-2xl space-y-4">
                          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Plus className="w-4 h-4 text-brand-teal" /> 
                              <span>{editingGalleryId ? 'Edit Foto Kegiatan' : 'Upload Foto Baru'}</span>
                            </span>
                            {editingGalleryId && (
                              <button
                                type="button"
                                onClick={cancelEditGallery}
                                className="text-[9px] text-slate-450 hover:text-white uppercase font-mono px-1.5 py-0.5 bg-slate-800 rounded cursor-pointer"
                              >
                                Batal
                              </button>
                            )}
                          </h3>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Judul Kegiatan *</label>
                            <input
                              type="text"
                              required
                              value={newGalTitle}
                              onChange={(e) => setNewGalTitle(e.target.value)}
                              placeholder="e.g. Juara 1 Kontes Robot Nasional"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Klasifikasi Event</label>
                            <select
                              value={newGalCategory}
                              onChange={(e) => setNewGalCategory(e.target.value as any)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white focus:outline-none"
                            >
                              <option value="Workshop">Workshop</option>
                              <option value="Lomba">Lomba & Turnamen</option>
                              <option value="Pelatihan">Pelatihan</option>
                              <option value="Kunjungan Industri">Kunjungan Industri</option>
                              <option value="Seminar">Seminar</option>
                              <option value="Praktikum">Praktikum Lab</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Tautan URL Gambar *</label>
                            <input
                              type="text"
                              required
                              value={newGalImg}
                              onChange={(e) => setNewGalImg(e.target.value)}
                              placeholder="Tautan Gambar Unsplash / Web"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-brand-cyan mb-2"
                            />
                            <ImageUploader
                              value={newGalImg}
                              onChange={setNewGalImg}
                              label="Ubah/Unggah Foto Kegiatan"
                            />
                            <p className="text-[9px] text-slate-500 font-mono scale-95 origin-left">Gunakan URL foto beresolusi sedang atau unggah file lokal.</p>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Keterangan Foto</label>
                            <textarea
                              value={newGalDesc}
                              onChange={(e) => setNewGalDesc(e.target.value)}
                              placeholder="Ceritakan sejarah singkat event di balik foto ini..."
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white min-h-[80px]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-brand-teal/25 hover:bg-brand-teal/35 text-brand-teal text-xs font-semibold rounded-xl border border-brand-teal/35 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {editingGalleryId ? (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Perubahan</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Simpan ke Galeri</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* --- TAB: NEWS / ARTIKEL FEED (CRUD) --- */}
                {activeTab === 'news' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white">Mading Digital & Informasi Berita</h2>
                        <p className="text-xs text-slate-400 font-light font-sans">Kelola pengumuman turnamen, tips pemrograman, jadwal workshop, dan event utama.</p>
                      </div>
                      <span className="p-1 px-3 bg-brand-purple/15 border border-brand-purple/25 text-brand-purple rounded-full font-mono text-[10px] uppercase font-bold self-start md:self-center">
                        Total Artikel: {news.length} Berita
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: News articles row lists */}
                      <div className={`${isPrivileged ? 'lg:col-span-8' : 'lg:col-span-12'} bg-slate-950 p-4 border border-white/5 rounded-2xl space-y-3`}>
                        {news.map((n) => (
                          <div key={n.id} className="relative p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-brand-purple/30 transition-all flex flex-col md:flex-row gap-4 items-center">
                            <img
                              src={n.imageUrl}
                              alt={n.title}
                              className="w-24 h-20 rounded-lg object-cover bg-slate-800 shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="p-0.5 px-2 bg-brand-purple/10 border border-brand-purple/20 rounded font-mono text-[9px] text-brand-purple font-semibold uppercase">
                                  {n.category}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">{n.date} · Oleh {n.author}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{n.title}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 font-light line-clamp-2">{n.summary}</p>
                            </div>
                            {isPrivileged && (
                              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                                <button
                                  onClick={() => startEditNews(n)}
                                  className="p-2 bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25 rounded-xl border border-brand-cyan/20 cursor-pointer transition-all"
                                  title="Edit Berita"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNews(n.id)}
                                  className="p-2 bg-slate-950 hover:bg-red-500 text-red-400 hover:text-white border border-white/5 rounded-xl cursor-pointer transition-all"
                                  title="Hapus Mading"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {news.length === 0 && (
                          <div className="text-center py-12 font-mono text-slate-500 text-xs">
                            Belum ada berita mading digital yang dipublikasikan.
                          </div>
                        )}
                      </div>

                      {/* Right: Add Form */}
                      {isPrivileged && (
                        <form onSubmit={handleAddNewNews} className="lg:col-span-4 bg-slate-950 p-6 border border-white/5 rounded-2xl space-y-4 font-sans">
                          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Plus className="w-4 h-4 text-brand-purple" />
                              <span>{editingNewsId ? 'Ubah Berita / Redaksi' : 'Tulis Redaksi Baru'}</span>
                            </span>
                            {editingNewsId && (
                              <button
                                type="button"
                                onClick={cancelEditNews}
                                className="text-[9px] text-slate-450 hover:text-white uppercase font-mono px-1.5 py-0.5 bg-slate-800 rounded cursor-pointer"
                              >
                                Batal
                              </button>
                            )}
                          </h3>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Judul Berita *</label>
                            <input
                              type="text"
                              required
                              value={newNewsTitle}
                              onChange={(e) => setNewNewsTitle(e.target.value)}
                              placeholder="e.g. Pembukaan Pendaftaran Robotika 2026/2027"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-mono">Kategori Mading</label>
                              <select
                                value={newNewsCategory}
                                onChange={(e) => setNewNewsCategory(e.target.value as any)}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white focus:outline-none"
                              >
                                <option value="Pengumuman">Pengumuman</option>
                                <option value="Jadwal Latihan">Jadwal Latihan</option>
                                <option value="Agenda">Agenda Eksekutif</option>
                                <option value="Prestasi">Prestasi & Piala</option>
                                <option value="Event">Event Eksternal</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-mono">Penulis Redaksi *</label>
                              <input
                                type="text"
                                required
                                value={newNewsAuthor}
                                onChange={(e) => setNewNewsAuthor(e.target.value)}
                                placeholder="e.g. Pak Guru"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Image Tautan Utama</label>
                            <input
                              type="text"
                              value={newNewsImg}
                              onChange={(e) => setNewNewsImg(e.target.value)}
                              placeholder="Tautan foto berita"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-400 font-mono mb-2"
                            />
                            <ImageUploader
                              value={newNewsImg}
                              onChange={setNewNewsImg}
                              label="Ubah/Unggah Gambar Berita"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Ringkasan Utama (Summary) *</label>
                            <input
                              type="text"
                              required
                              value={newNewsSummary}
                              onChange={(e) => setNewNewsSummary(e.target.value)}
                              placeholder="1 kalimat pemikat kilat"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Konten Berita Lengkap *</label>
                            <textarea
                              required
                              value={newNewsContent}
                              onChange={(e) => setNewNewsContent(e.target.value)}
                              placeholder="Tulis naskah lengkap isi mading digital..."
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white min-h-[80px]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-brand-purple/25 hover:bg-brand-purple/35 text-brand-purple text-xs font-semibold rounded-xl border border-brand-purple/35 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {editingNewsId ? (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Perubahan</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Publikasikan Redaksi</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* --- TAB: PRODUCTS & EXPERIMENTS WORKSHOP (CRUD) --- */}
                {activeTab === 'products' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white">Produk Kreatif & Riset Sasis Robot</h2>
                        <p className="text-xs text-slate-400 font-light">Kelola katalog karya siswa, spesifikasi kontrol sasis, dan status kesiapan rilis.</p>
                      </div>
                      <span className="p-1 px-3 bg-brand-blue/15 border border-brand-blue/25 text-brand-blue rounded-full font-mono text-[10px] uppercase font-bold self-start md:self-center">
                        Karya Terdaftar: {products.length} Robot
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: Products catalog table */}
                      <div className={`${isPrivileged ? 'lg:col-span-8' : 'lg:col-span-12'} bg-slate-950 p-4 border border-white/5 rounded-2xl overflow-x-auto`}>
                        <table className="w-full text-left text-xs font-sans">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                              <th className="pb-3 pl-2">Sirkuit Sasis</th>
                              <th className="pb-3">Klasifikasi</th>
                              <th className="pb-3 font-mono">Penemu</th>
                              <th className="pb-3">Status</th>
                              {isPrivileged && <th className="pb-3 text-right">Opsi</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-light">
                            {products.map((p) => (
                              <tr key={p.id} className="hover:bg-white/1.5 transition-colors">
                                <td className="py-3 pl-2">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={p.imageUrl}
                                      alt={p.name}
                                      className="w-12 h-10 object-cover rounded-lg bg-slate-800"
                                    />
                                    <div>
                                      <h5 className="font-semibold text-slate-200">{p.name}</h5>
                                      <span className="text-[10px] text-slate-500 font-mono">Tahun {p.year}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 font-mono text-[10px] text-slate-300">{p.category}</td>
                                <td className="py-3 font-medium text-slate-400">{p.creator}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                    p.status === 'Ready' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                    p.status === 'Prototype' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                    'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/25'
                                  }`}>
                                    {p.status}
                                  </span>
                                </td>
                                {isPrivileged && (
                                  <td className="py-3 text-right pr-2">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => startEditProduct(p)}
                                        className="p-1 px-2 bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25 rounded border border-brand-cyan/20 cursor-pointer"
                                        title="Edit Produk Riset"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProduct(p.id)}
                                        className="p-1 px-2 bg-slate-900 border border-white/5 hover:border-red-500 text-slate-400 hover:text-white rounded cursor-pointer transition-all"
                                        title="Hapus Produk"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-500" />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {products.length === 0 && (
                          <div className="text-center py-10 font-mono text-slate-500 text-xs">
                             Belum ada katalog karya produk terdaftar.
                          </div>
                        )}
                      </div>

                      {/* Right: Add Form */}
                      {isPrivileged && (
                        <form onSubmit={handleAddNewProduct} className="lg:col-span-4 bg-slate-950 p-6 border border-white/5 rounded-2xl space-y-4">
                          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Plus className="w-4 h-4 text-brand-blue" />
                              <span>{editingProductId ? 'Ubah Riset Sasis' : 'Rilis Sasis Baru'}</span>
                            </span>
                            {editingProductId && (
                              <button
                                type="button"
                                onClick={cancelEditProduct}
                                className="text-[9px] text-slate-450 hover:text-white uppercase font-mono px-1.5 py-0.5 bg-slate-800 rounded cursor-pointer"
                              >
                                Batal
                              </button>
                            )}
                          </h3>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Nama Robot / Karya *</label>
                            <input
                              type="text"
                              required
                              value={newProdName}
                              onChange={(e) => setNewProdName(e.target.value)}
                              placeholder="e.g. Hexapod Spider Bot v2"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-mono">Kategori Karya</label>
                              <input
                                type="text"
                                value={newProdCategory}
                                onChange={(e) => setNewProdCategory(e.target.value)}
                                placeholder="e.g. Internet of Things"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white uppercase font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-mono">Status Kesiapan</label>
                              <select
                                value={newProdStatus}
                                onChange={(e) => setNewProdStatus(e.target.value as any)}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2 text-xs text-white focus:outline-none"
                              >
                                <option value="Prototype">Prototype</option>
                                <option value="Ready">Ready</option>
                                <option value="Development">Development</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Penemu / Anggota *</label>
                            <input
                              type="text"
                              required
                              value={newProdCreator}
                              onChange={(e) => setNewProdCreator(e.target.value)}
                              placeholder="e.g. Team Aero-Robo XI"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Link URL Gambar *</label>
                            <input
                              type="text"
                              required
                              value={newProdImg}
                              onChange={(e) => setNewProdImg(e.target.value)}
                              placeholder="Tautan foto karya robot"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-slate-400 mb-2"
                            />
                            <ImageUploader
                              value={newProdImg}
                              onChange={setNewProdImg}
                              label="Ubah/Unggah Foto Karya"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Spesifikasi Controller (Pisahkan Koma)</label>
                            <input
                              type="text"
                              value={newProdSpecs}
                              onChange={(e) => setNewProdSpecs(e.target.value)}
                              placeholder="e.g. ESP32 DevKit v1, LiPo 12V 4000mAh"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-300"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Teknologi Sensor (Pisahkan Koma)</label>
                            <input
                              type="text"
                              value={newProdTechs}
                              onChange={(e) => setNewProdTechs(e.target.value)}
                              placeholder="e.g. Bluetooth BLE, MPU6050 Giro"
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-300"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-mono">Deskripsi Robot Riset</label>
                            <textarea
                              value={newProdDesc}
                              onChange={(e) => setNewProdDesc(e.target.value)}
                              placeholder="Jabarkan fungsi robot otonom dan kelebihan riset ini..."
                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white min-h-[60px]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-brand-blue/25 hover:bg-brand-blue/35 text-brand-blue text-xs font-semibold rounded-xl border border-brand-blue/35 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {editingProductId ? (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Perubahan</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Publikasikan Karya Robot</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* --- TAB 4: MOCK MICROCONTROLLER WORKSPACE IDE EMULATION --- */}
                {activeTab === 'simulator' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-mono">
                    
                    {/* Workspace Code Editor Column (Left) */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      
                      {/* Configuration panel bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Pilih Sketsa:</span>
                          <select
                            value={selectedExample}
                            onChange={(e) => setSelectedExample(e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs text-brand-cyan focus:outline-none cursor-pointer"
                          >
                            <option value="Blink LED">Blink_Pin13.ino</option>
                            <option value="Servo Sweep">Servo_Sweep.ino</option>
                            <option value="PID Line Follower">PID_LineFollower.ino</option>
                          </select>
                        </div>

                        {/* Action buttons compil/run */}
                        <div className="flex gap-2">
                          <button
                            onClick={handleCompileCode}
                            disabled={isCompiling}
                            className={`p-1 px-3 bg-slate-900 hover:bg-slate-800 text-brand-purple rounded text-xs font-semibold flex items-center gap-1.5 border border-brand-purple/20 transition-all cursor-pointer ${isCompiling && 'animate-pulse'}`}
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isCompiling && 'animate-spin'}`} />
                            <span>Kompil</span>
                          </button>
                          
                          <button
                            onClick={handleRunSimulation}
                            disabled={!compilationSuccess || isRunning}
                            className={`p-1 px-3 bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 border border-brand-cyan/35 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-30`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>RUN</span>
                          </button>
                        </div>
                      </div>

                      {/* Text Code block space */}
                      <div className="relative flex-1 font-mono text-[11px] leading-relaxed bg-black text-green-200 border border-white/10 rounded-2xl overflow-hidden min-h-[300px]">
                        
                        {/* Number guide line rails */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-950 border-r border-white/5 text-center text-[9px] text-slate-600 select-none py-3 space-y-1">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <p key={i}>{i + 1}</p>
                          ))}
                        </div>

                        <textarea
                          value={ideCode}
                          onChange={(e) => setIdeCode(e.target.value)}
                          className="w-full h-full bg-transparent pl-11 pr-4 py-3 text-xs leading-loose focus:outline-none font-mono text-green-200 caret-brand-cyan resize-none box-border"
                          style={{ minHeight: '300px' }}
                        />
                      </div>

                    </div>

                    {/* Integrated Electronics Canvas Simulated Output Column (Right) */}
                    <div className="lg:col-span-5 bg-black/80 rounded-2xl border border-white/10 p-5 flex flex-col justify-between space-y-6">
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                          <span className="text-slate-400 flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-brand-cyan" /> Output Skema Hardware</span>
                          <span className={`p-0.5 px-2 rounded-full text-[8.5px] font-bold ${isRunning ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                            {isRunning ? 'EXECUTION ONLINE' : 'STOPPED'}
                          </span>
                        </div>

                        {/* Visual hardware dynamic graphic viewport */}
                        <div className="w-full h-52 bg-slate-950 rounded-xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden p-4">
                          
                          {/* 1. BLINK LED SIMULATION GRAPHIC */}
                          {selectedExample === 'Blink LED' && (
                            <div className="flex flex-col items-center justify-center space-y-3 relative scale-95">
                              {/* Glowing simulated LED chip */}
                              <div className="relative">
                                <span className={`absolute -inset-4 rounded-full blur-xl transition-all duration-200 ${
                                  isRunning && (Date.now() % 2000 > 1000) ? 'bg-orange-500/40 scale-100' : 'bg-transparent scale-0'
                                }`} />
                                <div className={`w-14 h-14 rounded-full border border-orange-500/30 flex items-center justify-center transition-all ${
                                  isRunning && (Date.now() % 2000 > 1000) ? 'bg-orange-500 shadow-xl shadow-orange-500/50 scale-105' : 'bg-slate-900 text-slate-800 border-slate-700'
                                }`}>
                                  <Cpu className="w-7 h-7 text-white" />
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-white text-xs font-bold font-mono">D13 LED (Hardware)</p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  {isRunning && (Date.now() % 2000 > 1000) ? 'Pin State: HIGH (5.0V)' : 'Pin State: LOW (0.0V)'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* 2. SERVO SWEEP SIMULATION GRAPHIC */}
                          {selectedExample === 'Servo Sweep' && (
                            <div className="flex flex-col items-center justify-center space-y-3 relative">
                              
                              {/* Mechanical micro-gear wheel wrapper */}
                              <div className="relative w-28 h-28 border border-white/10 rounded-full flex items-center justify-center bg-black/40">
                                
                                {/* Dial marker ticks */}
                                <div className="absolute top-1 text-[9px] text-slate-500">180°</div>
                                <div className="absolute left-1.5 text-[9px] text-slate-500">90°</div>
                                <div className="absolute right-1 text-[9px] text-slate-500">0°</div>

                                {/* Rotary pointer line */}
                                <motion.div
                                  className="w-12 h-1 bg-gradient-to-r from-brand-cyan to-transparent absolute origin-left left-[50%] z-10"
                                  style={{
                                    transform: `rotate(${simAngle - 90}deg)` // Sweep center offset
                                  }}
                                  animate={{ rotate: isRunning ? simAngle - 90 : -90 }}
                                />
                                
                                <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-600 z-20" />
                              </div>

                              <div className="text-center">
                                <p className="text-xs text-white font-bold">Servo SG90 Rotary Shaft</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Sudut Rotasi: {isRunning ? `${simAngle}°` : '0°'}</p>
                              </div>
                            </div>
                          )}

                          {/* 3. PID LINE FOLLOWER TRACKING SIMULATION GRAPHIC */}
                          {selectedExample === 'PID Line Follower' && (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                              <div className="w-full bg-slate-900 h-1 rounded-full relative overflow-hidden border border-white/5">
                                {/* Moving sensor node line */}
                                <motion.div
                                  className="absolute w-4 h-4 bg-brand-purple rounded-full -top-1.5 blur-sm"
                                  animate={{
                                    x: isRunning ? [20, 160, 80, 240, 120] : 120
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 4,
                                    ease: 'easeInOut'
                                  }}
                                />
                              </div>
                              
                              {/* Simulated robot chassis representation */}
                              <div className="p-2.5 bg-slate-800 rounded-lg border border-brand-cyan/20 text-center font-mono text-[10px] flex items-center gap-3">
                                <span>L-Motor: <strong className="text-brand-cyan">180</strong></span>
                                <Cpu className="w-4 h-4 text-brand-purple animate-pulse" />
                                <span>R-Motor: <strong className="text-brand-purple">180</strong></span>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Serial Terminal Logger View */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Serial Monitor Logs:</span>
                        <div className="w-full bg-black h-32 p-3 font-mono text-[10px] text-green-300 rounded-xl overflow-y-auto space-y-1 border border-white/5 scrollbar-thin">
                          {simSerialOutputs.map((log, idx) => (
                            <p key={idx} className="leading-tight select-all">
                              {log}
                            </p>
                          ))}
                          {simSerialOutputs.length === 0 && (
                            <p className="text-slate-600">Konsol Serial kosong. Kompil & jalankan program (RUN) untuk memantau data.</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* --- TAB 5: AI ROBOTICS CLINIC CHAT ASSISTANT --- */}
                {activeTab === 'chat' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 font-sans text-xs">
                    
                    {/* Chat viewport box */}
                    <div className="w-full max-w-4xl mx-auto border border-white/5 rounded-2xl overflow-hidden glass-panel flex flex-col justify-between min-h-[400px]">
                      
                      {/* Chat Top title banner */}
                      <div className="bg-slate-950 p-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-brand-cyan animate-pulse" />
                          <div>
                            <h4 className="text-xs font-mono font-bold text-white uppercase">AI Co-Developer Lab</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Asisten kecerdasan buatan siap menjawab debugging C++ & sensor RFID.</p>
                          </div>
                        </div>
                        <span className="p-0.5 px-2 bg-brand-cyan/20 text-brand-cyan rounded-md text-[9px] font-mono tracking-wider">ONLINE</span>
                      </div>

                      {/* Message log content list */}
                      <div className="flex-1 p-5 space-y-4 max-h-[300px] overflow-y-auto bg-slate-950/20 leading-relaxed font-light font-sans text-xs sm:text-sm">
                        {chatMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`p-4 rounded-2xl max-w-md space-y-1 select-text ${
                              msg.sender === 'user'
                                ? 'bg-brand-blue text-white rounded-tr-none'
                                : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                            }`}>
                              <p className="leading-normal">{msg.text}</p>
                              <span className="text-[8px] text-white/50 block text-right font-mono">{msg.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input form dock bar */}
                      <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-white/5 flex gap-3">
                        <input
                          type="text"
                          required
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ketik pertanyaan (e.g. jelaskan cara memprogram motor servo atau PID)..."
                          className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-brand-cyan"
                        />
                        <button
                          type="submit"
                          className="p-3 bg-brand-cyan hover:bg-brand-cyan/80 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <Send className="w-4 h-4 fill-current text-white" />
                        </button>
                      </form>

                    </div>

                    {/* Chat quick topics recommendation bar */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-mono text-slate-400 max-w-xl mx-auto">
                      <span>Rekomendasi Pintas:</span>
                      <button 
                        onClick={() => setChatInput('Bagaimana cara memprogram sensor jarak ultrasonik HC-SR04?')}
                        className="p-1 px-2.5 bg-white/5 hover:bg-brand-cyan/20 hover:text-brand-cyan rounded-full border border-white/5 cursor-pointer"
                      >
                         Sensor Ultrasonik
                      </button>
                      <button 
                        onClick={() => setChatInput('Apa itu algoritma PID dan bagaimana rumusnya?')}
                        className="p-1 px-2.5 bg-white/5 hover:bg-brand-cyan/20 hover:text-brand-cyan rounded-full border border-white/5 cursor-pointer"
                      >
                         Rumus PID Robot Line Follower
                      </button>
                    </div>

                  </motion.div>
                )}

                {/* --- TAB: SITE CONTENT EDITOR --- */}
                {activeTab === 'editor' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {saveFeedback && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono rounded-xl mb-4"
                      >
                        ✓ {saveFeedback}
                      </motion.div>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      
                      {/* Left Side: Sidebar navigation inside Editor */}
                      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 bg-slate-950 p-4 rounded-2xl border border-white/5">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Daftar Modul Konten</h3>
                        <button
                          onClick={() => setSubEditor('summary')}
                          className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${subEditor === 'summary' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                          1. Ringkasan Profil
                        </button>
                        <button
                          onClick={() => setSubEditor('visimisi')}
                          className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${subEditor === 'visimisi' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                          2. Visi & Misi Kami
                        </button>
                        <button
                          onClick={() => setSubEditor('information')}
                          className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${subEditor === 'information' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                          3. Informasi Headline
                        </button>
                        <button
                          onClick={() => setSubEditor('services')}
                          className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${subEditor === 'services' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                          4. Pelayanan Publik
                        </button>
                        <button
                          onClick={() => setSubEditor('instructors')}
                          className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${subEditor === 'instructors' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                          5. Tim Pembina & Mentor
                        </button>
                        <button
                          onClick={() => setSubEditor('achievements')}
                          className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${subEditor === 'achievements' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                          6. Prestasi Rekor Juara
                        </button>
                        {userData?.role !== 'Admin' && (
                          <button
                            onClick={() => setSubEditor('learning')}
                            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${subEditor === 'learning' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                          >
                            7. Kelola Pembelajaran 📚
                          </button>
                        )}
                        {(userData?.role === 'Pembina' || userData?.role === 'Super Admin') && (
                          <button
                            onClick={() => setSubEditor('theme')}
                            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${subEditor === 'theme' ? 'bg-brand-cyan/25 text-brand-sky border border-brand-cyan/30 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                          >
                            8. Desain & Background 🎨
                          </button>
                        )}
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-[10px] text-slate-500 font-light font-sans bg-black/30 p-2.5 rounded-xl border border-white/5 leading-normal">
                            * Seluruh perubahan disimpan langsung di browser (Penyimpanan Lokal - localStorage) agar langsung reaktif di halaman depan.
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Inputs frame */}
                      <div className="flex-1 w-full bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-6">
                        
                        {/* 1. Ringkasan */}
                        {subEditor === 'summary' && (
                          <div className="space-y-4">
                            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                              <Sliders className="w-4 h-4 text-brand-cyan" />
                              Edit Ringkasan Profil Ekstrakurikuler
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase">Nama Ekstrakurikuler *</label>
                                <input
                                  type="text"
                                  value={editSummaryName}
                                  onChange={(e) => setEditSummaryName(e.target.value)}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white animate-fade-in"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase">Sekolah *</label>
                                <input
                                  type="text"
                                  value={editSummarySchool}
                                  onChange={(e) => setEditSummarySchool(e.target.value)}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                                />
                              </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase">Tahun Berdiri *</label>
                                <input
                                  type="number"
                                  value={editSummaryFounded}
                                  onChange={(e) => setEditSummaryFounded(parseInt(e.target.value) || 2016)}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase">Slogan / Filosofi *</label>
                                <input
                                  type="text"
                                  value={editSummaryPhilosophy}
                                  onChange={(e) => setEditSummaryPhilosophy(e.target.value)}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase">Nomor Ponsel / WhatsApp (Format: 628...) *</label>
                                <input
                                  type="text"
                                  value={editSummaryWhatsapp}
                                  onChange={(e) => setEditSummaryWhatsapp(e.target.value)}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white font-mono"
                                  placeholder="Contoh: 628123456789"
                                />
                              </div>
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-[10px] text-slate-400 uppercase font-mono">Deskripsi Profil *</label>
                              <textarea
                                value={editSummaryDesc}
                                onChange={(e) => setEditSummaryDesc(e.target.value)}
                                rows={4}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white leading-relaxed font-light"
                              />
                            </div>
                            <div className="space-y-1 font-sans">
                              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Sejarah & Visi Pendiri *</label>
                              <textarea
                                value={editSummaryHistory}
                                onChange={(e) => setEditSummaryHistory(e.target.value)}
                                rows={4}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white leading-relaxed font-light"
                              />
                            </div>
                            <button
                              onClick={handleSaveSummary}
                              className="px-4 py-2.5 bg-brand-cyan hover:bg-brand-cyan/80 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Simpan Ringkasan
                            </button>
                          </div>
                        )}

                        {/* 2. Visi & Misi */}
                        {subEditor === 'visimisi' && (
                          <div className="space-y-6">
                            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                              <Sliders className="w-4 h-4 text-brand-cyan" />
                              Edit Visi & Misi Utama
                            </h4>
                            <div className="space-y-1 font-sans">
                              <label className="text-[10px] text-slate-400 uppercase font-mono">Visi Utama Kami *</label>
                              <textarea
                                value={editVisi}
                                onChange={(e) => setEditVisi(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white leading-relaxed font-light"
                              />
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-white/5 pb-1">
                                <label className="text-[10px] text-slate-400 uppercase font-mono">Daftar Misi Pengembangan</label>
                                <button
                                  onClick={handleAddNewMission}
                                  className="py-1 px-2.5 bg-brand-cyan/20 hover:bg-brand-cyan text-brand-cyan hover:text-white text-[10px] font-mono rounded-md border border-brand-cyan/30 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Plus className="w-3 h-3" /> Tambah Misi
                                </button>
                              </div>

                              <div className="space-y-3">
                                {editMissions.map((mis, index) => (
                                  <div key={mis.id} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3 relative group">
                                    <button
                                      onClick={() => handleRemoveMission(mis.id)}
                                      className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                                      title="Hapus Misi"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="font-mono text-[9px] font-bold text-brand-cyan uppercase">
                                      MISI #{index + 1}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                                      <div className="md:col-span-2 space-y-1">
                                        <label className="text-[9px] text-slate-400 uppercase">Judul Misi *</label>
                                        <input
                                          type="text"
                                          value={mis.title}
                                          onChange={(e) => handleUpdateMissionField(mis.id, 'title', e.target.value)}
                                          className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[9px] text-slate-400 uppercase">Ikon Representasi *</label>
                                        <select
                                          value={mis.icon || 'CheckCircle2'}
                                          onChange={(e) => handleUpdateMissionField(mis.id, 'icon', e.target.value)}
                                          className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                        >
                                          <option value="Binary">Binary Code</option>
                                          <option value="Network">Network / IoT</option>
                                          <option value="CheckCircle2">Check Badge</option>
                                          <option value="ChevronRight">Arrow Speed</option>
                                          <option value="Shield">Shield Protect</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="space-y-1 font-sans">
                                      <label className="text-[9px] text-slate-400 uppercase font-mono">Uraian / Deskripsi Misi *</label>
                                      <textarea
                                        value={mis.desc}
                                        onChange={(e) => handleUpdateMissionField(mis.id, 'desc', e.target.value)}
                                        rows={2}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white font-light leading-normal"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={handleSaveVisiMisi}
                              className="px-4 py-2.5 bg-brand-cyan hover:bg-brand-cyan/80 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Simpan Visi & Misi
                            </button>
                          </div>
                        )}

                        {/* 3. Informasi Headline */}
                        {subEditor === 'information' && (
                          <div className="space-y-4">
                            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                              <Sliders className="w-4 h-4 text-brand-cyan" />
                              Edit Informasi Headline (Pengumuman Utama)
                            </h4>
                            <p className="text-xs text-slate-400 leading-normal font-sans font-light">
                              Teks di bawah akan ditampilkan dalam kotak siaran berkedip neon di bagian atas halaman depan <strong>Papan Informasi (News)</strong> agar siswa cepat menyadari kabar yang super penting. Kosongkan jika ingin menyembunyikannya.
                            </p>
                            <div className="space-y-1 font-sans">
                              <label className="text-[10px] text-slate-400 uppercase font-mono">Isi Siaran Berita Utama (Broadcast Text)</label>
                              <textarea
                                value={editGeneralInfo}
                                onChange={(e) => setEditGeneralInfo(e.target.value)}
                                rows={3}
                                placeholder="Tuliskan materi pengumuman hangat disini atau biarkan kosong..."
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white leading-relaxed font-light"
                              />
                            </div>
                            <button
                              onClick={handleSaveGeneralInfo}
                              className="px-4 py-2.5 bg-brand-cyan hover:bg-brand-cyan/80 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Simpan Headline Informasi
                            </button>
                          </div>
                        )}

                        {/* 4. Pelayanan Publik */}
                        {subEditor === 'services' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-brand-cyan" />
                                Edit Pelayanan Publik (Community Services)
                              </h4>
                              <button
                                onClick={handleAddNewService}
                                className="py-1 px-2.5 bg-brand-cyan/20 hover:bg-brand-cyan text-brand-cyan hover:text-white text-[10px] font-mono rounded-md border border-brand-cyan/30 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" /> Tambah Pelayanan
                              </button>
                            </div>

                            <div className="space-y-4">
                              {editServices.map((srv, index) => (
                                <div key={srv.id} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3 relative group">
                                  <button
                                    onClick={() => handleRemoveService(srv.id)}
                                    className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                                    title="Hapus Layanan"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="font-mono text-[9px] font-bold text-brand-cyan uppercase">
                                    PELAYANAN #{index + 1}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Judul Pelayanan *</label>
                                      <input
                                        type="text"
                                        value={srv.title}
                                        onChange={(e) => handleUpdateServiceField(srv.id, 'title', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white shadow-inner"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Label Badge *</label>
                                      <input
                                        type="text"
                                        value={srv.badge}
                                        onChange={(e) => handleUpdateServiceField(srv.id, 'badge', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Jangka Waktu / Format *</label>
                                      <input
                                        type="text"
                                        value={srv.duration}
                                        onChange={(e) => handleUpdateServiceField(srv.id, 'duration', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1 font-sans">
                                    <label className="text-[9px] text-slate-400 uppercase font-mono">Sifat / Deskripsi Pelayanan *</label>
                                    <textarea
                                      value={srv.description}
                                      onChange={(e) => handleUpdateServiceField(srv.id, 'description', e.target.value)}
                                      rows={2}
                                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white font-light leading-normal"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={handleSaveServices}
                              className="px-4 py-2.5 bg-brand-cyan hover:bg-brand-cyan/80 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Simpan Pelayanan
                            </button>
                          </div>
                        )}

                        {/* 5. Tim Pembina & Mentor */}
                        {subEditor === 'instructors' && (
                          <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-brand-cyan" />
                                Edit Tim Pembina & Mentor Ekstrakurikuler
                              </h4>
                              <button
                                onClick={handleAddNewInstructor}
                                className="py-1 px-2.5 bg-brand-cyan/20 hover:bg-brand-cyan text-brand-cyan hover:text-white text-[10px] font-mono rounded-md border border-brand-cyan/30 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" /> Tambah Mentor
                              </button>
                            </div>

                            <div className="space-y-4">
                              {editInstructors.map((ins, index) => (
                                <div key={ins.id} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3 relative group">
                                  <button
                                    onClick={() => handleRemoveInstructor(ins.id)}
                                    className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                                    title="Hapus Mentor"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="font-mono text-[9px] font-bold text-brand-cyan uppercase">
                                    MENTOR / PEMBINA #{index + 1}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Nama Lengkap & Gelar *</label>
                                      <input
                                        type="text"
                                        value={ins.name}
                                        onChange={(e) => handleUpdateInstructorField(ins.id, 'name', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white shadow-inner"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Jabatan / Peran *</label>
                                      <input
                                        type="text"
                                        value={ins.role}
                                        onChange={(e) => handleUpdateInstructorField(ins.id, 'role', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Spesialisasi & Bidang Ahli *</label>
                                      <input
                                        type="text"
                                        value={ins.specialty}
                                        onChange={(e) => handleUpdateInstructorField(ins.id, 'specialty', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">URL Foto Profil *</label>
                                      <input
                                        type="text"
                                        value={ins.imageUrl}
                                        onChange={(e) => handleUpdateInstructorField(ins.id, 'imageUrl', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white mb-2"
                                        placeholder="Atau tempel URL gambar"
                                      />
                                      <ImageUploader
                                        value={ins.imageUrl}
                                        onChange={(val) => handleUpdateInstructorField(ins.id, 'imageUrl', val)}
                                        label="Ubah/Unggah Foto Mentor"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1 font-sans">
                                    <label className="text-[9px] text-slate-400 uppercase font-mono">Riwayat Singkat / Bio Singkat *</label>
                                    <textarea
                                      value={ins.bio}
                                      onChange={(e) => handleUpdateInstructorField(ins.id, 'bio', e.target.value)}
                                      rows={2}
                                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white font-light leading-normal"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={handleSaveInstructors}
                              className="px-4 py-2.5 bg-brand-cyan hover:bg-brand-cyan/80 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Simpan Tim Pembina & Mentor
                            </button>
                          </div>
                        )}

                        {/* 6. Prestasi Rekor Juara */}
                        {subEditor === 'achievements' && (
                          <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-brand-cyan" />
                                Edit Prestasi & Rekor Juara Ekstrakurikuler
                              </h4>
                              <button
                                onClick={handleAddNewAchievement}
                                className="py-1 px-2.5 bg-brand-cyan/20 hover:bg-brand-cyan text-brand-cyan hover:text-white text-[10px] font-mono rounded-md border border-brand-cyan/30 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" /> Tambah Prestasi
                              </button>
                            </div>

                            <div className="space-y-4">
                              {editAchievements.map((ach, index) => (
                                <div key={ach.id} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3 relative group">
                                  <button
                                    onClick={() => handleRemoveAchievement(ach.id)}
                                    className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                                    title="Hapus Prestasi"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="font-mono text-[9px] font-bold text-brand-cyan uppercase">
                                    PRESTASI KEJUARAAN #{index + 1}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                                    <div className="md:col-span-2 space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Nama Kompetisi / Juara *</label>
                                      <input
                                        type="text"
                                        value={ach.title}
                                        onChange={(e) => handleUpdateAchievementField(ach.id, 'title', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white shadow-inner"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Tahun Perolehan *</label>
                                      <input
                                        type="text"
                                        value={ach.year}
                                        onChange={(e) => handleUpdateAchievementField(ach.id, 'year', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Peringkat / Medali *</label>
                                      <input
                                        type="text"
                                        value={ach.rank}
                                        onChange={(e) => handleUpdateAchievementField(ach.id, 'rank', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] text-slate-400 uppercase">Tingkat Penyelenggaraan *</label>
                                      <select
                                        value={ach.level}
                                        onChange={(e) => handleUpdateAchievementField(ach.id, 'level', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                      >
                                        <option value="Regional">Regional / Provinsi</option>
                                        <option value="Nasional">Nasional / Tingkat RI</option>
                                        <option value="Internasional">Internasional / Global</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="space-y-1 font-sans">
                                    <label className="text-[9px] text-slate-400 uppercase font-mono">Deskripsi Singkat Prestasi *</label>
                                    <textarea
                                      value={ach.description}
                                      onChange={(e) => handleUpdateAchievementField(ach.id, 'description', e.target.value)}
                                      rows={2}
                                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white font-light leading-normal"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={handleSaveAchievements}
                              className="px-4 py-2.5 bg-brand-cyan hover:bg-brand-cyan/80 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Simpan Daftar Prestasi & Rekor
                            </button>
                          </div>
                        )}

                        {/* 7. Kelola Pembelajaran (Materi, Video, Soal CBT) */}
                        {subEditor === 'learning' && (
                          <div className="space-y-6 animate-fade-in">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
                              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-yellow-400" />
                                Kelola Akademi & Materi Pembelajaran
                              </h4>
                              
                              {/* Sub tabs inside Learning Editor */}
                              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setLearningEditorTab('modules')}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${learningEditorTab === 'modules' ? 'bg-yellow-500/20 text-yellow-300' : 'text-slate-400 hover:text-white'}`}
                                >
                                  📚 Modul
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLearningEditorTab('videos')}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${learningEditorTab === 'videos' ? 'bg-yellow-500/20 text-yellow-300' : 'text-slate-400 hover:text-white'}`}
                                >
                                  🎥 Video
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLearningEditorTab('questions')}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${learningEditorTab === 'questions' ? 'bg-yellow-500/20 text-yellow-300' : 'text-slate-400 hover:text-white'}`}
                                >
                                  ✍️ CBT (Soal)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLearningEditorTab('cbt_settings')}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${learningEditorTab === 'cbt_settings' ? 'bg-yellow-500/20 text-yellow-300' : 'text-slate-400 hover:text-white'}`}
                                >
                                  ⚙️ Aturan CBT
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLearningEditorTab('exams')}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${learningEditorTab === 'exams' ? 'bg-yellow-500/20 text-yellow-300' : 'text-slate-400 hover:text-white'}`}
                                >
                                  🏆 Kelola Ujian
                                </button>
                              </div>
                            </div>

                            {/* MODULES SUB-EDITOR */}
                            {learningEditorTab === 'modules' && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <p className="text-[11px] text-slate-400 font-mono">Daftar Modul Pembelajaran ({editModules.length})</p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newMod: Module = {
                                        id: 'mod-' + Date.now(),
                                        title: 'Modul Pembelajaran Baru',
                                        difficulty: 'Pemula',
                                        category: 'Elektronika',
                                        size: '1.5 MB',
                                        pages: 10,
                                        description: 'Deskripsi lengkap modul baru.',
                                        chapters: ['Bab I: Pengenalan'],
                                        pdfSimContent: [{ chapter: 'Bab I: Pengenalan', body: 'Isi bab pengenalan.' }]
                                      };
                                      handleSaveModules([...editModules, newMod]);
                                    }}
                                    className="py-1 px-2.5 bg-yellow-500/20 hover:bg-yellow-500 text-yellow-500 hover:text-slate-950 text-[10px] font-mono rounded-md border border-yellow-500/30 flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <Plus className="w-3 h-3" /> Tambah Modul Baru
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {editModules.map((mod, idx) => (
                                    <div key={mod.id} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3 relative group">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          confirmAction({
                                            title: 'Hapus Modul Pembelajaran',
                                            message: `Apakah Anda yakin ingin menghapus modul "${mod.title}" secara permanen?`,
                                            onConfirm: () => {
                                              handleSaveModules(editModules.filter(m => m.id !== mod.id));
                                            },
                                            confirmText: 'Ya, Hapus',
                                            type: 'danger'
                                          });
                                        }}
                                        className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                                        title="Hapus Modul"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>

                                      <div className="font-mono text-[9px] font-bold text-yellow-400 uppercase">
                                        MODUL PEMBELAJARAN #{idx + 1}
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                                        <div className="space-y-1">
                                          <label className="text-[9px] text-slate-400 uppercase">Judul Modul *</label>
                                          <input
                                            type="text"
                                            value={mod.title}
                                            onChange={(e) => {
                                              const updated = [...editModules];
                                              updated[idx] = { ...mod, title: e.target.value };
                                              setEditModules(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                          />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="space-y-1">
                                            <label className="text-[9px] text-slate-400 uppercase">Kategori *</label>
                                            <input
                                              type="text"
                                              value={mod.category}
                                              onChange={(e) => {
                                                const updated = [...editModules];
                                                updated[idx] = { ...mod, category: e.target.value };
                                                setEditModules(updated);
                                              }}
                                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[9px] text-slate-400 uppercase">Kesulitan *</label>
                                            <select
                                              value={mod.difficulty}
                                              onChange={(e) => {
                                                const updated = [...editModules];
                                                updated[idx] = { ...mod, difficulty: e.target.value as any };
                                                setEditModules(updated);
                                              }}
                                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                            >
                                              <option value="Pemula">Pemula</option>
                                              <option value="Menengah">Menengah</option>
                                              <option value="Mahir">Mahir</option>
                                            </select>
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[9px] text-slate-400 uppercase">Ukuran *</label>
                                            <input
                                              type="text"
                                              value={mod.size}
                                              onChange={(e) => {
                                                const updated = [...editModules];
                                                updated[idx] = { ...mod, size: e.target.value };
                                                setEditModules(updated);
                                              }}
                                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="space-y-1 font-sans">
                                        <label className="text-[9px] text-slate-400 uppercase font-mono">Deskripsi Singkat *</label>
                                        <textarea
                                          value={mod.description}
                                          onChange={(e) => {
                                            const updated = [...editModules];
                                            updated[idx] = { ...mod, description: e.target.value };
                                            setEditModules(updated);
                                          }}
                                          rows={2}
                                          className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white leading-normal"
                                        />
                                      </div>

                                      {/* Status Aktif & Unggah PDF berkas Grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                                        {/* Toggle Aktif/Nonaktif */}
                                        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/5 font-mono flex items-center justify-between gap-2">
                                          <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Status Tampilan Modul</span>
                                            <span className="text-[9px] text-slate-400">Aktifkan agar modul dapat dibaca siswa</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold ${mod.isActive !== false ? 'text-green-400' : 'text-slate-500'}`}>
                                              {mod.isActive !== false ? 'AKTIF' : 'NONAKTIF'}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const updated = [...editModules];
                                                updated[idx] = { ...mod, isActive: mod.isActive === false ? true : false };
                                                setEditModules(updated);
                                              }}
                                              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${mod.isActive !== false ? 'bg-yellow-500' : 'bg-slate-800'}`}
                                            >
                                              <span
                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${mod.isActive !== false ? 'translate-x-5' : 'translate-x-0'}`}
                                              />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Upload PDF */}
                                        <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-2 font-mono">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Berkas PDF Kurikulum</span>
                                            {mod.pdfFileName && <span className="text-[8px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-bold">TERUNGGAH</span>}
                                          </div>
                                          
                                          {mod.pdfFileName ? (
                                            <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-white/5 text-xs">
                                              <div className="flex items-center gap-2 truncate pr-1">
                                                <span className="text-red-500 font-bold text-[10px] bg-red-500/10 px-1.5 py-0.5 rounded">PDF</span>
                                                <span className="truncate max-w-[120px] text-slate-300 text-[10px]" title={mod.pdfFileName}>{mod.pdfFileName}</span>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const updated = [...editModules];
                                                  updated[idx] = { ...mod, pdfFileName: undefined };
                                                  setEditModules(updated);
                                                }}
                                                className="text-red-400 hover:text-red-300 font-bold text-[9px] bg-transparent border-0 cursor-pointer px-1 py-0.5"
                                              >
                                                Hapus
                                              </button>
                                            </div>
                                          ) : (
                                            <div 
                                              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                              onDrop={(e) => {
                                                e.preventDefault(); e.stopPropagation();
                                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                  const file = e.dataTransfer.files[0];
                                                  const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                                                  const updated = [...editModules];
                                                  updated[idx] = { ...mod, pdfFileName: file.name, size: sizeStr };
                                                  setEditModules(updated);
                                                  triggerFeedback(`Berkas ${file.name} berhasil diunggah!`);
                                                }
                                              }}
                                              onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = '.pdf';
                                                input.onchange = (e: any) => {
                                                  if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                                                    const updated = [...editModules];
                                                    updated[idx] = { ...mod, pdfFileName: file.name, size: sizeStr };
                                                    setEditModules(updated);
                                                    triggerFeedback(`Berkas ${file.name} berhasil diunggah!`);
                                                  }
                                                };
                                                input.click();
                                              }}
                                              className="border border-dashed border-white/10 hover:border-yellow-500/50 bg-slate-950 p-2 text-center cursor-pointer transition-all rounded-lg space-y-0.5"
                                            >
                                              <div className="text-slate-400 text-[10px]">
                                                Tarik & taruh berkas PDF, atau <span className="text-yellow-400 font-bold hover:underline">klik unggah</span>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Chapter Contents (Body) */}
                                      <div className="space-y-2 pt-2 border-t border-white/5 font-sans">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Daftar Bab & Konten ({mod.pdfSimContent.length})</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = [...editModules];
                                              const currentMod = { ...mod };
                                              const babNum = currentMod.pdfSimContent.length + 1;
                                              const babTitle = `Bab ${babNum}: Bab Baru`;
                                              currentMod.chapters = [...currentMod.chapters, babTitle];
                                              currentMod.pdfSimContent = [...currentMod.pdfSimContent, { chapter: babTitle, body: 'Ketik isi materi bab baru di sini...' }];
                                              currentMod.pages = currentMod.pdfSimContent.length * 6; // Auto pages approximation
                                              updated[idx] = currentMod;
                                              setEditModules(updated);
                                            }}
                                            className="text-[9px] font-mono text-yellow-400 hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                                          >
                                            + Tambah Bab
                                          </button>
                                        </div>

                                        <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-white/5 max-h-[220px] overflow-y-auto">
                                          {mod.pdfSimContent.map((chapterContent, cIdx) => (
                                            <div key={cIdx} className="p-2 bg-slate-950 rounded-lg border border-white/5 space-y-1.5 relative">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const updated = [...editModules];
                                                  const currentMod = { ...mod };
                                                  const chaps = [...currentMod.chapters];
                                                  const contents = [...currentMod.pdfSimContent];
                                                  chaps.splice(cIdx, 1);
                                                  contents.splice(cIdx, 1);
                                                  currentMod.chapters = chaps;
                                                  currentMod.pdfSimContent = contents;
                                                  currentMod.pages = contents.length * 6;
                                                  updated[idx] = currentMod;
                                                  setEditModules(updated);
                                                }}
                                                className="absolute top-2 right-2 text-slate-500 hover:text-red-400 text-[10px] cursor-pointer"
                                                title="Hapus Bab"
                                              >
                                                ✕
                                              </button>
                                              <input
                                                type="text"
                                                value={chapterContent.chapter}
                                                onChange={(e) => {
                                                  const updated = [...editModules];
                                                  const currentMod = { ...mod };
                                                  const chaps = [...currentMod.chapters];
                                                  const contents = currentMod.pdfSimContent.map((item, idxx) => 
                                                    idxx === cIdx ? { ...item, chapter: e.target.value } : item
                                                  );
                                                  chaps[cIdx] = e.target.value;
                                                  currentMod.chapters = chaps;
                                                  currentMod.pdfSimContent = contents;
                                                  updated[idx] = currentMod;
                                                  setEditModules(updated);
                                                }}
                                                className="w-3/4 bg-slate-900 border border-white/5 rounded px-2 py-0.5 text-[11px] font-mono font-bold text-yellow-300"
                                              />
                                              <textarea
                                                value={chapterContent.body}
                                                onChange={(e) => {
                                                  const updated = [...editModules];
                                                  const currentMod = { ...mod };
                                                  const contents = currentMod.pdfSimContent.map((item, idxx) => 
                                                    idxx === cIdx ? { ...item, body: e.target.value } : item
                                                  );
                                                  currentMod.pdfSimContent = contents;
                                                  updated[idx] = currentMod;
                                                  setEditModules(updated);
                                                }}
                                                rows={3}
                                                className="w-full bg-slate-900 border border-white/5 rounded px-2 py-1 text-xs text-slate-300 leading-normal"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center justify-end pt-4 border-t border-white/5">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveModules(editModules)}
                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10"
                                  >
                                    <Save className="w-4 h-4" /> Simpan Perubahan Modul
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* VIDEOS SUB-EDITOR */}
                            {learningEditorTab === 'videos' && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <p className="text-[11px] text-slate-400 font-mono">Daftar Video Media Pembelajaran ({editVideos.length})</p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newVid: LearningVideo = {
                                        id: 'vid-' + Date.now(),
                                        title: 'Video Baru Akademi Robotika',
                                        duration: '10 Mnt 00 Detik',
                                        category: 'Logika & Koding',
                                        narrator: 'Nama Mentor / Pengisi Suara',
                                        description: 'Deskripsi video baru.',
                                        youtubeId: '',
                                        chapters: [{ time: '00:00', title: 'Pendahuluan' }],
                                        difficulty: 'Pemula'
                                      };
                                      handleSaveVideos([...editVideos, newVid]);
                                    }}
                                    className="py-1 px-2.5 bg-yellow-500/20 hover:bg-yellow-500 text-yellow-500 hover:text-slate-950 text-[10px] font-mono rounded-md border border-yellow-500/30 flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <Plus className="w-3 h-3" /> Tambah Video Baru
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {editVideos.map((vid, idx) => (
                                    <div key={vid.id} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3 relative group">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          confirmAction({
                                            title: 'Hapus Video Pembelajaran',
                                            message: `Apakah Anda yakin ingin menghapus video "${vid.title}" secara permanen?`,
                                            onConfirm: () => {
                                              handleSaveVideos(editVideos.filter(v => v.id !== vid.id));
                                            },
                                            confirmText: 'Ya, Hapus',
                                            type: 'danger'
                                          });
                                        }}
                                        className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                                        title="Hapus Video"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>

                                      <div className="font-mono text-[9px] font-bold text-yellow-400 uppercase">
                                        VIDEO MEDIA #{idx + 1}
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                                        <div className="space-y-1">
                                          <label className="text-[9px] text-slate-400 uppercase">Judul Video *</label>
                                          <input
                                            type="text"
                                            value={vid.title}
                                            onChange={(e) => {
                                              const updated = [...editVideos];
                                              updated[idx] = { ...vid, title: e.target.value };
                                              setEditVideos(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                          />
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                          <div className="space-y-1">
                                            <label className="text-[9px] text-slate-400 uppercase">Kategori *</label>
                                            <input
                                              type="text"
                                              value={vid.category}
                                              onChange={(e) => {
                                                const updated = [...editVideos];
                                                updated[idx] = { ...vid, category: e.target.value };
                                                setEditVideos(updated);
                                              }}
                                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[9px] text-slate-400 uppercase">Narator *</label>
                                            <input
                                              type="text"
                                              value={vid.narrator}
                                              onChange={(e) => {
                                                const updated = [...editVideos];
                                                updated[idx] = { ...vid, narrator: e.target.value };
                                                setEditVideos(updated);
                                              }}
                                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[9px] text-slate-400 uppercase">Durasi *</label>
                                            <input
                                              type="text"
                                              value={vid.duration}
                                              onChange={(e) => {
                                                const updated = [...editVideos];
                                                updated[idx] = { ...vid, duration: e.target.value };
                                                setEditVideos(updated);
                                              }}
                                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[9px] text-slate-400 uppercase">Kesulitan *</label>
                                            <select
                                              value={vid.difficulty || 'Pemula'}
                                              onChange={(e) => {
                                                const updated = [...editVideos];
                                                updated[idx] = { ...vid, difficulty: e.target.value as any };
                                                setEditVideos(updated);
                                              }}
                                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan"
                                            >
                                              <option value="Pemula">Pemula</option>
                                              <option value="Menengah">Menengah</option>
                                              <option value="Mahir">Mahir</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                                        <div className="md:col-span-2 space-y-1">
                                          <label className="text-[9px] text-slate-400 uppercase font-mono">ID Video YouTube (Opsional - Contoh: dQw4w9WgXcQ) *</label>
                                          <input
                                            type="text"
                                            value={vid.youtubeId || ''}
                                            onChange={(e) => {
                                              const updated = [...editVideos];
                                              updated[idx] = { ...vid, youtubeId: e.target.value };
                                              setEditVideos(updated);
                                            }}
                                            placeholder="Kosongkan jika menggunakan pemutar video simulasi"
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                          />
                                        </div>
                                        <div className="space-y-1 font-sans">
                                          <label className="text-[9px] text-slate-400 uppercase font-mono">Deskripsi Video *</label>
                                          <input
                                            type="text"
                                            value={vid.description}
                                            onChange={(e) => {
                                              const updated = [...editVideos];
                                              updated[idx] = { ...vid, description: e.target.value };
                                              setEditVideos(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                          />
                                        </div>
                                      </div>

                                      {/* Status Aktif & Unggah Video Berkas Grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                                        {/* Toggle Aktif/Nonaktif */}
                                        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/5 font-mono flex items-center justify-between gap-2">
                                          <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Status Tampilan Video</span>
                                            <span className="text-[9px] text-slate-400">Aktifkan agar video dapat ditonton siswa</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold ${vid.isActive !== false ? 'text-green-400' : 'text-slate-500'}`}>
                                              {vid.isActive !== false ? 'AKTIF' : 'NONAKTIF'}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const updated = [...editVideos];
                                                updated[idx] = { ...vid, isActive: vid.isActive === false ? true : false };
                                                setEditVideos(updated);
                                              }}
                                              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${vid.isActive !== false ? 'bg-yellow-500' : 'bg-slate-800'}`}
                                            >
                                              <span
                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${vid.isActive !== false ? 'translate-x-5' : 'translate-x-0'}`}
                                              />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Upload Video File */}
                                        <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-2 font-mono">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Berkas Video Mandiri (.mp4/.webm)</span>
                                            {vid.videoFileName && <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-bold">TERUNGGAH</span>}
                                          </div>
                                          
                                          {vid.videoFileName ? (
                                            <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-white/5 text-xs">
                                              <div className="flex items-center gap-2 truncate pr-1">
                                                <span className="text-cyan-400 font-bold text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded">VID</span>
                                                <span className="truncate max-w-[120px] text-slate-300 text-[10px]" title={vid.videoFileName}>{vid.videoFileName}</span>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const updated = [...editVideos];
                                                  updated[idx] = { ...vid, videoFileName: undefined, localVideoUrl: undefined };
                                                  setEditVideos(updated);
                                                }}
                                                className="text-red-400 hover:text-red-300 font-bold text-[9px] bg-transparent border-0 cursor-pointer px-1 py-0.5"
                                              >
                                                Hapus
                                              </button>
                                            </div>
                                          ) : (
                                            <div 
                                              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                              onDrop={(e) => {
                                                e.preventDefault(); e.stopPropagation();
                                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                  const file = e.dataTransfer.files[0];
                                                  const fileUrl = URL.createObjectURL(file);
                                                  const updated = [...editVideos];
                                                  updated[idx] = { ...vid, videoFileName: file.name, localVideoUrl: fileUrl };
                                                  setEditVideos(updated);
                                                  triggerFeedback(`Berkas Video ${file.name} berhasil diunggah!`);
                                                }
                                              }}
                                              onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'video/*';
                                                input.onchange = (e: any) => {
                                                  if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    const fileUrl = URL.createObjectURL(file);
                                                    const updated = [...editVideos];
                                                    updated[idx] = { ...vid, videoFileName: file.name, localVideoUrl: fileUrl };
                                                    setEditVideos(updated);
                                                    triggerFeedback(`Berkas Video ${file.name} berhasil diunggah!`);
                                                  }
                                                };
                                                input.click();
                                              }}
                                              className="border border-dashed border-white/10 hover:border-cyan-500/50 bg-slate-950 p-2 text-center cursor-pointer transition-all rounded-lg space-y-0.5"
                                            >
                                              <div className="text-slate-400 text-[10px]">
                                                Tarik & taruh berkas video, atau <span className="text-cyan-400 font-bold hover:underline">klik unggah</span>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Chapter Contents (Timestamps) */}
                                      <div className="space-y-2 pt-2 border-t border-white/5 font-mono">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[9px] font-bold text-slate-400 uppercase">Daftar Bab & Penanda Waktu ({vid.chapters.length})</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = [...editVideos];
                                              const currentVid = { ...vid };
                                              currentVid.chapters = [...currentVid.chapters, { time: '02:00', title: 'Segmen Baru' }];
                                              updated[idx] = currentVid;
                                              setEditVideos(updated);
                                            }}
                                            className="text-[9px] text-yellow-400 hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                                          >
                                            + Tambah Bab Durasi
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/60 p-3 rounded-xl border border-white/5 max-h-[160px] overflow-y-auto">
                                          {vid.chapters.map((ch, cIdx) => (
                                            <div key={cIdx} className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-lg border border-white/5">
                                              <input
                                                type="text"
                                                value={ch.time}
                                                onChange={(e) => {
                                                  const updated = [...editVideos];
                                                  const currentVid = { ...vid };
                                                  currentVid.chapters = currentVid.chapters.map((item, idxx) => 
                                                    idxx === cIdx ? { ...item, time: e.target.value } : item
                                                  );
                                                  updated[idx] = currentVid;
                                                  setEditVideos(updated);
                                                }}
                                                className="w-16 bg-slate-900 border border-white/5 rounded px-2 py-0.5 text-[11px] font-bold text-[#a855f7] text-center"
                                                placeholder="MM:SS"
                                              />
                                              <input
                                                type="text"
                                                value={ch.title}
                                                onChange={(e) => {
                                                  const updated = [...editVideos];
                                                  const currentVid = { ...vid };
                                                  currentVid.chapters = currentVid.chapters.map((item, idxx) => 
                                                    idxx === cIdx ? { ...item, title: e.target.value } : item
                                                  );
                                                  updated[idx] = currentVid;
                                                  setEditVideos(updated);
                                                }}
                                                className="flex-1 bg-slate-900 border border-white/5 rounded px-2 py-0.5 text-xs text-slate-300"
                                                placeholder="Judul Segmen"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const updated = [...editVideos];
                                                  const currentVid = { ...vid };
                                                  const chaps = [...currentVid.chapters];
                                                  chaps.splice(cIdx, 1);
                                                  currentVid.chapters = chaps;
                                                  updated[idx] = currentVid;
                                                  setEditVideos(updated);
                                                }}
                                                className="text-slate-500 hover:text-red-400 text-xs border-0 bg-transparent px-1 cursor-pointer"
                                              >
                                                ✕
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center justify-end pt-4 border-t border-white/5">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveVideos(editVideos)}
                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10"
                                  >
                                    <Save className="w-4 h-4" /> Simpan Perubahan Video
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* QUESTIONS SUB-EDITOR */}
                            {learningEditorTab === 'questions' && (
                              <div className="space-y-4">
                                {/* Exam dropdown selector */}
                                <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                  <div className="space-y-0.5">
                                    <p className="text-xs text-white font-bold font-sans flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                      Pilih Paket Ujian untuk Mengedit Soal:
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-mono">Soal-soal yang diedit di bawah ini akan tersimpan khusus ke paket ujian terpilih.</p>
                                  </div>
                                  <select
                                    value={selectedExamForEditing?.id || ''}
                                    onChange={(e) => {
                                      const found = editExams.find(ex => ex.id === e.target.value);
                                      if (found) {
                                        setSelectedExamForEditing(found);
                                        setEditQuestions(found.questions || []);
                                      }
                                    }}
                                    className="bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white font-mono font-bold w-full sm:w-auto min-w-[200px]"
                                  >
                                    {editExams.map((exam) => (
                                      <option key={exam.id} value={exam.id}>{exam.title} ({(exam.questions || []).length} Soal)</option>
                                    ))}
                                  </select>
                                </div>

                                {selectedExamForEditing ? (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <p className="text-[11px] text-yellow-400 font-mono font-bold uppercase">
                                        SOAL UJIAN UNTUK: {selectedExamForEditing.title} ({editQuestions.length} Soal)
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextId = editQuestions.reduce((acc, curr) => Math.max(acc, curr.id), 0) + 1;
                                          const newQuest: Question = {
                                            id: nextId,
                                            text: 'Tulis pertanyaan baru Anda di sini?',
                                            options: [
                                              'Pilihan Jawaban A',
                                              'Pilihan Jawaban B',
                                              'Pilihan Jawaban C',
                                              'Pilihan Jawaban D'
                                            ],
                                            correctAnswer: 0,
                                            explanation: 'Tulis penjelasan kunci jawaban di sini.'
                                          };
                                          handleUpdateQuestionsForSelectedExam([...editQuestions, newQuest]);
                                        }}
                                        className="py-1 px-2.5 bg-yellow-500/20 hover:bg-yellow-500 text-yellow-500 hover:text-slate-950 text-[10px] font-mono rounded-md border border-yellow-500/30 flex items-center gap-1 cursor-pointer transition-all"
                                      >
                                        <Plus className="w-3 h-3" /> Tambah Soal Baru
                                      </button>
                                    </div>

                                    <div className="space-y-4">
                                      {editQuestions.map((quest, idx) => (
                                        <div key={quest.id} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3 relative group">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              confirmAction({
                                                title: 'Hapus Soal Evaluasi',
                                                message: `Apakah Anda yakin ingin menghapus Soal #${idx + 1} secara permanen?`,
                                                onConfirm: () => {
                                                  handleUpdateQuestionsForSelectedExam(editQuestions.filter(q => q.id !== quest.id));
                                                },
                                                confirmText: 'Ya, Hapus',
                                                type: 'danger'
                                              });
                                            }}
                                            className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                                            title="Hapus Soal"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>

                                          <div className="font-mono text-[9px] font-bold text-yellow-400 uppercase">
                                            SOAL EVALUASI #{idx + 1} (ID: {quest.id})
                                          </div>

                                          <div className="space-y-1">
                                            <label className="text-[9px] text-slate-400 uppercase font-mono">Pertanyaan Soal *</label>
                                            <textarea
                                              value={quest.text}
                                              onChange={(e) => {
                                                const updated = [...editQuestions];
                                                updated[idx] = { ...quest, text: e.target.value };
                                                setEditQuestions(updated);
                                              }}
                                              rows={2}
                                              className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white leading-relaxed"
                                            />
                                          </div>

                                          {/* Options list */}
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans">
                                            {quest.options.map((opt, oIdx) => (
                                              <div key={oIdx} className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-xl border border-white/5">
                                                <span className="text-[10px] font-mono font-bold w-6 h-6 rounded bg-slate-950 flex items-center justify-center border border-white/5 text-yellow-400">
                                                  {String.fromCharCode(65 + oIdx)}
                                                </span>
                                                <input
                                                  type="text"
                                                  value={opt || ''}
                                                  onChange={(e) => {
                                                    const updated = [...editQuestions];
                                                    const currentQuest = { ...quest };
                                                    const opts = [...currentQuest.options];
                                                    opts[oIdx] = e.target.value;
                                                    currentQuest.options = opts;
                                                    updated[idx] = currentQuest;
                                                    setEditQuestions(updated);
                                                  }}
                                                  className="flex-1 bg-slate-950 border border-white/5 rounded-lg py-1 px-2.5 text-xs text-white"
                                                />
                                              </div>
                                            ))}
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                                            <div className="space-y-1">
                                              <label className="text-[9px] text-slate-400 uppercase">Jawaban Benar *</label>
                                              <select
                                                value={quest.correctAnswer}
                                                onChange={(e) => {
                                                  const updated = [...editQuestions];
                                                  updated[idx] = { ...quest, correctAnswer: parseInt(e.target.value) || 0 };
                                                  setEditQuestions(updated);
                                                }}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                              >
                                                <option value={0}>Pilihan A</option>
                                                <option value={1}>Pilihan B</option>
                                                <option value={2}>Pilihan C</option>
                                                <option value={3}>Pilihan D</option>
                                              </select>
                                            </div>
                                            <div className="sm:col-span-2 space-y-1 font-sans">
                                              <label className="text-[9px] text-slate-400 uppercase font-mono">Penjelasan Jawaban *</label>
                                              <input
                                                type="text"
                                                value={quest.explanation}
                                                onChange={(e) => {
                                                  const updated = [...editQuestions];
                                                  updated[idx] = { ...quest, explanation: e.target.value };
                                                  setEditQuestions(updated);
                                                }}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white font-light"
                                              />
                                            </div>
                                          </div>

                                        </div>
                                      ))}
                                    </div>

                                    <div className="flex items-center justify-end pt-4 border-t border-white/5">
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateQuestionsForSelectedExam(editQuestions)}
                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10"
                                      >
                                        <Save className="w-4 h-4" /> Simpan Perubahan Soal
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="p-8 text-center bg-slate-900/30 rounded-xl border border-white/5">
                                    <p className="text-xs text-slate-400 font-mono">Tidak ada paket ujian yang terpilih.</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* EXAMS SUB-EDITOR (KELOLA DAFTAR UJIAN) */}
                            {learningEditorTab === 'exams' && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <p className="text-xs text-white font-bold">Daftar Paket Ujian CBT ({editExams.length})</p>
                                    <p className="text-[10px] text-slate-400 font-mono">Kelola konfigurasi, durasi, dan KKM tiap paket ujian.</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextId = `exam-${Date.now()}`;
                                      const newExam: Exam = {
                                        id: nextId,
                                        title: 'Paket Soal Ujian Baru',
                                        duration: 15,
                                        passingGrade: 75,
                                        isActive: true,
                                        difficulty: 'Pemula',
                                        questions: [
                                          {
                                            id: 1,
                                            text: 'Contoh Soal Pertama?',
                                            options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
                                            correctAnswer: 0,
                                            explanation: 'Keterangan pembahasan.'
                                          }
                                        ]
                                      };
                                      const updatedList = [...editExams, newExam];
                                      handleSaveExams(updatedList);
                                      setSelectedExamForEditing(newExam);
                                    }}
                                    className="py-1 px-2.5 bg-yellow-500/20 hover:bg-yellow-500 text-yellow-500 hover:text-slate-950 text-[10px] font-mono rounded-md border border-yellow-500/30 flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <Plus className="w-3 h-3" /> Tambah Ujian Baru
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {editExams.map((exam, idx) => (
                                    <div key={exam.id} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-4 relative group">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (editExams.length <= 1) {
                                            onAddToast?.('Minimal harus ada 1 paket ujian CBT yang terdaftar.', 'error');
                                            return;
                                          }
                                          confirmAction({
                                            title: 'Hapus Paket Ujian',
                                            message: `Apakah Anda yakin ingin menghapus Paket Ujian "${exam.title}"?`,
                                            onConfirm: () => {
                                              const updatedList = editExams.filter(e => e.id !== exam.id);
                                              handleSaveExams(updatedList);
                                              if (selectedExamForEditing?.id === exam.id) {
                                                setSelectedExamForEditing(updatedList[0]);
                                              }
                                            },
                                            confirmText: 'Ya, Hapus',
                                            type: 'danger'
                                          });
                                        }}
                                        className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                                        title="Hapus Ujian"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>

                                      <div className="font-mono text-[9px] font-bold text-yellow-400 uppercase">
                                        PAKET UJIAN #{idx + 1} (ID: {exam.id})
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-4 space-y-1">
                                          <label className="text-[9px] text-slate-400 uppercase font-mono">Judul Ujian *</label>
                                          <input
                                            type="text"
                                            value={exam.title}
                                            onChange={(e) => {
                                              const updated = [...editExams];
                                              updated[idx] = { ...exam, title: e.target.value };
                                              handleSaveExams(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white"
                                          />
                                        </div>

                                        <div className="md:col-span-2 space-y-1">
                                          <label className="text-[9px] text-slate-400 uppercase font-mono">Kesulitan *</label>
                                          <select
                                            value={exam.difficulty || 'Pemula'}
                                            onChange={(e) => {
                                              const updated = [...editExams];
                                              updated[idx] = { ...exam, difficulty: e.target.value as any };
                                              handleSaveExams(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan font-sans"
                                          >
                                            <option value="Pemula">Pemula</option>
                                            <option value="Menengah">Menengah</option>
                                            <option value="Mahir">Mahir</option>
                                          </select>
                                        </div>

                                        <div className="md:col-span-2 space-y-1">
                                          <label className="text-[9px] text-slate-400 uppercase font-mono">Durasi (Menit) *</label>
                                          <input
                                            type="number"
                                            value={exam.duration}
                                            onChange={(e) => {
                                              const updated = [...editExams];
                                              updated[idx] = { ...exam, duration: parseInt(e.target.value) || 10 };
                                              handleSaveExams(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white font-mono"
                                          />
                                        </div>

                                        <div className="md:col-span-2 space-y-1">
                                          <label className="text-[9px] text-slate-400 uppercase font-mono">Batas KKM (%) *</label>
                                          <input
                                            type="number"
                                            value={exam.passingGrade}
                                            onChange={(e) => {
                                              const updated = [...editExams];
                                              updated[idx] = { ...exam, passingGrade: parseInt(e.target.value) || 70 };
                                              handleSaveExams(updated);
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-2.5 text-xs text-white font-mono"
                                          />
                                        </div>

                                        <div className="md:col-span-2 flex flex-col justify-end">
                                          <span className="text-[9px] text-slate-400 uppercase font-mono mb-2">Status Aktif</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = [...editExams];
                                              updated[idx] = { ...exam, isActive: !exam.isActive };
                                              handleSaveExams(updated);
                                            }}
                                            className={`py-1.5 px-3 rounded-lg text-xs font-bold font-mono border transition-all cursor-pointer text-center ${exam.isActive !== false ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'}`}
                                          >
                                            {exam.isActive !== false ? '✓ AKTIF' : 'NON-AKTIF'}
                                          </button>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/40 p-2 px-3 rounded-lg border border-white/5">
                                        <span>Jumlah Soal terdaftar: <strong className="text-yellow-400">{(exam.questions || []).length} Soal</strong></span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedExamForEditing(exam);
                                            setEditQuestions(exam.questions || []);
                                            setLearningEditorTab('questions');
                                          }}
                                          className="text-yellow-400 hover:text-yellow-300 font-bold hover:underline cursor-pointer"
                                        >
                                          Kelola Soal Ujian ini →
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* CBT SETTINGS SUB-EDITOR */}
                            {learningEditorTab === 'cbt_settings' && (
                              <div className="space-y-6 animate-fade-in">
                                <div className="border-b border-white/5 pb-2">
                                  <p className="text-[11px] text-slate-400 font-mono">Konfigurasi Aturan & Sesi Ujian CBT</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Durasi Ujian */}
                                  <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-2 font-mono">
                                    <label className="text-[10px] font-bold text-white uppercase tracking-wider block">Batas Waktu Ujian (Menit) *</label>
                                    <p className="text-[9px] text-slate-500 leading-normal mb-1">Tentukan durasi pengerjaan tes dalam hitungan menit.</p>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        min={1}
                                        max={300}
                                        value={editCbtSettings.duration}
                                        onChange={(e) => setEditCbtSettings({ ...editCbtSettings, duration: Math.max(1, parseInt(e.target.value) || 1) })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-3 text-xs text-white"
                                      />
                                      <span className="text-xs text-slate-400 font-bold">Menit</span>
                                    </div>
                                  </div>

                                  {/* KKM Nilai Kelulusan */}
                                  <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-2 font-mono">
                                    <label className="text-[10px] font-bold text-white uppercase tracking-wider block">Ambang Batas Kelulusan (%) *</label>
                                    <p className="text-[9px] text-slate-500 leading-normal mb-1">Skor minimum untuk dinyatakan lulus standar kelayakan.</p>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        min={10}
                                        max={100}
                                        value={editCbtSettings.passingGrade}
                                        onChange={(e) => setEditCbtSettings({ ...editCbtSettings, passingGrade: Math.min(100, Math.max(10, parseInt(e.target.value) || 70)) })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-1.5 px-3 text-xs text-white"
                                      />
                                      <span className="text-xs text-slate-400 font-bold">%</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Toggle Status Akses Ujian CBT */}
                                  <div className="p-4 bg-slate-950 rounded-xl border border-white/5 font-mono flex items-center justify-between gap-4">
                                    <div className="flex flex-col space-y-1">
                                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Status Akses Ujian CBT</span>
                                      <span className="text-[9px] text-slate-400 leading-relaxed">
                                        Tutup untuk menyembunyikan ujian atau buka untuk mengizinkan siswa mengerjakan tes.
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[10px] font-bold ${editCbtSettings.examActive ? 'text-green-400' : 'text-red-400'}`}>
                                        {editCbtSettings.examActive ? 'BUKA' : 'TUTUP'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setEditCbtSettings({ ...editCbtSettings, examActive: !editCbtSettings.examActive })}
                                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editCbtSettings.examActive ? 'bg-yellow-500' : 'bg-slate-800'}`}
                                      >
                                        <span
                                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${editCbtSettings.examActive ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Reset History Ujian Siswa */}
                                  <div className="p-4 bg-slate-950 rounded-xl border border-white/5 font-mono flex flex-col justify-between gap-3">
                                    <div className="flex flex-col space-y-1">
                                      <span className="text-[10px] font-bold text-white uppercase tracking-wider text-red-400">Reset Riwayat Ujian</span>
                                      <span className="text-[9px] text-slate-500 leading-normal">
                                        Menghapus permanen seluruh log hasil dan nilai CBT yang tersimpan pada pangkalan data simulasi.
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        confirmAction({
                                          title: '⚠️ Reset Riwayat Ujian CBT',
                                          message: 'Seluruh riwayat hasil ujian CBT siswa akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan?',
                                          onConfirm: () => {
                                            localStorage.removeItem('robo_cbt_history');
                                            window.dispatchEvent(new Event('robo_cbt_history_reset'));
                                            triggerFeedback("Seluruh riwayat hasil ujian CBT berhasil dibersihkan!", "success");
                                          },
                                          confirmText: 'Ya, Reset Sekarang',
                                          type: 'danger'
                                        });
                                      }}
                                      className="py-1.5 px-3 bg-red-950/40 hover:bg-red-900 border border-red-500/20 text-red-400 hover:text-white rounded-lg transition-colors text-xs font-bold text-center cursor-pointer"
                                    >
                                      Reset Riwayat CBT Sekarang
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-end pt-4 border-t border-white/5">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveCbtSettings(editCbtSettings)}
                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10"
                                  >
                                    <Save className="w-4 h-4" /> Simpan Pengaturan CBT
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* 8. Desain & Background */}
                        {subEditor === 'theme' && (
                          <div className="space-y-6 animate-fade-in font-sans">
                            <div className="border-b border-white/5 pb-3">
                              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Palette className="w-4 h-4 text-brand-cyan animate-pulse" />
                                Pengaturan Desain, Warna, & Gambar Latar
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-1">
                                Kustomisasi nuansa visual portal resmi AEROB secara langsung dan realtime.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Background Image Settings */}
                              <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-4">
                                <h5 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                                  <Image className="w-3.5 h-3.5 text-brand-cyan" />
                                  1. Gambar Latar Web (Background)
                                </h5>

                                <div className="space-y-3">
                                  <label className="text-[10px] font-mono text-slate-400 uppercase">Pilih Preset Gambar Latar</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setBgChoice('default-robot');
                                        triggerFeedback('Preset robot terpilih!', 'info');
                                      }}
                                      className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold text-left transition-all cursor-pointer ${bgChoice === 'default-robot' ? 'bg-brand-cyan/15 border-brand-cyan text-brand-sky shadow-md' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
                                    >
                                      🤖 Robot & Logo (Default)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setBgChoice('blue-grid');
                                        triggerFeedback('Preset cyber grid terpilih!', 'info');
                                      }}
                                      className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold text-left transition-all cursor-pointer ${bgChoice === 'blue-grid' ? 'bg-brand-cyan/15 border-brand-cyan text-brand-sky shadow-md' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
                                    >
                                      🔌 Cyber Circuit Grid
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setBgChoice('none');
                                        triggerFeedback('Tanpa gambar latar, gradien murni!', 'info');
                                      }}
                                      className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold text-left transition-all cursor-pointer ${bgChoice === 'none' ? 'bg-brand-cyan/15 border-brand-cyan text-brand-sky shadow-md' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
                                    >
                                      🌌 Gradien Warna Murni
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setBgChoice('custom');
                                        triggerFeedback('Masukan URL kustom atau upload di bawah.', 'info');
                                      }}
                                      className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold text-left transition-all cursor-pointer ${bgChoice === 'custom' || (!['default-robot', 'blue-grid', 'none'].includes(bgChoice)) ? 'bg-brand-cyan/15 border-brand-cyan text-brand-sky shadow-md' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
                                    >
                                      🔗 Kustom URL / Upload
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2 border-t border-white/5 pt-3">
                                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Unggah File Latar Kustom (Maks 5MB)</label>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          if (file.size > 5 * 1024 * 1024) {
                                            triggerFeedback('Ukuran file latar terlalu besar! Maksimal 5MB.', 'error');
                                            return;
                                          }
                                          const reader = new FileReader();
                                          reader.onload = async (event) => {
                                            const base64 = event.target?.result as string;
                                            try {
                                              const compressed = await compressImage(base64, 1200, 1200, 0.7);
                                              setCustomBgUrl(compressed);
                                              setBgChoice('custom');
                                              triggerFeedback('Berhasil memuat file latar kustom!', 'success');
                                            } catch (err) {
                                              setCustomBgUrl(base64);
                                              setBgChoice('custom');
                                              triggerFeedback('Berhasil memuat file latar kustom!', 'success');
                                            }
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                      className="hidden"
                                      id="bg-file-upload-dashboard"
                                    />
                                    <label
                                      htmlFor="bg-file-upload-dashboard"
                                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shrink-0"
                                    >
                                      <Upload className="w-3.5 h-3.5 text-brand-cyan" />
                                      Pilih File Gambar
                                    </label>
                                    <span className="text-[9px] text-slate-500 font-mono truncate max-w-[150px]">
                                      {customBgUrl.startsWith('data:') ? '📂 File lokal termuat' : (customBgUrl ? '🔗 URL eksternal' : 'Belum ada file')}
                                    </span>
                                  </div>
                                </div>

                                {(bgChoice === 'custom' || (!['default-robot', 'blue-grid', 'none'].includes(bgChoice))) && (
                                  <div className="space-y-1.5 animate-fade-in border-t border-white/5 pt-3">
                                    <label className="text-[10px] font-mono text-slate-400 uppercase">Input Alamat URL Gambar Latar *</label>
                                    <input
                                      type="text"
                                      placeholder="https://example.com/background.jpg"
                                      value={customBgUrl.startsWith('data:') ? '' : customBgUrl}
                                      onChange={(e) => {
                                        setCustomBgUrl(e.target.value);
                                        setBgChoice('custom');
                                      }}
                                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan font-mono"
                                    />
                                    <span className="text-[9px] text-slate-500 font-light leading-normal block">
                                      * Atau tempel URL gambar publik yang Anda inginkan.
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Theme Color Settings */}
                              <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-4">
                                <h5 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                                  <Palette className="w-3.5 h-3.5 text-brand-cyan" />
                                  2. Palet Warna Aksen Utama
                                </h5>

                                <div className="space-y-4">
                                  {/* Primary color */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label className="text-[10px] font-mono text-slate-400 uppercase">Warna Primer Utama (Default Cyan)</label>
                                      <span className="text-[10px] font-mono font-bold" style={{ color: primaryColor }}>{primaryColor}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="w-10 h-10 bg-transparent border border-white/10 rounded-lg cursor-pointer outline-none shrink-0"
                                      />
                                      <div className="flex flex-wrap gap-1.5 flex-1">
                                        {[
                                          { name: 'Cyan', hex: '#06B6D4' },
                                          { name: 'Emerald', hex: '#10B981' },
                                          { name: 'Violet', hex: '#8B5CF6' },
                                          { name: 'Orange', hex: '#F97316' },
                                          { name: 'Rose', hex: '#F43F5E' },
                                        ].map((clr) => (
                                          <button
                                            key={clr.hex}
                                            type="button"
                                            onClick={() => setPrimaryColor(clr.hex)}
                                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded text-[9px] font-mono text-slate-300 hover:text-white cursor-pointer"
                                            style={{ borderLeft: `3px solid ${clr.hex}` }}
                                          >
                                            {clr.name}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Secondary color */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label className="text-[10px] font-mono text-slate-400 uppercase">Warna Sekunder (Default Blue)</label>
                                      <span className="text-[10px] font-mono font-bold" style={{ color: secondaryColor }}>{secondaryColor}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="color"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="w-10 h-10 bg-transparent border border-white/10 rounded-lg cursor-pointer outline-none shrink-0"
                                      />
                                      <div className="flex flex-wrap gap-1.5 flex-1">
                                        {[
                                          { name: 'Blue', hex: '#2563EB' },
                                          { name: 'Teal', hex: '#14B8A6' },
                                          { name: 'Indigo', hex: '#4F46E5' },
                                          { name: 'Pink', hex: '#EC4899' },
                                          { name: 'Slate', hex: '#475569' },
                                        ].map((clr) => (
                                          <button
                                            key={clr.hex}
                                            type="button"
                                            onClick={() => setSecondaryColor(clr.hex)}
                                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded text-[9px] font-mono text-slate-300 hover:text-white cursor-pointer"
                                            style={{ borderLeft: `3px solid ${clr.hex}` }}
                                          >
                                            {clr.name}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>

                              {/* Logo Upload Settings */}
                              <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-4 col-span-1 md:col-span-2">
                                <h5 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                                  <Image className="w-3.5 h-3.5 text-brand-cyan" />
                                  3. Gambar Logo Resmi Ringkasan & Kiri Atas (Header)
                                </h5>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                  {/* Preview Section */}
                                  <div className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-white/5 rounded-2xl">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">Preview Logo</span>
                                    <div className={`w-20 h-20 bg-slate-950 border border-brand-cyan/30 flex items-center justify-center overflow-hidden relative ${customLogoUrl ? 'rounded-2xl p-1.5' : 'rounded-full'}`}>
                                      {customLogoUrl ? (
                                        <img src={customLogoUrl} alt="Preview Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                                      ) : (
                                        <Cpu className="w-10 h-10 text-brand-cyan animate-pulse" />
                                      )}
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500 mt-2">
                                      {customLogoUrl ? 'Logo Kustom Aktif' : 'Default (CPU Icon)'}
                                    </span>
                                  </div>

                                  {/* Upload Section */}
                                  <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Unggah Gambar Logo Baru (Maks 5MB)</label>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            if (file.size > 5 * 1024 * 1024) {
                                              triggerFeedback('Ukuran logo terlalu besar! Maksimal 5MB.', 'error');
                                              return;
                                            }
                                            const reader = new FileReader();
                                            reader.onload = async (event) => {
                                              const base64 = event.target?.result as string;
                                              try {
                                                const compressed = await compressImage(base64, 350, 350, 0.8);
                                                setCustomLogoUrl(compressed);
                                                triggerFeedback('Berhasil memuat file logo baru!', 'success');
                                              } catch (err) {
                                                setCustomLogoUrl(base64);
                                                triggerFeedback('Berhasil memuat file logo baru!', 'success');
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="hidden"
                                        id="logo-file-upload-dashboard"
                                      />
                                      <label
                                        htmlFor="logo-file-upload-dashboard"
                                        className="px-4 py-2.5 bg-brand-cyan hover:bg-brand-sky text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                                      >
                                        <Upload className="w-4 h-4" />
                                        Pilih File Logo
                                      </label>

                                      <input
                                        type="text"
                                        placeholder="Atau masukkan URL logo (https://...)"
                                        value={customLogoUrl.startsWith('data:') ? '' : customLogoUrl}
                                        onChange={(e) => setCustomLogoUrl(e.target.value)}
                                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan font-mono"
                                      />
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                      <span className="text-[9px] text-slate-500 font-light leading-normal block max-w-sm">
                                        * Mendukung file gambar (PNG, JPG, SVG, WEBP). Disarankan rasi 1:1 bulat atau transparan.
                                      </span>
                                      {customLogoUrl && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCustomLogoUrl('');
                                            triggerFeedback('Logo di-reset ke default!', 'info');
                                          }}
                                          className="text-[10px] font-mono text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                                        >
                                          Reset Logo Default
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>

                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                              <Info className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider block">Efek Reaktivitas Sistem Realtime</span>
                                <p className="text-[10px] text-slate-400 leading-normal">
                                  Begitu Anda menyimpan konfigurasi di bawah, variabel warna CSS primer (<code className="text-brand-cyan font-bold font-mono">--color-brand-cyan</code>) dan sekunder (<code className="text-brand-blue font-bold font-mono">--color-brand-blue</code>) serta gambar latar website akan langsung dimutakhirkan secara menyeluruh di semua halaman.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                              <button
                                type="button"
                                onClick={() => {
                                  // Restore Default
                                  setBgChoice('default-robot');
                                  setCustomBgUrl('');
                                  setPrimaryColor('#06B6D4');
                                  setSecondaryColor('#2563EB');
                                  setCustomLogoUrl('');
                                  triggerFeedback('Pengaturan Desain di-reset ke nilai default!', 'info');
                                }}
                                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-white/10 text-slate-400 hover:text-white font-mono font-bold text-[10px] rounded-xl cursor-pointer"
                              >
                                RESET DEFAULT
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const finalBg = bgChoice === 'custom' ? (customBgUrl || 'default-robot') : bgChoice;
                                  localStorage.setItem('robotika_custom_background', finalBg);
                                  localStorage.setItem('robotika_custom_primary_color', primaryColor);
                                  localStorage.setItem('robotika_custom_secondary_color', secondaryColor);
                                  localStorage.setItem('robotika_custom_logo', customLogoUrl);
                                  window.dispatchEvent(new Event('robotika_theme_updated'));
                                  triggerFeedback('Pengaturan Latar & Warna berhasil disimpan!', 'success');
                                }}
                                className="px-4 py-2 bg-brand-cyan hover:bg-brand-sky text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-brand-cyan/10"
                              >
                                <Save className="w-4 h-4" /> Simpan Desain Portal
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  </motion.div>
                )}

                {/* --- TAB 11: ROBOTICS LEARNING ACADEMY (PEMBELAJARAN) --- */}
                {activeTab === 'learning' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="animate-fade-in"
                  >
                    <LearningHub userData={userData || undefined} />
                  </motion.div>
                )}

              </div>

              {/* Dashboard Internal Footer metrics drawer bar */}
              <div className="p-4 bg-slate-950 border-t border-white/5 flex flex-col sm:flex-row gap-2 items-center justify-between font-mono text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  <span>Suhu CPU Simulator: <strong className="text-slate-200">32.2 °C</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>Memori Log: <strong className="text-slate-200">Idle (Standby)</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-300 font-medium">Platform: <strong>ROBO-CORE Engine OS</strong></span>
                  <button
                    onClick={onLogout}
                    className="p-1 px-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/15 text-red-400 rounded-md transition-colors cursor-pointer text-[9px] font-bold"
                  >
                      Keluar Sesi
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {confirmModal.isOpen && (
            <motion.div
              key="confirm-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
              onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
            >
              <motion.div
                key="confirm-modal-box"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="w-full max-w-md bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative glow border */}
                <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${
                  confirmModal.type === 'danger' ? 'from-red-500 via-pink-500 to-red-500' :
                  confirmModal.type === 'info' ? 'from-blue-500 via-cyan-500 to-blue-500' :
                  'from-green-500 via-emerald-500 to-green-500'
                }`} />

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${
                    confirmModal.type === 'danger' ? 'bg-red-500/10 text-red-400' :
                    confirmModal.type === 'info' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {confirmModal.type === 'danger' ? (
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                    ) : confirmModal.type === 'info' ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <CheckCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                      {confirmModal.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {confirmModal.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    {confirmModal.cancelText || 'Batalkan'}
                  </button>
                  <button
                    type="button"
                    onClick={confirmModal.onConfirm}
                    className={`px-4 py-2 font-bold font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-white ${
                      confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20' :
                      confirmModal.type === 'info' ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20' :
                      'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-600/20'
                    }`}
                  >
                    {confirmModal.confirmText || 'Ya, Lanjutkan'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </section>
  );
}
