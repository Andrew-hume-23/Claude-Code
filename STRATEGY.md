# Hume Voice EQ — Product Screen Strategy
### Internal Handover Document · May 2026

---

## Executive Summary

Hume Voice EQ is a full-stack voice evaluation and improvement harness. It operationalizes the **BUILD · MEASURE · OBSERVE** product framework described in the PMM by giving internal teams a single, coherent surface to build training datasets, run human and automated evaluations, and continuously monitor model quality across all voice modalities (TTS, STT, S2S).

**Three strategic imperatives drive the screen architecture:**

1. **Close the data flywheel.** High-quality labeled datasets (BUILD) feed better eval runs (MEASURE), which surface regressions that trigger more targeted data collection (OBSERVE → BUILD). Every screen in the product accelerates a loop, not a one-time action.

2. **Make quality legible.** The REACT framework (Reliability, Expressivity, Emotional Intelligence, Consistency, Speed) provides a single scoring language across all screens. A score on the Leaderboard means the same thing as a score in an eval run or a checkpoint history entry.

3. **Reduce cycle time from training to confidence.** AutoEval and Human Ratings together eliminate the lag between a model checkpoint and a quality verdict. The target state is same-day regression detection on every commit.

---

## Strategic Framework Mapping

The PMM defines nine product components organized under three stages. The screen inventory maps one-to-one as follows:

| PMM Stage | PMM Component | Screen | Nav Label |
|---|---|---|---|
| **BUILD** | Golden Sets Library | Golden Sets | Golden Sets |
| **BUILD** | Hyper Data | Hyper Data | Hyper Data |
| **BUILD** | Data Processing Pipeline | *(handled in Data Explorer)* | — |
| **BUILD** | Data Explorer | Data Explorer | Data Explorer |
| **MEASURE** | Human Ratings Engine | Human Ratings | Human Ratings |
| **MEASURE** | Eval Suite | Eval Suite | Eval Suite |
| **MEASURE** | Hume Switchboard | Switchboard | Switchboard |
| **OBSERVE** | AutoEval | AutoEval | AutoEval |
| **OBSERVE** | EQ Leaderboard | EQ Leaderboard | EQ Leaderboard |
| **UNIFIED** | API | API Reference | API |
| *(navigation)* | — | Overview | Overview |

> **Note on Data Processing Pipeline:** The PMM describes this as a backend service rather than a user-facing screen. Its outputs (structured transcripts, emotion timelines, speech segmentation) surface within Data Explorer. No dedicated screen is warranted at this stage.

> **Note on OBSERVE overlaps:** The PMM lists Human Ratings, Data Explorer, and Switchboard as both MEASURE and OBSERVE tools. The nav places each screen under its *primary* stage. Cross-stage usage is accessed from the same screen; no duplication is needed.

---

## Screen Intent Matrix

A single-page reference for all screens. Each row answers: *why does this screen exist, who uses it, and what decision does it enable?*

| Screen | Stage | Primary User | Core Job To Be Done | Key Output |
|---|---|---|---|---|
| **Overview** | All | Team lead / exec | Understand current model quality at a glance | Composite REACT score + trend |
| **Golden Sets** | BUILD | Data team / researcher | Curate and manage the canonical voice asset library | Approved eval assets (voices, prompts, personas, roles) |
| **Hyper Data** | BUILD | Data team | Commission bespoke labeled datasets at scale | Delivered, REACT-scored audio dataset |
| **Data Explorer** | BUILD + OBSERVE | Researcher / analyst | Inspect and validate labeled samples at the turn level | Confidence in dataset quality before training |
| **Human Ratings** | MEASURE + OBSERVE | Ops / annotation lead | Run structured human evaluation studies | Per-study REACT scores with inter-rater reliability |
| **Eval Suite** | MEASURE | Eval lead / researcher | Define and manage evaluation studies | Study configurations and historical score library |
| **Switchboard** | MEASURE + OBSERVE | Researcher / PM | Compare two model outputs side-by-side and vote | Preference data + radar chart comparison |
| **AutoEval** | OBSERVE | Eng / eval lead | Detect regressions automatically on every checkpoint | Regression alerts + continuous score history |
| **EQ Leaderboard** | OBSERVE | PM / exec / external | Benchmark Hume against the market on EQ dimensions | Public competitive positioning data |
| **API** | UNIFIED | Developer / partner | Access all eval capabilities programmatically | Integration-ready eval infrastructure |

