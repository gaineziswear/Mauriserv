import React, { useState, useEffect } from 'react';
import {
  Language,
  ServiceCategory,
  ServiceRequest,
  Booking,
  Property,
  MaintenanceItem,
  Provider,
  Advertisement,
  PlatformMetrics,
  CommunicationLog,
} from './types';
import {
  mockCategories,
  mockUser,
  mockProperties,
  mockMaintenanceItems,
  mockProviders,
  mockGuides,
  mockAds,
} from './data/mockData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServiceCategoryGrid } from './components/ServiceCategoryGrid';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ActiveJobLiveCard } from './components/ActiveJobLiveCard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ProviderPortal } from './components/ProviderPortal';
import { AdminConsole } from './components/AdminConsole';
import { HomeGuidesSection } from './components/HomeGuidesSection';
import { SponsoredAdsBanner } from './components/SponsoredAdsBanner';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { MobileCompanionModal } from './components/MobileCompanionModal';
import { ProSignupModal } from './components/ProSignupModal';
import { Footer } from './components/Footer';

export function App() {
  // App-level state
  const [lang, setLang] = useState<Language>('en');
  const [activeView, setActiveView] = useState<'home' | 'customer-hub' | 'provider-portal' | 'admin-console'>('home');

  // Domain data state
  const [categories, setCategories] = useState<ServiceCategory[]>(mockCategories);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(mockMaintenanceItems);
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ads, setAds] = useState<Advertisement[]>(mockAds);
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalCustomers: 1840,
    totalVerifiedProviders: 320,
    totalRequests: 4290,
    activeBookings: 38,
    completedJobs: 3950,
    grossMarketplaceValueMUR: 7420000,
    totalPlatformCommissionMUR: 742000,
    averageResponseTimeMinutes: 12,
    customerSatisfactionScore: 4.92,
  });
  const [communications, setCommunications] = useState<CommunicationLog[]>([]);

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [initialCategoryHint, setInitialCategoryHint] = useState<string | undefined>(undefined);
  const [initialSearchQuery, setInitialSearchQuery] = useState<string | undefined>(undefined);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isProSignupModalOpen, setIsProSignupModalOpen] = useState(false);

  // Fetch initial data from Express API
  const refreshData = async () => {
    try {
      const [catsRes, reqsRes, booksRes, metricsRes, commsRes, adsRes] = await Promise.all([
        fetch('/api/v1/categories'),
        fetch('/api/v1/requests'),
        fetch('/api/v1/bookings'),
        fetch('/api/v1/admin/metrics'),
        fetch('/api/v1/admin/communications'),
        fetch('/api/v1/ads'),
      ]);

      if (catsRes.ok) {
        const c = await catsRes.json();
        if (c.data && c.data.length > 0) setCategories(c.data);
      }
      if (reqsRes.ok) {
        const r = await reqsRes.json();
        if (r.data) setRequests(r.data);
      }
      if (booksRes.ok) {
        const b = await booksRes.json();
        if (b.data) setBookings(b.data);
      }
      if (metricsRes.ok) {
        const m = await metricsRes.json();
        if (m.data) setMetrics(m.data);
      }
      if (commsRes.ok) {
        const co = await commsRes.json();
        if (co.data) setCommunications(co.data);
      }
      if (adsRes.ok) {
        const a = await adsRes.json();
        if (a.data) setAds(a.data);
      }
    } catch (err) {
      console.warn('Using client-side state engine fallback:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers
  const handleOpenRequestModal = (categoryOrQuery?: string) => {
    const isCat = categories.some((c) => c.id === categoryOrQuery || c.nameEn === categoryOrQuery);
    if (isCat) {
      setInitialCategoryHint(categoryOrQuery);
      setInitialSearchQuery(undefined);
    } else {
      setInitialSearchQuery(categoryOrQuery);
      setInitialCategoryHint(undefined);
    }
    setIsRequestModalOpen(true);
  };

  const handleBroadcastRequest = async (reqData: Partial<ServiceRequest>) => {
    try {
      const res = await fetch('/api/v1/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reqData,
          customerId: mockUser.id,
          customerName: mockUser.name,
          customerPhone: mockUser.phone,
          customerEmail: mockUser.email,
        }),
      });
      await res.json();
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReleaseEscrow = async (bookingId: string) => {
    try {
      await fetch(`/api/v1/bookings/${bookingId}/confirm-and-release`, {
        method: 'POST',
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkCompleteByPro = async (bookingId: string) => {
    try {
      await fetch(`/api/v1/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proofOfWorkUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        }),
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (bookingId: string, rating: number, comment: string) => {
    try {
      await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          rating,
          comment,
        }),
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitQuote = async (requestId: string, priceMUR: number, note: string) => {
    try {
      await fetch('/api/v1/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          providerId: mockProviders[0].id,
          proposedPriceMUR: priceMUR,
          note,
        }),
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProperty = async (propData: Partial<Property>) => {
    const newProp: Property = {
      id: `prop_${Date.now()}`,
      userId: mockUser.id,
      name: propData.name || 'New Home',
      type: propData.type || 'HOUSE',
      address: propData.address || '',
      district: propData.district || 'Plaines Wilhems',
      accessNotes: propData.accessNotes || '',
    };
    setProperties((prev) => [...prev, newProp]);
  };

  const handleBookMaintenance = (item: MaintenanceItem) => {
    handleOpenRequestModal(item.category);
  };

  const handleVerifyProvider = async (providerId: string, verified: boolean) => {
    try {
      await fetch('/api/v1/admin/verify-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, verified }),
      });
      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? { ...p, verificationStatus: verified ? 'VERIFIED' : 'REJECTED' }
            : p
        )
      );
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterPro = async (proData: any) => {
    const newPro: Provider = {
      id: `pro_${Date.now()}`,
      userId: `user_pro_${Date.now()}`,
      businessName: proData.businessName,
      ownerName: proData.ownerName,
      phone: proData.phone,
      email: `${proData.ownerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      whatsapp: proData.phone,
      serviceCategories: [proData.categoryId],
      serviceAreas: [proData.district],
      descriptionEn: `${proData.businessName} - Professional household service partner in Mauritius.`,
      descriptionFr: `${proData.businessName} - Artisan qualifié pour dépannages et installations.`,
      photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80',
      portfolioImages: [],
      certificates: ['Mauritius Trade License'],
      insurancePolicyNumber: 'SWAN-LIAB-88392',
      brnNumber: proData.brnNumber,
      yearsExperience: Number(proData.yearsExperience) || 3,
      pricingRateDescMUR: 'Rs 900 - 2,500 based on diagnosis',
      verificationStatus: 'VERIFIED',
      rating: 5.0,
      completedJobsCount: 0,
      responseRatePercent: 100,
      launchPartnerAdActive: true,
      launchPartnerAdExpiry: '2026-12-31',
    };
    setProviders((prev) => [newPro, ...prev]);
  };

  // Find active booking for customer preview card
  const activeBooking = bookings.find(
    (b) => b.status === 'IN_PROGRESS' || b.status === 'COMPLETED' || b.status === 'CUSTOMER_CONFIRMED'
  );

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Universal Navigation Header */}
      <Header
        lang={lang}
        onLanguageToggle={() => setLang(lang === 'en' ? 'fr' : 'en')}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenRequestModal={() => handleOpenRequestModal()}
        onOpenMobileModal={() => setIsMobileModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME MARKETPLACE LANDING */}
        {activeView === 'home' && (
          <div>
            <HeroSection
              lang={lang}
              onOpenRequestModal={handleOpenRequestModal}
              onSelectCategory={(catId) => handleOpenRequestModal(catId)}
              onOpenProSignup={() => setIsProSignupModalOpen(true)}
            />

            {/* Active Live Job Card (if booking exists) */}
            {activeBooking && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                <ActiveJobLiveCard
                  booking={activeBooking}
                  lang={lang}
                  onReleaseEscrow={handleReleaseEscrow}
                  onMarkCompleteByPro={handleMarkCompleteByPro}
                  onSubmitReview={handleSubmitReview}
                />
              </div>
            )}

            <ServiceCategoryGrid
              categories={categories}
              lang={lang}
              onSelectCategory={(catId, sub) => handleOpenRequestModal(catId)}
            />

            <HowItWorksSection
              lang={lang}
              onOpenRequestModal={() => handleOpenRequestModal()}
            />

            <HomeGuidesSection
              guides={mockGuides}
              lang={lang}
              onOpenServiceRequest={(catHint) => handleOpenRequestModal(catHint)}
            />

            <SponsoredAdsBanner ads={ads} lang={lang} />
          </div>
        )}

        {/* VIEW 2: CUSTOMER DASHBOARD (My Homes, Maintenance Memory, Past Bookings) */}
        {activeView === 'customer-hub' && (
          <CustomerDashboard
            user={mockUser}
            properties={properties}
            maintenanceItems={maintenanceItems}
            bookings={bookings}
            lang={lang}
            onAddProperty={handleAddProperty}
            onBookMaintenance={handleBookMaintenance}
          />
        )}

        {/* VIEW 3: PROVIDER PORTAL (Leads, Quotes, Payouts & Proof Upload) */}
        {activeView === 'provider-portal' && (
          <ProviderPortal
            provider={providers[0]}
            requests={requests}
            bookings={bookings}
            lang={lang}
            onSubmitQuote={handleSubmitQuote}
            onMarkJobComplete={handleMarkCompleteByPro}
          />
        )}

        {/* VIEW 4: ADMIN COMMAND CENTRE (Marketplace GMV, Verification Queue & Comms Feed) */}
        {activeView === 'admin-console' && (
          <AdminConsole
            metrics={metrics}
            providers={providers}
            communications={communications}
            bookings={bookings}
            lang={lang}
            onVerifyProvider={handleVerifyProvider}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectCategory={(catId) => handleOpenRequestModal(catId)}
        onOpenProSignup={() => setIsProSignupModalOpen(true)}
        onOpenMobileModal={() => setIsMobileModalOpen(true)}
      />

      {/* Interactive Modals */}
      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        categories={categories}
        properties={properties}
        lang={lang}
        initialCategoryId={initialCategoryHint}
        initialQuery={initialSearchQuery}
        onBroadcastRequest={handleBroadcastRequest}
      />

      <MobileCompanionModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        lang={lang}
        categories={categories}
        bookings={bookings}
        onOpenRequestModal={handleOpenRequestModal}
      />

      <ProSignupModal
        isOpen={isProSignupModalOpen}
        onClose={() => setIsProSignupModalOpen(false)}
        lang={lang}
        categories={categories}
        onRegisterPro={handleRegisterPro}
      />
    </div>
  );
}

export default App;
