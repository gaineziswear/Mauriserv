import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Home,
  FileText,
  MessageSquare,
  Wrench,
  User,
  ShieldCheck,
  Zap,
  PhoneCall,
  Search,
  Bell,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Language, ServiceCategory, Booking } from '../types';
import { translations } from '../translations';

interface MobileCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  categories: ServiceCategory[];
  bookings: Booking[];
  onOpenRequestModal: (categoryHint?: string) => void;
}

export const MobileCompanionModal: React.FC<MobileCompanionModalProps> = ({
  isOpen,
  onClose,
  lang,
  categories,
  bookings,
  onOpenRequestModal,
}) => {
  const t = translations[lang];
  const [mobileTab, setMobileTab] = useState<'home' | 'requests' | 'messages' | 'homes' | 'profile'>('home');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-sm w-full my-6 flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3 py-1 rounded-full"
        >
          <X className="w-4 h-4" />
          <span>{lang === 'en' ? 'Close iOS Preview' : 'Fermer'}</span>
        </button>

        {/* iPhone Chassis Frame */}
        <div className="w-[360px] h-[720px] bg-black rounded-[48px] p-3.5 shadow-2xl border-4 border-stone-700 relative overflow-hidden flex flex-col justify-between">
          {/* Top Speaker / Dynamic Island */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-stone-900 ml-16" />
          </div>

          {/* Screen Content Container */}
          <div className="w-full h-full bg-[#FBFBF9] rounded-[36px] overflow-y-auto pt-8 pb-16 px-4 space-y-4 text-stone-900 select-none">
            {/* Top Mobile Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-900 text-emerald-300 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm font-black tracking-tight font-display">
                  MAURI<span className="text-emerald-700">SERV</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-stone-500">Mauritius</span>
              </div>
            </div>

            {/* Mobile Tab 1: Home View */}
            {mobileTab === 'home' && (
              <div className="space-y-4">
                {/* Emergency Card */}
                <div className="bg-rose-900 text-white p-3.5 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-800 px-2 py-0.5 rounded-full text-rose-200">
                      🚨 24/7 Island Emergency
                    </span>
                    <span className="text-[10px] text-rose-300">&lt; 45 Mins</span>
                  </div>
                  <div className="text-xs font-bold">
                    {lang === 'en' ? 'Burst pipe, power blackout, or AC failure?' : 'Fuite d’eau, panne de courant ou clim ?'}
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRequestModal('Emergency');
                    }}
                    className="w-full bg-white text-rose-950 text-xs font-black py-2 rounded-xl text-center shadow-xs"
                  >
                    {lang === 'en' ? 'Request Immediate Dispatch' : 'Dépannage d’Urgence Express'}
                  </button>
                </div>

                {/* Search in App */}
                <div
                  onClick={() => {
                    onClose();
                    onOpenRequestModal();
                  }}
                  className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs flex items-center gap-2 text-xs text-stone-400 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'en' ? 'What needs fixing today?' : 'Que souhaitez-vous réparer ?'}</span>
                </div>

                {/* Popular Services Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span>{lang === 'en' ? 'Household Services' : 'Services Maison'}</span>
                    <span className="text-emerald-800 text-[10px]">9 Districts</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 4).map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          onClose();
                          onOpenRequestModal(cat.id);
                        }}
                        className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs text-left cursor-pointer hover:border-emerald-700 transition-colors"
                      >
                        <img
                          src={cat.imageUrl}
                          alt={cat.nameEn}
                          className="w-full h-16 object-cover rounded-lg mb-1.5"
                        />
                        <div className="text-[11px] font-bold text-stone-900 line-clamp-1">
                          {lang === 'fr' ? cat.nameFr : cat.nameEn}
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium">
                          From Rs {cat.startingPriceMUR}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active live job badge */}
                {bookings.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-emerald-950 flex items-center justify-between">
                      <span>Live Dispatch #{bookings[0].id.slice(-6)}</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                        {bookings[0].status}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      {bookings[0].providerBusinessName} • Curepipe
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Tab 2: Requests View */}
            {mobileTab === 'requests' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900">
                  {lang === 'en' ? 'My Active Requests' : 'Mes Demandes'}
                </h4>
                {bookings.map((b) => (
                  <div key={b.id} className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                    <div className="font-bold text-stone-900">{b.title}</div>
                    <div className="text-[11px] text-stone-500">{b.providerBusinessName}</div>
                    <div className="flex justify-between items-center text-[10px] text-stone-600 pt-1 border-t border-stone-100">
                      <span>Rs {b.agreedPriceMUR} (Escrow Secured)</span>
                      <span className="font-bold text-emerald-800">{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Tab 3: Messages View */}
            {mobileTab === 'messages' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900">
                  {lang === 'en' ? 'Direct Messages & WhatsApp' : 'Messages & WhatsApp'}
                </h4>
                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80"
                      alt="Carver"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-stone-900">Jean-Luc Carver</div>
                      <div className="text-[10px] text-emerald-800">On site at 14:00</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 bg-stone-50 p-2 rounded-lg">
                    "I am arriving in Curepipe with the replacement capacitor."
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Tab 4: My Homes View */}
            {mobileTab === 'homes' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900">
                  {lang === 'en' ? 'My Mauritian Homes' : 'Mes Résidences'}
                </h4>
                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1 text-xs">
                  <div className="font-bold text-stone-900">Primary Residence - Curepipe</div>
                  <div className="text-[10px] text-stone-500">14 Rue Chasteauneuf</div>
                  <div className="text-[10px] text-emerald-800 font-semibold">AC & Solar Heater tracked</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1 text-xs">
                  <div className="font-bold text-stone-900">Beach Villa - Pereybere</div>
                  <div className="text-[10px] text-stone-500">Coastal Road</div>
                  <div className="text-[10px] text-amber-800 font-semibold">Roof membrane check due</div>
                </div>
              </div>
            )}

            {/* Mobile Tab 5: Profile View */}
            {mobileTab === 'profile' && (
              <div className="space-y-3 text-center">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                  alt="Devina"
                  className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-emerald-700"
                />
                <div className="font-bold text-sm text-stone-900">Devina Ramgoolam</div>
                <div className="text-xs text-stone-500">+230 5723 8890</div>
                <div className="bg-emerald-100 text-emerald-900 p-3 rounded-xl text-xs font-bold">
                  Wallet Balance: Rs 600
                </div>
              </div>
            )}
          </div>

          {/* Bottom iOS Navigation Bar */}
          <div className="absolute bottom-3 left-3.5 right-3.5 bg-white/95 backdrop-blur-md h-14 rounded-b-[36px] border-t border-stone-200 flex items-center justify-around px-2 z-30 text-[10px] font-bold">
            <button
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'home' ? 'text-emerald-800' : 'text-stone-400'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setMobileTab('requests')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'requests' ? 'text-emerald-800' : 'text-stone-400'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Jobs</span>
            </button>
            <button
              onClick={() => setMobileTab('messages')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'messages' ? 'text-emerald-800' : 'text-stone-400'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setMobileTab('homes')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'homes' ? 'text-emerald-800' : 'text-stone-400'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Homes</span>
            </button>
            <button
              onClick={() => setMobileTab('profile')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'profile' ? 'text-emerald-800' : 'text-stone-400'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
