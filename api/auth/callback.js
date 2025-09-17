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

    // Compute redirect_uri exactly as used during authorization phase
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
    const baseUrl = `${proto}://${host}`;
    const redirectUri = `${baseUrl}/api/auth/callback`;

    const ghResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        // Include redirect_uri to match authorize request per GitHub's spec
        redirect_uri: redirectUri
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
          var tk = ${JSON.stringify(token)};
          // Persist token as a last-resort fallback
          try { localStorage.setItem('decap:github_token', tk); } catch(_) {}
          try { localStorage.setItem('decap-cms-user', JSON.stringify({ token: tk, provider: 'github', backendName: 'github' })); } catch(_) {}
          try { localStorage.setItem('netlify-cms-user', JSON.stringify({ token: tk, provider: 'github', backendName: 'github' })); } catch(_) {}
          try { localStorage.setItem('netlify-cms.user', JSON.stringify({ token: tk, provider: 'github', backendName: 'github' })); } catch(_) {}
          try { localStorage.setItem('netlify-cms-auth', tk); } catch(_) {}
          try { if (window.opener && window.opener.localStorage) { 
            window.opener.localStorage.setItem('decap-cms-user', JSON.stringify({ token: tk, provider: 'github', backendName: 'github' }));
            window.opener.localStorage.setItem('decap:github_token', tk);
            window.opener.localStorage.setItem('netlify-cms-user', JSON.stringify({ token: tk, provider: 'github', backendName: 'github' }));
          }} catch(_e) {}

          // Robust handshake with opener before sending the token
          var attempts = 0;
          function sendToken(){
            if (!window.opener || attempts > 100) return finalize();
            attempts++;
            try {
              // Multiple formats for Decap compatibility
              window.opener.postMessage('authorization:github:success:' + tk, '*');
            } catch(e) {}
            try { window.opener.postMessage('authorization:github:success:' + JSON.stringify({ token: tk }), '*'); } catch(e) {}
            try { window.opener.postMessage('authorization:github:success:' + JSON.stringify({ token: tk, provider: 'github' }), '*'); } catch(e) {}
            setTimeout(sendToken, 100);
          }
          function finalize(){
            try { window.close(); } catch(e) {}
            // Fallback redirect in case the popup didn't close
            setTimeout(function(){ try{ window.location.href = '/admin/#/collections/projects'; }catch(e){} }, 200);
          }
          try { sendToken(); } catch(_) { finalize(); }
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


