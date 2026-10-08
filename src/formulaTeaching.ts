import type { FormulaEntry } from "./formulaCatalog";
import { parseExpression, printExpression } from "./expressionSteps.mjs";
export type FormulaTeaching = {
  idea: string;
  why: string;
  origin: string[];
  check: string;
};
const authored: Record<string, FormulaTeaching> = {};
function add(
  ids: string,
  idea: string,
  why: string,
  origin: string[],
  check: string,
) {
  for (const id of ids.split(" ")) authored[id] = { idea, why, origin, check };
}
add(
  "circle-area",
  "Area measures the surface inside a circle, not its boundary.",
  "Use area when buying material to cover a circular surface. Radius fixes its scale; doubling it creates four times the area.",
  [
    "Cut the circle into many equal sectors. Alternate their directions to make a nearly rectangular strip.",
    "The strip height approaches r. Its long edge approaches half the circumference: 2πr ÷ 2 = πr.",
    "Rectangle area is base × height, so the limiting area is πr × r = πr².",
    "Finite sectors have curved edges; equality follows as sector widths tend to zero, not from a finite rearrangement.",
  ],
  "An area must have squared length units. At radius zero the limiting area is zero.",
);
add(
  "rectangle-area square-area",
  "Area counts unit squares covering a flat region.",
  "Choose this relationship for tiles, floor space or the face of a rectangular object.",
  [
    "One row contains length ÷ unit-length squares. There are width ÷ unit-length rows.",
    "Multiply columns by rows to count all the squares: A = l × w.",
    "For a square, both dimensions are s, giving A = s × s = s².",
  ],
  "Doubling both dimensions multiplies the area by four; perimeter only doubles.",
);
add(
  "triangle-area parallelogram-area",
  "Perpendicular height measures the separation of parallel boundaries.",
  "This allows slanted outlines to be measured without confusing a sloping side with height.",
  [
    "Cut a triangular end from a parallelogram and slide it to the other end. This preserves area and forms a rectangle.",
    "The rectangle has base b and perpendicular height h, giving parallelogram area bh.",
    "Two congruent copies of a triangle form a parallelogram. Each triangle has half its area: bh/2.",
  ],
  "Use perpendicular height. A sloping side cannot usually replace h.",
);
add(
  "trapezium-area",
  "Parallel sides form the two bases of a trapezium.",
  "Useful for tapered plots, channels and panels with two parallel edges.",
  [
    "Rotate a congruent copy and fit it beside the original.",
    "Together they form a parallelogram of base a+b and perpendicular height h.",
    "Its area is (a+b)h. Divide by two for the original trapezium.",
  ],
  "If both parallel sides become equal, this reduces to rectangle area.",
);
add(
  "pythagoras-hyp pythagoras-leg",
  "A right triangle links the squares of its side lengths.",
  "Find an inaccessible diagonal when the two perpendicular distances are measurable.",
  [
    "Place four congruent right triangles in a square of side a+b. Their hypotenuses enclose a square of side c.",
    "Outer area is (a+b)². Triangle areas total 4(ab/2)=2ab.",
    "Subtract: c² = (a+b)² − 2ab = a²+b².",
    "Lengths are nonnegative, so c = √(a²+b²).",
  ],
  "This derivation requires a right angle. For other angles use the cosine rule.",
);
add(
  "point-distance distance-3d rectangle-diagonal cuboid-diagonal",
  "Coordinate differences measure perpendicular displacement components.",
  "Use distance to compare routes on a coordinate map or the diagonal inside a box.",
  [
    "Subtract corresponding coordinates to obtain each displacement component.",
    "In a plane, the horizontal and vertical changes form the legs of a right triangle. Apply Pythagoras.",
    "In three dimensions, apply Pythagoras again between the planar diagonal and vertical displacement: d²=Δx²+Δy²+Δz².",
    "Take the nonnegative square root to obtain a distance.",
  ],
  "Axes must be perpendicular and share a common scale.",
);
add(
  "simple-interest simple-amount",
  "Simple interest is proportional to the original principal and elapsed time.",
  "Use this teaching model when interest is calculated on the original principal only.",
  [
    "Convert the annual percentage r to the fraction r/100.",
    "One year contributes Pr/100 in interest.",
    "Over t years, multiply this annual amount by t: I=Prt/100.",
    "Add principal to interest to find the balance P+I.",
  ],
  "The annual rate and time in years must match. This is not compound interest.",
);
add(
  "compound-amount compound-interest periodic-compound",
  "Compounding makes each new balance the base for the next increase.",
  "Use it to model repeated percentage change rather than repeated fixed additions.",
  [
    "One percentage increase multiplies the current balance by 1+r/100.",
    "Apply the same multiplier each period: after two periods P(1+r/100)².",
    "After n periods the balance is P(1+r/100)^n. For m periods per year use r/(100m) and exponent mt.",
    "Interest earned is the final balance minus the starting principal.",
  ],
  "The rate and compounding period must be stated together.",
);
add(
  "ap-term ap-sum ap-last-sum sum-natural",
  "An arithmetic progression adds a fixed difference at each step.",
  "Use it for regularly increasing row lengths, planned installments or repeating linear changes.",
  [
    "The nth term takes n−1 jumps from a: aₙ=a+(n−1)d.",
    "Write the sum forward and backward. Every paired column sums to a+l.",
    "There are n columns, so twice the sum is n(a+l).",
    "Therefore S=n(a+l)/2 = n[2a+(n−1)d]/2.",
  ],
  "n is a positive integer; the difference is additive and constant.",
);
add(
  "gp-term gp-sum gp-infinite",
  "A geometric progression multiplies by a fixed ratio.",
  "Use it for repeated scaling, reduction or multiplicative growth.",
  [
    "Write S=a+ar+…+ar^(n−1). Multiply by r to shift every term.",
    "Subtract rS from S; all internal terms cancel, leaving (1−r)S=a(1−r^n).",
    "For r≠1 divide to obtain S=a(1−r^n)/(1−r). When r=1 the finite sum is na.",
    "For |r|<1, r^n approaches zero, so the infinite sum is a/(1−r).",
  ],
  "Infinite sums require |r|<1. Cancellation does not permit division by zero.",
);
add(
  "root-plus root-minus discriminant",
  "Quadratic roots are where ax²+bx+c equals zero.",
  "Use the quadratic formula when factoring is awkward or exact roots matter.",
  [
    "Divide ax²+bx+c=0 by a, with a≠0.",
    "Move c/a to the right and add (b/2a)² to both sides.",
    "Complete the square: (x+b/2a)²=(b²−4ac)/(4a²).",
    "Take both square-root signs and isolate x: (−b±√(b²−4ac))/(2a).",
  ],
  "Real roots require b²−4ac≥0. A zero discriminant gives a repeated root.",
);
add(
  "slope line-slope point-slope",
  "Slope is the signed vertical change per unit horizontal change.",
  "It connects a ramp or trend to a constant rate of change.",
  [
    "Find the coordinate changes Δy=y₂−y₁ and Δx=x₂−x₁.",
    "For a nonvertical line their ratio is constant: m=Δy/Δx.",
    "For any point on a line through (x₁,y₁), y−y₁=m(x−x₁).",
    "Expanding produces y=mx+(y₁−mx₁), the slope-intercept form.",
  ],
  "Vertical lines have Δx=0 and no finite slope.",
);
add(
  "midpoint-x midpoint-y",
  "The midpoint gives equal displacement to both endpoints.",
  "Choose it when finding a meeting point halfway along a straight route.",
  [
    "A halfway displacement from x₁ toward x₂ is (x₂−x₁)/2.",
    "Add it to x₁: x₁+(x₂−x₁)/2=(x₁+x₂)/2.",
    "Repeat the same argument for the y coordinate.",
  ],
  "Midpoint coordinates do not measure half the curved-path length.",
);
add(
  "derivative-power derivative-sin derivative-cos derivative-exp derivative-ln derivative-sqrt derivative-reciprocal secant-square",
  "A derivative is the limiting rate of change over a shrinking interval.",
  "Use it to distinguish instantaneous change from the average change over an interval.",
  [
    "Start with the difference quotient [f(x+h)−f(x)]/h for h≠0.",
    "For x², expand (x+h)² to obtain (2xh+h²)/h=2x+h.",
    "Let h approach zero to obtain 2x. For positive integer n, the binomial expansion similarly leaves nx^(n−1).",
    "Other displayed rules use the same limit definition with their function identities and domain restrictions; sine and cosine rules require radians.",
  ],
  "The difference quotient is not defined at h=0. A derivative requires a common finite limit from both sides.",
);
add(
  "integral-power definite-square definite-linear definite-exp integral-exp integral-sin integral-cos integral-ln",
  "Integration accumulates signed contributions from many small intervals.",
  "Use it for accumulated distance from velocity, or signed area under a curve.",
  [
    "Approximate the signed total with rectangles of width Δx and heights f(xᵢ).",
    "Refine the partition; the limiting sum defines the definite integral.",
    "If F′=f throughout the interval, the fundamental theorem gives ∫ₐᵇf(x)dx=F(b)−F(a).",
    "For xⁿ with n≠−1, differentiating x^(n+1)/(n+1) returns xⁿ; evaluate this antiderivative at the endpoints.",
  ],
  "Signed area differs from total geometric area when the curve crosses the axis.",
);
add(
  "probability-classical probability-complement probability-union probability-independent conditional bayes",
  "Probability measures a share of possible outcomes under a stated model.",
  "Use it to reason about uncertainty; first decide whether outcomes are equally likely or dependent.",
  [
    "For equally likely outcomes, count the favorable outcomes f and total outcomes N: P=f/N.",
    "A and its complement partition the sample space, so P(not A)=1−P(A).",
    "For A or B, add both shares but subtract the overlap once: P(A∪B)=P(A)+P(B)−P(A∩B).",
    "Conditioning restricts the sample space: P(A|B)=P(A∩B)/P(B). Combining this with P(A∩B)=P(B|A)P(A) gives Bayes’ relationship.",
  ],
  "Only independent events permit P(A∩B)=P(A)P(B); conditioning needs P(B)>0.",
);
add(
  "matrix-det matrix-area",
  "A plane transformation sends the coordinate unit square to a parallelogram.",
  "The determinant tracks signed area scale and whether orientation reverses.",
  [
    "The columns (a,c) and (b,d) are the transformed unit vectors.",
    "Their parallelogram has signed area ad−bc. Reversing column order reverses the sign.",
    "Every small unit-area piece scales by the same magnitude |ad−bc|.",
    "Multiply an original area by this magnitude to obtain transformed area.",
  ],
  "A zero determinant collapses area; a negative one reverses orientation.",
);
add(
  "square-sum square-difference difference-squares",
  "Algebraic identities express the same quantity in different forms.",
  "They reveal structure for mental arithmetic, factoring and geometric reasoning.",
  [
    "Distribute each factor over the other: (a+b)(a+b)=a²+ab+ba+b².",
    "Combine the two equal mixed terms to obtain a²+2ab+b².",
    "Replace b by −b for (a−b)²=a²−2ab+b².",
    "Multiply (a+b)(a−b); mixed terms cancel, leaving a²−b².",
  ],
  "Equality holds for all real a,b; (a+b)² is not a²+b².",
);
const domains: Record<string, [string, string, string]> = {
  "Numbers & arithmetic": [
    "Quantities are combined, separated or grouped according to their units.",
    "Counting and place value make large quantities easier to organize.",
    "Start with concrete groups, then replace each group size by a symbol.",
  ],
  "Fractions, decimals & ratios": [
    "A fraction compares a part with a whole; a ratio compares quantities.",
    "Use a common whole and a common unit before comparing shares.",
    "Name the whole, convert shares to a common scale, then combine or scale them.",
  ],
  "Number theory & powers": [
    "Repeated multiplication and integer structure reveal patterns beyond individual calculations.",
    "Powers compress repeated products; divisibility and counting rules organize discrete choices.",
    "Write a few small integer cases and identify what repeats before using the symbolic rule.",
  ],
  "Money & growth": [
    "A rate scales an initial quantity across time or repeated percentage changes.",
    "The relationship lets you compare illustrative budgets or growth plans under explicit assumptions.",
    "Convert percentages to fractions, specify the base amount, then apply the stated rate model.",
  ],
  "Algebra & identities": [
    "Symbols stand for quantities that may vary while a relationship remains true.",
    "Algebra finds an unknown or rewrites a complicated expression into useful structure.",
    "Start from the stated equality; distribute, combine like terms or perform the same operation on both sides.",
  ],
  "Sequences & series": [
    "A term describes one position; a sum describes the accumulated terms.",
    "Patterns help plan repeated changes without adding every term manually.",
    "Identify whether the pattern is additive, multiplicative or recursive; preserve its index convention.",
  ],
  "Plane geometry": [
    "Length describes boundaries; area describes the surface enclosed.",
    "Use geometry to compare layouts and material coverage.",
    "Decompose a shape into regions whose measurements are known, preserve area, then recombine.",
  ],
  "Circles & triangles": [
    "Angles and perpendicular distances constrain curved and triangular shapes.",
    "These relationships connect measurements you can take to lengths or areas you need.",
    "Draw and label the geometry; apply the stated angle, similarity or area relationship.",
  ],
  "Solid measurement": [
    "Volume counts cubic units; surface area counts the square units on the boundary.",
    "Use volume for capacity and surface area for wrapping or coating.",
    "Identify cross-sections and faces, measure each, then accumulate volumes or add face areas.",
  ],
  "Coordinate geometry": [
    "Coordinates convert a geometric question into arithmetic on positions.",
    "Use them for distances, line equations and curve profiles on a map.",
    "Translate the drawing into coordinate differences and apply its defining geometric relation.",
  ],
  Trigonometry: [
    "Sine and cosine are coordinate ratios on the unit circle.",
    "They connect angles to distances and periodic change.",
    "Resolve a radius into perpendicular components; angle addition is built by composing rotations.",
  ],
  "Logarithms & functions": [
    "A function maps inputs to outputs; a logarithm reverses exponentiation.",
    "Use inverse relationships to recover an input or compare multiplicative scales.",
    "For y=b^x, define x=log_b(y); translate exponential laws into logarithmic laws.",
  ],
  Calculus: [
    "Limits connect small changes to instantaneous rates and accumulated totals.",
    "Use calculus when a quantity changes continuously rather than by a fixed step.",
    "Begin with a finite difference or finite sum and identify the limit that defines the relationship.",
  ],
  "Statistics & probability": [
    "A model summarizes data or assigns uncertainty to outcomes.",
    "Use a statistic to answer a specific data question; use probability to reason about uncertain events.",
    "State the data or sample space, define the weights or counts, and normalize consistently.",
  ],
  "Vectors, matrices & 3D coordinates": [
    "Components describe position, direction and transformations along independent axes.",
    "Use them to project movement or transform a coordinate model.",
    "Resolve the object into components, apply the operation to those components, then recombine.",
  ],
};
add(
  "fraction-value fraction-percent percent-decimal percent-of fraction-quantity ratio-share",
  "Shares compare a part with its explicitly named whole.",
  "Use a share to scale a recipe, allocate a total or translate a survey result.",
  [
    "Dividing a whole into d equal pieces gives one piece the share 1/d. Selecting n pieces gives n/d.",
    "A percent names shares per hundred: p%=p/100. Multiplying a total Q by p/100 gives its selected quantity.",
    "To split Q in a ratio a:b, there are a+b equal ratio-parts; the first allocation is Q·a/(a+b).",
  ],
  "A denominator needs a nonzero whole; quantities compared as shares must use the same unit.",
);
add(
  "cylinder-volume prism-volume cuboid-volume cube-volume",
  "A prism has the same cross-sectional area at every perpendicular height.",
  "Use this relationship for capacity when the cross-section remains constant.",
  [
    "Take a layer of thickness Δh. Its volume is base area B times Δh.",
    "Stack equal layers over total height h; the thicknesses add to h, giving V=Bh.",
    "A rectangular base has B=lw; a circular base has B=πr². Substitute the correct base area.",
    "A cube is the special case l=w=h=s, so V=s³.",
  ],
  "A tapered solid does not have constant cross-section; cone and pyramid factors are different.",
);
add(
  "sector-area arc-length sector-radian arc-radian",
  "A central angle selects a fraction of a full circle.",
  "Use sector area for a fan-shaped region and arc length for its curved edge.",
  [
    "A degree angle θ occupies the fraction θ/360 of a full turn.",
    "Multiply full area πr² or full circumference 2πr by that fraction.",
    "In radians a full turn is 2π, so the fraction is θ/(2π).",
    "Simplifying gives sector area r²θ/2 and arc length rθ when θ is in radians.",
  ],
  "Arc length excludes the two radial sides. Do not mix degrees with the radian expressions.",
);
add(
  "pythagorean-trig tan-identity cot-identity sin-double cos-double sin-sum sin-difference cos-sum cos-difference",
  "Trigonometric identities preserve the same unit-circle geometry.",
  "They allow angle compositions to be evaluated without inventing new measurements.",
  [
    "On the unit circle, coordinates are (cos θ,sin θ). Pythagoras gives cos²θ+sin²θ=1.",
    "Rotate a point by another angle φ. Its coordinates become (cosθ cosφ−sinθ sinφ, sinθ cosφ+cosθ sinφ).",
    "Compare with the coordinates at θ+φ to obtain the cosine and sine addition rules.",
    "Set φ=θ for the double-angle rules; change φ to −φ for subtraction rules. Divide sine by cosine for tangent where cosine is nonzero.",
  ],
  "Identities preserve domain restrictions. Ratios involving zero denominators are undefined.",
);
add(
  "cosine-side triangle-angle-cosine triangle-sine-area",
  "Resolve a triangle side into components along a chosen base.",
  "This connects side measurements and angles even when the triangle is not right-angled.",
  [
    "Place two sides b and c with included angle A. Their endpoint difference has components b−c cos A and −c sin A.",
    "Square the endpoint distance: a²=(b−c cos A)²+(c sin A)².",
    "Expand and use sin²A+cos²A=1 to obtain a²=b²+c²−2bc cos A.",
    "Alternatively, perpendicular height is c sin A, so area=bc sin A/2.",
  ],
  "Use the angle included between the two selected sides; inverse cosine returns an angle in its principal range.",
);
add(
  "natural-log common-log log-base log-product log-quotient log-power",
  "A logarithm returns the exponent needed to produce a positive quantity.",
  "It reverses exponential change and turns multiplicative relationships into additive ones.",
  [
    "Define u=log_b x and v=log_b y, so x=b^u and y=b^v.",
    "Multiplying gives xy=b^(u+v); therefore log_b(xy)=u+v. Dividing gives log_b(x/y)=u−v.",
    "Raising x to a real power k gives b^(ku), so log_b(x^k)=k log_b x.",
    "If x=b^u, taking natural logs gives ln x=u ln b. Thus log_b x=ln x/ln b.",
  ],
  "Logarithm inputs must be positive; a real logarithm base is positive and different from 1.",
);
add(
  "annuity-future annuity-present loan-payment",
  "Equal periodic payments form a geometric series after growth or discounting.",
  "Use the teaching relationship to compare consistent payment schedules under a constant periodic rate.",
  [
    "An end-period deposit earns fewer periods of growth than an earlier one. Future contributions are P, P(1+i), …, P(1+i)^(n−1).",
    "Sum this geometric series to obtain F=P((1+i)^n−1)/i.",
    "Discount end-period payments back to the present to obtain V=P(1−(1+i)^(-n))/i.",
    "For a loan principal L, set this present value to L and solve for the payment: E=Li(1+i)^n/((1+i)^n−1).",
  ],
  "These displayed versions require i>0. At zero rate use the limit: future value nP and loan payment L/n.",
);
add(
  "normal-density standard-error-mean exponential-density exponential-cdf",
  "A continuous density allocates probability to intervals rather than individual points.",
  "Use the selected distribution only when its assumptions match the modeled data.",
  [
    "A probability density must be nonnegative and integrate to one over its domain. A single continuous point has probability zero.",
    "For exponential waiting time with rate λ, survival over x units is e^(−λx), so its cumulative probability is 1−e^(−λx). Differentiating gives λe^(−λx).",
    "A normal density rescales the standard bell curve with center μ and spread σ; the factor 1/σ preserves total area when the horizontal scale changes.",
    "For independent measurements with variance σ², a mean of n observations has variance σ²/n, giving standard error σ/√n.",
  ],
  "A density can exceed one; an interval probability cannot. Independence is essential to the displayed standard-error relationship.",
);
add(
  "at-least-one bernoulli-variance binomial-mean binomial-variance binomial-probability",
  "Repeated independent binary outcomes combine counting with multiplication of probabilities.",
  "Use this model for a fixed number of trials with the same success probability.",
  [
    "A single Bernoulli outcome X is 1 with probability p and 0 otherwise. Its mean is p and variance p−p²=p(1−p).",
    "For n independent trials, sum their means and variances: np and np(1−p).",
    "For exactly k successes, each ordered sequence has probability p^k(1−p)^(n−k). There are C(n,k) such placements.",
    "For at least one success, subtract the probability of no successes from one: 1−(1−p)^n.",
  ],
  "The constant p and independence assumptions must hold. Without them the binomial model need not apply.",
);
add(
  "weighted-mean weighted-variance-two pooled-mean variance-three sample-variance-three standard-deviation z-score",
  "A weighted mean is a balance point; variance measures squared displacement from that center.",
  "Use means to summarize location and spread measures to distinguish consistency.",
  [
    "Multiply each value by its frequency or weight, add these contributions and divide by total weight to find μ.",
    "For variance, subtract μ from each observation, square each difference and take the weighted average.",
    "Population variance uses total count n; the usual unbiased sample estimate uses n−1 for unweighted independent samples.",
    "Standard deviation is the square root of variance; z=(x−μ)/σ measures signed displacement in standard-deviation units.",
  ],
  "Weights must have a positive total. A z-score needs σ>0. Population and sample denominators answer different questions.",
);
add(
  "dot-product vector-angle projection cross-x cross-y cross-z cross-magnitude scalar-triple parallelepiped-volume",
  "Vector operations turn perpendicular components into lengths, projections and signed areas.",
  "Use them to compare directions or measure the space spanned by vectors.",
  [
    "In an orthonormal basis, dot product sums corresponding component products: u·v=ax+by+cz.",
    "Geometrically u·v=|u||v|cosθ, so dividing by nonzero magnitudes gives the angle or projection.",
    "The cross product components are (bz−cy,cx−az,ay−bx). Its magnitude gives parallelogram area; its direction follows the right-hand rule.",
    "Dot a third vector with the cross product for signed volume. Take its absolute value for geometric volume.",
  ],
  "A zero vector has no defined direction angle. Axis orientation matters to the cross product sign.",
);
add(
  "complex-product-real complex-product-imag complex-quotient-real complex-quotient-imag complex-modulus",
  "A complex number combines a real component with an imaginary component using i²=−1.",
  "Use complex arithmetic to keep planar components and rotations in one algebraic object.",
  [
    "Expand (a+bi)(c+di)=ac+adi+bci+bd i².",
    "Replace i² by −1 and group parts: (ac−bd)+(ad+bc)i.",
    "For division, multiply numerator and denominator by the conjugate c−di. The denominator becomes c²+d².",
    "The resulting quotient has real part (ac+bd)/(c²+d²) and imaginary part (bc−ad)/(c²+d²); modulus is √(a²+b²).",
  ],
  "Division requires a nonzero complex denominator. Real and imaginary components are different coordinates.",
);
add(
  "matrix-eigenvalue-plus matrix-eigenvalue-minus matrix-inverse-entry",
  "An eigenvector retains its direction under a matrix, while an inverse undoes the transformation.",
  "These relationships reveal invariant directions and whether a transformation can be reversed.",
  [
    "For A=[[a,b],[c,d]], an eigenvalue λ satisfies det(A−λI)=0.",
    "Expand: (a−λ)(d−λ)−bc=0, so λ²−(a+d)λ+(ad−bc)=0.",
    "Apply the quadratic formula; its discriminant simplifies to (a−d)²+4bc.",
    "If ad−bc≠0, multiplying A by [[d,−b],[−c,a]] gives (ad−bc)I. Divide to obtain the inverse.",
  ],
  "Real eigenvalue expressions require a nonnegative discriminant; invertibility requires a nonzero determinant.",
);
add(
  "circle-sagitta circle-chord-distance circle-radius-from-chord circle-tangent-length",
  "A radius perpendicular to a chord bisects it and forms a right triangle.",
  "Use chord measurements to infer an arc depth or a circle radius.",
  [
    "Let half the chord be c/2 and the center-to-chord distance be d. Pythagoras gives r²=d²+(c/2)².",
    "Therefore d=√(r²−c²/4), and minor-arc sagitta is s=r−d.",
    "Substitute d=r−s, expand and solve: r=c²/(8s)+s/2.",
    "A tangent meets a radius at a right angle. For an external point at distance D, its tangent length is √(D²−r²).",
  ],
  "State whether a sagitta is for the minor or major arc. Tangents from interior points are not real.",
);
function constructionSteps(expression: string): string[] {
  try {
    const steps: string[] = [],
      walk = (n: any) => {
        n.args?.forEach(walk);
        if (!n.args) return;
        const [a, b] = n.args.map(printExpression),
          expr = printExpression(n);
        const explanation =
          n.kind === "call"
            ? `Apply ${n.text} to ${n.args.map(printExpression).join(", ")}; this constructs ${expr}.`
            : n.kind === "unary"
              ? `Apply the signed direction to ${a}: ${expr}.`
              : (
                  {
                    "+": `Add the two contributions ${a} and ${b}.`,
                    "-": `Subtract ${b} from ${a} to measure the signed difference.`,
                    "*": `Scale ${a} by the factor ${b}.`,
                    "/": `Normalize ${a} by ${b}, which must be nonzero.`,
                    "^": `Raise ${a} to the power ${b}, following the real-domain restrictions.`,
                    "%": `Retain the remainder of ${a} divided by ${b}.`,
                  } as Record<string, string>
                )[n.text];
        steps.push(`${explanation} The resulting expression is ${expr}.`);
      };
    walk(parseExpression(expression));
    return steps;
  } catch {
    return [];
  }
}
export function teachingFor(f: FormulaEntry): FormulaTeaching {
  if (authored[f.id]) return authored[f.id];
  const [idea, why, construction] = domains[f.domain] || [
    "The symbols encode a relationship between measurable inputs and an output.",
    "Use the relationship only under its stated assumptions.",
    "Define every input and identify the relationship being modeled.",
  ];
  return {
    idea,
    why: `${f.title} gives an output in ${f.unit}. ${why}`,
    origin: [
      construction,
      `Set the assumptions: ${f.condition}`,
      ...constructionSteps(f.expression),
      `Together these operations construct ${f.expression}. This explains the definition or model calculation; a numerical trace is not a proof of a general theorem.`,
    ],
    check: `Check ${f.condition} Then compare a valid changed input with the original; a graph illustrates behavior but does not establish a theorem.`,
  };
}
