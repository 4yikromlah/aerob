/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Sun
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

export default function App() {
  const [currentSection, setCurrentSection] = useState('beranda');
  const [isAppLoading, setIsAppLoading] = useState(true);
  
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

      try {
        await Promise.all([
          fetch('/api/settings/background', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: bg }) }),
          fetch('/api/settings/primary_color', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: primary }) }),
          fetch('/api/settings/secondary_color', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: secondary }) }),
          fetch('/api/settings/logo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: logo }) })
        ]);
      } catch (err) {
        console.error("Error syncing theme config:", err);
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

  // CRUD State Collections initialized from localStorage or defaults
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('robotika_db_members');
      let list = saved ? JSON.parse(saved) : INITIAL_MEMBERS;
      if (!list.some((m: any) => m.email === '4yik.romlah@gmail.com' || m.id === 'm0')) {
        list = [
          { id: "m0", name: "Ayik Romlah", class: "Guru - Staf", role: "Pembina", email: "4yik.romlah@gmail.com", joinedDate: "2016-06-15", interests: ["Embedded", "IoT", "Computer Vision"], username: "romlah", password: "password", memberType: "Senior" },
          ...list
        ];
        localStorage.setItem('robotika_db_members', JSON.stringify(list));
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

  // Editable/Customizable Landing Page Site Settings & Content
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

  // --- NEON SQL DATABASE DYNAMIC FETCHERS & SYNC HANDLERS ---
  useEffect(() => {
    let isMounted = true;

    const fetchSafe = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`[FETCH SAFE] Non-ok response from ${url}: status ${res.status}`);
          return null;
        }
        return await res.json();
      } catch (err) {
        console.error(`[FETCH SAFE] Network or parse error for ${url}:`, err);
        return null;
      }
    };

    const fetchLiveData = async () => {
      try {
        const [
          membersRes,
          inventoryRes,
          programsRes,
          galleryRes,
          newsRes,
          productsRes,
          achievementsRes,
          summaryRes,
          visimisiRes,
          generalInfoRes,
          servicesRes,
          customBgRes,
          customPrimaryRes,
          customSecondaryRes,
          customLogoRes
        ] = await Promise.all([
          fetchSafe('/api/members'),
          fetchSafe('/api/inventory'),
          fetchSafe('/api/programs'),
          fetchSafe('/api/gallery'),
          fetchSafe('/api/news'),
          fetchSafe('/api/products'),
          fetchSafe('/api/achievements'),
          fetchSafe('/api/settings/profile'),
          fetchSafe('/api/settings/visimisi'),
          fetchSafe('/api/settings/general_info'),
          fetchSafe('/api/settings/public_services'),
          fetchSafe('/api/settings/background'),
          fetchSafe('/api/settings/primary_color'),
          fetchSafe('/api/settings/secondary_color'),
          fetchSafe('/api/settings/logo')
        ]);

        if (!isMounted) return;

        if (Array.isArray(membersRes)) {
          setMembers(membersRes);
          localStorage.setItem('robotika_db_members', JSON.stringify(membersRes));
        }
        if (Array.isArray(inventoryRes)) {
          setInventory(inventoryRes);
          localStorage.setItem('robotika_db_inventory', JSON.stringify(inventoryRes));
        }
        if (Array.isArray(programsRes)) {
          setPrograms(programsRes);
          localStorage.setItem('robotika_db_programs', JSON.stringify(programsRes));
        }
        if (Array.isArray(galleryRes)) {
          setGallery(galleryRes);
          localStorage.setItem('robotika_db_gallery', JSON.stringify(galleryRes));
        }
        if (Array.isArray(newsRes)) {
          setNews(newsRes);
          localStorage.setItem('robotika_db_news', JSON.stringify(newsRes));
        }
        if (Array.isArray(productsRes)) {
          setProducts(productsRes);
          localStorage.setItem('robotika_db_products', JSON.stringify(productsRes));
        }
        if (Array.isArray(achievementsRes)) {
          setAchievements(achievementsRes);
          localStorage.setItem('robotika_db_achievements', JSON.stringify(achievementsRes));
        }
        if (summaryRes) {
          setSummary(summaryRes);
          localStorage.setItem('robotika_db_summary', JSON.stringify(summaryRes));
        }
        if (visimisiRes !== null && visimisiRes !== undefined) {
          setVisiMisi(visimisiRes);
          localStorage.setItem('robotika_db_visimisi', JSON.stringify(visimisiRes));
        }
        if (generalInfoRes) {
          setGeneralInfo(generalInfoRes);
          localStorage.setItem('robotika_db_general_info', JSON.stringify(generalInfoRes));
        }
        if (Array.isArray(servicesRes)) {
          setPublicServices(servicesRes);
          localStorage.setItem('robotika_db_services', JSON.stringify(servicesRes));
        }
        
        if (customBgRes) {
          setCustomBg(customBgRes);
          localStorage.setItem('robotika_custom_background', customBgRes);
        }
        if (customPrimaryRes) {
          setCustomPrimaryColor(customPrimaryRes);
          localStorage.setItem('robotika_custom_primary_color', customPrimaryRes);
        }
        if (customSecondaryRes) {
          setCustomSecondaryColor(customSecondaryRes);
          localStorage.setItem('robotika_custom_secondary_color', customSecondaryRes);
        }
        if (customLogoRes) {
          localStorage.setItem('robotika_custom_logo', customLogoRes);
        }
      } catch (err) {
        console.error("Failed to load live data from Neon database:", err);
      } finally {
        if (isMounted) {
          setIsAppLoading(false);
        }
      }
    };

    fetchLiveData();
    return () => {
      isMounted = false;
    };
  }, []);

  const syncMembers = async (prevList: Member[], nextList: Member[]) => {
    try {
      const prevMap = new Map(prevList.map(m => [m.id, m]));
      const nextMap = new Map(nextList.map(m => [m.id, m]));

      for (const item of nextList) {
        const prev = prevMap.get(item.id);
        if (!prev) {
          await fetch('/api/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } else if (JSON.stringify(prev) !== JSON.stringify(item)) {
          await fetch(`/api/members/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        }
      }

      for (const item of prevList) {
        if (!nextMap.has(item.id)) {
          await fetch(`/api/members/${item.id}`, { method: 'DELETE' });
        }
      }
    } catch (err) {
      console.error("Error syncing members:", err);
    }
  };

  const handleSetMembers = (value: Member[] | ((prev: Member[]) => Member[])) => {
    const prevList = members;
    const nextList = typeof value === 'function' ? value(prevList) : value;
    setMembers(nextList);
    localStorage.setItem('robotika_db_members', JSON.stringify(nextList));
    setTimeout(() => {
      syncMembers(prevList, nextList);
    }, 0);
  };

  const syncInventory = async (prevList: InventoryItem[], nextList: InventoryItem[]) => {
    try {
      const prevMap = new Map(prevList.map(m => [m.id, m]));
      const nextMap = new Map(nextList.map(m => [m.id, m]));

      for (const item of nextList) {
        const prev = prevMap.get(item.id);
        if (!prev) {
          await fetch('/api/inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } else if (JSON.stringify(prev) !== JSON.stringify(item)) {
          await fetch(`/api/inventory/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        }
      }

      for (const item of prevList) {
        if (!nextMap.has(item.id)) {
          await fetch(`/api/inventory/${item.id}`, { method: 'DELETE' });
        }
      }
    } catch (err) {
      console.error("Error syncing inventory:", err);
    }
  };

  const handleSetInventory = (value: InventoryItem[] | ((prev: InventoryItem[]) => InventoryItem[])) => {
    const prevList = inventory;
    const nextList = typeof value === 'function' ? value(prevList) : value;
    setInventory(nextList);
    localStorage.setItem('robotika_db_inventory', JSON.stringify(nextList));
    setTimeout(() => {
      syncInventory(prevList, nextList);
    }, 0);
  };

  const syncPrograms = async (prevList: Program[], nextList: Program[]) => {
    try {
      const prevMap = new Map(prevList.map(m => [m.id, m]));
      const nextMap = new Map(nextList.map(m => [m.id, m]));

      for (const item of nextList) {
        const prev = prevMap.get(item.id);
        if (!prev) {
          await fetch('/api/programs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } else if (JSON.stringify(prev) !== JSON.stringify(item)) {
          await fetch(`/api/programs/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        }
      }

      for (const item of prevList) {
        if (!nextMap.has(item.id)) {
          await fetch(`/api/programs/${item.id}`, { method: 'DELETE' });
        }
      }
    } catch (err) {
      console.error("Error syncing programs:", err);
    }
  };

  const handleSetPrograms = (value: Program[] | ((prev: Program[]) => Program[])) => {
    const prevList = programs;
    const nextList = typeof value === 'function' ? value(prevList) : value;
    setPrograms(nextList);
    localStorage.setItem('robotika_db_programs', JSON.stringify(nextList));
    setTimeout(() => {
      syncPrograms(prevList, nextList);
    }, 0);
  };

  const syncGallery = async (prevList: ActivityImage[], nextList: ActivityImage[]) => {
    try {
      const prevMap = new Map(prevList.map(m => [m.id, m]));
      const nextMap = new Map(nextList.map(m => [m.id, m]));

      for (const item of nextList) {
        const prev = prevMap.get(item.id);
        if (!prev) {
          await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } else if (JSON.stringify(prev) !== JSON.stringify(item)) {
          await fetch(`/api/gallery/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        }
      }

      for (const item of prevList) {
        if (!nextMap.has(item.id)) {
          await fetch(`/api/gallery/${item.id}`, { method: 'DELETE' });
        }
      }
    } catch (err) {
      console.error("Error syncing gallery:", err);
    }
  };

  const handleSetGallery = (value: ActivityImage[] | ((prev: ActivityImage[]) => ActivityImage[])) => {
    const prevList = gallery;
    const nextList = typeof value === 'function' ? value(prevList) : value;
    setGallery(nextList);
    localStorage.setItem('robotika_db_gallery', JSON.stringify(nextList));
    setTimeout(() => {
      syncGallery(prevList, nextList);
    }, 0);
  };

  const syncNews = async (prevList: NewsItem[], nextList: NewsItem[]) => {
    try {
      const prevMap = new Map(prevList.map(m => [m.id, m]));
      const nextMap = new Map(nextList.map(m => [m.id, m]));

      for (const item of nextList) {
        const prev = prevMap.get(item.id);
        if (!prev) {
          await fetch('/api/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } else if (JSON.stringify(prev) !== JSON.stringify(item)) {
          await fetch(`/api/news/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        }
      }

      for (const item of prevList) {
        if (!nextMap.has(item.id)) {
          await fetch(`/api/news/${item.id}`, { method: 'DELETE' });
        }
      }
    } catch (err) {
      console.error("Error syncing news:", err);
    }
  };

  const handleSetNews = (value: NewsItem[] | ((prev: NewsItem[]) => NewsItem[])) => {
    const prevList = news;
    const nextList = typeof value === 'function' ? value(prevList) : value;
    setNews(nextList);
    localStorage.setItem('robotika_db_news', JSON.stringify(nextList));
    setTimeout(() => {
      syncNews(prevList, nextList);
    }, 0);
  };

  const syncProducts = async (prevList: ProductItem[], nextList: ProductItem[]) => {
    try {
      const prevMap = new Map(prevList.map(m => [m.id, m]));
      const nextMap = new Map(nextList.map(m => [m.id, m]));

      for (const item of nextList) {
        const prev = prevMap.get(item.id);
        if (!prev) {
          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } else if (JSON.stringify(prev) !== JSON.stringify(item)) {
          await fetch(`/api/products/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        }
      }

      for (const item of prevList) {
        if (!nextMap.has(item.id)) {
          await fetch(`/api/products/${item.id}`, { method: 'DELETE' });
        }
      }
    } catch (err) {
      console.error("Error syncing products:", err);
    }
  };

  const handleSetProducts = (value: ProductItem[] | ((prev: ProductItem[]) => ProductItem[])) => {
    const prevList = products;
    const nextList = typeof value === 'function' ? value(prevList) : value;
    setProducts(nextList);
    localStorage.setItem('robotika_db_products', JSON.stringify(nextList));
    setTimeout(() => {
      syncProducts(prevList, nextList);
    }, 0);
  };

  const handleSetSummary = async (value: any) => {
    setSummary(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      localStorage.setItem('robotika_db_summary', JSON.stringify(next));
      fetch('/api/settings/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next })
      }).catch(err => console.error("Error syncing summary:", err));
      return next;
    });
  };

  const handleSetAchievements = async (value: any) => {
    setAchievements(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      localStorage.setItem('robotika_db_achievements', JSON.stringify(next));
      fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      }).catch(err => console.error("Error syncing achievements:", err));
      return next;
    });
  };

  const handleSetVisiMisi = async (value: any) => {
    setVisiMisi(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      localStorage.setItem('robotika_db_visimisi', JSON.stringify(next));
      fetch('/api/settings/visimisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next })
      }).catch(err => console.error("Error syncing visimisi:", err));
      return next;
    });
  };

  const handleSetGeneralInfo = async (value: any) => {
    setGeneralInfo(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      localStorage.setItem('robotika_db_general_info', JSON.stringify(next));
      fetch('/api/settings/general_info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next })
      }).catch(err => console.error("Error syncing general_info:", err));
      return next;
    });
  };

  const handleSetPublicServices = async (value: any) => {
    setPublicServices(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      localStorage.setItem('robotika_db_services', JSON.stringify(next));
      fetch('/api/settings/public_services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next })
      }).catch(err => console.error("Error syncing services:", err));
      return next;
    });
  };

  // Auth & Session States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string; memberType?: 'Pemula' | 'Junior' | 'Senior' } | null>(null);

  // Helper to add toast notifications
  const addToast = (text: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Theme effects trigger
  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
    addToast(`Mode visual diubah ke: ${nextTheme === 'dark' ? 'COSMIC DARK' : 'BIRU CLAY (CLAY BLUE)'}`, 'info');
  };

  // Scroll effects (Progress Bar & Scroll-To-Top trigger)
  useEffect(() => {
    const handleScroll = () => {
      // Calculate Scroll Progress Percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }

      // Toggle Scroll To Top Visibility
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
      const scrollPosition = window.scrollY + 200; // Offset for sticky navbar of 80px + padding

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

  // Navigate function (scrolls or switches view)
  const handleNavigation = (sectionId: string) => {
    setSimulateView('none'); // Clear simulations if navigated
    setCurrentSection(sectionId);

    if (sectionId === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Session triggers
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
      
      {/* Animated Desktop Cursor Trail */}
      <AnimatedCursor />

      {/* Cyber Bootstrap Loading Screen */}
      <AnimatePresence>
        {isAppLoading && (
          <LoadingScreen onComplete={() => {
            setIsAppLoading(false);
            addToast('Integrasi Sistem Informasi Robotika Siap!', 'success');
          }} />
        )}
      </AnimatePresence>

      {/* Real-time Flat Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-[3.5px] bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple z-[99999] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* System Toasts Container */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Absolute top grid mask decoration */}
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-gradient-to-b from-brand-blue/15 to-transparent pointer-events-none z-0" />
      
      {/* Sticky Premium Navbar */}
      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigation}
        isLoggedIn={isLoggedIn}
        userName={userData?.name}
        userRole={userData?.role}
        onLogout={handleLogout}
        onOpenLogin={() => handleNavigation('dashboard')}
      />

      {/* DEVELOPER PLAYGROUND PREVIEW BAR */}
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

      {/* Main Core View Content */}
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          
          {simulateView === '404' ? (
            // --- 404 ERROR VIEW PAGE SIMULATOR ---
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
            // --- MAINTENANCE VIEW PAGE SIMULATOR ---
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
            
            // --- WORKSPACE VIEW INLINE VIEW SWITCHER ---
            <motion.div
              key="interior-dashboard-page"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 mt-12 mb-20"
            >
              {/* Back to Home Button */}
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

              {/* Master Dashboard Module */}
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
            
            // --- PRIMARY MARKETING WEBPAGE CONTENT ---
            <motion.div
              key="exterior-marketing-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
            >
              {/* Hero Banner Grid */}
              <Hero
                onJoinClick={() => handleNavigation('dashboard')}
                onExploreClick={() => handleNavigation('programs')}
              />

              {/* Stats & Short Profile */}
              <Overview 
                onDiscoverProductsClick={() => handleNavigation('products')} 
                membersCount={members.length}
                productsCount={products.length}
                summary={summary}
                achievements={achievements}
              />

              {/* Visi & Misi Cards Column */}
              <VisiMisi visiMisi={visiMisi || undefined} />

              {/* Testimonials Alumni stories */}
              <Testimonials />

              {/* Featured Syllabus Programs */}
              <Programs programs={programs} />

              {/* Chronological Milestone Achievements Timeline */}
              <Timeline achievements={achievements} />

              {/* Action Field Photos Grid */}
              <Gallery images={gallery} />

              {/* Dynamic Information Feed Board */}
              <NewsSection news={news} generalInfo={generalInfo} />

              {/* Interactive Activities Agenda Calendar */}
              <AgendaCalendar />

              {/* Collaborative Outreach Services */}
              <CommunityService publicServices={publicServices} />

              {/* Studen-Invented Creational Gallery */}
              <ProductsCatalog products={products} />

              {/* Integrated Learning Hub Section (Pembelajaran) */}
              {isLoggedIn && (
                <section id="learning" className="py-24 relative overflow-hidden bg-slate-950/20 border-t border-white/5">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <LearningHub userData={userData} />
                  </div>
                </section>
              )}

              {/* FAQs Accordions list */}
              <Faq />

              {/* Interactive Quick Messages form Contact */}
              <ContactForm onAddToast={addToast} />

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Glowing footer */}
      <Footer onNavigate={handleNavigation} />

      {/* Dynamic Scroll To Top Button with neon trail */}
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

      {/* Floating Action Buttons trigger */}
      <FloatingActionButton whatsappNumber={summary?.whatsapp} />
    </div>
  );
}
