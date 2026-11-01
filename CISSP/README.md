# CISSP Field Manual

A static, no-build study site for the CISSP exam. It lives at:

**https://bonzili.me/CISSP/**

## What is here

| Path | Purpose |
| --- | --- |
| `index.html` | Application shell and script loading |
| `assets/styles.css` | Visual system: binder spine, answer sheet, question and flashcard layouts |
| `assets/data.js` | Domain notes, exam metadata, and the manager-mindset primer |
| `assets/questions-d1.js` … `d8.js` | 20 original practice questions per domain (160 total) |
| `assets/flashcards.js` | 150 key-term cards with spaced repetition |
| `assets/app.js` | Hash router, practice engine, flashcard scheduler, mock exam, progress storage |

## Features

- **A date-aware four-week study plan** (defaults to the 30 November 2026 exam; change it in the sidebar) with weekly milestones and a daily hour.
- **Condensed notes** for all eight domains, with key terms, traps, and mnemonics.
- **160 original scenario questions** with immediate explanations and a “manager’s lens” note.
- **Practice modes**: diagnostic, quick ten, domain drill, adaptive weak areas, review mistakes, bookmarks.
- **150 flashcards** using Leitner-style intervals (1, 3, 7, 21, 45 days).
- **Fixed-form mock exam**: 125 questions, 3 hours, weighted 16/10/13/13/13/12/13/10, with flagging, a question map, resume-after-refresh, and a domain breakdown.
- **Progress that stays local**: attempts, accuracy, coverage, mastery, streak, exam history, and readiness are stored in `localStorage` under `cissp.fieldmanual.v1`.
- **Exam date countdown** and a daily four-move study brief.
- Responsive down to 360 px, keyboard shortcuts, reduced-motion support, and print styles for the notes.

## Run it locally

Because everything is static and uses relative paths, any static server works:

```bash
cd /path/to/bonzili.github.io
python3 -m http.server 8000
# open http://localhost:8000/CISSP/
```

Opening `CISSP/index.html` directly from disk also works in most browsers, but a local server gives more predictable storage and font behaviour.

## Content model

### Adding a question

Append to the relevant `questions-dN.js` file:

```js
{
  id: "d1q21",              // unique
  d: 1,                     // domain 1–8
  topic: "Risk treatment",
  diff: 1,                  // 1 core, 2 applied, 3 hard
  stem: "Scenario question…",
  options: ["A", "B", "C", "D"],
  answer: 2,                // index 0–3
  whyText: "Why the best answer is best.",
  lens: "The manager-mindset takeaway.",
  why: { 0: "Optional note on why this distractor is wrong." }
}
```

The app redistributes correct-answer positions deterministically at load, so a new question does not need to be hand-balanced. Per-option notes move with their option text.

### Adding a flashcard

Append to `assets/flashcards.js`:

```js
{ id: "c1-17", d: 1, term: "Term", topic: "Group", definition: "Definition." }
```

### Editing domain notes

Each entry in `CISSP.domains` (`assets/data.js`) has `sections` with `points` and `terms`, plus `traps` and a `mnemonic`. `points` may contain the small amount of inline HTML used for emphasis (`<strong>`, `<em>`).

## Study plan and exam date

The default target date is **30 November 2026** (`META.examDate` in `assets/data.js`). The sidebar countdown and the four-week plan derive from it; you can change it at any time with **Change date**. The plan page is at `#/plan`.

## Exam model and caveats

- The site uses the ISC2 exam outline effective 15 April 2024, current for 2026: domain weights **16 / 10 / 13 / 13 / 13 / 12 / 13 / 10**.
- The English CISSP is a **computerised adaptive test**: 100–150 questions, 3 hours, pass mark **700/1000**.
- The mock here is a **fixed-form 125-question midpoint**. It cannot reproduce the adaptive stopping rule or the “no review” behaviour of the real CAT, but it reproduces the domain mix and time pressure.
- The estimated scaled score is a study aid: it maps 70% raw to 700 and is **not** an ISC2 score. Readiness is a weighted practice estimate, not a prediction.

## Privacy

No accounts, analytics, cookies, or network calls beyond the Google Fonts stylesheet. Study progress is stored only in the browser’s `localStorage`. “Reset data” on the Progress page clears it.

## Disclaimer

Unofficial study aid. Not affiliated with or endorsed by ISC2. CISSP is a registered mark of ISC2. The notes and practice questions are original work written for this manual; they are not reproductions of the official study guide or practice tests.
