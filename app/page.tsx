"use client";

import { useState } from "react";

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
  const [started, setStarted] = useState(false);

  if (started) {
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
            <span>Later in the simulation, your available actions will be:</span>

            <div className="action-list">
              <div>CONTINUE WITH THE GROUP</div>
              <div>INTERRUPT MOVEMENT</div>
              <div>TRIGGER SAFETY HANDOFF</div>
            </div>
          </div>

          <button className="primary-button" onClick={() => setStarted(false)}>
            BACK TO OVERVIEW
          </button>
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

          <button className="primary-button" onClick={() => setStarted(true)}>
            BEGIN
          </button>
        </div>
      </section>
    </main>
  );
}
