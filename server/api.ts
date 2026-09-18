import { Router, Request, Response } from 'express';
import { db } from './db.js';

export const apiRouter = Router();

// Middleware to extract the simulated session or fall back to the Santa Cruz demo creator.
export function getAuthenticatedUser(req: Request) {
  const userId = req.headers['x-user-id'] as string;
  if (userId) {
    const user = db.getUserById(userId);
    if (user) return user;
  }
  // Default to user_inf_1
  return db.getUserById('user_inf_1')!;
}

// AUTH
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const influencerProfile = user.role === 'influencer' ? db.getInfluencerByUserId(user.id) : null;
  const businessProfile = user.role === 'business' ? db.getBusinessByUserId(user.id) : null;
  res.json({
    user,
    profile: influencerProfile || businessProfile,
    allUsers: db.getUsers(),
  });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado con ese correo.' });
    }
    const profile = user.role === 'influencer' ? db.getInfluencerByUserId(user.id) : db.getBusinessByUserId(user.id);
    res.json({ user, profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { email, role, name } = req.body;
    if (!email || !role || !name) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: email, role o name.' });
    }
    const newUser = db.registerUser({ email, role, name });
    const profile = role === 'influencer' ? db.getInfluencerByUserId(newUser.id) : db.getBusinessByUserId(newUser.id);
    res.json({ user: newUser, profile });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// INFLUENCERS
apiRouter.get('/influencers', (req: Request, res: Response) => {
  const { niche, location, maxRate, search } = req.query;
  const influencers = db.getInfluencers({
    niche: niche ? String(niche) : undefined,
    location: location ? String(location) : undefined,
    maxRate: maxRate ? Number(maxRate) : undefined,
    search: search ? String(search) : undefined,
  });
  res.json(influencers);
});

apiRouter.get('/influencers/:id', (req: Request, res: Response) => {
  const inf = db.getInfluencerById(req.params.id);
  if (!inf) return res.status(404).json({ error: 'Influencer no encontrado' });
  const reviews = db.getRatings(inf.userId);
  res.json({ ...inf, reviews });
});

apiRouter.put('/influencers/profile', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (user.role !== 'influencer') {
      return res.status(403).json({ error: 'Solo influencers pueden editar este perfil.' });
    }
    const updated = db.updateInfluencerProfile(user.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// BUSINESSES
apiRouter.get('/businesses', (req: Request, res: Response) => {
  res.json(db.getBusinesses());
});

apiRouter.get('/businesses/:id', (req: Request, res: Response) => {
  const biz = db.getBusinessById(req.params.id);
  if (!biz) return res.status(404).json({ error: 'Marca no encontrada' });
  const campaigns = db.getCampaigns({ businessId: biz.id });
  const reviews = db.getRatings(biz.userId);
  res.json({ ...biz, campaigns, reviews });
});

apiRouter.put('/businesses/profile', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (user.role !== 'business') {
      return res.status(403).json({ error: 'Solo marcas pueden editar este perfil.' });
    }
    const updated = db.updateBusinessProfile(user.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// CAMPAIGNS
apiRouter.get('/campaigns', (req: Request, res: Response) => {
  const { niche, network, location, status, search, businessId } = req.query;
  const campaigns = db.getCampaigns({
    niche: niche ? String(niche) : undefined,
    network: network ? String(network) : undefined,
    location: location ? String(location) : undefined,
    status: status ? String(status) : undefined,
    search: search ? String(search) : undefined,
    businessId: businessId ? String(businessId) : undefined,
  });
  res.json(campaigns);
});

apiRouter.get('/campaigns/:id', (req: Request, res: Response) => {
  const camp = db.getCampaignById(req.params.id);
  if (!camp) return res.status(404).json({ error: 'Campaña no encontrada' });
  res.json(camp);
});

apiRouter.post('/campaigns', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (user.role !== 'business') {
      return res.status(403).json({ error: 'Solo las marcas pueden publicar campañas.' });
    }
    const biz = db.getBusinessByUserId(user.id);
    if (!biz) return res.status(404).json({ error: 'Perfil de marca no configurado.' });

    const newCampaign = db.createCampaign(biz.id, req.body);
    res.status(201).json(newCampaign);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/campaigns/:id', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    const biz = db.getBusinessByUserId(user.id);
    if (!biz) return res.status(403).json({ error: 'Acceso no autorizado' });
    const updated = db.updateCampaign(biz.id, req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/campaigns/:id/close', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    const biz = db.getBusinessByUserId(user.id);
    if (!biz) return res.status(403).json({ error: 'Acceso no autorizado' });
    const closed = db.closeCampaign(biz.id, req.params.id);
    res.json(closed);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// APPLICATIONS & INVITATIONS
apiRouter.get('/applications', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const apps = db.getApplicationsForUser(user.id, user.role);
  res.json(apps);
});

apiRouter.post('/applications/apply', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (user.role !== 'influencer') {
      return res.status(403).json({ error: 'Solo influencers pueden postularse a campañas.' });
    }
    const inf = db.getInfluencerByUserId(user.id);
    if (!inf) return res.status(404).json({ error: 'Perfil de influencer no configurado.' });

    const { campaignId, pitchMessage, agreedBudget } = req.body;
    const application = db.createApplication({
      campaignId,
      influencerId: inf.id,
      pitchMessage,
      agreedBudget: Number(agreedBudget),
    });
    res.status(201).json(application);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/applications/invite', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (user.role !== 'business') {
      return res.status(403).json({ error: 'Solo marcas pueden enviar invitaciones.' });
    }
    const biz = db.getBusinessByUserId(user.id);
    if (!biz) return res.status(404).json({ error: 'Perfil de marca no configurado.' });

    const { campaignId, influencerId, pitchMessage, agreedBudget } = req.body;
    const invitation = db.createInvitation({
      campaignId,
      influencerId,
      businessId: biz.id,
      pitchMessage,
      agreedBudget: Number(agreedBudget),
    });
    res.status(201).json(invitation);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/applications/:id/status', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    const { status } = req.body;
    if (!['aceptada', 'rechazada', 'en_disputa'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido.' });
    }
    const updated = db.updateApplicationStatus(req.params.id, status, user.id);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// AGREEMENTS & ESCROW
apiRouter.get('/agreements', (req: Request, res: Response) => {
  res.json(db.getAgreements());
});

apiRouter.get('/agreements/:id', (req: Request, res: Response) => {
  const agr = db.getAgreementById(req.params.id);
  if (!agr) return res.status(404).json({ error: 'Acuerdo no encontrado.' });
  const deliverable = db.getDeliverables(agr.id)[0] || null;
  res.json({ ...agr, deliverable });
});

apiRouter.post('/agreements/:id/deposit', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    const updated = db.depositEscrow(req.params.id, user.id);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/agreements/:id/release', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    const updated = db.releaseEscrow(req.params.id, user.id);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/agreements/:id/dispute', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    const { reason } = req.body;
    const updated = db.disputeAgreement(req.params.id, user.id, reason || 'Disputa abierta por el usuario');
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELIVERABLES
apiRouter.get('/deliverables', (req: Request, res: Response) => {
  const { agreementId } = req.query;
  res.json(db.getDeliverables(agreementId ? String(agreementId) : undefined));
});

apiRouter.post('/deliverables', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (user.role !== 'influencer') {
      return res.status(403).json({ error: 'Solo influencers pueden subir entregables.' });
    }
    const inf = db.getInfluencerByUserId(user.id);
    if (!inf) return res.status(404).json({ error: 'Perfil no encontrado.' });

    const { agreementId, title, contentUrl, notes, previewImageUrl } = req.body;
    const deliverable = db.submitDeliverable({
      agreementId,
      influencerId: inf.id,
      title,
      contentUrl,
      previewImageUrl,
      notes,
    });
    res.status(201).json(deliverable);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/deliverables/:id/review', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (user.role !== 'business') {
      return res.status(403).json({ error: 'Solo las marcas pueden evaluar entregables.' });
    }
    const { action, feedback } = req.body;
    const reviewed = db.reviewDeliverable(req.params.id, user.id, action, feedback);
    res.json(reviewed);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// CONVERSATIONS & MESSAGING
apiRouter.get('/conversations', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const convs = db.getConversationsForUser(user.id, user.role);
  res.json(convs);
});

apiRouter.get('/conversations/:id/messages', (req: Request, res: Response) => {
  const messages = db.getMessagesForConversation(req.params.id);
  res.json(messages);
});

apiRouter.post('/conversations/:id/messages', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
    }
    const message = db.sendMessage({
      conversationId: req.params.id,
      senderId: user.id,
      senderRole: user.role,
      text: text.trim(),
    });
    res.status(201).json(message);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// RATINGS & REVIEWS
apiRouter.get('/ratings', (req: Request, res: Response) => {
  const { userId } = req.query;
  res.json(db.getRatings(userId ? String(userId) : undefined));
});

apiRouter.post('/ratings', (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    const { agreementId, campaignId, toUserId, stars, comment, punctualityScore, communicationScore } = req.body;
    const review = db.createRatingReview({
      agreementId,
      campaignId,
      fromUserId: user.id,
      fromUserRole: user.role,
      toUserId,
      stars: Number(stars),
      comment,
      punctualityScore: punctualityScore ? Number(punctualityScore) : undefined,
      communicationScore: communicationScore ? Number(communicationScore) : undefined,
    });
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// NOTIFICATIONS
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  res.json(db.getNotifications(user.id));
});

apiRouter.put('/notifications/:id/read', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const updated = db.markNotificationAsRead(req.params.id, user.id);
  res.json(updated || { ok: true });
});

apiRouter.put('/notifications/read-all', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  db.markAllNotificationsAsRead(user.id);
  res.json({ ok: true });
});

// SEED RESET
apiRouter.post('/seed/reset', (req: Request, res: Response) => {
  db.reset();
  res.json({ ok: true, message: 'Base de datos de demostración reinicializada con éxito.' });
});
