import React from 'react';
import { PageId } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  installPrompt: any;
  onInstall: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  installPrompt,
  onInstall,
}) => {
  const menuItems: { id: PageId; label: string; icon: string }[] = [
    { id: 'home', label: 'الرئيسية', icon: 'fa-house' },
    { id: 'prayers', label: 'مواقيت الصلاة', icon: 'fa-clock' },
    { id: 'quran', label: 'المصحف الشريف', icon: 'fa-book-quran' },
    { id: 'khatma', label: 'متابعة الختمة', icon: 'fa-file-signature' },
    { id: 'azkar', label: 'أذكار المسلم', icon: 'fa-person-praying' },
    { id: 'tasbih', label: 'المسبحة الإلكترونية', icon: 'fa-toggle-on' },
    { id: 'zakat', label: 'حاسبة الزكاة', icon: 'fa-coins' },
    { id: 'faq', label: 'فتاوى الصيام', icon: 'fa-clipboard-question' },
    { id: 'library', label: 'المكتبة الدينية', icon: 'fa-book-open' },
    { id: 'recipes', label: 'وصفات الفطور', icon: 'fa-plate-wheat' },
    { id: 'suhoor', label: 'نصائح السحور', icon: 'fa-faucet-drip' },
    { id: 'health-tips', label: 'صحتك في رمضان', icon: 'fa-staff-snake' },
    { id: 'habits', label: 'متبع العادات', icon: 'fa-calendar-check' },
    { id: 'ehsan', label: 'أعمال الخير', icon: 'fa-hand-holding-heart' },
    { id: 'series', label: 'جدول المسلسلات', icon: 'fa-film' },
    { id: 'kids', label: 'ركن الأطفال', icon: 'fa-child-reaching' },
    { id: 'designers', label: 'فريق العمل', icon: 'fa-palette' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[290px] bg-[#0c1017] dark:bg-[#0c1017] light:bg-white z-50 transform transition-transform duration-300 ease-in-out border-l border-[#D4AF37]/30 shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 text-center border-b border-[#D4AF37]/20 flex flex-col items-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-[#D4AF37] hover:opacity-80 p-1"
            aria-label="إغلاق القائمة"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
          <img
            src="/sohoorna.png"
            alt="لوجو سحورنا"
            className="w-16 h-16 rounded-2xl border-2 border-[#D4AF37] object-cover shadow-md mb-2"
          />
          <h2 className="text-[#D4AF37] font-bold text-xl font-amiri tracking-wide">سحورنا 2027</h2>
          <span className="text-xs text-gray-400">رفيقك الإيماني طوال الشهر الفضيل</span>
        </div>

        {/* Install button if available */}
        {installPrompt && (
          <div className="p-3">
            <button
              onClick={onInstall}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#b38f00] text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <i className="fa-solid fa-download" />
              <span>تثبيت التطبيق على الجهاز</span>
            </button>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-right transition-all duration-200 text-sm font-semibold ${
                  isActive
                    ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 translate-x-[-4px]'
                    : 'text-gray-200 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
                }`}
              >
                <i
                  className={`fa-solid ${item.icon} w-5 text-center ${
                    isActive ? 'text-black' : 'text-[#D4AF37]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#D4AF37]/20 text-center text-xs text-gray-400">
          سحورنا 2027 &copy; جميع الحقوق محفوظة
        </div>
      </aside>
    </>
  );
};
