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

  const [session, influencers, campaigns] = await Promise.all([
    demoApi.getCurrentUser(),
    demoApi.getInfluencerProfiles(),
    demoApi.getCampaigns(),
  ]);

  assert.equal(session.user.id, 'user_inf_1');
  assert.equal(session.profile?.userId, session.user.id);
  assert.ok(session.allUsers.length > 1);
  assert.ok(influencers.influencers.length > 0);
  assert.ok(campaigns.length > 0);
});
