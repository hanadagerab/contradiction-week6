# CONTRADICTION — Test Plan

## Purpose

Verify that the prototype correctly distinguishes the behavioral states required by the experiment.

The test plan evaluates the simulation logic.

It does not evaluate earthquake preparedness or real-world competence.

---

## Test A — Baseline Continue

### Setup

- Baseline rehearsal.
- No validated contradiction appears.
- Crowd movement remains normal.

### User action

> CONTINUE WITH THE GROUP

### Expected result

- simulation continues normally;
- no contradiction is recorded;
- continuation is treated as appropriate for this scenario;
- no safety handoff is required.

---

## Test B — Timely Interruption

### Setup

- Controlled Contradiction.
- Valid safety cue appears.
- Crowd continues moving.
- Commitment threshold has not yet been crossed.

### User action

> INTERRUPT MOVEMENT

Then:

> TRIGGER SAFETY HANDOFF

### Expected result

System records:

- decision = interrupt;
- thresholdCrossed = false;
- interruption timing before threshold;
- handoffTriggered = true;
- latency from cue onset;
- progress at decision.

Simulation pauses when interruption occurs.

After handoff, the interface shows:

> Simulated handoff activated

---

## Test C — Late Interruption

### Setup

- Controlled Contradiction.
- Valid safety cue appears.
- User continues long enough to cross the commitment threshold.

### User action

> INTERRUPT MOVEMENT

Then:

> TRIGGER SAFETY HANDOFF

### Expected result

System records:

- decision = interrupt;
- thresholdCrossed = true;
- interruption occurred after the commitment threshold;
- handoffTriggered = true;
- latency;
- progress at decision.

This case must remain distinguishable from timely interruption.

---

## Test D — Persistence

### Setup

- Controlled Contradiction.
- Valid safety cue appears.
- Crowd continues moving.

### User action

> CONTINUE WITH THE GROUP

### Expected result

System records:

- decision = continue;
- persistence after contradiction;
- relevant decision timing;
- route progress;
- whether threshold was crossed.

The product must describe what was observed neutrally.

No score or failure label is shown.

---

## Test E — Interrupt Without Handoff

### Setup

- Controlled Contradiction.
- Valid safety cue appears.

### User action

> INTERRUPT MOVEMENT

Do not trigger the safety handoff.

### Expected result

System records:

- decision = interrupt;
- handoffTriggered = false.

Interruption alone must not be represented as the full target behavior.

---

## Transfer Test

Transfer must change surface details while preserving the underlying conflict.

The transfer selector may adapt:

- ambiguity;
- crowd pressure;
- timing;
- cue presentation;
- environment.

It must never change the underlying safety truth based on user performance.

### Transfer success statement

If target behavior appears again:

> The target judgment appeared again in a new simulated scenario.

If it does not:

> The target judgment did not transfer completely to the new simulated scenario.

Always show:

> Digital-to-digital transfer is evidence beyond one practiced scene. It is not proof of real-world transfer.

---

## Evidence Debrief Checks

The evidence screen may show:

- Decision
- Cue → decision time
- Progress at decision
- Commitment threshold
- Safety handoff
- Input method

It must not show:

- score;
- stars;
- PASS / FAIL;
- preparedness percentage;
- competence rating;
- readiness prediction.

Required disclaimer:

> This simulation observed one decision under controlled conditions. It does not predict your behavior during a real earthquake.

---

## Browser / Product Checks

Before deployment confirm:

- app loads on desktop browser;
- no WASD or free-navigation requirement;
- simulation can be completed with buttons;
- 3D environment renders;
- decisions are deterministic;
- refresh does not produce a broken state;
- no personal data is requested;
- no database is required;
- no secret keys are present.

---

## Milestone 1 Exit Criteria

Before Transfer development begins, all of the following must work:

1. Baseline continue.
2. Timely interruption.
3. Late interruption.
4. Persistence.
5. Interrupt without handoff.
6. Neutral evidence debrief.
7. Public deployment works in an incognito window.
