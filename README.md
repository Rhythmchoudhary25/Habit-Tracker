# Ledger — Habit & Hours Tracker

A single-page, notebook-styled habit tracker with editable daily habits and two
click-to-plot graphs for study hours and sleep hours. Built as a lightweight,
zero-backend personal productivity tool — pure HTML/CSS/JS, no frameworks,
no build step.

**[Live demo →](#)** *(update this link once GitHub Pages is enabled — see below)*

## Features

- **Custom habit list** — add your own tasks; nothing is pre-filled. Each habit
  gets a per-day checkbox that cycles blank → done (✓) → missed (✗).
- **Study Hours & Sleep Hours graphs** — click anywhere in a day's column to
  plot that day's value; points connect automatically into a line, styled like
  a hand-drawn notebook graph. Independent y-axis ranges (Study: 0–10h,
  Sleep: 4–12h).
- **Per-month ledgers** — data is keyed by the month name you type in, so you
  can keep separate tracking sheets for different months.
- **Configurable month length** (28–31 days) and one-tap resets for marks or
  the entire task list.
- **Fully client-side** — all data is saved in the browser's `localStorage`.
  No server, no database, no account. Each visitor/device has their own
  private copy of the tracker; nothing is synced or shared between users.

## Tech stack

- HTML5, CSS3, vanilla JavaScript (ES6)
- SVG for the interactive graphs (hand-rolled, no charting library)
- `localStorage` for persistence
- Google Fonts (JetBrains Mono)

## Running locally

No install or build step required.

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
# just open index.html in a browser
```

## Deploying with GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment," set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
4. Save — GitHub will publish it at
   `https://<your-username>.github.io/<repo-name>/`.
5. Update the live demo link above once it's live.

## Notes

Since this uses `localStorage`, data is private to each browser/device — it
does not sync across devices and isn't visible to anyone else who opens the
same link, which keeps it simple to use as a personal daily tracker.
