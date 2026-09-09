const https = require('https');

https.get('https://www.brandmarksolutions.site/', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
      const jsUrl = 'https://www.brandmarksolutions.site' + match[1];
      console.log('JS URL:', jsUrl);
      https.get(jsUrl, (jsRes) => {
        let js = '';
        jsRes.on('data', d => js += d);
        jsRes.on('end', () => {
          console.log('Contains VAPI ID:', js.includes('877a4d12-a5f3-45bc-a660-85a7e7c92c19'));
          console.log('Contains VAPI Key:', js.includes('28589150-3565-41df-b341-660e7b6cca0e'));
        });
      });
    } else {
      console.log('No JS bundle found');
    }
  });
});
