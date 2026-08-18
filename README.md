# VectorSpace — learn vector spaces by touching them

An interactive, self‑contained web course that teaches **vector spaces** from
zero to deep — intuition first. You **drag, predict, and watch** until a
900‑dimensional space feels as ordinary as a shopping list.

**▶ Live:** <https://1ay1.github.io/vector-space-interactive/>

No build step. No dependencies. No signup. Open `index.html` and it runs.

---

## What's inside

Twelve short interactive chapters, each built around **predict → do → get it**:

| # | Chapter | You interact with |
|---|---------|-------------------|
| 1 | What a vector actually is | RGB knobs → a live colour swatch |
| 2 | Vectors as arrows | a draggable arrow on a grid |
| 3 | Adding vectors | animated line‑by‑line list add + tip‑to‑tail arrows |
| 4 | Scaling vectors | a brightness slider on a 121‑D pixel photo |
| 5 | Combinations & span | tune two dials to reach a target — feel the whole plane |
| 6 | Basis & coordinates | one point, two sets of rulers |
| 7 | Length & distance | live Pythagoras |
| 8 | Dot product & angle | rotate an arrow, watch the sign flip |
| 9 | Linear independence | span snaps between a line and the whole plane |
| 10 | The leap past 3D | operate a real 6‑dimensional vector |
| 11 | Where your 3D gut lies | near‑orthogonality histogram (concentration of measure) |
| 12 | Where this lives | a live cosine‑similarity search |

Every lab has a live "narrator" that translates your actions into vector terms,
plus quizzes with real feedback. Progress is saved in `localStorage`.

## Run locally

Just open the file:

```sh
open index.html          # macOS
# or serve it:
python3 -m http.server   # then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Push this repo to GitHub (done).
2. **Settings → Pages → Source: Deploy from a branch → `main` / root.**
3. Your site goes live at `https://<user>.github.io/<repo>/`.

## Project layout

```
index.html    shell: sidebar, main, landing
styles.css    the warm design system
engine.js     reusable interactive widgets (knobs, vector board, quiz, …)
chapters.js   the 12‑chapter course content
app.js        navigation, routing, progress
```

## License

MIT — see [LICENSE](LICENSE).
