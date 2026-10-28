import React, { useEffect, useState } from 'react';
import { HabitItem } from '../../types';

export const HabitsView: React.FC = () => {
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('sohoorna_pro_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 1,
        name: 'المحافظة على صلاة الفجر في وقتها',
        type: 'good',
        startTime: Date.now() - 3 * 86400000,
        relapses: 0,
        quote: 'أنت تبني مستقبلك الآن.',
      },
      {
        id: 2,
        name: 'التوقف عن تصفح الهاتف قبل النوم',
        type: 'bad',
        startTime: Date.now() - 5 * 86400000,
        relapses: 1,
        quote: 'قوة إرادتك هي سلاحك.',
      },
    ];
  });

  const [inputName, setInputName] = useState<string>('');
  const [inputType, setInputType] = useState<'good' | 'bad'>('good');
  const [now, setNow] = useState<number>(Date.now());

  const motivationalQuotes = {
    good: [
      'أنت تبني مستقبلك وآخرتك الآن.',
      'الاستمرار هو سر النجاح والبركة.',
      'خطوة بخطوة تصل للقمة بإذن الله.',
      'عظيم! استمر في التقدم والخير.',
    ],
    bad: [
      'قوة إرادتك هي سلاحك الحقيقي.',
      'أنت حر، لا تجعل العادة تقيدك.',
      'كل ثانية هي انتصار جديد لك.',
      'تذكر دائماً لماذا بدأت هذا التحدي.',
    ],
  };

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('sohoorna_pro_v1', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!inputName.trim()) return;
    const quotes = motivationalQuotes[inputType];
    const newHabit: HabitItem = {
      id: Date.now(),
      name: inputName.trim(),
      type: inputType,
      startTime: Date.now(),
      relapses: 0,
      quote: quotes[Math.floor(Math.random() * quotes.length)],
    };
    setHabits([newHabit, ...habits]);
    setInputName('');
  };

  const handleReset = (id: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const quotes = motivationalQuotes[h.type];
          return {
            ...h,
            startTime: Date.now(),
            relapses: h.type === 'bad' ? h.relapses + 1 : h.relapses,
            quote: quotes[Math.floor(Math.random() * quotes.length)],
          };
        }
        return h;
      })
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل تريد حذف هذا التحدي من قائمة عاداتك؟')) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    }
  };

  return (
    <div className="pb-24 pt-6 max-w-xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <span className="text-xs text-[#D4AF37] font-orbitron tracking-widest block mb-1">
          HABIT TRACKER PRO
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-1">
          مُتبع العادات الرمضاني
        </h1>
        <p className="text-sm text-gray-300">
          راقب صمودك في بناء العادات الصالحة والتخلص من العادات السلبية
        </p>
      </div>

      {/* Add Habit Form */}
      <div className="bg-[#0f141e] rounded-3xl p-6 border border-[#D4AF37]/30 shadow-xl mb-8 space-y-3">
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5">
          <i className="fa-solid fa-pen-nib text-[#D4AF37]" />
          <input
            type="text"
            placeholder="اسم التحدي (مثلاً: قيام الليل، قراءة جزء يومياً)..."
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5">
          <i className="fa-solid fa-layer-group text-[#D4AF37]" />
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as any)}
            className="w-full bg-transparent text-sm text-white focus:outline-none"
          >
            <option value="good" className="bg-[#0f141e] text-white">
              بناء عادة حميدة (إيجابية)
            </option>
            <option value="bad" className="bg-[#0f141e] text-white">
              الإقلاع عن عادة سيئة
            </option>
          </select>
        </div>

        <button
          onClick={addHabit}
          className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#b38f00] text-black font-bold text-sm rounded-2xl shadow-lg transition-transform active:scale-95"
        >
          ابدأ رحلة التحدي الآن
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-5">
        {habits.map((h) => {
          const diff = Math.max(0, now - h.startTime);
          const d = Math.floor(diff / 86400000);
          const hrs = Math.floor((diff % 86400000) / 3600000);
          const mins = Math.floor((diff % 3600000) / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          const progress = Math.min((d / 30) * 100, 100);

          return (
            <div
              key={h.id}
              className="bg-[#0f141e] rounded-3xl p-6 border border-[#D4AF37]/20 shadow-lg relative"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-white flex-1">{h.name}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    h.type === 'bad'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {h.type === 'bad' ? 'إقلاع' : 'بناء'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-4 border border-white/5">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-500 rounded-full shadow-[0_0_8px_#D4AF37]"
                  style={{ width: `${Math.max(3, progress)}%` }}
                />
              </div>

              {/* Counter Grid */}
              <div className="grid grid-cols-4 gap-2 text-center my-3">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="block font-orbitron text-xl font-bold text-white">
                    {d.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-gray-400">يوم</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="block font-orbitron text-xl font-bold text-white">
                    {hrs.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-gray-400">ساعة</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="block font-orbitron text-xl font-bold text-white">
                    {mins.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-gray-400">دقيقة</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="block font-orbitron text-xl font-bold text-[#D4AF37]">
                    {secs.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-gray-400">ثانية</span>
                </div>
              </div>

              {/* Quote */}
              <div className="text-center text-xs text-gray-300 italic my-3">
                "{h.quote}"
              </div>

              {h.type === 'bad' && (
                <div className="text-center text-xs text-red-400 font-semibold mb-3">
                  مرات التعثر السابقة: {h.relapses}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleReset(h.id)}
                  className="flex-1 py-2 rounded-xl border border-white/10 hover:border-[#D4AF37] text-xs font-bold text-gray-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-arrows-rotate" />
                  <span>{h.type === 'bad' ? 'تعثرتُ اليوم (إعادة المحاولة)' : 'تصفير العداد'}</span>
                </button>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-sm"
                  title="حذف"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
