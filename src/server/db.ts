import {
  SERVICE_CATEGORIES,
  INITIAL_PROVIDERS,
  INITIAL_PROPERTIES,
  INITIAL_MAINTENANCE_ITEMS,
  INITIAL_REQUESTS,
  INITIAL_BOOKINGS,
  INITIAL_COMMUNICATION_LOGS,
  INITIAL_HOME_GUIDES,
  INITIAL_ADVERTISEMENTS,
  INITIAL_PLATFORM_METRICS,
  INITIAL_USER,
  INITIAL_PROVIDER_USER,
} from '../data/mockData';
import {
  ServiceCategory,
  Provider,
  Property,
  MaintenanceItem,
  ServiceRequest,
  Booking,
  CommunicationLog,
  Dispute,
  Advertisement,
  HomeGuide,
  PlatformMetrics,
  User,
  Quote,
  Review,
} from '../types';

class MauriServDatabase {
  public users: User[] = [INITIAL_USER, INITIAL_PROVIDER_USER];
  public categories: ServiceCategory[] = [...SERVICE_CATEGORIES];
  public providers: Provider[] = [...INITIAL_PROVIDERS];
  public properties: Property[] = [...INITIAL_PROPERTIES];
  public maintenanceItems: MaintenanceItem[] = [...INITIAL_MAINTENANCE_ITEMS];
  public requests: ServiceRequest[] = [...INITIAL_REQUESTS];
  public quotes: Quote[] = [];
  public bookings: Booking[] = [...INITIAL_BOOKINGS];
  public reviews: Review[] = [];
  public communications: CommunicationLog[] = [...INITIAL_COMMUNICATION_LOGS];
  public disputes: Dispute[] = [];
  public advertisements: Advertisement[] = [...INITIAL_ADVERTISEMENTS];
  public homeGuides: HomeGuide[] = [...INITIAL_HOME_GUIDES];
  public metrics: PlatformMetrics = { ...INITIAL_PLATFORM_METRICS };

  // Create a new customer request and trigger matching
  createServiceRequest(data: Partial<ServiceRequest>): ServiceRequest {
    const id = `req_${Date.now()}`;
    const newRequest: ServiceRequest = {
      id,
      customerId: data.customerId || INITIAL_USER.id,
      customerName: data.customerName || INITIAL_USER.name,
      customerPhone: data.customerPhone || INITIAL_USER.phone,
      categoryId: data.categoryId || 'cat_plumbing',
      categoryName: data.categoryName || 'Plumbing & Drainage',
      subcategory: data.subcategory || 'General Fix',
      title: data.title || 'Household Service Request',
      description: data.description || '',
      mediaUrls: data.mediaUrls || [],
      location: data.location || 'Mauritius',
      district: data.district || 'Plaines Wilhems (Curepipe, Quatre Bornes, Rose Hill)',
      propertyId: data.propertyId,
      urgency: data.urgency || 'TODAY',
      preferredDate: data.preferredDate || new Date().toISOString().split('T')[0],
      preferredTimeSlot: data.preferredTimeSlot || 'Afternoon (12:00 - 16:00)',
      estimatedBudgetMUR: data.estimatedBudgetMUR || 1500,
      status: 'MATCHING',
      createdAt: new Date().toISOString(),
      aiTriage: data.aiTriage,
    };

    this.requests.unshift(newRequest);
    this.metrics.totalRequests += 1;

    // Log outbound WhatsApp & SMS notification to matched providers in the district
    this.logCommunication({
      recipientName: 'Verified District Pros',
      recipientContact: '+230 SMS/WhatsApp Broadcast',
      channel: 'WHATSAPP',
      direction: 'OUTBOUND',
      templateName: 'new_job_lead_available',
      messageContent: `MauriServ Pro Alert: New ${newRequest.categoryName} request in ${newRequest.district}. Job: "${newRequest.title}". Budget: Rs ${newRequest.estimatedBudgetMUR}.`,
      status: 'DELIVERED',
    });

    return newRequest;
  }

