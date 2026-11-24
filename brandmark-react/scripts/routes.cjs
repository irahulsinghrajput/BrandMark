// Single list of public, indexable routes. Used by the sitemap, the prerenderer and IndexNow,
// so the three can never disagree. Add new public pages here.
const path = require('path');
const DATA = path.join(__dirname, '../src/data');
const load = (f, fallback) => { try { return require(path.join(DATA, f)); } catch { return fallback; } };

const blogs = load('blogs.json', []);
const keys = (o) => Object.keys(o).filter((k) => k !== 'default');

const staticRoutes = ['/', '/about', '/services', '/portfolio', '/industries', '/careers',
  '/courses', '/contact', '/leads', '/leads/post', '/privacy-policy', '/terms-of-service'];
const serviceRoutes = ['digital-marketing', 'performance-marketing', 'web-development', 'brand-identity',
  'social-media', 'photography', 'videography', 'influencer-marketing'].map((s) => `/services/${s}`);
const locationRoutes = keys(load('locations.json', {})).map((k) => `/locations/${k}`);
const industryRoutes = keys(load('industries.json', {})).map((k) => `/industries/${k}`);
const authorRoutes = load('authors.json', []).map((a) => `/authors/${a.id}`);
const enrollRoutes = ['/enroll/digital-marketing', '/enroll/full-stack-dev'];
const blogRoutes = blogs.map((b) => `/blog/${b.slug || b.id}`);

// Rendered from the React app. Blog pages have their own template in prerender-seo.cjs.
const appRoutes = [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...industryRoutes, ...authorRoutes, ...enrollRoutes];

module.exports = {
  BASE_URL: 'https://www.brandmarksolutions.site',
  blogs,
  appRoutes,
  blogRoutes,
  pageRoutes: [...appRoutes, '/blog'],
  allRoutes: [...appRoutes, '/blog', ...blogRoutes]
};
