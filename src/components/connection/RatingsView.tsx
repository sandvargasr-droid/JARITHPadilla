import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  Sparkles,
  CheckCircle,
  ThumbsUp,
  Clock,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';
import { Rating, Agreement, User } from '../../types.js';
import { formatCurrency } from '../../utils/profileDisplay.js';

interface Props {
  currentUser: User;
  ratings: Rating[];
  agreements: Agreement[];
  onSubmitRating: (data: {
    agreementId: string;
    targetUserId: string;
    stars: number;
    comment: string;
    categories: {
      communication: number;
      punctuality: number;
      qualityOrClarity: number;
    };
  }) => Promise<void>;
  targetAgreementForRating?: Agreement | null;
  onCloseRatingModal?: () => void;
}

export const RatingsView: React.FC<Props> = ({
  currentUser,
  ratings,
  agreements,
  onSubmitRating,
  targetAgreementForRating,
  onCloseRatingModal,
}) => {
  const [selectedAgreementToRate, setSelectedAgreementToRate] = useState<Agreement | null>(
    targetAgreementForRating || null
  );
  const [stars, setStars] = useState(5);
  const [communicationScore, setCommunicationScore] = useState(5);
  const [punctualityScore, setPunctualityScore] = useState(5);
  const [qualityScore, setQualityScore] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isInfluencer = currentUser.role === 'influencer';

  // Ratings received by this user
  const receivedRatings = ratings.filter((r) => r.targetUserId === currentUser.id);
  // Ratings given by this user
  const givenRatings = ratings.filter((r) => r.authorId === currentUser.id);

  // Completed agreements eligible for rating
  const completedAgreements = agreements.filter((a) => a.status === 'completado');

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgreementToRate) return;
    setIsSubmitting(true);
    try {
      const targetUserId = isInfluencer
        ? selectedAgreementToRate.businessId
        : selectedAgreementToRate.influencerId;

      await onSubmitRating({
        agreementId: selectedAgreementToRate.id,
        targetUserId,
        stars,
        comment: comment.trim(),
        categories: {
          communication: communicationScore,
          punctuality: punctualityScore,
          qualityOrClarity: qualityScore,
        },
      });

      setSelectedAgreementToRate(null);
      setComment('');
      if (onCloseRatingModal) onCloseRatingModal();
    } catch (err: any) {
      alert(err.message || 'Error al enviar calificación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageReceived =
    receivedRatings.length > 0
      ? (
          receivedRatings.reduce((sum, r) => sum + r.stars, 0) / receivedRatings.length
        ).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-100 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/40 via-violet-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Módulo de Calificaciones Mutuas
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Reputación & Evaluaciones de Colaboración
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Tras la liberación del pago en Escrow, ambas partes evalúan la experiencia de trabajo: comunicación, puntualidad y calidad del entregable o claridad del brief.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-slate-900 font-display">
                {averageReceived}
              </span>
              <div className="flex text-amber-400 justify-center mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(Number(averageReceived))
                        ? 'fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {receivedRatings.length} reseñas recibidas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Eligible agreements pending rating */}
      {completedAgreements.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 font-display mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Campañas Completadas Listas para Calificar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedAgreements.map((a) => {
              const alreadyRated = givenRatings.some((r) => r.agreementId === a.id);
              const otherParty = isInfluencer ? a.businessName : a.influencerName;

              return (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{a.campaignTitle}</h4>
                    <span className="text-slate-500 text-[11px]">
                      Con: <strong>{otherParty}</strong> ({formatCurrency(a.agreedPrice ?? a.agreedBudget)})
                    </span>
                  </div>

                  {alreadyRated ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold text-[10px] border border-emerald-200">
                      ✓ Ya Calificado
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedAgreementToRate(a)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 shrink-0"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Calificar Ahora</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ratings Received List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-display px-1">
          Reseñas Públicas en tu Perfil ({receivedRatings.length})
        </h3>

        {receivedRatings.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-violet-200 text-slate-400 text-xs">
            Aún no has recibido evaluaciones de colaboraciones. Completa campañas para acumular calificaciones de estrellas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {receivedRatings.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5 border border-violet-100 shadow-xs text-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={r.authorAvatar}
                      alt={r.authorName}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{r.authorName}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-900">{r.stars}.0</span>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed italic bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  "{r.comment}"
                </p>

                {r.categories && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <div>
                      <span className="block text-slate-400">Comunicación:</span>
                      <span className="font-bold text-slate-800">
                        ★ {r.categories.communication}.0
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Puntualidad:</span>
                      <span className="font-bold text-slate-800">
                        ★ {r.categories.punctuality}.0
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400">
                        {isInfluencer ? 'Claridad:' : 'Calidad:'}
                      </span>
                      <span className="font-bold text-slate-800">
                        ★ {r.categories.qualityOrClarity}.0
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal to Submit Rating */}
      {selectedAgreementToRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 md:p-8 animate-in fade-in duration-150 text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Evaluar Colaboración
                </h3>
                <p className="text-xs text-slate-500">
                  Campaña: {selectedAgreementToRate.campaignTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedAgreementToRate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRatingSubmit} className="mt-4 space-y-4 text-xs">
              {/* Overall Star Rating */}
              <div className="text-center py-2 bg-amber-50/50 rounded-2xl border border-amber-100">
                <label className="block font-bold text-slate-800 text-xs mb-1.5">
                  Calificación General
                </label>
                <div className="flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setStars(val)}
                      className="p-1 text-2xl focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          val <= stars
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-amber-700 mt-1 block">
                  {stars === 5
                    ? 'Excelente experiencia'
                    : stars === 4
                    ? 'Muy buena colaboración'
                    : stars === 3
                    ? 'Aceptable'
                    : 'Necesita mejorar'}
                </span>
              </div>

              {/* Category sub-scores */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1 text-[11px]">
                    Comunicación
                  </label>
                  <select
                    value={communicationScore}
                    onChange={(e) => setCommunicationScore(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} estrellas
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1 text-[11px]">
                    Puntualidad
                  </label>
                  <select
                    value={punctualityScore}
                    onChange={(e) => setPunctualityScore(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} estrellas
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1 text-[11px]">
                    {isInfluencer ? 'Claridad del Brief' : 'Calidad Entregable'}
                  </label>
                  <select
                    value={qualityScore}
                    onChange={(e) => setQualityScore(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} estrellas
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Free text comment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reseña libre y comentarios sobre el trabajo realizado
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe cómo fue la interacción, el trato y el cumplimiento de los acuerdos..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800 leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAgreementToRate(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Enviando...' : 'Publicar Calificación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
