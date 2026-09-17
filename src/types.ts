export type UserRole = 'influencer' | 'business';

export type CoverageType = 'presencial' | 'remota' | 'ambas';

export type ApplicationStatus = 'pendiente' | 'aceptada' | 'rechazada' | 'en_disputa';

export type CampaignStatus = 'abierta' | 'en_negociacion' | 'cerrada';

export type EscrowStatus = 'pendiente' | 'pendiente_deposito' | 'fondos_retenidos' | 'retenido' | 'liberado' | 'en_disputa';

export type DeliverableStatus = 'pendiente' | 'pendiente_entrega' | 'en_revision' | 'aprobado' | 'rechazado' | 'ajustes_solicitados' | 'en_disputa';

export interface SocialFollowers {
  tiktok: number;
  instagram: number;
  facebook: number;
  youtube?: number;
}

export interface ContentRates {
  story: number;
  reel: number;
  post: number;
  videoDedicado: number;
}

export interface VideoPortfolioItem {
  id: string;
  title: string;
  videoUrl?: string;
  thumbnailUrl: string;
  likes: number;
  views: number;
  platform: 'tiktok' | 'instagram' | 'youtube';
  isFeatured: boolean;
}

export interface InfluencerProfile {
  id: string;
  userId: string;
  fullName: string;
  handle: string;
  avatarUrl: string;
  bio: string;
  age: number;
  gender: 'femenino' | 'masculino' | 'no_binario' | 'otro';
  rating: number;
  reviewCount: number;
  niche: string;
  socialFollowers: SocialFollowers;
  location: string;
  coverage: CoverageType;
  rates: ContentRates;
  portfolio: VideoPortfolioItem[];
  verified: boolean;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  companyName: string;
  logoUrl: string;
  category: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  website?: string;
  verified: boolean;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  title: string;
  description: string;
  niche: string;
  budget: number;
  requiredNetworks: ('TikTok' | 'Instagram' | 'Facebook' | 'YouTube')[];
  contentType: string; // ej: "Reel + 2 Stories", "Video dedicado", "Reseña gastronómica"
  minFollowers: number;
  location: string;
  coverage: CoverageType;
  deadline: string; // ej: "2026-10-15"
  influencersNeeded: number;
  applicantsCount: number;
  status: CampaignStatus;
  createdAt: string;
}

export interface ApplicationOrInvitation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  influencerId: string;
  influencerName: string;
  influencerAvatar: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  type: 'postulacion' | 'invitacion';
  initiatedBy: 'influencer' | 'business';
  status: ApplicationStatus;
  pitchMessage: string;
  agreedBudget: number;
  createdAt: string;
  agreementId?: string;
}

export interface AgreementBrief {
  id: string;
  applicationId: string;
  campaignId: string;
  campaignTitle: string;
  influencerId: string;
  influencerName: string;
  businessId: string;
  businessName: string;
  requestedWork: string;
  deliverableRequirement?: string;
  agreedBudget: number;
  agreedPrice?: number;
  platformFeePercent: number; // 10%
  influencerPayout: number;
  deadline: string;
  keyRequirements: string[];
  escrowStatus: EscrowStatus;
  status?: 'activo' | 'en_revision' | 'revision' | 'completado' | 'en_disputa' | 'cancelado';
  createdAt: string;
  depositedAt?: string;
  releasedAt?: string;
}

export type Agreement = AgreementBrief;

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  senderAvatar: string;
  text: string;
  content?: string;
  timestamp: string;
  createdAt?: string;
  isDeliverableEvent?: boolean;
  deliverableId?: string;
}

export type Message = ChatMessage;

export interface Conversation {
  id: string;
  agreementId: string;
  campaignId: string;
  campaignTitle: string;
  influencerId: string;
  influencerName: string;
  influencerAvatar: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  unreadCountInfluencer: number;
  unreadCountBusiness: number;
  lastMessageText: string;
  lastMessageTimestamp: string;
  lastMessageAt?: string;
}


export interface Deliverable {
  id: string;
  agreementId: string;
  campaignId: string;
  influencerId: string;
  title: string;
  contentUrl: string;
  fileUrl?: string;
  postUrl?: string;
  previewImageUrl?: string;
  notes: string;
  submittedAt: string;
  status: DeliverableStatus;
  reviewFeedback?: string;
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface RatingReview {
  id: string;
  campaignId: string;
  campaignTitle: string;
  agreementId: string;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  targetUserId?: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: UserRole;
  toUserId: string;
  stars: number;
  comment: string;
  categories?: {
    communication: number;
    punctuality: number;
    qualityOrClarity: number;
  };
  punctualityScore?: number;
  communicationScore?: number;
  createdAt: string;
}

export type Rating = RatingReview;

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'postulacion' | 'invitacion' | 'acuerdo' | 'mensaje' | 'pago' | 'calificacion' | 'disputa';
  read: boolean;
  createdAt: string;
  actionTab?: string;
  linkTab?: string;
  relatedId?: string;
}

