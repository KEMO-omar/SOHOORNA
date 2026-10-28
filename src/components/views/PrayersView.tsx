import React, { useEffect, useState } from 'react';

export const PrayersView: React.FC = () => {
  const [times, setTimes] = useState<Record<string, string>>({
    Fajr: '--:--',
    Sunrise: '--:--',
    Dhuhr: '--:--',
    Asr: '--:--',
    Maghrib: '--:--',
    Isha: '--:--',
  });
  const [locationName, setLocationName] = useState<string>('جاري تحديد موقعك...');
  const [nextPrayerName, setNextPrayerName] = useState<string>('جاري الحساب...');
  const [timerText, setTimerText] = useState<string>('00:00:00');
  const [activeKey, setActiveKey] = useState<string>('Fajr');
  const [tipText, setTipText] = useState<string>('الصلاة نور، والصدقة برهان');
  const [imgIndex, setImgIndex] = useState<number>(0);

  const galleryImages = [
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070',
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070',
    'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2070',
  ];

  const tips = [
    'رأس الأمر الإسلام، وعموده الصلاة',
    'أقرب ما يكون العبد من ربه وهو ساجد',
    'بشر المشائين في الظلم إلى المساجد بالنور التام',
    'الصلاة تجلب الرزق وتحفظ الصحة',
    'اجعل لبيتك نصيباً من صلاتك (النوافل)',
  ];

  const prayerNamesAr: Record<string, string> = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
  };

  useEffect(() => {
    let lat = 30.0444;
    let lon = 31.2357;

    const fetchTimings = async (latitude: number, longitude: number) => {
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`
        );
        const data = await res.json();
        if (data && data.data) {
          setTimes(data.data.timings);
          setLocationName(data.data.meta?.timezone ? `الموقع: ${data.data.meta.timezone} (متصل)` : 'القاهرة (متصل)');
        }
      } catch {
        setLocationName('توقيت القاهرة الافتراضي');
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => fetchTimings(p.coords.latitude, p.coords.longitude),
        () => fetchTimings(lat, lon)
      );
    } else {
      fetchTimings(lat, lon);
    }

    const imgInterval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % galleryImages.length);
    }, 6000);

    return () => clearInterval(imgInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let nextK: string = 'Fajr';
      let minDiff = Infinity;

      Object.keys(prayerNamesAr).forEach((key) => {
        if (key === 'Sunrise' || !times[key] || times[key] === '--:--') return;
        const [h, m] = times[key].split(':');
        const pDate = new Date();
        pDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

        if (pDate.getTime() < now.getTime()) {
          pDate.setDate(pDate.getDate() + 1);
        }

        const diff = pDate.getTime() - now.getTime();
        if (diff < minDiff) {
          minDiff = diff;
          nextK = key;
        }
      });

      if (minDiff !== Infinity) {
        setActiveKey(nextK);
        setNextPrayerName(`صلاة ${prayerNamesAr[nextK]} بعد:`);
        const h = Math.floor(minDiff / 3600000);
        const m = Math.floor((minDiff % 3600000) / 60000);
        const s = Math.floor((diffRemainder(minDiff, 3600000) % 60000) / 1000);
        setTimerText(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        );

        if (s === 0) {
          setTipText(tips[Math.floor(Math.random() * tips.length)]);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [times]);

  function diffRemainder(val: number, divisor: number) {
    return val % divisor;
  }

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
      {/* Title & Badge */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri tracking-wider gold-glow mb-2">
          نـبـض الـصـلاة
        </h1>
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/40 text-[#39FF14] text-xs font-bold shadow-md">
          <i className="fa-solid fa-location-dot ml-1.5" />
          {locationName}
        </div>
      </div>

      {/* Countdown Card */}
      <div className="bg-[#0f141e] border-2 border-[#FF3131] rounded-3xl p-6 text-center max-w-lg mx-auto shadow-2xl relative mt-4 mb-8">
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#FF3131] text-white px-5 py-1 text-xs font-bold rounded-full shadow-lg">
          {nextPrayerName}
        </div>
        <div className="text-4xl md:text-6xl font-bold font-orbitron text-[#FF3131] tracking-wider my-3 drop-shadow-[0_0_12px_#FF3131]">
          {timerText}
        </div>
        <p className="text-sm text-gray-300 font-medium italic mt-2">
          "{tipText}"
        </p>
      </div>

      {/* Prayer Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {Object.keys(prayerNamesAr).map((key) => {
          const isNext = key === activeKey;
          return (
            <div
              key={key}
              className={`p-4 rounded-2xl text-center border transition-all ${
                isNext
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30 transform -translate-y-1'
                  : 'bg-[#0f141e] border-white/5 hover:border-[#D4AF37]/30'
              }`}
            >
              <h3 className="text-[#D4AF37] font-bold text-base mb-1">
                {prayerNamesAr[key]}
              </h3>
              <p className="font-orbitron text-xl font-black text-white">
                {times[key] || '--:--'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Neon Image Slider */}
      <div className="max-w-2xl mx-auto mb-12 p-3 bg-black rounded-3xl border-4 border-[#FF3131] shadow-[0_0_25px_#FF3131]">
        <div className="rounded-2xl border-4 border-[#D4AF37] overflow-hidden aspect-video relative">
          <img
            src={galleryImages[imgIndex]}
            alt="معالم إسلامية"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Secrets of Worship */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#39FF14] border-r-4 border-[#39FF14] pr-3 mb-6 font-amiri">
          أسرار العبادة
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#0f141e] p-5 rounded-2xl border-b-4 border-[#D4AF37] shadow-md">
            <h4 className="text-[#D4AF37] font-bold text-lg mb-2 flex items-center gap-2">
              <i className="fa-solid fa-mosque" /> خشوع المصلين
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              الخشوع ليس مجرد سكون الجسد، بل هو حضور القلب واستشعار عظمة الخالق. حاول إغلاق هاتفك قبل الدخول للمسجد بخمس دقائق لتهيئة روحك.
            </p>
          </div>
          <div className="bg-[#0f141e] p-5 rounded-2xl border-b-4 border-[#FF3131] shadow-md">
            <h4 className="text-[#D4AF37] font-bold text-lg mb-2 flex items-center gap-2">
              <i className="fa-solid fa-hourglass-start" /> أهمية الوقت
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              إن الصلاة كانت على المؤمنين كتاباً موقوتاً. التأخر عن الصلاة يحرمك من بركة تكبيرة الإحرام، فكن دائماً سبّاقاً لنداء "الله أكبر".
            </p>
          </div>
          <div className="bg-[#0f141e] p-5 rounded-2xl border-b-4 border-[#39FF14] shadow-md">
            <h4 className="text-[#D4AF37] font-bold text-lg mb-2 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved" /> حصن المسلم
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              الأذكار بعد الصلاة هي الحصن الذي يحميك طوال يومك. لا تعجل بالخروج، فالمتوضئ في صلاة ما انتظر الصلاة، والملائكة تستغفر لك.
            </p>
          </div>
        </div>
      </div>

      {/* Wudu Guide */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#39FF14] border-r-4 border-[#39FF14] pr-3 mb-6 font-amiri">
          بوابة الطهارة (دليل الوضوء)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: '١', desc: 'النية بالقلب ثم التسمية وغسل الكفين' },
            { step: '٢', desc: 'المضمضة والاستنشاق باليد اليمنى' },
            { step: '٣', desc: 'غسل الوجه كاملاً من الأذن للأذن' },
            { step: '٤', desc: 'غسل اليدين إلى المرفقين (اليمنى أولاً)' },
            { step: '٥', desc: 'مسح الرأس مرة واحدة مع الأذنين' },
            { step: '٦', desc: 'غسل الرجلين إلى الكعبين وتخليل الأصابع' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-[#0f141e] p-4 rounded-2xl text-center border-t-4 border-[#39FF14] flex flex-col items-center justify-between shadow"
            >
              <div className="w-10 h-10 rounded-full bg-[#39FF14] text-black font-black flex items-center justify-center text-lg mb-2">
                {item.step}
              </div>
              <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
