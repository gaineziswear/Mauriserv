import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import { analyzeHouseholdIssue } from './src/server/gemini';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // REST API v1
  // ==========================================

  // Health check
  app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', platform: 'MauriServ', timestamp: new Date().toISOString() });
  });

  // Service Categories
  app.get('/api/v1/categories', (req, res) => {
    res.json({ success: true, data: db.categories });
  });

  // Providers
  app.get('/api/v1/providers', (req, res) => {
    const { district, category } = req.query;
    let results = [...db.providers];

    if (category && typeof category === 'string' && category !== 'ALL') {
      results = results.filter((p) =>
        p.serviceCategories.some((c) => c.toLowerCase().includes(category.toLowerCase()))
      );
    }

    if (district && typeof district === 'string' && district !== 'ALL') {
      results = results.filter((p) =>
        p.serviceAreas.some((d) => d.toLowerCase().includes(district.toLowerCase()))
      );
    }

    res.json({ success: true, data: results });
  });

  // AI Diagnostic & Triage
  app.post('/api/v1/ai/diagnose', async (req, res) => {
    try {
      const { title, description, categoryHint } = req.body;
      const triage = await analyzeHouseholdIssue(title, description, categoryHint);
      res.json({ success: true, data: triage });
    } catch (error) {
      console.error('AI diagnose API error:', error);
      res.status(500).json({ success: false, error: 'Diagnostic service temporarily unavailable' });
    }
  });

  // Service Requests
  app.get('/api/v1/requests', (req, res) => {
    res.json({ success: true, data: db.requests });
  });

  app.post('/api/v1/requests', async (req, res) => {
    try {
      const { title, description, categoryId, categoryName, subcategory, location, district, urgency, preferredDate, preferredTimeSlot, estimatedBudgetMUR, propertyId } = req.body;

      // Optional auto-AI diagnostic if not already attached
      let aiTriage = req.body.aiTriage;
      if (!aiTriage && title) {
        aiTriage = await analyzeHouseholdIssue(title, description || '', categoryName);
      }

      const newRequest = db.createServiceRequest({
        title,
        description,
        categoryId,
        categoryName,
        subcategory,
        location,
        district,
        urgency,
        preferredDate,
        preferredTimeSlot,
        estimatedBudgetMUR: Number(estimatedBudgetMUR) || 1500,
        propertyId,
        aiTriage,
      });

      res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({ success: false, error: 'Failed to broadcast request' });
    }
  });

  // Quotes
  app.post('/api/v1/quotes', (req, res) => {
    try {
      const quote = db.submitQuote(req.body);
      res.status(201).json({ success: true, data: quote });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to submit quote' });
    }
  });

  // Bookings
  app.get('/api/v1/bookings', (req, res) => {
    res.json({ success: true, data: db.bookings });
  });

  app.post('/api/v1/bookings', (req, res) => {
    try {
      const { requestId, providerId, agreedPriceMUR } = req.body;
      const booking = db.confirmBooking(requestId, providerId, Number(agreedPriceMUR) || 1850);
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to confirm booking' });
    }
  });

  app.post('/api/v1/bookings/:id/complete', (req, res) => {
    try {
      const { proofUrls } = req.body;
      const updated = db.markJobComplete(req.params.id, proofUrls || []);
      if (!updated) return res.status(404).json({ success: false, error: 'Booking not found' });
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to mark job complete' });
    }
  });

  app.post('/api/v1/bookings/:id/release-escrow', (req, res) => {
    try {
      const updated = db.releaseEscrowPayment(req.params.id);
      if (!updated) return res.status(404).json({ success: false, error: 'Booking not found' });
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to release escrow' });
    }
  });

  app.post('/api/v1/bookings/:id/review', (req, res) => {
    try {
      const { rating, comment } = req.body;
      const review = db.submitReview(req.params.id, Number(rating) || 5, comment || '');
      if (!review) return res.status(404).json({ success: false, error: 'Booking not found' });
      res.json({ success: true, data: review });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to submit review' });
    }
  });

  // My Homes & Properties
  app.get('/api/v1/properties', (req, res) => {
    res.json({ success: true, data: db.properties });
  });

  app.post('/api/v1/properties', (req, res) => {
    try {
      const prop = db.addProperty(req.body);
      res.status(201).json({ success: true, data: prop });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to save property' });
    }
  });

  // Maintenance Items
  app.get('/api/v1/maintenance', (req, res) => {
    res.json({ success: true, data: db.maintenanceItems });
  });

  app.post('/api/v1/maintenance', (req, res) => {
    try {
      const item = db.addMaintenanceItem(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to save maintenance item' });
    }
  });

  // Communications & Notifications
  app.get('/api/v1/communications', (req, res) => {
    res.json({ success: true, data: db.communications });
  });

  // Guides & Knowledge
  app.get('/api/v1/guides', (req, res) => {
    res.json({ success: true, data: db.homeGuides });
  });

  // Sponsored Ads
  app.get('/api/v1/ads', (req, res) => {
    res.json({ success: true, data: db.advertisements });
  });

  // Platform Metrics
  app.get('/api/v1/metrics', (req, res) => {
    res.json({ success: true, data: db.metrics });
  });

  // Admin Verification
  app.post('/api/v1/admin/verify-pro', (req, res) => {
    const { providerId, verified } = req.body;
    const pro = db.verifyProvider(providerId, !!verified);
    res.json({ success: true, data: pro });
  });

  // ==========================================
  // Vite Integration (Dev / Prod)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MauriServ Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start MauriServ server:', err);
});
