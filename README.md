# Portfolio — Geoffrey Allen De Rojas

Personal portfolio site. Plain HTML, CSS and JavaScript — no framework, no build step.

**Live:** _(add your URL once deployed)_

## Structure

```
index.html                 the whole page
assets/css/style.css       all styling, light + dark themes
assets/js/main.js          theme toggle, carousel, lightbox, gallery filters
assets/img/logos/          tech stack icons
assets/img/certs/          certificate images
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

## Visitor counter

`assets/js/main.js` has an empty constant:

```js
var VISITOR_ENDPOINT = '';
```

Point it at any endpoint returning `{"count": 123}` and the pill in the footer
appears. Leave it empty and nothing is shown — no invented numbers. On Vercel or
Netlify this is a small serverless function.

## Still to do

- [ ] Photos for the carousel in "Outside the computer"
- [ ] Real pieces in the Design section (graphic / email / UI wireframes)
- [ ] Music caption
- [ ] Replace the intro paragraph with your own wording, then remove the preview banner
- [ ] Refresh the GitHub contribution snapshot (currently 4 Sep 2026)
