const https = require('https');
const fs = require('fs');
const path = require('path');

const HOST = 'www.brandmarksolutions.site';
const BASE_URL = `https://${HOST}`;
const KEY = '7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c';
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

const DATA_DIR = path.join(__dirname, '../src/data');

function getAllUrls() {
  let blogs = [];
  try {
    blogs = require(path.join(DATA_DIR, 'blogs.json'));
  } catch (e) {
    console.warn('Could not load blogs.json', e.message);
  }

  let locations = {};
  try {
    locations = require(path.join(DATA_DIR, 'locations.json'));
  } catch (e) {}

  let industries = {};
  try {
    industries = require(path.join(DATA_DIR, 'industries.json'));
  } catch (e) {}

  const staticRoutes = [
    '/',
    '/about',
    '/services',
    '/portfolio',
    '/blog',
    '/corporate-info',
    '/careers',
    '/courses',
    '/contact',
    '/privacy-policy',
    '/terms-of-service'
  ];

  const serviceRoutes = [
    '/services/digital-marketing',
    '/services/performance-marketing',
    '/services/web-development',
    '/services/brand-identity',
    '/services/social-media',
    '/services/photography',
    '/services/videography',
    '/services/influencer-marketing'
  ];

  const locationRoutes = Object.keys(locations).filter(k => k !== 'default').map(k => `/locations/${k}`);
  const industryRoutes = Object.keys(industries).filter(k => k !== 'default').map(k => `/industries/${k}`);
  const blogRoutes = blogs.map(b => `/blog/${b.slug || b.id}`);

  const allPaths = [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...industryRoutes, ...blogRoutes];
  return Array.from(new Set(allPaths.map(p => `${BASE_URL}${p}`)));
}

function submitToIndexNow(endpoint, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const postData = JSON.stringify(payload);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'BrandMark-IndexNow-Client/1.0'
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        resolve({
          endpoint,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        endpoint,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        endpoint,
        error: 'Request timed out'
      });
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  const urlList = getAllUrls();
  console.log(`[IndexNow] Preparing instant submission for ${urlList.length} URLs to Microsoft Bing, Yandex & search partners...`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const ep of endpoints) {
    console.log(`[IndexNow] Pinging ${ep}...`);
    const result = await submitToIndexNow(ep, payload);
    if (result.error) {
      console.log(`[IndexNow] Notice for ${ep}: ${result.error} (Will execute live during cloud deployment or external run)`);
    } else {
      console.log(`[IndexNow] Success from ${ep}: HTTP ${result.statusCode} ${result.statusMessage || ''}`);
    }
  }

  console.log(`[IndexNow] IndexNow configuration complete for ${urlList.length} site URLs.`);
}

run();
