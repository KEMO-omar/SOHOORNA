import React, { useEffect, useRef, useState } from 'react';
import { Surah } from '../../types';

export const QuranView: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<string>('6');
  const [currentPlayingSurah, setCurrentPlayingSurah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const reciters = [
    { id: '6', name: 'ياسر الدوسري' },
    { id: '12', name: 'ماهر المعيقلي' },
    { id: '20', name: 'المنشاوي (مجود)' },
    { id: '2', name: 'عبدالباسط (مجود)' },
    { id: '141', name: 'حسن صالح' },
    { id: '7', name: 'سعود الشريم' },
    { id: '3', name: 'سعد الغامدي' },
    { id: '126', name: 'خالد القحطاني' },
    { id: '117', name: 'هزاع البلوشي' },
    { id: '10', name: 'أحمد العجمي' },
    { id: '100', name: 'محمد جبريل' },
    { id: '8', name: 'ناصر القطامي' },
    { id: '11', name: 'فارس عباد' },
    { id: '97', name: 'محمد حسان' },
    { id: '4', name: 'مشاري العفاسي' },
    { id: '5', name: 'عبدالرحمن السديس' },
    { id: '1', name: 'الحذيفي' },
    { id: '156', name: 'أحمد الحواشي' },
    { id: '9', name: 'مصطفى إسماعيل' },
    { id: '162', name: 'أيمن سويد' },
  ];

  useEffect(() => {
    const fetchQuran = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
        const json = await res.json();
        if (json && json.data && json.data.surahs) {
          setSurahs(json.data.surahs);
        } else {
          throw new Error('فشل جلب المصحف');
        }
      } catch (err: any) {
        setError('تعذر تحميل المصحف الشريف عبر الإنترنت. يرجى التحقق من الاتصال.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuran();
  }, []);

  const playSurah = async (num: number) => {
    setCurrentPlayingSurah(num);
    const primaryUrl = `https://api.quran.com/api/v4/chapter_recitations/${selectedReciter}/${num}`;
    try {
      const res = await fetch(primaryUrl);
      const data = await res.json();
      if (data && data.audio_file && data.audio_file.audio_url) {
        setAudioUrl(data.audio_file.audio_url);
      } else {
        setAudioUrl(`https://download.quranicaudio.com/qdc/misbahi/128/${num}.mp3`);
      }
    } catch {
      setAudioUrl(`https://download.quranicaudio.com/qdc/misbahi/128/${num}.mp3`);
    }

    // Scroll to surah card
    const el = document.getElementById(`surah-${num}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [audioUrl]);

  const handleReciterChange = (newReciterId: string) => {
    setSelectedReciter(newReciterId);
    if (currentPlayingSurah) {
      playSurah(currentPlayingSurah);
    }
  };

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.number.toString().includes(searchQuery) ||
      (s.englishName && s.englishName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pb-28 pt-4 max-w-4xl mx-auto px-3">
      {/* Sticky Top Controls */}
      <div className="sticky top-16 z-30 bg-[#0f141e]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#D4AF37]/30 shadow-xl mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <i className="fa-solid fa-magnifying-glass text-[#D4AF37]" />
            <input
              type="text"
              placeholder="ابحث عن اسم السورة أو رقمها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/30 border border-[#D4AF37]/20 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] w-full"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#D4AF37] font-bold">القارئ:</span>
            <select
              value={selectedReciter}
              onChange={(e) => handleReciterChange(e.target.value)}
              className="bg-[#030508] text-[#D4AF37] border border-[#D4AF37]/40 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
            >
              {reciters.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Mini Audio Player */}
        {currentPlayingSurah && (
          <div className="mt-3 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between gap-3">
            <div className="text-xs text-[#D4AF37] font-bold truncate">
              <i className="fa-solid fa-volume-high ml-1.5 animate-pulse" />
              جاري تشغيل سورة رقم {currentPlayingSurah} ({surahs[currentPlayingSurah - 1]?.name})
            </div>
            <audio
              ref={audioRef}
              controls
              className="h-8 max-w-[240px] rounded-lg"
              onEnded={() => {
                if (currentPlayingSurah < 114) {
                  playSurah(currentPlayingSurah + 1);
                }
              }}
            />
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-[#0f141e] border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-[#D4AF37] font-reem text-lg">جاري فتح المصحف الملكي الشريف...</h3>
          <p className="text-xs text-gray-400 mt-1">يتم جلب نصوص الآيات بدقة الرسم العثماني</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12 bg-red-950/30 border border-red-500/30 rounded-2xl p-6 my-6">
          <i className="fa-solid fa-circle-exclamation text-red-400 text-3xl mb-2" />
          <p className="text-red-200 text-sm font-bold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Surahs List */}
      <div className="space-y-8">
        {filteredSurahs.map((surah) => {
          const isCurrent = currentPlayingSurah === surah.number;
          return (
            <article
              key={surah.number}
              id={`surah-${surah.number}`}
              className={`bg-[#0f141e] rounded-3xl p-6 md:p-8 border transition-all relative ${
                isCurrent
                  ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                  : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
              }`}
            >
              {/* Surah Tag badge */}
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#D4AF37] to-[#b38f00] text-black font-bold text-xs px-3.5 py-1 rounded-full shadow">
                {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} | {surah.ayahs.length} آية | الجزء {surah.ayahs[0]?.juz}
              </div>

              {/* Header */}
              <div className="text-center pb-4 pt-2 border-b border-[#D4AF37]/15 mb-6">
                <h2 className="text-3xl md:text-4xl font-amiri font-bold text-[#D4AF37] mb-2">
                  سورة {surah.name}
                </h2>
                <button
                  onClick={() => playSurah(surah.number)}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#D4AF37] text-black shadow'
                      : 'bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'
                  }`}
                >
                  <i className={`fa-solid ${isCurrent ? 'fa-pause' : 'fa-play'}`} />
                  <span>{isCurrent ? 'جاري الاستماع للسورة' : 'استماع للسورة'}</span>
                </button>
              </div>

              {/* Basmala (except Al-Fatiha and At-Tawbah) */}
              {surah.number !== 1 && surah.number !== 9 && (
                <div className="text-center font-amiri text-2xl md:text-3xl text-gray-200 mb-6 font-bold leading-relaxed">
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </div>
              )}

              {/* Ayahs text container */}
              <div className="font-amiri text-xl md:text-2xl leading-[2.6] text-justify text-gray-100 select-text">
                {surah.ayahs.map((aya) => {
                  let text = aya.text;
                  if (surah.number !== 1 && aya.numberInSurah === 1) {
                    text = text.replace('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', '').trim();
                  }
                  return (
                    <React.Fragment key={aya.number}>
                      <span>{text}</span>
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-bold mx-1.5 align-middle select-none bg-[#D4AF37]/5">
                        {aya.numberInSurah}
                      </span>{' '}
                    </React.Fragment>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
