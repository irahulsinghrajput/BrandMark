const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream'
    ]
  });

  const page = await browser.newPage();
  page.on('console', (msg) => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', (err) => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (/daily\.co|vapi\.ai/i.test(url)) {
      console.log('FAILED REQUEST:', url, request.failure()?.errorText || 'unknown');
    }
  });

  console.log('Navigating to local app...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  await new Promise((resolve) => setTimeout(resolve, 2500));

  const hasTalkButton = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).some((el) =>
      (el.textContent || '').toLowerCase().includes('talk to mark')
    );
  });

  console.log('Talk button present:', hasTalkButton);

  if (hasTalkButton) {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const talkBtn = buttons.find((el) => (el.textContent || '').toLowerCase().includes('talk to mark'));
      if (talkBtn) talkBtn.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('Modal state after click:');
    console.log(await page.evaluate(() => document.body.innerText.slice(0, 1200)));
  }

  console.log('Finished Vapi smoke test.');
  await browser.close();
})();
