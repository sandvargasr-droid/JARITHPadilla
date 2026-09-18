import React, { useState } from 'react';
import {
  PlusCircle,
  Edit2,
  Lock,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  Save,
  ChevronRight,
  SendHorizontal,
} from 'lucide-react';
import { Campaign, CoverageType, CampaignStatus } from '../../types.js';
import { formatCurrency } from '../../utils/profileDisplay.js';

interface Props {
  campaigns: Campaign[];
  onCreateCampaign: (data: Partial<Campaign>) => Promise<void>;
  onUpdateCampaign: (id: string, data: Partial<Campaign>) => Promise<void>;
  onCloseCampaign: (id: string) => Promise<void>;
  onViewApplicationsForCampaign?: (campaignId: string) => void;
}

export const ManageCampaignsView: React.FC<Props> = ({
  campaigns,
  onCreateCampaign,
  onUpdateCampaign,
  onCloseCampaign,
  onViewApplicationsForCampaign,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    title: '',
    description: '',
    niche: 'Moda y Estilo',
    budget: 350,
    requiredNetworks: ['TikTok', 'Instagram'] as ('TikTok' | 'Instagram' | 'Facebook' | 'YouTube')[],
    contentType: '1 Reel + 2 Stories',
    minFollowers: 30000,
    location: 'Santa Cruz de la Sierra / Remoto',
    coverage: 'ambas' as CoverageType,
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    influencersNeeded: 2,
    status: 'abierta' as CampaignStatus,
  };

  const [formData, setFormData] = useState(initialFormState);

  const availableNetworks: ('TikTok' | 'Instagram' | 'Facebook' | 'YouTube')[] = [
    'TikTok',
    'Instagram',
    'YouTube',
    'Facebook',
  ];

  const handleNetworkToggle = (net: 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube') => {
    if (formData.requiredNetworks.includes(net)) {
      if (formData.requiredNetworks.length > 1) {
        setFormData({
          ...formData,
          requiredNetworks: formData.requiredNetworks.filter((n) => n !== net),
        });
      }
    } else {
      setFormData({
        ...formData,
        requiredNetworks: [...formData.requiredNetworks, net],
      });
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCampaign) {
        await onUpdateCampaign(editingCampaign.id, formData);
      } else {
        await onCreateCampaign(formData);
      }
      setShowCreateModal(false);
      setEditingCampaign(null);
      setFormData(initialFormState);
    } catch (err: any) {
      alert(err.message || 'Error al guardar campaña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      niche: campaign.niche,
      budget: campaign.budget,
      requiredNetworks: campaign.requiredNetworks,
      contentType: campaign.contentType,
      minFollowers: campaign.minFollowers,
      location: campaign.location,
      coverage: campaign.coverage,
      deadline: campaign.deadline,
      influencersNeeded: campaign.influencersNeeded,
      status: campaign.status,
    });
    setShowCreateModal(true);
  };

  const filtered = campaigns.filter((c) => {
    if (filterStatus === 'Todos') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Gestión de Campañas Publicadas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Crea briefs de contratación, revisa candidatos y administra el presupuesto de tus colaboraciones.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCampaign(null);
            setFormData(initialFormState);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 transition-colors shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Crear Nueva Campaña
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['Todos', 'abierta', 'en_negociacion', 'cerrada'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-colors ${
              filterStatus === st
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {st === 'abierta'
              ? 'Abiertas'
              : st === 'en_negociacion'
              ? 'En Negociación'
              : st === 'cerrada'
              ? 'Cerradas'
              : 'Todas las Campañas'}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-violet-200 text-slate-400 text-xs">
            No tienes campañas en esta categoría. Pulsa "Crear Nueva Campaña" para publicar tu primer brief.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 border border-violet-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        c.status === 'abierta'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.status === 'en_negociacion'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>

                    <span className="text-xs font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      {formatCurrency(c.budget)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display mb-1.5">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-4 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Nicho:</span>
                      <span className="font-semibold">{c.niche}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Formato:</span>
                      <span className="font-semibold">{c.contentType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Alcance mínimo:</span>
                      <span className="font-semibold">{c.minFollowers.toLocaleString()} seg.</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fecha límite:</span>
                      <span className="font-semibold">{c.deadline}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.requiredNetworks.map((n) => (
                      <span
                        key={n}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100"
                      >
                        {n}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100">
                      Cupos: {c.influencersNeeded} creadores
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {c.applicantsCount} postulados
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(c)}
                      className="flex items-center gap-1 text-slate-600 hover:text-violet-700 font-semibold p-1"
                      title="Editar parámetros de campaña"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    {c.status !== 'cerrada' && (
                      <button
                        onClick={() => onCloseCampaign(c.id)}
                        className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold p-1"
                        title="Cerrar recepción de candidatos"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Cerrar</span>
                      </button>
                    )}
                  </div>

                  {onViewApplicationsForCampaign && (
                    <button
                      onClick={() => onViewApplicationsForCampaign(c.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold transition-colors"
                    >
                      <span>Ver Solicitudes ({c.applicantsCount})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 md:p-8 animate-in fade-in duration-150 text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {editingCampaign ? 'Editar Campaña' : 'Publicar Nueva Campaña'}
                </h3>
                <p className="text-xs text-slate-500">
                  Completa todos los requisitos para que los influencers comprendan el brief y se postulen.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Título de la Campaña
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lanzamiento Colección Otoño o Degustación Brunch"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descripción del Brief (qué se promociona y qué se espera)
                </label>
                <textarea
                  rows={4}
                  placeholder="Explica detalladamente la temática, tono de voz, mensaje clave, etiquetas requeridas y dinámicas..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-900 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nicho / Categoría de Influencer
                  </label>
                  <input
                    type="text"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Presupuesto por Creador (Bs)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tipo de Contenido Esperado
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 1 Reel + 2 Stories, o Video dedicado"
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alcance Mínimo Requerido (Seguidores)
                  </label>
                  <input
                    type="number"
                    value={formData.minFollowers}
                    onChange={(e) =>
                      setFormData({ ...formData, minFollowers: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ubicación / Cobertura Deseada
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Modalidad de Trabajo
                  </label>
                  <select
                    value={formData.coverage}
                    onChange={(e) =>
                      setFormData({ ...formData, coverage: e.target.value as CoverageType })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 bg-white"
                  >
                    <option value="presencial">Presencial en el local/evento</option>
                    <option value="remota">Remota (envío de producto)</option>
                    <option value="ambas">Ambas modalidades permitidas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fecha Límite / Duración
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cantidad de Influencers Necesitados
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.influencersNeeded}
                    onChange={(e) =>
                      setFormData({ ...formData, influencersNeeded: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500"
                    required
                  />
                </div>
              </div>

              {/* Required Social Networks */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Redes Sociales Requeridas
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableNetworks.map((net) => {
                    const isSelected = formData.requiredNetworks.includes(net);
                    return (
                      <button
                        type="button"
                        key={net}
                        onClick={() => handleNetworkToggle(net)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                          isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? `✓ ${net}` : `+ ${net}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSubmitting
                    ? 'Guardando...'
                    : editingCampaign
                    ? 'Actualizar Campaña'
                    : 'Publicar Campaña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
