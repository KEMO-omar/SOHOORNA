import React, { useState } from 'react';
import { PageId } from '../../types';

interface KidsViewProps {
  onNavigate: (page: PageId) => void;
}

export const KidsView: React.FC<KidsViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'quiz'>('info');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);

  const quizQuestions = [
    {
      q: 'ما هو الشهر الذي أُنزل فيه القرآن الكريم؟',
      opts: ['شهر رمضان', 'شهر رجب', 'شهر شوال'],
      correct: 0,
    },
    {
      q: 'كم عدد أركان الإسلام؟',
      opts: ['3 أركان', '5 أركان', '7 أركان'],
      correct: 1,
    },
    {
      q: 'ما هي الوجبة التي نتناولها قبل أذان الفجر؟',
      opts: ['السحور', 'الإفطار', 'الغداء'],
      correct: 0,
    },
    {
      q: 'بماذا يستحب أن يفطر الصائم؟',
      opts: ['بالماء والتمر', 'بالحلويات فقط', 'بالعصير الغازي'],
      correct: 0,
    },
  ];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setQuizScore((prev) => prev + 1);
    setAnsweredCount((prev) => prev + 1);
  };

  return (
    <div className="pb-24 pt-6 max-w-lg mx-auto px-4 text-center">
      <div className="bg-[#0f141e] border-2 border-[#D4AF37]/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 bg-[#D4AF37]/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30 text-3xl text-[#D4AF37]">
          <i className="fa-solid fa-child-reaching" />
        </div>

        <h2 className="text-3xl font-bold font-amiri text-[#D4AF37] mb-2">
          ركن أبطال وبراعم الإيمان
        </h2>
        <p className="text-xs text-gray-300 mb-6 leading-relaxed">
          هذه الصفحة مخصصة للأطفال لتعلم فضائل الصيام وأخلاق الشهر الفضيل بأسلوب تفاعلي ممتع
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'info'
                ? 'bg-[#D4AF37] text-black shadow'
                : 'bg-black/30 text-gray-300 border border-white/10'
            }`}
          >
            نصائح للأبطال الصغار
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-[#D4AF37] text-black shadow'
                : 'bg-black/30 text-gray-300 border border-white/10'
            }`}
          >
            فوازير رمضانية للأطفال 🎈
          </button>
        </div>

        {activeTab === 'info' ? (
          <div className="space-y-3 text-right">
            <div className="bg-black/30 p-3.5 rounded-2xl border-r-4 border-[#D4AF37] text-xs leading-relaxed text-gray-200">
              🌟 <b>الصيام تدريب للشجعان:</b> حاول صيام نصف اليوم أو حتى أذان الظهر إذا كنت في سن صغيرة لتتعلم الصبر.
            </div>
            <div className="bg-black/30 p-3.5 rounded-2xl border-r-4 border-[#39FF14] text-xs leading-relaxed text-gray-200">
              💧 <b>الابتسامة صدقة:</b> ساعد والديك في إعداد مائدة الإفطار وترتيب الأطباق.
            </div>
            <div className="bg-black/30 p-3.5 rounded-2xl border-r-4 border-[#FF3131] text-xs leading-relaxed text-gray-200">
              📖 <b>حفظ آية كل يوم:</b> اجعل لك ورداً صغيراً من جزء عم تحفظه وتكرره مع عائلتك.
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-right">
            {answeredCount < quizQuestions.length ? (
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-[#D4AF37] font-bold block mb-1">
                  السؤال {answeredCount + 1} من {quizQuestions.length}:
                </span>
                <p className="text-sm font-bold text-white mb-3">
                  {quizQuestions[answeredCount].q}
                </p>
                <div className="space-y-2">
                  {quizQuestions[answeredCount].opts.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleAnswer(i === quizQuestions[answeredCount].correct)
                      }
                      className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all text-xs text-gray-200 font-semibold"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4">
                <div className="text-3xl mb-2">🎉</div>
                <h4 className="text-base font-bold text-emerald-400 mb-1">
                  أحسنت يا بطل!
                </h4>
                <p className="text-xs text-gray-300">
                  لقد حصلت على {quizScore} من {quizQuestions.length} نقاط.
                </p>
                <button
                  onClick={() => {
                    setAnsweredCount(0);
                    setQuizScore(0);
                  }}
                  className="mt-3 px-4 py-1.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl"
                >
                  إعادة المسابقة
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => onNavigate('home')}
          className="mt-6 w-full py-2.5 bg-black/40 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold rounded-xl transition-all"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};
