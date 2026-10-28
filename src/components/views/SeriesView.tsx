import React, { useEffect, useState } from 'react';
import { SERIES_DATA, SeriesItem } from '../../data/seriesData';

export const SeriesView: React.FC = () => {
  const [watched, setWatched] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('sohoorna_watched');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  const [activeChip, setActiveChip] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('sohoorna_watched', JSON.stringify(watched));
  }, [watched]);

  const updateWatch = (name: string, delta: number) => {
    setWatched((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta),
    }));
  };

  const handleShare = async (item: SeriesItem) => {
    const siteUrl = window.location.href;
    const shareText = `🌙 مسلسل: ${item.name}\n🎭 بطولة: ${item.stars}\n📺 القناة: ${item.channels}\n📝 نبذة: ${item.notes}\n\nتابع مواعيد مسلسلات رمضان 2027 عبر موقع سحورنا:\n${siteUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `مسلسل ${item.name} - سحورنا`,
          text: shareText,
          url: siteUrl,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('تم نسخ تفاصيل المسلسل ورابط الموقع بنجاح!');
    }
  };

  const filtered = SERIES_DATA.filter((s) => {
    const matchesFilter =
      activeChip === 'all' ? true : s.notes.includes(activeChip);
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.stars.toLowerCase().includes(search.toLowerCase()) ||
      s.channels.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pb-24 pt-6 max-w-xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <i className="fa-solid fa-film text-3xl text-[#D4AF37] mb-2" />
        <h1 className="text-3xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-1">
          دليل مسلسلات رمضان 2027
        </h1>
        <p className="text-sm text-gray-300">
          جدول المسلسلات، القنوات الناقلة، ومتبع الحلقات الشخصي
        </p>
      </div>

      {/* Sticky Search & Chips */}
      <div className="sticky top-16 z-20 bg-[#030508]/90 backdrop-blur-md py-3 mb-6 space-y-3">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
          <input
            type="text"
            placeholder="ابحث عن مسلسل، ممثل، أو قناة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f141e] border border-[#D4AF37]/30 rounded-2xl pr-11 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'كوميديا', label: 'كوميديا' },
            { id: 'دراما', label: 'دراما' },
            { id: 'أكشن', label: 'أكشن' },
            { id: 'تشويق', label: 'تشويق' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveChip(chip.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeChip === chip.id
                  ? 'bg-[#D4AF37] text-black shadow'
                  : 'bg-[#0f141e] text-gray-300 border border-white/10 hover:border-[#D4AF37]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Series Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const episodesWatched = watched[item.name] || 0;
          return (
            <div
              key={item.name}
              className="bg-[#0f141e] rounded-3xl p-5 border border-white/10 hover:border-[#D4AF37]/50 shadow-md transition-all"
            >
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="text-lg font-bold text-[#D4AF37] font-amiri flex-1">
                  {item.name}
                </h3>
                <span className="text-[11px] bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-bold px-2.5 py-0.5 rounded-lg shrink-0">
                  {item.channels}
                </span>
              </div>

              <div className="text-xs text-gray-300 mb-2 flex items-center gap-1.5 font-medium">
                <i className="fa-solid fa-star text-amber-400 text-[10px]" />
                <span>{item.stars}</span>
              </div>

              <div className="text-xs text-gray-400 bg-black/30 p-2.5 rounded-xl border-r-2 border-[#D4AF37] mb-3 leading-relaxed">
                {item.notes}
              </div>

              {/* Episode Tracker & Share */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-semibold">حلقاتي:</span>
                  <button
                    onClick={() => updateWatch(item.name, -1)}
                    className="w-7 h-7 rounded-lg bg-black/40 text-gray-200 border border-white/10 flex items-center justify-center font-bold hover:border-[#D4AF37]"
                  >
                    -
                  </button>
                  <span className="font-orbitron font-bold text-sm text-[#FFD700] px-1">
                    {episodesWatched}
                  </span>
                  <button
                    onClick={() => updateWatch(item.name, 1)}
                    className="w-7 h-7 rounded-lg bg-black/40 text-gray-200 border border-white/10 flex items-center justify-center font-bold hover:border-[#D4AF37]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleShare(item)}
                  className="px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-xs font-bold flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-share-nodes" />
                  <span>مشاركة</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
