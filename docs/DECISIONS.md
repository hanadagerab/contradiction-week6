# CONTRADICTION — Locked Decisions

## Product

CONTRADICTION is a browser-based 3D behavioral rehearsal.

The product stays narrow:

> One contradiction. One decision. One transfer test.

## User

Primary user:

> A public-primary-school teacher in Mexico City responsible for a class during evacuation.

The teacher is responsible for keeping the class together and responding appropriately to changing conditions.

The teacher is not assumed to be the formal authority who independently redesigns the evacuation route.

## Behavioral Failure

Primary failure:

> Unsafe persistence: continuing the rehearsed sequence when validated evidence indicates that automatic continuation is no longer appropriate.

The behavior of interest is whether the teacher interrupts the rehearsed sequence when a predefined valid safety cue conflicts with continuation.

## Primary Vacuum

Primary vacuum:

> Compliance-upgrade.

Traditional rehearsal can confirm whether a person follows procedure.

This experiment tests whether the person can recognize when procedure should stop governing behavior automatically.

## Proof

Primary proof:

> Transfer success.

The target judgment must appear again in a different simulated scenario with the same underlying conflict.

Transfer in this product is:

> Digital-to-digital transfer.

It is not evidence of real-world earthquake readiness.

## Three Rehearsals

1. Baseline
   - no validated contradiction;
   - continuation is appropriate.

2. Controlled Contradiction
   - predefined valid safety cue appears;
   - crowd continues;
   - user decides whether to continue or interrupt;
   - interruption must be followed by a simulated safety handoff.

3. Transfer
   - different surface details;
   - same underlying behavioral conflict;
   - deterministic adaptation based on previous behavior.

## Valid Interruption

Interruption is only behaviorally valid when a predefined scenario cue has been designated as requiring reassessment.

The system must not teach:

> interruption is always safer.

Baseline exists specifically to preserve this distinction.

## Civil-Protection Boundary

Target sequence:

> recognize → interrupt → trigger appropriate next action

After interruption, the teacher triggers the simulated civil-protection handoff.

The teacher does not independently select or redesign a new evacuation route.

## Measurement

The system may observe:

- decision;
- cue onset;
- decision time;
- latency;
- progress at decision;
- commitment threshold crossed;
- handoff triggered;
- input method.

The product must not generate:

- preparedness scores;
- readiness percentages;
- rankings;
- stars;
- pass/fail labels;
- real-world competence claims.

## Claim Boundary

The product measures a simulated decision under controlled conditions.

It must never claim:

- earthquake readiness;
- real-world competence;
- panic behavior;
- guaranteed safety;
- school preparedness;
- real-world behavioral prediction.

Required interpretation:

> Digital-to-digital transfer is evidence beyond one practiced scene. It is not proof of real-world transfer.

## Technology

Use the simplest implementation that preserves the behavioral experiment.

Required stack:

- Next.js
- TypeScript
- React
- Three.js
- React Three Fiber

Desktop browser is the required working experience.

Do not claim true VR or WebXR capability unless it is actually implemented.

Preferred description:

> Browser-based 3D simulation.

## Build Rule

At every implementation decision ask:

> Does this materially improve our ability to test unsafe persistence or transfer?

If no, cut it.
