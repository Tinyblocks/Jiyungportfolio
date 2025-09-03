const https = require('https');

function postForm(url, data) {
  return new Promise((resolve, reject) => {
    const payload = new URLSearchParams(data).toString();
    const u = new URL(url);
    const req = https.request({
      method: 'POST',
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
        'content-length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

module.exports = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      res.statusCode = 500;
      res.setHeader('content-type', 'text/plain');
      return res.end('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
    }

    const code = new URL(req.url, 'https://dummy').searchParams.get('code');
    if (!code) {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/plain');
      return res.end('Missing code');
    }

    const tokenResp = await postForm('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code
    });
    res.statusCode = tokenResp.status || 200;
    res.setHeader('content-type', 'application/json');
    res.end(tokenResp.body);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end('OAuth callback error');
  }
};


