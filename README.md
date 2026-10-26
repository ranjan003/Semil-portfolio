# Semil website (static multi-page build)

Open `web/index.html` through any static server (for example `python3 -m http.server -d web 8000`).
Routes map one-to-one to the requested site map:
/ , /about, /leadership, /businesses, /businesses/neutags, /businesses/food-delivery,
/businesses/matrimony, /businesses/logistics, /upcoming-projects,
/upcoming-projects/payment-gateway, /careers, /contact, plus /privacy and /terms.
Pages are .html files (for example `businesses/neutags.html`).

## Editing content
Businesses, statuses, roadmap, timeline, directors, values and openings live in one object, `SEMIL`, at the top of `web/site.js`. Change a status there and it updates on every page. Set `verified` flags to true once records are checked.

## Forms & Database (Firebase Firestore)
Forms on the site (Contact, Careers, and Semil AI chat enquiries) are connected directly to **Firebase Firestore** (`semil-protfolio` project) via `web/firebase-init.js`.
- Submissions from `contact.html` & Semil AI go to the `contact_enquiries` Firestore collection.
- Submissions from `careers.html` go to the `career_applications` Firestore collection.
- Firebase Analytics (`G-5PLC4Z066M`) is also enabled.
- Alternatively, `SEMIL_CONFIG.formEndpoint` in `web/site.js` can still be set to a custom webhook URL if desired.

## Regenerating pages
`python build.py` rewrites the HTML pages in `web/` from the templates inside it.

## Deploying to Firebase Hosting & GoDaddy Custom Domain
1. Log in to Firebase CLI: `firebase login`
2. Deploy the site: `firebase deploy`
3. Add your GoDaddy custom domain in the [Firebase Console](https://console.firebase.google.com/) under **Hosting** > **Add custom domain**.
4. In GoDaddy DNS management, add the DNS records (A records and TXT verification) provided by Firebase.

## Not yet done
A Next.js/TypeScript/React Three Fiber port. The build environment could not reach the npm registry, so it was not attempted.
The 3D hero (three.js from cdnjs) could not be rendered in testing; a static illustration shows if WebGL or the CDN is unavailable.

## v2 notes
- Pages: added company.html and play.html. Business and payment pages are rendered by site.js from `SEMIL.detail`.
- Scripts: site.js (content + UI), fx.js (motion), games.js (five brain games).
- The hero is a layered SVG scene, not WebGL; three.js is no longer used.
- Forms validate but send nothing until `SEMIL_CONFIG.formEndpoint` is set.
- Rebuild with `python3 build.py`.

## Semil AI (v2.1)
- web/ai.js + web/ai.css: floating assistant on every page. Grounded answers built from SEMIL data (keyword RAG, tools, verifier), dynamic cards/tables/timelines/diagrams, follow-up context, optional consented memory, voice in/out where the browser supports it, local quality metrics and a 11-question self-test.
- It is not an LLM and not AGI. For free-form model answers, deploy server/ask.mjs (needs ANTHROPIC_API_KEY and SEMIL_AI_MODEL on the server; untested here) and set SEMIL_CONFIG.aiEndpoint.
- Enquiries from the chat use SEMIL_CONFIG.formEndpoint, same as the forms.

## Deploying
- Serve the `web/` folder from the domain root (Netlify, Vercel static, GitHub Pages user site, Nginx, or any static host). Opening `web/index.html` directly from disk also works.
- `404.html` is shown for unknown URLs on hosts that support custom 404 pages. All internal links use `.html` paths, so no URL rewriting is needed.
- If you deploy in a sub-folder (e.g. /semil/), the 404 page's absolute links need that prefix.
