import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('GitHub Pages artifact uses bundled assets and the browser demo API', () => {
  const index = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const scriptMatch = index.match(/src="\/JARITHPadilla\/assets\/([^"]+\.js)"/);

  assert.doesNotMatch(index, /\/src\/main\.tsx/);
  assert.ok(scriptMatch, 'the production HTML must reference a JavaScript bundle under the repository base path');

  const bundleUrl = new URL(`../dist/assets/${scriptMatch[1]}`, import.meta.url);
  assert.ok(existsSync(bundleUrl), 'the JavaScript bundle referenced by index.html must exist');

  const bundle = readFileSync(bundleUrl, 'utf8');
  assert.equal(bundle.includes('user_inf_1'), true, 'the static demo data must be bundled for GitHub Pages');
  assert.equal(bundle.includes('/api/auth/me'), false, 'the Pages bundle must not require the Express API');
});
