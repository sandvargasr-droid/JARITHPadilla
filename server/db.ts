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
  UserRole,
} from '../src/types.js';

import {
  initialUsers,
  initialInfluencers,
  initialBusinesses,
  initialCampaigns,
  initialApplications,
  initialAgreements,
  initialConversations,
  initialMessages,
  initialDeliverables,
  initialRatings,
  initialNotifications,
} from './mockData.js';

class InMemoryDatabase {
  private users: User[] = [];
  private influencers: InfluencerProfile[] = [];
  private businesses: BusinessProfile[] = [];
  private campaigns: Campaign[] = [];
  private applications: ApplicationOrInvitation[] = [];
  private agreements: AgreementBrief[] = [];
  private conversations: Conversation[] = [];
  private messages: Record<string, ChatMessage[]> = {};
  private deliverables: Deliverable[] = [];
  private ratings: RatingReview[] = [];
  private notifications: AppNotification[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.influencers = JSON.parse(JSON.stringify(initialInfluencers));
    this.businesses = JSON.parse(JSON.stringify(initialBusinesses));
    this.campaigns = JSON.parse(JSON.stringify(initialCampaigns));
    this.applications = JSON.parse(JSON.stringify(initialApplications));
    this.agreements = JSON.parse(JSON.stringify(initialAgreements));
    this.conversations = JSON.parse(JSON.stringify(initialConversations));
    this.messages = JSON.parse(JSON.stringify(initialMessages));
    this.deliverables = JSON.parse(JSON.stringify(initialDeliverables));
    this.ratings = JSON.parse(JSON.stringify(initialRatings));
    this.notifications = JSON.parse(JSON.stringify(initialNotifications));
  }

  // Users & Auth
  public getUsers() {
    return this.users;
  }

  public getUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public registerUser(data: { email: string; role: UserRole; name: string }) {
    const existing = this.getUserByEmail(data.email);
    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      role: data.role,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);

    if (data.role === 'influencer') {
      const newInf: InfluencerProfile = {
        id: `inf_${Date.now()}`,
        userId: newUser.id,
        fullName: data.name,
        handle: `@${data.name.toLowerCase().replace(/\s+/g, '')}`,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        bio: '¡Hola! Soy creador de contenido listo para colaborar en campañas increíbles.',
        age: 23,
        gender: 'femenino',
        rating: 5.0,
        reviewCount: 0,
        niche: 'Moda y Estilo',
        socialFollowers: { tiktok: 50000, instagram: 40000, facebook: 10000 },
        location: 'Madrid',
        coverage: 'ambas',
        rates: { story: 50, reel: 150, post: 100, videoDedicado: 300 },
        portfolio: [],
        verified: false,
      };
      this.influencers.push(newInf);
    } else {
      const newBiz: BusinessProfile = {
        id: `biz_${Date.now()}`,
        userId: newUser.id,
        companyName: data.name,
        logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
        category: 'Emprendimiento',
        description: 'Buscamos creadores apasionados para dar visibilidad a nuestra marca.',
        location: 'Madrid',
        rating: 5.0,
        reviewCount: 0,
        verified: false,
      };
      this.businesses.push(newBiz);
    }

