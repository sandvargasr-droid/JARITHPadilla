import {
  User,
  InfluencerProfile,
  BusinessProfile,
  Campaign,
  ApplicationOrInvitation,
  AgreementBrief,
  Conversation,
  ChatMessage,
  Deliverable,
  RatingReview,
  AppNotification,
} from '../types.js';

let currentUserId = 'user_inf_1';

export function setCurrentUserId(userId: string) {
  currentUserId = userId;
  localStorage.setItem('influconnect_user_id', userId);
}

export function getCurrentUserId(): string {
  const saved = localStorage.getItem('influconnect_user_id');
  if (saved) {
    currentUserId = saved;
  }
  return currentUserId;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('x-user-id', getCurrentUserId());

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Error en la petición: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  setCurrentUserId,
  getCurrentUserId,

  // Auth & Session
  async getMe() {
    return request<{
      user: User;
      profile: InfluencerProfile | BusinessProfile | null;
      allUsers: User[];
    }>('/api/auth/me');
  },

  async getCurrentUser() {
    return this.getMe();
  },

  async getAllUsers() {
    const res = await this.getMe();
    return { users: res.allUsers };
  },

  async getInfluencerProfiles() {
    const influencers = await this.getInfluencers();
    return { influencers };
  },

  async getAgreements() {
    const agreements = await request<AgreementBrief[]>('/api/agreements');
    return { agreements };
  },

  async respondApplication(id: string, action: 'accept' | 'reject') {
    return this.updateApplicationStatus(id, action === 'accept' ? 'aceptada' : 'rechazada');
  },

  async createRating(data: any) {
    return this.submitRating(data);
  },

  async resetDemo() {
    return this.resetDemoData();
  },

  async markNotificationRead(id: string) {
    return this.markNotificationAsRead(id);
  },

  async markAllNotificationsRead() {
    return this.markAllNotificationsAsRead();
  },

  async login(email: string) {
    return request<{ user: User; profile: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async register(data: { email: string; role: 'influencer' | 'business'; name: string }) {
    return request<{ user: User; profile: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Influencers
  async getInfluencers(params?: { niche?: string; location?: string; maxRate?: number; search?: string }) {
    const query = new URLSearchParams();
    if (params?.niche) query.set('niche', params.niche);
    if (params?.location) query.set('location', params.location);
    if (params?.maxRate) query.set('maxRate', String(params.maxRate));
    if (params?.search) query.set('search', params.search);
    return request<InfluencerProfile[]>(`/api/influencers?${query.toString()}`);
  },

  async getInfluencerById(id: string) {
    return request<InfluencerProfile & { reviews: RatingReview[] }>(`/api/influencers/${id}`);
  },

  async updateInfluencerProfile(data: Partial<InfluencerProfile>) {
    return request<InfluencerProfile>('/api/influencers/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Businesses
  async getBusinesses() {
    return request<BusinessProfile[]>('/api/businesses');
  },

  async getBusinessById(id: string) {
    return request<BusinessProfile & { campaigns: Campaign[]; reviews: RatingReview[] }>(`/api/businesses/${id}`);
  },

  async updateBusinessProfile(data: Partial<BusinessProfile>) {
    return request<BusinessProfile>('/api/businesses/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Campaigns
  async getCampaigns(params?: {
    niche?: string;
    network?: string;
    location?: string;
    status?: string;
    search?: string;
    businessId?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.niche) query.set('niche', params.niche);
    if (params?.network) query.set('network', params.network);
    if (params?.location) query.set('location', params.location);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.businessId) query.set('businessId', params.businessId);
    return request<Campaign[]>(`/api/campaigns?${query.toString()}`);
  },

  async getCampaignById(id: string) {
    return request<Campaign>(`/api/campaigns/${id}`);
  },

  async createCampaign(data: Partial<Campaign>) {
    return request<Campaign>('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCampaign(id: string, data: Partial<Campaign>) {
    return request<Campaign>(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async closeCampaign(id: string) {
    return request<Campaign>(`/api/campaigns/${id}/close`, {
      method: 'POST',
    });
  },

  // Applications & Invitations
  async getApplications() {
    return request<ApplicationOrInvitation[]>('/api/applications');
  },

  async applyToCampaign(data: { campaignId: string; pitchMessage: string; agreedBudget: number }) {
    return request<ApplicationOrInvitation>('/api/applications/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async inviteInfluencer(data: {
    campaignId: string;
    influencerId: string;
    pitchMessage: string;
    agreedBudget: number;
  }) {
    return request<ApplicationOrInvitation>('/api/applications/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateApplicationStatus(id: string, status: 'aceptada' | 'rechazada' | 'en_disputa') {
    return request<ApplicationOrInvitation>(`/api/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Agreements & Escrow
  async getAgreementById(id: string) {
    return request<AgreementBrief & { deliverable?: Deliverable }>(`/api/agreements/${id}`);
  },

  async depositEscrow(agreementId: string) {
    return request<AgreementBrief>(`/api/agreements/${agreementId}/deposit`, {
      method: 'POST',
    });
  },

  async releaseEscrow(agreementId: string) {
    return request<AgreementBrief>(`/api/agreements/${agreementId}/release`, {
      method: 'POST',
    });
  },

  async disputeAgreement(agreementId: string, reason: string) {
    return request<AgreementBrief>(`/api/agreements/${agreementId}/dispute`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Deliverables
  async getDeliverables(agreementId?: string) {
    const q = agreementId ? `?agreementId=${agreementId}` : '';
    return request<Deliverable[]>(`/api/deliverables${q}`);
  },

  async submitDeliverable(data: {
    agreementId: string;
    title: string;
    contentUrl: string;
    notes: string;
    previewImageUrl?: string;
  }) {
    return request<Deliverable>('/api/deliverables', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async reviewDeliverable(
    id: string,
    action: 'aprobar' | 'solicitar_cambios' | 'en_disputa',
    feedback?: string
  ) {
    return request<Deliverable>(`/api/deliverables/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ action, feedback }),
    });
  },

  // Conversations
  async getConversations() {
    return request<Conversation[]>('/api/conversations');
  },

  async getMessages(conversationId: string) {
    return request<ChatMessage[]>(`/api/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, text: string) {
    return request<ChatMessage>(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // Ratings
  async getRatings(userId?: string) {
    const q = userId ? `?userId=${userId}` : '';
    return request<RatingReview[]>(`/api/ratings${q}`);
  },

  async submitRating(data: {
    agreementId: string;
    campaignId: string;
    toUserId: string;
    stars: number;
    comment: string;
    punctualityScore?: number;
    communicationScore?: number;
  }) {
    return request<RatingReview>('/api/ratings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Notifications
  async getNotifications() {
    return request<AppNotification[]>('/api/notifications');
  },

  async markNotificationAsRead(id: string) {
    return request<AppNotification>(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async markAllNotificationsAsRead() {
    return request<{ ok: boolean }>('/api/notifications/read-all', {
      method: 'PUT',
    });
  },

  // Reset demo
  async resetDemoData() {
    return request<{ ok: boolean; message: string }>('/api/seed/reset', {
      method: 'POST',
    });
  },
};
