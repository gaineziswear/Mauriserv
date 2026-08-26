import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  Coins,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Building2,
  Camera,
} from 'lucide-react';
import {
  Language,
  ServiceCategory,
  Property,
  UrgencyLevel,
  ServiceRequest,
} from '../types';
import { MAURITIUS_DISTRICTS } from '../data/mockData';
import { translations } from '../translations';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  properties: Property[];
  lang: Language;
  initialCategoryId?: string;
  initialQuery?: string;
  onBroadcastRequest: (requestData: Partial<ServiceRequest>) => Promise<void>;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  categories,
  properties,
  lang,
  initialCategoryId,
  initialQuery,
  onBroadcastRequest,
}) => {
  const t = translations[lang];

  const [categoryId, setCategoryId] = useState(initialCategoryId || categories[0]?.id || 'cat_plumbing');
  const [subcategory, setSubcategory] = useState('');
  const [title, setTitle] = useState(initialQuery || '');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('TODAY');
  const [district, setDistrict] = useState(MAURITIUS_DISTRICTS[0]);
  const [address, setAddress] = useState('14 Rue Chasteauneuf, Forest-Side, Curepipe');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning (08:00 - 12:00)');
  const [budgetMUR, setBudgetMUR] = useState('1500');

  // AI Diagnostic State
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [aiTriage, setAiTriage] = useState<{
    identifiedIssue: string;
    suggestedCategory: string;
    estimatedRangeMUR: string;
    safetyPrecautions: string[];
    urgencyAssessment: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (initialCategoryId) {
      setCategoryId(initialCategoryId);
    }
    if (initialQuery) {
      setTitle(initialQuery);
    }
  }, [initialCategoryId, initialQuery]);

  if (!isOpen) return null;

  const currentCategory = categories.find((c) => c.id === categoryId) || categories[0];
  const subcategories =
    lang === 'fr'
      ? currentCategory.popularSubcategoriesFr
      : currentCategory.popularSubcategoriesEn;

  const handlePropertySelect = (propId: string) => {
    setSelectedPropertyId(propId);
    const prop = properties.find((p) => p.id === propId);
    if (prop) {
      setAddress(prop.address);
      setDistrict(prop.district);
    }
  };

  const handleRunAiDiagnostic = async () => {
    if (!title && !description) {
      setTitle(lang === 'en' ? 'Water leaking under kitchen sink' : 'Fuite d’eau sous l’évier de la cuisine');
    }

    setIsDiagnosing(true);
    try {
      const res = await fetch('/api/v1/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || (lang === 'en' ? 'Water leaking under kitchen sink' : 'Fuite d’eau sous l’évier'),
          description: description || (lang === 'en' ? 'Puddle forming under counter whenever tap runs' : 'Flaque d’eau sous le meuble évier'),
          categoryHint: currentCategory.nameEn,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiTriage(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onBroadcastRequest({
        title: title || `${currentCategory.nameEn} Service`,
        description,
        categoryId: currentCategory.id,
        categoryName: currentCategory.nameEn,
        subcategory: subcategory || subcategories[0] || 'General Maintenance',
        location: address,
        district,
        propertyId: selectedPropertyId,
        urgency,
        preferredDate,
        preferredTimeSlot,
        estimatedBudgetMUR: Number(budgetMUR) || currentCategory.startingPriceMUR,
        aiTriage: aiTriage || undefined,
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-700" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 font-display">
              {t.requestModal.successTitle}
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              {t.requestModal.successDesc}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Modal Title */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                {lang === 'en' ? 'MauriServ Managed Request' : 'Demande Gérée MauriServ'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                {t.requestModal.title}
              </h3>
            </div>

            {/* Step 1: Category & Subcategory */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t.requestModal.categoryLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat) => {
                  const catName = lang === 'fr' ? cat.nameFr : cat.nameEn;
                  const isSelected = cat.id === categoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategoryId(cat.id);
                        setSubcategory('');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-600/30'
                          : 'border-stone-200 bg-stone-50/70 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="line-clamp-1">{catName}</div>
                      <div className="text-[10px] font-medium text-stone-500 mt-0.5">
                        Rs {cat.startingPriceMUR}+
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Subcategories */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-600 mb-1.5">
                  {t.requestModal.subcategoryLabel}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {subcategories.map((sub, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSubcategory(sub)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                        subcategory === sub
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.requestModal.titleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.requestModal.titlePlaceholder}
                  className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.requestModal.descLabel}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.requestModal.descPlaceholder}
                  className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
                />
              </div>
            </div>

            {/* Smart AI Diagnostic Assistant Section */}
            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>{t.requestModal.aiHelperTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRunAiDiagnostic}
                  disabled={isDiagnosing}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>
                    {isDiagnosing
                      ? (lang === 'en' ? 'Analyzing...' : 'Analyse...')
                      : t.requestModal.aiDiagnoseBtn}
                  </span>
                </button>
              </div>

              {aiTriage && (
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2 text-xs">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>{lang === 'en' ? 'AI Diagnostic Summary:' : 'Synthèse Diagnostic IA :'}</span>
                    <span className="text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded">
                      {aiTriage.estimatedRangeMUR}
                    </span>
                  </div>
                  <p className="text-stone-700 font-medium">{aiTriage.identifiedIssue}</p>

                  {aiTriage.safetyPrecautions && aiTriage.safetyPrecautions.length > 0 && (
                    <div className="pt-1 border-t border-stone-100 space-y-1">
                      <div className="font-bold text-amber-800 flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Safety Precautions' : 'Précautions de Sécurité'}</span>
                      </div>
                      <ul className="list-disc list-inside text-stone-600 text-[11px] space-y-0.5">
                        {aiTriage.safetyPrecautions.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Location, Property & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Property Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.requestModal.propertyLabel}
                </label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => handlePropertySelect(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.requestModal.urgencyLabel}
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-bold"
                >
                  <option value="EMERGENCY">🚨 {t.requestModal.urgencyEmergency}</option>
                  <option value="TODAY">⚡ {t.requestModal.urgencyToday}</option>
                  <option value="THIS_WEEK">📅 {t.requestModal.urgencyWeek}</option>
                  <option value="FLEXIBLE">🌱 {t.requestModal.urgencyFlexible}</option>
                </select>
              </div>

              {/* Exact Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.requestModal.addressLabel}
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.requestModal.budgetLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-stone-500 font-bold">Rs</span>
                  <input
                    type="number"
                    value={budgetMUR}
                    onChange={(e) => setBudgetMUR(e.target.value)}
                    className="w-full text-xs p-2.5 pl-9 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'en' ? 'Funds held in escrow. Zero prepayment.' : 'Fonds protégés en séquestre. Zéro risque.'}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>
                  {isSubmitting
                    ? (lang === 'en' ? 'Broadcasting...' : 'Diffusion...')
                    : t.requestModal.submitRequest}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
