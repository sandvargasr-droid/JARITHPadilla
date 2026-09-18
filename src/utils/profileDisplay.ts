export function formatFollowers(value: number): string {
  if (value <= 0) return 'No publicado';
  if (value >= 1_000_000) return `${trimDecimal(value / 1_000_000)} M`;
  if (value >= 1_000) return `${trimDecimal(value / 1_000)} mil`;
  return value.toLocaleString('es-BO');
}

export function formatRate(value: number): string {
  return value > 0 ? formatCurrency(value) : 'A consultar';
}

export function formatCurrency(value: number): string {
  return `Bs ${value.toLocaleString('es-BO', { maximumFractionDigits: 2 })}`;
}

export function formatRating(rating: number, reviewCount: number): string {
  return reviewCount > 0 ? `${rating.toFixed(1)} (${reviewCount})` : 'Sin calificaciones';
}

export function canInviteProfile(profile: { isReferenceProfile?: boolean }): boolean {
  return profile.isReferenceProfile !== true;
}

export function getOwnedCampaigns<T extends { businessId: string }>(
  campaigns: T[],
  businessProfile: { id: string } | null,
): T[] {
  if (!businessProfile) return [];
  return campaigns.filter((campaign) => campaign.businessId === businessProfile.id);
}

function trimDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}
