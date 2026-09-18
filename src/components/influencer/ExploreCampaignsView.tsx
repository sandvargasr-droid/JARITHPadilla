import React, { useState } from 'react';
import {
  Search,
  Filter,
  Coins,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  Send,
  Sparkles,
  ChevronRight,
  X,
  Clock,
  AlertCircle,
  Building2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Campaign, ApplicationOrInvitation, BusinessProfile } from '../../types.js';
import { formatCurrency } from '../../utils/profileDisplay.js';

interface Props {
  campaigns: Campaign[];
  localBusinesses: BusinessProfile[];
  existingApplications: ApplicationOrInvitation[];
  onApply: (data: { campaignId: string; pitchMessage: string; agreedBudget: number }) => Promise<void>;
  onSelectCampaignForDetails?: (campaign: Campaign) => void;
}

export const ExploreCampaignsView: React.FC<Props> = ({
  campaigns,
  localBusinesses,
  existingApplications,
  onApply,
}) => {
  const [selectedNiche, setSelectedNiche] = useState('Todos');
  const [selectedNetwork, setSelectedNetwork] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [pitchMessage, setPitchMessage] = useState('');
  const [proposedBudget, setProposedBudget] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccessMessage, setApplySuccessMessage] = useState('');

  const niches = ['Todos', ...Array.from(new Set(campaigns.map((campaign) => campaign.niche))).sort()];

  const networks = ['Todas', 'TikTok', 'Instagram', 'YouTube', 'Facebook'];

  const filteredCampaigns = campaigns.filter((c) => {
    if (selectedNiche !== 'Todos' && !c.niche.toLowerCase().includes(selectedNiche.toLowerCase())) {
      return false;
    }
    if (selectedNetwork !== 'Todas' && !c.requiredNetworks.includes(selectedNetwork as any)) {
      return false;
    }
    if (maxBudget > 0 && c.budget > maxBudget) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.businessName.toLowerCase().includes(q) ||
        c.niche.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setProposedBudget(campaign.budget);
    setPitchMessage(
      `¡Hola ${campaign.businessName}! Me encanta la propuesta de "${campaign.title}". Mi comunidad tiene alto engagement en este rubro y puedo entregar contenido dinámico de excelente calidad.`
    );
    setApplySuccessMessage('');
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    setIsSubmitting(true);
    try {
      await onApply({
        campaignId: selectedCampaign.id,
        pitchMessage,
        agreedBudget: proposedBudget,
      });
      setApplySuccessMessage('¡Postulación enviada exitosamente a la marca!');
      setTimeout(() => {
        setSelectedCampaign(null);
        setApplySuccessMessage('');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Error al postularse');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-100 shadow-xs">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-2">
            Explorar Campañas Disponibles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Prueba el flujo completo con campañas simuladas de Santa Cruz. Ninguna tarjeta representa una oferta comercial real.
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Entorno demostrativo: presupuestos, acuerdos, mensajes, reseñas y pagos son completamente ficticios.</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por marca o palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
            />
          </div>

          <div>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800 bg-white"
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
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800 bg-white"
            >
              {networks.map((net) => (
                <option key={net} value={net}>
                  Red: {net}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="number"
              placeholder="Presupuesto máx. (Bs)..."
              value={maxBudget || ''}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Campaigns Feed List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500">
            Mostrando {filteredCampaigns.length} campañas activas
          </span>
          {(selectedNiche !== 'Todos' || selectedNetwork !== 'Todas' || searchQuery || maxBudget > 0) && (
            <button
              onClick={() => {
                setSelectedNiche('Todos');
                setSelectedNetwork('Todas');
                setSearchQuery('');
                setMaxBudget(0);
              }}
              className="text-xs text-violet-600 hover:text-violet-800 font-bold"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-violet-200 text-slate-400">
            <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No se encontraron campañas</p>
            <p className="text-xs text-slate-500 mt-1">Intenta ajustando tus criterios de búsqueda o filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map((c) => {
              const existingApp = existingApplications.find((a) => a.campaignId === c.id);
              const isApplied = !!existingApp;

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-5 border border-violet-100/90 shadow-xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Brand header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.businessLogo}
                          alt={c.businessName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-100 shadow-xs"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {c.businessName}
                          </h4>
                          <span className="text-[10px] text-slate-400 block">{c.location}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'abierta'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status === 'abierta' ? 'Abierta' : 'En negociación'}
                      </span>
                    </div>

                    {c.isDemo && (
                      <span className="mb-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                        Campaña demo · no oficial
                      </span>
                    )}

                    {/* Campaign Title & Nicho */}
                    <h3 className="text-sm font-bold text-slate-900 font-display line-clamp-2 mb-2">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-50 text-violet-700">
                        {c.niche}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                        Modalidad: {c.coverage}
                      </span>
                      {c.requiredNetworks.map((net) => (
                        <span
                          key={net}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700"
                        >
                          {net}
                        </span>
                      ))}
                    </div>

                    {/* Requirements summary */}
                    <div className="text-[11px] text-slate-500 space-y-1 mb-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span>Formato:</span>
                        <span className="font-semibold text-slate-700">{c.contentType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Alcance mínimo:</span>
                        <span className="font-semibold text-slate-700">
                          {c.minFollowers.toLocaleString()} seguidores
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Límite:</span>
                        <span className="font-semibold text-slate-700">{c.deadline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer with budget & action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Presupuesto</span>
                      <span className="text-base font-extrabold text-slate-900">{formatCurrency(c.budget)}</span>
                    </div>

                    {isApplied ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {existingApp.status === 'aceptada'
                          ? 'Aceptada'
                          : existingApp.status === 'rechazada'
                          ? 'Rechazada'
                          : 'Postulado'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenModal(c)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-xs"
                      >
                        <span>Postularme</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <section className="rounded-2xl border border-violet-100 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Empresas locales de Santa Cruz</h2>
            <p className="mt-1 text-xs text-slate-500">
              Directorio referencial con enlaces a sitios oficiales. Su presencia aquí no implica afiliación ni campañas activas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {localBusinesses.map((business) => (
            <a
              key={business.id}
              href={business.sourceUrl || business.website}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-violet-300 hover:bg-violet-50/40"
            >
              <img src={business.logoUrl} alt={business.companyName} className="h-11 w-11 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-xs font-bold text-slate-900">{business.companyName}</h3>
                  <ExternalLink className="h-3 w-3 shrink-0 text-slate-400 group-hover:text-violet-600" />
                </div>
                <p className="text-[10px] font-semibold text-violet-700">{business.category}</p>
                <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-500">{business.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 md:p-8 animate-in fade-in duration-150 text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCampaign.businessLogo}
                  alt={selectedCampaign.businessName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display line-clamp-1">
                    {selectedCampaign.title}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Marca: {selectedCampaign.businessName} • {selectedCampaign.location}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccessMessage ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <p className="font-bold text-base">{applySuccessMessage}</p>
                <p className="text-xs text-slate-400">
                  La marca revisará tu propuesta en su bandeja de postulaciones.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="mt-4 space-y-4 text-xs">
                <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100">
                  <p className="font-semibold text-violet-900 mb-1">Requisitos de la campaña:</p>
                  <p className="text-slate-600 leading-relaxed">{selectedCampaign.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                    <span className="bg-white px-2 py-0.5 rounded font-bold text-violet-700">
                      Entregable: {selectedCampaign.contentType}
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded font-bold text-violet-700">
                      Fecha límite: {selectedCampaign.deadline}
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded font-bold text-violet-700">
                      Modalidad: {selectedCampaign.coverage}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Propuesta económica / Tarifa (Bs)
                  </label>
                  <div className="relative">
                    <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      value={proposedBudget}
                      onChange={(e) => setProposedBudget(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 font-bold text-slate-900 text-sm"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Presupuesto fijado por la marca: {formatCurrency(selectedCampaign.budget)} (puedes negociar).
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mensaje de postulación / Pitch para la marca
                  </label>
                  <textarea
                    rows={4}
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800 leading-relaxed text-xs"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                  🛡️ <strong>Garantía InfluConnect:</strong> Al ser aceptada la postulación, los fondos quedarán en custodia (escrow) antes de que debas entregar el contenido.
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedCampaign(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Enviando...' : 'Confirmar y Enviar Postulación'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
