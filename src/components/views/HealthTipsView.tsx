import React, { useState } from 'react';
import { HEALTH_TIPS_DATA } from '../../data/healthTipsData';

export const HealthTipsView: React.FC = () => {
  const [search, setSearch] = useState<string>('');

  let tipCounter = 0;

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-1">
          ١٠٠ سلوك صحي في رمضان
        </h1>
        <p className="text-sm text-gray-300">
          دليلك الطبي والغذائي الشامل لصيام مريح وبلا تعب أو إرهاق
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-8 relative">
        <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
        <input
          type="text"
          placeholder="ابحث عن نصيحة (ماء، سحور، نوم، رياضة)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0f141e] border border-[#D4AF37]/30 rounded-2xl pr-11 pl-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] shadow"
        />
      </div>

      {/* Categories & Tips */}
      <div className="space-y-8">
        {HEALTH_TIPS_DATA.map((cat) => {
          const filteredItems = cat.items.filter((item) =>
            item.toLowerCase().includes(search.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={cat.cat} className="space-y-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37]/20 to-transparent p-3 rounded-xl border-r-4 border-[#D4AF37]">
                <i className={`fa-solid ${cat.icon} text-[#D4AF37] text-lg`} />
                <h3 className="text-lg font-bold text-white font-amiri">{cat.cat}</h3>
                <span className="text-xs text-gray-400 mr-auto font-sans">
                  ({filteredItems.length} نصيحة)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((tip, idx) => {
                  tipCounter++;
                  return (
                    <div
                      key={idx}
                      className="bg-[#0f141e] rounded-2xl p-4 border border-white/5 hover:border-[#D4AF37]/40 flex items-start gap-3 transition-all hover:-translate-y-0.5 shadow-sm"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {tipCounter}
                      </div>
                      <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
