## Enable CMS login (Decap + GitHub on Vercel)

Use this checklist when it's time to turn the admin on for Jiyung.

- [ ] Set a stable domain in Vercel for this project
  - Example: `jiyung-portfolio.vercel.app`
  - Vercel → Project → Settings → Domains → Add / set Primary

- [ ] Create a GitHub OAuth App (owner must match the repo owner)
  - GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
  - Application name: Jiyung Portfolio CMS
  - Homepage URL: `https://<PRIMARY_VERCEL_DOMAIN>`
  - Authorization callback URL: `https://<PRIMARY_VERCEL_DOMAIN>/api/callback`
  - Copy: Client ID, then Generate Client Secret

- [ ] Add Vercel environment variables (Project → Settings → Environment Variables)
  - `GITHUB_CLIENT_ID = <CLIENT_ID>`
  - `GITHUB_CLIENT_SECRET = <CLIENT_SECRET>`
  - (Optional) `OAUTH_ALLOWED_ORG` if restricting to a GitHub org

- [ ] Add GitHub OAuth serverless endpoints
  - Create API routes:
    - `api/auth.ts` → starts the GitHub OAuth flow
    - `api/callback.ts` → exchanges code for token and returns Decap-compatible response
  - Target endpoints:
    - `POST /api/auth`  and  `GET /api/callback`

- [ ] Switch the CMS backend to GitHub
  - In `admin/index.html` (or `admin/config.yml` if you revert to file-based config):
    - `backend.name = 'github'`
    - `backend.repo = 'Tinyblocks/Jiyungportfolio'`
    - `backend.branch = 'main'`
    - `backend.base_url = 'https://<PRIMARY_VERCEL_DOMAIN>'`
    - `backend.auth_endpoint = '/api/auth'`
  - Keep Uploadcare (or replace) for multi-upload media library

- [ ] Redeploy on Vercel (Production)
  - Verify: `/admin` loads, GitHub login completes, Projects are editable

- [ ] Housekeeping
  - Do NOT commit secrets
  - `.env*` is already gitignored
  - If you alias a custom domain, update the OAuth callback URL accordingly
