import React from 'react';
import {
  FileText,
  UserCheck,
  CheckCircle2,
  Lock,
  Camera,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HowItWorksSectionProps {
  lang: Language;
  onOpenRequestModal: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  lang,
  onOpenRequestModal,
}) => {
  const t = translations[lang];

  return (
    <section className="py-16 bg-[#F4F4F0] border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>MauriServ Guarantee</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-display">
            {t.howItWorks.title}
          </h2>
          <p className="text-stone-600 mt-2 text-sm sm:text-base leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-lg">
              <FileText className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              {t.howItWorks.step1Title}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {t.howItWorks.step1Desc}
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-emerald-800">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'en' ? 'Photo & video diagnosis' : 'Diagnostic photo & vidéo'}</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-black text-lg">
              <UserCheck className="w-6 h-6 text-teal-700" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              {t.howItWorks.step2Title}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {t.howItWorks.step2Desc}
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-teal-800">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              <span>{lang === 'en' ? 'Verified BRN & trade insurance' : 'BRN & assurance vérifiés'}</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-lg">
              <CheckCircle2 className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              {t.howItWorks.step3Title}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {t.howItWorks.step3Desc}
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-blue-800">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>{lang === 'en' ? 'Juice / Card escrow protection' : 'Séquestre Juice / Carte bancaire'}</span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenRequestModal}
            className="inline-flex items-center gap-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-98"
          >
            <span>{lang === 'en' ? 'Post a Service Request Now' : 'Publier une Demande de Service'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
