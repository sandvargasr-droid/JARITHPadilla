import { InMemoryDatabase } from '../../server/db.js';
import {
  ApplicationOrInvitation,
  BusinessProfile,
  Campaign,
  InfluencerProfile,
} from '../types.js';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): unknown;
}

interface RatingInput {
  agreementId: string;
  campaignId: string;
  toUserId: string;
  stars: number;
  comment: string;
  punctualityScore?: number;
  communicationScore?: number;
}

const USER_STORAGE_KEY = 'influconnect_user_id';
const DEFAULT_USER_ID = 'user_inf_1';

function browserStorage(): StorageLike | null {
  return typeof globalThis.localStorage === 'undefined' ? null : globalThis.localStorage;
}

export function createStaticApi(
  storage: StorageLike | null = browserStorage(),
  database = new InMemoryDatabase(),
) {
  const savedUserId = storage?.getItem(USER_STORAGE_KEY);
  let currentUserId = savedUserId && database.getUserById(savedUserId)
    ? savedUserId
    : DEFAULT_USER_ID;

  if (savedUserId && savedUserId !== currentUserId) {
    storage?.setItem(USER_STORAGE_KEY, currentUserId);
  }

  const getUser = () => {
    const user = database.getUserById(currentUserId);
    if (!user) throw new Error('Usuario de demostración no encontrado.');
    return user;
  };

  const getBusiness = () => {
    const business = database.getBusinessByUserId(getUser().id);
    if (!business) throw new Error('Perfil de marca no configurado.');
    return business;
  };

  const getInfluencer = () => {
    const influencer = database.getInfluencerByUserId(getUser().id);
    if (!influencer) throw new Error('Perfil de influencer no configurado.');
    return influencer;
  };

  const api = {
    setCurrentUserId(userId: string) {
      if (!database.getUserById(userId)) throw new Error('Usuario no encontrado.');
      currentUserId = userId;
      storage?.setItem(USER_STORAGE_KEY, userId);
    },

    getCurrentUserId() {
      return currentUserId;
    },

    async getMe() {
      const user = getUser();
      const profile = user.role === 'influencer'
        ? database.getInfluencerByUserId(user.id)
        : database.getBusinessByUserId(user.id);
      return { user, profile: profile || null, allUsers: database.getUsers() };
    },

    async getCurrentUser() {
      return api.getMe();
    },

    async getAllUsers() {
      return { users: database.getUsers() };
    },

    async getInfluencerProfiles() {
      return { influencers: database.getInfluencers() };
    },

    async getAgreements() {
      return { agreements: database.getAgreements() };
    },

    async respondApplication(id: string, action: 'accept' | 'reject') {
      return api.updateApplicationStatus(id, action === 'accept' ? 'aceptada' : 'rechazada');
    },

    async createRating(data: RatingInput) {
      return api.submitRating(data);
    },

    async resetDemo() {
      return api.resetDemoData();
    },

    async markNotificationRead(id: string) {
      return api.markNotificationAsRead(id);
    },

    async markAllNotificationsRead() {
      return api.markAllNotificationsAsRead();
    },

    async login(email: string) {
      const user = database.getUserByEmail(email);
      if (!user) throw new Error('Usuario no encontrado con ese correo.');
      api.setCurrentUserId(user.id);
      const profile = user.role === 'influencer'
        ? database.getInfluencerByUserId(user.id)
        : database.getBusinessByUserId(user.id);
      return { user, profile };
    },

    async register(data: { email: string; role: 'influencer' | 'business'; name: string }) {
      const user = database.registerUser(data);
      api.setCurrentUserId(user.id);
      const profile = user.role === 'influencer'
        ? database.getInfluencerByUserId(user.id)
        : database.getBusinessByUserId(user.id);
      return { user, profile };
    },

    async getInfluencers(params?: { niche?: string; location?: string; maxRate?: number; search?: string }) {
      return database.getInfluencers(params);
    },

    async getInfluencerById(id: string) {
      const influencer = database.getInfluencerById(id);
      if (!influencer) throw new Error('Influencer no encontrado.');
      return { ...influencer, reviews: database.getRatings(influencer.userId) };
    },

    async updateInfluencerProfile(data: Partial<InfluencerProfile>) {
      return database.updateInfluencerProfile(getInfluencer().userId, data);
    },

    async getBusinesses() {
      return database.getBusinesses();
    },

    async getBusinessById(id: string) {
      const business = database.getBusinessById(id);
      if (!business) throw new Error('Marca no encontrada.');
      return {
        ...business,
        campaigns: database.getCampaigns({ businessId: business.id }),
        reviews: database.getRatings(business.userId),
      };
    },

    async updateBusinessProfile(data: Partial<BusinessProfile>) {
      return database.updateBusinessProfile(getBusiness().userId, data);
    },

    async getCampaigns(params?: {
      niche?: string;
      network?: string;
      location?: string;
      status?: string;
      search?: string;
      businessId?: string;
    }) {
      return database.getCampaigns(params);
    },

    async getCampaignById(id: string) {
      const campaign = database.getCampaignById(id);
      if (!campaign) throw new Error('Campaña no encontrada.');
      return campaign;
    },

    async createCampaign(data: Partial<Campaign>) {
      return database.createCampaign(getBusiness().id, data as Parameters<InMemoryDatabase['createCampaign']>[1]);
    },

    async updateCampaign(id: string, data: Partial<Campaign>) {
      return database.updateCampaign(getBusiness().id, id, data);
    },

    async closeCampaign(id: string) {
      return database.closeCampaign(getBusiness().id, id);
    },

    async getApplications() {
      const user = getUser();
      return database.getApplicationsForUser(user.id, user.role);
    },

    async applyToCampaign(data: { campaignId: string; pitchMessage: string; agreedBudget: number }) {
      return database.createApplication({ ...data, influencerId: getInfluencer().id });
    },

    async inviteInfluencer(data: {
      campaignId: string;
      influencerId: string;
      pitchMessage: string;
      agreedBudget: number;
    }) {
      return database.createInvitation({ ...data, businessId: getBusiness().id });
    },

    async updateApplicationStatus(
      id: string,
      status: ApplicationOrInvitation['status'] & ('aceptada' | 'rechazada' | 'en_disputa'),
    ) {
      return database.updateApplicationStatus(id, status, getUser().id);
    },

    async getAgreementById(id: string) {
      const agreement = database.getAgreementById(id);
      if (!agreement) throw new Error('Acuerdo no encontrado.');
      return { ...agreement, deliverable: database.getDeliverables(id)[0] };
    },

    async depositEscrow(agreementId: string) {
      return database.depositEscrow(agreementId, getUser().id);
    },

    async releaseEscrow(agreementId: string) {
      return database.releaseEscrow(agreementId, getUser().id);
    },

    async disputeAgreement(agreementId: string, reason: string) {
      return database.disputeAgreement(agreementId, getUser().id, reason);
    },

    async getDeliverables(agreementId?: string) {
      return database.getDeliverables(agreementId);
    },

    async submitDeliverable(data: {
      agreementId: string;
      title: string;
      contentUrl: string;
      notes: string;
      previewImageUrl?: string;
    }) {
      return database.submitDeliverable({ ...data, influencerId: getInfluencer().id });
    },

    async reviewDeliverable(
      id: string,
      action: 'aprobar' | 'solicitar_cambios' | 'en_disputa',
      feedback?: string,
    ) {
      return database.reviewDeliverable(id, getUser().id, action, feedback);
    },

    async getConversations() {
      const user = getUser();
      return database.getConversationsForUser(user.id, user.role);
    },

    async getMessages(conversationId: string) {
      return database.getMessagesForConversation(conversationId);
    },

    async sendMessage(conversationId: string, text: string) {
      if (!text.trim()) throw new Error('El mensaje no puede estar vacío.');
      const user = getUser();
      return database.sendMessage({ conversationId, senderId: user.id, senderRole: user.role, text: text.trim() });
    },

    async getRatings(userId?: string) {
      return database.getRatings(userId);
    },

    async submitRating(data: RatingInput) {
      const user = getUser();
      return database.createRatingReview({ ...data, fromUserId: user.id, fromUserRole: user.role });
    },

    async getNotifications() {
      return database.getNotifications(getUser().id);
    },

    async markNotificationAsRead(id: string) {
      const notification = database.markNotificationAsRead(id, getUser().id);
      if (!notification) throw new Error('Notificación no encontrada.');
      return notification;
    },

    async markAllNotificationsAsRead() {
      database.markAllNotificationsAsRead(getUser().id);
      return { ok: true };
    },

    async resetDemoData() {
      database.reset();
      currentUserId = DEFAULT_USER_ID;
      storage?.setItem(USER_STORAGE_KEY, currentUserId);
      return { ok: true, message: 'Base de datos de demostración reinicializada con éxito.' };
    },
  };

  return api;
}

export const staticApi = createStaticApi();
