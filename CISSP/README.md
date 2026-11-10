# CISSP Field Manual

A static, no-build study site for the CISSP exam. It lives at:

**https://bonzili.me/CISSP/**

## What is here

| Path | Purpose |
| --- | --- |
| `index.html` | Application shell and script loading |
| `assets/styles.css` | Visual system: binder spine, answer sheet, question and flashcard layouts |
| `assets/data.js` | Domain notes, exam metadata, and the manager-mindset primer |
| `assets/questions-d1.js` … `d8.js` | 20 original practice questions per domain, plus five extra Domain 5 lifecycle questions (165 total) |
| `assets/flashcards.js` | 177 key-term cards with spaced repetition |
| `assets/sync.js` | Sync core: sync code, AES-GCM envelopes, per-device merge rules, Worker API client |
| `sync-worker/` | Optional Cloudflare Worker + D1 service for cross-device sync |
| `manifest.webmanifest`, `assets/icon-*.png` | Installable Home Screen metadata and icons |
| `assets/app.js` | Hash router, practice engine, flashcard scheduler, mock exam, progress storage |

## Features

- **A date-aware four-week study plan** (defaults to the 30 November 2026 exam; change it in the sidebar) with weekly milestones and a daily hour.
- **Condensed notes** for all eight domains, with key terms, traps, and mnemonics.
- **165 original scenario questions** with immediate explanations and a “manager’s lens” note. The distractors are written to be defensible under a different misread, not obvious throwaways.
- **Practice modes**: diagnostic, quick ten, Manager’s cut for technical candidates, domain drill, adaptive weak areas, review mistakes, bookmarks. Core and pack drills prefer unseen questions before recycling old ones; active drills survive a refresh.
- **177 flashcards** using Leitner-style intervals (1, 3, 7, 21, 45 days).
- **Fixed-form mock exam**: 125 questions, 3 hours, weighted 16/10/13/13/13/12/13/10, with flagging, a question map, resume-after-refresh, and a domain breakdown. Optional **CAT-style pacing** removes previous/flag/map so answers are final. When a local pack is loaded, the exam desk also offers a **125-question mixed pack mock** drawn from the official items.
- **A manager’s-lens primer** with a section written for technical candidates moving into management.
- **Progress export/import**: download a JSON backup and restore it on another browser or device.
- **Local question packs**: import a JSON pack of your own official practice questions. The pack stays in the browser and is never committed, uploaded, or included in sync. Pack drills and the pack mock prefer unseen questions, then least recently seen; duplicate stems and figure-dependent items are skipped on import. Wrong answers from the core bank and the loaded pack both flow into **Review mistakes** and survive a reload while the pack is loaded. If the pack tags questions with `d` 1–8, Practice also lists **Official domain drills** so you can drill one domain at a time.
- **Local CAT debrief**: import a debrief JSON with the score, domain percentages, failed-question pack, patterns, and a repair plan. It stays in this browser only and is never committed, uploaded, or synced.
- **Optional encrypted cross-device sync**: create a 128-bit sync code, enter it on your phone, and each device syncs its own encrypted snapshot through a small Cloudflare Worker. No accounts, email, or analytics; the Worker stores ciphertext only. See `sync-worker/README.md` for deployment.
- **Local-first progress**: attempts, accuracy, coverage, mastery, streak, exam history, and readiness are stored in `localStorage` under `cissp.fieldmanual.v1`. Sync is additive and per-device, so one device cannot overwrite another.
- **A− / A+ reading-size control** in the top bar: 90–130% in 10% steps, remembered per browser.
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

The app redistributes correct-answer positions deterministically at load, so a new question does not need to be hand-balanced. Per-option notes move with their option text. Write each wrong option as a plausible answer to a slightly different question — wrong role, phase, control type, data state, or scope — and keep option punctuation consistent.

### Adding a flashcard

Append to `assets/flashcards.js`:

