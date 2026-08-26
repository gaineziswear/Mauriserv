import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ShieldCheck,
  MessageSquare,
  AlertOctagon,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  Language,
  PlatformMetrics,
  Provider,
  CommunicationLog,
  Booking,
} from '../types';
import { translations } from '../translations';

interface AdminConsoleProps {
  metrics: PlatformMetrics;
  providers: Provider[];
  communications: CommunicationLog[];
  bookings: Booking[];
  lang: Language;
  onVerifyProvider: (providerId: string, verified: boolean) => Promise<void>;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  metrics,
  providers,
  communications,
  bookings,
  lang,
  onVerifyProvider,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'metrics' | 'verifications' | 'comms' | 'disputes'>('metrics');

  const pendingProviders = providers.filter((p) => p.verificationStatus === 'PENDING' || p.verificationStatus === 'UNDER_REVIEW');

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WHATSAPP':
        return <span className="text-emerald-600 font-bold">WhatsApp</span>;
      case 'SMS':
        return <span className="text-blue-600 font-bold">SMS</span>;
      case 'EMAIL':
        return <span className="text-purple-600 font-bold">Email</span>;
      default:
        return <span className="text-stone-600 font-bold">Push</span>;
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>MauriServ Operations Command</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
            {t.admin.title}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {t.admin.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-800 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Marketplace Healthy</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'metrics'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{lang === 'en' ? 'Marketplace Overview' : 'Vue d’Ensemble'}</span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'verifications'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.admin.verificationQueue}</span>
          {pendingProviders.length > 0 && (
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingProviders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('comms')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'comms'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.admin.communicationsCenter}</span>
        </button>
      </div>

      {/* Tab 1: Operational Metrics */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t.admin.statsGMV}
              </div>
              <div className="text-2xl font-black text-stone-900 mt-1">
                Rs {metrics.grossMarketplaceValueMUR.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                Total marketplace throughput
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t.admin.statsCommissions}
              </div>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                Rs {metrics.totalPlatformCommissionMUR.toLocaleString()}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                10% configurable escrow fee
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t.admin.statsActiveBookings}
              </div>
              <div className="text-2xl font-black text-stone-900 mt-1">
                {metrics.activeBookings}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {metrics.completedJobs} historical completions
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t.admin.statsFillRate}
              </div>
              <div className="text-2xl font-black text-stone-900 mt-1">
                98.4%
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                Avg match time: {metrics.averageResponseTimeMinutes} mins
              </div>
            </div>
          </div>

          {/* Active Dispatches Feed */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-stone-900">
              {lang === 'en' ? 'Live Dispatches in Progress' : 'Interventions Actives'}
            </h3>
            <div className="divide-y divide-stone-100 text-xs">
              {bookings.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-stone-900">{b.title}</div>
                    <div className="text-stone-500">
                      Customer: {b.customerName} • Pro: {b.providerBusinessName} ({b.district})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-900">Rs {b.agreedPriceMUR.toLocaleString()}</div>
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Provider Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-stone-900">
            {lang === 'en' ? 'Mauritian Tradesmen Registry' : 'Registre des Professionnels Mauriciens'}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {providers.map((pro) => (
              <div
                key={pro.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={pro.photoUrl}
                    alt={pro.businessName}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-300 shadow-xs shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{pro.businessName}</span>
                      <span className="text-stone-500">({pro.ownerName})</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          pro.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {pro.verificationStatus}
                      </span>
                    </div>

                    <div className="text-stone-600">
                      Trades: {pro.serviceCategories.join(', ')} • {pro.yearsExperience} yrs exp
                    </div>
                    <div className="text-stone-500">
                      BRN: {pro.brnNumber || 'Pending'} • Insurance: {pro.insurancePolicyNumber || 'Pending'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {pro.verificationStatus !== 'VERIFIED' ? (
                    <button
                      onClick={() => onVerifyProvider(pro.id, true)}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>{t.admin.approvePro}</span>
                    </button>
                  ) : (
                    <span className="text-emerald-800 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      Verified & Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Unified Communications Center */}
      {activeTab === 'comms' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                {lang === 'en' ? 'Unified Messaging Feed' : 'Flux de Messages Unifié'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'en' ? 'Audit logs for WhatsApp, SMS, Email and Push templates' : 'Journaux d’audit pour WhatsApp, SMS, Email'}
              </p>
            </div>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {communications.map((comm) => (
              <div key={comm.id} className="py-3.5 space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-[11px]">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(comm.channel)}
                    <span>•</span>
                    <span className="font-semibold text-stone-800">{comm.recipientName} ({comm.recipientContact})</span>
                    <span>•</span>
                    <span className="bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-mono text-[10px]">
                      {comm.templateName}
                    </span>
                  </div>
                  <span className="text-stone-400 font-mono">
                    {new Date(comm.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-stone-700 font-medium bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 leading-relaxed">
                  {comm.messageContent}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
