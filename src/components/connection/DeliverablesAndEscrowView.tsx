import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ExternalLink,
  DollarSign,
  FileCheck,
  Clock,
  MessageSquare,
  Star,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Lock,
  X,
  Send,
} from 'lucide-react';
import { Agreement, Deliverable, User } from '../../types.js';

interface Props {
  currentUser: User;
  agreements: Agreement[];
  deliverables: Deliverable[];
  onSubmitDeliverable: (
    agreementId: string,
    data: { fileUrl: string; postUrl: string; notes: string }
  ) => Promise<void>;
  onReviewDeliverable: (
    deliverableId: string,
    action: 'approve' | 'request_adjustments',
    notes?: string
  ) => Promise<void>;
  onDepositEscrow: (agreementId: string) => Promise<void>;
  onOpenRatingModal: (agreement: Agreement) => void;
}

export const DeliverablesAndEscrowView: React.FC<Props> = ({
  currentUser,
  agreements,
  deliverables,
  onSubmitDeliverable,
  onReviewDeliverable,
  onDepositEscrow,
  onOpenRatingModal,
}) => {
  const [selectedAgreementId, setSelectedAgreementId] = useState<string>(
    agreements.length > 0 ? agreements[0].id : ''
  );
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitFileUrl, setSubmitFileUrl] = useState('');
  const [submitPostUrl, setSubmitPostUrl] = useState('');
  const [submitNotes, setSubmitNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Review modal state
  const [reviewingDeliverable, setReviewingDeliverable] = useState<Deliverable | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'request_adjustments'>('approve');
  const [isReviewing, setIsReviewing] = useState(false);

  const isInfluencer = currentUser.role === 'influencer';

  const selectedAgreement = agreements.find((a) => a.id === selectedAgreementId) || agreements[0];
  const agreementDeliverables = selectedAgreement
    ? deliverables.filter((d) => d.agreementId === selectedAgreement.id)
    : [];

  const handleDeliverableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgreement) return;
    setIsSubmitting(true);
    try {
      await onSubmitDeliverable(selectedAgreement.id, {
        fileUrl:
          submitFileUrl.trim() ||
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        postUrl: submitPostUrl.trim(),
        notes: submitNotes.trim(),
      });
      setShowSubmitModal(false);
      setSubmitFileUrl('');
      setSubmitPostUrl('');
      setSubmitNotes('');
    } catch (err: any) {
      alert(err.message || 'Error al subir entregable');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingDeliverable) return;
    setIsReviewing(true);
    try {
      await onReviewDeliverable(reviewingDeliverable.id, reviewAction, reviewNotes);
      setReviewingDeliverable(null);
      setReviewNotes('');
    } catch (err: any) {
      alert(err.message || 'Error al revisar entregable');
    } finally {
      setIsReviewing(false);
    }
  };

  const totalRetained = agreements
    .filter((a) => a.escrowStatus === 'retenido' || a.escrowStatus === 'fondos_retenidos')
    .reduce((sum, a) => sum + (a.agreedPrice || a.agreedBudget || 0), 0);

  const totalReleased = agreements
    .filter((a) => a.escrowStatus === 'liberado')
    .reduce((sum, a) => sum + (a.agreedPrice || a.agreedBudget || 0), 0);

  if (agreements.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-violet-200 text-slate-400">
        <ShieldCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800 font-display">
          No hay acuerdos o transacciones activas
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Cuando una postulación o invitación sea aceptada, se creará el acuerdo y el depósito en garantía Escrow.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Escrow System Stats Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-100 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/40 via-violet-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Sistema Escrow de Retención Segura
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Entregables, Garantía & Pagos
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              El dinero de la campaña se retiene en custodia protegida. La marca aprueba el contenido antes de que los fondos se liberen al creador, garantizando cumplimiento para ambas partes.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Retenido en Garantía
              </span>
              <span className="text-lg font-extrabold text-amber-600">${totalRetained} USD</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Pagos Liberados
              </span>
              <span className="text-lg font-extrabold text-emerald-600">${totalReleased} USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Selector Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-violet-100 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-2">
          Selecciona un Acuerdo para ver Entregables:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {agreements.map((a) => {
            const isSelected = selectedAgreement?.id === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setSelectedAgreementId(a.id)}
                className={`px-4 py-2 rounded-xl font-bold transition-all text-left whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{a.campaignTitle}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  ${a.agreedPrice}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Agreement Details Card */}
      {selectedAgreement && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Deliverables Tracker */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Entregables de: {selectedAgreement.campaignTitle}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Requerimiento: <strong>{selectedAgreement.deliverableRequirement}</strong>
                  </span>
                </div>

                {isInfluencer && selectedAgreement.status !== 'completado' && (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 transition-colors shadow-xs shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Nuevo Entregable</span>
                  </button>
                )}
              </div>

              {/* Deliverables List */}
              <div className="mt-5 space-y-4">
                {agreementDeliverables.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-violet-100 rounded-xl text-slate-400 text-xs">
                    No se han subido entregables para este acuerdo aún.
                    {isInfluencer && ' Pulsa "Subir Nuevo Entregable" para enviar tu contenido o enlace a revisión.'}
                  </div>
                ) : (
                  agreementDeliverables.map((del) => {
                    const isPending = del.status === 'en_revision' || (del.status as string) === 'pendiente';
                    const isApproved = del.status === 'aprobado';
                    const isAdjustments = del.status === 'rechazado' || (del.status as string) === 'ajustes_solicitados';
                    const mediaUrl = del.fileUrl || del.previewImageUrl;
                    const contentLink = del.postUrl || del.contentUrl;
                    const feedback = del.reviewNotes || del.reviewFeedback;

                    return (
                      <div
                        key={del.id}
                        className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all text-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isAdjustments
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-violet-100 text-violet-800'
                              }`}
                            >
                              {del.status.replace('_', ' ')}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {new Date(del.submittedAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          {!isInfluencer && isPending && (
                            <button
                              onClick={() => {
                                setReviewingDeliverable(del);
                                setReviewAction('approve');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 shadow-xs"
                            >
                              Revisar Entregable
                            </button>
                          )}
                        </div>

                        {/* Deliverable media or link */}
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          {mediaUrl && (
                            <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative group">
                              <img
                                src={mediaUrl}
                                alt="Entregable"
                                className="w-full h-full object-cover"
                              />
                              <a
                                href={mediaUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-[10px]"
                              >
                                Ver archivo completo
                              </a>
                            </div>
                          )}

                          <div className="min-w-0 flex-1 space-y-1.5">
                            {contentLink && (
                              <div className="flex items-center gap-1.5 text-violet-700 font-semibold truncate">
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                <a
                                  href={contentLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:underline truncate"
                                >
                                  {contentLink}
                                </a>
                              </div>
                            )}

                            {del.notes && (
                              <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                                <strong>Notas del creador:</strong> {del.notes}
                              </p>
                            )}

                            {feedback && (
                              <p className="text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                                <strong>Observaciones de la marca:</strong> {feedback}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );

                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Escrow Status & Transaction Receipt */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-xs text-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Certificado de Escrow
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Monto Custodiado:</span>
                  <span className="text-base font-extrabold text-slate-900">
                    ${selectedAgreement.agreedPrice} USD
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estado de Fondos:</span>
                  <span
                    className={`font-bold capitalize px-2 py-0.5 rounded-full text-[10px] ${
                      selectedAgreement.escrowStatus === 'liberado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedAgreement.escrowStatus === 'retenido'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedAgreement.escrowStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fecha Límite:</span>
                  <span className="font-semibold text-slate-800">{selectedAgreement.deadline}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ID de Acuerdo:</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {selectedAgreement.id}
                  </span>
                </div>
              </div>

              {/* Deposit Escrow action if needed */}
              {selectedAgreement.escrowStatus === 'pendiente' && !isInfluencer && (
                <button
                  onClick={() => onDepositEscrow(selectedAgreement.id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Depositar Fondos en Garantía (${selectedAgreement.agreedPrice} USD)</span>
                </button>
              )}

              {/* Status explanation */}
              <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100 text-[11px] text-violet-900 leading-relaxed">
                {selectedAgreement.escrowStatus === 'retenido' ? (
                  <>
                    🔒 <strong>Fondos Asegurados:</strong> La plataforma retiene el pago de forma neutral. Una vez que la marca aprueba el contenido, se transfiere automáticamente.
                  </>
                ) : selectedAgreement.escrowStatus === 'liberado' ? (
                  <>
                    ✅ <strong>Transacción Completada:</strong> Los fondos fueron liberados exitosamente a la cuenta del influencer.
                  </>
                ) : (
                  <>
                    ⏳ Pendiente de depósito de fondos por la marca para activar la protección.
                  </>
                )}
              </div>

              {/* Rate button if agreement completed */}
              {selectedAgreement.status === 'completado' && (
                <button
                  onClick={() => onOpenRatingModal(selectedAgreement)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>
                    {isInfluencer ? 'Calificar a la Marca' : 'Calificar al Influencer'}
                  </span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Submit Deliverable Modal (Influencer) */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 md:p-8 animate-in fade-in duration-150 text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Subir Entregable para Revisión
                </h3>
                <p className="text-xs text-slate-500">
                  Campaña: {selectedAgreement.campaignTitle}
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeliverableSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Enlace de la publicación (TikTok / Reel / Instagram)
                </label>
                <input
                  type="url"
                  placeholder="https://www.tiktok.com/@valeria_rios/video/123..."
                  value={submitPostUrl}
                  onChange={(e) => setSubmitPostUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL de Captura de Pantalla o Archivo de Video / Métricas
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... o enlace de drive/archivo"
                  value={submitFileUrl}
                  onChange={(e) => setSubmitFileUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Opcional. Si lo dejas vacío se asignará una captura demo de alta resolución.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notas explicativas y estadísticas alcanzadas
                </label>
                <textarea
                  rows={3}
                  placeholder="Menciona las reproducciones iniciales, interacciones o cualquier comentario relevante..."
                  value={submitNotes}
                  onChange={(e) => setSubmitNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800 leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
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
                  {isSubmitting ? 'Enviando...' : 'Enviar Entregable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Deliverable Modal (Brand) */}
      {reviewingDeliverable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 md:p-8 animate-in fade-in duration-150 text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Evaluar y Aprobar Entregable
                </h3>
                <p className="text-xs text-slate-500">
                  Campaña: {selectedAgreement.campaignTitle}
                </p>
              </div>
              <button
                onClick={() => setReviewingDeliverable(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                {(reviewingDeliverable.postUrl || reviewingDeliverable.contentUrl) && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Enlace entregado:</span>
                    <a
                      href={reviewingDeliverable.postUrl || reviewingDeliverable.contentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-violet-600 font-semibold underline truncate block"
                    >
                      {reviewingDeliverable.postUrl || reviewingDeliverable.contentUrl}
                    </a>
                  </div>
                )}
                {reviewingDeliverable.notes && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Notas del creador:</span>
                    <p className="text-slate-700 italic">"{reviewingDeliverable.notes}"</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Decisión de la Marca
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewAction('approve')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      reviewAction === 'approve'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span>Aprobar y Liberar Pago (${selectedAgreement.agreedPrice} USD)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewAction('request_adjustments')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      reviewAction === 'request_adjustments'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                    <span>Solicitar Ajustes o Correcciones</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Observaciones / Feedback para el creador
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={
                    reviewAction === 'approve'
                      ? 'Ej: ¡Excelente contenido y engagement! Todo perfecto.'
                      : 'Especifica qué cambios se requieren en el video, copy o etiquetas...'
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800 leading-relaxed"
                />
              </div>

              <div className="p-3 bg-violet-50/70 border border-violet-100 rounded-xl text-[11px] text-violet-950">
                🛡️ <strong>Al aprobar el entregable:</strong> El estado de la campaña cambiará a completado y el dinero retenido en Escrow (${selectedAgreement.agreedPrice} USD) se liberará inmediatamente al creador.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewingDeliverable(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isReviewing}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-white transition-colors shadow-sm disabled:opacity-50 ${
                    reviewAction === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  {isReviewing
                    ? 'Procesando...'
                    : reviewAction === 'approve'
                    ? 'Aprobar y Liberar Pago'
                    : 'Enviar Solicitud de Ajustes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
