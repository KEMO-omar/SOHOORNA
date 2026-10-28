import React, { useState } from 'react';
import { PROPHETS_DATA, Prophet } from '../../data/prophetsData';

export const LibraryView: React.FC = () => {
  const [selectedProphet, setSelectedProphet] = useState<Prophet | null>(null);
  const [search, setSearch] = useState<string>('');
  const [activeFont, setActiveFont] = useState<string>('Cairo');
  const [readerTheme, setReaderTheme] = useState<'night' | 'light' | 'sepia'>('night');
  const [fontSizeRem, setFontSizeRem] = useState<number>(1.25);

  const fonts = [
    { id: 'Cairo', label: 'أصلي' },
    { id: 'Amiri', label: 'عثماني' },
    { id: 'Reem Kufi', label: 'كوفي' },
    { id: 'Tajawal', label: 'تجوال' },
    { id: 'Aref Ruqaa', label: 'رقعة' },
    { id: 'Scheherazade New', label: 'تراث' },
  ];

  const filtered = PROPHETS_DATA.filter(
    (p) => p.n.includes(search) || p.s.includes(search)
  );

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-1">
          المكتبة الدينية - قصص الأنبياء
        </h1>
        <p className="text-sm text-gray-300">
          تأمل في سير الأنبياء والمرسلين والدروس الإيمانية المستفادة من حياتهم
        </p>
      </div>

      {/* Top Controls: Search & Font selector */}
      <div className="bg-[#0f141e] p-4 rounded-2xl border border-[#D4AF37]/30 shadow-lg mb-8 space-y-4">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
          <input
            type="text"
            placeholder="ابحث عن قصة نبي (محمد، يوسف، موسى)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-xl pr-11 pl-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-white/5">
          <span className="text-xs text-[#D4AF37] font-bold">نوع الخط المفضل:</span>
          <div className="flex gap-1.5 flex-wrap">
            {fonts.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFont(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeFont === f.id
                    ? 'bg-[#D4AF37] text-black shadow'
                    : 'bg-black/30 text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prophet) => (
          <div
            key={prophet.n}
            className="bg-[#0f141e] rounded-3xl p-6 border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all flex flex-col justify-between shadow-md hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center text-xl mb-4 border border-[#D4AF37]/30">
                <i className="fa-solid fa-feather-pointed" />
              </div>
              <h3 className="text-xl font-bold text-[#D4AF37] mb-2 font-amiri">
                {prophet.n}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-4">
                {prophet.s}
              </p>
            </div>

            <button
              onClick={() => setSelectedProphet(prophet)}
              className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#b38f00] text-black font-bold text-xs rounded-xl transition-all shadow"
            >
              اقرأ القصة كاملة <i className="fa-solid fa-arrow-left mr-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedProphet && (
        <div
          onClick={() => setSelectedProphet(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl max-h-[85vh] rounded-3xl border-2 flex flex-col shadow-2xl overflow-hidden transition-colors ${
              readerTheme === 'sepia'
                ? 'bg-[#f4ecd8] text-[#5b4636] border-[#d3a13b]'
                : readerTheme === 'light'
                ? 'bg-white text-gray-800 border-amber-500'
                : 'bg-[#0f141e] text-gray-100 border-[#D4AF37]'
            }`}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold font-amiri text-[#D4AF37]">
                قصة {selectedProphet.n}
              </h2>

              {/* Reader Controls: zoom & themes */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSizeRem((prev) => Math.min(2.5, prev + 0.1))}
                  title="تكبير الخط"
                  className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-sm font-bold"
                >
                  <i className="fa-solid fa-plus" />
                </button>
                <button
                  onClick={() => setFontSizeRem((prev) => Math.max(0.9, prev - 0.1))}
                  title="تصغير الخط"
                  className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-sm font-bold"
                >
                  <i className="fa-solid fa-minus" />
                </button>

                {/* Theme buttons */}
                <button
                  onClick={() =>
                    setReaderTheme(
                      readerTheme === 'night'
                        ? 'sepia'
                        : readerTheme === 'sepia'
                        ? 'light'
                        : 'night'
                    )
                  }
                  title="تغيير مظهر القارئ"
                  className="w-8 h-8 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center text-sm font-bold"
                >
                  <i
                    className={`fa-solid ${
                      readerTheme === 'night'
                        ? 'fa-moon'
                        : readerTheme === 'sepia'
                        ? 'fa-book-open'
                        : 'fa-sun'
                    }`}
                  />
                </button>

                <button
                  onClick={() => setSelectedProphet(null)}
                  className="w-8 h-8 rounded-lg bg-red-600/80 text-white flex items-center justify-center text-sm font-bold ml-1"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              className="p-6 md:p-8 overflow-y-auto leading-[2.3] select-text"
              style={{
                fontFamily: activeFont,
                fontSize: `${fontSizeRem}rem`,
              }}
            >
              <div className="whitespace-pre-wrap">{selectedProphet.c}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
