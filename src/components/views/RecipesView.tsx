import React, { useState } from 'react';
import { RECIPES_DATA, Recipe } from '../../data/recipesData';

export const RecipesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'الكل' | 'أكلات مصرية' | 'حلويات'>('الكل');
  const [search, setSearch] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filtered = RECIPES_DATA.filter((r) => {
    const matchesCat = selectedCategory === 'الكل' || r.cat === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.ing.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleShareWhatsApp = (recipe: Recipe) => {
    const text = `شوف طريقة عمل "${recipe.title}" من موسوعة سفرة رمضان بسحورنا 2027 🌙🥘\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-2">
          موسوعة سفرة رمضان
        </h1>
        <p className="text-sm text-gray-300 max-w-xl mx-auto">
          أشهى الوصفات المصرية الأصيلة والحلويات الشرقية المختارة بعناية لتزيين مائدتك طوال الشهر الفضيل
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-center gap-2 flex-wrap">
          {(['الكل', 'أكلات مصرية', 'حلويات'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#0f141e] text-gray-300 border border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-lg mx-auto">
          <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
          <input
            type="text"
            placeholder="ابحث عن وصفة (ملوخية، بسبوسة، كنافة، كشري)..."
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
            key={r.title}
            onClick={() => setSelectedRecipe(r)}
            className="bg-[#0f141e] rounded-2xl p-5 border border-[#D4AF37]/20 hover:border-[#D4AF37] cursor-pointer transition-all hover:-translate-y-1 shadow flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] bg-black/40 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-md font-bold inline-block mb-3">
                {r.cat}
              </span>
              <h3 className="text-lg font-bold text-gray-100 mb-2 font-amiri">
                {r.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2">
                المكونات: {r.ing.join('، ')}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#D4AF37] font-bold">
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
            className="w-full max-w-xl max-h-[85vh] bg-[#0f141e] border-2 border-[#D4AF37] rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl relative overflow-hidden"
          >
            <button
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-4 left-4 text-gray-400 hover:text-white text-xl p-1"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            <div className="overflow-y-auto pr-1">
              <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full font-bold inline-block mb-2">
                {selectedRecipe.cat}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-amiri text-[#D4AF37] mb-4">
                {selectedRecipe.title}
              </h2>

              {/* Ingredients */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#FFD700] mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-basket-shopping" /> المكونات والمقادير:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedRecipe.ing.map((item, idx) => (
                    <li
                      key={idx}
                      className="bg-black/30 border-r-2 border-[#D4AF37] p-2 rounded text-gray-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#FFD700] mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-kitchen-set" /> طريقة التحضير خطوة بخطوة:
                </h4>
                <div className="bg-black/40 p-4 rounded-2xl text-xs md:text-sm text-gray-200 leading-loose whitespace-pre-line border border-white/5">
                  {selectedRecipe.step}
                </div>
              </div>

              {/* WhatsApp Share Button */}
              <button
                onClick={() => handleShareWhatsApp(selectedRecipe)}
                className="w-full py-3 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <i className="fa-brands fa-whatsapp text-lg" />
                <span>مشاركة الوصفة عبر واتساب</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
