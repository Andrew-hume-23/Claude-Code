# Hume Voice EQ — Screen Strategy
**Internal handover · June 2026**

---

## What this product is

A single tool for building voice training data, evaluating model quality, and catching regressions before they ship. It covers the full BUILD → MEASURE → OBSERVE loop and exposes everything via API.

---

## PMM → Screen map

| Stage | PMM Component | Screen |
|---|---|---|
| BUILD | Golden Sets Library | Golden Sets |
| BUILD | Hyper Data | Hyper Data |
| BUILD | Data Explorer | Data Explorer |
| MEASURE | Human Ratings Engine | Human Ratings |
| MEASURE | Eval Suite | Eval Suite |
| MEASURE | Hume Switchboard | Switchboard |
| OBSERVE | AutoEval | AutoEval |
| OBSERVE | EQ Leaderboard | EQ Leaderboard |
| ALL | — | Overview |
| ALL | Unified API | API |

---

## Screens

**Overview**
The landing page. Shows the current model's composite REACT score and per-dimension breakdown at a glance. Read-only — it pulls from Eval Suite and AutoEval. Purpose: answer "are we better or worse than last checkpoint?" in under 10 seconds.

**Golden Sets**
The canonical asset library. Stores the voices, prompts, personas, roles, and data samples used in every eval. Before a study can run, it needs assets from here. This screen consolidates what was previously "Scenario Packs" and "Golden Sets" — they are the same thing.

**Hyper Data**
The dataset commissioning service. When the Golden Sets library doesn't have what you need, submit an order here — specify modality, dimensions, volume, and use case — and Hume records, labels, and delivers the dataset. Three tiers: Standard (7–10 days), Priority (3–5 days), Enterprise (custom). Primary billable surface in BUILD.

**Data Explorer**
The sample inspection tool. Opens any labeled dataset and shows individual turns at full fidelity: emotion radar, speech timeline, arousal-valence scatter, rater annotations. Used to validate data quality before training, and to diagnose regressions after AutoEval fires.

**Human Ratings**
Structured human eval studies. Configure a study (model, checkpoint, scenario pack, rubric), assign raters, run it, and get REACT scores with inter-rater agreement (κ). The rater-facing task UI lives here too. Used for high-stakes release decisions and new rubric development where automated scoring isn't enough.

**Eval Suite**
The study library. Tracks every eval that has been run or is planned — what was tested, against which checkpoint, with what result. Where Human Ratings is operational ("run this now"), Eval Suite is archival ("what have we learned"). Start here to create a new study or review score history.

**Switchboard**
Side-by-side model comparison. Pick two models, play matched samples, vote on which is better. Shows a live preference bar and a five-axis radar chart. Built for quick perceptual comparisons — useful both during development and as a sanity check after a new checkpoint ships.

**AutoEval**
Automated regression detection. Define eval monitors once; they run on every commit (or on a schedule) and fire Slack/webhook/email alerts the moment a score drops past a threshold. The monitor table shows passing vs. regressed at a glance. When a regression fires here, the next step is a targeted Human Ratings study to understand why.

**EQ Leaderboard**
The public benchmark. Ranks all major voice models on REACT dimensions, with Hume Octave leading on Emotional Intelligence. Two purposes: internal competitive tracking and external credibility — Hume sets the scoring standard the market is measured against. Results require κ ≥ 0.72 and 500+ rated turns to appear.

**API**
Programmatic access to everything. Eval runs, score retrieval, AutoEval triggers, webhook delivery. For teams running too many experiments to operate through a UI.

---

## How the screens connect

**Core loop — new checkpoint arrives:**
AutoEval fires → regression? → Human Ratings study → score updates on Overview

**Building new eval coverage:**
Golden Sets (assets) → Hyper Data (if more needed) → Data Explorer (validate) → Eval Suite (define study) → Human Ratings (run it) → AutoEval (monitor forever)

**Pre-release check:**
Switchboard (hear it) → EQ Leaderboard (confirm market position) → API (confirm integrations)

---

## What isn't built yet

| Gap | When to build it |
|---|---|
| Data Processing Pipeline config | When external customers need to configure their own ingestion |
| Rater Management screen | When the rater pool exceeds ~50 active raters |
