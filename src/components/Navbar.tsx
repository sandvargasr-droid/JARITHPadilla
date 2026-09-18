import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bell,
  Users,
  Building2,
  RefreshCw,
  ChevronDown,
  Check,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Star,
  Layers,
} from 'lucide-react';
import { User, AppNotification, InfluencerProfile, BusinessProfile } from '../types.js';

interface NavbarProps {
  currentUser: User;
  currentProfile: InfluencerProfile | BusinessProfile | null;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
  notifications: AppNotification[];
  onNotificationClick: (notif: AppNotification) => void;
  onMarkAllRead: () => void;
  onResetDemo: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentProfile,
  allUsers,
  onSwitchUser,
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onResetDemo,
  activeTab,
  onTabChange,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isInfluencer = currentUser.role === 'influencer';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-violet-100 shadow-[0_2px_12px_rgba(30,27,75,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => onTabChange(isInfluencer ? 'explore_campaigns' : 'explore_influencers')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-rose-500 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight font-display text-slate-900">
                    Influ<span className="text-violet-600">Connect</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Marketplace Creadores & Marcas
                </p>
              </div>
            </div>

            {/* Active Role Indicator Badge */}
            <div className="hidden md:flex items-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isInfluencer
                    ? 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-200'
                    : 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200'
                }`}
              >
                {isInfluencer ? (
                  <>
                    <Users className="w-3.5 h-3.5 text-violet-600" />
                    Panel de Creador / Influencer
                  </>
                ) : (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-rose-600" />
                    Panel de Marca / Empresa
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Reset Demo Button */}
            <button
              onClick={onResetDemo}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1"
              title="Reiniciar datos de prueba"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-violet-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">Notificaciones</h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                          {unreadCount} nuevas
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllRead}
                        className="text-xs text-violet-600 hover:text-violet-800 font-semibold"
                      >
                        Marcar todas leídas
                      </button>
                    )}
                  </div>

                  <div className="mt-3 max-h-80 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No tienes notificaciones pendientes.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            onNotificationClick(n);
                            setShowNotifMenu(false);
                          }}
                          className={`p-3 rounded-xl transition-all cursor-pointer text-xs border ${
                            !n.read
                              ? 'bg-violet-50/50 border-violet-100 font-medium'
                              : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900">{n.title}</span>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block">
                            {new Date(n.createdAt).toLocaleDateString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo User Switcher Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pl-2 sm:pl-3 rounded-2xl border border-violet-100 hover:border-violet-300 hover:bg-violet-50/40 transition-all bg-white shadow-xs"
              >
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {isInfluencer ? 'Creador' : 'Marca'}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl overflow-hidden bg-violet-100 flex items-center justify-center font-bold text-violet-700 text-xs shrink-0 ring-1 ring-violet-200">
                  {currentProfile && 'avatarUrl' in currentProfile && currentProfile.avatarUrl ? (
                    <img
                      src={currentProfile.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : currentProfile && 'logoUrl' in currentProfile && currentProfile.logoUrl ? (
                    <img
                      src={currentProfile.logoUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-0.5" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-violet-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1.5 mb-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Cambiar Usuario Demo
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Alterna entre creadores y marcas para probar ambos lados del marketplace:
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="px-2 pt-1 text-[11px] font-bold text-violet-700 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Creadores / Influencers
                    </div>
                    {allUsers
                      .filter((u) => u.role === 'influencer')
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            currentUser.id === u.id
                              ? 'bg-violet-50 text-violet-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-[10px]">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <span>{u.name}</span>
                              <span className="block text-[10px] text-slate-400 font-normal">
                                {u.email}
                              </span>
                            </div>
                          </div>
                          {currentUser.id === u.id && (
                            <Check className="w-4 h-4 text-violet-600" />
                          )}
                        </button>
                      ))}

                    <div className="px-2 pt-2 text-[11px] font-bold text-rose-700 flex items-center gap-1 border-t border-slate-100 mt-2">
                      <Building2 className="w-3 h-3" /> Marcas / Empresas / Pymes
                    </div>
                    {allUsers
                      .filter((u) => u.role === 'business')
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            currentUser.id === u.id
                              ? 'bg-rose-50 text-rose-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <span>{u.name}</span>
                              <span className="block text-[10px] text-slate-400 font-normal">
                                {u.email}
                              </span>
                            </div>
                          </div>
                          {currentUser.id === u.id && (
                            <Check className="w-4 h-4 text-rose-600" />
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
