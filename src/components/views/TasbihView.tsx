import React, { useEffect, useState } from 'react';

export const TasbihView: React.FC = () => {
  const adhkars = [
    'سبحان الله',
    'الحمد لله',
    'الله أكبر',
    'لا إله إلا الله',
    'أستغفر الله',
    'صلِ على محمد',
  ];

  const [activeDhikr, setActiveDhikr] = useState<string>(adhkars[0]);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(() => {
    return parseInt(localStorage.getItem('pp_grand') || '0', 10);
  });
  const [mode, setMode] = useState<'wood' | 'digital'>('wood');
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('pp_name') || 'ذاكر الله';
  });
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('pp_grand', grandTotal.toString());
  }, [grandTotal]);

  useEffect(() => {
    localStorage.setItem('pp_name', userName);
  }, [userName]);

  const handleTap = () => {
    const nextCount = sessionCount + 1;
    setSessionCount(nextCount);
    setGrandTotal((prev) => prev + 1);

    if (navigator.vibrate) {
      navigator.vibrate(nextCount % 33 === 0 ? 150 : 40);
    }

    if (mode === 'wood') {
      setRotationAngle((prev) => prev - 30);
    }
  };

  const handleReset = () => {
    if (window.confirm('هل تريد تصفير عداد الجلسة الحالية؟')) {
      setSessionCount(0);
    }
  };

  return (
    <div className="pb-28 pt-6 max-w-xl mx-auto px-4 text-center">
      {/* User Greeting & Dhikr Title */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="bg-black/40 border border-[#D4AF37]/30 rounded-xl px-3 py-1 text-xs text-center text-[#D4AF37] font-bold focus:outline-none max-w-[160px]"
            placeholder="اسمك الكريم..."
          />
        </div>
        <h1 className="text-3xl font-black text-[#D4AF37] font-amiri gold-glow">
          يا {userName}، رطب لسانك بذكر الله
        </h1>
      </div>

      {/* Mode Switcher */}
      <div className="inline-flex bg-[#0f141e] border border-[#D4AF37]/30 rounded-2xl p-1 mb-6 shadow-md">
        <button
          onClick={() => setMode('wood')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mode === 'wood'
              ? 'bg-[#D4AF37] text-black shadow'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-circle-nodes" />
          <span>مسبحة خشبية مصرية</span>
        </button>
        <button
          onClick={() => setMode('digital')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mode === 'digital'
              ? 'bg-[#D4AF37] text-black shadow'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-bolt" />
          <span>مسبحة رقمية إلكترونية</span>
        </button>
      </div>

      {/* Dhikr Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none justify-center flex-wrap">
        {adhkars.map((text) => (
          <button
            key={text}
            onClick={() => setActiveDhikr(text)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeDhikr === text
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'bg-[#0f141e] text-gray-300 border border-white/10 hover:border-[#D4AF37]/40'
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      {/* Active Dhikr banner */}
      <div className="bg-[#0f141e] border border-[#D4AF37]/30 rounded-2xl py-3 px-6 mb-6 inline-block shadow-inner">
        <span className="text-xl md:text-2xl font-bold font-amiri text-[#FFD700]">
          {activeDhikr}
        </span>
      </div>

      {/* Main Counter Display */}
      <div className="font-orbitron text-6xl md:text-7xl font-black text-[#D4AF37] gold-glow mb-4 select-none">
        {sessionCount}
      </div>

      {/* Interactive Representation: 3D Wood Rosary vs Digital */}
      {mode === 'wood' ? (
        <div
          onClick={handleTap}
          className="h-[320px] w-full flex justify-center items-center cursor-pointer relative select-none"
          style={{ perspective: '1200px' }}
        >
          <div
            className="relative w-48 h-48 transition-transform duration-300 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotationAngle}deg)`,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-16 rounded-full shadow-2xl flex items-center justify-center border border-amber-900/60"
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, #c68a4c 0%, #8c5828 45%, #4a2810 100%)',
                  transform: `rotateX(${i * 30}deg) translateZ(120px)`,
                  boxShadow: 'inset -5px -5px 12px rgba(0,0,0,0.6)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-amber-200/40" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 text-xs text-gray-400 font-semibold flex items-center gap-1.5">
            <i className="fa-solid fa-hand-pointer text-[#D4AF37] animate-bounce" /> اضغط في أي مكان لتمرير حبات المسبحة
          </div>
        </div>
      ) : (
        /* Digital LCD Device */
        <div className="flex flex-col items-center justify-center my-6">
          <div className="w-64 bg-[#181a1f] border-4 border-[#333] rounded-[40px] rounded-b-[70px] p-6 shadow-2xl flex flex-col items-center">
            {/* LCD Screen */}
            <div className="w-full h-20 bg-[#9fb39f] border-4 border-[#111] rounded-xl flex items-center justify-center font-orbitron text-4xl font-black text-black shadow-inner mb-6 tracking-widest">
              {sessionCount.toString().padStart(4, '0')}
            </div>

            {/* Tap Trigger Button */}
            <button
              onClick={handleTap}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FFD700] via-[#D4AF37] to-[#8b6e00] border-4 border-[#222] shadow-[0_8px_0_#111] active:translate-y-2 active:shadow-[0_2px_0_#111] cursor-pointer flex items-center justify-center transition-transform"
            >
              <i className="fa-solid fa-fingerprint text-4xl text-black/80" />
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-[#0f141e] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow"
        >
          <i className="fa-solid fa-rotate-left" /> تصفير العداد
        </button>
        <button
          onClick={() => setMode(mode === 'wood' ? 'digital' : 'wood')}
          className="px-4 py-2 bg-[#0f141e] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow"
        >
          <i className="fa-solid fa-arrows-rotate" /> تغيير المظهر
        </button>
      </div>

      {/* Grand Total Footer Badge */}
      <div className="mt-8 pt-4 border-t border-[#D4AF37]/15">
        <div className="inline-flex flex-col items-center bg-[#0f141e] border border-[#D4AF37]/40 rounded-full px-6 py-2 shadow-lg">
          <span className="text-[10px] text-gray-400 font-semibold">
            مجموع التسبيح الكلي للمستخدم
          </span>
          <b className="font-orbitron text-xl text-[#D4AF37] font-bold">
            {grandTotal.toLocaleString()}
          </b>
        </div>
      </div>
    </div>
  );
};
