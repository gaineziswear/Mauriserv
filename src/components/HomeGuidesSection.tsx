import React, { useState } from 'react';
import {
  BookOpen,
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import { HomeGuide, Language } from '../types';
import { translations } from '../translations';

interface HomeGuidesSectionProps {
  guides: HomeGuide[];
  lang: Language;
  onOpenServiceRequest: (categoryHint?: string) => void;
}

export const HomeGuidesSection: React.FC<HomeGuidesSectionProps> = ({
  guides,
  lang,
  onOpenServiceRequest,
}) => {
  const t = translations[lang];
  const [selectedGuide, setSelectedGuide] = useState<HomeGuide | null>(null);

  return (
    <section className="py-16 bg-[#FBFBF9] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              {lang === 'en' ? 'Practical Home Wisdom' : 'Conseils & Sécurité'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-display">
              {t.guides.title}
            </h2>
            <p className="text-stone-600 mt-1 max-w-xl text-sm sm:text-base">
              {t.guides.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => {
            const title = lang === 'fr' ? guide.titleFr : guide.titleEn;
            const summary = lang === 'fr' ? guide.summaryFr : guide.summaryEn;

            return (
              <div
                key={guide.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden relative bg-stone-900">
                    <img
                      src={guide.imageUrl}
                      alt={title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-emerald-950 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {guide.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{guide.readTimeMinutes} min read</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-stone-900 text-base leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 mt-2">
                  <button
                    onClick={() => setSelectedGuide(guide)}
                    className="w-full text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t.guides.readGuide}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 space-y-6">
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                {selectedGuide.category}
              </span>
              <h3 className="text-2xl font-black text-stone-900 font-display">
                {lang === 'fr' ? selectedGuide.titleFr : selectedGuide.titleEn}
              </h3>
            </div>

            <img
              src={selectedGuide.imageUrl}
              alt="Guide banner"
              className="w-full h-48 object-cover rounded-2xl border border-stone-200"
            />

            {/* Checklist / Actionable Steps */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                {lang === 'en' ? 'Step-by-Step Practical Actions:' : 'Étapes Pratiques :'}
              </h4>
              <div className="space-y-2 text-xs text-stone-700">
                {(lang === 'fr' ? selectedGuide.stepsFr : selectedGuide.stepsEn).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Warning */}
            {(selectedGuide.safetyWarningEn || selectedGuide.safetyWarningFr) && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.guides.safetyNote}</span>
                </div>
                <p className="leading-relaxed">
                  {lang === 'fr' ? selectedGuide.safetyWarningFr : selectedGuide.safetyWarningEn}
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
              <button
                onClick={() => {
                  const catHint = selectedGuide.category;
                  setSelectedGuide(null);
                  onOpenServiceRequest(catHint);
                }}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <span>{lang === 'en' ? 'Book Professional Assistance' : 'Réserver un Pro pour cette tâche'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
