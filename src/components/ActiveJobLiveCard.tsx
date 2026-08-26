import React, { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  CreditCard,
  Camera,
  Star,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Booking, Language } from '../types';
import { translations } from '../translations';

interface ActiveJobLiveCardProps {
  booking: Booking;
  lang: Language;
  onReleaseEscrow: (bookingId: string) => Promise<void>;
  onMarkCompleteByPro: (bookingId: string) => Promise<void>;
  onSubmitReview: (bookingId: string, rating: number, comment: string) => Promise<void>;
}

export const ActiveJobLiveCard: React.FC<ActiveJobLiveCardProps> = ({
  booking,
  lang,
  onReleaseEscrow,
  onMarkCompleteByPro,
  onSubmitReview,
}) => {
  const t = translations[lang];
  const [isReleasing, setIsReleasing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleReleasePayment = async () => {
    setIsReleasing(true);
    try {
      await onReleaseEscrow(booking.id);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setShowReviewModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReleasing(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmitReview(booking.id, rating, reviewComment);
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewModal(false);
    }, 1200);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{lang === 'en' ? 'In Progress on Site' : 'Intervention en Cours'}</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full border border-blue-300 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-blue-700" />
            <span>{lang === 'en' ? 'Proof Uploaded / Awaiting Confirmation' : 'Preuves Déposées / En Attente'}</span>
          </span>
        );
      case 'CUSTOMER_CONFIRMED':
        return (
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'en' ? 'Completed & Paid Out' : 'Terminé & Payé'}</span>
          </span>
        );
      default:
        return (
          <span className="bg-stone-100 text-stone-800 text-xs font-bold px-3 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-800/20 shadow-xl overflow-hidden mb-12">
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'en' ? 'Active Managed Dispatch' : 'Intervention Active en Cours'}</span>
            <span className="text-emerald-500">•</span>
            <span>Booking #{booking.id.slice(-6)}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            {booking.title}
          </h3>
          <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{booking.serviceAddress}</span>
          </p>
        </div>

        <div>{getStatusBadge(booking.status)}</div>
      </div>

      {/* Body Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Assigned Provider Details */}
        <div className="lg:col-span-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {t.activeJob.provider}
          </div>
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
              alt={booking.providerBusinessName}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
            />
            <div>
              <div className="font-bold text-stone-900 text-sm">
                {booking.providerBusinessName}
              </div>
              <div className="text-xs text-emerald-800 font-semibold">
                Verified Mauritian Pro (CEB Wireman)
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-600">
            <a
              href={`tel:${booking.providerPhone}`}
              className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{booking.providerPhone}</span>
            </a>
            <span className="text-stone-400">WhatsApp Active</span>
          </div>
        </div>

        {/* Middle: Escrow Payment Breakdown */}
        <div className="lg:col-span-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
            <span>MauriServ Escrow Breakdown</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          </div>

          <div className="space-y-1 text-xs pt-1">
            <div className="flex justify-between text-stone-600">
              <span>{lang === 'en' ? 'Agreed Job Fee:' : 'Montant convenu :'}</span>
              <span className="font-bold text-stone-900">Rs {booking.agreedPriceMUR.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-500 text-[11px]">
              <span>{t.activeJob.platformFee}</span>
              <span>Rs {booking.platformCommissionMUR.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-semibold text-[11px] pt-1 border-t border-stone-200">
              <span>{t.activeJob.providerPayout}</span>
              <span>Rs {booking.providerPayoutMUR.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {booking.paymentStatus === 'HELD_IN_ESCROW'
                ? (lang === 'en' ? 'Funds secured in Escrow via MCB Juice' : 'Fonds sécurisés en séquestre MCB Juice')
                : (lang === 'en' ? 'Funds released directly to Pro' : 'Fonds débloqués vers le professionnel')}
            </span>
          </div>
        </div>

        {/* Right: Actions & Proof of Work */}
        <div className="lg:col-span-4 space-y-4">
          {/* Proof of work photo preview */}
          {booking.proofOfWorkUrls && booking.proofOfWorkUrls.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.activeJob.proofOfWork}</span>
              </div>
              <div className="flex gap-2">
                {booking.proofOfWorkUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Proof of work"
                    className="w-20 h-16 object-cover rounded-xl border border-stone-300 shadow-xs"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Interactive State Action Buttons */}
          <div className="space-y-2 pt-1">
            {booking.status === 'IN_PROGRESS' && (
              <div className="space-y-2">
                <button
                  onClick={() => onMarkCompleteByPro(booking.id)}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'en' ? 'Simulate Pro: Upload Proof & Complete' : 'Simuler Pro : Déposer Preuve & Terminer'}</span>
                </button>
              </div>
            )}

            {booking.status === 'COMPLETED' && (
              <div className="space-y-2">
                <div className="bg-emerald-50 text-emerald-900 text-xs p-2.5 rounded-xl border border-emerald-200">
                  {t.activeJob.jobDoneAlert}
                </div>
                <button
                  onClick={handleReleasePayment}
                  disabled={isReleasing}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>
                    {isReleasing
                      ? (lang === 'en' ? 'Releasing Escrow...' : 'Libération des fonds...')
                      : t.activeJob.releasePayment.replace('{amount}', booking.agreedPriceMUR.toLocaleString())}
                  </span>
                </button>
              </div>
            )}

            {booking.status === 'CUSTOMER_CONFIRMED' && (
              <div className="space-y-2">
                <div className="bg-emerald-100 text-emerald-900 text-xs font-bold p-3 rounded-xl border border-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t.activeJob.paymentReleased}</span>
                </div>
                {!booking.reviewId && !reviewSubmitted && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                    <span>{lang === 'en' ? 'Leave a Review for Carver Electrical' : 'Laisser un avis pour Carver Electrical'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal Dialog */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
              </div>
              <h4 className="text-xl font-bold text-stone-900">
                {lang === 'en' ? 'Rate Your Service Experience' : 'Notez votre expérience'}
              </h4>
              <p className="text-xs text-stone-500">
                {booking.providerBusinessName} • {booking.title}
              </p>
            </div>

            {reviewSubmitted ? (
              <div className="bg-emerald-100 text-emerald-900 p-4 rounded-2xl text-center text-xs font-bold border border-emerald-300">
                {lang === 'en' ? 'Thank you! Your verified review has been published.' : 'Merci ! Votre avis certifié a été publié.'}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Star Picker */}
                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? 'Share details of the workmanship, punctuality, and cleanliness...'
                      : 'Partagez vos impressions sur la qualité, la ponctualité et la propreté...'
                  }
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="w-1/2 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                  >
                    {lang === 'en' ? 'Cancel' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs"
                  >
                    {lang === 'en' ? 'Submit Review' : 'Publier l’Avis'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
