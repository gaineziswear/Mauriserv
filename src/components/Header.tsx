import React from 'react';
import {
  Wrench,
  Globe,
  ShieldCheck,
  PhoneCall,
  User,
  Briefcase,
  SlidersHorizontal,
  Smartphone,
  PlusCircle,
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenRequestModal: (categoryId?: string) => void;
  activeView: 'home' | 'my-dashboard' | 'pro-portal' | 'admin-console' | 'guides';
  setActiveView: (view: 'home' | 'my-dashboard' | 'pro-portal' | 'admin-console' | 'guides') => void;
  onToggleMobileSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  currentRole,
  setCurrentRole,
  onOpenRequestModal,
  activeView,
  setActiveView,
  onToggleMobileSimulator,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-stone-200">
      {/* Island Emergency Banner */}
      <div className="bg-emerald-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium">{t.brand.emergencyBanner}</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <a
              href="tel:+2304007378"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="font-semibold text-white">(+230) 400-SERV</span>
            </a>
            <span className="hidden md:inline text-emerald-400/50">•</span>
            <span className="hidden md:inline">WhatsApp (+230) 5712-3456</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveView('home')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-900 text-emerald-300 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-stone-900 font-display">
                    MAURI<span className="text-emerald-700">SERV</span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    .MU
                  </span>
                </div>
                <p className="text-[11px] font-medium text-stone-500 tracking-wide uppercase">
                  {t.brand.tagline}
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setActiveView('home')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'home'
                    ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
              >
                {t.nav.services}
              </button>
              <button
                onClick={() => setActiveView('guides')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'guides'
                    ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
              >
                {t.nav.homeGuides}
              </button>
              <button
                onClick={() => {
                  setCurrentRole('CUSTOMER');
                  setActiveView('my-dashboard');
                }}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'my-dashboard'
                    ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
              >
                {t.nav.myDashboard}
              </button>
              <button
                onClick={() => {
                  setCurrentRole('PROVIDER');
                  setActiveView('pro-portal');
                }}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'pro-portal'
                    ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
              >
                {t.nav.providerPortal}
              </button>
              <button
                onClick={() => {
                  setCurrentRole('ADMIN');
                  setActiveView('admin-console');
                }}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'admin-console'
                    ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
              >
                {t.nav.adminConsole}
              </button>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* iOS Companion Simulator Toggle */}
            <button
              onClick={onToggleMobileSimulator}
              title="Preview native iOS / Android companion experience"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-lg border border-stone-300/80 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-stone-600" />
              <span>iOS Companion</span>
            </button>

            {/* Bilingual Switcher */}
            <div className="flex items-center bg-stone-200/70 p-0.5 rounded-lg border border-stone-300/60 text-xs font-bold">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === 'en'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === 'fr'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                FR
              </button>
            </div>

            {/* Primary Action Button: Find a Service */}
            <button
              onClick={() => onOpenRequestModal()}
              className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all hover:shadow-md active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>{t.nav.getStarted}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
