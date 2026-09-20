"use client";

import { useRef, useState } from "react";
import EvacuationScene from "@/components/EvacuationScene";
import { SCENARIO_CONFIG } from "@/lib/scenarioConfig";
import {
  selectTransferVariant,
  type TransferVariant,
} from "@/lib/transferLogic";
import { useInterruptVoice } from "@/hooks/useInterruptVoice";

type Stage =
  | "overview"
  | "boundary"
  | "baseline"
  | "contradiction"
  | "evidence"
  | "transfer"
  | "final";

type Decision = "continue" | "interrupt" | null;

type Observation = {
  decision: Exclude<Decision, null>;
  decisionTime: number;
  latencyMs: number | null;
  progressAtDecision: number;
  thresholdCrossed: boolean;
  inputMethod: "button";
  handoffTriggered: boolean;
};

const rehearsals = [
  {
    number: "01",
    title: "Baseline",
    text: "A normal evacuation sequence with no validated contradiction. Continuation is appropriate.",
  },
  {
    number: "02",
    title: "Contradiction",
    text: "A safety cue conflicts with the familiar route while the surrounding group continues moving.",
  },
  {
    number: "03",
    title: "Transfer",
    text: "A new simulated scenario tests whether the same judgment appears under different surface conditions.",
  },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>("overview");
  const [runId, setRunId] = useState(0);
  const [decision, setDecision] = useState<Decision>(null);
  const [progress, setProgress] = useState(0);

  const [cueActive, setCueActive] = useState(false);
  const cueStartedAtRef = useRef<number | null>(null);

  const [observation, setObservation] =
    useState<Observation | null>(null);

  const [handoffTriggered, setHandoffTriggered] =
    useState(false);

  const [transferVariant, setTransferVariant] =
    useState<TransferVariant>("clearer-retest");

  const [baselineResult, setBaselineResult] =
    useState<Decision>(null);

  const [contradictionResult, setContradictionResult] =
    useState<Observation | null>(null);

  const [transferResult, setTransferResult] =
    useState<Observation | null>(null);

  const resetMeasurement = () => {
    setDecision(null);
    setProgress(0);
    setCueActive(false);
    cueStartedAtRef.current = null;
    setObservation(null);
    setHandoffTriggered(false);
  };

  const startBaseline = () => {
    resetMeasurement();
    setBaselineResult(null);
    setRunId((current) => current + 1);
    setStage("baseline");
  };

  const startContradiction = () => {
    resetMeasurement();
    setRunId((current) => current + 1);
    setStage("contradiction");
  };

  const handleCueChange = (active: boolean) => {
    if (!active || cueStartedAtRef.current !== null) return;

    cueStartedAtRef.current = performance.now();
    setCueActive(true);
  };

  const startTransfer = () => {
    if (!contradictionResult) return;

    const selectedVariant = selectTransferVariant({
      decision: contradictionResult.decision,
      thresholdCrossed: contradictionResult.thresholdCrossed,
      handoffTriggered: contradictionResult.handoffTriggered,
    });

    resetMeasurement();
    setTransferVariant(selectedVariant);
    setRunId((current) => current + 1);
    setStage("transfer");
  };

  const triggerSafetyHandoff = () => {
    if (!observation || observation.decision !== "interrupt") return;

    setHandoffTriggered(true);

    setObservation((current) =>
      current
        ? {
            ...current,
            handoffTriggered: true,
          }
        : current
    );

    if (stage === "contradiction") {
      setContradictionResult((current) =>
        current
          ? {
              ...current,
              handoffTriggered: true,
            }
          : current
      );
    }

    if (stage === "transfer") {
      setTransferResult((current) =>
        current
          ? {
              ...current,
              handoffTriggered: true,
            }
          : current
      );
    }
  };

  const recordContradictionDecision = (
    selectedDecision: Exclude<Decision, null>
  ) => {
    if (decision) return;

    // Contradiction and Transfer decisions only count
    // after the predefined safety cue has appeared.
    if (cueStartedAtRef.current === null) return;

    const decisionTime = performance.now();

    const latencyMs =
      cueStartedAtRef.current !== null
        ? decisionTime - cueStartedAtRef.current
        : null;

    setDecision(selectedDecision);

    const newObservation: Observation = {
      decision: selectedDecision,
      decisionTime,
      latencyMs,
      progressAtDecision: progress,
      thresholdCrossed:
        progress >=
        SCENARIO_CONFIG.contradiction
          .commitmentThreshold,
      inputMethod: "button",
      handoffTriggered: false,
    };

    setObservation(newObservation);

    if (stage === "contradiction") {
      setContradictionResult(newObservation);
    }

    if (stage === "transfer") {
      setTransferResult(newObservation);
    }
  };

  const voiceDecisionEnabled =
    (stage === "contradiction" ||
      stage === "transfer") &&
    cueActive &&
    decision === null;

  const {
    supported: voiceSupported,
    listening: voiceListening,
    startListening,
  } = useInterruptVoice(
    voiceDecisionEnabled,
    () =>
      recordContradictionDecision("interrupt")
  );

  if (stage === "baseline") {
    const paused = decision === "interrupt";

    return (
      <main className="simulation-page">
        <section className="simulation-header">
          <div>
            <div className="eyebrow">
              REHEARSAL 01 / BASELINE
            </div>

            <h1 className="simulation-title">
              Normal sequence
            </h1>
          </div>

          <div className="scenario-status">
            <span className="status-dot" />
            No validated contradiction
          </div>
        </section>

        <section className="simulation-frame">
          <EvacuationScene
            key={`baseline-${runId}`}
            scenario="baseline"
            teacherPaused={paused}
            onProgressChange={setProgress}
          />

          <div className="scene-label">
            <span>FICTIONAL SCHOOL CORRIDOR</span>
            <strong>
              Follow the marked evacuation sequence.
            </strong>
          </div>
        </section>

        <section className="decision-panel">
          <div className="decision-context">
            <span>ROUTE PROGRESS</span>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.round(
                    progress * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {!decision ? (
            <div className="decision-actions">
              <button
                className="secondary-action"
                onClick={() => {
                  setDecision("interrupt");
                  setBaselineResult("interrupt");
                }}
              >
                INTERRUPT MOVEMENT
              </button>

              <button
                className="primary-action"
                onClick={() => {
                  setDecision("continue");
                  setBaselineResult("continue");
                }}
              >
                CONTINUE WITH THE GROUP
              </button>
            </div>
          ) : (
            <div className="baseline-observation">
              <div>
                <span>
                  OBSERVED IN THIS REHEARSAL
                </span>

                <strong>
                  {decision === "continue"
                    ? "You chose to continue the rehearsed sequence."
                    : "You chose to interrupt the rehearsed sequence."}
                </strong>

                <p>
                  No validated safety contradiction was
                  present in this baseline scenario.
                </p>
              </div>

              <div className="observation-actions">
                <button
                  className="secondary-action"
                  onClick={startBaseline}
                >
                  RESTART BASELINE
                </button>

                <button
                  className="primary-action"
                  onClick={startContradiction}
                >
                  CONTINUE TO CONTRADICTION
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (stage === "evidence" && observation) {
    return (
      <main className="page-shell">
        <section className="evidence-card">
          <div className="eyebrow">
            MILESTONE 1 / OBSERVED IN THIS SIMULATION
          </div>

          <h1 className="evidence-title">
            Behavioral evidence
          </h1>

          <p className="evidence-intro">
            This screen reports only what was observed in this controlled
            simulated scenario.
          </p>

          <div className="evidence-grid">
            <article className="evidence-item">
              <span>DECISION</span>
              <strong>
                {observation.decision === "interrupt"
                  ? "Interrupt movement"
                  : "Continue with the group"}
              </strong>
            </article>

            <article className="evidence-item">
              <span>CUE → DECISION TIME</span>
              <strong>
                {observation.latencyMs !== null
                  ? `${(observation.latencyMs / 1000).toFixed(2)} s`
                  : "Decision occurred before cue"}
              </strong>
            </article>

            <article className="evidence-item">
              <span>PROGRESS AT DECISION</span>
              <strong>
                {Math.round(observation.progressAtDecision * 100)}%
              </strong>
            </article>

            <article className="evidence-item">
              <span>COMMITMENT THRESHOLD</span>
              <strong>
                {observation.thresholdCrossed
                  ? "Crossed before decision"
                  : "Not crossed before decision"}
              </strong>
            </article>

            <article className="evidence-item">
              <span>SAFETY HANDOFF</span>
              <strong>
                {observation.handoffTriggered
                  ? "Triggered"
                  : "Not triggered"}
              </strong>
            </article>

            <article className="evidence-item">
              <span>INPUT METHOD</span>
              <strong>Button</strong>
            </article>
          </div>

          <div className="claim-boundary">
            <strong>Claim boundary</strong>
            <p>
              This simulation observed one decision under controlled conditions.
              It does not predict your behavior during a real earthquake.
            </p>
          </div>

          <div className="evidence-actions">
            <button
              className="secondary-action"
              onClick={startContradiction}
            >
              REPEAT CONTRADICTION
            </button>

            <button
              className="primary-action"
              onClick={startTransfer}
            >
              CONTINUE TO TRANSFER
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (stage === "contradiction") {
    const teacherPaused =
      decision === "interrupt";

    return (
      <main className="simulation-page">
        <section className="simulation-header">
          <div>
            <div className="eyebrow">
              REHEARSAL 02 / CONTROLLED CONTRADICTION
            </div>

            <h1 className="simulation-title">
              Same sequence. Changed conditions.
            </h1>
          </div>

          <div className="scenario-status">
            <span className="status-dot" />
            Controlled rehearsal
          </div>
        </section>

        <section className="simulation-frame">
          <EvacuationScene
            key={`contradiction-${runId}`}
            scenario="contradiction"
            teacherPaused={teacherPaused}
            onProgressChange={setProgress}
            onCueChange={handleCueChange}
          />

          <div className="scene-label">
            <span>FICTIONAL SCHOOL CORRIDOR</span>

            <strong>
              Continue observing the route and
              surrounding movement.
            </strong>
          </div>
        </section>

        <section className="decision-panel">
          {!observation ? (
            <>
              <div className="decision-context">
                <span>ROUTE PROGRESS</span>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.round(
                        progress * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="decision-actions">
                <button
                  className="secondary-action"
                  onClick={() =>
                    recordContradictionDecision(
                      "interrupt"
                    )
                  }
                >
                  INTERRUPT MOVEMENT
                </button>

                <button
                  className="primary-action"
                  onClick={() =>
                    recordContradictionDecision(
                      "continue"
                    )
                  }
                >
                  CONTINUE WITH THE GROUP
                </button>
              </div>
            </>
          ) : (
            <div className="baseline-observation">
              <div>
                <span>
                  OBSERVED IN THIS SIMULATION
                </span>

                <strong>
                  {observation.decision === "interrupt"
                    ? "Movement interrupted."
                    : "Rehearsed sequence continued."}
                </strong>

                <p>
                  Decision at{" "}
                  {Math.round(
                    observation.progressAtDecision *
                      100
                  )}
                  % route progress ·{" "}
                  {observation.latencyMs !== null
                    ? `${(
                        observation.latencyMs / 1000
                      ).toFixed(2)} s after cue`
                    : "before cue"}{" "}
                  · threshold{" "}
                  {observation.thresholdCrossed
                    ? "crossed"
                    : "not crossed"}
                </p>

                {observation.decision === "interrupt" && (
                  <div className="handoff-state">
                    {!handoffTriggered ? (
                      <>
                        <p>
                          Movement is paused. The next action belongs within
                          the school&apos;s civil-protection structure.
                        </p>

                        <button
                          className="primary-action"
                          onClick={triggerSafetyHandoff}
                        >
                          TRIGGER SAFETY HANDOFF
                        </button>
                      </>
                    ) : (
                      <>
                        <strong>
                          Simulated handoff activated
                        </strong>

                        <p>
                          The designated civil-protection role now owns the
                          next procedural action.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="observation-actions">
                <button
                  className="secondary-action"
                  onClick={startContradiction}
                >
                  RESTART CONTRADICTION
                </button>

                <button
                  className="primary-action"
                  onClick={() =>
                    setStage("evidence")
                  }
                >
                  VIEW EVIDENCE
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (stage === "transfer") {
    const teacherPaused =
      decision === "interrupt";

    return (
      <main className="simulation-page">
        <section className="simulation-header">
          <div>
            <div className="eyebrow">
              REHEARSAL 03 / TRANSFER
            </div>

            <h1 className="simulation-title">
              New surface. Same judgment.
            </h1>
          </div>

          <div className="scenario-status">
            <span className="status-dot" />
            Digital transfer test
          </div>
        </section>

        <section className="simulation-frame">
          <EvacuationScene
            key={`transfer-${runId}`}
            scenario="transfer"
            teacherPaused={teacherPaused}
            onProgressChange={setProgress}
            onCueChange={handleCueChange}
            transferVariant={transferVariant}
          />

          <div className="scene-label">
            <span>FICTIONAL SCHOOL CORRIDOR</span>

            <strong>
              Surface conditions differ from the previous rehearsal.
            </strong>
          </div>
        </section>

        <section className="decision-panel">
          {!observation ? (
            <>
              <div className="decision-context">
                <span>ROUTE PROGRESS</span>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.round(progress * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="decision-actions">
                {!cueActive ? (
                  <div className="decision-waiting">
                    OBSERVE CONDITIONS
                  </div>
                ) : (
                  <>
                    <button
                      className="secondary-action"
                      onClick={() =>
                        recordContradictionDecision("interrupt")
                      }
                    >
                      INTERRUPT MOVEMENT
                    </button>

                    <button
                      className="primary-action"
                      onClick={() =>
                        recordContradictionDecision("continue")
                      }
                    >
                      CONTINUE WITH THE GROUP
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="baseline-observation">
              <div>
                <span>
                  OBSERVED IN TRANSFER
                </span>

                <strong>
                  {observation.decision === "interrupt"
                    ? "Movement interrupted."
                    : "Rehearsed sequence continued."}
                </strong>

                <p>
                  Decision at{" "}
                  {Math.round(
                    observation.progressAtDecision * 100
                  )}
                  % route progress ·{" "}
                  {observation.latencyMs !== null
                    ? `${(
                        observation.latencyMs / 1000
                      ).toFixed(2)} s after cue`
                    : "before cue"}{" "}
                  · threshold{" "}
                  {observation.thresholdCrossed
                    ? "crossed"
                    : "not crossed"}
                </p>

                {observation.decision === "interrupt" && (
                  <div className="handoff-state">
                    {!handoffTriggered ? (
                      <>
                        <p>
                          Movement is paused. Trigger the next action
                          within the school&apos;s civil-protection
                          structure.
                        </p>

                        <button
                          className="primary-action"
                          onClick={triggerSafetyHandoff}
                        >
                          TRIGGER SAFETY HANDOFF
                        </button>
                      </>
                    ) : (
                      <>
                        <strong>
                          Simulated handoff activated
                        </strong>

                        <p>
                          The designated civil-protection role now owns
                          the next procedural action.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="observation-actions">
                <button
                  className="secondary-action"
                  onClick={startTransfer}
                >
                  RESTART TRANSFER
                </button>

                <button
                  className="primary-action"
                  onClick={() => setStage("final")}
                >
                  VIEW FINAL EVIDENCE
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (
    stage === "final" &&
    baselineResult &&
    contradictionResult &&
    transferResult
  ) {
    const transferComplete =
      transferResult.decision === "interrupt" &&
      !transferResult.thresholdCrossed &&
      transferResult.handoffTriggered;

    return (
      <main className="page-shell">
        <section className="final-evidence-card">
          <div className="eyebrow">
            FINAL EVIDENCE / THREE REHEARSALS
          </div>

          <h1 className="evidence-title">
            What was observed
          </h1>

          <p className="evidence-intro">
            The comparison below reports simulated behavior only.
          </p>

          <div className="rehearsal-comparison">
            <article className="comparison-card">
              <span className="comparison-number">01</span>
              <h2>Baseline</h2>

              <dl>
                <div>
                  <dt>Decision</dt>
                  <dd>
                    {baselineResult === "continue"
                      ? "Continue with the group"
                      : "Interrupt movement"}
                  </dd>
                </div>

                <div>
                  <dt>Safety contradiction</dt>
                  <dd>None presented</dd>
                </div>
              </dl>
            </article>

            <article className="comparison-card">
              <span className="comparison-number">02</span>
              <h2>Contradiction</h2>

              <dl>
                <div>
                  <dt>Decision</dt>
                  <dd>
                    {contradictionResult.decision === "interrupt"
                      ? "Interrupt movement"
                      : "Continue with the group"}
                  </dd>
                </div>

                <div>
                  <dt>Cue → decision</dt>
                  <dd>
                    {contradictionResult.latencyMs !== null
                      ? `${(
                          contradictionResult.latencyMs / 1000
                        ).toFixed(2)} s`
                      : "No post-cue decision"}
                  </dd>
                </div>

                <div>
                  <dt>Commitment threshold</dt>
                  <dd>
                    {contradictionResult.thresholdCrossed
                      ? "Crossed before decision"
                      : "Not crossed before decision"}
                  </dd>
                </div>

                <div>
                  <dt>Safety handoff</dt>
                  <dd>
                    {contradictionResult.handoffTriggered
                      ? "Triggered"
                      : "Not triggered"}
                  </dd>
                </div>
              </dl>
            </article>

            <article className="comparison-card">
              <span className="comparison-number">03</span>
              <h2>Transfer</h2>

              <dl>
                <div>
                  <dt>Decision</dt>
                  <dd>
                    {transferResult.decision === "interrupt"
                      ? "Interrupt movement"
                      : "Continue with the group"}
                  </dd>
                </div>

                <div>
                  <dt>Cue → decision</dt>
                  <dd>
                    {transferResult.latencyMs !== null
                      ? `${(
                          transferResult.latencyMs / 1000
                        ).toFixed(2)} s`
                      : "No post-cue decision"}
                  </dd>
                </div>

                <div>
                  <dt>Commitment threshold</dt>
                  <dd>
                    {transferResult.thresholdCrossed
                      ? "Crossed before decision"
                      : "Not crossed before decision"}
                  </dd>
                </div>

                <div>
                  <dt>Safety handoff</dt>
                  <dd>
                    {transferResult.handoffTriggered
                      ? "Triggered"
                      : "Not triggered"}
                  </dd>
                </div>
              </dl>
            </article>
          </div>

          <div className="transfer-observation">
            <span>TRANSFER OBSERVATION</span>

            <strong>
              {transferComplete
                ? "The target judgment appeared again in a new simulated scenario."
                : "The target judgment did not transfer completely to the new simulated scenario."}
            </strong>

            <p>
              Digital-to-digital transfer is evidence beyond one practiced
              scene. It is not proof of real-world transfer.
            </p>
          </div>

          <div className="claim-boundary">
            <strong>Claim boundary</strong>

            <p>
              These rehearsals observed decisions under controlled simulated
              conditions. They do not measure earthquake readiness, predict
              real-world behavior, or certify competence.
            </p>
          </div>

          <div className="evidence-actions">
            <button
              className="primary-action"
              onClick={() => setStage("overview")}
            >
              RETURN TO OVERVIEW
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (stage === "boundary") {
    return (
      <main className="page-shell">
        <section className="boundary-card">
          <div className="eyebrow">
            ROLE BOUNDARY
          </div>

          <h1>
            Your responsibility is the class.
          </h1>

          <div className="boundary-copy">
            <p>
              You are responsible for keeping your
              class together and responding
              appropriately to changing conditions.
            </p>

            <p>
              You are not being asked to independently
              redesign the school evacuation route.
            </p>

            <p>
              If new evidence makes automatic
              continuation inappropriate, your task is
              to interrupt movement and trigger the next
              action within the school&apos;s
              civil-protection structure.
            </p>
          </div>

          <div className="action-preview">
            <span>
              During the rehearsals, your decisions may
              include:
            </span>

            <div className="action-list">
              <div>CONTINUE WITH THE GROUP</div>
              <div>INTERRUPT MOVEMENT</div>
              <div>TRIGGER SAFETY HANDOFF</div>
            </div>
          </div>

          <div className="boundary-buttons">
            <button
              className="secondary-action"
              onClick={() =>
                setStage("overview")
              }
            >
              BACK
            </button>

            <button
              className="primary-button"
              onClick={startBaseline}
            >
              START BASELINE
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="eyebrow">
          BROWSER-BASED 3D SIMULATION
        </div>

        <h1>CONTRADICTION</h1>

        <p className="subtitle">
          A controlled rehearsal of the moment when
          following the plan becomes the wrong behavior.
        </p>

        <p className="intro">
          You will complete three short evacuation
          rehearsals. The objective is not to find the
          perfect escape route. The objective is to
          decide when the rehearsed sequence should
          continue — and when new evidence requires you
          to interrupt it.
        </p>

        <div className="rehearsal-grid">
          {rehearsals.map((rehearsal) => (
            <article
              className="rehearsal-card"
              key={rehearsal.number}
            >
              <span className="number">
                {rehearsal.number}
              </span>

              <h2>{rehearsal.title}</h2>
              <p>{rehearsal.text}</p>
            </article>
          ))}
        </div>

        <div className="footer-row">
          <p>
            This experience observes decisions inside
            controlled simulated scenarios. It does not
            measure real-world earthquake readiness.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              setStage("boundary")
            }
          >
            BEGIN
          </button>
        </div>
      </section>
    </main>
  );
}
