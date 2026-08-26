import React, { useState } from 'react';
import {
  X,
  Award,
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Language, ServiceCategory } from '../types';
import { MAURITIUS_DISTRICTS } from '../data/mockData';
import { translations } from '../translations';

interface ProSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  categories: ServiceCategory[];
  onRegisterPro: (proData: any) => Promise<void>;
}

export const ProSignupModal: React.FC<ProSignupModalProps> = ({
  isOpen,
  onClose,
  lang,
  categories,
  onRegisterPro,
}) => {
  const t = translations[lang];
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('+230 5');
  const [district, setDistrict] = useState(MAURITIUS_DISTRICTS[0]);
  const [selectedCat, setSelectedCat] = useState('cat_plumbing');
  const [brn, setBrn] = useState('');
  const [experience, setExperience] = useState('5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onRegisterPro({
        businessName,
        ownerName,
        phone,
        district,
        categoryId: selectedCat,
        brnNumber: brn || `C${Math.floor(10000000 + Math.random() * 90000000)}`,
        yearsExperience: Number(experience) || 3,
      });
      setRegisteredSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setRegisteredSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'en' ? 'Launch Partner Program' : 'Programme Partenaire Lancement'}</span>
          </div>
          <h3 className="text-2xl font-black text-stone-900 font-display">
            {lang === 'en' ? 'Claim 3 Months Free Advertising' : 'Profitez de 3 Mois de Publicité Offerte'}
          </h3>
          <p className="text-xs text-stone-600">
            {lang === 'en'
              ? 'Join 320+ verified tradesmen across Mauritius. Zero setup fees, premium verified placement, and direct job leads.'
              : 'Rejoignez plus de 320 artisans certifiés à l’île Maurice. Sans engagement, annonces sponsorisées offertes.'}
          </p>
        </div>

        {registeredSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-700" />
            </div>
            <h4 className="text-xl font-bold text-stone-900">
              {lang === 'en' ? 'Welcome to MauriServ!' : 'Bienvenue sur MauriServ !'}
            </h4>
            <p className="text-xs text-stone-600">
              {lang === 'en'
                ? 'Your pro profile is now active under the 3 Months Free Promotional tier.'
                : 'Votre compte professionnel est activé avec 3 mois de visibilité offerte.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {lang === 'en' ? 'Business / Trade Name' : 'Nom de l’Entreprise ou de l’Artisan'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Carver Electrical Solutions Ltd"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {lang === 'en' ? 'Contact Person' : 'Responsable'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean-Luc Carver"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {lang === 'en' ? 'Mauritian Phone / WhatsApp' : 'Téléphone / WhatsApp'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="+230 5..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {lang === 'en' ? 'Primary Trade' : 'Métier Principal'}
                </label>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {lang === 'fr' ? c.nameFr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {lang === 'en' ? 'Base District' : 'District Principal'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                >
                  {MAURITIUS_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {lang === 'en' ? 'BRN Number (if registered)' : 'Numéro BRN (si enregistré)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. C14098231"
                  value={brn}
                  onChange={(e) => setBrn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {lang === 'en' ? 'Years of Experience' : 'Années d’Expérience'}
                </label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
              <span className="font-bold">✓ 3 Months Free Advertising:</span> Includes sponsored top banner listing, zero subscription fee, and 90% payout on all jobs.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm py-3.5 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>
                {isSubmitting
                  ? (lang === 'en' ? 'Registering...' : 'Inscription...')
                  : (lang === 'en' ? 'Activate 3 Months Free' : 'Activer mes 3 Mois Gratuits')}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
