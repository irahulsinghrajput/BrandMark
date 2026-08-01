const fs = require('fs');
const path = require('path');

const locations = require('../src/data/locations.json');
const industries = require('../src/data/industries.json');

const DIST_DIR = path.join(__dirname, '../dist');
const PUBLIC_DIR = path.join(__dirname, '../public');
const DATA_DIR = path.join(__dirname, '../src/data');

const BASE_URL = 'https://www.brandmarksolutions.site';

function generateSitemap() {
  // Load Blogs if available
  let blogs = [];
  try {
    if (fs.existsSync(path.join(DATA_DIR, 'blogs.json'))) {
      blogs = require(path.join(DATA_DIR, 'blogs.json'));
    }
  } catch (e) {
    console.warn("Could not load blogs.json");
  }

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
  const blogRoutes = blogs.map(b => `/blog/${b.slug || b.id}`);

  const allRoutes = [...staticRoutes, ...locationRoutes, ...industryRoutes, ...blogRoutes];
  const today = new Date().toISOString().split('T')[0];

  // 1. MAIN SITEMAP
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/blog-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/image-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  // 2. PAGES SITEMAP
  const pagesSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...staticRoutes, ...locationRoutes, ...industryRoutes].map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  // 3. BLOG SITEMAP
  const blogSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${blogs.map(blog => `
  <url>
    <loc>${BASE_URL}/blog/${blog.slug || blog.id}</loc>
    <lastmod>${(blog.date_modified || blog.date_published || blog.date || today).split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  // 4. IMAGE SITEMAP (Simplified for all pages)
  const imageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${BASE_URL}/</loc>
    <image:image>
      <image:loc>${BASE_URL}/brandmark-logo-new.png.webp</image:loc>
      <image:title>BrandMark Solutions Logo</image:title>
    </image:image>
  </url>
</urlset>`;

  // 5. NEWS SITEMAP
  const newsSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${blogs.map(blog => `
  <url>
    <loc>${BASE_URL}/blog/${blog.slug || blog.id}</loc>
    <news:news>
      <news:publication>
        <news:name>BrandMark Solutions</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${(blog.date_published || blog.date || today).split('T')[0]}</news:publication_date>
      <news:title>${blog.title}</news:title>
    </news:news>
  </url>`).join('')}
</urlset>`;

  // 6. RSS FEED
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>BrandMark Solutions Insights</title>
  <link>${BASE_URL}/blog</link>
  <description>Latest digital marketing insights, case studies, and tutorials.</description>
  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
  ${blogs.map(blog => `
  <item>
    <title><![CDATA[${blog.title}]]></title>
    <link>${BASE_URL}/blog/${blog.slug || blog.id}</link>
    <guid>${BASE_URL}/blog/${blog.slug || blog.id}</guid>
    <pubDate>${new Date(blog.date_published || blog.date || Date.now()).toUTCString()}</pubDate>
    <description><![CDATA[${blog.description || blog.excerpt || blog.title}]]></description>
  </item>`).join('')}
</channel>
</rss>`;

  const writeFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapXml);
    fs.writeFileSync(path.join(dir, 'sitemap-pages.xml'), pagesSitemapXml);
    fs.writeFileSync(path.join(dir, 'blog-sitemap.xml'), blogSitemapXml);
    fs.writeFileSync(path.join(dir, 'image-sitemap.xml'), imageSitemapXml);
    fs.writeFileSync(path.join(dir, 'news-sitemap.xml'), newsSitemapXml);
    fs.writeFileSync(path.join(dir, 'rss.xml'), rssXml);
  };

  writeFiles(PUBLIC_DIR);
  writeFiles(DIST_DIR);

  console.log(`Sitemaps & RSS successfully generated for ${allRoutes.length} total routes.`);
}

generateSitemap();
