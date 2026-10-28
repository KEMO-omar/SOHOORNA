import React, { useState } from 'react';

export const ZakatView: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [zakatType, setZakatType] = useState<'fitr' | 'sadaqah' | 'mal'>('fitr');
  const [fitrCostPerPerson, setFitrCostPerPerson] = useState<number>(35);
  const [userInput, setUserInput] = useState<string>('4');
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);

  const handleNext = () => {
    if (step === 1) {
      if (zakatType === 'fitr') {
        setUserInput('4');
      } else if (zakatType === 'mal') {
        setUserInput('100000');
      } else {
        setUserInput('500');
      }
      setStep(2);
    } else if (step === 2) {
      const val = parseFloat(userInput);
      if (isNaN(val) || val <= 0) {
        alert('من فضلك أدخل قيمة رقمية صحيحة');
        return;
      }
      if (zakatType === 'fitr') {
        setCalculatedTotal(val * fitrCostPerPerson);
      } else if (zakatType === 'mal') {
        setCalculatedTotal(val * 0.025);
      } else {
        setCalculatedTotal(val);
      }
      setStep(3);
    }
  };

  const resetAll = () => {
    setStep(1);
    setCalculatedTotal(0);
  };

  return (
    <div className="pb-24 pt-6 max-w-lg mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-1">
          إحســــان
        </h1>
        <p className="text-sm text-gray-300">
          حاسبة الزكاة الذكية والصدقات في خدمة العطاء
        </p>
      </div>

      {/* Calculator Card */}
      <div className="bg-[#0f141e] rounded-3xl p-6 md:p-8 border border-[#D4AF37]/35 shadow-2xl relative">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((node) => {
            const isActive = step >= node;
            return (
              <div
                key={node}
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all ${
                  isActive
                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/40 ring-4 ring-[#0f141e]'
                    : 'bg-[#1a1e27] text-gray-400 border border-white/10'
                }`}
              >
                {node}
              </div>
            );
          })}
        </div>

        {/* Step 1: Type Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="text-sm text-gray-200 font-bold block mb-2">
              ماذا تود أن تحسب اليوم؟
            </label>
            <div className="space-y-2.5">
              <label
                onClick={() => setZakatType('fitr')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  zakatType === 'fitr'
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                    : 'bg-black/30 border-white/5 hover:border-[#D4AF37]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-wheat-awn text-[#D4AF37] text-xl" />
                  <div>
                    <b className="text-sm text-white block">زكاة الفطر</b>
                    <span className="text-xs text-gray-400">
                      محددة بـ ({fitrCostPerPerson} ج.م كحد أدنى للفرد)
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="zakatType"
                  checked={zakatType === 'fitr'}
                  onChange={() => setZakatType('fitr')}
                  className="accent-[#D4AF37]"
                />
              </label>

              <label
                onClick={() => setZakatType('mal')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  zakatType === 'mal'
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                    : 'bg-black/30 border-white/5 hover:border-[#D4AF37]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-coins text-[#D4AF37] text-xl" />
                  <div>
                    <b className="text-sm text-white block">زكاة المال والمدخرات</b>
                    <span className="text-xs text-gray-400">
                      نسبة 2.5% على الأموال التي حال عليها الحول وبلغت النصاب
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="zakatType"
                  checked={zakatType === 'mal'}
                  onChange={() => setZakatType('mal')}
                  className="accent-[#D4AF37]"
                />
              </label>

              <label
                onClick={() => setZakatType('sadaqah')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  zakatType === 'sadaqah'
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                    : 'bg-black/30 border-white/5 hover:border-[#D4AF37]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-hand-holding-dollar text-[#D4AF37] text-xl" />
                  <div>
                    <b className="text-sm text-white block">صدقة جارية وتبرع حر</b>
                    <span className="text-xs text-gray-400">أي مبلغ تطوعي بنية الأجر والبركة</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="zakatType"
                  checked={zakatType === 'sadaqah'}
                  onChange={() => setZakatType('sadaqah')}
                  className="accent-[#D4AF37]"
                />
              </label>
            </div>

            <button
              onClick={handleNext}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#b38f00] text-black font-bold text-base rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              استمرار <i className="fa-solid fa-arrow-left mr-1" />
            </button>
          </div>
        )}

        {/* Step 2: Amount / Dependents Input */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="text-sm text-gray-200 font-bold block mb-1">
              {zakatType === 'fitr'
                ? 'عدد أفراد الأسرة المستحق إخراج زكاة الفطر عنهم:'
                : zakatType === 'mal'
                ? 'إجمالي المبلغ المالي (الذي مر عليه حول كامل):'
                : 'قيمة الصدقة التي تنوي إخراجها:'}
            </label>

            <input
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-2xl p-4 text-center text-2xl font-bold text-[#FFD700] focus:outline-none"
              placeholder={zakatType === 'fitr' ? 'مثلاً: 4' : 'مثلاً: 50000'}
            />

            {zakatType === 'fitr' && (
              <div className="text-xs text-gray-400 text-center">
                قيمة الفرد المقدرة: {fitrCostPerPerson} ج.م (يمكن التعديل:
                <input
                  type="number"
                  value={fitrCostPerPerson}
                  onChange={(e) => setFitrCostPerPerson(parseFloat(e.target.value) || 35)}
                  className="w-16 bg-black/30 border border-[#D4AF37]/30 rounded px-1.5 py-0.5 mx-1 text-center text-xs text-[#D4AF37]"
                />
                ج.م)
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#b38f00] text-black font-bold text-base rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              احسب الآن <i className="fa-solid fa-calculator mr-1" />
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-gray-400 hover:text-white underline pt-2 block"
            >
              رجوع للخطوة السابقة
            </button>
          </div>
        )}

        {/* Step 3: Result Box */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-3xl p-6 shadow-inner">
              <span className="text-sm text-gray-300 font-semibold block mb-1">
                {zakatType === 'fitr'
                  ? 'إجمالي زكاة الفطر الواجبة'
                  : zakatType === 'mal'
                  ? 'مقدار زكاة المال المستحقة (2.5%)'
                  : 'إجمالي الصدقة المقترحة'}
              </span>
              <div className="font-orbitron text-4xl md:text-5xl font-black text-[#D4AF37] gold-glow my-2">
                {calculatedTotal.toLocaleString(undefined, {
                  minimumFractionDigits: zakatType === 'mal' ? 2 : 0,
                  maximumFractionDigits: 2,
                })}
              </div>
              <span className="text-base text-gray-200 font-bold">جنيه مصري</span>
            </div>

            <p className="text-xs text-gray-300 italic px-4 leading-relaxed">
              "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ ۗ وَاللَّهُ يُضَاعِفُ لِمَن يَشَاءُ"
            </p>

            <button
              onClick={resetAll}
              className="w-full mt-4 py-3.5 bg-[#D4AF37] text-black font-bold text-base rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              عملية حسابية جديدة
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
