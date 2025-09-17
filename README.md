Jiyung Lee — Portfolio (11ty + Decap CMS)
=========================================

Local development
-----------------

Prereqs: Node 18+

```bash
npm install
npm run dev
```

- Site runs at http://localhost:8080
- CMS at http://localhost:8080/admin (no auth locally)

Build
-----

```bash
npm run build
```
Outputs to `_site/`.

Content model
-------------

- Markdown files live in `src/projects/` with front matter:

```yaml
---
layout: layouts/project.njk
permalink: /projects/<slug>/index.html
title: <Title>
year: 2025
category: personal|client|exhibition
cover: /images/<path>.png
images:
  - /images/<path1>.png
  - /images/<path2>.png
---
Project description here.
```

Admin (Decap CMS)
-----------------

- Open `/admin` to add/edit Projects
- Drag & drop images; they are saved under `images/uploads/` by default
- Publishing creates/updates files in `src/projects/`

Deployment (Vercel + GitHub OAuth)
----------------------------------

1. Push to GitHub
2. Create a GitHub OAuth App with callback `https://YOUR_DOMAIN/api/auth/callback`
3. On Vercel, set environment variables:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
4. Deploy to Vercel. Build command: `npm run build`, Output directory: `_site`
5. Visit `/admin` to sign in via GitHub

Notes
-----

- Existing static pages (`about.html`) are still served as-is.
- Homepage tiles are generated from content; filters remain on the client.
- You can keep images in current folders; CMS uploads go to `images/uploads/`.

Admin notes
-----------

- Admin config embeds backend `{ base_url: '/api', auth_endpoint: 'auth' }`
- Serverless endpoints:
  - `GET /api/auth` → redirects to GitHub OAuth
  - `GET /api/auth/callback` → exchanges code and stores token for Decap

