import React, { useState } from 'react';
import { FAQ_DATA, FaqItem } from '../../data/faqData';

export const FaqView: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleShare = async (item: FaqItem, index: number) => {
    const text = `🌙 سؤال في رمضان:\n❓ ${item.q}\n✅ الإجابة: ${item.a}\n📍 لمعرفة المزيد زوروا موقع سحورنا 2027 عبر الرابط:\n${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'فتوى رمضانية', text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopiedId(index);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filtered = FAQ_DATA.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()) ||
      item.c.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const categories = Array.from(new Set(filtered.map((item) => item.c)));

  return (
    <div className="pb-24 pt-6 max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-1">
          ١٠٠ سؤال وجواب في رمضان 🌙
        </h1>
        <p className="text-sm text-gray-300">
          موسوعة الفتاوى الشاملة في أحكام الصيام والمفطرات والعبادات
        </p>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-20 bg-[#030508]/90 backdrop-blur-md py-3 mb-6">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
          <input
            type="text"
            placeholder="ابحث عن فتوى أو مسألة (قطرة، بخاخ، تحليل، سفر)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f141e] border border-[#D4AF37]/30 rounded-2xl pr-11 pl-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] shadow-lg"
          />
        </div>
      </div>

      {/* FAQ Groups */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const catItems = filtered.filter((i) => i.c === cat);
          return (
            <div key={cat} className="space-y-3">
              <div className="flex items-center gap-2 border-r-4 border-[#D4AF37] pr-3 text-[#D4AF37] font-bold text-lg font-amiri">
                <i className="fa-solid fa-book-bookmark text-sm" />
                <span>{cat}</span>
                <span className="text-xs text-gray-400 font-sans mr-auto">
                  ({catItems.length} سؤال)
                </span>
              </div>

              <div className="space-y-2.5">
                {catItems.map((item, idx) => {
                  const globalIdx = FAQ_DATA.indexOf(item);
                  const isOpen = openIndex === globalIdx;

                  return (
                    <div
                      key={globalIdx}
                      className={`bg-[#0f141e] rounded-2xl border transition-all overflow-hidden ${
                        isOpen
                          ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15'
                          : 'border-white/10 hover:border-[#D4AF37]/40'
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(globalIdx)}
                        className="w-full text-right p-4 md:p-5 flex justify-between items-start gap-4 transition-colors hover:bg-white/[0.02]"
                      >
                        <span className="text-sm md:text-base font-bold text-gray-100 flex-1 leading-snug">
                          {item.q}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-transform duration-300 shrink-0 ${
                            isOpen
                              ? 'bg-[#D4AF37] text-black rotate-180'
                              : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                          }`}
                        >
                          <i className="fa-solid fa-chevron-down" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-sm text-gray-300 leading-relaxed border-t border-white/5 bg-black/20">
                          <p className="mb-4">{item.a}</p>
                          <button
                            onClick={() => handleShare(item, globalIdx)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-xs font-bold"
                          >
                            <i className="fa-solid fa-share-nodes" />
                            <span>
                              {copiedId === globalIdx
                                ? 'تم نسخ الفتوى والرابط!'
                                : 'مشاركة الفتوى والرابط'}
                            </span>
                          </button>
                        </div>
                      )}
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
