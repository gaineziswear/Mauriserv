import React, { useState } from 'react';
import {
  Home,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  Share2,
  Gift,
  Copy,
  Check,
  ShieldCheck,
  Wrench,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import {
  Language,
  Property,
  MaintenanceItem,
  Booking,
  User,
} from '../types';
import { translations } from '../translations';

interface CustomerDashboardProps {
  user: User;
  properties: Property[];
  maintenanceItems: MaintenanceItem[];
  bookings: Booking[];
  lang: Language;
  onAddProperty: (property: Partial<Property>) => Promise<void>;
  onBookMaintenance: (item: MaintenanceItem) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  properties,
  maintenanceItems,
  bookings,
  lang,
  onAddProperty,
  onBookMaintenance,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'my-homes' | 'maintenance' | 'history' | 'referrals'>('my-homes');

  // Add Property Form State
  const [showAddPropModal, setShowAddPropModal] = useState(false);
  const [propName, setPropName] = useState('');
  const [propType, setPropType] = useState<'HOUSE' | 'APARTMENT' | 'RENTAL' | 'PARENTS_HOME'>('HOUSE');
  const [propAddress, setPropAddress] = useState('');
  const [propDistrict, setPropDistrict] = useState('Plaines Wilhems (Curepipe, Quatre Bornes, Rose Hill)');
  const [propAccess, setPropAccess] = useState('');

  // Referral Copy State
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://mauriserv.mu/join?ref=${user.referralCode || 'DEVINA300'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddProperty({
      name: propName,
      type: propType,
      address: propAddress,
      district: propDistrict,
      accessNotes: propAccess,
    });
    setShowAddPropModal(false);
    setPropName('');
    setPropAddress('');
    setPropAccess('');
  };

  const getMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case 'UP_TO_DATE':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t.myHomes.statusUpToDate}</span>
          </span>
        );
      case 'DUE_SOON':
        return (
          <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{t.myHomes.statusDueSoon}</span>
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="bg-rose-100 text-rose-900 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>{t.myHomes.statusOverdue}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Customer Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-700 shadow-xs"
          />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {lang === 'en' ? 'Customer Profile' : 'Profil Client'}
            </div>
            <h2 className="text-2xl font-black text-stone-900">{user.name}</h2>
            <p className="text-xs text-stone-500">
              {user.phone} • {user.email} • {properties.length} {lang === 'en' ? 'registered homes' : 'propriétés enregistrées'}
            </p>
          </div>
        </div>

        {/* Wallet & Referral summary */}
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center gap-4">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {t.referral.walletBalance}
            </div>
            <div className="text-lg font-black text-emerald-950">
              Rs {user.walletBalanceMUR.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('referrals')}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs"
          >
            {lang === 'en' ? 'Invite & Earn' : 'Parrainer'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-stone-200 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('my-homes')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'my-homes'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{lang === 'en' ? 'My Homes' : 'Mes Résidences'}</span>
          <span className="bg-stone-200 text-stone-700 text-[10px] px-1.5 py-0.2 rounded-full">
            {properties.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'maintenance'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>{t.myHomes.maintenanceTimeline}</span>
          <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {maintenanceItems.filter((m) => m.status !== 'UP_TO_DATE').length} due
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{lang === 'en' ? 'Service History & Receipts' : 'Historique & Factures'}</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'referrals'
              ? 'border-emerald-800 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>{lang === 'en' ? 'Refer & Earn Rs 300' : 'Parrainage & Récompenses'}</span>
        </button>
      </div>

      {/* Tab 1: My Homes */}
      {activeTab === 'my-homes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                {lang === 'en' ? 'Registered Properties in Mauritius' : 'Propriétés Enregistrées à Maurice'}
              </h3>
              <p className="text-xs text-stone-500">
                {t.myHomes.subtitle}
              </p>
            </div>
            <button
              onClick={() => setShowAddPropModal(true)}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t.myHomes.addProperty}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                    <Home className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {prop.type}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 text-base">{prop.name}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">{prop.address}</p>
                  <p className="text-[11px] text-stone-400">{prop.district}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl">
                  <span className="font-bold text-stone-700 block mb-0.5">
                    {t.myHomes.accessNotes}:
                  </span>
                  {prop.accessNotes || 'No specific gate notes stored.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Household Maintenance Memory */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-6 rounded-3xl shadow-sm space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {lang === 'en' ? 'Smart Maintenance Memory' : 'Mémoire Prédictive d’Entretien'}
            </div>
            <h3 className="text-2xl font-black text-white">
              {lang === 'en' ? 'Never Let AC Mould or Solar Scale Damage Your Home' : 'Protégez vos Équipements Clés'}
            </h3>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'MauriServ tracks recurring maintenance cycles tailored to the tropical Mauritian climate. One-click booking with your preferred tradesman.'
                : 'MauriServ suit l’historique d’entretien de vos climatiseurs, toitures et chauffe-eau solaires pour anticiper les pannes.'}
            </p>
          </div>

          <div className="space-y-4">
            {maintenanceItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-bold text-stone-900 text-base">{item.systemName}</h4>
                    {getMaintenanceStatusBadge(item.status)}
                  </div>
                  <p className="text-xs text-stone-500 font-medium">
                    {item.propertyName} • {item.category}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                    {item.notes}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-stone-400 pt-1">
                    <span>{t.myHomes.lastServiced}: {item.lastServiceDate}</span>
                    <span>•</span>
                    <span className="font-semibold text-stone-700">{t.myHomes.nextDue}: {item.nextServiceDueDate}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => onBookMaintenance(item)}
                    className="w-full md:w-auto bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t.myHomes.bookMaintenance}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: History & Receipts */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-stone-900">
            {lang === 'en' ? 'Completed Dispatches & Receipts' : 'Historique des Prestations & Reçus'}
          </h3>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm sm:text-base">{b.title}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {b.providerBusinessName} • {b.serviceAddress}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Date: {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs font-bold text-stone-900">
                      Rs {b.agreedPriceMUR.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-800 font-semibold">
                      Paid via {b.paymentMethod}
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`MauriServ Electronic Receipt #${b.id.slice(-6)}\nAmount: Rs ${b.agreedPriceMUR}\nProvider: ${b.providerBusinessName}\nMauritius VAT & BRN Verified.`)}
                    className="p-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4 text-stone-500" />
                    <span className="hidden sm:inline">Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Referral & Earn */}
      {activeTab === 'referrals' && (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <Gift className="w-8 h-8 text-emerald-700" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-stone-900 font-display">
              {t.referral.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
              {t.referral.subtitle}
            </p>
          </div>

          {/* Referral Code Box */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-2">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {t.referral.yourCode}
            </div>
            <div className="text-2xl font-black tracking-widest text-emerald-900">
              {user.referralCode || 'DEVINA300'}
            </div>
            <button
              onClick={handleCopyReferral}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-emerald-300" />}
              <span>{copied ? t.referral.codeCopied : t.referral.copyCode}</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddPropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h4 className="text-xl font-bold text-stone-900">
              {t.myHomes.addProperty}
            </h4>

            <form onSubmit={handleCreateProperty} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {t.myHomes.propertyName}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Baie Beach House"
                  value={propName}
                  onChange={(e) => setPropName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {t.myHomes.propertyType}
                </label>
                <select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                >
                  <option value="HOUSE">House / Villa</option>
                  <option value="APARTMENT">Apartment / Penthouse</option>
                  <option value="RENTAL">Rental / AirBnB Property</option>
                  <option value="PARENTS_HOME">Parents' Home</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {t.myHomes.address}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Road, Grand Baie"
                  value={propAddress}
                  onChange={(e) => setPropAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {t.myHomes.accessNotes}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Gate code #1234, watch dog in yard"
                  value={propAccess}
                  onChange={(e) => setPropAccess(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPropModal(false)}
                  className="w-1/2 py-2.5 font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  {lang === 'en' ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs"
                >
                  {lang === 'en' ? 'Save Property' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
