import React, { useState } from 'react';
import {
  Briefcase,
  ShieldCheck,
  Award,
  DollarSign,
  Camera,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Phone,
  Sparkles,
} from 'lucide-react';
import {
  Language,
  Provider,
  ServiceRequest,
  Booking,
} from '../types';
import { translations } from '../translations';

interface ProviderPortalProps {
  provider: Provider;
  requests: ServiceRequest[];
  bookings: Booking[];
  lang: Language;
  onSubmitQuote: (requestId: string, priceMUR: number, note: string) => Promise<void>;
  onMarkJobComplete: (bookingId: string, proofUrl: string) => Promise<void>;
}

export const ProviderPortal: React.FC<ProviderPortalProps> = ({
  provider,
  requests,
  bookings,
  lang,
  onSubmitQuote,
  onMarkJobComplete,
}) => {
  const t = translations[lang];

  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('1800');
  const [quoteNote, setQuoteNote] = useState('Available with standard CEB tools and safety gear.');
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Proof upload state
  const [uploadBookingId, setUploadBookingId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80');

  // Available leads matching this provider's category
  const matchingRequests = requests.filter((r) => r.status === 'MATCHING' || r.status === 'OFFERED');

  const providerActiveBookings = bookings.filter((b) => b.providerId === provider.id || b.providerId === 'pro_001');

  const totalEarned = providerActiveBookings.reduce((sum, b) => sum + b.providerPayoutMUR, 18500);
  const pendingEscrow = providerActiveBookings
    .filter((b) => b.paymentStatus === 'HELD_IN_ESCROW')
    .reduce((sum, b) => sum + b.providerPayoutMUR, 0);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqId) return;
    setIsSubmittingQuote(true);
    try {
      await onSubmitQuote(selectedReqId, Number(quotePrice) || 1500, quoteNote);
      setSelectedReqId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadBookingId) return;
    await onMarkJobComplete(uploadBookingId, proofUrl);
    setUploadBookingId(null);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Launch Partner Incentive Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-emerald-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/30">
              <Award className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'en' ? 'Launch Partner Active' : 'Partenaire Lancement Actif'}</span>
              <span className="text-emerald-400">•</span>
              <span>3 Months Free Advertising</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              {t.providerPortal.launchOfferBannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              {t.providerPortal.launchOfferBannerDesc}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 space-y-1">
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              {t.providerPortal.verificationStatus}
            </div>
            <div className="text-lg font-black text-white flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{provider.verificationStatus}</span>
            </div>
            <div className="text-[10px] text-emerald-200">
              BRN: {provider.brnNumber || 'C14098231'}
            </div>
          </div>
        </div>
      </div>

      {/* Provider Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {t.providerPortal.totalEarned}
          </div>
          <div className="text-2xl font-black text-stone-900 mt-1">
            Rs {totalEarned.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-1">
            90% net provider payout rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {t.providerPortal.pendingEscrow}
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            Rs {pendingEscrow.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Releases instantly upon job sign-off
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {lang === 'en' ? 'Quality Score & Response' : 'Score Qualité & Réactivité'}
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1 flex items-center gap-2">
            <span>★ {provider.rating}</span>
            <span className="text-xs text-stone-500 font-normal">({provider.completedJobsCount} jobs)</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Response Rate: {provider.responseRatePercent}%
          </div>
        </div>
      </div>

      {/* Available Job Leads in District */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900">
              {t.providerPortal.incomingRequests}
            </h3>
            <p className="text-xs text-stone-500">
              {lang === 'en' ? 'Live requests from verified Mauritian households' : 'Demandes en temps réel de foyers mauriciens'}
            </p>
          </div>
        </div>

        {matchingRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
            {lang === 'en' ? 'No new job leads in your category right now. You will receive an instant SMS when a new request is posted.' : 'Aucune nouvelle demande pour le moment. Vous recevrez un SMS dès publication.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3 relative flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                      {req.categoryName} • {req.subcategory}
                    </span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                      {req.urgency}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-base">{req.title}</h4>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{req.district}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-stone-800">
                      Budget: Rs {req.estimatedBudgetMUR?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-[11px] text-stone-500">
                    Preferred: {req.preferredDate} ({req.preferredTimeSlot.split(' ')[0]})
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReqId(req.id);
                      setQuotePrice(String(req.estimatedBudgetMUR || 1800));
                    }}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t.providerPortal.submitQuote}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quote Submission Modal */}
      {selectedReqId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h4 className="text-xl font-bold text-stone-900">
              {lang === 'en' ? 'Submit Official Quote' : 'Proposer un Devis'}
            </h4>

            <form onSubmit={handleQuoteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {lang === 'en' ? 'Proposed Price in MUR (Rs)' : 'Prix proposé en MUR (Rs)'}
                </label>
                <input
                  type="number"
                  required
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  You will receive 90% (Rs {Math.round(Number(quotePrice) * 0.9).toLocaleString()}) via Juice/Bank.
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {lang === 'en' ? 'Note to Customer' : 'Message pour le Client'}
                </label>
                <textarea
                  rows={3}
                  value={quoteNote}
                  onChange={(e) => setQuoteNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReqId(null)}
                  className="w-1/2 py-2.5 font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  {lang === 'en' ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuote}
                  className="w-1/2 py-2.5 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs"
                >
                  {isSubmittingQuote
                    ? (lang === 'en' ? 'Sending...' : 'Envoi...')
                    : (lang === 'en' ? 'Send Quote' : 'Envoyer Devis')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof of Work Upload Modal */}
      {uploadBookingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto mb-2">
              <Camera className="w-6 h-6 text-blue-700" />
            </div>
            <h4 className="text-xl font-bold text-stone-900 text-center">
              {t.providerPortal.markCompleted}
            </h4>

            <form onSubmit={handleProofSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {lang === 'en' ? 'Proof of Work Photo URL' : 'URL de la Photo de Fin de Chantier'}
                </label>
                <input
                  type="text"
                  required
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600">
                {lang === 'en'
                  ? 'Once submitted, customer will receive an instant SMS notification to inspect the work and approve escrow payout.'
                  : 'Dès validation, le client recevra un SMS pour valider les travaux et débloquer le virement.'}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadBookingId(null)}
                  className="w-1/2 py-2.5 font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  {lang === 'en' ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs"
                >
                  {lang === 'en' ? 'Submit Proof' : 'Valider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
