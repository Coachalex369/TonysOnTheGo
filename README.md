# Tony's On the Go

Static marketing website for **Tony's On the Go**, the catering arm of Tony's
Mountain Pizza, serving Westcliffe, Silver Cliff, and the surrounding area.

Plain HTML/CSS/JS — no framework, no bundler, no build step.

## Structure

```
index.html    Single scrolling homepage (nav, hero, catering info, menu,
              event room + packages/policies, about, gallery, quote form,
              contact, footer). The menu is plain HTML — edit it directly.
styles.css    All site styling
script.js     Nav toggle, gallery lightbox, quote-form validation +
              mailto hand-off
favicon.svg   Original placeholder monogram (no longer referenced; the site
              favicon is now images/tonys-mountain-pizza-icon.png)
images/       Catering photos (hero, about, gallery) plus the official
              Tony's Mountain Pizza logo (tonys-mountain-pizza-logo.png) and
              a square, transparent-padded copy of it for the favicon
```

## Menu structure

- **Menu** (`#menu`) — Tony's On the Go catering choices from Dawn: Featured
  Italian Dishes, Plated Options, Buffet-Style Options. No prices have been
  confirmed for these, so each shows "Contact us for pricing".
- **Event Room** (`#event-room`) — Tony's Mountain Pizza's separate, priced
  event-room packages, Desserts & Add-Ons, and Event Policies & Booking.

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
