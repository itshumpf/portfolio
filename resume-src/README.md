# resume-src — source of truth for `public/resume.pdf`

`public/resume.pdf` used to be a binary with **no source file in this repo**.
That is how the wrong RF-fingerprinting figures survived on the live site after
they had already been corrected everywhere else. This folder fixes that.

## Files

| File | What it is |
|---|---|
| `Braeden_Keena_Resume_deployed_source.docx` | Editable source for the **currently deployed** resume. Edit this. |
| `build_resume.py` | Generates the .docx from plain text. Layout constants are tuned to match the original deployed PDF to <0.5pt. |
| `resume-2026-07-25-deployed-original.pdf` | The pre-correction deployed PDF (2026-07-25). Kept for reference. **Deliberately not in `public/`** — anything in `public/` is published, and this copy still contains the wrong figures. |

## Rebuild

```bash
python3 resume-src/build_resume.py resume-src/Braeden_Keena_Resume_deployed_source.docx
soffice --headless --convert-to pdf --outdir public \
        resume-src/Braeden_Keena_Resume_deployed_source.docx
mv public/Braeden_Keena_Resume_deployed_source.pdf public/resume.pdf
```

Requires LibreOffice and the Carlito font (`fonts-crosextra-carlito`) — the same
toolchain that produced the original PDF, which is why the output is
pixel-comparable.

## After any rebuild, verify

```bash
qpdf --check public/resume.pdf
pdftotext -layout public/resume.pdf - | less   # read every figure back out
```

Extracting the text back out is not optional. A previous resume-adjacent build
rendered `non-zero` as `nonnzero` because Helvetica lacks non-breaking hyphens,
and nobody caught it until the text was extracted. **Use plain ASCII hyphens
(`-`, U+002D) only.** The only non-ASCII characters this document should ever
contain are: `· σ – — ’ “ ” • →`

## Verified figures (CSI / RF-fingerprinting)

Do not restate these from memory. These are the numbers that survived
independent reproduction:

- Device-ID accuracy: **99.7% across 7,497 windows** (single receiver,
  chronological holdout); **95.7% across 14,234 windows** across two receivers.
  The two-receiver run splits by receiver — **it is not chronological**, so
  never describe the combined run that way.
- Cross-manufacturer separation: **12.7σ and 10.4σ, 6 of 6**.
  Not 11–15σ. Not 7/7.
- Analysed set: **2.36M frames**. Not 2.8 million.
- The same-model ~77% figure is a single-session best case whose class count
  was never recorded. **Do not use it anywhere.**

## Unresolved

The live site carries a "1B+ frames captured to date" style claim; the corrected
case study says roughly 15 million. That contradiction is **not settled**. It
does not appear in the resume. Settle it before it is added to one.
