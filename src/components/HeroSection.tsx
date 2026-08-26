import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  MapPin,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeroSectionProps {
  lang: Language;
  onOpenRequestModal: (categoryHint?: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenProSignup: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onOpenRequestModal,
  onSelectCategory,
  onOpenProSignup,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenRequestModal(searchQuery);
  };

  const quickTags = [
    { label: lang === 'en' ? 'Plumbing Leak' : 'Fuite Plomberie', id: 'cat_plumbing' },
    { label: lang === 'en' ? 'AC Service' : 'Entretien Clim', id: 'cat_aircon' },
    { label: lang === 'en' ? 'Electrician' : 'Électricien', id: 'cat_electrical' },
    { label: lang === 'en' ? 'Deep Cleaning' : 'Grand Ménage', id: 'cat_cleaning' },
    { label: lang === 'en' ? 'Handyman' : 'Bricolage', id: 'cat_handyman' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FBFBF9] via-[#F4F4F0] to-[#FBFBF9] border-b border-stone-200/80 pt-10 pb-16">
      {/* Subtle Mauritian Botanical / Architectural Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-100/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-300/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.brand.badge}</span>
              <span className="text-emerald-500">•</span>
              <span className="text-emerald-800 font-semibold">{t.brand.tagline}</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.12] font-display">
              {t.hero.headline}
            </h1>

            {/* Clear, Concise Subheadline */}
            <p className="text-lg text-stone-600 font-normal leading-relaxed max-w-2xl">
              {t.hero.subheadline}
            </p>

            {/* Prominent Smart Search Form */}
            <form onSubmit={handleSearchSubmit} className="pt-2">
              <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-lg border border-stone-300/80 flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
                <div className="flex items-center gap-3 w-full px-3 py-1.5">
                  <Search className="w-5 h-5 text-emerald-700 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.hero.searchPlaceholder}
                    className="w-full text-sm sm:text-base text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shrink-0 transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>{t.hero.searchBtn}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-stone-600">
                <span className="font-semibold text-stone-500">{t.hero.popularSearches}</span>
                {quickTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onSelectCategory(tag.id)}
                    className="bg-stone-200/60 hover:bg-emerald-100 hover:text-emerald-900 px-2.5 py-1 rounded-lg transition-colors font-medium border border-stone-300/40"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </form>

            {/* Launch Partner Incentive Badge for Local Pros */}
            <div className="pt-2">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-3.5 rounded-xl flex items-center justify-between gap-4 shadow-sm border border-emerald-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      {lang === 'en' ? 'Launch Partner Offer' : 'Offre Partenaire Lancement'}
                    </div>
                    <div className="text-xs text-emerald-100 font-medium">
                      {lang === 'en'
                        ? 'Mauritian Tradesmen: Get 3 Months Free Featured Advertising'
                        : 'Artisans Mauriciens : 3 Mois de Publicité Offerte'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenProSignup}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                >
                  {lang === 'en' ? 'Join as Pro' : 'Devenir Pro'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Trust Hero Graphic & Live Job Snapshot */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1000&q=80"
                alt="Mauritian verified professional technician"
                className="w-full h-[420px] object-cover opacity-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

              {/* Floating Verified Badge Card */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-stone-200/80 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">MauriServ Escrow</div>
                  <div className="text-[10px] text-stone-500 font-medium">100% Guaranteed Release</div>
                </div>
              </div>

              {/* Bottom Pro Card Preview */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80"
                      alt="Jean-Luc Carver"
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <span>Jean-Luc Carver</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                          ★ 4.95
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Carver Electrical & Solar Ltd • Curepipe
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    Verified Pro
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-600">
                  <span>148 completed jobs</span>
                  <span className="text-stone-400">•</span>
                  <span>CEB Registered</span>
                  <span className="text-stone-400">•</span>
                  <span className="font-semibold text-stone-800">Avg 15 min response</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Trust Metric Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/70 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">{t.hero.stats.verifiedPros}</div>
              <div className="text-xs text-stone-500">Identity & Trade Checked</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/70 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">{t.hero.stats.islandwide}</div>
              <div className="text-xs text-stone-500">North, South, East, West</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/70 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">{t.hero.stats.avgResponse}</div>
              <div className="text-xs text-stone-500">Fast Local Matching</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/70 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">{t.hero.stats.guaranteed}</div>
              <div className="text-xs text-stone-500">Release when satisfied</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
