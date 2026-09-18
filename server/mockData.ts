import {
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
  User,
} from '../src/types.js';

const DATA_UPDATED_AT = '2026-09-18';
const ZERO_RATES = { story: 0, reel: 0, post: 0, videoDedicado: 0 };

function initialsAvatar(label: string, background = '6d28d9'): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${background}&color=fff&bold=true&size=256`;
}

function publicCreator(data: {
  id: string;
  fullName: string;
  handle: string;
  bio: string;
  niche: string;
  sourceUrl: string;
  followers?: Partial<InfluencerProfile['socialFollowers']>;
}): InfluencerProfile {
  return {
    id: data.id,
    userId: `reference_user_${data.id}`,
    fullName: data.fullName,
    handle: data.handle,
    avatarUrl: initialsAvatar(data.fullName),
    bio: data.bio,
    rating: 0,
    reviewCount: 0,
    niche: data.niche,
    socialFollowers: {
      tiktok: data.followers?.tiktok ?? 0,
      instagram: data.followers?.instagram ?? 0,
      facebook: data.followers?.facebook ?? 0,
      youtube: data.followers?.youtube ?? 0,
    },
    location: 'Santa Cruz de la Sierra, Bolivia',
    coverage: 'ambas',
    rates: { ...ZERO_RATES },
    portfolio: [],
    verified: true,
    isReferenceProfile: true,
    sourceUrl: data.sourceUrl,
    dataUpdatedAt: DATA_UPDATED_AT,
  };
}

function publicBusiness(data: {
  id: string;
  companyName: string;
  category: string;
  description: string;
  website: string;
}): BusinessProfile {
  return {
    id: data.id,
    userId: `reference_user_${data.id}`,
    companyName: data.companyName,
    logoUrl: initialsAvatar(data.companyName, 'be123c'),
    category: data.category,
    description: data.description,
    location: 'Santa Cruz de la Sierra, Bolivia',
    rating: 0,
    reviewCount: 0,
    website: data.website,
    verified: true,
    isReferenceProfile: true,
    sourceUrl: data.website,
    dataUpdatedAt: DATA_UPDATED_AT,
  };
}

export const initialUsers: User[] = [
  {
    id: 'user_inf_1',
    email: 'creador.scz@influconnect.demo',
    role: 'influencer',
    name: 'Creador Demo Santa Cruz',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'user_biz_1',
    email: 'empresa.scz@influconnect.demo',
    role: 'business',
    name: 'Empresa Demo Santa Cruz',
    createdAt: '2026-09-01T10:05:00Z',
  },
];

export const initialInfluencers: InfluencerProfile[] = [
  {
    id: 'inf_1',
    userId: 'user_inf_1',
    fullName: 'Creador Demo Santa Cruz',
    handle: '@creador.demo.scz',
    avatarUrl: initialsAvatar('Creador Demo Santa Cruz', '0f766e'),
    bio: 'Cuenta ficticia para probar postulaciones, acuerdos, mensajería y pagos sin representar a una persona real.',
    age: 25,
    gender: 'otro',
    rating: 4.9,
    reviewCount: 8,
    niche: 'Lifestyle y Gastronomía',
    socialFollowers: { tiktok: 35_000, instagram: 18_000, facebook: 4_000, youtube: 2_500 },
    location: 'Santa Cruz de la Sierra, Bolivia',
    coverage: 'ambas',
    rates: { story: 45, reel: 140, post: 90, videoDedicado: 260 },
    portfolio: [
      {
        id: 'vid_demo_1',
        title: 'Contenido demostrativo de gastronomía cruceña',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
        likes: 2_450,
        views: 21_800,
        platform: 'tiktok',
        isFeatured: true,
      },
    ],
    verified: false,
  },
  publicCreator({
    id: 'inf_ref_carlitos',
    fullName: 'Carlitos Chávez',
    handle: '@carlitoselfoodie',
    bio: 'Creador gastronómico que descubre y reseña restaurantes y sabores de Santa Cruz.',
    niche: 'Gastronomía y Restaurantes',
    sourceUrl: 'https://www.tiktok.com/@carlitoselfoodie',
    followers: { tiktok: 68_800, instagram: 1_100 },
  }),
  publicCreator({
    id: 'inf_ref_flavio',
    fullName: 'Flavio | Foodie real',
    handle: '@flaviopaniaguac',
    bio: 'Creador de reseñas gastronómicas honestas sobre restaurantes, comida callejera y huecas cruceñas.',
    niche: 'Gastronomía y Restaurantes',
    sourceUrl: 'https://www.tiktok.com/@flaviopaniaguac',
    followers: { tiktok: 37_000 },
  }),
  publicCreator({
    id: 'inf_ref_lasabrosa',
    fullName: 'Nicole Pinto | La Sabrosa',
    handle: '@lasabrosabo',
    bio: 'Comunicadora y creadora cruceña enfocada en recetas, experiencias y turismo gastronómico boliviano.',
    niche: 'Gastronomía y Turismo',
    sourceUrl: 'https://www.tiktok.com/@lasabrosabo',
    followers: { tiktok: 806_700, instagram: 250_000 },
  }),
  publicCreator({
    id: 'inf_ref_anabel',
    fullName: 'Anabel Angus',
    handle: '@anabelangus',
    bio: 'Presentadora de televisión y creadora de contenido nacida en Santa Cruz de la Sierra.',
    niche: 'Entretenimiento y Lifestyle',
    sourceUrl: 'https://www.instagram.com/anabelangus/',
  }),
  publicCreator({
    id: 'inf_ref_mariana',
    fullName: 'Mariana Massiel',
    handle: '@marianamassielp',
    bio: 'Cantautora boliviana con una comunidad destacada en Santa Cruz de la Sierra.',
    niche: 'Música y Entretenimiento',
    sourceUrl: 'https://www.instagram.com/marianamassielp/',
    followers: { instagram: 24_600 },
  }),
  publicCreator({
    id: 'inf_ref_laura',
    fullName: 'Laura Ortiz',
    handle: '@imlauraortiz',
    bio: 'Profesional de salud y creadora de contenido de belleza, habilidades profesionales y vida cotidiana en Santa Cruz.',
    niche: 'Belleza y Lifestyle',
    sourceUrl: 'https://www.instagram.com/imlauraortiz/',
    followers: { instagram: 9_400 },
  }),
  publicCreator({
    id: 'inf_ref_daniel',
    fullName: 'Daniel Coimbra',
    handle: '@_danielcoimbra_',
    bio: 'Cineasta y narrador visual especializado en naturaleza, aventura, selvas y vida silvestre.',
    niche: 'Naturaleza y Producción Audiovisual',
    sourceUrl: 'https://www.instagram.com/_danielcoimbra_/',
    followers: { instagram: 8_700 },
  }),
  publicCreator({
    id: 'inf_ref_humberto',
    fullName: 'Humberto Beltrán Monasterio',
    handle: '@humberbeltran',
    bio: 'Arquitecto cruceño que comparte arquitectura, viajes y vida con mascotas.',
    niche: 'Arquitectura y Viajes',
    sourceUrl: 'https://www.instagram.com/humberbeltran/',
    followers: { instagram: 4_400 },
  }),
  publicCreator({
    id: 'inf_ref_renato',
    fullName: 'Renato Trujillo',
    handle: '@renitg_10',
    bio: 'Arquitecto y diseñador radicado en Santa Cruz, con contenido de diseño, espacios y fotografía.',
    niche: 'Arquitectura y Diseño',
    sourceUrl: 'https://www.instagram.com/renitg_10/',
    followers: { instagram: 3_800 },
  }),
  publicCreator({
    id: 'inf_ref_ale',
    fullName: 'Alejandra Áñez | Gendarme Chitoka',
    handle: '@ale.anez',
    bio: 'Humorista y artista cruceña conocida por stand-up, contenido de humor y el personaje Gendarme Chitoka.',
    niche: 'Humor y Entretenimiento',
    sourceUrl: 'https://www.instagram.com/ale.anez/',
    followers: { instagram: 27_510 },
  }),
  publicCreator({
    id: 'inf_ref_yadira',
    fullName: 'Yadira Pacheco Escalera',
    handle: '@yadirapach',
    bio: 'Creadora local enfocada en gastronomía, humor, emprendimiento y promoción de negocios cruceños.',
    niche: 'Gastronomía y Emprendimiento',
    sourceUrl: 'https://www.instagram.com/yadirapach/',
  }),
  publicCreator({
    id: 'inf_ref_foodish',
    fullName: 'Foodish Bolivia',
    handle: '@foodish.bo',
    bio: 'Proyecto de contenido gastronómico reconocido por reseñas y difusión de locales de Santa Cruz.',
    niche: 'Gastronomía y Restaurantes',
    sourceUrl: 'https://www.tiktok.com/@foodish.bo',
    followers: { tiktok: 311_800 },
  }),
  publicCreator({
    id: 'inf_ref_vivicus',
    fullName: 'Vivicus',
    handle: '@vivicus2',
    bio: 'Cuenta de contenido gastronómico con audiencia joven y presencia en el ecosistema foodie cruceño.',
    niche: 'Gastronomía y Restaurantes',
    sourceUrl: 'https://www.tiktok.com/@vivicus2',
    followers: { tiktok: 95_300 },
  }),
];

export const initialBusinesses: BusinessProfile[] = [
  {
    id: 'biz_1',
    userId: 'user_biz_1',
    companyName: 'Empresa Demo Santa Cruz',
    logoUrl: initialsAvatar('Empresa Demo Santa Cruz', '0f766e'),
    category: 'Marca demostrativa',
    description: 'Cuenta ficticia para probar campañas y colaboraciones sin representar a una empresa real.',
    location: 'Santa Cruz de la Sierra, Bolivia',
    rating: 4.8,
    reviewCount: 6,
    verified: false,
  },
  publicBusiness({ id: 'biz_ref_hipermaxi', companyName: 'Hipermaxi', category: 'Supermercados y Retail', description: 'Cadena boliviana de supermercados nacida en Santa Cruz en 1994.', website: 'https://informacion.hipermaxi.com/quienes-somos/' }),
  publicBusiness({ id: 'biz_ref_fridolin', companyName: 'Fridolin', category: 'Pastelería y Cafetería', description: 'Pastelería y cafetería nacida en Santa Cruz en 1975.', website: 'https://fridolin.com.bo/acerca-de/' }),
  publicBusiness({ id: 'biz_ref_manjar', companyName: 'Manjar de Oro', category: 'Chocolatería y Alimentos', description: 'Empresa cruceña dedicada a chocolates artesanales, helados y regalos.', website: 'https://www.manjardeoro.com/' }),
  publicBusiness({ id: 'biz_ref_camba', companyName: 'Casa del Camba', category: 'Gastronomía Cruceña', description: 'Restaurante de cocina regional cruceña fundado en 1986.', website: 'https://www.casadelcamba.com/' }),
  publicBusiness({ id: 'biz_ref_sofia', companyName: 'Sofía', category: 'Industria de Alimentos', description: 'Empresa familiar de alimentos nacida en Santa Cruz de la Sierra en 1976.', website: 'https://sofia.com.bo/pages/nosotros' }),
  publicBusiness({ id: 'biz_ref_fidalga', companyName: 'Fidalga', category: 'Supermercados y Retail', description: 'Cadena de supermercados con sede y amplia presencia en Santa Cruz.', website: 'https://www.fidalga.com/' }),
  publicBusiness({ id: 'biz_ref_icnorte', companyName: 'IC Norte', category: 'Supermercados y Retail', description: 'Cadena de supermercados con cobertura en el área metropolitana de Santa Cruz.', website: 'https://www.icnorte.com/' }),
  publicBusiness({ id: 'biz_ref_ventura', companyName: 'Ventura Mall', category: 'Centro Comercial y Entretenimiento', description: 'Centro comercial ubicado en la avenida San Martín y cuarto anillo de Santa Cruz.', website: 'https://www.venturamall.bo/' }),
  publicBusiness({ id: 'biz_ref_tajibos', companyName: 'Los Tajibos', category: 'Hotelería y Gastronomía', description: 'Hotel de Santa Cruz que integra hospitalidad, gastronomía, eventos y cultura local.', website: 'https://www.lostajiboshotel.com/es' }),
  publicBusiness({ id: 'biz_ref_chriss', companyName: 'Pollos Chriss', category: 'Restaurantes', description: 'Marca gastronómica cruceña conocida por su pollo broaster desde hace más de treinta años.', website: 'https://chriss.com.bo/' }),
  publicBusiness({ id: 'biz_ref_fuego', companyName: 'Fuego Burger', category: 'Hamburguesas y Restaurantes', description: 'Restaurante de hamburguesas con identidad urbana y presencia en Santa Cruz.', website: 'https://fuegoburger.co/' }),
  publicBusiness({ id: 'biz_ref_weidling', companyName: 'Weidling', category: 'Retail y Hogar', description: 'Empresa vinculada al comercio cruceño desde 1971.', website: 'https://weidling.com.bo/' }),
];

export const initialCampaigns: Campaign[] = [
  {
    id: 'camp_demo_1', businessId: 'biz_1', businessName: 'Empresa Demo Santa Cruz', businessLogo: initialsAvatar('Empresa Demo Santa Cruz', '0f766e'),
    title: 'Demo: ruta de sabores cruceños', description: 'SIMULACIÓN ACADÉMICA: campaña ficticia para demostrar una reseña gastronómica local. No es una oferta comercial real.',
    niche: 'Gastronomía y Restaurantes', budget: 350, requiredNetworks: ['TikTok', 'Instagram'], contentType: '1 video corto + 2 historias', minFollowers: 10_000,
    location: 'Santa Cruz de la Sierra', coverage: 'presencial', deadline: '2026-10-25', influencersNeeded: 2, applicantsCount: 1, status: 'en_negociacion', createdAt: '2026-09-10T10:00:00Z', isDemo: true,
  },
  {
    id: 'camp_demo_2', businessId: 'biz_1', businessName: 'Empresa Demo Santa Cruz', businessLogo: initialsAvatar('Empresa Demo Santa Cruz', '0f766e'),
    title: 'Demo: lanzamiento de emprendimiento local', description: 'SIMULACIÓN ACADÉMICA: ejercicio ficticio para mostrar contenido de lanzamiento. No representa a una marca real.',
    niche: 'Lifestyle y Emprendimiento', budget: 450, requiredNetworks: ['Instagram', 'TikTok'], contentType: '1 Reel + 3 historias', minFollowers: 15_000,
    location: 'Santa Cruz de la Sierra', coverage: 'ambas', deadline: '2026-11-05', influencersNeeded: 3, applicantsCount: 0, status: 'abierta', createdAt: '2026-09-12T14:00:00Z', isDemo: true,
  },
  {
    id: 'camp_demo_3', businessId: 'biz_1', businessName: 'Empresa Demo Santa Cruz', businessLogo: initialsAvatar('Empresa Demo Santa Cruz', '0f766e'),
    title: 'Demo: escapada por destinos de Santa Cruz', description: 'SIMULACIÓN ACADÉMICA: propuesta ficticia de turismo departamental para probar filtros y postulaciones.',
    niche: 'Turismo y Aventura', budget: 600, requiredNetworks: ['YouTube', 'TikTok'], contentType: 'Video dedicado + clips verticales', minFollowers: 20_000,
    location: 'Departamento de Santa Cruz', coverage: 'presencial', deadline: '2026-11-20', influencersNeeded: 2, applicantsCount: 0, status: 'abierta', createdAt: '2026-09-14T09:30:00Z', isDemo: true,
  },
];

export const initialApplications: ApplicationOrInvitation[] = [
  {
    id: 'app_demo_1', campaignId: 'camp_demo_1', campaignTitle: 'Demo: ruta de sabores cruceños', influencerId: 'inf_1', influencerName: 'Creador Demo Santa Cruz',
    influencerAvatar: initialsAvatar('Creador Demo Santa Cruz', '0f766e'), businessId: 'biz_1', businessName: 'Empresa Demo Santa Cruz', businessLogo: initialsAvatar('Empresa Demo Santa Cruz', '0f766e'),
    type: 'postulacion', initiatedBy: 'influencer', status: 'aceptada', pitchMessage: 'Mensaje ficticio para demostrar el flujo de una postulación local.',
    agreedBudget: 350, createdAt: '2026-09-11T11:00:00Z', agreementId: 'agr_demo_1',
  },
];

export const initialAgreements: AgreementBrief[] = [
  {
    id: 'agr_demo_1', applicationId: 'app_demo_1', campaignId: 'camp_demo_1', campaignTitle: 'Demo: ruta de sabores cruceños', influencerId: 'inf_1', influencerName: 'Creador Demo Santa Cruz',
    businessId: 'biz_1', businessName: 'Empresa Demo Santa Cruz', requestedWork: 'Contenido ficticio: un video corto y dos historias sobre gastronomía local.', agreedBudget: 350,
    platformFeePercent: 10, influencerPayout: 315, deadline: '2026-10-25', keyRequirements: ['Material exclusivamente demostrativo', 'No presentar la campaña como una oferta real', 'Usar contenido propio o autorizado'],
    escrowStatus: 'fondos_retenidos', status: 'activo', createdAt: '2026-09-11T12:00:00Z', depositedAt: '2026-09-11T12:30:00Z',
  },
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv_demo_1', agreementId: 'agr_demo_1', campaignId: 'camp_demo_1', campaignTitle: 'Demo: ruta de sabores cruceños', influencerId: 'inf_1', influencerName: 'Creador Demo Santa Cruz',
    influencerAvatar: initialsAvatar('Creador Demo Santa Cruz', '0f766e'), businessId: 'biz_1', businessName: 'Empresa Demo Santa Cruz', businessLogo: initialsAvatar('Empresa Demo Santa Cruz', '0f766e'),
    unreadCountInfluencer: 0, unreadCountBusiness: 1, lastMessageText: 'Contenido demostrativo listo para revisión.', lastMessageTimestamp: '2026-09-16T16:20:00Z',
  },
];

export const initialMessages: Record<string, ChatMessage[]> = {
  conv_demo_1: [
    { id: 'msg_demo_1', conversationId: 'conv_demo_1', senderId: 'user_biz_1', senderRole: 'business', senderName: 'Empresa Demo Santa Cruz', senderAvatar: initialsAvatar('Empresa Demo Santa Cruz', '0f766e'), text: 'Mensaje ficticio: acuerdo demo confirmado y fondos simulados en custodia.', timestamp: '2026-09-11T12:35:00Z' },
    { id: 'msg_demo_2', conversationId: 'conv_demo_1', senderId: 'user_inf_1', senderRole: 'influencer', senderName: 'Creador Demo Santa Cruz', senderAvatar: initialsAvatar('Creador Demo Santa Cruz', '0f766e'), text: 'Contenido demostrativo listo para revisión.', timestamp: '2026-09-16T16:20:00Z' },
  ],
};

export const initialDeliverables: Deliverable[] = [
  { id: 'deliv_demo_1', agreementId: 'agr_demo_1', campaignId: 'camp_demo_1', influencerId: 'inf_1', title: 'Entregable ficticio de muestra', contentUrl: 'https://example.com/influconnect-demo-entregable', notes: 'Este entregable existe únicamente para demostrar el flujo de revisión.', submittedAt: '2026-09-16T16:20:00Z', status: 'en_revision' },
];

export const initialRatings: RatingReview[] = [
  { id: 'rev_demo_1', campaignId: 'camp_demo_historical', campaignTitle: 'Campaña histórica ficticia', agreementId: 'agr_demo_historical', fromUserId: 'user_biz_1', fromUserName: 'Empresa Demo Santa Cruz', fromUserRole: 'business', toUserId: 'user_inf_1', stars: 5, comment: 'Reseña ficticia para demostrar el sistema de calificaciones.', punctualityScore: 5, communicationScore: 5, createdAt: '2026-08-20T10:00:00Z' },
];

export const initialNotifications: AppNotification[] = [
  { id: 'notif_demo_1', userId: 'user_inf_1', title: 'Acuerdo demostrativo confirmado', message: 'La Empresa Demo Santa Cruz aceptó la postulación ficticia.', type: 'acuerdo', read: false, createdAt: '2026-09-11T12:30:00Z', actionTab: 'messages', relatedId: 'agr_demo_1' },
  { id: 'notif_demo_2', userId: 'user_biz_1', title: 'Entregable demostrativo recibido', message: 'Creador Demo Santa Cruz subió un entregable ficticio para revisión.', type: 'mensaje', read: false, createdAt: '2026-09-16T16:20:00Z', actionTab: 'messages', relatedId: 'deliv_demo_1' },
];
