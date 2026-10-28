import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Lanterns } from './components/Lanterns';

// Import all 17 Views
import { HomeView } from './components/views/HomeView';
import { PrayersView } from './components/views/PrayersView';
import { QuranView } from './components/views/QuranView';
import { KhatmaView } from './components/views/KhatmaView';
import { AzkarView } from './components/views/AzkarView';
import { TasbihView } from './components/views/TasbihView';
import { ZakatView } from './components/views/ZakatView';
import { FaqView } from './components/views/FaqView';
import { LibraryView } from './components/views/LibraryView';
import { RecipesView } from './components/views/RecipesView';
import { SuhoorView } from './components/views/SuhoorView';
import { HealthTipsView } from './components/views/HealthTipsView';
import { HabitsView } from './components/views/HabitsView';
import { EhsanView } from './components/views/EhsanView';
import { SeriesView } from './components/views/SeriesView';
import { KidsView } from './components/views/KidsView';
import { DesignersView } from './components/views/DesignersView';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Online stats tracking
  const [onlineCount, setOnlineCount] = useState<number>(47);
  const [totalVisits, setTotalVisits] = useState<number>(12840);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('sohoorna_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('sohoorna_theme', nextTheme);
  };

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'home',
        'prayers',
        'quran',
        'khatma',
        'azkar',
        'tasbih',
        'zakat',
        'faq',
        'library',
        'recipes',
        'suhoor',
        'health-tips',
        'habits',
        'ehsan',
        'series',
        'kids',
        'designers',
      ];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSidebarOpen(false);
  };

  // PWA Install prompt listener
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // Stats counter simulation with persistence
  useEffect(() => {
    // Total visits counter
    const storedVisits = localStorage.getItem('sohoorna_visits_total');
    let visits = storedVisits ? parseInt(storedVisits, 10) : 14200;
    if (!sessionStorage.getItem('sohoorna_session_logged')) {
      visits += Math.floor(Math.random() * 3) + 1;
      sessionStorage.setItem('sohoorna_session_logged', 'true');
      localStorage.setItem('sohoorna_visits_total', visits.toString());
    }
    setTotalVisits(visits);

    // Online users dynamic pulse
    const baseOnline = 52;
    setOnlineCount(baseOnline + Math.floor(Math.random() * 15) - 7);
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(30, Math.min(95, prev + delta));
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleNavigate}
            onlineCount={onlineCount}
            totalVisits={totalVisits}
          />
        );
      case 'prayers':
        return <PrayersView />;
      case 'quran':
        return <QuranView />;
      case 'khatma':
        return <KhatmaView />;
      case 'azkar':
        return <AzkarView />;
      case 'tasbih':
        return <TasbihView />;
      case 'zakat':
        return <ZakatView />;
      case 'faq':
        return <FaqView />;
      case 'library':
        return <LibraryView />;
      case 'recipes':
        return <RecipesView />;
      case 'suhoor':
        return <SuhoorView />;
      case 'health-tips':
        return <HealthTipsView />;
      case 'habits':
        return <HabitsView />;
      case 'ehsan':
        return <EhsanView />;
      case 'series':
        return <SeriesView />;
      case 'kids':
        return <KidsView onNavigate={handleNavigate} />;
      case 'designers':
        return <DesignersView />;
      default:
        return (
          <HomeView
            onNavigate={handleNavigate}
            onlineCount={onlineCount}
            totalVisits={totalVisits}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] font-['Cairo',sans-serif] selection:bg-[#D4AF37]/30 selection:text-white pb-24">
      {/* Swinging Ramadan Lanterns */}
      <Lanterns />

      {/* Top Header */}
      <Header
        onOpenSidebar={() => setSidebarOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main View Container */}
      <main className="max-w-4xl mx-auto px-4 pt-20">
        {renderCurrentView()}
      </main>

      {/* Navigation Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        installPrompt={deferredPrompt}
        onInstall={handleInstallApp}
      />

      {/* Persistent Bottom Bar */}
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