---

## Screen-by-Screen Intent

---

### 1. Overview
**Stage:** All  
**PMM component:** Dashboard / entry point (not a named PMM component; serves as the harness landing screen)

**Strategic intent**
The Overview is the *daily status page* for anyone accountable for model quality. It should answer one question in under 10 seconds: *"Is the current checkpoint better or worse than the last one, and on which dimensions?"* It is not a reporting tool — it is a signal board.

**Key user actions**
- Read composite REACT score and per-dimension breakdown for the current checkpoint
- Spot trend direction vs. the prior checkpoint
- Navigate to the relevant screen when a score warrants investigation

**Design principle**
Every metric shown on Overview must be derivable from data that exists in Eval Suite, AutoEval, or Human Ratings. Overview should never be the primary source of truth — it is a read-only aggregation layer.

---

### 2. Golden Sets
**Stage:** BUILD  
**PMM component:** Golden Sets Library

**Strategic intent**
The Golden Sets Library is the *quality foundation* of the entire eval system. Before any eval can run, it needs canonical assets to evaluate against: reference voices, prompt scripts, user personas, roles, use cases, and raw data samples. Golden Sets is where those assets are curated, approved, tagged, and version-controlled.

The PMM explicitly equates "Scenario Packs" with "Golden Sets" — they are the same concept. This screen consolidates what was previously two separate nav items.

**Key user actions**
- Browse the asset library across six dimensions: Voices, Prompts, Users, Roles, Use Cases, Data
- Filter by modality, tag, or quality tier
- Select assets to bundle into an eval study
- Propose new assets for review via the Suggest modal
- Preview individual assets in the detail panel

**Why this matters**
The quality ceiling of any eval is set by the quality of its Golden Set. Investing in asset curation here has a multiplicative effect on every downstream MEASURE and OBSERVE output.

---

### 3. Hyper Data
**Stage:** BUILD  
**PMM component:** Hyper Data

**Strategic intent**
Hyper Data is the *managed dataset commissioning service* for cases where the Golden Sets Library does not already contain the right assets. Teams define what they need — modality, dimensions, volume, use case context — and Hume sources, records, and labels on their behalf.

This screen operationalizes the PMM's positioning of Hyper Data as an "acquire at scale" capability, distinct from the self-serve asset library.

**Key user actions**
- Submit a new dataset commission via a 4-step wizard (Brief → Samples → Tier → Confirm)
- Choose a labeling tier (Standard / Priority / Enterprise) based on turnaround and rater depth
- Track active orders through the recording → labeling → QA → delivery pipeline
- Download or stream delivered datasets to training pipelines

**Commercial implication**
Hyper Data is the primary billable surface in the BUILD stage. Tier selection maps directly to the pricing model described in the PMM. The screen should make cost and turnaround trade-offs explicit at the point of order, not after.

---

### 4. Data Explorer
**Stage:** BUILD + OBSERVE  
**PMM component:** Data Explorer (+ Data Processing Pipeline outputs)

**Strategic intent**
Data Explorer is the *ground-truth inspection layer*. It surfaces individual labeled samples at full fidelity — emotion radars, speech timelines, arousal-valence scatter, Big Five profiles, and annotation breakdowns — so researchers can validate dataset quality before committing it to a training run.

It also serves an OBSERVE function: when a regression appears in AutoEval or Human Ratings, Data Explorer is where analysts drill into the specific turns that caused it.

**Key user actions**
- Connect a dataset and browse samples
- Inspect per-sample emotion radar, arousal-valence position, and speech timeline
- Review rater annotations and inter-rater agreement
- Explore aggregate distributions (Big Five, induction matrix, top emotion tags)
- Export filtered subsets

**Relationship to Data Processing Pipeline**
The PMM describes a backend Data Processing Pipeline that produces the structured artifacts shown here (transcript segmentation, emotion labeling, speaker diarization). Data Explorer is the user-facing read layer on top of that pipeline. Pipeline configuration is out of scope for this screen.

