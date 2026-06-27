import React, { useState, useEffect, useRef, useCallback } from 'react';
import hitechBg from './assets/images/aerob_hitech_bg_1782468295698.jpg';
import blueGridBg from './assets/images/hitech_blue_bg_1782427021437.jpg';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Overview from './components/Overview';
import VisiMisi from './components/VisiMisi';
import Programs from './components/Programs';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import NewsSection from './components/NewsSection';
import AgendaCalendar from './components/AgendaCalendar';
import CommunityService from './components/CommunityService';
import ProductsCatalog from './components/ProductsCatalog';
import Faq from './components/Faq';
import ContactForm from './components/ContactForm';
import Testimonials from './components/Testimonials';
import Dashboard from './components/Dashboard';
import LearningHub from './components/LearningHub';
import Footer from './components/Footer';
import FloatingActionButton from './components/FloatingActionButton';
import AnimatedCursor from './components/AnimatedCursor';
import LoadingScreen from './components/LoadingScreen';
import Toast, { ToastMessage } from './components/Toast';

import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowLeft,
  UserCheck,
  ArrowUp,
  Settings,
  AlertTriangle,
  Terminal,
  X,
  Play,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';

import { Program, ActivityImage, NewsItem, ProductItem, Member, InventoryItem } from './types';
import {
  PROGRAMS_DATA,
  GALLERY_IMGS,
  NEWS_DATA,
  PRODUCTS_DATA,
  INITIAL_MEMBERS,
  INITIAL_INVENTORY,
  EXTRACURRICULAR_PROFILE,
  GENERAL_ACHIEVEMENTS,
  PUBLIC_SERVICES
} from './data/roboticsData';

// ===========================================================================
// KONSTAN & HELPER KONEKSI DATABASE
// ===========================================================================

/** Timeout default untuk request API (ms). */
const API_TIMEOUT_MS = 10_000;

/** Interval minimum antar re-fetch otomatis akibat window focus (ms). */
const REFOCUS_REFETCH_MS = 5_000;

/**
 * Fetch wrapper yang tahan banting:
 *  - Memakai AbortController + timeout agar tidak gantung selamanya.
 *  - Menangani respons non-JSON (mis. halaman error HTML) tanpa throw.
 *  - Mengembalikan `null` saat gagal, agar pemanggil tetap dapat melanjutkan.
 *
 * @param url  Endpoint API relatif, mis. `/api/members`.
 * @param init Opsi fetch standar (method, headers, body, ...).
 */
async function apiFetch<T = any>(
  url: string,
  init: RequestInit = {}
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      console.warn(`[apiFetch] ${init.method || 'GET'} ${url} → HTTP ${res.status}`);
      return null;
    }

    // Coba parse JSON; bila body kosong / non-JSON, kembalikan null (bukan throw).
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text) as T;
    } catch {
      console.warn(`[apiFetch] ${url} → respons bukan JSON valid, dilewatkan.`);
      return null;
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      console.warn(`[apiFetch] ${url} → timeout ${API_TIMEOUT_MS}ms`);
    } else {
      console.warn(`[apiFetch] ${url} →`, err?.message || err);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Buka nilai setting yang biasanya dibungkus `{ value: ... }` oleh backend.
 * Tetap aman bila backend mengembalikan nilai mentah (string/array/object).
 */
function unwrapSetting<T = any>(raw: any): T | null {
  if (raw == null) return null;
  if (typeof raw === 'object' && !Array.isArray(raw) && 'value' in raw) {
    return (raw as { value: T }).value;
  }
  return raw as T;
}

/**
 * JSON.stringify dengan key terurut → diff stabil terhadap urutan properti.
 * Mencegah PUT tidak perlu yang dipicu hanya oleh perbedaan urutan key.
 */
function stableStringify(value: any): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  const sortKeys = (_: any, val: any) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return Object.keys(val).sort().reduce<Record<string, any>>((acc, k) => {
        acc[k] = val[k];
        return acc;
      }, {});
    }
    return val;
  };
  return JSON.stringify(value, sortKeys);
}

/** Tulis ke localStorage dengan aman (abaikan bila QuotaExceeded). */
function safeLocalSet(key: string, value: any) {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (err) {
    console.warn(`[localStorage] gagal menulis ${key}:`, err);
  }
}

