# Daily Brief

A personal, installable daily brief for `bonzili.me/dailybrief/`.

One URL, one PWA, two workspaces:

- **Siu Gai Mo's Brief** — AI models and tools, Hong Kong, Mayday, cybersecurity
  and red teaming, with both global stories and a Hong Kong desk for local
  breaches and incidents.
- **Siu Bak's Brief** — APAC legal (IP, privacy, fintech, cyber and AI law) with
  Hong Kong legal stories prioritised, Hong Kong news, and 易烊千璽.

Both briefs use an **English interface**. Article headlines, bullets and the
one-line takeaway stay in the language of the source: English stories remain
English, Chinese stories remain Chinese.

The first launch asks which brief to read. The choice is stored in
`localStorage`; the header switcher changes it at any time. Read state and saved
stories are kept separately per workspace. Direct links:
`https://bonzili.me/dailybrief/?ws=me` and
`https://bonzili.me/dailybrief/?ws=her` — the app remembers the choice after the
first open.

## Install on iPhone

1. Open `https://bonzili.me/dailybrief/` in Safari.
2. Tap **Share → Add to Home Screen**.
3. Name it **Daily Brief**.

The app opens standalone, with safe-area padding, a bottom tab bar and no
browser chrome. There is deliberately **no service worker**: you said no
offline-first, so the app always asks for the current deployment. The last
edition is cached in `localStorage` as a last-known-good fallback only. iOS may
keep the home-screen app's storage separate from Safari; if the chooser appears
again after installing, pick the brief once inside the installed app.

## What is in the app

- **Today** — a finite brief: 12 cards for Siu Gai Mo's Brief, 8 for Siu Bak's Brief. No
  infinite scroll. Siu Gai Mo's brief mixes AI models, benchmarks and new
  tools; Hong Kong; Mayday; cybersecurity; and red teaming.
- **Topics** — the deeper list for the day. APAC legal has a tag filter (HK,
  IP, Privacy, Fintech, AI, Cyber); Cybersecurity has HK / Global tags; AI has
  Model / Tool / Benchmark tags; Red Teaming has AI / Tool / Exploit tags.
- **Saved** — stored on this phone, not synced.
- **Archive** — morning and evening editions, kept for 30 days. Manual runs
  replace that day's matching slot instead of adding duplicate rows.
- **Read state** — a card you opened in an earlier edition is hidden from the
  next Today brief; it stays available under Topics and Archive. The state is
  per browser, so it does not sync between phone and laptop.
- **Not interested / mute** — an open card can be marked **Not interested**,
  which hides it from Today and Topics on this device. A topic can be muted
  from its page, which keeps it out of Today but leaves the topic browsable.
  Both controls are local, undoable, and listed under Topics.
- **Source health** — every source is fetched separately, so one broken feed
  never hides the rest of the brief.
- **Lunch near The Angle** — a small, manually curated lunch shortlist for
  Siu Gai Mo around 98 How Ming Street, Kwun Tong. Mostly team lunches, with
  dine-in and takeaway options. It is not a live restaurant directory: walk
  times are estimates, hours are typical, and the page never claims to know
  whether a place is open or crowded. “I ate here” removes a place from the
  daily pick for a week; “Not interested” hides it until you reset lunch
  preferences. Both are local to this device.

## How the data is built

GitHub Actions runs the pipeline twice a day:

- **07:00 HKT** (`0 23 * * *` UTC)
- **18:00 HKT** (`0 10 * * *` UTC)

Each run fetches a rolling window, clusters same-language stories, scores them,
selects a finite brief per workspace, summarizes the selected cards and deploys
the whole static site through GitHub Pages.

The in-app refresh button only re-fetches the current deployment. To force a new
fetch and summarization now, run **Actions → Daily Brief → Run workflow**.

The workflow is `.github/workflows/dailybrief.yml`. Nothing is committed back to
the repo. The generated `dailybrief/data/today.json` and the archive are staged
into the Pages artifact. The committed seed is a real fetch with extractive
fallback text; the first scheduled or manual run replaces it with model-written
bullets and takeaways.