```js
{ id: "c1-17", d: 1, term: "Term", topic: "Group", definition: "Definition." }
```

### Editing domain notes

Each entry in `CISSP.domains` (`assets/data.js`) has `sections` with `points` and `terms`, plus `traps` and a `mnemonic`. `points` may contain the small amount of inline HTML used for emphasis (`<strong>`, `<em>`).

## Local question packs

The public site does not ship official practice-test questions. The Practice page has a local pack loader for question sets you own.

1. A pack is a JSON object with `title`, `source`, and a `questions` array.
2. Each question needs `id`, `stem`, four `options`, an `answer` index from 0–3, and optional `topic` / `whyText`.
3. Import it from **Practice → Local question pack → Load question pack**.
4. If questions include `d` values from 1–8, use the **Official domain drills** row to run a 20-question set from that domain. Those drills count toward domain readiness.

```json
{
  "title": "My official practice set",
  "source": "Personal copy",
  "questions": [
    {
      "id": "local-1",
      "d": 1,
      "topic": "Risk",
      "stem": "Scenario…",
      "options": ["A", "B", "C", "D"],
      "answer": 2,
      "whyText": "Explanation…"
    }
  ]
}
```

Pack questions are stored in this browser only. They are not included in cross-device sync, progress export, or the repository. Import the pack again on another device. Questions tagged `d` 1–8 feed domain accuracy and coverage when answered through an **Official domain drill**. Mixed pack sets (`d` 0) and the pack mock stay separate from domain readiness. Importing a pack does not lower an existing score until official questions are answered, and removing the pack returns readiness to the core bank only.

A local pack generated from the practice tests you own is intentionally kept outside the repository (for example, in `~/Downloads/CISSP/`). Do not commit it or redistribute it.

## CAT debrief (local only)

The **CAT debrief** page is a local reader for one exam attempt. It shows the score, domain percentages, failed-question drills, the error patterns, and a short repair plan. It can also load the failed questions as a local pack.

Minimal shape:

```json
{
  "title": "CAT attempt",
  "source": "Attempt source",
  "date": "2026-11-10",
  "score": 548.64,
  "passMark": 700,
  "questionCount": 105,
  "correct": 56,
  "incorrect": 48,
  "unanswered": 1,
  "time": "02:35:40",
  "domains": [
    { "id": 1, "correct": 42.35, "incorrect": 57.65 }
  ],
  "attemptGraph": {
    "start": 560.21, "peak": 789.78, "peakQuestion": 32,
    "end": 523.08, "endQuestion": 80, "plotted": 80,
    "note": "Optional interpretation."
  },
  "failedDomains": { "1": 13 },
  "patterns": ["Optional observation."],
  "plan": [
    { "week": "Week 1", "focus": "Domain 4 + Domain 8", "summary": "Optional.", "actions": ["Optional action."] }
  ],
  "packQuestions": []
}
```

Open **Progress → CAT debrief** or `#/debrief`, then load the JSON. If `packQuestions` is present, the same import loads the failed-question pack. The debrief and the pack are stored in this browser only; they are not uploaded, published, exported with progress, or included in sync.

## Progress portability

The Progress page can export the entire merged local state (attempts, cards, exams, settings) as a JSON file and import it on another browser. Import replaces the current local state after confirmation, and validation only accepts known question/card IDs and numeric fields.

Export/import is the fallback and backup path. Import is intentionally paused while sync is on: importing a merged backup on a synced device would count the same attempts twice. Turn sync off on your devices first, import, then create a new sync code if you want to resume syncing.

## Sync across devices

The sync feature is optional. It is designed for one person with two devices — typically a laptop and a phone.

1. Open **Progress → Sync across devices → Create a sync code**.
2. Store the code in a password manager.
3. On the other device, choose **I have a code** and enter it.
4. Both devices now push their own encrypted snapshot and merge the others.

