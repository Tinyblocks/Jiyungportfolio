module.exports = async (req, res) => {
  try {
    const clientId = (process.env.GITHUB_CLIENT_ID || '').trim();
    const clientSecret = (process.env.GITHUB_CLIENT_SECRET || '').trim();
    if (!clientId || !clientSecret) {
      res.statusCode = 500;
      res.setHeader('content-type', 'text/plain');
      return res.end('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
    }

    const url = new URL(req.url, 'https://placeholder');
    const code = url.searchParams.get('code');
    if (!code) {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/plain');
      return res.end('Missing code');
    }

    const ghResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });
    const json = await ghResp.json();
    if (!ghResp.ok || !json.access_token) {
      res.statusCode = ghResp.status || 500;
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify(json));
    }

    const token = json.access_token;
    const html = `<!doctype html><html><body>
      <script>
        (function(){
          var msg = 'authorization:github:success:' + JSON.stringify({token: ${JSON.stringify(token)}});
          if (window.opener) {
            window.opener.postMessage(msg, '*');
            window.close();
          }
          // Fallback: redirect back to admin in case popup cannot close or opened in same tab
          setTimeout(function(){ try{ window.location.href = '/admin/'; }catch(e){} }, 250);
        })();
      </script>
    </body></html>`;
    res.statusCode = 200;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end(html);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end('OAuth callback error');
  }
};


