const https = require('https');

function getUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'NetlifyFunction/1.0', 'Accept': 'application/javascript' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // follow redirects
        return resolve(getUrl(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error('status ' + res.statusCode));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(new Error('timeout')); });
  });
}

exports.handler = async (event) => {
  try {
    const ver = (event.queryStringParameters && event.queryStringParameters.ver) || '3.8.5';
    const upstreams = [
      `https://unpkg.com/decap-cms@${ver}/dist/decap-cms.js`,
      `https://cdn.jsdelivr.net/npm/decap-cms@${ver}/dist/decap-cms.js`
    ];

    let text = null;
    for (const url of upstreams) {
      try { text = await getUrl(url); if (text) break; } catch (_) { /* try next */ }
    }

    if (!text) {
      return { statusCode: 502, headers: { 'content-type': 'text/plain' }, body: 'Failed to fetch decap-cms bundle' };
    }

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control': 'public, max-age=3600'
      },
      body: text
    };
  } catch (e) {
    return { statusCode: 500, headers: { 'content-type': 'text/plain' }, body: 'Proxy error' };
  }
};
