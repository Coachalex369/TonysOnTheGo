# Tony's On the Go

Static marketing website for **Tony's On the Go**, the catering arm of Tony's
Mountain Pizza, serving Westcliffe, Silver Cliff, and the surrounding area.

Plain HTML/CSS/JS — no framework, no bundler, no build step.

## Structure

```
index.html    Single scrolling homepage (nav, hero, catering info, menu,
              event room, about, gallery, quote form, contact, footer)
styles.css    All site styling
script.js     Nav toggle, gallery lightbox, menu.json rendering,
              quote-form validation + mailto hand-off
menu.json     Menu data. Currently a "coming soon" placeholder —
              script.js is written to render real categories/items
              here once the menu is finalized, with no other changes needed
favicon.svg   Site favicon
images/       Catering photos used across the hero, about, and gallery sections
```

## Previewing locally

From this folder, run either:

```bash
npx serve .
```

or

```bash
python -m http.server 8000
```

Then open the printed local URL in a browser.

## Deploying (Render)

1. Render dashboard → **New → Static Site**
2. Connect the `TonysOnTheGo` GitHub repository
3. **Branch:** `main`
4. **Root directory:** (leave blank)
5. **Build command:** (leave blank)
6. **Publish directory:** `.`
7. **Auto-deploy:** On Commit

Render will provide a `*.onrender.com` address immediately; a custom domain
can be connected to it later from the same site's settings.

## Quote form

The quote form validates in the browser and currently hands off to a
`mailto:Tonysonthego24@gmail.com` link pre-filled with a subject and a
summary of everything entered — no backend, no data is sent anywhere
automatically, and no payment is ever collected through the form.

To upgrade this to a real background submission later (no page reload,
no email client required), the simplest option is a
[Formspree](https://formspree.io) form endpoint: create a form there, drop
its endpoint URL into `script.js`'s submit handler as a `fetch()` POST, and
keep the current mailto link as a fallback. No Formspree endpoint exists yet
— none was invented for this build.
