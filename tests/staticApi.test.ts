import assert from 'node:assert/strict';
import test from 'node:test';
import { createStaticApi } from '../src/services/staticApi.ts';

test('static demo loads the data required by the first page without an HTTP server', async () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
  const demoApi = createStaticApi(storage);

  const [session, influencers, businesses, campaigns, applications, agreements] = await Promise.all([
    demoApi.getCurrentUser(),
    demoApi.getInfluencerProfiles(),
    demoApi.getBusinesses(),
    demoApi.getCampaigns(),
    demoApi.getApplications(),
    demoApi.getAgreements(),
  ]);

  assert.equal(session.user.id, 'user_inf_1');
  assert.equal(session.profile?.userId, session.user.id);
  assert.deepEqual(
    session.allUsers.map((user) => user.name).sort(),
    ['Creador Demo Santa Cruz', 'Empresa Demo Santa Cruz'],
  );
  assert.ok(influencers.influencers.length > 0);
  assert.ok(campaigns.length > 0);

  const handles = new Set(influencers.influencers.map((profile) => profile.handle));
  for (const handle of ['@carlitoselfoodie', '@flaviopaniaguac', '@lasabrosabo', '@anabelangus']) {
    assert.ok(handles.has(handle), `missing requested creator ${handle}`);
  }

  const companyNames = new Set(businesses.map((profile) => profile.companyName));
  for (const companyName of [
    'Hipermaxi',
    'Fridolin',
    'Manjar de Oro',
    'Casa del Camba',
    'Sofía',
    'Fidalga',
    'IC Norte',
    'Ventura Mall',
    'Los Tajibos',
    'Pollos Chriss',
    'Fuego Burger',
    'Weidling',
  ]) {
    assert.ok(companyNames.has(companyName), `missing local business ${companyName}`);
  }

  const publicCreators = influencers.influencers.filter((profile) => profile.isReferenceProfile);
  const publicBusinesses = businesses.filter((profile) => profile.isReferenceProfile);
  assert.ok(publicCreators.length >= 12);
  assert.equal(publicBusinesses.length, 12);
  assert.ok(publicCreators.every((profile) => profile.location.includes('Santa Cruz')));
  assert.ok(publicCreators.every((profile) => profile.sourceUrl?.startsWith('https://')));
  assert.ok(publicCreators.every((profile) => Object.values(profile.rates).every((rate) => rate === 0)));
  assert.ok(publicCreators.every((profile) => profile.rating === 0 && profile.reviewCount === 0));
  assert.ok(publicCreators.every((profile) => profile.portfolio.length === 0));
  assert.ok(publicBusinesses.every((profile) => profile.sourceUrl?.startsWith('https://')));
  assert.ok(publicBusinesses.every((profile) => profile.rating === 0 && profile.reviewCount === 0));

  assert.ok(campaigns.every((campaign) => campaign.isDemo));
  assert.ok(campaigns.every((campaign) => campaign.businessName === 'Empresa Demo Santa Cruz'));

  const referenceInfluencerIds = new Set(publicCreators.map((profile) => profile.id));
  const referenceBusinessIds = new Set(publicBusinesses.map((profile) => profile.id));
  assert.ok(applications.every((application) => !referenceInfluencerIds.has(application.influencerId)));
  assert.ok(applications.every((application) => !referenceBusinessIds.has(application.businessId)));
  assert.ok(agreements.agreements.every((agreement) => !referenceInfluencerIds.has(agreement.influencerId)));
  assert.ok(agreements.agreements.every((agreement) => !referenceBusinessIds.has(agreement.businessId)));
});

test('static demo recovers from a user id saved by an older deployment', async () => {
  const values = new Map<string, string>([['influconnect_user_id', 'user_inf_3']]);
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
  const demoApi = createStaticApi(storage);

  const session = await demoApi.getCurrentUser();

  assert.equal(session.user.id, 'user_inf_1');
  assert.equal(values.get('influconnect_user_id'), 'user_inf_1');
});

test('new demo registrations start with honest Santa Cruz defaults', async () => {
  const demoApi = createStaticApi(null);

  const creator = await demoApi.register({
    email: 'nuevo.creador@example.com',
    role: 'influencer',
    name: 'Nuevo Creador',
  });
  assert.equal(creator.profile?.location, 'Santa Cruz de la Sierra, Bolivia');
  assert.equal(creator.profile && 'rates' in creator.profile ? creator.profile.rating : -1, 0);
  assert.deepEqual(
    creator.profile && 'rates' in creator.profile ? creator.profile.socialFollowers : null,
    { tiktok: 0, instagram: 0, facebook: 0, youtube: 0 },
  );

  const business = await demoApi.register({
    email: 'nuevo.negocio@example.com',
    role: 'business',
    name: 'Nuevo Negocio',
  });
  assert.equal(business.profile?.location, 'Santa Cruz de la Sierra, Bolivia');
  assert.equal(business.profile && 'companyName' in business.profile ? business.profile.rating : -1, 0);
});
