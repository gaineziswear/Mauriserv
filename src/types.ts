/**
 * MauriServ - Core Domain Types & Relational Models
 * Mauritius-first Managed Household Services Marketplace
 */

export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPPORT';

export type Language = 'en' | 'fr';

export type UrgencyLevel = 'EMERGENCY' | 'TODAY' | 'THIS_WEEK' | 'FLEXIBLE';

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'SUSPENDED' | 'REJECTED';

export type BookingStatus =
  | 'REQUESTED'
  | 'MATCHING'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CUSTOMER_CONFIRMED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'HELD_IN_ESCROW' | 'RELEASED_TO_PROVIDER' | 'REFUNDED';

export type PaymentMethodType = 'JUICE_MCB' | 'CARD' | 'MYT_MONEY' | 'BANK_TRANSFER' | 'CASH_ON_COMPLETION' | 'CRYPTO_TEST';

export type CommChannel = 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PUSH';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string; // +230 ...
  role: UserRole;
  language: Language;
  avatarUrl: string;
  createdAt: string;
  referralCode?: string;
  referredBy?: string;
  walletBalanceMUR: number;
}

export interface Property {
  id: string;
  userId: string;
  name: string; // e.g. "Primary Residence - Curepipe", "Grand Baie Villa", "Parents' Home"
  type: 'HOUSE' | 'APARTMENT' | 'RENTAL' | 'PARENTS_HOME' | 'COMMERCIAL';
  address: string;
  district: string; // Plaines Wilhems, Rivière du Rempart, Port Louis, Black River, etc.
  accessNotes: string;
  preferredProviderId?: string;
}

export interface MaintenanceItem {
  id: string;
  propertyId: string;
  propertyName: string;
  systemName: string; // "Air Conditioning (Living & Master)", "Solar Water Heater", "Roof Waterproofing", "Water Pump"
  category: string;
  lastServiceDate: string;
  nextServiceDueDate: string;
  recommendedIntervalMonths: number;
  status: 'UP_TO_DATE' | 'DUE_SOON' | 'OVERDUE';
  notes: string;
}

export interface ServiceCategory {
  id: string;
  nameEn: string;
  nameFr: string;
  slug: string;
  iconName: string;
  imageUrl: string;
  descriptionEn: string;
  descriptionFr: string;
  startingPriceMUR: number;
  popularSubcategoriesEn: string[];
  popularSubcategoriesFr: string[];
  emergencyAvailable: boolean;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  categoryId: string;
  categoryName: string;
  subcategory: string;
  title: string;
  description: string;
  mediaUrls: string[];
  location: string;
  district: string;
  propertyId?: string;
  urgency: UrgencyLevel;
  preferredDate: string;
  preferredTimeSlot: string;
  estimatedBudgetMUR?: number;
  status: BookingStatus;
  createdAt: string;
  aiTriage?: {
    identifiedIssue: string;
    suggestedCategory: string;
    estimatedRangeMUR: string;
    safetyPrecautions: string[];
    urgencyAssessment: string;
  };
}

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  whatsapp: string;
  serviceCategories: string[];
  serviceAreas: string[]; // e.g. ["Grand Baie", "Pereybere", "Port Louis", "Curepipe"]
  descriptionEn: string;
  descriptionFr: string;
  photoUrl: string;
  portfolioImages: string[];
  certificates: string[];
  insurancePolicyNumber?: string;
  brnNumber?: string; // Mauritian Business Registration Number
  yearsExperience: number;
  pricingRateDescMUR: string;
  verificationStatus: VerificationStatus;
  rating: number;
  completedJobsCount: number;
  responseRatePercent: number;
  launchPartnerAdActive: boolean;
  launchPartnerAdExpiry?: string;
}

export interface Quote {
  id: string;
  requestId: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  providerPhotoUrl: string;
  proposedPriceMUR: number;
  estimatedDurationHours: number;
  earliestAvailable: string;
  note: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface Booking {
  id: string;
  requestId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerBusinessName: string;
  providerPhone: string;
  categoryName: string;
  title: string;
  serviceAddress: string;
  district: string;
  scheduledDateTime: string;
  agreedPriceMUR: number;
  platformCommissionRate: number; // e.g. 0.10 for 10%
  platformCommissionMUR: number;
  providerPayoutMUR: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethodType;
  proofOfWorkUrls: string[];
  notes?: string;
  createdAt: string;
  completedAt?: string;
  reviewId?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  providerId: string;
  customerId: string;
  customerName: string;
  overallRating: number; // 1-5
  qualityRating: number;
  communicationRating: number;
  punctualityRating: number;
  valueRating: number;
  comment: string;
  createdAt: string;
}

export interface CommunicationLog {
  id: string;
  bookingId?: string;
  recipientName: string;
  recipientContact: string;
  channel: CommChannel;
  direction: 'OUTBOUND' | 'INBOUND';
  templateName: string;
  messageContent: string;
  status: 'DELIVERED' | 'SENT' | 'FAILED' | 'READ';
  timestamp: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  reason: string;
  description: string;
  evidenceUrls: string[];
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';
  resolutionNotes?: string;
  createdAt: string;
}

export interface Advertisement {
  id: string;
  advertiserName: string;
  headlineEn: string;
  headlineFr: string;
  subheadlineEn: string;
  subheadlineFr: string;
  ctaTextEn: string;
  ctaTextFr: string;
  targetUrl: string;
  imageUrl: string;
  categoryTag: string;
  isSponsored: true;
  impressions: number;
  clicks: number;
  active: boolean;
}

export interface HomeGuide {
  id: string;
  titleEn: string;
  titleFr: string;
  category: string;
  readTimeMinutes: number;
  summaryEn: string;
  summaryFr: string;
  imageUrl: string;
  stepsEn: string[];
  stepsFr: string[];
  safetyWarningEn?: string;
  safetyWarningFr?: string;
}

export interface PlatformMetrics {
  totalCustomers: number;
  totalVerifiedProviders: number;
  totalRequests: number;
  activeBookings: number;
  completedJobs: number;
  grossMarketplaceValueMUR: number;
  totalPlatformCommissionMUR: number;
  averageResponseTimeMinutes: number;
  customerSatisfactionScore: number;
}