Lunch is completely separate from the news pipeline. It is a static
`dailybrief/data/lunch.json` file, loaded only when the Lunch page is opened.
Adding or correcting a lunch place does not call Gemini and does not add a
scheduled Actions run; the normal Pages deploy on push is enough.

## Free only

This project is deliberately built to avoid a surprise bill.

| Service | Use | Cost guard |
|---|---|---|
| GitHub Actions | 2 runs/day + pushes | Public repo: free. The workflow has a 15-minute timeout. If the repo is ever made private, set the account's Actions spending limit to **$0**; the included minutes cover this workload. |
| GitHub Pages | Hosting + deploy | Free for this public site. |
| GitHub Models | Default summarizer | Free, rate-limited, uses the built-in `GITHUB_TOKEN`. No paid fallback. |
| Gemini API | Opt-in summarizer | **Not used by default in Actions.** To enable it, set `summarization.provider: gemini` (or run with `--provider gemini`) and use a free key from a project with no billing account. |
| Cloudflare | Existing proxy | No Worker, KV, D1 or API token is used by this app. |
| Sources | RSS / public APIs | No keys, no paid feeds, no authenticated scraping. |

The pipeline also has a hard **48 LLM calls per run** budget. When it is
reached, or when the selected free provider fails, it falls back to extractive
bullets and still deploys. There is no retry loop that can run forever. If
GitHub Models is not enabled for the repository or organization, the run simply
uses extractive text — it does not fall through to a paid service. In `auto`
mode GitHub Actions uses GitHub Models and never falls through to Gemini; Gemini
runs only when you explicitly select it. Never paste a key into chat, an issue,
or a commit — store it only as an Actions secret.

**Important:** a Gemini API key from a Google Cloud project with billing enabled
can be charged. Use a free AI Studio key created without a billing account. If
you are not sure, do not add the secret — the default GitHub Models path needs
no extra key and cannot bill.

This deployment is configured for **Gemini free tier only** (`provider: gemini`),
with no paid fallback. The current model is `gemini-3.5-flash-lite`, which is a
free-tier model at the time of writing. If Gemini is unavailable or
rate-limited, the brief uses extractive text instead.

The post at `https://bonzili.me/dailybrief/` is public but `noindex,nofollow`.
It is not authentication-protected. Do not put private data in the sources.
There are no accounts, cookies, analytics, tracking scripts or third-party
fonts. Read state and saved cards never leave the browser.

## One-time setup

1. **Settings → Pages → Source → GitHub Actions.** The workflow deploys the
   whole site; branch-based Pages is no longer used.
2. Optional: **Settings → Secrets and variables → Actions → New repository
   secret** → `GEMINI_API_KEY`, only if you want Gemini instead of GitHub
   Models. Then set `summarization.provider: gemini` in
   `dailybrief-pipeline/config.yaml` (auto mode intentionally stays on GitHub
   Models in Actions). Do not enable billing on that Google Cloud project.
3. **Actions → Daily Brief → Run workflow** for the first live edition.
4. Open `/dailybrief/` in Safari and add it to the Home Screen.

The first push after switching Pages to GitHub Actions will deploy the current
site, including the committed seed edition. The first scheduled run replaces it.
If the deploy step fails, check that **Settings → Pages → Source** is still
**GitHub Actions** and that the `github-pages` environment is allowed to deploy.

## Local preview

The app is plain HTML/CSS/JS with no build step:

```bash
cd /path/to/bonzili.github.io
python3 -m http.server 8000
# open http://localhost:8000/dailybrief/?demo=1
```

`?demo=1` loads `data/demo.json`, a fixed dataset that exercises both
workspaces, the legal and red-team tag filters, AI tool cards, Chinese text,
long headlines and missing comments. `?demo=1&ws=her` opens directly in Siu
Bak's workspace.

Run the pipeline locally with extractive summaries (no key, no cost):

```bash
python3 dailybrief-pipeline/run.py --no-llm
```

Or force extraction explicitly:

```bash
python3 dailybrief-pipeline/run.py --provider extractive
```

Tests:

```bash
python3 -m unittest discover -s dailybrief-pipeline/tests -v
```

## Adding a source or topic

Everything lives in `dailybrief-pipeline/config.yaml`.

A source needs an `id`, `type`, `trust`, `lang`, `max_items` and the type's
fields:

