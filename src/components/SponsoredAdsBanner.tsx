import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { Advertisement, Language } from '../types';
import { translations } from '../translations';

interface SponsoredAdsBannerProps {
  ads: Advertisement[];
  lang: Language;
}

export const SponsoredAdsBanner: React.FC<SponsoredAdsBannerProps> = ({ ads, lang }) => {
  const t = translations[lang];

  if (!ads || ads.length === 0) return null;

  return (
    <div className="py-8 bg-[#F4F4F0] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-stone-300/80 text-stone-700 text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
            {t.ads.sponsoredTag}
          </span>
          <span className="text-xs font-bold text-stone-600">
            {t.ads.localHardwareTitle}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ads.map((ad) => {
            const headline = lang === 'fr' ? ad.headlineFr : ad.headlineEn;
            const subheadline = lang === 'fr' ? ad.subheadlineFr : ad.subheadlineEn;
            const cta = lang === 'fr' ? ad.ctaTextFr : ad.ctaTextEn;

            return (
              <div
                key={ad.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-700/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ad.imageUrl}
                    alt={ad.advertiserName}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      {ad.advertiserName}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">
                      {headline}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {subheadline}
                    </p>
                  </div>
                </div>

                <a
                  href={ad.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>{cta}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
