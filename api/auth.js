module.exports = async (req, res) => {
  try {
    const clientId = (process.env.GITHUB_CLIENT_ID || "").trim();
    if (!clientId) {
      res.statusCode = 500;
      res.setHeader('content-type', 'text/plain');
      return res.end('Missing GITHUB_CLIENT_ID env var');
    }

    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
    const baseUrl = `${proto}://${host}`;
    const redirectUri = `${baseUrl}/api/auth/callback`;

    const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
    authorizeUrl.searchParams.set('client_id', clientId);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('scope', 'repo,user:email');
    authorizeUrl.searchParams.set('allow_signup', 'true');

    res.statusCode = 302;
    res.setHeader('Location', authorizeUrl.toString());
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end('Auth redirect error');
  }
};


