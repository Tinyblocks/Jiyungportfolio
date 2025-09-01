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

Deployment (Netlify suggested)
------------------------------

1. Push to GitHub
2. Create a new Netlify site from the repo
3. Build command: `npm run build`  Publish directory: `_site`
4. Enable Identity + Git Gateway for CMS logins
5. Invite Jiyung via Netlify Identity. She will log in at `/admin`.

Notes
-----

- Existing static pages (`about.html`) are still served as-is.
- Homepage tiles are generated from content; filters remain on the client.
- You can keep images in current folders; CMS uploads go to `images/uploads/`.

