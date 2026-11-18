# Dwayne Pugh — Operational Profile v2.0

Personal brand site built with an SRE dashboard aesthetic.

---

## Project Structure

```
dwayne.pugh/
├── index.html               # Single-page profile — all sections
├── resume.md                # Résumé text for the web page
├── resume.html              # Styled résumé page; renders resume.md in the browser
├── assets/
│   └── dwayne-pugh-resume.pdf   # Public PDF (no phone); the page's download button
├── scripts/
│   └── make-public-resume-pdf.py  # private PDF → assets/dwayne-pugh-resume.pdf, phone removed
├── css/
│   ├── tokens.css           # Design tokens (colors, type, spacing) — edit here first
│   └── main.css             # Component & layout styles
├── js/
│   ├── main.js              # Nav, clock, uptime, scroll reveal
│   └── resume.js            # Markdown → résumé page renderer
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

The résumé has two outputs, made two ways:

| Output | Source | How it updates |
|---|---|---|
| Web page (`resume.html`) | `resume.md` | Edit `resume.md`; the page renders it on load |
| Download (`assets/dwayne-pugh-resume.pdf`) | The Claude Docs résumé, exported to PDF | Run the script below on the export |

When the résumé changes:

1. Edit the Claude Docs résumé and export it to PDF into `~/Desktop/PughBusiness/resumes/`.
   That private copy keeps the phone number.
2. Make the public copy (phone number removed):
   ```bash
   python3 -m venv .venv && .venv/bin/pip install pymupdf      # once
   .venv/bin/python scripts/make-public-resume-pdf.py ~/Desktop/PughBusiness/resumes/<file>.pdf
   ```
   The script refuses to write a file that still contains a phone number.
3. Copy the same changes into `resume.md` (no phone number) so the web page matches.
4. Commit `resume.md` and `assets/dwayne-pugh-resume.pdf` together.

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

The phone number stays out of this repo entirely (it is public): not in `resume.md`,
not in the PDF, and not in the script, which finds the number by pattern.

### Why it works this way

- **Decision:** the web page renders `resume.md` with a ~200-line vanilla script
  (`js/resume.js`), keeping the site's card-and-tag look. The download is the
  Claude Docs export with the phone number removed, so the PDF looks like a
  document, not like the website.
- **History:** the first version also generated the PDF from `resume.md` (headless
  Chrome printing a plain layout). It worked, but the result looked worse than the
  Claude Docs export, which is the version that goes to employers. That step was dropped.
- **Trade-off:** the résumé text now lives in two places (the Claude Doc and
  `resume.md`), so they can drift. Step 3 above is the manual sync.
- **Alternatives considered:**
  - *Generate the PDF from `resume.md`* (headless Chrome or Pandoc): one source, but
    matching the Claude Docs typography (Anthropic Serif/Sans) isn't possible locally.
  - *Redact the phone and leave a gap*: simpler, but leaves a visible hole in the contact line.
  - *A Markdown library from a CDN* (marked, markdown-it): adds a dependency and still
    needs custom code for job cards and skill tags.
  - *Jekyll* (already on Pages): could render the Markdown server-side, but the site
    is plain HTML and doesn't otherwise use Jekyll.
- **Revisit when:** the page and the PDF drift apart more than once (generate
  `resume.md` from the Docs Markdown export instead of hand-copying), or the
  Claude Docs layout changes and the contact line no longer matches what the
  script expects.

---

## Deployment to GitHub Pages

This repo is designed to drop directly into your existing GitHub Pages setup.

### Option A — Replace existing repo files

```bash
# In your local clone of dpugh143.github.io/demo-profile
cp -r /path/to/dpugh-profile/* .

# Refresh the public résumé PDF if the résumé changed (see "Updating the résumé")
.venv/bin/python scripts/make-public-resume-pdf.py ~/Desktop/PughBusiness/resumes/<file>.pdf

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
