import React from 'react';
import { X, BookOpen, Layers, ShieldCheck, DollarSign, MessageSquare, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 md:p-8 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                Documentación Oficial — InfluConnect
              </h2>
              <p className="text-xs text-slate-500">
                Especificación Funcional del Proyecto • HackBiz Modelo CANVAS v1.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="mt-6 space-y-8 text-sm leading-relaxed">
          
          {/* Section 1 & 2: Architecture & Technologies */}
          <div>
            <h3 className="text-base font-bold text-violet-900 flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-violet-600" />
              1. Arquitectura y Tecnologías
            </h3>
            <p className="text-slate-600 mb-3">
              InfluConnect está construido como una solución <strong>Full-Stack</strong> moderna:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                <span className="font-semibold text-violet-900 block mb-1">Backend & API:</span>
                Node.js + Express 4.x con TypeScript compilado con <code>esbuild</code> en puerto 3000. Rutas REST en <code>/api/*</code> para autenticación, gestión de campañas, postulaciones, acuerdos, chat, escrow, calificaciones y notificaciones.
              </div>
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                <span className="font-semibold text-rose-900 block mb-1">Frontend & UI/UX:</span>
                React 19 con Vite y Tailwind CSS v4. Paleta inspirada en la guía de diseño visual Canva (violetas suaves, coral vibrante <code>#ff385c</code>, menta y tipografía <em>Outfit</em> y <em>Plus Jakarta Sans</em>).
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Data Entities */}
          <div>
            <h3 className="text-base font-bold text-violet-900 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-violet-600" />
              2. Modelo de Datos y Entidades Principales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">Users & Perfiles</strong>
                <code>User</code> (id, email, role: influencer | business) con <code>InfluencerProfile</code> (tarifas, seguidores en TikTok/IG/FB/YT, portafolio de video con destacados, ubicación, cobertura) y <code>BusinessProfile</code> (categoría, logo, ranking).
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">Campañas & Postulaciones</strong>
                <code>Campaign</code> (título, nicho, presupuesto, redes requeridas, contenido, alcance, cobertura, vacantes) y <code>ApplicationOrInvitation</code> con estados: <em>Pendiente, Aceptada, Rechazada, En Disputa</em>.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">Acuerdos, Chat & Escrow</strong>
                <code>AgreementBrief</code> (contrato con trabajo solicitado, presupuesto y fechas), <code>Conversation</code> (mensajería 1 a 1 ligada al brief), <code>Deliverable</code>, <code>PaymentEscrow</code> (comisión del 10%) y <code>RatingReview</code>.
              </div>
            </div>
          </div>

          {/* Section 5: The 2 Core Workflows */}
          <div>
            <h3 className="text-base font-bold text-violet-900 flex items-center gap-2 mb-3">
              <ArrowRight className="w-4 h-4 text-violet-600" />
              3. Flujos Operativos Completos
            </h3>
            
            <div className="space-y-4 text-xs">
              {/* Flujo Influencer */}
              <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-200">
                <h4 className="font-bold text-violet-950 text-sm mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-600"></span>
                  Flujo A: Influencer se postula a Campaña
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>El influencer explora campañas abiertas con filtros de nicho, presupuesto, redes sociales y ubicación.</li>
                  <li>Envía una postulación con mensaje motivacional y propuesta económica.</li>
                  <li>La marca recibe la postulación en su bandeja de solicitudes y revisa el perfil del creador.</li>
                  <li>La marca <strong>Acepta</strong> la postulación: el sistema genera automáticamente el <strong>Acuerdo/Brief</strong> y abre la <strong>Conversación individual</strong>.</li>
                  <li>La marca confirma el acuerdo depositando el pago en garantía (Escrow) retenido en la plataforma.</li>
                  <li>El influencer produce el contenido y sube el entregable (enlace y notas) en el chat.</li>
                  <li>La marca revisa el entregable y lo <strong>Aprueba</strong>.</li>
                  <li>InfluConnect libera automáticamente el pago al creador descontando la comisión del 10%.</li>
                  <li>Ambas partes califican la colaboración con estrellas y comentarios para alimentar el ranking público.</li>
                </ol>
              </div>

              {/* Flujo Marca */}
              <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
                <h4 className="font-bold text-rose-950 text-sm mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  Flujo B: Marca invita a Influencer Directamente
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>La marca utiliza el buscador de creadores verificados con filtros de nicho, seguidores y tarifas.</li>
                  <li>Selecciona una de sus campañas y envía una <strong>Invitación directa</strong> al influencer.</li>
                  <li>El influencer recibe la notificación y revisa los términos de la campaña invitada.</li>
                  <li>Al <strong>Aceptar</strong> la invitación, se genera el Acuerdo/Brief y se abre la mensajería individual.</li>
                  <li>Se ejecutan las etapas de depósito en garantía, entrega, revisión, liberación de pago y calificación mutua.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Section 6: Escrow & Disputes */}
          <div>
            <h3 className="text-base font-bold text-violet-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              4. Sistema de Pago en Garantía (Escrow) y Disputas
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-3">
              Para garantizar la confianza entre marcas y creadores, los fondos no se transfieren directamente:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">1. Retención (Escrow)</strong>
                La marca abona el presupuesto pactado. El dinero queda protegido en custodia segura de InfluConnect.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">2. Liberación & Fee</strong>
                Al aprobar la marca el entregable, el creador recibe su pago neto y la plataforma retiene el 10% de fee de servicio.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">3. Estado "En Disputa"</strong>
                Si hay incumplimiento o desacuerdo injustificado, la colaboración se marca en disputa para arbitraje de soporte.
              </div>
            </div>
          </div>

          {/* Section 7: Testing Guide */}
          <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200">
            <h3 className="text-sm font-bold text-violet-950 mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-violet-600" />
              5. Cómo probar los diferentes roles en la app
            </h3>
            <p className="text-xs text-slate-600 mb-2">
              Usa el selector <strong>"Cambiar Usuario Demo"</strong> en la barra superior:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
              <li><strong>Modo Influencer:</strong> Prueba con <em>Valeria Ríos</em> (Moda) o <em>Sofía Chen</em> (Foodie). Puedes editar tu perfil, explorar campañas, postularte, chatear y subir entregables.</li>
              <li><strong>Modo Marca:</strong> Prueba con <em>Aura Eco-Fashion</em> o <em>Gourmet Bistro</em>. Puedes crear campañas, invitar creadores, aceptar postulaciones, depositar en Escrow, aprobar entregas y calificar.</li>
              <li><strong>Reiniciar Demo:</strong> Si deseas restablecer los datos de prueba a su estado original, pulsa el botón de reinicio en cualquier momento.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors shadow-sm text-sm"
          >
            Entendido, Cerrar Documentación
          </button>
        </div>

      </div>
    </div>
  );
};
