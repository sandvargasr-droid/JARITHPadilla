import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Globe,
  DollarSign,
  Video,
  Heart,
  Eye,
  CheckCircle,
  Edit3,
  Save,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Play,
  X,
  Camera,
} from 'lucide-react';
import { InfluencerProfile, VideoPortfolioItem, CoverageType } from '../../types.js';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
];

interface Props {
  profile: InfluencerProfile;
  onSave: (updatedData: Partial<InfluencerProfile>) => Promise<void>;
  readOnly?: boolean;
}

export const InfluencerProfileView: React.FC<Props> = ({ profile, onSave, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<InfluencerProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(profile.avatarUrl);
  const [activeVideoModal, setActiveVideoModal] = useState<VideoPortfolioItem | null>(null);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoThumb, setNewVideoThumb] = useState('');
  const [newVideoLikes, setNewVideoLikes] = useState(15000);
  const [newVideoPlatform, setNewVideoPlatform] = useState<'tiktok' | 'instagram' | 'youtube'>('tiktok');

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setTempAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    setIsSaving(true);
    try {
      const updated = { ...formData, avatarUrl: tempAvatarUrl };
      setFormData(updated);
      await onSave({ avatarUrl: tempAvatarUrl });
      setShowAvatarModal(false);
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

  const handleAddVideo = () => {
    if (!newVideoTitle.trim()) return;
    const newVideo: VideoPortfolioItem = {
      id: `vid_${Date.now()}`,
      title: newVideoTitle,
      thumbnailUrl:
        newVideoThumb.trim() ||
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      likes: Number(newVideoLikes),
      views: Number(newVideoLikes) * 6,
      platform: newVideoPlatform,
      isFeatured: true,
    };
    setFormData((prev) => ({
      ...prev,
      portfolio: [newVideo, ...prev.portfolio],
    }));
    setNewVideoTitle('');
    setNewVideoThumb('');
  };

  const toggleFeaturedVideo = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((v) =>
        v.id === id ? { ...v, isFeatured: !v.isFeatured } : v
      ),
    }));
  };

  const removeVideo = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((v) => v.id !== id),
    }));
  };

  const totalFollowers =
    (profile.socialFollowers.tiktok || 0) +
    (profile.socialFollowers.instagram || 0) +
    (profile.socialFollowers.facebook || 0) +
    (profile.socialFollowers.youtube || 0);

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-100 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-100/40 via-violet-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <img
                src={formData.avatarUrl || profile.avatarUrl}
                alt={profile.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-violet-50 shadow-md transition-transform"
              />
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setTempAvatarUrl(formData.avatarUrl || profile.avatarUrl);
                    setShowAvatarModal(true);
                  }}
                  className="absolute inset-0 rounded-2xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[11px] font-bold backdrop-blur-[2px] cursor-pointer"
                  title="Haz clic para cambiar la foto de perfil"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <span>Cambiar foto</span>
                </button>
              )}
              {profile.verified && (
                <span
                  title="Perfil Verificado"
                  className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-emerald-500 text-white shadow-xs pointer-events-none z-10"
                >
                  <CheckCircle className="w-4 h-4" />
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                  {profile.fullName}
                </h1>
                <span className="text-sm font-medium text-slate-400">{profile.handle}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                  {profile.niche}
                </span>
              </div>

              <p className="text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                {profile.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-800">{profile.rating}</span>
                  <span>({profile.reviewCount} reseñas de marcas)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span className="capitalize">Modalidad: {profile.coverage}</span>
                </div>
                <div>
                  <span>
                    {profile.age} años • {profile.gender}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!readOnly && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                isEditing
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-violet-600 text-white hover:bg-violet-700'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" /> Cancelar Edición
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" /> Editar Mi Perfil
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Editable Form Modal / Collapsible Section */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-violet-200 shadow-md space-y-6 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Configuración y Edición de Perfil
              </h2>
              <p className="text-xs text-slate-500">
                Todos los datos configurados aquí se actualizarán en tiempo real para las marcas.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          {/* Avatar Edit Bar */}
          <div className="p-3.5 bg-violet-50/60 rounded-xl border border-violet-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={formData.avatarUrl || profile.avatarUrl}
                alt="Avatar"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-300 shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Foto de Perfil del Influencer</span>
                <span className="text-[11px] text-slate-500">Haz clic en cambiar para subir una foto desde tu equipo o seleccionar un preset</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setTempAvatarUrl(formData.avatarUrl || profile.avatarUrl);
                setShowAvatarModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cambiar Foto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nombre Público</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Usuario / Handle</label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Edad</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Género</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
              >
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="no_binario">No binario</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ubicación / Ciudad</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Modalidad de Cobertura</label>
              <select
                value={formData.coverage}
                onChange={(e) => setFormData({ ...formData, coverage: e.target.value as CoverageType })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
              >
                <option value="presencial">Presencial (en mi ciudad)</option>
                <option value="remota">Remota (envío de productos a domicilio)</option>
                <option value="ambas">Ambas modalidades</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nicho Principal</label>
              <input
                type="text"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">URL Avatar / Foto de Perfil</label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 text-xs">Biografía y Estilo</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800 text-xs"
            />
          </div>

          {/* Social followers editor */}
          <div className="pt-2">
            <h3 className="font-bold text-slate-800 text-xs mb-2">Seguidores por Red Social</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-500 mb-1">TikTok</label>
                <input
                  type="number"
                  value={formData.socialFollowers.tiktok}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialFollowers: { ...formData.socialFollowers, tiktok: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">Instagram</label>
                <input
                  type="number"
                  value={formData.socialFollowers.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialFollowers: { ...formData.socialFollowers, instagram: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">Facebook</label>
                <input
                  type="number"
                  value={formData.socialFollowers.facebook}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialFollowers: { ...formData.socialFollowers, facebook: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">YouTube</label>
                <input
                  type="number"
                  value={formData.socialFollowers.youtube || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialFollowers: { ...formData.socialFollowers, youtube: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Rates editor */}
          <div className="pt-2">
            <h3 className="font-bold text-slate-800 text-xs mb-2">Tarifas por Tipo de Contenido (USD)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-500 mb-1">Story ($)</label>
                <input
                  type="number"
                  value={formData.rates.story}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rates: { ...formData.rates, story: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">Reel / TikTok ($)</label>
                <input
                  type="number"
                  value={formData.rates.reel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rates: { ...formData.rates, reel: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">Post en Feed ($)</label>
                <input
                  type="number"
                  value={formData.rates.post}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rates: { ...formData.rates, post: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">Video Dedicado ($)</label>
                <input
                  type="number"
                  value={formData.rates.videoDedicado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rates: { ...formData.rates, videoDedicado: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Add video to portfolio */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 text-xs mb-2">Agregar Video al Portafolio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <input
                type="text"
                placeholder="Título del video"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200"
              />
              <input
                type="url"
                placeholder="URL de imagen / thumbnail"
                value={newVideoThumb}
                onChange={(e) => setNewVideoThumb(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200"
              />
              <select
                value={newVideoPlatform}
                onChange={(e) => setNewVideoPlatform(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200"
              >
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
              </select>
              <button
                type="button"
                onClick={handleAddVideo}
                className="px-4 py-1.5 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Video
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Followers & Rates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Social Reach Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              Audiencia y Seguidores
            </h3>
            <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full">
              {totalFollowers.toLocaleString()} total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block font-medium">TikTok</span>
                <span className="text-base font-bold text-slate-800">
                  {profile.socialFollowers.tiktok.toLocaleString()}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-slate-900" />
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-rose-500 block font-medium">Instagram</span>
                <span className="text-base font-bold text-slate-800">
                  {profile.socialFollowers.instagram.toLocaleString()}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-blue-500 block font-medium">Facebook</span>
                <span className="text-base font-bold text-slate-800">
                  {profile.socialFollowers.facebook.toLocaleString()}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            </div>

            <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-100 flex items-center justify-between">
              <div>
                <span className="text-red-500 block font-medium">YouTube</span>
                <span className="text-base font-bold text-slate-800">
                  {(profile.socialFollowers.youtube || 0).toLocaleString()}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-red-600" />
            </div>
          </div>
        </div>

        {/* Content Rates Cards */}
        <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Tarifario por Formato de Contenido
            </h3>
            <span className="text-xs text-slate-400 font-medium">Precios base en USD</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-violet-50/40 border border-violet-100">
              <span className="text-violet-700 block font-medium">Story 24h</span>
              <span className="text-lg font-bold text-slate-900">${profile.rates.story}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Enlace directo + mención</span>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-50/40 border border-violet-100">
              <span className="text-violet-700 block font-medium">Reel / TikTok</span>
              <span className="text-lg font-bold text-slate-900">${profile.rates.reel}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Video dinámico de 30-60s</span>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-50/40 border border-violet-100">
              <span className="text-violet-700 block font-medium">Post en Feed</span>
              <span className="text-lg font-bold text-slate-900">${profile.rates.post}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Fotografía fija + copy</span>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-50/40 border border-violet-100">
              <span className="text-violet-700 block font-medium">Video Dedicado</span>
              <span className="text-lg font-bold text-slate-900">${profile.rates.videoDedicado}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Integración completa en canal</span>
            </div>
          </div>
        </div>

      </div>

      {/* Video Portfolio Gallery with Featured Highlights */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-violet-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg font-display flex items-center gap-2">
              <Video className="w-5 h-5 text-violet-600" />
              Portafolio de Videos & Contenido Destacado
            </h3>
            <p className="text-xs text-slate-500">
              Muestras de colaboraciones previas con mayor interacción y engagement.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {profile.portfolio.length} publicaciones
          </span>
        </div>

        {profile.portfolio.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed border-violet-100 rounded-2xl text-slate-400 text-xs">
            Aún no has agregado videos a tu portafolio. Pulsa "Editar Mi Perfil" para agregar tus mejores trabajos.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {profile.portfolio.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-[9/12] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setActiveVideoModal(item)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 text-violet-700 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    title="Reproducir video"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white">
                      {item.platform}
                    </span>

                    {item.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-current" /> Destacado
                      </span>
                    )}
                  </div>

                  {/* Bottom Stats */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="text-xs font-bold line-clamp-2 drop-shadow-sm mb-1.5">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-200">
                      <span className="flex items-center gap-1 font-medium">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                        {item.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Eye className="w-3.5 h-3.5 text-cyan-300" />
                        {item.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="p-2 bg-white border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => toggleFeaturedVideo(item.id)}
                      className={`font-semibold ${item.isFeatured ? 'text-amber-600' : 'text-slate-500'}`}
                    >
                      {item.isFeatured ? '★ Destacado' : '☆ Marcar Destacado'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeVideo(item.id)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Preview */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950/80 text-white">
              <span className="text-xs font-bold line-clamp-1">{activeVideoModal.title}</span>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[9/16] w-full bg-black flex items-center justify-center relative">
              {activeVideoModal.videoUrl ? (
                <video
                  src={activeVideoModal.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-slate-400 text-xs">
                  <Play className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p>Reproducción de demostración para: {activeVideoModal.title}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Avatar Edit Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 text-slate-800 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-display text-base">
                <Camera className="w-5 h-5 text-violet-600" />
                <span>Editar Foto de Perfil</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Current Preview */}
              <div className="flex flex-col items-center gap-2">
                <img
                  src={tempAvatarUrl}
                  alt="Vista previa de perfil"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-violet-200 shadow-md"
                />
                <span className="text-[11px] text-slate-400 font-medium">Vista previa de la nueva foto</span>
              </div>

              {/* Upload from file */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subir archivo desde tu dispositivo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer border border-slate-200 rounded-xl p-1"
                />
              </div>

              {/* Direct image URL input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  O ingresar enlace (URL) de imagen
                </label>
                <input
                  type="url"
                  value={tempAvatarUrl}
                  onChange={(e) => setTempAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-violet-500 text-slate-800"
                />
              </div>

              {/* Presets */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  O seleccionar una imagen de ejemplo
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map((presetUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setTempAvatarUrl(presetUrl)}
                      className={`w-10 h-10 rounded-xl overflow-hidden ring-2 transition-all ${
                        tempAvatarUrl === presetUrl
                          ? 'ring-violet-600 scale-105 shadow-sm'
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

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setTempAvatarUrl(formData.avatarUrl || profile.avatarUrl);
                    setShowAvatarModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Aplicar Foto'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
