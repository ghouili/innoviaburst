import { access, readFile } from 'fs/promises';
import path from 'path';

const distDir = path.resolve('dist');
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
  await ensureExists(robotsPath, 'dist/robots.txt');
  console.log('Static assets verified: dist/sitemap.xml and dist/robots.txt present.');
}

main().catch((error) => fail('Unexpected error while verifying static assets.', error));
