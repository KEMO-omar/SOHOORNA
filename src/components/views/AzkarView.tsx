import React, { useState } from 'react';
import {
  EVENING_AZKAR,
  GENERAL_AZKAR,
  MORNING_AZKAR,
  PRAYER_AZKAR,
  ZekrItem,
} from '../../data/azkarData';

export const AzkarView: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'morning' | 'prayer' | 'evening' | 'general'>('all');

  const handleCount = (key: string, max: number) => {
    setCounts((prev) => {
      const current = prev[key] || 0;
      if (current < max) {
        if (navigator.vibrate) navigator.vibrate(30);
        return { ...prev, [key]: current + 1 };
      }
      return prev;
    });
  };

  const resetCategory = (prefix: string) => {
    setCounts((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(prefix)) delete copy[k];
      });
      return copy;
    });
  };

  const renderSection = (
    title: string,
    prefix: string,
    items: ZekrItem[],
    icon: string
  ) => {
    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4 border-r-4 border-[#D4AF37] pr-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] font-amiri flex items-center gap-2">
            <span>{icon}</span> {title}
          </h2>
          <button
            onClick={() => resetCategory(prefix)}
            className="text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 hover:border-[#D4AF37]/30 transition-all"
          >
            <i className="fa-solid fa-rotate-left" /> تصفير
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => {
            const key = `${prefix}-${idx}`;
            const currentCount = counts[key] || 0;
            const isCompleted = currentCount >= item.r;

            return (
              <div
                key={key}
                className={`bg-[#0f141e] rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'border-[#39FF14]/50 shadow-sm shadow-[#39FF14]/20'
                    : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                }`}
              >
                <div>
                  <span className="text-xs text-[#D4AF37] italic font-semibold block mb-2">
                    ✨ {item.h}
                  </span>
                  <p className="text-base md:text-lg font-amiri leading-loose text-gray-100 mb-4 select-text">
                    {item.t}
                  </p>
                </div>

                <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-400 font-semibold">
                    المطلوب: {item.r} مرة
                  </span>
                  <button
                    onClick={() => handleCount(key, item.r)}
                    disabled={isCompleted}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isCompleted
                        ? 'bg-[#39FF14] text-black cursor-default'
                        : 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black active:scale-95 border border-[#D4AF37]/40'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <i className="fa-solid fa-circle-check" />
                        <span>اكتمل الذكر ({item.r})</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-fingerprint" />
                        <span>{currentCount > 0 ? `تم ${currentCount} من ${item.r}` : 'اضغط للتسبيح'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-2">
          الموسوعة الرمضانية للأذكار
        </h1>
        <p className="text-sm text-gray-300">
          أكثر من 40 ذكراً ودعاءً مأثوراً لتنور يومك وليلتك في شهر البركات
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none justify-center flex-wrap">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'morning', label: '☀️ أذكار الصباح' },
          { id: 'prayer', label: '🕌 أدعية الصلاة' },
          { id: 'evening', label: '🌙 أذكار المساء والغروب' },
          { id: 'general', label: '🤲 أدعية جامعة' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'bg-[#0f141e] text-gray-300 border border-white/10 hover:border-[#D4AF37]/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      {(activeTab === 'all' || activeTab === 'morning') &&
        renderSection('أذكار الصباح والاستيقاظ', 'morning', MORNING_AZKAR, '☀️')}

      {(activeTab === 'all' || activeTab === 'prayer') &&
        renderSection('أدعية الصلاة والقيام', 'prayer', PRAYER_AZKAR, '🕌')}

      {(activeTab === 'all' || activeTab === 'evening') &&
        renderSection('أذكار المساء والغروب', 'evening', EVENING_AZKAR, '🌙')}

      {(activeTab === 'all' || activeTab === 'general') &&
        renderSection('أدعية رمضانية جامعة', 'general', GENERAL_AZKAR, '🤲')}
    </div>
  );
};
