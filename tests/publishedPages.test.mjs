import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('repository root contains the compiled site expected by branch-based GitHub Pages', () => {
  const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const scriptMatch = index.match(/src="\/JARITHPadilla\/assets\/([^"]+\.js)"/);

  assert.equal(index.includes('/src/main.tsx'), false, 'published HTML must not reference TypeScript source');
  assert.ok(scriptMatch, 'published HTML must reference the JavaScript bundle under the repository base path');

  const bundleUrl = new URL(`../assets/${scriptMatch[1]}`, import.meta.url);
  assert.ok(existsSync(bundleUrl), 'the JavaScript bundle referenced by the published HTML must exist');

  const bundle = readFileSync(bundleUrl, 'utf8');
  assert.equal(bundle.includes('/api/auth/me'), false, 'published bundle must use the browser demo API');
});
