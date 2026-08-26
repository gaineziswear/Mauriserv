import React from 'react';
import {
  Wrench,
  ShieldCheck,
  Lock,
  Heart,
  MapPin,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface FooterProps {
  lang: Language;
  onSelectCategory: (categoryId: string) => void;
  onOpenProSignup: () => void;
  onOpenMobileModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onSelectCategory,
  onOpenProSignup,
  onOpenMobileModal,
}) => {
  const t = translations[lang];

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-black">
                <Wrench className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                MAURI<span className="text-emerald-500">SERV</span>
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {lang === 'en'
                ? 'Mauritius’s premier managed marketplace for trusted household tradesmen. All technicians are BRN and identity-verified with 100% escrow protection.'
                : 'La plateforme de référence à l’île Maurice pour vos dépannages et travaux domestiques. Artisans certifiés avec paiement sécurisé par séquestre.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800/80 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>MauriServ Escrow Protected</span>
              </span>
            </div>
          </div>

          {/* Quick Services */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              {lang === 'en' ? 'Core Services' : 'Services Phares'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('cat_plumbing')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Plumbing & Leak Detection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cat_electrical')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Electrical & Solar Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cat_aircon')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Air Conditioning Servicing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cat_cleaning')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Villa & Apartment Cleaning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cat_painting')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Roof Membrane & Waterproofing
                </button>
              </li>
            </ul>
          </div>

          {/* Mauritius Island Coverage */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              {lang === 'en' ? 'Island Districts' : 'Districts Couverts'}
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>• Plaines Wilhems (Curepipe, Quatre Bornes)</li>
              <li>• Rivière du Rempart (Grand Baie, Pereybere)</li>
              <li>• Black River (Tamarin, Flic-en-Flac)</li>
              <li>• Port Louis & Beau Bassin</li>
              <li>• Flacq, Grand Port & Savanne</li>
            </ul>
          </div>

          {/* For Tradesmen & App */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              {lang === 'en' ? 'For Professionals' : 'Pour les Pros'}
            </h4>
            <button
              onClick={onOpenProSignup}
              className="block text-left text-emerald-400 hover:text-emerald-300 font-bold"
            >
              {lang === 'en' ? '3 Months Free Advertising' : '3 Mois de Publicité Gratuite'}
            </button>
            <button
              onClick={onOpenMobileModal}
              className="block text-left text-stone-300 hover:text-white"
            >
              {lang === 'en' ? 'Mobile App Companion (iOS)' : 'Application Mobile (iOS)'}
            </button>
            <div className="pt-2 text-stone-500 text-[11px]">
              Support: help@mauriserv.mu
              <br />
              Emergency: +230 5250 0110
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} MauriServ Ltd. Republic of Mauritius. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit Encrypted Payments</span>
            </span>
            <span>•</span>
            <span>MCB Juice • SBM • Visa • Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
