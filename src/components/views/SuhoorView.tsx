import React, { useEffect, useState } from 'react';
import { SUHOOR_DATA, SuhoorRecipe } from '../../data/suhoorData';

export const SuhoorView: React.FC = () => {
  const [activeCat, setActiveCat] = useState<'all' | 'بقوليات' | 'بيض' | 'خفيف' | 'ألبان'>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<SuhoorRecipe | null>(null);
  const [countdown, setCountdown] = useState<string>('00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const fajr = new Date();
      fajr.setHours(4, 30, 0, 0);
      if (now > fajr) fajr.setDate(fajr.getDate() + 1);

      const diff = Math.max(0, fajr.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filtered = SUHOOR_DATA.filter((r) => {
    const matchesCat = activeCat === 'all' || r.category === activeCat;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.ings.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-1">
          موسوعة السحور 2027
        </h1>
        <p className="text-sm text-[#FFD700]">
          أكلات وأطباق صحية لطاقة تدوم طوال نهار رمضان المبارك وتمنع العطش
        </p>
      </div>

      {/* Timer Box */}
      <div className="bg-[#0f141e] border-2 border-[#D4AF37] max-w-sm mx-auto p-4 rounded-3xl text-center shadow-lg mb-8">
        <h4 className="text-xs text-gray-300 font-bold mb-1 flex items-center justify-center gap-1.5">
          <i className="fa-solid fa-hourglass-half text-[#D4AF37]" /> متبقي على الإمساك (الفجر)
        </h4>
        <div className="text-3xl font-black font-orbitron text-[#D4AF37] gold-glow tracking-wider">
          {countdown}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'بقوليات', label: 'بقوليات' },
            { id: 'بيض', label: 'بيض' },
            { id: 'خفيف', label: 'سحور خفيف' },
            { id: 'ألبان', label: 'ألبان' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCat(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCat === tab.id
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#0f141e] text-gray-300 border border-white/10 hover:border-[#D4AF37]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-lg mx-auto">
          <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
          <input
            type="text"
            placeholder="ابحث عن أكلة سحور (فول، بيض، زبادي، شوفان)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f141e] border border-[#D4AF37]/30 rounded-2xl pr-11 pl-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            onClick={() => setSelectedRecipe(r)}
            className="bg-[#0f141e] rounded-2xl p-5 border border-white/10 hover:border-[#D4AF37] cursor-pointer transition-all hover:-translate-y-1 shadow flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] bg-black/40 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded font-bold inline-block mb-2">
                📂 {r.category}
              </span>
              <h3 className="text-base font-bold text-gray-100 mb-2 font-amiri">
                {r.title}
              </h3>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#D4AF37] font-semibold">
              <span>عرض المقادير والخطوات</span>
              <i className="fa-solid fa-arrow-left" />
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div
          onClick={() => setSelectedRecipe(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0f141e] border-2 border-[#D4AF37] rounded-3xl p-6 md:p-8 shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-4 left-4 text-gray-400 hover:text-white text-xl p-1"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full font-bold inline-block mb-2">
              {selectedRecipe.category}
            </span>
            <h2 className="text-2xl font-bold font-amiri text-[#D4AF37] mb-4">
              {selectedRecipe.title}
            </h2>

            <div className="mb-4">
              <h4 className="text-xs font-bold text-[#FFD700] mb-2 flex items-center gap-1.5">
                <i className="fa-solid fa-cart-shopping" /> المقادير:
              </h4>
              <ul className="grid grid-cols-2 gap-1.5 text-xs">
                {selectedRecipe.ings.map((item, idx) => (
                  <li
                    key={idx}
                    className="bg-black/30 border-r-2 border-[#D4AF37] p-2 rounded text-gray-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#FFD700] mb-2 flex items-center gap-1.5">
                <i className="fa-solid fa-fire-burner" /> طريقة التحضير:
              </h4>
              <p className="bg-black/40 p-3.5 rounded-xl text-xs md:text-sm text-gray-200 leading-relaxed border border-white/5">
                {selectedRecipe.steps}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
