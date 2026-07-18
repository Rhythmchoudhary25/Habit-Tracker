# Habit & Hours Tracker

A single-page, notebook-styled habit tracker with editable daily habits and two
click-to-plot graphs for study hours and sleep hours. Built as a lightweight,
zero-backend personal productivity tool — pure HTML/CSS/JS, no frameworks,
no build step.

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
git clone https://github.com/Rhythmchoudhary25/Habit-Tracker.git
cd Habit-Tracker
# just open index.html in a browser
```

## Notes

Since this uses `localStorage`, data is private to each browser/device — it
does not sync across devices and isn't visible to anyone else who opens the
same link, which keeps it simple to use as a personal daily tracker.

## Snapshots
<img width="1150" height="560" alt="Screenshot 2026-07-17 144245" src="https://github.com/user-attachments/assets/d49195d9-3d62-46dd-bfc9-b05c43241b6a" />
<img width="981" height="715" alt="Screenshot 2026-07-17 144305" src="https://github.com/user-attachments/assets/ee29f2c6-e75c-44d4-be44-64a17b9ae923" />


