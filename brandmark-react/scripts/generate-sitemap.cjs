const fs = require('fs');
const path = require('path');

const locations = require('../src/data/locations.json');
const industries = require('../src/data/industries.json');

const DIST_DIR = path.join(__dirname, '../dist');
const PUBLIC_DIR = path.join(__dirname, '../public');

const BASE_URL = 'https://www.brandmarksolutions.site';

function generateSitemap() {
  const staticRoutes = [
    '/',
    '/about',
    '/services',
    '/portfolio',
    '/blog',
    '/careers',
    '/contact'
  ];

  const locationRoutes = Object.keys(locations).filter(k => k !== 'default').map(k => `/locations/${k}`);
  const industryRoutes = Object.keys(industries).filter(k => k !== 'default').map(k => `/industries/${k}`);

  const allRoutes = [...staticRoutes, ...locationRoutes, ...industryRoutes];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  // Write to both public (for dev) and dist (for prod)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);
  
  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);
  }

  console.log(`Sitemap successfully generated with ${allRoutes.length} routes.`);
}

generateSitemap();
