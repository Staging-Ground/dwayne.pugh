"""Make the public résumé PDF: a copy of the private PDF with the phone number removed.

Usage (from the repo root):
    python3 -m venv .venv && .venv/bin/pip install pymupdf   # once
    .venv/bin/python scripts/make-public-resume-pdf.py ~/Desktop/PughBusiness/resumes/<private>.pdf

Writes assets/dwayne-pugh-resume.pdf (or the path given as a second argument).

How: the contact line on page 1 is redacted, then redrawn in two clipped pieces
(the text before the phone number, and the text after it shifted left to close
the gap). Each piece is pasted from a one-page copy that keeps only that piece,
so no hidden copy of the number or of the rest of the page rides along. Reusing
the drawn glyphs keeps the exact letterforms; retyping the text with the PDF's
embedded subset font picks wrong glyphs for some letters ("a", "g").

The number is matched by pattern, so it never has to be written in this public repo.
"""
import re
import sys
from pathlib import Path

import pymupdf

PHONE_RE = re.compile(r"\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\s*·\s*")


def piece_source(src_path, keep):
    """One-page PDF holding only what lies inside `keep` on page 1."""
    src = pymupdf.open(src_path)
    src.select([0])
    sp = src[0]
    W, H = sp.rect.width, sp.rect.height
    for r in (pymupdf.Rect(0, 0, W, keep.y0), pymupdf.Rect(0, keep.y1, W, H),
              pymupdf.Rect(0, keep.y0, keep.x0, keep.y1), pymupdf.Rect(keep.x1, keep.y0, W, keep.y1)):
        if not r.is_empty:
            sp.add_redact_annot(r)
    sp.apply_redactions()
    for link in list(sp.get_links()):
        sp.delete_link(link)
    return pymupdf.open("pdf", src.tobytes(garbage=4, deflate=True))


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src_path = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else str(Path(__file__).resolve().parent.parent / "assets/dwayne-pugh-resume.pdf")

    d = pymupdf.open(src_path)
    p = d[0]

    found = None
    for b in p.get_text("rawdict")["blocks"]:
        for l in b.get("lines", []):
            for s in l["spans"]:
                txt = "".join(ch["c"] for ch in s["chars"])
                m = PHONE_RE.search(txt)
                if m:
                    found = (s, m)
    if not found:
        sys.exit("No phone number found on page 1; nothing to remove. Check the input PDF.")
    s, m = found
    chars = s["chars"]
    y0, y1 = s["bbox"][1] - 2, s["bbox"][3] + 2
    x_start, x_end = s["bbox"][0] - 1, s["bbox"][2] + 1
    x_phone = chars[m.start()]["bbox"][0]
    x_rest = chars[m.end()]["bbox"][0] if m.end() < len(chars) else x_end

    p.add_redact_annot(pymupdf.Rect(x_start, y0, x_end, y1))
    p.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE)

    def paste(clip, dx):
        if clip.is_empty:
            return
        r = pymupdf.Rect(clip.x0 - dx, clip.y0, clip.x1 - dx, clip.y1)
        p.show_pdf_page(r, piece_source(src_path, clip), 0, clip=clip)

    paste(pymupdf.Rect(x_start, y0, x_phone, y1), 0)
    paste(pymupdf.Rect(x_rest, y0, x_end, y1), x_rest - x_phone)

    d.set_metadata({**d.metadata, "title": "Dwayne Pugh — Résumé"})
    d.save(out, garbage=3, deflate=True)

    check = pymupdf.open(out)
    if any(PHONE_RE.search(pg.get_text()) for pg in check):
        Path(out).unlink()
        sys.exit("A phone number is still in the output; deleted it. Not safe to publish.")
    print(f"wrote {out} ({len(check)} pages), phone number removed")


if __name__ == "__main__":
    main()