    return newUser;
  }

  // Influencers
  public getInfluencers(filters?: {
    niche?: string;
    location?: string;
    maxRate?: number;
    search?: string;
  }) {
    let result = [...this.influencers];
    if (filters?.niche && filters.niche !== 'Todos') {
      result = result.filter((inf) => inf.niche.toLowerCase().includes(filters.niche!.toLowerCase()));
    }
    if (filters?.location && filters.location !== 'Todas') {
      result = result.filter((inf) => inf.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters?.maxRate && filters.maxRate > 0) {
      result = result.filter((inf) => inf.rates.reel <= filters.maxRate!);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (inf) =>
          inf.fullName.toLowerCase().includes(q) ||
          inf.handle.toLowerCase().includes(q) ||
          inf.bio.toLowerCase().includes(q) ||
          inf.niche.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getInfluencerByUserId(userId: string) {
    return this.influencers.find((i) => i.userId === userId);
  }

  public getInfluencerById(id: string) {
    return this.influencers.find((i) => i.id === id);
  }

  public updateInfluencerProfile(userId: string, data: Partial<InfluencerProfile>) {
    const inf = this.getInfluencerByUserId(userId);
    if (!inf) throw new Error('Perfil de influencer no encontrado.');
    Object.assign(inf, data);
    return inf;
  }

  // Businesses
  public getBusinesses() {
    return this.businesses;
  }

  public getBusinessByUserId(userId: string) {
    return this.businesses.find((b) => b.userId === userId);
  }

  public getBusinessById(id: string) {
    return this.businesses.find((b) => b.id === id);
  }

  public updateBusinessProfile(userId: string, data: Partial<BusinessProfile>) {
    const biz = this.getBusinessByUserId(userId);
    if (!biz) throw new Error('Perfil de marca no encontrado.');
    Object.assign(biz, data);
    return biz;
  }

  // Campaigns
  public getCampaigns(filters?: {
    niche?: string;
    network?: string;
    location?: string;
    status?: string;
    search?: string;
    businessId?: string;
  }) {
    let result = [...this.campaigns];
    if (filters?.businessId) {
      result = result.filter((c) => c.businessId === filters.businessId);
    }
    if (filters?.niche && filters.niche !== 'Todos') {
      result = result.filter((c) => c.niche.toLowerCase().includes(filters.niche!.toLowerCase()));
    }
    if (filters?.network && filters.network !== 'Todas') {
      result = result.filter((c) => c.requiredNetworks.includes(filters.network as any));
    }
    if (filters?.location && filters.location !== 'Todas') {
      result = result.filter((c) => c.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters?.status && filters.status !== 'Todos') {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.businessName.toLowerCase().includes(q) ||
          c.niche.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getCampaignById(id: string) {
    return this.campaigns.find((c) => c.id === id);
  }

  public createCampaign(businessId: string, data: Omit<Campaign, 'id' | 'businessId' | 'businessName' | 'businessLogo' | 'applicantsCount' | 'createdAt'>) {
    const biz = this.getBusinessById(businessId);
    if (!biz) throw new Error('Marca no encontrada para crear campaña.');

    const newCampaign: Campaign = {
      ...data,
      id: `camp_${Date.now()}`,
      businessId: biz.id,
      businessName: biz.companyName,
      businessLogo: biz.logoUrl,
      applicantsCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.campaigns.unshift(newCampaign);
    return newCampaign;
  }

  public updateCampaign(businessId: string, campaignId: string, data: Partial<Campaign>) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) throw new Error('Campaña no encontrada.');
    if (campaign.businessId !== businessId) throw new Error('No tienes permisos para editar esta campaña.');
    Object.assign(campaign, data);
    return campaign;
  }

  public closeCampaign(businessId: string, campaignId: string) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) throw new Error('Campaña no encontrada.');
    if (campaign.businessId !== businessId) throw new Error('No tienes permisos para cerrar esta campaña.');
    campaign.status = 'cerrada';
    return campaign;
  }

  // Applications & Invitations
  public getApplicationsForUser(userId: string, role: UserRole) {
    if (role === 'influencer') {
      const inf = this.getInfluencerByUserId(userId);
      if (!inf) return [];
      return this.applications.filter((a) => a.influencerId === inf.id);
    } else {
      const biz = this.getBusinessByUserId(userId);
      if (!biz) return [];
      return this.applications.filter((a) => a.businessId === biz.id);
    }
  }

  public createApplication(data: {
    campaignId: string;
    influencerId: string;
    pitchMessage: string;
    agreedBudget: number;
  }) {
    const campaign = this.getCampaignById(data.campaignId);
    const influencer = this.getInfluencerById(data.influencerId);
    if (!campaign || !influencer) throw new Error('Campaña o influencer no encontrado.');

    // Check duplicate
    const existing = this.applications.find(
      (a) => a.campaignId === data.campaignId && a.influencerId === data.influencerId
    );
    if (existing) {
      throw new Error('Ya existe una postulación o invitación previa para esta campaña.');
    }

    const newApp: ApplicationOrInvitation = {
      id: `app_${Date.now()}`,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      influencerId: influencer.id,
      influencerName: influencer.fullName,
      influencerAvatar: influencer.avatarUrl,
      businessId: campaign.businessId,
      businessName: campaign.businessName,
      businessLogo: campaign.businessLogo,
      type: 'postulacion',
      initiatedBy: 'influencer',
      status: 'pendiente',
      pitchMessage: data.pitchMessage,
      agreedBudget: data.agreedBudget || campaign.budget,
      createdAt: new Date().toISOString(),
    };

    this.applications.unshift(newApp);
    campaign.applicantsCount += 1;

    // Notification to business user
    const biz = this.getBusinessById(campaign.businessId);
    if (biz) {
      this.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: biz.userId,
        title: 'Nueva postulación recibida',
        message: `${influencer.fullName} se ha postulado a tu campaña "${campaign.title}".`,
        type: 'postulacion',
        read: false,
        createdAt: new Date().toISOString(),
        actionTab: 'applications',
        relatedId: newApp.id,
      });
    }

    return newApp;
  }

  public createInvitation(data: {
    campaignId: string;
    influencerId: string;
    businessId: string;
    pitchMessage: string;
    agreedBudget: number;
  }) {
    const campaign = this.getCampaignById(data.campaignId);
    const influencer = this.getInfluencerById(data.influencerId);
    const business = this.getBusinessById(data.businessId);
    if (!campaign || !influencer || !business) {
      throw new Error('Datos incompletos para enviar invitación.');
    }

    const existing = this.applications.find(
      (a) => a.campaignId === data.campaignId && a.influencerId === data.influencerId
    );
    if (existing) {
      throw new Error('Ya existe una postulación o invitación previa entre estas partes.');
    }

    const newInv: ApplicationOrInvitation = {
      id: `inv_${Date.now()}`,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      influencerId: influencer.id,
      influencerName: influencer.fullName,
      influencerAvatar: influencer.avatarUrl,
      businessId: business.id,
      businessName: business.companyName,
      businessLogo: business.logoUrl,
      type: 'invitacion',
      initiatedBy: 'business',
      status: 'pendiente',
      pitchMessage: data.pitchMessage,
      agreedBudget: data.agreedBudget || campaign.budget,
      createdAt: new Date().toISOString(),
    };

    this.applications.unshift(newInv);

    // Notification to influencer user
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: influencer.userId,
      title: '¡Has recibido una invitación!',
      message: `${business.companyName} te ha invitado a participar en "${campaign.title}".`,
      type: 'invitacion',
      read: false,
      createdAt: new Date().toISOString(),
      actionTab: 'applications',
      relatedId: newInv.id,
    });

    return newInv;
  }

  public updateApplicationStatus(
    appId: string,
    newStatus: 'aceptada' | 'rechazada' | 'en_disputa',
    actionByUserId: string
  ) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) throw new Error('Solicitud no encontrada.');

    app.status = newStatus;

    if (newStatus === 'aceptada') {
      // 1. Generate Agreement/Brief automatically
      const campaign = this.getCampaignById(app.campaignId);
      const influencer = this.getInfluencerById(app.influencerId);
      const business = this.getBusinessById(app.businessId);

      const agreementId = `agr_${Date.now()}`;
      const agreedBudget = app.agreedBudget || (campaign ? campaign.budget : 300);
      const feePercent = 10;
      const influencerPayout = Math.round(agreedBudget * (1 - feePercent / 100));

      const newAgreement: AgreementBrief = {
        id: agreementId,
        applicationId: app.id,
        campaignId: app.campaignId,
        campaignTitle: app.campaignTitle,
        influencerId: app.influencerId,
        influencerName: app.influencerName,
        businessId: app.businessId,
        businessName: app.businessName,
        requestedWork: campaign?.contentType || 'Colaboración en redes sociales según acuerdo',
        agreedBudget,
        platformFeePercent: feePercent,
        influencerPayout,
        deadline: campaign?.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        keyRequirements: [
          'Entregar borrador de contenido antes de publicación final',
          'Cumplir con las especificaciones del brief y etiquetas requeridas',
          'Respetar lineamientos de derechos de imagen y marca',
        ],
        escrowStatus: 'pendiente_deposito',
        createdAt: new Date().toISOString(),
      };

      this.agreements.push(newAgreement);
      app.agreementId = agreementId;

      if (campaign && campaign.status === 'abierta') {
        campaign.status = 'en_negociacion';
      }

      // 2. Open 1-on-1 Conversation
      const convId = `conv_${Date.now()}`;
      const newConversation: Conversation = {
        id: convId,
        agreementId,
        campaignId: app.campaignId,
        campaignTitle: app.campaignTitle,
        influencerId: app.influencerId,
        influencerName: app.influencerName,
        influencerAvatar: app.influencerAvatar,
        businessId: app.businessId,
        businessName: app.businessName,
        businessLogo: app.businessLogo,
        unreadCountInfluencer: 0,
        unreadCountBusiness: 0,
        lastMessageText: 'Acuerdo generado automáticamente tras aceptar la solicitud.',
        lastMessageTimestamp: new Date().toISOString(),
      };

      this.conversations.push(newConversation);
      this.messages[convId] = [
        {
          id: `msg_${Date.now()}`,
          conversationId: convId,
          senderId: 'system',
          senderRole: 'business',
          senderName: 'InfluConnect System',
          senderAvatar: '',
          text: `🤝 ¡Acuerdo generado con éxito para "${app.campaignTitle}"! Presupuesto acordado: $${agreedBudget} USD. La marca debe confirmar el depósito en custodia (escrow) para iniciar la producción.`,
          timestamp: new Date().toISOString(),
        },
      ];

      // Notify both parties
      if (influencer) {
        this.notifications.unshift({
          id: `notif_${Date.now()}_inf`,
          userId: influencer.userId,
          title: 'Acuerdo confirmado',
          message: `Tu solicitud para "${app.campaignTitle}" fue aceptada. El acuerdo y chat están listos.`,
          type: 'acuerdo',
          read: false,
          createdAt: new Date().toISOString(),
          actionTab: 'messages',
          relatedId: convId,
        });
      }
      if (business) {
        this.notifications.unshift({
          id: `notif_${Date.now()}_biz`,
          userId: business.userId,
          title: 'Colaboración aceptada',
          message: `Se ha abierto el canal directo y acuerdo para "${app.campaignTitle}".`,
          type: 'acuerdo',
          read: false,
          createdAt: new Date().toISOString(),
          actionTab: 'messages',
          relatedId: convId,
        });
      }
    }

    return app;
  }

  // Agreements & Escrow
  public getAgreements() {
    return this.agreements;
  }

  public getAgreementById(id: string) {
    return this.agreements.find((a) => a.id === id);
  }

  public depositEscrow(agreementId: string, businessUserId: string) {
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) throw new Error('Acuerdo no encontrado.');

    const business = this.getBusinessByUserId(businessUserId);
    if (!business || business.id !== agreement.businessId) {
      throw new Error('Solo la marca titular puede depositar los fondos en garantía.');
    }

    agreement.escrowStatus = 'fondos_retenidos';
    agreement.depositedAt = new Date().toISOString();

    // Log message in conversation
    const conv = this.conversations.find((c) => c.agreementId === agreementId);
    if (conv) {
      this.messages[conv.id] = this.messages[conv.id] || [];
      this.messages[conv.id].push({
        id: `msg_${Date.now()}`,
        conversationId: conv.id,
        senderId: business.userId,
        senderRole: 'business',
        senderName: business.companyName,
        senderAvatar: business.logoUrl,
        text: `🔒 Fondos de garantía depositados: $${agreement.agreedBudget} USD se encuentran retenidos de forma segura en InfluConnect. ¡El creador puede comenzar a producir el contenido!`,
        timestamp: new Date().toISOString(),
      });
      conv.lastMessageText = `Depósito de garantía completado: $${agreement.agreedBudget} USD.`;
      conv.lastMessageTimestamp = new Date().toISOString();
    }

    // Notify influencer
    const influencer = this.getInfluencerById(agreement.influencerId);
    if (influencer) {
      this.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: influencer.userId,
        title: 'Pago depositado en Escrow',
        message: `${business.companyName} ha depositado $${agreement.agreedBudget} USD en custodia. Puedes comenzar tu entregable con total seguridad.`,
        type: 'pago',
        read: false,
        createdAt: new Date().toISOString(),
        actionTab: 'messages',
        relatedId: conv?.id,
      });
    }

    return agreement;
  }

  public releaseEscrow(agreementId: string, businessUserId: string) {
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) throw new Error('Acuerdo no encontrado.');

    const business = this.getBusinessByUserId(businessUserId);
    if (!business || business.id !== agreement.businessId) {
      throw new Error('Solo la marca titular puede liberar el pago.');
    }

    agreement.escrowStatus = 'liberado';
    agreement.releasedAt = new Date().toISOString();

    // Update deliverable
    const deliv = this.deliverables.find((d) => d.agreementId === agreementId);
    if (deliv) {
      deliv.status = 'aprobado';
    }

    // Log message
    const conv = this.conversations.find((c) => c.agreementId === agreementId);
    if (conv) {
      this.messages[conv.id] = this.messages[conv.id] || [];
      this.messages[conv.id].push({
        id: `msg_${Date.now()}`,
        conversationId: conv.id,
        senderId: 'system',
        senderRole: 'business',
        senderName: 'InfluConnect Escrow',
        senderAvatar: '',
        text: `🎉 ¡Pago liberado con éxito! Se transfirieron $${agreement.influencerPayout} USD al influencer tras aplicar la comisión del 10% ($${agreement.agreedBudget - agreement.influencerPayout} USD). Se ha habilitado la calificación mutua.`,
        timestamp: new Date().toISOString(),
      });
      conv.lastMessageText = 'Pago liberado con éxito al creador.';
      conv.lastMessageTimestamp = new Date().toISOString();
    }

    // Notify influencer
    const influencer = this.getInfluencerById(agreement.influencerId);
    if (influencer) {
      this.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: influencer.userId,
        title: '¡Pago liberado!',
        message: `Se han acreditado $${agreement.influencerPayout} USD en tu saldo por la campaña "${agreement.campaignTitle}". Ya puedes calificar a la marca.`,
        type: 'pago',
        read: false,
        createdAt: new Date().toISOString(),
        actionTab: 'ratings',
        relatedId: agreement.id,
      });
    }

    return agreement;
  }

  public disputeAgreement(agreementId: string, userId: string, reason: string) {
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) throw new Error('Acuerdo no encontrado.');

    agreement.escrowStatus = 'en_disputa';

    const app = this.applications.find((a) => a.agreementId === agreementId);
    if (app) {
      app.status = 'en_disputa';
    }

    const deliv = this.deliverables.find((d) => d.agreementId === agreementId);
    if (deliv) {
      deliv.status = 'en_disputa';
      deliv.reviewFeedback = reason;
    }

    const conv = this.conversations.find((c) => c.agreementId === agreementId);
    if (conv) {
      this.messages[conv.id] = this.messages[conv.id] || [];
      this.messages[conv.id].push({
        id: `msg_${Date.now()}`,
        conversationId: conv.id,
        senderId: 'system',
        senderRole: 'business',
        senderName: 'Soporte InfluConnect',
        senderAvatar: '',
        text: `⚠️ Colaboración puesta EN DISPUTA. Motivo: "${reason}". Los fondos quedan congelados hasta que el equipo de soporte revise el caso.`,
        timestamp: new Date().toISOString(),
      });
      conv.lastMessageText = 'Colaboración en disputa - En revisión de soporte.';
      conv.lastMessageTimestamp = new Date().toISOString();
    }

    return agreement;
  }

  // Deliverables
  public getDeliverables(agreementId?: string) {
    if (agreementId) {
      return this.deliverables.filter((d) => d.agreementId === agreementId);
    }
    return this.deliverables;
  }

  public submitDeliverable(data: {
    agreementId: string;
    influencerId: string;
    title: string;
    contentUrl: string;
    previewImageUrl?: string;
    notes: string;
  }) {
    const agreement = this.getAgreementById(data.agreementId);
    if (!agreement) throw new Error('Acuerdo no encontrado.');

    const newDeliverable: Deliverable = {
      id: `deliv_${Date.now()}`,
      agreementId: agreement.id,
      campaignId: agreement.campaignId,
      influencerId: data.influencerId,
      title: data.title,
      contentUrl: data.contentUrl,
      previewImageUrl: data.previewImageUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80',
      notes: data.notes,
      submittedAt: new Date().toISOString(),
      status: 'en_revision',
    };

    this.deliverables.push(newDeliverable);

    // Add event message to conversation
    const conv = this.conversations.find((c) => c.agreementId === agreement.id);
    if (conv) {
      const influencer = this.getInfluencerById(data.influencerId);
      this.messages[conv.id] = this.messages[conv.id] || [];
      this.messages[conv.id].push({
        id: `msg_${Date.now()}`,
        conversationId: conv.id,
        senderId: influencer?.userId || 'influencer',
        senderRole: 'influencer',
        senderName: influencer?.fullName || 'Influencer',
        senderAvatar: influencer?.avatarUrl || '',
        text: `📤 ¡Entregable enviado para revisión! Título: "${data.title}". Enlace: ${data.contentUrl}`,
        timestamp: new Date().toISOString(),
        isDeliverableEvent: true,
        deliverableId: newDeliverable.id,
      });
      conv.lastMessageText = `Entregable subido: ${data.title}`;
      conv.lastMessageTimestamp = new Date().toISOString();
    }

    // Notify business
    const business = this.getBusinessById(agreement.businessId);
    if (business) {
      this.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: business.userId,
        title: 'Nuevo entregable para revisión',
        message: `Se ha entregado el contenido de "${agreement.campaignTitle}". Revisa y aprueba para liberar el pago.`,
        type: 'mensaje',
        read: false,
        createdAt: new Date().toISOString(),
        actionTab: 'messages',
        relatedId: conv?.id,
      });
    }

    return newDeliverable;
  }

  public reviewDeliverable(
    deliverableId: string,
    businessUserId: string,
    action: 'aprobar' | 'solicitar_cambios' | 'en_disputa',
    feedback?: string
  ) {
    const deliv = this.deliverables.find((d) => d.id === deliverableId);
    if (!deliv) throw new Error('Entregable no encontrado.');

    const agreement = this.getAgreementById(deliv.agreementId);
    if (!agreement) throw new Error('Acuerdo asociado no encontrado.');

    const business = this.getBusinessByUserId(businessUserId);
    if (!business || business.id !== agreement.businessId) {
      throw new Error('Permisos insuficientes para evaluar este entregable.');
    }

    deliv.reviewFeedback = feedback || '';
    deliv.reviewedAt = new Date().toISOString();

    if (action === 'aprobar') {
      deliv.status = 'aprobado';
      // Automatically triggers release of escrow
      this.releaseEscrow(agreement.id, businessUserId);
    } else if (action === 'solicitar_cambios') {
      deliv.status = 'rechazado';
      const conv = this.conversations.find((c) => c.agreementId === agreement.id);
      if (conv) {
        this.messages[conv.id] = this.messages[conv.id] || [];
        this.messages[conv.id].push({
          id: `msg_${Date.now()}`,
          conversationId: conv.id,
          senderId: business.userId,
          senderRole: 'business',
          senderName: business.companyName,
          senderAvatar: business.logoUrl,
          text: `⚠️ Solicitud de cambios en el entregable: "${feedback}". Por favor realiza las correcciones y vuelve a subir el contenido.`,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      deliv.status = 'en_disputa';
      this.disputeAgreement(agreement.id, businessUserId, feedback || 'Desacuerdo en entrega');
    }

    return deliv;
  }

  // Messaging & Conversations
  public getConversationsForUser(userId: string, role: UserRole) {
    if (role === 'influencer') {
      const inf = this.getInfluencerByUserId(userId);
      if (!inf) return [];
      return this.conversations.filter((c) => c.influencerId === inf.id);
    } else {
      const biz = this.getBusinessByUserId(userId);
      if (!biz) return [];
      return this.conversations.filter((c) => c.businessId === biz.id);
    }
  }

  public getConversationById(id: string) {
    return this.conversations.find((c) => c.id === id);
  }

  public getMessagesForConversation(convId: string) {
    return this.messages[convId] || [];
  }

  public sendMessage(data: {
    conversationId: string;
    senderId: string;
    senderRole: UserRole;
    text: string;
  }) {
    const conv = this.getConversationById(data.conversationId);
    if (!conv) throw new Error('Conversación no encontrada.');

    let senderName = '';
    let senderAvatar = '';
    let recipientUserId = '';

    if (data.senderRole === 'influencer') {
      const inf = this.getInfluencerByUserId(data.senderId);
      senderName = inf?.fullName || 'Influencer';
      senderAvatar = inf?.avatarUrl || '';
      const biz = this.getBusinessById(conv.businessId);
      recipientUserId = biz?.userId || '';
      conv.unreadCountBusiness += 1;
    } else {
      const biz = this.getBusinessByUserId(data.senderId);
      senderName = biz?.companyName || 'Marca';
      senderAvatar = biz?.logoUrl || '';
      const inf = this.getInfluencerById(conv.influencerId);
      recipientUserId = inf?.userId || '';
      conv.unreadCountInfluencer += 1;
    }

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: conv.id,
      senderId: data.senderId,
      senderRole: data.senderRole,
      senderName,
      senderAvatar,
      text: data.text,
      timestamp: new Date().toISOString(),
    };

    this.messages[conv.id] = this.messages[conv.id] || [];
    this.messages[conv.id].push(newMsg);

    conv.lastMessageText = data.text;
    conv.lastMessageTimestamp = newMsg.timestamp;

    // Send notification to recipient
    if (recipientUserId) {
      this.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: recipientUserId,
        title: `Nuevo mensaje de ${senderName}`,
        message: data.text.length > 60 ? `${data.text.substring(0, 60)}...` : data.text,
        type: 'mensaje',
        read: false,
        createdAt: new Date().toISOString(),
        actionTab: 'messages',
        relatedId: conv.id,
      });
    }

    return newMsg;
  }

  // Ratings & Reviews
  public getRatings(userId?: string) {
    if (userId) {
      return this.ratings.filter((r) => r.toUserId === userId);
    }
    return this.ratings;
  }

  public createRatingReview(data: {
    agreementId: string;
    campaignId: string;
    fromUserId: string;
    fromUserRole: UserRole;
    toUserId: string;
    stars: number;
    comment: string;
    punctualityScore?: number;
    communicationScore?: number;
  }) {
    const agreement = this.getAgreementById(data.agreementId);
    if (!agreement) throw new Error('Acuerdo no encontrado para calificar.');

    // Check duplicate rating
    const existing = this.ratings.find(
      (r) => r.agreementId === data.agreementId && r.fromUserId === data.fromUserId
    );
    if (existing) {
      throw new Error('Ya has calificado esta colaboración.');
    }

    let fromUserName = '';
    if (data.fromUserRole === 'influencer') {
      const inf = this.getInfluencerByUserId(data.fromUserId);
      fromUserName = inf?.fullName || 'Influencer';
    } else {
      const biz = this.getBusinessByUserId(data.fromUserId);
      fromUserName = biz?.companyName || 'Marca';
    }

    const newReview: RatingReview = {
      id: `rev_${Date.now()}`,
      campaignId: data.campaignId,
      campaignTitle: agreement.campaignTitle,
      agreementId: data.agreementId,
      fromUserId: data.fromUserId,
      fromUserName,
      fromUserRole: data.fromUserRole,
      toUserId: data.toUserId,
      stars: data.stars,
      comment: data.comment,
      punctualityScore: data.punctualityScore || data.stars,
      communicationScore: data.communicationScore || data.stars,
      createdAt: new Date().toISOString(),
    };

    this.ratings.unshift(newReview);

    // Recalculate average rating on profile
    const allForTarget = this.ratings.filter((r) => r.toUserId === data.toUserId);
    const avg = allForTarget.reduce((acc, curr) => acc + curr.stars, 0) / allForTarget.length;
    const roundedAvg = Math.round(avg * 10) / 10;

    const targetInf = this.influencers.find((i) => i.userId === data.toUserId);
    if (targetInf) {
      targetInf.rating = roundedAvg;
      targetInf.reviewCount = allForTarget.length;
    }

    const targetBiz = this.businesses.find((b) => b.userId === data.toUserId);
    if (targetBiz) {
      targetBiz.rating = roundedAvg;
      targetBiz.reviewCount = allForTarget.length;
    }

    // Send notification
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: data.toUserId,
      title: `¡Nueva calificación recibida (${data.stars} ⭐)!`,
      message: `${fromUserName} ha dejado una reseña: "${data.comment}"`,
      type: 'calificacion',
      read: false,
      createdAt: new Date().toISOString(),
      actionTab: 'ratings',
      relatedId: newReview.id,
    });

    return newReview;
  }

  // Notifications
  public getNotifications(userId: string) {
    return this.notifications.filter((n) => n.userId === userId);
  }

  public markNotificationAsRead(id: string, userId: string) {
    const notif = this.notifications.find((n) => n.id === id && n.userId === userId);
    if (notif) {
      notif.read = true;
    }
    return notif;
  }

  public markAllNotificationsAsRead(userId: string) {
    this.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    return true;
  }
}

export const db = new InMemoryDatabase();
