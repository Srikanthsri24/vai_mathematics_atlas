import { useState } from "react";
import { useLab } from "../parameters";
import { Formula } from "../components";
export default function LimitLesson({ section }: { section: string }) {
  const { values, set } = useLab(),
    a = Number(values.a),
    [answer, A] = useState(""),
    [feedback, F] = useState("");
  return (
    <section className="lesson-panel rich-lesson">
      <span className="eyebrow">
        LIMITS · FROM NEARBY VALUES TO A PRECISE CLAIM
      </span>
      {section === "Understand" && (
        <>
          <h2>Approaching a point does not require reaching it</h2>
          <p>
            A limit describes what the output approaches when the input gets
            arbitrarily close to a chosen point. The function’s value at that
            exact point is a separate question. Think of watching where a moving
            cursor is heading, rather than reading only its final position.
          </p>
          <Formula tex="\lim_{x\to a}f(x)=L" />
          <p>
            Read this as: “as x approaches a, f(x) approaches L.” x is the
            moving input, a is the point being approached, and L is the proposed
            limiting output. Both the left and right approaches must agree for a
            two-sided finite limit.
          </p>
          <div className="explanation-grid">
            <article>
              <h3>Continuous example</h3>
              <p>
                For f(x)=x² near x=1, inputs 0.99 and 1.01 give outputs 0.9801
                and 1.0201. Moving closer brings both outputs closer to 1. Here
                the limit and the actual value f(1) are both 1.
              </p>
            </article>
            <article>
              <h3>A missing value can still have a limit</h3>
              <p>
                For f(x)=(x²−1)/(x−1), the original formula is undefined at 1.
                Away from 1 it simplifies to x+1, so the outputs approach 2 from
                either side. The hole does not prevent a limit.
              </p>
            </article>
          </div>
          <p className="misconception">
            Substitution producing 0/0 does not prove the limit is zero or
            nonexistent. It tells you that direct substitution has failed.
          </p>
        </>
      )}
      {section === "Explore" && (
        <>
          <h2>Read both sides of the same point</h2>
          <p>
            In the linked model below, a is the approach point and h is the
            signed distance from it. The moving point is x=a+h. Keep a fixed and
            reduce |h| first with positive values, then with negative values.
          </p>
          <div className="button-row">
            {[0.1, 0.01, -0.01, -0.1].map((h) => (
              <button key={h} onClick={() => set({ b: h })}>
                h = {h}
              </button>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>Distance |h|</th>
                <th>Left: (a−h)²</th>
                <th>Right: (a+h)²</th>
                <th>Proposed limit</th>
              </tr>
            </thead>
            <tbody>
              {[0.1, 0.01, 0.001, 0.0001].map((h) => (
                <tr key={h}>
                  <td>{h}</td>
                  <td>{((a - h) ** 2).toFixed(6)}</td>
                  <td>{((a + h) ** 2).toFixed(6)}</td>
                  <td>{a * a}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            The table gives numerical evidence. To justify “arbitrarily close,”
            we also need a bound that works for every sufficiently small
            distance.
          </p>
        </>
      )}
      {section === "Why" && (
        <>
          <h2>How the limit claim is justified</h2>
          <ol className="reasoned-steps">
            <li>
              <strong>Choose the target</strong>
              <p>For x² near a, propose L=a². Write x=a+h with h≠0.</p>
            </li>
            <li>
              <strong>Measure the error</strong>
              <p>
                (a+h)²−a²=2ah+h²=h(2a+h). Thus the output error is |h|·|2a+h|.
              </p>
            </li>
            <li>
              <strong>Bound the error</strong>
              <p>
                If |h|&lt;1, then |2a+h|≤2|a|+1. The output error is less than
                |h|(2|a|+1).
              </p>
            </li>
            <li>
              <strong>Make the error as small as requested</strong>
              <p>
                For any allowed output error ε&gt;0, choose δ=min(1,
                ε/(2|a|+1)). Then 0&lt;|h|&lt;δ guarantees |(a+h)²−a²|&lt;ε.
              </p>
            </li>
          </ol>
          <p>
            This proves the limit a² because it works for every positive
            tolerance, on both sides. A finite list of nearby values alone
            cannot do that.
          </p>
        </>
      )}
      {section === "Formula" && (
        <>
          <h2>The precise definition and why it exists</h2>
          <Formula tex="\forall\varepsilon>0\;\exists\delta>0:\quad 0<|x-a|<\delta\Rightarrow|f(x)-L|<\varepsilon" />
          <p>
            ε is how close the output must be to L. δ is a distance we choose to
            keep the input close enough to a. The condition 0&lt;|x−a|
            deliberately excludes x=a, allowing functions with a hole.
          </p>
          <p>
            The order matters: the requested output tolerance comes first; we
            then choose an input neighborhood that guarantees it. This replaces
            the vague phrase “very close” with a checkable mathematical promise.
          </p>
          <h3>Useful rules</h3>
          <p>
            If two finite limits exist, their sum and product have the
            corresponding summed or multiplied limits. A quotient rule
            additionally requires the denominator’s limiting value to be
            nonzero. Polynomials are continuous, so direct substitution works
            for them.
          </p>
          <p className="misconception">
            The quotient rule cannot be applied to (x²−1)/(x−1) at x=1 before
            simplifying, because the denominator tends to zero.
          </p>
        </>
      )}
      {section === "Examples" && (
        <div className="examples-grid">
          {[
            [
              "Polynomial",
              "Find lim x→2 of x²+3x.",
              [
                "Polynomials are continuous for every real input.",
                "Substitute 2: 2²+3·2=4+6.",
                "The limit is 10. The function value is also 10.",
              ],
            ],
            [
              "Removable hole",
              "Find lim x→1 of (x²−1)/(x−1).",
              [
                "Direct substitution gives 0/0; this is not a value.",
                "Factor x²−1=(x−1)(x+1). For x≠1 cancel the shared nonzero factor.",
                "The nearby values equal x+1, so the limit is 2. The original function remains undefined at 1.",
              ],
            ],
            [
              "Unequal sides",
              "Find the two-sided limit of |x|/x at zero.",
              [
                "For x>0, |x|/x=1, so the right-hand limit is 1.",
                "For x<0, |x|/x=−1, so the left-hand limit is −1.",
                "Since they disagree, the two-sided limit does not exist.",
              ],
            ],
            [
              "Unbounded behavior",
              "What happens to 1/x² as x→0?",
              [
                "For any nonzero x, 1/x² is positive.",
                "To exceed any M>0, choose 0<|x|<1/√M.",
                "The outputs grow without bound on both sides. This is an infinite limit, not a finite real number.",
              ],
            ],
          ].map(([title, q, steps]) => (
            <article className="worked-example" key={String(title)}>
              <small>{String(title)}</small>
              <h3>{String(q)}</h3>
              <ol>
                {(steps as string[]).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      )}
      {section === "Real life" && (
        <>
          <h2>From average change to an instantaneous measurement</h2>
          <p>
            A motion model s(t)=t² metres describes position. Between times 2
            and 2+h seconds, the average velocity is [(2+h)²−4]/h=4+h metres per
            second. As h tends to zero, these interval averages approach 4 m/s.
            That limiting rate is the instantaneous velocity at 2 seconds.
          </p>
          <ol>
            <li>
              Choose the quantity and its units: position in metres, time in
              seconds.
            </li>
            <li>
              Measure a change over a nonzero interval; do not divide by zero.
            </li>
            <li>
              Shrink the interval and check whether both approaches agree.
            </li>
            <li>
              Interpret the limiting result as a rate, with units metres per
              second.
            </li>
          </ol>
          <div className="explanation-grid">
            <article>
              <h3>Flow sensor</h3>
              <p>
                If accumulated water is V(t)=3t² litres, average flow near 2
                seconds is 12+3h L/s and approaches 12 L/s. Small intervals
                connect an accumulated reading to the current flow.
              </p>
            </article>
            <article>
              <h3>Manufacturing tolerance</h3>
              <p>
                A square panel with side 1+h metres has area 1+2h+h² m².
                Bounding h bounds the area error. This connects the ε–δ idea to
                selecting a dimensional tolerance, while physical measurements
                still have uncertainty.
              </p>
            </article>
            <article>
              <h3>A discontinuous pricing rule</h3>
              <p>
                If a fare jumps at a distance threshold, readings from either
                side may approach different prices. There is no common two-sided
                limit at the jump; a smooth-looking sample elsewhere cannot
                remove that discontinuity.
              </p>
            </article>
          </div>
        </>
      )}
      {section === "Challenge" && (
        <>
          <h2>Real-life challenge: choose the correct flow rate</h2>
          <p>
            A tank’s accumulated volume is V(t)=3t² litres. Estimate the
            instantaneous inflow at t=4 seconds by deriving the limit of
            [V(4+h)−V(4)]/h. Assume this smooth model remains valid near 4
            seconds.
          </p>
          <label>
            Flow rate in L/s
            <input
              aria-label="Limit real-life challenge answer"
              type="number"
              value={answer}
              onChange={(e) => {
                A(e.target.value);
                F("");
              }}
            />
          </label>
          <button
            onClick={() =>
              F(
                answer.trim() && Number(answer) === 24
                  ? "Correct: the quotient simplifies to 24+3h, so the limiting inflow is 24 L/s."
                  : "Expand 3(4+h)², subtract 48, divide by nonzero h, then let h approach zero.",
              )
            }
          >
            Check my answer
          </button>
          <p role="status">{feedback}</p>
          <details>
            <summary>Worked reasoning</summary>
            <ol>
              <li>V(4+h)−V(4)=3(16+8h+h²)−48=24h+3h².</li>
              <li>For h≠0, the average rate is 24+3h L/s.</li>
              <li>Both sides approach 24 L/s as h→0.</li>
              <li>
                The tank contains 48 litres at t=4; that volume is different
                from its inflow rate.
              </li>
            </ol>
          </details>
        </>
      )}
    </section>
  );
}