---

### 5. Human Ratings
**Stage:** MEASURE + OBSERVE  
**PMM component:** Human Ratings Engine

**Strategic intent**
Human Ratings is the *gold standard evaluation channel*. When automated scores are insufficient — for new rubric development, adversarial scenario testing, or high-stakes release decisions — human raters provide the ground truth. This screen manages the full lifecycle: study design, rater assignment, task execution, and result aggregation.

The Rater Task overlay provides the rater-facing interface, keeping the labeling UX within the same product surface rather than requiring a separate tool.

**Key user actions**
- Configure a study (model, checkpoint, scenario pack, rater pool, rubric)
- Launch and monitor live rating sessions
- Review per-rater agreement (Cohen's kappa)
- Drill into a completed run via the Run Detail overlay
- Compare scores across checkpoints

**Quality control lever**
Inter-rater reliability (κ) is surfaced at the study level. The PMM sets a minimum acceptable κ of 0.72 for results to count toward official REACT scores. This threshold is enforced at the display layer.

---

### 6. Eval Suite
**Stage:** MEASURE  
**PMM component:** Eval Suite

**Strategic intent**
Eval Suite is the *study library and configuration hub*. It is the authoritative record of every evaluation that has been run or is planned — what was tested, against which checkpoint, using which Golden Set, with what results.

Where Human Ratings is operational (run this study now), Eval Suite is archival and comparative (what have we learned across all studies?).

**Key user actions**
- Browse the full study history with filterable status (draft / running / complete)
- Create a new study definition
- Review historical score trends across checkpoints
- Open the Checkpoint History overlay for a selected model
- Trigger a study run (which moves execution to Human Ratings)

---

### 7. Switchboard
**Stage:** MEASURE + OBSERVE  
**PMM component:** Hume Switchboard

**Strategic intent**
Switchboard is the *qualitative comparison tool*. It is designed for the moment when a researcher or PM needs to hear two models side-by-side and form a judgment — not mediated by a rubric, but by direct perceptual comparison. The output is preference data and a visual radar comparison, not an absolute score.

It serves both MEASURE (structured A/B comparison during development) and OBSERVE (quick sanity check after a new checkpoint ships).

**Key user actions**
- Select two models to compare across five REACT dimensions
- Play matched audio samples and cast a preference vote
- Read the animated preference bar as votes accumulate
- Switch to the Generate tab to synthesize new comparison samples
- Export comparison results

**Design principle**
Switchboard is the most human-centered screen in the product. It must feel fast and responsive — the waveform animation, voting interaction, and radar rendering exist to keep the evaluator engaged rather than fatigued across many comparison sessions.

---

### 8. AutoEval
**Stage:** OBSERVE  
**PMM component:** AutoEval

**Strategic intent**
AutoEval is the *automated regression guard*. It is the answer to the question: *"How do we know immediately when a new checkpoint has hurt something?"* It runs defined eval suites on every commit (or on a schedule), compares scores against the prior checkpoint and a defined baseline, and fires alerts the moment a threshold is crossed.

The PMM's positioning — "define it once, run it forever" — means the primary investment is in writing good eval monitors upfront. The operational overhead thereafter is near-zero.

**Key user actions**
- Review the live monitor table: which evals are passing, which have regressed
- Inspect run history to understand when a regression was introduced
- Configure notification channels (Slack, webhook, email)
- Set alert thresholds per eval (absolute score floor, delta vs. prior, delta vs. baseline)
- Pause or resume individual monitors

**Connection to Human Ratings**
AutoEval is the triage layer. When a regression fires, the typical response is to open a targeted Human Ratings study on the affected dimension to understand *why* the score dropped. AutoEval detects; Human Ratings diagnoses.

---

### 9. EQ Leaderboard
**Stage:** OBSERVE  
**PMM component:** EQ Leaderboard (public benchmark)

**Strategic intent**
The EQ Leaderboard is the *external proof point*. It publishes Hume's independent REACT benchmark results for all major voice models on a public-facing page, with Hume Octave at the top of the Emotional Intelligence dimension. It serves two audiences simultaneously: internal teams use it to track competitive position; external audiences use it to evaluate Hume's credibility as a voice quality authority.

This dual audience is a deliberate PMM positioning choice: by running and publishing an independent benchmark, Hume establishes the scoring standard that the entire market is measured against.

**Key user actions**
- Read the current composite and per-dimension rankings across all certified models
- Filter by modality (TTS / STT / S2S)
- Sort by any REACT dimension to understand where each model leads or lags
- Review the methodology footnote for credibility and reproducibility information
- Click through to individual model certification details

**Governance note**
Results must meet a minimum κ ≥ 0.72 and a minimum of 500 rated turns per model to appear on the Leaderboard. Uncertified models are visible but clearly flagged. This threshold is the primary quality gate and must be maintained to preserve the benchmark's credibility.

---

### 10. API
**Stage:** UNIFIED  
**PMM component:** Unified API

**Strategic intent**
The API screen is the *developer integration layer*. It documents every capability available in the product as a programmable endpoint — submitting eval runs, pulling scores, streaming rater results, triggering AutoEval monitors — so that Hume's eval infrastructure can be embedded directly into customer CI/CD pipelines without requiring access to the UI.

The PMM frames the API as the unifying layer that makes all three stages (BUILD, MEASURE, OBSERVE) accessible to teams that operate programmatically. A voice team running 50 model experiments per day cannot operate at that cadence through a UI — the API is their primary interface.

**Key user actions**
- Browse endpoint reference by category
- Copy authentication headers and example request/response payloads
- Test endpoints live against the current workspace
- Access webhook configuration for async result delivery

---

## Cross-Screen User Journeys

### Journey 1: New model checkpoint → quality verdict (core loop)

```
New checkpoint available
        │
        ▼
   AutoEval fires         ← automated, no human action required
        │
  Regression detected?
   │              │
  No              Yes
   │               │
   │         Eval Suite → create targeted study
   │               │
   │         Human Ratings → run rater session
   │               │
   └───────────────┤
                   ▼
            Overview updated with new composite score
```

### Journey 2: Building a net-new eval capability

```
Identify gap in eval coverage
        │
        ▼
Golden Sets → curate or select relevant assets
        │
        ▼
Hyper Data → commission labeled samples if assets are insufficient
        │
        ▼
Data Explorer → validate dataset quality
        │
        ▼
Eval Suite → define new study using curated assets
        │
        ▼
Human Ratings → run first instance; establish baseline
        │
        ▼
AutoEval → set up recurring monitor on new study
```

### Journey 3: Competitive release decision

```
Preparing for external release
        │
        ▼
Switchboard → qualitative A/B vs. nearest competitor
        │
        ▼
EQ Leaderboard → verify Hume leads on EQ dimension
        │
        ▼
API → confirm partner integrations can pull latest scores
```

---

## Terminology Alignment

| Previous label (pre-PMM) | Current screen label | PMM component name |
|---|---|---|
| Studies | Eval Suite | Eval Suite |
| StudyRunner | Human Ratings | Human Ratings Engine |
| Scenario Packs | *(merged into Golden Sets)* | Golden Sets Library |
| Golden Sets | Golden Sets | Golden Sets Library |
| Label Data | Data Explorer | Data Explorer |
| *(new)* | Hyper Data | Hyper Data |
| *(new)* | AutoEval | AutoEval |
| *(new)* | EQ Leaderboard | EQ Leaderboard |
| Switchboard | Switchboard | Hume Switchboard |
| API | API | Unified API |

---

## What Is Not Built Yet

Two PMM components are not yet represented as standalone screens:

| PMM Component | Current status | Recommended next step |
|---|---|---|
| **Data Processing Pipeline** | Backend only; outputs visible in Data Explorer | Build a pipeline configuration screen when external customers need to configure their own ingestion |
| **Rater Management** | Accessible only through Human Ratings overlays | Promote to a dedicated screen when rater pool size warrants it (>50 active raters) |

---

*Document prepared for internal handover. For questions on screen design decisions, see the pull request at `Andrew-hume-23/Claude-Code/pull/1`.*
