# Portfolio — Geoffrey Allen De Rojas

Personal portfolio site. Plain HTML, CSS and JavaScript — no framework, no build step.

**Live:** _(add your URL once deployed)_

## Structure

```
index.html                 the whole page
assets/css/style.css       all styling, light + dark themes
assets/js/main.js          theme toggle, lightbox, gallery filters, featured artwork
assets/img/media/          logos, certificate scans, design work, avatar
assets/img/favicon.png     tab icon
assets/img/og-card.png     link preview image
```

## Running it locally

No build step. Either open `index.html` in a browser, or serve it:

```bash
python -m http.server 5500
# then open http://localhost:5500
```

A server is better than opening the file directly — `file://` can behave
differently with fonts and relative paths.

## Deploying

Static files, so anywhere works. Vercel and Netlify both deploy on push:

1. Push this repo to GitHub
2. Import it at vercel.com or netlify.com
3. Framework preset: **None / Other**. Build command: leave empty. Output: `.`

## Still to do

- [ ] Replace the intro paragraph with your own wording, then remove the preview banner
- [ ] Pick one name — the tab title, the heading and the nav mark currently differ
- [ ] Footer tagline is a leftover from the removed personal section
