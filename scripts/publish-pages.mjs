import { cpSync, existsSync, rmSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDirectory = join(repositoryRoot, 'dist');
const distIndex = join(distDirectory, 'index.html');
const distAssets = join(distDirectory, 'assets');
const publishedAssets = join(repositoryRoot, 'assets');

if (!existsSync(distIndex) || !existsSync(distAssets)) {
  throw new Error('Run the GitHub Pages build before publishing its files.');
}

rmSync(publishedAssets, { recursive: true, force: true });
cpSync(distAssets, publishedAssets, { recursive: true });
copyFileSync(distIndex, join(repositoryRoot, 'index.html'));
