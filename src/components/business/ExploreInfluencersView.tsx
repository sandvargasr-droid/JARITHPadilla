import React, { useState } from 'react';
import {
  Search,
  Filter,
  DollarSign,
  Users,
  MapPin,
  Star,
  Sparkles,
  Send,
  CheckCircle,
  Eye,
  Heart,
  ChevronRight,
  X,
  CheckCircle2,
} from 'lucide-react';
import { InfluencerProfile, Campaign } from '../../types.js';

interface Props {
  influencers: InfluencerProfile[];
  myCampaigns: Campaign[];
  onInviteInfluencer: (data: {
    campaignId: string;
    influencerId: string;
    pitchMessage: string;
    agreedBudget: number;
  }) => Promise<void>;
  onViewInfluencerDetail?: (inf: InfluencerProfile) => void;
}

export const ExploreInfluencersView: React.FC<Props> = ({
  influencers,
  myCampaigns,
  onInviteInfluencer,
}) => {
  const [selectedNiche, setSelectedNiche] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxRate, setMaxRate] = useState<number>(0);
  const [selectedInfluencerForInvite, setSelectedInfluencerForInvite] = useState<InfluencerProfile | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    myCampaigns.length > 0 ? myCampaigns[0].id : ''
  );
  const [inviteBudget, setInviteBudget] = useState<number>(350);
  const [invitePitch, setInvitePitch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');
  const [viewingProfileModal, setViewingProfileModal] = useState<InfluencerProfile | null>(null);

  const niches = [
    'Todos',
    'Moda y Estilo',
    'Gastronomía y Cafés',
    'Fitness y Salud',
    'Tecnología y Gadgets',
  ];

  const locations = ['Todas', 'Madrid', 'Barcelona', 'Valencia'];

  const filtered = influencers.filter((inf) => {
    if (selectedNiche !== 'Todos' && !inf.niche.toLowerCase().includes(selectedNiche.toLowerCase())) {
      return false;
    }
    if (selectedLocation !== 'Todas' && !inf.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }
    if (maxRate > 0 && inf.rates.reel > maxRate) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        inf.fullName.toLowerCase().includes(q) ||
        inf.handle.toLowerCase().includes(q) ||
        inf.bio.toLowerCase().includes(q) ||
        inf.niche.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenInvite = (inf: InfluencerProfile) => {
    setSelectedInfluencerForInvite(inf);
    const camp = myCampaigns.find((c) => c.id === selectedCampaignId) || myCampaigns[0];
    const initialBudget = camp ? camp.budget : inf.rates.reel;
    setInviteBudget(initialBudget);
    setInvitePitch(
      `Hola ${inf.fullName}, nos encanta tu estilo y audiencia. Te invitamos a formar parte de nuestra campaña con las especificaciones acordadas.`
    );
    setInviteSuccessMsg('');
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInfluencerForInvite || !selectedCampaignId) return;
    setIsSubmitting(true);
    try {
      await onInviteInfluencer({
        campaignId: selectedCampaignId,
        influencerId: selectedInfluencerForInvite.id,
        pitchMessage: invitePitch,
        agreedBudget: Number(inviteBudget),
      });
      setInviteSuccessMsg('¡Invitación enviada con éxito al creador!');
      setTimeout(() => {
        setSelectedInfluencerForInvite(null);
        setInviteSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Error al enviar invitación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-100 shadow-xs">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-2">
            Descubrir Creadores e Influencers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Explora creadores de contenido verificados, revisa sus métricas reales en TikTok, Instagram y YouTube, y envíales una invitación directa para tus campañas.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre o nicho..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800"
            />
          </div>

          <div>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800 bg-white"
            >
              {niches.map((n) => (
                <option key={n} value={n}>
                  Nicho: {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800 bg-white"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  Ubicación: {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="number"
              placeholder="Tarifa máx. Reel ($ USD)..."
              value={maxRate || ''}
              onChange={(e) => setMaxRate(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Influencers Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500">
            {filtered.length} creadores disponibles
          </span>
          {(selectedNiche !== 'Todos' || selectedLocation !== 'Todas' || searchQuery || maxRate > 0) && (
            <button
              onClick={() => {
                setSelectedNiche('Todos');
                setSelectedLocation('Todas');
                setSearchQuery('');
                setMaxRate(0);
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((inf) => {
            const totalFollowers =
              (inf.socialFollowers.tiktok || 0) +
              (inf.socialFollowers.instagram || 0) +
              (inf.socialFollowers.facebook || 0) +
              (inf.socialFollowers.youtube || 0);

            return (
              <div
                key={inf.id}
                className="bg-white rounded-2xl p-5 border border-violet-100 shadow-xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top card info */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <img
                      src={inf.avatarUrl}
                      alt={inf.fullName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-50 shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 font-display truncate">
                          {inf.fullName}
                        </h3>
                        {inf.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block truncate">{inf.handle}</span>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-600">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-900">{inf.rating}</span>
                        <span className="text-[10px] text-slate-400">({inf.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {inf.bio}
                  </p>

                  {/* Social Followers Pills */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-[11px] mb-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">TikTok:</span>
                      <span className="font-bold text-slate-800">
                        {inf.socialFollowers.tiktok.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Instagram:</span>
                      <span className="font-bold text-slate-800">
                        {inf.socialFollowers.instagram.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Rates Snapshot */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4 px-1">
                    <span>Tarifa Reel:</span>
                    <span className="font-extrabold text-slate-900">${inf.rates.reel} USD</span>
                  </div>

                  {/* Portfolio highlight preview */}
                  {inf.portfolio.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Video Destacado:
                      </span>
                      <div
                        onClick={() => setViewingProfileModal(inf)}
                        className="relative rounded-xl overflow-hidden aspect-[16/9] cursor-pointer group bg-slate-900"
                      >
                        <img
                          src={inf.portfolio[0].thumbnailUrl}
                          alt={inf.portfolio[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-85"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 left-2 text-[10px] text-white font-semibold line-clamp-1 drop-shadow">
                          {inf.portfolio[0].title}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => setViewingProfileModal(inf)}
                    className="text-slate-600 hover:text-slate-900 font-semibold p-1"
                  >
                    Ver Portafolio
                  </button>

                  <button
                    onClick={() => handleOpenInvite(inf)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Invitar a Campaña</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {selectedInfluencerForInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 md:p-8 animate-in fade-in duration-150 text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedInfluencerForInvite.avatarUrl}
                  alt={selectedInfluencerForInvite.fullName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Invitar a {selectedInfluencerForInvite.fullName}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {selectedInfluencerForInvite.handle} • {selectedInfluencerForInvite.niche}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInfluencerForInvite(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccessMsg ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <p className="font-bold text-base">{inviteSuccessMsg}</p>
                <p className="text-xs text-slate-400">
                  El creador recibirá una notificación en su panel para aceptar o negociar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="mt-4 space-y-4 text-xs">
                {myCampaigns.length === 0 ? (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                    No tienes campañas activas creadas. Ve a la pestaña "Mis Campañas" y publica una para poder invitar creadores.
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Selecciona la Campaña para invitarlo
                      </label>
                      <select
                        value={selectedCampaignId}
                        onChange={(e) => {
                          setSelectedCampaignId(e.target.value);
                          const camp = myCampaigns.find((c) => c.id === e.target.value);
                          if (camp) setInviteBudget(camp.budget);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-rose-500 font-semibold text-slate-800 bg-white text-xs"
                        required
                      >
                        {myCampaigns.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} (${c.budget} USD)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Presupuesto Ofrecido (USD)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="number"
                          value={inviteBudget}
                          onChange={(e) => setInviteBudget(Number(e.target.value))}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-rose-500 font-bold text-slate-900 text-sm"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Tarifa base del creador para Reels: ${selectedInfluencerForInvite.rates.reel} USD.
                      </span>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mensaje personalizado de invitación
                      </label>
                      <textarea
                        rows={4}
                        value={invitePitch}
                        onChange={(e) => setInvitePitch(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800 leading-relaxed text-xs"
                        required
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                      🤝 Cuando el creador acepte tu invitación, se generará el Acuerdo/Brief oficial y se abrirá el canal directo de mensajería.
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedInfluencerForInvite(null)}
                        className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSubmitting ? 'Enviando...' : 'Enviar Invitación'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Profile Detail View Modal */}
      {viewingProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 md:p-8 animate-in fade-in duration-150 text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={viewingProfileModal.avatarUrl}
                  alt={viewingProfileModal.fullName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-50"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {viewingProfileModal.fullName}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {viewingProfileModal.handle} • {viewingProfileModal.niche} • {viewingProfileModal.location}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingProfileModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {viewingProfileModal.bio}
              </p>

              {/* Rates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                  <span className="text-slate-400 block text-[10px]">Story</span>
                  <span className="font-bold text-slate-900">${viewingProfileModal.rates.story} USD</span>
                </div>
                <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                  <span className="text-slate-400 block text-[10px]">Reel / TikTok</span>
                  <span className="font-bold text-slate-900">${viewingProfileModal.rates.reel} USD</span>
                </div>
                <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                  <span className="text-slate-400 block text-[10px]">Post en Feed</span>
                  <span className="font-bold text-slate-900">${viewingProfileModal.rates.post} USD</span>
                </div>
                <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                  <span className="text-slate-400 block text-[10px]">Video Dedicado</span>
                  <span className="font-bold text-slate-900">
                    ${viewingProfileModal.rates.videoDedicado} USD
                  </span>
                </div>
              </div>

              {/* Portfolio */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3">Galería de Contenidos Previos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {viewingProfileModal.portfolio.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
                    >
                      <div className="aspect-[9/12] w-full relative">
                        <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <span className="text-[11px] font-bold line-clamp-1 block">{v.title}</span>
                          <span className="text-[10px] text-slate-300">
                            {v.likes.toLocaleString()} likes
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setViewingProfileModal(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setViewingProfileModal(null);
                  handleOpenInvite(viewingProfileModal);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Invitar a Campaña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
