import React from 'react';
import {
  Compass,
  UserCheck,
  SendHorizontal,
  MessageSquare,
  ShieldCheck,
  Star,
  PlusCircle,
  Search,
  Building,
} from 'lucide-react';
import { UserRole } from '../types.js';

interface NavigationTabsProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  applicationsBadgeCount?: number;
  unreadMessagesCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  role,
  activeTab,
  onTabChange,
  applicationsBadgeCount = 0,
  unreadMessagesCount = 0,
}) => {
  const influencerTabs = [
    {
      id: 'explore_campaigns',
      label: 'Explorar Campañas',
      icon: Compass,
      description: 'Oportunidades abiertas',
    },
    {
      id: 'my_profile',
      label: 'Mi Perfil',
      icon: UserCheck,
      description: 'Tarifas y portafolio',
    },
    {
      id: 'applications',
      label: 'Postulaciones & Invitaciones',
      icon: SendHorizontal,
      badge: applicationsBadgeCount,
      description: 'Estado de solicitudes',
    },
    {
      id: 'messages',
      label: 'Mensajería & Briefs',
      icon: MessageSquare,
      badge: unreadMessagesCount,
      description: 'Chat y contrato',
    },
    {
      id: 'escrow',
      label: 'Entregables & Escrow',
      icon: ShieldCheck,
      description: 'Garantía y pagos',
    },
    {
      id: 'ratings',
      label: 'Calificaciones',
      icon: Star,
      description: 'Reputación acumulada',
    },
  ];

  const businessTabs = [
    {
      id: 'explore_influencers',
      label: 'Explorar Influencers',
      icon: Search,
      description: 'Creadores verificados',
    },
    {
      id: 'manage_campaigns',
      label: 'Mis Campañas',
      icon: PlusCircle,
      description: 'Crear y gestionar',
    },
    {
      id: 'business_profile',
      label: 'Perfil de Marca',
      icon: Building,
      description: 'Datos de empresa',
    },
    {
      id: 'applications',
      label: 'Postulaciones Recibidas',
      icon: SendHorizontal,
      badge: applicationsBadgeCount,
      description: 'Candidatos e invitaciones',
    },
    {
      id: 'messages',
      label: 'Mensajería & Acuerdos',
      icon: MessageSquare,
      badge: unreadMessagesCount,
      description: 'Chat y revisión',
    },
    {
      id: 'escrow',
      label: 'Pagos en Garantía',
      icon: ShieldCheck,
      description: 'Depósitos y liberación',
    },
    {
      id: 'ratings',
      label: 'Calificaciones',
      icon: Star,
      description: 'Feedback de creadores',
    },
  ];

  const currentTabs = role === 'influencer' ? influencerTabs : businessTabs;

  return (
    <div className="bg-white border-b border-violet-100/80 sticky top-18 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
          {currentTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-violet-50/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-violet-700'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
