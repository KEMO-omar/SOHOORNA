import React from 'react';
import { PageId } from '../types';

interface BottomNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const navTabs: { id: PageId; label: string; icon: string }[] = [
    { id: 'home', label: 'الرئيسية', icon: 'fa-house' },
    { id: 'quran', label: 'المصحف', icon: 'fa-book-open' },
    { id: 'tasbih', label: 'المسبحة', icon: 'fa-circle-dot' },
    { id: 'prayers', label: 'المواقيت', icon: 'fa-clock' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f141e]/95 backdrop-blur-md border-t border-[#D4AF37]/25 py-2.5 px-4 flex justify-around items-center shadow-2xl">
      {navTabs.map((tab) => {
        const isActive = currentPage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center gap-1 transition-transform active:scale-95 ${
              isActive ? 'text-[#D4AF37] font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-xl`} />
            <span className="text-[11px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
