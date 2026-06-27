import { access, readFile } from 'fs/promises';
import path from 'path';

// Vike pre-renders the static site into dist/client (public/ assets are copied there too).
const distDir = path.resolve('dist', 'client');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const robotsPath = path.join(distDir, 'robots.txt');

function fail(message, error) {
  console.error(`Static asset verification failed: ${message}`);
  if (error) {
    console.error(error);
  }
  process.exit(1);
}

async function ensureExists(filePath, label) {
  try {
    await access(filePath);
  } catch (error) {
    fail(`${label} is missing. Ensure the file exists in public/ and the build copied it to dist/.`, error);
  }
}

async function ensureSitemapXml(filePath) {
  await ensureExists(filePath, 'dist/sitemap.xml');
  try {
    const content = await readFile(filePath, 'utf8');
    if (!content.trimStart().startsWith('<?xml')) {
      fail('dist/sitemap.xml exists but does not start with "<?xml". Check sitemap generation.');
    }
  } catch (error) {
    fail('Unable to read dist/sitemap.xml.', error);
  }
}

async function main() {
  await ensureSitemapXml(sitemapPath);
  await ensureExists(robotsPath, 'dist/client/robots.txt');
  await ensureExists(path.join(distDir, '404.html'), 'dist/client/404.html');
  console.log('Static assets verified: dist/client/{sitemap.xml, robots.txt, 404.html} present.');
}

main().catch((error) => fail('Unexpected error while verifying static assets.', error));
