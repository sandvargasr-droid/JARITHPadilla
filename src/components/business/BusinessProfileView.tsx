import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Star,
  Globe,
  Edit3,
  Save,
  CheckCircle,
  Sparkles,
  Layers,
  X,
  Plus,
  Camera,
} from 'lucide-react';
import { BusinessProfile } from '../../types.js';

const LOGO_PRESETS = [
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=80',
];

interface Props {
  profile: BusinessProfile;
  onSave: (data: Partial<BusinessProfile>) => Promise<void>;
  readOnly?: boolean;
}

export const BusinessProfileView: React.FC<Props> = ({ profile, onSave, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BusinessProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [tempLogoUrl, setTempLogoUrl] = useState(profile.logoUrl);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setTempLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = async () => {
    setIsSaving(true);
    try {
      const updated = { ...formData, logoUrl: tempLogoUrl };
      setFormData(updated);
      await onSave({ logoUrl: tempLogoUrl });
      setShowLogoModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-100 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-100/40 via-violet-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <img
                src={formData.logoUrl || profile.logoUrl}
                alt={profile.companyName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-rose-50 shadow-md transition-transform"
              />
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setTempLogoUrl(formData.logoUrl || profile.logoUrl);
                    setShowLogoModal(true);
                  }}
                  className="absolute inset-0 rounded-2xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[11px] font-bold backdrop-blur-[2px] cursor-pointer"
                  title="Cambiar logotipo de la empresa"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <span>Cambiar logo</span>
                </button>
              )}
              {profile.verified && (
                <span
                  title="Empresa Verificada"
                  className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-emerald-500 text-white shadow-xs pointer-events-none z-10"
                >
                  <CheckCircle className="w-4 h-4" />
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                  {profile.companyName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  {profile.category}
                </span>
              </div>

              <p className="text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                {profile.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-800">{profile.rating}</span>
                  <span>({profile.reviewCount} evaluaciones de influencers)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.location}</span>
                </div>
                {profile.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-violet-600 font-medium">{profile.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!readOnly && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                isEditing
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" /> Cancelar Edición
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" /> Editar Perfil de Marca
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-rose-200 shadow-md space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Editar Datos de la Empresa / Pyme
              </h2>
              <p className="text-xs text-slate-500">
                Esta información genera confianza y visibilidad ante los influencers del marketplace.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Guardando...' : 'Guardar Datos'}
            </button>
          </div>

          {/* Logo Edit Bar */}
          <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={formData.logoUrl || profile.logoUrl}
                alt="Logo"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-300 shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Logotipo de la Empresa</span>
                <span className="text-[11px] text-slate-500">Haz clic para subir un logo desde tu equipo o seleccionar un preset</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setTempLogoUrl(formData.logoUrl || profile.logoUrl);
                setShowLogoModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cambiar Logo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nombre de la Empresa o Emprendimiento
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Rubro o Categoría
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ubicación / Ciudad o Zona de Operación
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                URL del Logo / Foto de Perfil
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Sitio Web o Tienda Online (opcional)
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Descripción Breve de la Empresa
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800"
                required
              />
            </div>
          </div>
        </form>
      )}

      {/* Brand Trust Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block mb-1">Reputación en Plataforma</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{profile.rating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(profile.rating) ? 'fill-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Basado en puntualidad de pago, claridad en los briefs y trato con los creadores.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block mb-1">Protección en Pagos</span>
          <div className="text-base font-bold text-slate-800 flex items-center gap-1.5 mt-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Sistema Escrow Activo
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Tus fondos depositados se retienen hasta que apruebes el contenido entregado.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block mb-1">Verificación Oficial</span>
          <div className="text-base font-bold text-slate-800 flex items-center gap-1.5 mt-1">
            <CheckCircle className="w-4 h-4 text-violet-600" />
            Empresa Registrada
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Tu cuenta cuenta con insignia de verificación y capacidad de invitar creadores al instante.
          </p>
        </div>
      </div>

      {/* Logo Edit Modal */}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-100 p-6 text-slate-800 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-display text-base">
                <Camera className="w-5 h-5 text-rose-600" />
                <span>Editar Logotipo de la Empresa</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Current Preview */}
              <div className="flex flex-col items-center gap-2">
                <img
                  src={tempLogoUrl}
                  alt="Vista previa de logo"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-rose-200 shadow-md"
                />
                <span className="text-[11px] text-slate-400 font-medium">Vista previa del nuevo logotipo</span>
              </div>

              {/* Upload from file */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subir archivo desde tu dispositivo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer border border-slate-200 rounded-xl p-1"
                />
              </div>

              {/* Direct URL input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  O ingresar enlace (URL) de imagen
                </label>
                <input
                  type="url"
                  value={tempLogoUrl}
                  onChange={(e) => setTempLogoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-rose-500 text-slate-800"
                />
              </div>

              {/* Presets */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  O seleccionar un logotipo prediseñado
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {LOGO_PRESETS.map((presetUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setTempLogoUrl(presetUrl)}
                      className={`w-12 h-12 rounded-xl overflow-hidden ring-2 transition-all ${
                        tempLogoUrl === presetUrl
                          ? 'ring-rose-600 scale-105 shadow-sm'
                          : 'ring-transparent hover:opacity-80'
                      }`}
                    >
                      <img
                        src={presetUrl}
                        alt={`Preset ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setTempLogoUrl(formData.logoUrl || profile.logoUrl);
                    setShowLogoModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveLogo}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Aplicar Logotipo'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