```yaml
- id: example-news
  name: Example News
  type: rss
  url: https://example.com/feed.xml
  trust: 0.8
  lang: en
  max_items: 6
  tag: IP              # optional, shown on legal cards
  jurisdiction: APAC   # optional, shown on legal cards
  filter_keywords: []  # optional, require one
  exclude_keywords: [] # optional, drop matching items
```

Supported types: `rss`, `google_news`, `hn`, `openrouter`, `ptt`, `hko`,
`kev`, `telegram`, `github_trending`, `github_search` and
`artificial_analysis`. Adding a topic means adding a `topics.<id>` block, then
listing it in the relevant workspace's `topics`.

The AI desk also watches GitHub Trending, Product Hunt, Hugging Face, Google
Open Source and open-source AI news for new tools and products. A benchmark
card comes from the Artificial Analysis FAQ payload; it is emitted when the
top-five changes, or once a week if the ranking is unchanged. Red Teaming uses
Google News, the CISA KEV catalog, Google Project Zero and GitHub discovery
queries for new red-team, LLM-security and CVE proof-of-concept repositories.

Workspaces can use `tag_min` for a minimum number of cards carrying a tag
(for example, two Hong Kong cyber cards) and `tag_caps` for a maximum (for
example, at most one AI tool card so model and benchmark news still have
space).

### Adding or correcting a lunch place

Edit `dailybrief/data/lunch.json`. Each place needs:

```json
{
  "id": "gun-dumplings",
  "name": "滾餃",
  "name_en": "Boiledumplingss",
  "cuisine": "Dumplings",
  "price_band": "$51–100",
  "price_max": 100,
  "walk_minutes": 5,
  "address": "Shop N, G/F, COS Centre, 56 Tsun Yip Street, Kwun Tong",
  "hours": "Verify current hours",
  "closed": "",
  "dine_in": true,
  "takeaway": true,
  "group": true,
  "solo": true,
  "crowd": "Medium",
  "tags": ["Team", "Takeaway", "Moved"],
  "note": "Moved from Camel Paint Building. Handmade dumplings...",
  "last_verified": "2026-11-04",
  "map_url": "https://www.google.com/maps/search/?api=1&query=...",
  "openrice_url": "https://www.openrice.com/..."
}
```

Keep the stable `id` when a place moves, and put the old address in `note`.
Use `closed` for known closure days and “verify” wording for uncertain hours.
Do not scrape OpenRice; use it as a link only. The lunch page is for Siu Gai
Mo’s brief only.

## Known limits

- Threads and Instagram have no public feed API. Nothing here logs into or
  scrapes them. The brief replaces the news-gathering part of the scroll, not
  the social part.
- Reddit's JSON endpoints, Bluesky's public search and a few news sites return
  403 from CI, so they are not used. HN, PTT, Telegram previews, public RSS and
  Google News RSS are the discussion/community inputs.
- Cross-language duplicates are not merged. Showing an English and a Chinese
  report separately is safer than inventing a merged fact.
- Some publishers are paywalled. The card links to the source; the summary is
  grounded in the feed snippet. SCMP feed items are checked for a mismatched
  headline and teaser; an item whose teaser is clearly a different story is
  dropped rather than summarised.
- The app is public and unlisted. Read state, saved cards, muted cards and
  muted topics are local to the browser and can be cleared by iOS. There is no
  cross-device sync in v1.
- GitHub search is a public API with a rate limit. The workflow passes its
  `GITHUB_TOKEN` when available and falls back to unauthenticated search; a
  rate-limited source is shown in Source health and never stops the brief.
- A benchmark card is intentionally rare: it appears when the Artificial
  Analysis top five changes, or at most once a week. A quiet AI day therefore
  will not invent a benchmark story.
- Lunch hours and walk times are manual estimates. A restaurant can close,
  move or change its queue without the site knowing. The page shows a
  last-verified date and asks you to confirm before going.
- GitHub disables scheduled workflows in a public repo after 60 days without a
  commit. If the brief stops updating, push any commit or open **Actions →
  Daily Brief → Enable workflow / Run workflow**. The app will show the old
  edition's timestamp and a stale warning until it runs again.
