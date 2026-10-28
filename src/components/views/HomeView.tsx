import React, { useEffect, useState } from 'react';
import { PageId } from '../../types';

interface HomeViewProps {
  onNavigate: (page: PageId) => void;
  onlineCount: number;
  totalVisits: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onlineCount,
  totalVisits,
}) => {
  const [hijriDate, setHijriDate] = useState<string>('جاري تحديد التاريخ...');
  const [locationStatus, setLocationStatus] = useState<string>('جاري تحديد الموقع...');
  const [nextTitle, setNextTitle] = useState<string>('جاري الحساب...');
  const [countdown, setCountdown] = useState<{ h: string; m: string; s: string }>({
    h: '00',
    m: '00',
    s: '00',
  });

  useEffect(() => {
    let timerId: any = null;
    let coords: { lat: number; lng: number } = { lat: 30.0444, lng: 31.2357 };

    const updateTimes = async () => {
      try {
        const now = new Date();
        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${Math.floor(now.getTime() / 1000)}?latitude=${coords.lat}&longitude=${coords.lng}&method=4`
        );
        const json = await res.json();
        if (json && json.data) {
          const { timings, date } = json.data;
          setHijriDate(`${date.hijri.day} ${date.hijri.month.ar} ${date.hijri.year}هـ`);

          const parseTime = (timeStr: string) => {
            const [hours, minutes] = timeStr.split(':');
            const d = new Date();
            d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            return d;
          };

          const fajrTime = parseTime(timings.Fajr);
          const maghribTime = parseTime(timings.Maghrib);

          let targetDate: Date;
          let label = '';

          if (now < fajrTime) {
            targetDate = fajrTime;
            label = 'باقي على الإمساك (الفجر)';
          } else if (now < maghribTime) {
            targetDate = maghribTime;
            label = 'باقي على الإفطار (المغرب)';
          } else {
            targetDate = new Date(fajrTime.getTime() + 86400000);
            label = 'باقي على السحور والإمساك القادم';
          }

          const diff = Math.max(0, targetDate.getTime() - now.getTime());
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);

          setCountdown({
            h: h.toString().padStart(2, '0'),
            m: m.toString().padStart(2, '0'),
            s: s.toString().padStart(2, '0'),
          });
          setNextTitle(label);
        }
      } catch (err) {
        // Fallback calculation
        setHijriDate('رمضان المبارك 1448هـ');
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          coords = { lat: p.coords.latitude, lng: p.coords.longitude };
          setLocationStatus('تم تحديد الموقع بدقة');
          updateTimes();
        },
        () => {
          setLocationStatus('توقيت القاهرة (افتراضي)');
          updateTimes();
        }
      );
    } else {
      setLocationStatus('توقيت القاهرة (افتراضي)');
      updateTimes();
    }

    updateTimes();
    timerId = setInterval(updateTimes, 1000);
    return () => clearInterval(timerId);
  }, []);

  const religiousServices: { id: PageId; label: string; icon: string }[] = [
    { id: 'prayers', label: 'المواقيت', icon: 'fa-clock' },
    { id: 'quran', label: 'المصحف', icon: 'fa-book-quran' },
    { id: 'khatma', label: 'الختمة', icon: 'fa-file-signature' },
    { id: 'azkar', label: 'الأذكار', icon: 'fa-person-praying' },
    { id: 'tasbih', label: 'المسبحة', icon: 'fa-toggle-on' },
    { id: 'zakat', label: 'الزكاة', icon: 'fa-coins' },
    { id: 'faq', label: 'فتاوى', icon: 'fa-clipboard-question' },
    { id: 'library', label: 'المكتبة', icon: 'fa-book-open' },
  ];

  const qualityOfLifeServices: { id: PageId; label: string; icon: string }[] = [
    { id: 'recipes', label: 'وصفات', icon: 'fa-plate-wheat' },
    { id: 'suhoor', label: 'سحور', icon: 'fa-faucet-drip' },
    { id: 'health-tips', label: 'صحتك', icon: 'fa-staff-snake' },
    { id: 'habits', label: 'عاداتي', icon: 'fa-calendar-check' },
    { id: 'ehsan', label: 'إحسان', icon: 'fa-hand-holding-heart' },
    { id: 'series', label: 'مسلسلات', icon: 'fa-film' },
    { id: 'kids', label: 'أطفال', icon: 'fa-child-reaching' },
    { id: 'designers', label: 'الفريق', icon: 'fa-palette' },
  ];

  return (
    <div className="pb-24 pt-6 max-w-xl mx-auto px-4">
      {/* Header Profile / Logo Section */}
      <div className="text-center pt-8 pb-4">
        <div className="w-24 h-24 mx-auto mb-3 bg-[#0f141e] border-2 border-[#D4AF37] rounded-3xl p-1 shadow-xl flex items-center justify-center overflow-hidden">
          <img src="/sohoorna.png" alt="لوجو سحورنا" className="w-full h-full object-cover rounded-2xl" />
        </div>
        <h1 className="font-amiri text-3xl md:text-4xl font-bold text-[#D4AF37] gold-glow mb-1">
          سحورنا 2027
        </h1>
        <p className="text-base font-bold text-gray-200">{hijriDate}</p>

        {/* Live Visitor Counters */}
        <div className="flex items-center justify-center gap-6 my-4 mx-auto max-w-[300px] bg-[#D4AF37]/10 p-3 rounded-2xl border border-[#D4AF37]/20 shadow-inner">
          <div className="flex flex-col items-center flex-1">
            <i className="fa-solid fa-users text-[#D4AF37] text-sm mb-1" />
            <span className="text-[11px] text-gray-400">متصل الآن</span>
            <b className="text-xl text-[#FFD700] font-amiri font-bold">{onlineCount}</b>
          </div>
          <div className="w-px h-7 bg-[#D4AF37]/25 self-center" />
          <div className="flex flex-col items-center flex-1">
            <i className="fa-solid fa-eye text-[#D4AF37] text-sm mb-1" />
            <span className="text-[11px] text-gray-400">إجمالي الزيارات</span>
            <b className="text-xl text-[#FFD700] font-amiri font-bold">{totalVisits.toLocaleString()}</b>
          </div>
        </div>

        <span className="text-xs text-[#FFD700] inline-flex items-center gap-1.5 opacity-90">
          <i className="fa-solid fa-location-dot" /> {locationStatus}
        </span>
      </div>

      {/* Countdown Timer Container */}
      <div className="bg-[#0f141e] rounded-3xl p-5 border border-[#D4AF37]/35 shadow-xl text-center mb-6">
        <span className="text-[#D4AF37] font-bold block text-base md:text-lg mb-3">
          {nextTitle}
        </span>
        <div className="flex justify-center items-center gap-3">
          <div className="bg-[#D4AF37]/10 p-3 rounded-2xl min-w-[75px] border border-[#D4AF37]/15">
            <span className="block text-3xl font-black text-[#D4AF37] font-amiri leading-none">
              {countdown.h}
            </span>
            <label className="text-[11px] text-gray-400 mt-1 block">ساعة</label>
          </div>
          <span className="text-2xl text-[#D4AF37] font-bold">:</span>
          <div className="bg-[#D4AF37]/10 p-3 rounded-2xl min-w-[75px] border border-[#D4AF37]/15">
            <span className="block text-3xl font-black text-[#D4AF37] font-amiri leading-none">
              {countdown.m}
            </span>
            <label className="text-[11px] text-gray-400 mt-1 block">دقيقة</label>
          </div>
          <span className="text-2xl text-[#D4AF37] font-bold">:</span>
          <div className="bg-[#D4AF37]/10 p-3 rounded-2xl min-w-[75px] border border-[#D4AF37]/15">
            <span className="block text-3xl font-black text-[#D4AF37] font-amiri leading-none">
              {countdown.s}
            </span>
            <label className="text-[11px] text-gray-400 mt-1 block">ثانية</label>
          </div>
        </div>
      </div>

      {/* Group 1: Religious Services */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-base mb-3 px-1">
          <i className="fa-solid fa-star-and-crescent" />
          <span>الخدمات الدينية</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {religiousServices.map((card) => (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="bg-[#0f141e] hover:bg-[#D4AF37]/15 border border-[#D4AF37]/15 hover:border-[#D4AF37] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-sm group"
            >
              <i className={`fa-solid ${card.icon} text-xl text-[#D4AF37] group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-bold text-gray-200">{card.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Group 2: Quality of Life */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-base mb-3 px-1">
          <i className="fa-solid fa-heart" />
          <span>جودة الحياة والروحانيات</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {qualityOfLifeServices.map((card) => (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="bg-[#0f141e] hover:bg-[#D4AF37]/15 border border-[#D4AF37]/15 hover:border-[#D4AF37] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-sm group"
            >
              <i className={`fa-solid ${card.icon} text-xl text-[#D4AF37] group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-bold text-gray-200">{card.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
