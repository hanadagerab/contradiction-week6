"use client";

import { useState } from "react";
import BaselineScene from "@/components/BaselineScene";

type Stage = "overview" | "boundary" | "baseline";
type Decision = "continue" | "interrupt" | null;

const rehearsals = [
  {
    number: "01",
    title: "Baseline",
    text: "A normal evacuation sequence with no validated contradiction. Continuation is appropriate.",
  },
  {
    number: "02",
    title: "Contradiction",
    text: "A validated safety cue conflicts with the familiar route while the surrounding group continues moving.",
  },
  {
    number: "03",
    title: "Transfer",
    text: "A new simulated scenario tests whether the same judgment appears under different surface conditions.",
  },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>("overview");
  const [decision, setDecision] = useState<Decision>(null);
  const [progress, setProgress] = useState(0);

  const resetBaseline = () => {
    setDecision(null);
    setProgress(0);
    setStage("baseline");
  };

  if (stage === "baseline") {
    const paused = decision === "interrupt";

    return (
      <main className="simulation-page">
        <section className="simulation-header">
          <div>
            <div className="eyebrow">REHEARSAL 01 / BASELINE</div>
            <h1 className="simulation-title">Normal sequence</h1>
          </div>

          <div className="scenario-status">
            <span className="status-dot" />
            No validated contradiction
          </div>
        </section>

        <section className="simulation-frame">
          <BaselineScene
            paused={paused}
            onProgressChange={setProgress}
          />

          <div className="scene-label">
            <span>FICTIONAL SCHOOL CORRIDOR</span>
            <strong>Follow the marked evacuation sequence.</strong>
          </div>
        </section>

        <section className="decision-panel">
          <div className="decision-context">
            <span>ROUTE PROGRESS</span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>

          {!decision ? (
            <div className="decision-actions">
              <button
                className="secondary-action"
                onClick={() => setDecision("interrupt")}
              >
                INTERRUPT MOVEMENT
              </button>

              <button
                className="primary-action"
                onClick={() => setDecision("continue")}
              >
                CONTINUE WITH THE GROUP
              </button>
            </div>
          ) : (
            <div className="baseline-observation">
              <div>
                <span>OBSERVED IN THIS REHEARSAL</span>

                <strong>
                  {decision === "continue"
                    ? "You chose to continue the rehearsed sequence."
                    : "You chose to interrupt the rehearsed sequence."}
                </strong>

                <p>
                  No validated safety contradiction was present in this baseline
                  scenario.
                </p>
              </div>

              <div className="observation-actions">
                <button
                  className="secondary-action"
                  onClick={resetBaseline}
                >
                  RESTART BASELINE
                </button>

                <button
                  className="primary-action"
                  onClick={() => setStage("overview")}
                >
                  RETURN TO OVERVIEW
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (stage === "boundary") {
    return (
      <main className="page-shell">
        <section className="boundary-card">
          <div className="eyebrow">ROLE BOUNDARY</div>

          <h1>Your responsibility is the class.</h1>

          <div className="boundary-copy">
            <p>
              You are responsible for keeping your class together and responding
              appropriately to changing conditions.
            </p>

            <p>
              You are not being asked to independently redesign the school
              evacuation route.
            </p>

            <p>
              If new evidence makes automatic continuation inappropriate, your
              task is to interrupt movement and trigger the next action within
              the school&apos;s civil-protection structure.
            </p>
          </div>

          <div className="action-preview">
            <span>During the rehearsals, your decisions may include:</span>

            <div className="action-list">
              <div>CONTINUE WITH THE GROUP</div>
              <div>INTERRUPT MOVEMENT</div>
              <div>TRIGGER SAFETY HANDOFF</div>
            </div>
          </div>

          <div className="boundary-buttons">
            <button
              className="secondary-action"
              onClick={() => setStage("overview")}
            >
              BACK
            </button>

            <button
              className="primary-button"
              onClick={resetBaseline}
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
        <div className="eyebrow">BROWSER-BASED 3D SIMULATION</div>

        <h1>CONTRADICTION</h1>

        <p className="subtitle">
          A controlled rehearsal of the moment when following the plan becomes
          the wrong behavior.
        </p>

        <p className="intro">
          You will complete three short evacuation rehearsals. The objective is
          not to find the perfect escape route. The objective is to decide when
          the rehearsed sequence should continue — and when new evidence
          requires you to interrupt it.
        </p>

        <div className="rehearsal-grid">
          {rehearsals.map((rehearsal) => (
            <article className="rehearsal-card" key={rehearsal.number}>
              <span className="number">{rehearsal.number}</span>
              <h2>{rehearsal.title}</h2>
              <p>{rehearsal.text}</p>
            </article>
          ))}
        </div>

        <div className="footer-row">
          <p>
            This experience observes decisions inside controlled simulated
            scenarios. It does not measure real-world earthquake readiness.
          </p>

          <button
            className="primary-button"
            onClick={() => setStage("boundary")}
          >
            BEGIN
          </button>
        </div>
      </section>
    </main>
  );
}
