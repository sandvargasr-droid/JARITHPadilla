import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api.js';
import {
  User,
  InfluencerProfile,
  BusinessProfile,
  Campaign,
  ApplicationOrInvitation,
  Agreement,
  Deliverable,
  Conversation,
  Message,
  Rating,
  AppNotification,
} from './types.js';
import { Navbar } from './components/Navbar.js';
import { NavigationTabs } from './components/NavigationTabs.js';
import { InfluencerProfileView } from './components/influencer/InfluencerProfileView.js';
import { ExploreCampaignsView } from './components/influencer/ExploreCampaignsView.js';
import { BusinessProfileView } from './components/business/BusinessProfileView.js';
import { ManageCampaignsView } from './components/business/ManageCampaignsView.js';
import { ExploreInfluencersView } from './components/business/ExploreInfluencersView.js';
import { ApplicationsView } from './components/connection/ApplicationsView.js';
import { MessagingView } from './components/connection/MessagingView.js';
import { DeliverablesAndEscrowView } from './components/connection/DeliverablesAndEscrowView.js';
import { RatingsView } from './components/connection/RatingsView.js';
import { DocumentationModal } from './components/DocumentationModal.js';
import { Loader2, Sparkles } from 'lucide-react';

export default function App() {
  // Core Data States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProfile, setCurrentProfile] = useState<InfluencerProfile | BusinessProfile | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allInfluencers, setAllInfluencers] = useState<InfluencerProfile[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<ApplicationOrInvitation[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Navigation and UI States
  const [activeTab, setActiveTab] = useState<string>('explore_campaigns');
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [ratingModalAgreement, setRatingModalAgreement] = useState<Agreement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load all foundational data
  const loadData = useCallback(async () => {
    try {
      const [
        meRes,
        usersRes,
        influencersRes,
        campaignsRes,
        appsRes,
        agreementsRes,
        deliverablesRes,
        conversationsRes,
        ratingsRes,
        notifsRes,
      ] = await Promise.all([
        api.getCurrentUser(),
        api.getAllUsers(),
        api.getInfluencerProfiles(),
        api.getCampaigns(),
        api.getApplications(),
        api.getAgreements(),
        api.getDeliverables(),
        api.getConversations(),
        api.getRatings(),
        api.getNotifications(),
      ]);

      setCurrentUser(meRes.user);
      setCurrentProfile(meRes.profile);
      setAllUsers(usersRes.users);
      setAllInfluencers(influencersRes.influencers);
      setCampaigns(campaignsRes);
      setApplications(appsRes);
      setAgreements(agreementsRes.agreements);
      setDeliverables(deliverablesRes);
      setConversations(conversationsRes);
      setRatings(ratingsRes);
      setNotifications(notifsRes);

      if (conversationsRes.length > 0 && !activeConversationId) {
        setActiveConversationId(conversationsRes[0].id);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load messages whenever activeConversationId changes
  useEffect(() => {
    if (activeConversationId) {
      api.getMessages(activeConversationId).then((chatMessages) => {
        setMessages(chatMessages);
      }).catch(console.error);
    }
  }, [activeConversationId]);

  // Handle switching users
  const handleSwitchUser = async (userId: string) => {
    setIsLoading(true);
    api.setCurrentUserId(userId);
    const targetUser = allUsers.find((u) => u.id === userId);
    if (targetUser) {
      // Set appropriate default tab
      if (targetUser.role === 'influencer') {
        setActiveTab('explore_campaigns');
      } else {
        setActiveTab('explore_influencers');
      }
    }
    setActiveConversationId(null);
    await loadData();
  };

  // Actions: Profiles
  const handleSaveInfluencerProfile = async (updatedData: Partial<InfluencerProfile>) => {
    const updated = await api.updateInfluencerProfile(updatedData);
    setCurrentProfile(updated);
    await loadData();
  };

  const handleSaveBusinessProfile = async (updatedData: Partial<BusinessProfile>) => {
    const updated = await api.updateBusinessProfile(updatedData);
    setCurrentProfile(updated);
    await loadData();
  };

  // Actions: Campaigns
  const handleCreateCampaign = async (data: Partial<Campaign>) => {
    await api.createCampaign(data);
    await loadData();
  };

  const handleUpdateCampaign = async (id: string, data: Partial<Campaign>) => {
    await api.updateCampaign(id, data);
    await loadData();
  };

  const handleCloseCampaign = async (id: string) => {
    await api.closeCampaign(id);
    await loadData();
  };

  // Actions: Applications & Invitations
  const handleApplyCampaign = async (data: {
    campaignId: string;
    pitchMessage: string;
    agreedBudget: number;
  }) => {
    await api.applyToCampaign(data);
    await loadData();
  };

  const handleInviteInfluencer = async (data: {
    campaignId: string;
    influencerId: string;
    pitchMessage: string;
    agreedBudget: number;
  }) => {
    await api.inviteInfluencer(data);
    await loadData();
  };

  const handleRespondApplication = async (id: string, action: 'accept' | 'reject') => {
    await api.respondApplication(id, action);
    await loadData();
    if (action === 'accept') {
      setActiveTab('messages');
    }
  };

  // Actions: Messaging
  const handleSendMessage = async (convId: string, text: string) => {
    const newMsg = await api.sendMessage(convId, text);
    setMessages((prev) => [...prev, newMsg]);
    await loadData();
  };

  // Actions: Deliverables & Escrow
  const handleSubmitDeliverable = async (
    agreementId: string,
    data: { fileUrl: string; postUrl: string; notes: string }
  ) => {
    const ag = agreements.find((a) => a.id === agreementId);
    await api.submitDeliverable({
      agreementId,
      title: ag ? ag.campaignTitle : 'Entregable de Campaña',
      contentUrl: data.postUrl,
      notes: data.notes,
      previewImageUrl: data.fileUrl,
    });
    await loadData();
  };

  const handleReviewDeliverable = async (
    deliverableId: string,
    action: 'approve' | 'request_adjustments',
    notes?: string
  ) => {
    const mappedAction = action === 'approve' ? 'aprobar' : 'solicitar_cambios';
    await api.reviewDeliverable(deliverableId, mappedAction, notes);
    await loadData();
  };

  const handleDepositEscrow = async (agreementId: string) => {
    await api.depositEscrow(agreementId);
    await loadData();
  };

  // Actions: Ratings
  const handleSubmitRating = async (data: {
    agreementId: string;
    targetUserId: string;
    stars: number;
    comment: string;
    categories: {
      communication: number;
      punctuality: number;
      qualityOrClarity: number;
    };
  }) => {
    const ag = agreements.find((a) => a.id === data.agreementId);
    await api.submitRating({
      agreementId: data.agreementId,
      campaignId: ag ? ag.campaignId : '',
      toUserId: data.targetUserId,
      stars: data.stars,
      comment: data.comment,
      communicationScore: data.categories.communication,
      punctualityScore: data.categories.punctuality,
    });
    await loadData();
  };


  // Reset Demo
  const handleResetDemo = async () => {
    if (window.confirm('¿Reiniciar todos los datos a la demostración inicial?')) {
      setIsLoading(true);
      await api.resetDemo();
      await loadData();
      setActiveTab(currentUser?.role === 'influencer' ? 'explore_campaigns' : 'explore_influencers');
    }
  };

  // Notifications
  const handleNotificationClick = async (n: AppNotification) => {
    await api.markNotificationRead(n.id);
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    if (n.linkTab) {
      setActiveTab(n.linkTab);
    }
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4 animate-bounce">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center gap-2 text-violet-700 font-bold text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Cargando InfluConnect Marketplace...</span>
        </div>
      </div>
    );
  }

  const isInfluencer = currentUser.role === 'influencer';

  // Badges calculation
  const pendingAppsCount = applications.filter((a) => {
    if (a.status !== 'pendiente') return false;
    if (isInfluencer) {
      return a.type === 'invitacion';
    } else {
      return a.type === 'postulacion';
    }
  }).length;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900 selection:bg-violet-500 selection:text-white">
      {/* Top Main Navbar */}
      <Navbar
        currentUser={currentUser}
        currentProfile={currentProfile}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={handleMarkAllRead}
        onResetDemo={handleResetDemo}
        onOpenDocs={() => setShowDocsModal(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Sub-Navigation Tabs */}
      <NavigationTabs
        role={currentUser.role}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        applicationsBadgeCount={pendingAppsCount}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Influencer Role Views */}
        {isInfluencer && (
          <>
            {activeTab === 'explore_campaigns' && (
              <ExploreCampaignsView
                campaigns={campaigns}
                existingApplications={applications}
                onApply={handleApplyCampaign}
              />
            )}

            {activeTab === 'my_profile' && currentProfile && 'rates' in currentProfile && (
              <InfluencerProfileView
                profile={currentProfile as InfluencerProfile}
                onSave={handleSaveInfluencerProfile}
              />
            )}
          </>
        )}

        {/* Business Role Views */}
        {!isInfluencer && (
          <>
            {activeTab === 'explore_influencers' && (
              <ExploreInfluencersView
                influencers={allInfluencers}
                myCampaigns={campaigns.filter((c) => c.businessId === currentUser.id)}
                onInviteInfluencer={handleInviteInfluencer}
              />
            )}

            {activeTab === 'manage_campaigns' && (
              <ManageCampaignsView
                campaigns={campaigns.filter((c) => c.businessId === currentUser.id)}
                onCreateCampaign={handleCreateCampaign}
                onUpdateCampaign={handleUpdateCampaign}
                onCloseCampaign={handleCloseCampaign}
                onViewApplicationsForCampaign={(campaignId) => {
                  setActiveTab('applications');
                }}
              />
            )}

            {activeTab === 'business_profile' && currentProfile && 'companyName' in currentProfile && (
              <BusinessProfileView
                profile={currentProfile as BusinessProfile}
                onSave={handleSaveBusinessProfile}
              />
            )}
          </>
        )}

        {/* Shared Connection Module Views */}
        {activeTab === 'applications' && (
          <ApplicationsView
            role={currentUser.role}
            applications={applications}
            onRespond={handleRespondApplication}
            onNavigateToChat={() => setActiveTab('messages')}
          />
        )}

        {activeTab === 'messages' && (
          <MessagingView
            currentUser={currentUser}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            messages={messages}
            onSendMessage={handleSendMessage}
            agreements={agreements}
            onNavigateToEscrow={(agreementId) => {
              setActiveTab('escrow');
            }}
          />
        )}

        {activeTab === 'escrow' && (
          <DeliverablesAndEscrowView
            currentUser={currentUser}
            agreements={agreements}
            deliverables={deliverables}
            onSubmitDeliverable={handleSubmitDeliverable}
            onReviewDeliverable={handleReviewDeliverable}
            onDepositEscrow={handleDepositEscrow}
            onOpenRatingModal={(agreement) => {
              setRatingModalAgreement(agreement);
              setActiveTab('ratings');
            }}
          />
        )}

        {activeTab === 'ratings' && (
          <RatingsView
            currentUser={currentUser}
            ratings={ratings}
            agreements={agreements}
            onSubmitRating={handleSubmitRating}
            targetAgreementForRating={ratingModalAgreement}
            onCloseRatingModal={() => setRatingModalAgreement(null)}
          />
        )}

      </main>

      {/* Official Functional Specification Documentation Modal */}
      <DocumentationModal isOpen={showDocsModal} onClose={() => setShowDocsModal(false)} />


      {/* Global Footer */}
      <footer className="mt-auto border-t border-violet-100 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 font-display">InfluConnect</span>
            <span>— Plataforma Oficial de Conexión Influencers & Marcas</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setShowDocsModal(true)}
              className="hover:text-violet-600 font-medium"
            >
              Ver Requisitos Oficiales
            </button>
            <span>•</span>
            <button
              onClick={handleResetDemo}
              className="hover:text-violet-600 font-medium"
            >
              Reiniciar Entorno
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
