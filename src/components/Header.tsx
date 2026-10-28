import React from 'react';
import { PageId } from '../types';

interface HeaderProps {
  onOpenSidebar: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  theme,
  onToggleTheme,
  currentPage,
  onNavigate,
}) => {
  const pageTitles: Record<PageId, string> = {
    home: 'سحورنا 2027',
    prayers: 'مواقيت الصلاة',
    quran: 'المصحف الشريف',
    khatma: 'متابعة الختمة',
    azkar: 'أذكار المسلم',
    tasbih: 'المسبحة الإلكترونية',
    zakat: 'حاسبة الزكاة',
    faq: 'فتاوى الصيام',
    library: 'المكتبة الدينية',
    recipes: 'وصفات الفطور',
    suhoor: 'نصائح السحور',
    'health-tips': 'صحتك في رمضان',
    habits: 'متبع العادات',
    ehsan: 'أعمال الخير والإحسان',
    series: 'جدول المسلسلات',
    kids: 'ركن الأطفال',
    designers: 'فريق العمل',
  };

  const handleShare = async () => {
    const text = '🌙 اكتشف منصة سحورنا 2027 الشاملة لخدمات رمضان: مواقيت، مصحف، أذكار، ووصفات!';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'سحورنا 2027 | SOHOORNA',
          text,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert('تم نسخ رابط منصة سحورنا بنجاح!');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#030508]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Menu & Theme toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSidebar}
            className="w-10 h-10 rounded-xl bg-[#0f141e] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all shadow-sm"
            aria-label="القائمة الجانبية"
          >
            <i className="fa-solid fa-bars-staggered" />
          </button>

          <button
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-xl bg-[#0f141e] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all shadow-sm"
            aria-label="تبديل المظهر"
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
          </button>
        </div>

        {/* Center: Title / Breadcrumb */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/sohoorna.png" alt="logo" className="w-7 h-7 rounded-lg border border-[#D4AF37]" />
          <span className="font-amiri font-bold text-lg md:text-xl text-[#D4AF37] gold-glow truncate">
            {pageTitles[currentPage] || 'سحورنا 2027'}
          </span>
        </div>

        {/* Right: Share button */}
        <div className="flex items-center gap-2">
          {currentPage !== 'home' && (
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-[#0f141e] border border-white/10 text-gray-300 flex items-center justify-center hover:text-white transition-all text-sm"
              title="الرئيسية"
            >
              <i className="fa-solid fa-house" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-xl bg-[#0f141e] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all shadow-sm"
            title="مشاركة المنصة"
          >
            <i className="fa-solid fa-share-nodes" />
          </button>
        </div>
      </div>
    </header>
  );
};
