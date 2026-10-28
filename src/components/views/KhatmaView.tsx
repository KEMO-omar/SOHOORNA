import React, { useEffect, useState } from 'react';
import { KhatmaDay, KhatmaState } from '../../types';

export const KhatmaView: React.FC = () => {
  const [tracker, setTracker] = useState<KhatmaState>(() => {
    const saved = localStorage.getItem('ramadan_tracker_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      targetKhatmas: 1,
      days: Array(30)
        .fill(null)
        .map(() => ({ part: '', surah: '', verse: '' })),
    };
  });

  const [savedIndex, setSavedIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('ramadan_tracker_v2', JSON.stringify(tracker));
  }, [tracker]);

  const handleTargetChange = (val: number) => {
    const newTarget = Math.max(1, val);
    setTracker((prev) => ({
      ...prev,
      targetKhatmas: newTarget,
    }));
  };

  const handleDayChange = (index: number, field: keyof KhatmaDay, value: string) => {
    setTracker((prev) => {
      const newDays = [...prev.days];
      newDays[index] = { ...newDays[index], [field]: value };
      return { ...prev, days: newDays };
    });
  };

  const saveDay = (index: number) => {
    setSavedIndex(index);
    setTimeout(() => setSavedIndex(null), 1800);
  };

  const totalParts = tracker.targetKhatmas * 30;
  const partsDone = tracker.days.reduce(
    (acc, day) => acc + (parseFloat(day.part) || 0),
    0
  );
  const partsLeft = Math.max(0, totalParts - partsDone);
  const percent = Math.min(100, (partsDone / totalParts) * 100).toFixed(1);
  const dailySuggested = (totalParts / 30).toFixed(1);

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-2">
          خاتمة رمضان
        </h1>
        <p className="text-sm text-gray-300">
          سجل تلاوتك اليومية وتابع وردك القرآني طوال شهر الخير
        </p>
      </div>

      {/* Plan Settings Card */}
      <div className="bg-[#0f141e] rounded-3xl p-6 border border-[#D4AF37]/30 shadow-xl mb-6">
        <h3 className="text-lg font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-bullseye" /> خطتك الشخصية للختمة
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-black/30 p-3.5 rounded-2xl border border-[#D4AF37]/15">
            <label className="text-xs text-gray-400 block mb-1 font-semibold">
              عدد الختمات المستهدفة
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={tracker.targetKhatmas}
              onChange={(e) => handleTargetChange(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-center text-lg font-bold text-[#FFD700] focus:outline-none"
            />
          </div>

          <div className="bg-black/30 p-3.5 rounded-2xl border border-[#D4AF37]/15">
            <label className="text-xs text-gray-400 block mb-1 font-semibold">
              إجمالي الأجزاء
            </label>
            <div className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-center text-lg font-bold text-gray-200">
              {totalParts} جزء
            </div>
          </div>

          <div className="bg-black/30 p-3.5 rounded-2xl border border-[#D4AF37]/15">
            <label className="text-xs text-gray-400 block mb-1 font-semibold">
              الورد اليومي المقترح
            </label>
            <div className="w-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-center text-lg font-bold text-[#D4AF37]">
              {dailySuggested} جزء
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview Bar */}
      <div className="bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-2xl p-4 mb-8 flex flex-wrap justify-around items-center gap-4 text-center">
        <div>
          <span className="text-xs text-gray-300 block">المنجز:</span>
          <b className="text-2xl text-[#39FF14] font-bold font-amiri">{partsDone}</b> جزء
        </div>
        <div className="w-px h-8 bg-[#D4AF37]/20 hidden sm:block" />
        <div>
          <span className="text-xs text-gray-300 block">المتبقي:</span>
          <b className="text-2xl text-[#FFD700] font-bold font-amiri">{partsLeft}</b> جزء
        </div>
        <div className="w-px h-8 bg-[#D4AF37]/20 hidden sm:block" />
        <div>
          <span className="text-xs text-gray-300 block">نسبة الإنجاز:</span>
          <b className="text-2xl text-[#D4AF37] font-bold font-amiri">{percent}%</b>
        </div>
      </div>

      {/* 30-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracker.days.map((day, i) => {
          const isDone = parseFloat(day.part) > 0;
          return (
            <div
              key={i}
              className={`bg-[#0f141e] rounded-2xl p-5 border transition-all ${
                isDone ? 'border-[#39FF14]/50 bg-[#39FF14]/5' : 'border-[#D4AF37]/20'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-[#D4AF37] text-base">اليوم {i + 1}</span>
                <i
                  className={`fa-solid fa-quran ${
                    isDone ? 'text-[#39FF14]' : 'text-[#D4AF37]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">الجزء</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="0"
                    value={day.part}
                    onChange={(e) => handleDayChange(i, 'part', e.target.value)}
                    className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-xl px-2 py-1.5 text-center text-sm font-semibold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">الآية</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={day.verse}
                    onChange={(e) => handleDayChange(i, 'verse', e.target.value)}
                    className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-xl px-2 py-1.5 text-center text-sm font-semibold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-[11px] text-gray-400 block mb-1">اسم السورة</label>
                <input
                  type="text"
                  placeholder="مثال: البقرة"
                  value={day.surah}
                  onChange={(e) => handleDayChange(i, 'surah', e.target.value)}
                  className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-xl px-3 py-1.5 text-right text-sm text-white focus:outline-none"
                />
              </div>

              <button
                onClick={() => saveDay(i)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  savedIndex === i
                    ? 'bg-[#39FF14] text-black shadow'
                    : 'bg-[#D4AF37] hover:bg-[#b38f00] text-black'
                }`}
              >
                {savedIndex === i ? (
                  <>
                    <i className="fa-solid fa-check ml-1" /> تم الحفظ بنجاح
                  </>
                ) : (
                  'حفظ التقدم'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
