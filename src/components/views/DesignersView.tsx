import React from 'react';
import { TEAM_DATA } from '../../data/teamData';

export const DesignersView: React.FC = () => {
  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] font-amiri gold-glow mb-1">
          فريق العمل
        </h1>
        <p className="text-sm text-gray-300 max-w-lg mx-auto">
          نخبة اجتمعت لتقديم تجربة رقمية إسلامية فريدة تليق بالشهر الفضيل لعام 2027
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_DATA.map((member) => (
          <div
            key={member.name}
            className="bg-[#0f141e] border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-3xl p-6 flex flex-col items-center text-center shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden group"
          >
            {/* Top gold line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

            {/* Avatar */}
            <div className="w-28 h-28 rounded-full border-3 border-[#D4AF37] p-1 bg-black/40 mb-4 shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/sohoorna.png';
                }}
              />
            </div>

            <h3 className="text-base font-black text-white tracking-wider mb-2 font-orbitron">
              {member.name}
            </h3>

            <p className="text-xs text-gray-300 italic leading-relaxed line-clamp-3 mb-4">
              "{member.quote}"
            </p>

            {member.link ? (
              <a
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-bold"
              >
                <span>زيارة الصفحة الشخصية</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </a>
            ) : (
              <span className="mt-auto text-[11px] text-[#D4AF37]/70 font-semibold">
                عضو فريق التطوير والابتكار
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer message */}
      <div className="mt-12 text-center text-xs text-gray-400">
        <p>سحورنا 2027 © جميع الحقوق محفوظة</p>
        <span className="text-[#D4AF37] font-semibold block mt-1">
          صُنِع بكل حب لخدمة الصائمين وابتغاء الأجر
        </span>
      </div>
    </div>
  );
};
