const https = require('https');

const HOST = 'www.brandmarksolutions.site';
const BASE_URL = `https://${HOST}`;
const KEY = '7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c';
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

const { allRoutes } = require('./routes.cjs');
const getAllUrls = () => allRoutes.map((p) => `${BASE_URL}${p}`);

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
  // Only real production deploys notify search engines (not local or preview builds).
  // Manual run: npm run indexnow -- --force
  if (process.env.VERCEL_ENV !== 'production' && !process.argv.includes('--force')) {
    console.log('[IndexNow] Skipped: not a production deploy.');
    return;
  }
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
    } else if (result.statusCode !== 200 && result.statusCode !== 202) {
      console.warn(`[IndexNow] REJECTED by ${ep}: HTTP ${result.statusCode} ${String(result.body || '').slice(0, 200)}`);
    } else {
      console.log(`[IndexNow] Accepted by ${ep}: HTTP ${result.statusCode} ${result.statusMessage || ''}`);
    }
  }

  console.log(`[IndexNow] IndexNow configuration complete for ${urlList.length} site URLs.`);
}

run();

