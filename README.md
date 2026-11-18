# Dwayne Pugh — Operational Profile v2.0

Personal brand site built with an SRE dashboard aesthetic.

---

## Project Structure

```
dwayne.pugh/
├── index.html               # Single-page profile — all sections
├── resume.md                # THE résumé. Edit this; everything else is generated from it
├── resume.html              # Styled résumé page; renders resume.md in the browser
├── resume-print.html        # Plain layout used only to print the PDF (not linked)
├── assets/
│   └── dwayne-pugh-resume.pdf   # Built from resume.md; the page's download button
├── scripts/
│   └── build-resume-pdf.sh  # resume.md → assets/dwayne-pugh-resume.pdf
├── css/
│   ├── tokens.css           # Design tokens (colors, type, spacing) — edit here first
│   └── main.css             # Component & layout styles
├── js/
│   ├── main.js              # Nav, clock, uptime, scroll reveal
│   └── resume.js            # Markdown → résumé renderer (site and print modes)
└── .nojekyll                # Turns off Jekyll so GitHub Pages serves resume.md as-is
```

---

## Design Decisions

### Palette
Draws quietly from the South African flag — intentional, not overt.

| Token | Hex | Role |
|---|---|---|
| Gold | `#C8860A` | Primary accent, headers, CTAs |
| Green | `#2D6A4F` | Hover states, interactive elements |
| Red | `#8B2020` | Visited links, secondary accents |
| Near-black | `#0A0A0A` | Base background |

### Typography
- **JetBrains Mono** — terminal/SRE feel for labels, status, eyebrows
- **Inter** — clean body reading for prose and headings

### Signature element
The hero grid overlay — horizontal and vertical hairlines at 48px intervals,
masked to fade at top and bottom. References real SRE dashboards and monitoring
consoles. Costs nothing in performance (pure CSS background-image).

---

## Updating the résumé

1. Edit `resume.md`.
2. Run `scripts/build-resume-pdf.sh` (needs Chrome or Chromium and Python 3).
3. Commit **both** `resume.md` and `assets/dwayne-pugh-resume.pdf`.

The site page picks up `resume.md` on the next deploy. The PDF only changes
when you run the script, so skipping step 2 leaves a stale download.

Preview the page locally with `python3 -m http.server` and open
http://localhost:8000/resume.html (opening the file directly won't load `resume.md`).

### Conventions `resume.md` must follow

| Write | Renders as |
|---|---|
| `# Name`, then a title line, then a contact line split by ` · ` | Page header |
| `## Section` | Section |
| `### Employer — City` (no ` · `) | Employer heading that groups the roles under it |
| `### or #### Role · Dates` (has ` · `) | One job card; the text after the last ` · ` is the date |
| `*Italic line*` right under a role | The org/clients line on the card |
| Skills: `- **Label:** a, b, c` | One skill group of tags (use `;` between tags if a tag has commas) |
| Education: `### Degree — School · Year` | Degree card |
| Education: `**Certifications:** a · b · c` | Cert chips |

The phone number is left out on purpose: this file and the PDF are public.
Use the private PDF (with phone) for applications that need it.

### Why it works this way

- **Decision:** one Markdown file is the source for both the web page and the PDF.
  The browser renders it with a ~250-line vanilla script (`js/resume.js`); the PDF
  is the same renderer in a plain print layout, printed by headless Chrome.
- **Why:** before this, the résumé was hand-copied into HTML and drifted from the
  PDF, and printing the styled page produced 7 pages. Now there is one place to
  edit and the PDF comes out at 3 pages.
- **Alternatives considered:**
  - *Pandoc* (md → PDF/HTML): mature, but a new install, and its output would not
    share the site's markup or styles.
  - *GitHub Action that builds the PDF on push*: removes the manual step, but the
    Action would have to commit back to the repo or publish elsewhere; more moving
    parts than one script.
  - *A Markdown library from a CDN* (marked, markdown-it): handles more syntax, but
    adds a third-party dependency and still needs custom code to turn headings into
    job cards and skill tags.
  - *Jekyll* (already on Pages): could render the Markdown server-side, but the
    site is plain HTML and Jekyll's layout system isn't otherwise used.
- **Revisit when:** the PDF goes stale more than once (add a CI check or an Action
  that builds it), `resume.md` needs Markdown the renderer doesn't support, or a
  second résumé variant (e.g. instructor-focused) is needed.

---

## Deployment to GitHub Pages

This repo is designed to drop directly into your existing GitHub Pages setup.

### Option A — Replace existing repo files

```bash
# In your local clone of dpugh143.github.io/demo-profile
cp -r /path/to/dpugh-profile/* .

# Rebuild the résumé PDF if resume.md changed
scripts/build-resume-pdf.sh

git add .
git commit -m "feat: operational profile v2.0 — SRE dashboard aesthetic"
git push origin main
```

### Option B — Fresh repo

```bash
git init dpugh-profile
cd dpugh-profile
# copy files in
git add .
git commit -m "feat: initial operational profile"
git remote add origin https://github.com/dpugh143/demo-profile.git
git push -u origin main
```

Then enable GitHub Pages in repo Settings → Pages → Branch: main / root.

---

## Customization Guide

### Update launch date (uptime counter)
In `js/main.js`, line ~30:
```js
const LAUNCH_DATE = new Date('2026-01-01T00:00:00Z');
```
Change to your actual relaunch date.

### Add a testimonial
In `index.html`, find `<!-- Testimonials placeholder -->` and replace
the `.testimonial-card--empty` div with:

```html
<div class="testimonial-card">
  <p class="testimonial-card__quote">
    "Dwayne didn't just teach the tools — he taught me how to think about the system."
  </p>
  <p class="testimonial-card__source mono">// Name · Role · Company · 2026</p>
</div>
```

### Add a color or token
All colors live in `css/tokens.css`. Add new variables there and reference
them in `main.css`. Never hardcode hex values in component styles.

### Add a new section
1. Add a `<section>` block in `index.html` with a unique `id`
2. Add a matching `<li><a href="#your-id">` in the nav
3. Add styles to `main.css`

---

## Performance Notes

- Zero JavaScript dependencies — vanilla JS only (including the résumé renderer)
- Fonts loaded via Google Fonts with `display=swap` for performance
- Scroll reveal respects `prefers-reduced-motion`
- IntersectionObserver used instead of scroll listeners
- Intervals cleaned up on page hide to prevent background CPU use

---

## Future Iterations (backlog)

- [ ] Add profile photo to hero or about section
- [ ] Wire up a real contact form (Formspree or similar — no backend needed)
- [ ] Populate testimonials after first cohort
- [ ] Add LinkedIn recommendations embed or screenshot cards
- [ ] Create `sankofa-systems/` subdirectory for STI brand site
- [ ] Add Open Graph image (1200×630 screenshot of hero section)

---

*Built for Dwayne Pugh | Sankofa Systems | Ubuntu Equity Group, LLC*
