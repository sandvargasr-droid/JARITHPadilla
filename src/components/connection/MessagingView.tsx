import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageSquare,
  ShieldCheck,
  FileText,
  Calendar,
  DollarSign,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Conversation, Message, User, Agreement } from '../../types.js';

interface Props {
  currentUser: User;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  messages: Message[];
  onSendMessage: (conversationId: string, text: string) => Promise<void>;
  agreements: Agreement[];
  onNavigateToEscrow?: (agreementId: string) => void;
}

export const MessagingView: React.FC<Props> = ({
  currentUser,
  conversations,
  activeConversationId,
  onSelectConversation,
  messages,
  onSendMessage,
  agreements,
  onNavigateToEscrow,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showBriefPanel, setShowBriefPanel] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeAgreement = activeConv
    ? agreements.find((a) => a.id === activeConv.agreementId)
    : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    setIsSending(true);
    try {
      await onSendMessage(activeConv.id, inputText.trim());
      setInputText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const isInfluencer = currentUser.role === 'influencer';

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-violet-200 text-slate-400">
        <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800 font-display">No hay conversaciones activas</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          El chat se habilita automáticamente tras confirmar un acuerdo de postulación o invitación en el Módulo de Conexión.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-violet-100 shadow-xs overflow-hidden flex flex-col md:flex-row h-[720px]">
      
      {/* Conversations List (Sidebar) */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col h-full bg-slate-50/40">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h2 className="text-sm font-bold text-slate-900 font-display flex items-center justify-between">
            <span>Mensajes & Acuerdos</span>
            <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
              {conversations.length} chats
            </span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.map((conv) => {
            const isSelected = activeConv?.id === conv.id;
            const otherName = isInfluencer ? conv.businessName : conv.influencerName;
            const otherAvatar = isInfluencer ? conv.businessLogo : conv.influencerAvatar;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-violet-50/80 border-l-4 border-violet-600'
                    : 'hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={otherAvatar}
                    alt={otherName}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{otherName}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(conv.lastMessageAt || conv.lastMessageTimestamp || Date.now()).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-[11px] text-violet-700 font-semibold truncate mt-0.5">
                      {conv.campaignTitle}
                    </p>

                    <p className="text-[11px] text-slate-500 truncate mt-1">
                      {conv.lastMessageText || 'Chat iniciado'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Main Area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col h-full bg-white relative">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <img
                src={isInfluencer ? activeConv.businessLogo : activeConv.influencerAvatar}
                alt={isInfluencer ? activeConv.businessName : activeConv.influencerName}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-violet-100"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  {isInfluencer ? activeConv.businessName : activeConv.influencerName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-violet-700 font-semibold truncate max-w-[200px] sm:max-w-xs">
                    {activeConv.campaignTitle}
                  </span>
                  {activeAgreement && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full capitalize ${
                        activeAgreement.status === 'completado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : activeAgreement.status === 'revision'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-violet-50 text-violet-700'
                      }`}
                    >
                      {(activeAgreement.status || 'activo').replace('_', ' ')}
                    </span>

                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeAgreement && onNavigateToEscrow && (
                <button
                  onClick={() => onNavigateToEscrow(activeAgreement.id)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  title="Ver fondos en custodia y entregables"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Escrow (${activeAgreement.agreedPrice})</span>
                </button>
              )}

              <button
                onClick={() => setShowBriefPanel(!showBriefPanel)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                  showBriefPanel
                    ? 'bg-violet-100 text-violet-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Mostrar/Ocultar Brief Acordado"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Brief</span>
              </button>
            </div>
          </div>

          {/* Middle Body: Chat Messages Stream + Collapsible Brief Panel */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
              {/* Security escrow banner */}
              <div className="p-3 bg-violet-50/70 border border-violet-100 rounded-xl text-center text-xs text-violet-900 max-w-md mx-auto">
                <ShieldCheck className="w-4 h-4 text-violet-600 inline-block mr-1 -mt-0.5" />
                <strong>Canal Protegido InfluConnect:</strong> Todos los acuerdos y archivos compartidos están respaldados por el contrato inteligente y garantía de retención.
              </div>

              {messages.map((m) => {
                const isMe = m.senderId === currentUser.id;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[70%]">
                      {!isMe && (
                        <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mb-1">
                          {m.senderName.charAt(0)}
                        </div>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl text-xs shadow-2xs leading-relaxed ${
                          isMe
                            ? 'bg-violet-600 text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                        }`}
                      >
                        <p>{m.text || m.content}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(m.timestamp || m.createdAt || Date.now()).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Persistent / Collapsible Brief Panel (Section 5.2 requirement) */}
            {showBriefPanel && activeAgreement && (
              <div className="w-72 sm:w-80 border-l border-slate-100 bg-white p-4 overflow-y-auto hidden sm:block animate-in slide-in-from-right-10 duration-200">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs font-display flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-violet-600" />
                    Brief Oficial Acordado
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      activeAgreement.status === 'completado'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-violet-50 text-violet-700'
                    }`}
                  >
                    {activeAgreement.status}
                  </span>
                </div>

                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Campaña:</span>
                    <span className="font-bold text-slate-800">{activeAgreement.campaignTitle}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Entregable Requerido:</span>
                    <span className="font-semibold text-violet-800 bg-violet-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      {activeAgreement.deliverableRequirement}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Presupuesto Acordado:</span>
                    <div className="flex items-center gap-1 text-sm font-extrabold text-slate-900">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{activeAgreement.agreedPrice} USD</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Fecha Límite:</span>
                    <div className="flex items-center gap-1 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeAgreement.deadline}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-900">
                    <div className="flex items-center gap-1 font-bold mb-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Estado del Escrow:
                    </div>
                    <p className="capitalize">
                      {activeAgreement.escrowStatus === 'retenido'
                        ? 'Fondos en custodia garantizados'
                        : activeAgreement.escrowStatus === 'liberado'
                        ? 'Pago completado y transferido'
                        : 'Pendiente de depósito'}
                    </p>
                  </div>

                  {onNavigateToEscrow && (
                    <button
                      onClick={() => onNavigateToEscrow(activeAgreement.id)}
                      className="w-full py-2 px-3 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <span>Gestionar Entregable & Pago</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Send Message Input Bar */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe un mensaje en el chat oficial del acuerdo..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-violet-500 text-xs text-slate-800"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </div>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
          Selecciona una conversación para abrir el chat.
        </div>
      )}

    </div>
  );
};