The sync code is the only credential. It is never stored on the server; the Worker derives an account id from it with SHA-256. The browser derives an AES-GCM-256 key from the same code, so the Worker only stores ciphertext. There are no accounts, cookies, or analytics.

**Optional server lock:** after creating the code, open **Server lock (advanced) → Show lock value**. Set the Worker variable `ACCOUNT_ID` to that 64-character fingerprint and redeploy. The Worker then rejects every other account before touching D1, so random codes cannot create junk rows. The fingerprint is a hash, not the code, and cannot decrypt anything. It does not stop request floods; use the `/v1/sync` rate-limit rule for that.

Each device writes only its own row. The merge rules are:

- **Attempts** — counts are summed; the newest attempt supplies the box/result.
- **Cards** — review counts are summed; the newest review supplies the box/due date.
- **Exams** — union by a stable exam id.
- **Bookmarks** — latest on/off state wins, so a removal is not resurrected.
- **Activity** — per-day counts are summed; the streak is derived from the merged days.
- **Exam date and domain visits** — newest timestamp wins.
- **Daily brief** — flags for the same day are OR-ed.

The Worker is in `sync-worker/`. It needs a free Cloudflare account, one D1 database, and the `sync.bonzili.me` custom domain. Full deployment and rate-limiting instructions are in `sync-worker/README.md`.

Limits: 10 devices per code, 900 KB per snapshot, and the Cloudflare Free plan's Workers/D1 allowances. The app is local-first: a failed sync never blocks studying and retries on the next save or when the app becomes visible again.

**Losing the sync code** means losing the server copy. Local progress remains on each device. Deleting synced data removes the server rows, but another device that still has the code and its local copy can upload it again; turn sync off on the other devices before deleting if you want a complete removal.

Run the merge tests from the repository root with:

```bash
node --test tests/sync.test.js
```

## Study plan and exam date

The default target date is **30 November 2026** (`META.examDate` in `assets/data.js`). The sidebar countdown and the four-week plan derive from it; you can change it at any time with **Change date**. The plan page is at `#/plan`.

## Exam model and caveats

- The site uses the ISC2 exam outline effective 15 April 2024, current for 2026: domain weights **16 / 10 / 13 / 13 / 13 / 12 / 13 / 10**.
- The English CISSP is a **computerised adaptive test**: 100–150 questions, 3 hours, pass mark **700/1000**.
- The mock here is a **fixed-form 125-question midpoint**. It cannot reproduce the adaptive stopping rule or the “no review” behaviour of the real CAT, but it reproduces the domain mix and time pressure.
- The estimated scaled score is a study aid: it maps 70% raw to 700 and is **not** an ISC2 score. Readiness is a weighted practice estimate, not a prediction.

## iPhone and installable app

The page uses `viewport-fit=cover` and the `env(safe-area-inset-*)` values so the top bar clears the Dynamic Island and the bottom tab bar clears the home indicator. Safari's own bottom toolbar sits outside the page; for a true full-screen study app, open the site on the iPhone, tap **Share → Add to Home Screen**, and launch it from the icon. The web app manifest and 180/192/512 px icons are included in this folder. Enter your sync code once on the iPhone if you want the two devices to share progress.

## Privacy

No accounts, analytics, cookies, or third-party scripts beyond the Google Fonts stylesheet. Study progress is local by default. If you enable sync, the browser sends encrypted snapshots to your own Cloudflare Worker at `sync.bonzili.me`; the Worker stores ciphertext and an account id derived from your sync code. It uses the sync code only to derive an account id, never stores the code, and never receives plaintext progress. “Reset data” and “Delete synced data” on the Progress page clear local and/or remote data as described in the dialogs.

## Disclaimer

Unofficial study aid. Not affiliated with or endorsed by ISC2. CISSP is a registered mark of ISC2. The notes and practice questions are original work written for this manual; they are not reproductions of the official study guide or practice tests.
