# cat-tracker-project
# CAT Mock Score Tracker & Visualizer — Project Scope & Requirements

**Purpose:** Track sectional CAT mock performance (VARC / DILR / Quant) across a 4-month prep window to identify which subject is lagging, and whether the gap is an accuracy problem or an attempt-rate problem, and whether it's specifically MCQ or TITA.

**Owner's context:** Full-time CAT prep, ~4 months to exam. Strength order: VARC > DILR > Quant. Quant is weakest and being rebuilt from fundamentals.

---

## 1. Data Model

### 1.1 Required Fields (must be filled for every entry; form validates these)

| Field | Type | Notes |
|---|---|---|
| Date | date | Date of the mock |
| Source | text | e.g. "TIME", "IMS", "Actual CAT Mock #3" |
| Section | enum | VARC / DILR / Quant |
| Attempted MCQ | number | Count of MCQs attempted |
| Attempted TITA | number | Count of TITA attempted |
| Right MCQ | number | Correct MCQs |
| Right TITA | number | Correct TITA |
| Wrong MCQ | number | Incorrect MCQs (stored directly, not derived, to avoid arithmetic entry errors) |
| Wrong TITA | number | Incorrect TITA (stored directly) |
| Total Questions in Section | number | Section question count for that mock (varies by source — e.g. 22, 24, 25) |

### 1.2 Optional Fields (skippable — 2-3 extra clicks if filled; app must not break or force input if left blank)

| Field | Type | Notes |
|---|---|---|
| Percentile | number \| null | Percentile in that mock's student pool |
| Topper Score | number \| null | Highest score in that mock — gives a rough "how hard was this paper" signal |

### 1.3 Explicitly Excluded (by design, not a limitation)

- Per-question difficulty level
- Per-question time taken
- Any other question-wise granularity

**Reasoning:** This data is tedious to fill manually (no clean export from coaching platforms), low ROI for the goal of tracking *overall prep flow*, and has been observed to be internally inconsistent (e.g. summed per-question time exceeding the actual paper time limit). Deep per-question analysis for any single mock, if ever needed, will be done directly on the coaching platform's own dashboard — not duplicated here.

---

## 2. Derived / Computed Stats (never stored — always calculated live from raw data)

- **Total Marks (auto-calculated, not entered)** = (Right MCQ × 3) + (Right TITA × 3) + (Wrong MCQ × −1) + (Wrong TITA × 0) + (Unattempted × 0), where Unattempted = Total Questions in Section − Attempted MCQ − Attempted TITA (also derived, not a separate stored field)
- Overall Accuracy = (Right MCQ + Right TITA) / (Attempted MCQ + Attempted TITA)
- MCQ Accuracy = Right MCQ / Attempted MCQ
- TITA Accuracy = Right TITA / Attempted TITA
- Attempt Rate (per section) = (Attempted MCQ + Attempted TITA) / Total Questions in Section — now directly computable since Total Questions in Section is a required field
- Marks per Attempt (efficiency indicator)
- Negative Marks Lost estimate = Wrong MCQ × (CAT negative marking value)
- Rolling 5-mock average per section (smooths one-off bad days)
- Weakest Section Flag — lowest rolling accuracy × attempt-rate combination
- Percentile trend (only for entries where Percentile is filled)
- Exam hardness indicator (only for entries where Topper Score is filled) — your score relative to topper, to contextualize whether a low mock score reflects a hard paper

**Rule:** Any chart/stat depending on an optional field simply skips data points where that field is missing — it never blocks rendering of the rest of the dashboard.

---

## 3. Persistence Model (no backend/database)

- The app is a **static site** — no server, no login, no database
- Data lives in-browser (React state) while the app is open
- **Export**: after adding/editing entries, export a `scores.json` file
- **Import**: on next use, import that same `scores.json` back in — this file is the single source of truth
- Recommended workflow: keep `scores.json` inside the GitHub repo and commit it after each mock — this doubles as free version history/backup
- Old entries without the optional fields (Percentile, Topper Score) must remain valid on import — schema is additive, never breaking

---

## 4. Feature Scope

### 4.1 Entry & Data Management
- Form to add one row per section per mock (all required fields validated; optional fields clearly marked optional)
- Edit / delete existing entries
- Import / export `scores.json`
- Sortable, filterable table view of all raw entries

### 4.2 Visualizations
- Section-wise trend lines over time (VARC / DILR / Quant on the same or separate charts) — primary "who's lagging" view
- Accuracy comparison: overall / MCQ / TITA, both latest mock and rolling average, per section
- Attempt-rate trend per section over time
- Combined dashboard view stitching the above together
- Weakest-section auto-flag with a short explanatory note (e.g. "Quant TITA accuracy dropped over last 3 mocks")
- Source-wise comparison (e.g. TIME vs IMS vs actual CAT mocks — useful if difficulty varies by source)
- Percentile trend chart (renders only where percentile data exists)
- Exam hardness indicator (renders only where topper score data exists)


## 5. Tech Stack

- **React** (single-file component to start, ports cleanly to a full project)
- **Recharts** for all charts/trend lines
- **JSON** for data storage/import/export (no xlsx, no database)
- No backend, no auth, no server-side code — fully static
- Deployment: GitHub repo → Vercel (free tier), via a standard Vite + React scaffold

---

## 6. Decisions Resolved

- **Total Marks:** Auto-calculated by the app, not manually entered. Formula: +3 per Right MCQ, +3 per Right TITA, −1 per Wrong MCQ, 0 per Wrong TITA, 0 per Unattempted. This also acts as a built-in cross-check against manual entry errors — you no longer enter Total Marks at all, removing that error source entirely.
- **Attempt Rate:** Total Questions in Section is now a required field (entered per mock, since section question counts vary — e.g. 22, 24, 25 across different sources), making true Attempt Rate directly computable rather than an estimate.

---

*This document reflects the finalized scope as of the planning conversation. Any changes to fields, phases, or tech choices should be edited here before the next build session.*