  // Provider submits a quote
  submitQuote(quoteData: Partial<Quote>): Quote {
    const id = `quote_${Date.now()}`;
    const newQuote: Quote = {
      id,
      requestId: quoteData.requestId || '',
      providerId: quoteData.providerId || 'pro_001',
      providerName: quoteData.providerName || 'Carver Electrical & Solar Ltd',
      providerRating: quoteData.providerRating || 4.95,
      providerPhotoUrl: quoteData.providerPhotoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      proposedPriceMUR: quoteData.proposedPriceMUR || 1500,
      estimatedDurationHours: quoteData.estimatedDurationHours || 2,
      earliestAvailable: quoteData.earliestAvailable || 'Today at 15:30',
      note: quoteData.note || 'Available with all required tools and spares.',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.quotes.unshift(newQuote);

    // Update request status to OFFERED
    const req = this.requests.find((r) => r.id === quoteData.requestId);
    if (req && req.status === 'MATCHING') {
      req.status = 'OFFERED';
    }

    return newQuote;
  }

  // Customer confirms booking and locks funds into escrow
  confirmBooking(requestId: string, providerId: string, agreedPriceMUR: number): Booking {
    const req = this.requests.find((r) => r.id === requestId);
    const pro = this.providers.find((p) => p.id === providerId) || this.providers[0];

    const commissionRate = 0.10; // 10% MauriServ platform fee
    const platformCommissionMUR = Math.round(agreedPriceMUR * commissionRate);
    const providerPayoutMUR = agreedPriceMUR - platformCommissionMUR;

    const id = `book_${Date.now()}`;
    const newBooking: Booking = {
      id,
      requestId,
      customerId: req ? req.customerId : INITIAL_USER.id,
      customerName: req ? req.customerName : INITIAL_USER.name,
      customerPhone: req ? req.customerPhone : INITIAL_USER.phone,
      providerId: pro.id,
      providerBusinessName: pro.businessName,
      providerPhone: pro.phone,
      categoryName: req ? req.categoryName : 'Household Service',
      title: req ? req.title : 'Service Dispatch',
      serviceAddress: req ? req.location : 'Mauritius Residence',
      district: req ? req.district : 'Plaines Wilhems',
      scheduledDateTime: new Date().toISOString(),
      agreedPriceMUR,
      platformCommissionRate: commissionRate,
      platformCommissionMUR,
      providerPayoutMUR,
      status: 'CONFIRMED',
      paymentStatus: 'HELD_IN_ESCROW',
      paymentMethod: 'JUICE_MCB',
      proofOfWorkUrls: [],
      notes: 'Booking locked. Escrow funds secured.',
      createdAt: new Date().toISOString(),
    };

    if (req) {
      req.status = 'CONFIRMED';
    }

    this.bookings.unshift(newBooking);
    this.metrics.activeBookings += 1;
    this.metrics.grossMarketplaceValueMUR += agreedPriceMUR;
    this.metrics.totalPlatformCommissionMUR += platformCommissionMUR;

    // Send confirmation notifications
    this.logCommunication({
      bookingId: id,
      recipientName: newBooking.customerName,
      recipientContact: newBooking.customerPhone,
      channel: 'WHATSAPP',
      direction: 'OUTBOUND',
      templateName: 'booking_secured_escrow',
      messageContent: `MauriServ: Booking #${id.slice(-6)} confirmed with ${pro.businessName}. Rs ${agreedPriceMUR} is securely held in escrow. Pro arriving soon!`,
      status: 'DELIVERED',
    });

    return newBooking;
  }

  // Provider uploads proof of work & marks complete
  markJobComplete(bookingId: string, proofUrls: string[]): Booking | null {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    booking.status = 'COMPLETED';
    booking.proofOfWorkUrls = proofUrls.length > 0 ? proofUrls : [
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80'
    ];
    booking.completedAt = new Date().toISOString();

    // Alert customer to inspect and release payment
    this.logCommunication({
      bookingId,
      recipientName: booking.customerName,
      recipientContact: booking.customerPhone,
      channel: 'SMS',
      direction: 'OUTBOUND',
      templateName: 'pro_marked_completed',
      messageContent: `MauriServ: ${booking.providerBusinessName} has finished your job. Please review the completion photos in your dashboard and release the escrow payment.`,
      status: 'DELIVERED',
    });

    return booking;
  }

  // Customer approves work and releases escrow payout to provider
  releaseEscrowPayment(bookingId: string): Booking | null {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    booking.status = 'CUSTOMER_CONFIRMED';
    booking.paymentStatus = 'RELEASED_TO_PROVIDER';

    this.metrics.activeBookings = Math.max(0, this.metrics.activeBookings - 1);
    this.metrics.completedJobs += 1;

    // Increment provider's completed jobs
    const pro = this.providers.find((p) => p.id === booking.providerId);
    if (pro) {
      pro.completedJobsCount += 1;
    }

    // Log payout disbursement via MCB Juice / Instant Bank Transfer
    this.logCommunication({
      bookingId,
      recipientName: booking.providerBusinessName,
      recipientContact: booking.providerPhone,
      channel: 'SMS',
      direction: 'OUTBOUND',
      templateName: 'payout_disbursed',
      messageContent: `MauriServ Payout: Customer confirmed job #${booking.id.slice(-6)}. Net payout of Rs ${booking.providerPayoutMUR} has been transferred to your registered MCB Juice / Bank account.`,
      status: 'DELIVERED',
    });

    return booking;
  }

  // Submit review
  submitReview(bookingId: string, rating: number, comment: string): Review | null {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    const review: Review = {
      id: `rev_${Date.now()}`,
      bookingId,
      providerId: booking.providerId,
      customerId: booking.customerId,
      customerName: booking.customerName,
      overallRating: rating,
      qualityRating: rating,
      communicationRating: 5,
      punctualityRating: 5,
      valueRating: 5,
      comment,
      createdAt: new Date().toISOString(),
    };

    booking.reviewId = review.id;
    this.reviews.unshift(review);

    return review;
  }

  // Add a property to My Homes
  addProperty(propertyData: Partial<Property>): Property {
    const newProp: Property = {
      id: `prop_${Date.now()}`,
      userId: propertyData.userId || INITIAL_USER.id,
      name: propertyData.name || 'New Property',
      type: propertyData.type || 'HOUSE',
      address: propertyData.address || '',
      district: propertyData.district || 'Plaines Wilhems (Curepipe, Quatre Bornes, Rose Hill)',
      accessNotes: propertyData.accessNotes || '',
    };
    this.properties.unshift(newProp);
    return newProp;
  }

  // Add or update a maintenance timeline item
  addMaintenanceItem(item: Partial<MaintenanceItem>): MaintenanceItem {
    const newItem: MaintenanceItem = {
      id: `maint_${Date.now()}`,
      propertyId: item.propertyId || this.properties[0].id,
      propertyName: item.propertyName || this.properties[0].name,
      systemName: item.systemName || 'Household Appliance',
      category: item.category || 'General Maintenance',
      lastServiceDate: item.lastServiceDate || new Date().toISOString().split('T')[0],
      nextServiceDueDate: item.nextServiceDueDate || new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
      recommendedIntervalMonths: item.recommendedIntervalMonths || 6,
      status: item.status || 'UP_TO_DATE',
      notes: item.notes || '',
    };
    this.maintenanceItems.unshift(newItem);
    return newItem;
  }

  // Log unified communication
  logCommunication(data: Partial<CommunicationLog>): CommunicationLog {
    const log: CommunicationLog = {
      id: `comm_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      bookingId: data.bookingId,
      recipientName: data.recipientName || 'User',
      recipientContact: data.recipientContact || '+230 ...',
      channel: data.channel || 'WHATSAPP',
      direction: data.direction || 'OUTBOUND',
      templateName: data.templateName || 'system_notification',
      messageContent: data.messageContent || '',
      status: data.status || 'DELIVERED',
      timestamp: new Date().toISOString(),
    };
    this.communications.unshift(log);
    return log;
  }

  // Approve a provider's verification status
  verifyProvider(providerId: string, verified: boolean): Provider | null {
    const pro = this.providers.find((p) => p.id === providerId);
    if (!pro) return null;
    pro.verificationStatus = verified ? 'VERIFIED' : 'REJECTED';
    return pro;
  }
}

export const db = new MauriServDatabase();
