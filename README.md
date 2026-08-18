# VectorSpace — internalize *n* dimensions

An interactive, self‑contained web course that teaches **vector spaces** from a
single number on a line all the way to **infinite dimensions** — intuition first.
You **drag, predict, and watch** across 22 short chapters until a 900‑dimensional
space feels as ordinary as a shopping list.

**▶ Live:** <https://1ay1.github.io/vector-space-interactive/>

No build step. No dependencies (MathJax loads from a CDN for the formulas).
No signup. Open `index.html` and it runs.

---

## The course — 22 chapters across 5 parts

**Part 0 · Orientation** — the one idea; the four faces of a vector (list · arrow · knobs · point), all synced live.

**Part I · Build it** — 1D number line · 2D plane & arrow · a **rotatable 3D** vector · adding (line‑by‑line + tip‑to‑tail) · scaling (a live 121‑D photo).

**Part II · Structure** — linear combinations · **span** (watch it flip line ↔ plane) · independence & redundancy · basis & coordinates (change your rulers).

**Part III · Geometry** — length & distance (live Pythagoras) · dot product & angle (the sign‑flip) · projection (a vector's shadow) · orthogonality.

**Part IV · The leap** — operate a **6‑D** vector you can't picture · a dimension‑climbing ladder · **high‑D weirdness** (near‑orthogonality sampler) · **∞ dimensions** (functions as vectors).

**Part V · Payoff** — a live **similarity search** · the axioms as promises · a glossary + self‑test capstone.

Every lab uses **predict → do → get it**: a prompt makes you guess, you
interact, and a live "narrator" translates your action into vector terms. Most
chapters end with a quiz and a summary. Progress is saved in `localStorage`.

## Run locally

```sh
open index.html          # macOS
# or serve it:
python3 -m http.server   # then visit http://localhost:8000
```

Works fully offline: if the MathJax CDN is unreachable, formulas fall back to
readable Unicode (`‖v‖`, `√(x)`, `λ`, …) so nothing shows raw LaTeX.

## Tests

Open `test.html` in a browser (or run it headless). It exercises every
interactive widget with simulated input and checks that all 18 practice
generators accept the right answer and reject wrong ones — **59 checks**. Green
“OK” = pass.

## Project layout

```
index.html    shell: sidebar (parts + chapters), main, landing, MathJax
styles.css    the warm design system
engine.js     reusable widgets: knobs, 2D/3D boards, span-fill, four-rep,
              projection, dimension ladder, orthogonality sampler, quiz…
chapters.js   the 22-chapter course content
app.js        navigation, progress, routing, math typesetting
```

## License

MIT — see [LICENSE](LICENSE).
