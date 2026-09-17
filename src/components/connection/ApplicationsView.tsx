import React, { useState } from 'react';
import {
  SendHorizontal,
  MailCheck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Users,
  Building2,
} from 'lucide-react';
import { ApplicationOrInvitation, UserRole } from '../../types.js';

interface Props {
  role: UserRole;
  applications: ApplicationOrInvitation[];
  onRespond: (id: string, action: 'accept' | 'reject') => Promise<void>;
  onNavigateToChat?: (conversationId?: string) => void;
}

export const ApplicationsView: React.FC<Props> = ({
  role,
  applications,
  onRespond,
  onNavigateToChat,
}) => {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'postulacion' | 'invitacion'>('todos');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const isInfluencer = role === 'influencer';

  const filtered = applications.filter((app) => {
    if (activeFilter === 'todos') return true;
    return app.type === activeFilter;
  });

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    setProcessingId(id);
    try {
      await onRespond(id, action);
    } catch (err: any) {
      alert(err.message || 'Error al procesar acción');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-100 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full">
              Módulo de Conexión
            </span>
            <span className="text-xs text-slate-400">• Flujo Bidireccional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            {isInfluencer ? 'Mis Postulaciones & Invitaciones' : 'Candidatos & Solicitudes de Campaña'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {isInfluencer
              ? 'Revisa el estado de tus candidaturas a campañas abiertas y acepta invitaciones directas enviadas por marcas. Al aceptar, se generará el Acuerdo formal de colaboración.'
              : 'Evalúa a los influencers postulados a tus campañas o da seguimiento a las invitaciones que enviaste. Aceptar una postulación inicia el acuerdo y activa el escrow.'}
          </p>
        </div>

        {/* Filter chips */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs">
          <button
            onClick={() => setActiveFilter('todos')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
              activeFilter === 'todos'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas ({applications.length})
          </button>
          <button
            onClick={() => setActiveFilter('postulacion')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
              activeFilter === 'postulacion'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isInfluencer ? 'Postulaciones Enviadas' : 'Postulaciones Recibidas'}
          </button>
          <button
            onClick={() => setActiveFilter('invitacion')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
              activeFilter === 'invitacion'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isInfluencer ? 'Invitaciones de Marcas' : 'Invitaciones Enviadas'}
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-violet-200 text-slate-400 text-xs">
            No hay solicitudes o invitaciones en este filtro.
          </div>
        ) : (
          filtered.map((app) => {
            const isPending = app.status === 'pendiente';
            const isAccepted = app.status === 'aceptada';
            const isRejected = app.status === 'rechazada';

            // Check if current user is the responder:
            // If type === 'postulacion' (initiated by influencer), Brand responds.
            // If type === 'invitacion' (initiated by brand), Influencer responds.
            const canRespond =
              isPending &&
              ((app.type === 'postulacion' && !isInfluencer) ||
                (app.type === 'invitacion' && isInfluencer));

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-6 border border-violet-100 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={isInfluencer ? app.businessLogo : app.influencerAvatar}
                    alt={isInfluencer ? app.businessName : app.influencerName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-50 shadow-xs shrink-0"
                  />

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          app.type === 'invitacion'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-violet-50 text-violet-700 border border-violet-200'
                        }`}
                      >
                        {app.type === 'invitacion' ? 'Invitación de Marca' : 'Postulación a Campaña'}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          isAccepted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isRejected
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        Estado: {app.status}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {app.campaignTitle}
                    </h3>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {isInfluencer ? (
                        <>
                          Marca:{' '}
                          <strong className="text-slate-800 font-semibold">
                            {app.businessName}
                          </strong>
                        </>
                      ) : (
                        <>
                          Influencer:{' '}
                          <strong className="text-slate-800 font-semibold">
                            {app.influencerName}
                          </strong>
                        </>
                      )}
                    </p>

                    {/* Pitch message */}
                    <div className="mt-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs text-slate-600 max-w-2xl leading-relaxed italic">
                      "{app.pitchMessage}"
                    </div>
                  </div>
                </div>

                {/* Right side: Budget & Action buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Presupuesto Acordado
                    </span>
                    <span className="text-xl font-extrabold text-slate-900">
                      ${app.agreedBudget}{' '}
                      <span className="text-xs font-normal text-slate-400">USD</span>
                    </span>
                  </div>

                  {canRespond ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(app.id, 'reject')}
                        disabled={processingId === app.id}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Rechazar
                      </button>
                      <button
                        onClick={() => handleAction(app.id, 'accept')}
                        disabled={processingId === app.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {processingId === app.id ? 'Aceptando...' : 'Aceptar y Crear Acuerdo'}
                      </button>
                    </div>
                  ) : isAccepted ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Acuerdo Generado
                      </span>
                      {onNavigateToChat && (
                        <button
                          onClick={() => onNavigateToChat()}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Ir al Chat</span>
                        </button>
                      )}
                    </div>
                  ) : isRejected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" /> Solicitud Declinada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Esperando respuesta de la otra parte
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