// ===========================================================================
// KOMPONEN UTAMA
// ===========================================================================

export default function App() {
  const [currentSection, setCurrentSection] = useState('beranda');
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Status koneksi database (memengaruhi UI: badge + tombol retry)
  const [dbStatus, setDbStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');

  // Theme Toggle (Dark / Light)
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // Realtime Design Theme & Background Customization
  const [customBg, setCustomBg] = useState(() => {
    return localStorage.getItem('robotika_custom_background') || 'default-robot';
  });
  const [customPrimaryColor, setCustomPrimaryColor] = useState(() => {
    return localStorage.getItem('robotika_custom_primary_color') || '#06B6D4';
  });
  const [customSecondaryColor, setCustomSecondaryColor] = useState(() => {
    return localStorage.getItem('robotika_custom_secondary_color') || '#2563EB';
  });

  useEffect(() => {
    const handleThemeChange = async () => {
      const bg = localStorage.getItem('robotika_custom_background') || 'default-robot';
      const primary = localStorage.getItem('robotika_custom_primary_color') || '#06B6D4';
      const secondary = localStorage.getItem('robotika_custom_secondary_color') || '#2563EB';
      const logo = localStorage.getItem('robotika_custom_logo') || '';

      setCustomBg(bg);
      setCustomPrimaryColor(primary);
      setCustomSecondaryColor(secondary);

      // Sinkronisasi tema — pakai apiFetch + Promise.allSettled agar 1 endpoint
      // gagal tidak membatalkan yang lain.
      const headers = { 'Content-Type': 'application/json' };
      const results = await Promise.allSettled([
        apiFetch('/api/settings/background', { method: 'POST', headers, body: JSON.stringify({ value: bg }) }),
        apiFetch('/api/settings/primary_color', { method: 'POST', headers, body: JSON.stringify({ value: primary }) }),
        apiFetch('/api/settings/secondary_color', { method: 'POST', headers, body: JSON.stringify({ value: secondary }) }),
        apiFetch('/api/settings/logo', { method: 'POST', headers, body: JSON.stringify({ value: logo }) })
      ]);
      const failedCount = results.filter(
        r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value === null)
      ).length;
      if (failedCount > 0) {
        console.warn(`[theme] ${failedCount}/${results.length} endpoint gagal disinkronkan.`);
      }
    };

    window.addEventListener('robotika_theme_updated', handleThemeChange);
    return () => window.removeEventListener('robotika_theme_updated', handleThemeChange);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-brand-cyan', customPrimaryColor);
    document.documentElement.style.setProperty('--color-brand-blue', customSecondaryColor);
  }, [customPrimaryColor, customSecondaryColor]);

  // Unified Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simulation Views toggles (404 Error Screen, Maintenance Page)
  const [simulateView, setSimulateView] = useState<'none' | '404' | 'maintenance'>('none');

  // Scroll position trackers
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- CRUD State Collections: hydrate dari localStorage atau default ---
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('robotika_db_members');
      let list = saved ? JSON.parse(saved) : INITIAL_MEMBERS;
      if (!list.some((m: any) => m.email === '4yik.romlah@gmail.com' || m.id === 'm0')) {
        list = [
          { id: "m0", name: "Ayik Romlah", class: "Guru - Staf", role: "Pembina", email: "4yik.romlah@gmail.com", joinedDate: "2016-06-15", interests: ["Embedded", "IoT", "Computer Vision"], username: "romlah", password: "password", memberType: "Senior" },
          ...list
        ];
        safeLocalSet('robotika_db_members', list);
      }
      return list;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('robotika_db_inventory');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    try {
      const saved = localStorage.getItem('robotika_db_programs');
      return saved ? JSON.parse(saved) : PROGRAMS_DATA;
    } catch {
      return PROGRAMS_DATA;
    }
  });

  const [gallery, setGallery] = useState<ActivityImage[]>(() => {
    try {
      const saved = localStorage.getItem('robotika_db_gallery');
      return saved ? JSON.parse(saved) : GALLERY_IMGS;
    } catch {
      return GALLERY_IMGS;
    }
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('robotika_db_news');
      return saved ? JSON.parse(saved) : NEWS_DATA;
    } catch {
      return NEWS_DATA;
    }
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('robotika_db_products');
      return saved ? JSON.parse(saved) : PRODUCTS_DATA;
    } catch {
      return PRODUCTS_DATA;
    }
  });

  const [summary, setSummary] = useState(() => {
    try {
      const saved = localStorage.getItem('robotika_db_summary');
      return saved ? JSON.parse(saved) : EXTRACURRICULAR_PROFILE;
    } catch {
      return EXTRACURRICULAR_PROFILE;
    }
  });

  const [achievements, setAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem('robotika_db_achievements');
      return saved ? JSON.parse(saved) : GENERAL_ACHIEVEMENTS;
    } catch {
      return GENERAL_ACHIEVEMENTS;
    }
  });

  const [visiMisi, setVisiMisi] = useState(() => {
    try {
      const saved = localStorage.getItem('robotika_db_visimisi');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [generalInfo, setGeneralInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('robotika_db_general_info');
      return saved ? JSON.parse(saved) : "📢 INFO AKTIF: Kunjungan industri dan pameran karya robotika sasis pintar SMK Unggulan Teknologi akan dilangsungkan serentak pada tanggal 12 Juli 2026. Persiapkan modul line follower dan robot soccer roda Anda!";
    } catch {
      return "📢 INFO AKTIF: Kunjungan industri dan pameran karya robotika sasis pintar SMK Unggulan Teknologi akan dilangsungkan serentak pada tanggal 12 Juli 2026. Persiapkan modul line follower dan robot soccer roda Anda!";
    }
  });

  const [publicServices, setPublicServices] = useState(() => {
    try {
      const saved = localStorage.getItem('robotika_db_services');
      return saved ? JSON.parse(saved) : PUBLIC_SERVICES;
    } catch {
      return PUBLIC_SERVICES;
    }
  });

  // Refs untuk dedup sinkronisasi paralel + debouncing refetch.
  const syncInFlight = useRef<Record<string, boolean>>({});
  const lastRefetchAt = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Helper toast notifications
  const addToast = useCallback((text: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- NEON SQL DATABASE: FETCH LIVE DATA ---
  // Pakai Promise.allSettled: 1 endpoint gagal tidak menjatuhkan lainnya.
  const fetchLiveData = useCallback(async (opts?: { silent?: boolean }) => {
    if (!isMountedRef.current) return;
    if (!opts?.silent) setDbStatus('connecting');

    const results = await Promise.allSettled([
      apiFetch<Member[]>('/api/members'),
      apiFetch<InventoryItem[]>('/api/inventory'),
      apiFetch<Program[]>('/api/programs'),
      apiFetch<ActivityImage[]>('/api/gallery'),
      apiFetch<NewsItem[]>('/api/news'),
      apiFetch<ProductItem[]>('/api/products'),
      apiFetch<any[]>('/api/achievements'),
      apiFetch('/api/settings/profile'),
      apiFetch('/api/settings/visimisi'),
      apiFetch('/api/settings/general_info'),
      apiFetch('/api/settings/public_services'),
      apiFetch('/api/settings/background'),
      apiFetch('/api/settings/primary_color'),
      apiFetch('/api/settings/secondary_color'),
      apiFetch('/api/settings/logo')
    ]);

    if (!isMountedRef.current) return;

    const got = <T,>(r: PromiseSettledResult<T | null>): T | null =>
      r.status === 'fulfilled' ? r.value : null;

    const [
      membersRes, inventoryRes, programsRes, galleryRes, newsRes, productsRes,
      achievementsRes, summaryRes, visimisiRes, generalInfoRes, servicesRes,
      customBgRes, customPrimaryRes, customSecondaryRes, customLogoRes
    ] = results;

    let successCount = 0;

    // Array resources
    if (Array.isArray(got(membersRes)))      { setMembers(got(membersRes)!);          safeLocalSet('robotika_db_members', got(membersRes));          successCount++; }
    if (Array.isArray(got(inventoryRes)))    { setInventory(got(inventoryRes)!);      safeLocalSet('robotika_db_inventory', got(inventoryRes));      successCount++; }
    if (Array.isArray(got(programsRes)))     { setPrograms(got(programsRes)!);        safeLocalSet('robotika_db_programs', got(programsRes));        successCount++; }
    if (Array.isArray(got(galleryRes)))      { setGallery(got(galleryRes)!);          safeLocalSet('robotika_db_gallery', got(galleryRes));          successCount++; }
    if (Array.isArray(got(newsRes)))         { setNews(got(newsRes)!);                safeLocalSet('robotika_db_news', got(newsRes));                successCount++; }
    if (Array.isArray(got(productsRes)))     { setProducts(got(productsRes)!);        safeLocalSet('robotika_db_products', got(productsRes));        successCount++; }
    if (Array.isArray(got(achievementsRes))) { setAchievements(got(achievementsRes)!);safeLocalSet('robotika_db_achievements', got(achievementsRes));successCount++; }
    if (Array.isArray(got(servicesRes)))     { setPublicServices(got(servicesRes)!);  safeLocalSet('robotika_db_services', got(servicesRes));        successCount++; }

    // Object / scalar resources — unwrap { value } bila perlu
    const summaryVal = unwrapSetting(got(summaryRes));
    if (summaryVal) { setSummary(summaryVal); safeLocalSet('robotika_db_summary', summaryVal); successCount++; }

    const visimisiVal = unwrapSetting(got(visimisiRes));
    if (visimisiVal !== null && visimisiVal !== undefined) {
      setVisiMisi(visimisiVal);
      safeLocalSet('robotika_db_visimisi', visimisiVal);
      successCount++;
    }

    const generalInfoVal = unwrapSetting(got(generalInfoRes));
    if (generalInfoVal) { setGeneralInfo(generalInfoVal); safeLocalSet('robotika_db_general_info', generalInfoVal); successCount++; }

    const bgVal = unwrapSetting<string>(got(customBgRes));
    if (bgVal) { setCustomBg(bgVal); safeLocalSet('robotika_custom_background', bgVal); successCount++; }

    const primVal = unwrapSetting<string>(got(customPrimaryRes));
    if (primVal) { setCustomPrimaryColor(primVal); safeLocalSet('robotika_custom_primary_color', primVal); successCount++; }

    const secVal = unwrapSetting<string>(got(customSecondaryRes));
    if (secVal) { setCustomSecondaryColor(secVal); safeLocalSet('robotika_custom_secondary_color', secVal); successCount++; }

    const logoVal = unwrapSetting<string>(got(customLogoRes));
    if (logoVal) { safeLocalSet('robotika_custom_logo', logoVal); successCount++; }

    // Putuskan status koneksi berdasar jumlah endpoint yang berhasil.
    const totalExpected = results.length;
    if (successCount === 0) {
      setDbStatus('offline');
      if (!opts?.silent) addToast('Tidak dapat terhubung ke database. Menampilkan data cache lokal.', 'error');
    } else if (successCount < totalExpected) {
      setDbStatus('online'); // sebagian berhasil tetap dianggap online
      if (!opts?.silent) addToast(`${successCount}/${totalExpected} endpoint database berhasil dimuat.`, 'info');
    } else {
      setDbStatus('online');
    }

    setIsAppLoading(false);
    lastRefetchAt.current = Date.now();
  }, [addToast]);

  // Fetch pertama saat mount
  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Re-fetch saat window kembali focus (debounced) — untuk sesi multi-user panjang.
  useEffect(() => {
    const onFocus = () => {
      const now = Date.now();
      if (now - lastRefetchAt.current < REFOCUS_REFETCH_MS) return;
      fetchLiveData({ silent: true });
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchLiveData]);

  // Re-fetch saat koneksi internet pulih
  useEffect(() => {
    const onOnline = () => {
      addToast('Koneksi internet pulih. Mengsinkronkan ulang data...', 'info');
      fetchLiveData({ silent: true });
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [fetchLiveData, addToast]);

  // --- GENERIC SYNC HELPER (paralel + dedup) ---
  // Membuat diff create/update/delete terhadap state sebelumnya, lalu
  // menjalankan request API secara paralel. Setiap kegagalan diberi tahu via toast.
  const makeSyncList = useCallback(<T extends { id: string }>(opts: {
    endpoint: string;
    prev: T[];
    next: T[];
    label: string;
  }) => {
    return async () => {
      const { endpoint, prev, next, label } = opts;
      const dedupKey = endpoint;
      if (syncInFlight.current[dedupKey]) {
        // Sudah ada sync berjalan untuk endpoint ini → skip untuk menghindari race.
        return;
      }
      syncInFlight.current[dedupKey] = true;

      try {
        const prevMap = new Map(prev.map(m => [m.id, m]));
        const nextMap = new Map(next.map(m => [m.id, m]));

        const headers = { 'Content-Type': 'application/json' };
        const tasks: Promise<any>[] = [];

        for (const item of next) {
          const prevItem = prevMap.get(item.id);
          if (!prevItem) {
            tasks.push(apiFetch(endpoint, {
              method: 'POST',
              headers,
              body: JSON.stringify(item)
            }));
          } else if (stableStringify(prevItem) !== stableStringify(item)) {
            tasks.push(apiFetch(`${endpoint}/${item.id}`, {
              method: 'PUT',
              headers,
              body: JSON.stringify(item)
            }));
          }
        }

        for (const item of prev) {
          if (!nextMap.has(item.id)) {
            tasks.push(apiFetch(`${endpoint}/${item.id}`, { method: 'DELETE' }));
          }
        }

        const results = await Promise.allSettled(tasks);
        const failed = results.filter(
          r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value === null)
        );
        if (failed.length > 0) {
          addToast(`Gagal menyinkronkan ${failed.length} perubahan ${label} ke database.`, 'error');
        }
      } catch (err) {
        console.error(`[sync:${label}]`, err);
        addToast(`Kesalahan tak terduga saat sync ${label}.`, 'error');
      } finally {
        syncInFlight.current[dedupKey] = false;
      }
    };
  }, [addToast]);

  // --- WRAPPER setMembers / setInventory / ... ---
  // Versi baru: tangkap prev & next secara eksplisit lewat functional update,
  // lalu jalankan sync dengan referensi prev yang benar (menghindari closure stale).
  const handleSetMembers = (value: Member[] | ((prev: Member[]) => Member[])) => {
    setMembers(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_members', next);
      makeSyncList<Member>({ endpoint: '/api/members', prev, next, label: 'anggota' })();
      return next;
    });
  };

  const handleSetInventory = (value: InventoryItem[] | ((prev: InventoryItem[]) => InventoryItem[])) => {
    setInventory(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_inventory', next);
      makeSyncList<InventoryItem>({ endpoint: '/api/inventory', prev, next, label: 'inventaris' })();
      return next;
    });
  };

  const handleSetPrograms = (value: Program[] | ((prev: Program[]) => Program[])) => {
    setPrograms(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_programs', next);
      makeSyncList<Program>({ endpoint: '/api/programs', prev, next, label: 'program' })();
      return next;
    });
  };

  const handleSetGallery = (value: ActivityImage[] | ((prev: ActivityImage[]) => ActivityImage[])) => {
    setGallery(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_gallery', next);
      makeSyncList<ActivityImage>({ endpoint: '/api/gallery', prev, next, label: 'galeri' })();
      return next;
    });
  };

  const handleSetNews = (value: NewsItem[] | ((prev: NewsItem[]) => NewsItem[])) => {
    setNews(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_news', next);
      makeSyncList<NewsItem>({ endpoint: '/api/news', prev, next, label: 'berita' })();
      return next;
    });
  };

  const handleSetProducts = (value: ProductItem[] | ((prev: ProductItem[]) => ProductItem[])) => {
    setProducts(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_products', next);
      makeSyncList<ProductItem>({ endpoint: '/api/products', prev, next, label: 'produk' })();
      return next;
    });
  };

  // --- SETTINGS (single-object): selalu bungkus { value } saat POST ---
  const handleSetSummary = (value: any) => {
    setSummary(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_summary', next);
      apiFetch('/api/settings/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next })
      }).then(r => { if (r === null) addToast('Gagal menyimpan profil ke database.', 'error'); });
      return next;
    });
  };

  const handleSetAchievements = (value: any) => {
    setAchievements(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_achievements', next);
      // Catatan: endpoint /api/achievements menerima array mentah (bukan {value}).
      apiFetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      }).then(r => { if (r === null) addToast('Gagal menyimpan prestasi ke database.', 'error'); });
      return next;
    });
  };

  const handleSetVisiMisi = (value: any) => {
    setVisiMisi(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_visimisi', next);
      apiFetch('/api/settings/visimisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next })
      }).then(r => { if (r === null) addToast('Gagal menyimpan visi-misi ke database.', 'error'); });
      return next;
    });
  };

  const handleSetGeneralInfo = (value: any) => {
    setGeneralInfo(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_general_info', next);
      apiFetch('/api/settings/general_info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next })
      }).then(r => { if (r === null) addToast('Gagal menyimpan info umum ke database.', 'error'); });
      return next;
    });
  };

  const handleSetPublicServices = (value: any) => {
    setPublicServices(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      safeLocalSet('robotika_db_services', next);
      apiFetch('/api/settings/public_services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next })
      }).then(r => { if (r === null) addToast('Gagal menyimpan layanan publik ke database.', 'error'); });
      return next;
    });
  };

  // Auth & Session States
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userData, setUserData] = useState<{ name: string; role: string; memberType?: 'Pemula' | 'Junior' | 'Senior' } | null>({
    name: 'Ayik Romlah',
    role: 'Pembina',
    memberType: 'Senior'
  });

  // Theme effects trigger
  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
    addToast(`Mode visual diubah ke: ${nextTheme === 'dark' ? 'COSMIC DARK' : 'BIRU CLAY (CLAY BLUE)'}`, 'info');
  };

  // Scroll effects (Progress Bar & Scroll-To-Top trigger)
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto scroll detection to highlight navbar links
  useEffect(() => {
    const handleScrollHighlight = () => {
      if (currentSection === 'dashboard' || simulateView !== 'none') return;
      const sections = ['beranda', 'ringkasan', 'vision', 'programs', 'gallery', 'news', 'services', 'products', 'learning'];
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScrollHighlight);
    return () => window.removeEventListener('scroll', handleScrollHighlight);
  }, [currentSection, simulateView]);

  const handleNavigation = (sectionId: string) => {
    setSimulateView('none');
    setCurrentSection(sectionId);
    if (sectionId === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (user: { name: string; role: string; memberType?: 'Pemula' | 'Junior' | 'Senior' }) => {
    setIsLoggedIn(true);
    setUserData(user);
    setCurrentSection('beranda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast(`Keberhasilan Otorisasi! Selamat Datang ${user.name}`, 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentSection('beranda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('Anda keluar dari sistem robotika.', 'info');
  };

  const handleScrollToTopAction = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('Kembali ke puncak orbit.', 'info');
  };

  const handleManualRetry = () => {
    addToast('Mencoba menghubungi ulang database...', 'info');
    fetchLiveData();
  };

  const getBgUrl = () => {
    if (customBg === 'default-robot') return hitechBg;
    if (customBg === 'blue-grid') return blueGridBg;
    if (customBg === 'none') return '';
    return customBg;
  };

  const activeBgImage = getBgUrl();

  return (
    <div
      className={`min-h-screen relative font-sans select-none antialiased transition-colors duration-300 ${themeMode === 'light' ? 'theme-light bg-[#bae6fd] text-slate-800' : 'theme-dark bg-[#0B0F19] text-slate-100'} ${activeBgImage ? 'has-custom-bg' : ''}`}
      style={{
        backgroundImage: activeBgImage
          ? (themeMode === 'light'
            ? `linear-gradient(to bottom, rgba(186, 230, 253, 0.55), rgba(186, 230, 253, 0.75)), url(${activeBgImage})`
            : `linear-gradient(to bottom, rgba(11, 15, 25, 0.45), rgba(11, 15, 25, 0.65)), url(${activeBgImage})`)
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >

      <AnimatedCursor />

      {/* DB Connection Status Badge (kanan atas) */}
      <div className="fixed top-20 right-4 z-[60] flex items-center gap-2 bg-slate-950/90 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md shadow-lg">
        {dbStatus === 'online' ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">DB Online</span>
          </>
        ) : dbStatus === 'offline' ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">DB Offline</span>
            <button
              onClick={handleManualRetry}
              className="ml-1 p-0.5 rounded hover:bg-red-500/20 text-red-400 cursor-pointer"
              title="Coba hubungi ulang database"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </>
        ) : (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Connecting…</span>
          </>
        )}
      </div>

      <AnimatePresence>
        {isAppLoading && (
          <LoadingScreen onComplete={() => {
            setIsAppLoading(false);
            addToast('Integrasi Sistem Informasi Robotika Siap!', 'success');
          }} />
        )}
      </AnimatePresence>

      <div
        className="fixed top-0 left-0 h-[3.5px] bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple z-[99999] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      <div className="absolute top-0 inset-x-0 h-[1000px] bg-gradient-to-b from-brand-blue/15 to-transparent pointer-events-none z-0" />

      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigation}
        isLoggedIn={isLoggedIn}
        userName={userData?.name}
        userRole={userData?.role}
        onLogout={handleLogout}
        onOpenLogin={() => handleNavigation('dashboard')}
      />

      <div className="fixed bottom-4 left-4 z-[40] flex flex-row gap-2 bg-slate-950/90 border border-white/15 p-2 rounded-xl backdrop-blur-md items-center">
        <span className="text-[9px] font-mono font-bold tracking-widest text-[#06b6d4] pl-2 uppercase">PLAYGROUND PREVIEW:</span>
        <button
          onClick={() => {
            setSimulateView(simulateView === '404' ? 'none' : '404');
            addToast('Mensimulasi Halaman Error 404 Luar Angkasa.', 'info');
          }}
          className={`p-1 px-2 text-[9px] font-mono border rounded-lg cursor-pointer ${simulateView === '404' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
        >
          404 ERROR
        </button>
        <button
          onClick={() => {
            setSimulateView(simulateView === 'maintenance' ? 'none' : 'maintenance');
            addToast('Mensimulasi Halaman Pemeliharaan Server Lab.', 'info');
          }}
          className={`p-1 px-2 text-[9px] font-mono border rounded-lg cursor-pointer ${simulateView === 'maintenance' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
        >
          MAINTENANCE
        </button>

        <button
          onClick={toggleTheme}
          className="p-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white cursor-pointer ml-2"
          title="Ganti Tema Visual"
        >
          {themeMode === 'dark' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-purple-400" />}
        </button>
      </div>

      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">

          {simulateView === '404' ? (
            <motion.div
              key="interior-404-simulation"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-950/45 backdrop-blur-sm font-mono space-y-6"
            >
              <div className="w-24 h-24 border border-red-500/30 bg-red-500/5 rounded-3xl flex items-center justify-center shadow-lg shadow-red-500/15 animate-pulse relative">
                <span className="text-4xl font-extrabold text-red-500">404</span>
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full animate-ping" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">ORBIT DISCONNECTED</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
                  Sinyal pemancar terganggu! Alamat halaman yang Anda tuju melampaui lintasan orbit sirkuit server robotika kami atau telah dinonaktifkan sementara.
                </p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 text-left text-[10px] text-red-400 max-w-sm w-full font-light space-y-1">
                <p>&gt;&gt; ERROR_CODE: Ox777_NODE_NOT_FOUND</p>
                <p>&gt;&gt; STACK: RoutingEngineException at main.tsx</p>
                <p>&gt;&gt; IP: Secure Frame Enclave Port Gateway 3000</p>
              </div>
              <button
                onClick={() => setSimulateView('none')}
                className="px-5 py-2.5 bg-brand-cyan hover:bg-brand-sky text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md active:scale-95 transition-all text-center lowercase tracking-wide"
              >
                [ kembalikan lintasan utama ]
              </button>
            </motion.div>

          ) : simulateView === 'maintenance' ? (
            <motion.div
              key="interior-maintenance-simulation"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-950/45 backdrop-blur-sm font-mono space-y-6"
            >
              <div className="w-24 h-24 border border-yellow-500/30 bg-yellow-500/5 rounded-3xl flex items-center justify-center shadow-lg shadow-yellow-500/15 animate-bounce relative">
                <AlertTriangle className="w-12 h-12 text-yellow-500" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">PEMELIHARAAN PROTOKOL LAB</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
                  Server pendaftaran & database firmware sedang diuji (OTA calibration)! Laboratorium server utama robotika sedang melakukan backup skema terjadwal demi menyongsong kejuaraan robot nasional.
                </p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 text-left text-[10px] text-yellow-500 max-w-sm w-full font-light space-y-1">
                <p>&gt;&gt; STATUS: CALIBRATING_ADC_SENSORS</p>
                <p>&gt;&gt; BACKUP_BATCH: 14_SECURE_RECORDS</p>
                <p>&gt;&gt; ESTIMATION: Selesai Dalam 34 Menit Kerja</p>
              </div>
              <button
                onClick={() => setSimulateView('none')}
                className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md active:scale-95 transition-all"
              >
                MASUK KE LEVEL LIVE
              </button>
            </motion.div>

          ) : currentSection === 'dashboard' ? (
            <motion.div
              key="interior-dashboard-page"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 mt-12 mb-20"
            >
              <div className="mb-6 flex items-center justify-between">
                <button
                  onClick={() => handleNavigation('beranda')}
                  className="p-2.5 px-4 bg-slate-900/60 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white rounded-xl flex items-center gap-2 text-xs font-mono transition-all cursor-pointer shadow-md"
                >
                  <ArrowLeft className="w-4 h-4 text-brand-cyan" />
                  <span>Kembali ke Website Utama</span>
                </button>

                {isLoggedIn && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <UserCheck className="w-4 h-4 text-brand-teal" />
                    <span>Sesi Terbuka: <strong className="text-white">{userData?.name}</strong></span>
                  </div>
                )}
              </div>

              <Dashboard
                onLoginSuccess={handleLoginSuccess}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onClose={() => handleNavigation('beranda')}
                members={members}
                setMembers={handleSetMembers}
                inventory={inventory}
                setInventory={handleSetInventory}
                programs={programs}
                setPrograms={handleSetPrograms}
                gallery={gallery}
                setGallery={handleSetGallery}
                news={news}
                setNews={handleSetNews}
                products={products}
                setProducts={handleSetProducts}
                userData={userData}
                summary={summary}
                setSummary={handleSetSummary}
                achievements={achievements}
                setAchievements={handleSetAchievements}
                visiMisi={visiMisi}
                setVisiMisi={handleSetVisiMisi}
                publicServices={publicServices}
                setPublicServices={handleSetPublicServices}
                generalInfo={generalInfo}
                setGeneralInfo={handleSetGeneralInfo}
                onAddToast={addToast}
              />
            </motion.div>
          ) : (
            <motion.div
              key="exterior-marketing-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
            >
              <Hero
                onJoinClick={() => handleNavigation('dashboard')}
                onExploreClick={() => handleNavigation('programs')}
              />

              <Overview
                onDiscoverProductsClick={() => handleNavigation('products')}
                membersCount={members.length}
                productsCount={products.length}
                summary={summary}
                achievements={achievements}
              />

              <VisiMisi visiMisi={visiMisi || undefined} />

              <Testimonials />

              <Programs programs={programs} />

              <Timeline achievements={achievements} />

              <Gallery images={gallery} />

              <NewsSection news={news} generalInfo={generalInfo} />

              <AgendaCalendar />

              <CommunityService publicServices={publicServices} />

              <ProductsCatalog products={products} />

              {isLoggedIn && (
                <section id="learning" className="py-24 relative overflow-hidden bg-slate-950/20 border-t border-white/5">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <LearningHub userData={userData} />
                  </div>
                </section>
              )}

              <Faq />

              <ContactForm onAddToast={addToast} />

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigation} />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={handleScrollToTopAction}
            className="fixed bottom-6 right-6 z-[45] p-3.5 bg-slate-950/90 hover:bg-brand-cyan hover:text-slate-950 rounded-2xl border border-brand-cyan/30 text-brand-cyan shadow-lg hover:shadow-brand-cyan/25 cursor-pointer outline-none transition-all active:scale-90"
            title="Saran: Kembali ke Orbit Pucuk"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <FloatingActionButton whatsappNumber={summary?.whatsapp} />
    </div>
  );
}
