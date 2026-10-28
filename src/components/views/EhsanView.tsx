import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { IHSAN_TASKS } from '../../data/ihsanData';

export const EhsanView: React.FC = () => {
  const [completed, setCompleted] = useState<number[]>(() => {
    const saved = localStorage.getItem('ihsan_pro_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    localStorage.setItem('ihsan_pro_v3', JSON.stringify(completed));
  }, [completed]);

  const toggleFlip = (day: number) => {
    setFlippedCards((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const completeTask = (e: React.MouseEvent, day: number) => {
    e.stopPropagation();
    if (!completed.includes(day)) {
      setCompleted((prev) => [...prev, day]);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFD700', '#ffffff'],
      });
    }
  };

  const progress = Math.round((completed.length / 30) * 100);

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <div className="text-4xl mb-2">✨</div>
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-1">
          تحدي الإحسان
        </h1>
        <p className="text-sm text-gray-300">
          30 يوماً من العطاء لترك أثر جميل ونبيل في هذا العالم
        </p>

        {/* Progress bar wrapper */}
        <div className="max-w-md mx-auto mt-6">
          <div className="flex justify-between items-center text-xs font-bold text-[#D4AF37] mb-2">
            <span>{progress}% من الرحلة اكتمل</span>
            <span>({completed.length} من 30 يوماً)</span>
          </div>
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-[#D4AF37]/30">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full transition-all duration-700 shadow-[0_0_12px_#D4AF37]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 30 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {IHSAN_TASKS.map((task, i) => {
          const day = i + 1;
          const isDone = completed.includes(day);
          const isFlipped = flippedCards[day] || isDone;

          return (
            <div
              key={day}
              onClick={() => toggleFlip(day)}
              className="h-48 cursor-pointer select-none"
              style={{ perspective: '1000px' }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 rounded-3xl ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-[#0f141e] border border-[#D4AF37]/30 rounded-3xl flex flex-col items-center justify-center p-3 text-center shadow-md hover:border-[#D4AF37] transition-colors"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-xs text-gray-400 font-semibold mb-1">
                    اليوم
                  </span>
                  <div className="text-4xl font-bold font-orbitron text-[#D4AF37]">
                    {day}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-2">
                    اضغط للكشف عن المهمة
                  </span>
                </div>

                {/* Back */}
                <div
                  className={`absolute inset-0 rounded-3xl p-4 flex flex-col justify-between text-center border [transform:rotateY(180deg)] shadow-xl ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-500/60'
                      : 'bg-gradient-to-br from-[#1c180e] to-[#0c0d10] border-[#D4AF37]'
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="text-xs text-gray-100 font-medium leading-relaxed my-auto">
                    {task}
                  </p>

                  <div className="pt-2">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                        <i className="fa-solid fa-circle-check text-sm" /> تم الإحسان
                      </span>
                    ) : (
                      <button
                        onClick={(e) => completeTask(e, day)}
                        className="w-full py-1.5 px-2 bg-[#D4AF37] hover:bg-[#b38f00] text-black font-bold text-xs rounded-xl shadow active:scale-95 transition-all"
                      >
                        تم الإحسان ✅
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
