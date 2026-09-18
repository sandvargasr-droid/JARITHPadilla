import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canInviteProfile,
  formatFollowers,
  formatRate,
  formatRating,
  getOwnedCampaigns,
} from '../src/utils/profileDisplay.ts';

test('unknown public metrics are presented without inventing commercial data', () => {
  assert.equal(formatFollowers(0), 'No publicado');
  assert.equal(formatRate(0), 'A consultar');
  assert.equal(formatRating(0, 0), 'Sin calificaciones');
});

test('published follower counts use a compact Spanish label', () => {
  assert.equal(formatFollowers(1_100), '1.1 mil');
  assert.equal(formatFollowers(68_800), '68.8 mil');
  assert.equal(formatFollowers(806_700), '806.7 mil');
  assert.equal(formatFollowers(1_200_000), '1.2 M');
});

test('known rates and ratings preserve their useful values', () => {
  assert.equal(formatRate(350), 'Bs 350');
  assert.equal(formatRating(4.9, 18), '4.9 (18)');
});

test('only demo creator accounts can receive marketplace invitations', () => {
  assert.equal(canInviteProfile({ isReferenceProfile: true }), false);
  assert.equal(canInviteProfile({ isReferenceProfile: false }), true);
  assert.equal(canInviteProfile({}), true);
});

test('business campaign ownership is matched against the business profile id', () => {
  const campaigns = [
    { id: 'campaign-owned', businessId: 'biz_1' },
    { id: 'campaign-other', businessId: 'biz_2' },
  ];

  assert.deepEqual(getOwnedCampaigns(campaigns, { id: 'biz_1' }), [campaigns[0]]);
  assert.deepEqual(getOwnedCampaigns(campaigns, null), []);
});
