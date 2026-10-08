import type { FormulaEntry } from "./formulaCatalog";
export const additionalFormulas: FormulaEntry[] = [];
function add(domain: string, rows: string) {
  for (const row of rows.trim().split("\n")) {
    const [id, title, tex, expression, input, condition, unit = "value"] =
      row.split("~");
    additionalFormulas.push({
      id,
      title,
      domain,
      difficulty: "Advanced",
      tex,
      expression,
      defaults: Object.fromEntries(
        input.split(",").map((p) => {
          const [k, v] = p.split("=");
          return [k, Number(v)];
        }),
      ),
      condition,
      unit,
      keywords: `${title} ${domain} ${expression}`,
    });
  }
}
add(
  "Algebra & identities",
  String.raw`
weighted-interpolation~Linear interpolation~y=y_0+t(y_1-y_0)~y0+t*(y1-y0)~y0=10,y1=30,t=0.25~Interpolation requires 0≤t≤1; both values use the same unit.~u
quadratic-completed~Completed-square form~y=a(x-h)^2+k~a*(x-h)^2+k~a=2,x=3,h=1,k=-4~a nonzero for a quadratic; real parameters.~value
quadratic-axis~Quadratic axis of symmetry~h=-b/(2a)~-b/(2*a)~a=2,b=-8~a nonzero.~u
cubic-factor-remainder~Cubic polynomial evaluation~P(x)=ax^3+bx^2+cx+d~a*x^3+b*x^2+c*x+d~a=1,b=-2,c=3,d=-4,x=2~Real coefficients and input.~value
inverse-quadratic-positive~Inverse of x² on nonnegative inputs~x=\sqrt{y}~sqrt(y)~y=9~y≥0; restrict original x to x≥0.~value
absolute-v-shape~Translated absolute-value function~y=a|x-h|+k~a*abs(x-h)+k~a=2,x=4,h=1,k=-3~Real parameters.~value
max-two~Maximum of two quantities~M=\max(a,b)~max(a,b)~a=4,b=9~Comparable quantities in the same units.~value
min-two~Minimum of two quantities~m=\min(a,b)~min(a,b)~a=4,b=9~Comparable quantities in the same units.~value
root-separation~Separation of real quadratic roots~d=\sqrt{b^2-4ac}/|a|~sqrt(b^2-4*a*c)/abs(a)~a=1,b=-5,c=6~a nonzero and discriminant nonnegative.~u
harmonic-three~Harmonic mean of three values~H=3/(1/a+1/b+1/c)~3/(1/a+1/b+1/c)~a=2,b=3,c=6~a,b,c positive.~value
geometric-three~Geometric mean of three positive values~G=(abc)^{1/3}~(a*b*c)^(1/3)~a=2,b=4,c=8~a,b,c positive.~value
rms-two~Root mean square of two values~R=\sqrt{(a^2+b^2)/2}~sqrt((a^2+b^2)/2)~a=3,b=4~Both values use the same unit.~value
`,
);
add(
  "Circles & triangles",
  String.raw`
circle-sagitta~Circular arc sagitta~s=r-\sqrt{r^2-c^2/4}~r-sqrt(r^2-c^2/4)~r=5,c=6~r>0 and 0≤c≤2r; c is chord length.~u
circle-chord-distance~Center to chord distance~d=\sqrt{r^2-c^2/4}~sqrt(r^2-c^2/4)~r=5,c=6~r>0 and 0≤c≤2r.~u
circle-radius-from-chord~Radius from chord and sagitta~r=c^2/(8s)+s/2~c^2/(8*s)+s/2~c=6,s=1~c>0 and s>0; s is minor-arc sagitta when s≤c/2.~u
triangle-median~Median length to side a~m_a=\frac12\sqrt{2b^2+2c^2-a^2}~sqrt(2*b^2+2*c^2-a^2)/2~a=6,b=5,c=5~Positive sides satisfying the strict triangle inequalities.~u
triangle-bisector~Internal angle-bisector length~l_a=\frac{\sqrt{bc((b+c)^2-a^2)}}{b+c}~sqrt(b*c*((b+c)^2-a^2))/(b+c)~a=6,b=5,c=5~Positive sides satisfying the strict triangle inequalities.~u
triangle-angle-cosine~Angle from three sides~A=\cos^{-1}\frac{b^2+c^2-a^2}{2bc}~acos((b^2+c^2-a^2)/(2*b*c))*180/pi~a=6,b=5,c=5~Strict triangle inequalities; output in degrees.~degrees
circle-tangent-length~External tangent length~l=\sqrt{d^2-r^2}~sqrt(d^2-r^2)~d=13,r=5~d≥r>0; d is center-to-point distance.~u
ellipse-eccentricity~Ellipse eccentricity~e=\sqrt{1-b^2/a^2}~sqrt(1-b^2/a^2)~a=5,b=3~a≥b>0; a is the semi-major axis.~value
`,
);
add(
  "Calculus",
  String.raw`
tangent-square-value~Tangent to x² at a~y=a^2+2a(x-a)~a^2+2*a*(x-a)~a=2,x=3~Real a and x; tangent approximation is local.~value
normal-square-value~Normal to x² at a~y=a^2-(x-a)/(2a)~a^2-(x-a)/(2*a)~a=2,x=3~a nonzero; at a=0 the normal is vertical.~value
secant-cubic~Cubic difference quotient~D=3a^2+3ah+h^2~3*a^2+3*a*h+h^2~a=2,h=0.1~Represents ((a+h)^3-a^3)/h for h nonzero; polynomial extension at zero.~value
limit-square-error~Error near a for x²~E=|(a+h)^2-a^2|~abs((a+h)^2-a^2)~a=1,h=0.01~Real a and h; compare with an output tolerance.~value
epsilon-delta-square~A sufficient δ for x²~\delta=\min(1,\varepsilon/(2|a|+1))~min(1,epsilon/(2*abs(a)+1))~a=1,epsilon=0.1~epsilon>0; use the strict neighborhood 0<|x-a|<δ.~u
derivative-logistic~Logistic growth rate~P'=rP(1-P/K)~r*P*(1-P/K)~r=0.2,P=30,K=100~K>0, r≥0 and 0≤P≤K for this growth model.~count/time
integral-quadratic~Definite integral of a quadratic~I=\frac A3(v^3-u^3)+\frac B2(v^2-u^2)+C(v-u)~A*(v^3-u^3)/3+B*(v^2-u^2)/2+C*(v-u)~A=1,B=2,C=1,u=0,v=2~Real coefficients and finite bounds; signed integral.~value
taylor-exp-quadratic~Second-order exponential approximation~e^x\approx1+x+x^2/2~1+x+x^2/2~x=0.2~Taylor polynomial about zero, not an exact identity; most accurate near zero.~value
`,
);
add(
  "Statistics & probability",
  String.raw`
weighted-variance-two~Weighted population variance of two values~V=\frac{w_1(x_1-\mu)^2+w_2(x_2-\mu)^2}{w_1+w_2}~(w1*(x1-(w1*x1+w2*x2)/(w1+w2))^2+w2*(x2-(w1*x1+w2*x2)/(w1+w2))^2)/(w1+w2)~w1=2,w2=3,x1=4,x2=8~Weights nonnegative with positive total; population rather than sample variance.~u²
pooled-mean~Combined group mean~\bar x=(n_1m_1+n_2m_2)/(n_1+n_2)~(n1*m1+n2*m2)/(n1+n2)~n1=10,m1=60,n2=20,m2=75~Positive integer group counts; means in the same unit.~value
standard-error-mean~Standard error of a mean~SE=\sigma/\sqrt n~sigma/sqrt(n)~sigma=12,n=36~Independent identically distributed measurements, n positive integer, sigma≥0.~u
normal-density~Normal probability density~f(x)=\frac{e^{-(x-\mu)^2/(2\sigma^2)}}{\sigma\sqrt{2\pi}}~exp(-(x-mu)^2/(2*sigma^2))/(sigma*sqrt(2*pi))~x=1,mu=0,sigma=1~sigma>0; density is not point probability.~1/u
exponential-density~Exponential probability density~f(x)=\lambda e^{-\lambda x}~lambda*exp(-lambda*x)~lambda=0.5,x=2~lambda>0 and x≥0; density, not point probability.~1/u
exponential-cdf~Exponential cumulative probability~F(x)=1-e^{-\lambda x}~1-exp(-lambda*x)~lambda=0.5,x=2~lambda>0 and x≥0.~probability
uniform-density~Uniform probability density inside [a,b]~f(x)=1/(b-a)~1/(b-a)~a=2,b=6~a<b and x in [a,b]; zero outside the interval.~1/u
at-least-one~At least one independent success~P=1-(1-p)^n~1-(1-p)^n~p=0.2,n=5~0≤p≤1 and n nonnegative integer; independent trials with constant p.~probability
inclusion-three~Union of three events~P(A\cup B\cup C)=a+b+c-ab-ac-bc+abc~a+b+c-ab-ac-bc+abc~a=0.4,b=0.3,c=0.2,ab=0.1,ac=0.05,bc=0.04,abc=0.02~Inputs are marginal and intersection probabilities of consistent events; ab means P(A∩B), not a times b.~probability
odds-to-probability~Odds to probability~p=o/(1+o)~o/(1+o)~o=3~o≥0; odds compare success to failure.~probability
probability-to-odds~Probability to odds~o=p/(1-p)~p/(1-p)~p=0.75~0≤p<1.~value
bernoulli-variance~Bernoulli variance~V=p(1-p)~p*(1-p)~p=0.3~0≤p≤1; outcome is coded as 0 or 1.~value
`,
);
add(
  "Vectors, matrices & 3D coordinates",
  String.raw`
cross-magnitude~Cross product magnitude~|u\times v|=\sqrt{(bz-cy)^2+(cx-az)^2+(ay-bx)^2}~sqrt((b*z-c*y)^2+(c*x-a*z)^2+(a*y-b*x)^2)~a=1,b=2,c=0,x=3,y=1,z=2~Right-handed orthonormal basis.~u²
scalar-triple~Scalar triple product~u\cdot(v\times w)=a(yt-zs)+b(zr-xt)+c(xs-yr)~a*(y*t-z*s)+b*(z*r-x*t)+c*(x*s-y*r)~a=1,b=0,c=0,x=0,y=2,z=0,r=0,s=0,t=3~u=(a,b,c), v=(x,y,z), w=(r,s,t); signed volume.~u³
parallelepiped-volume~Parallelepiped volume~V=|u\cdot(v\times w)|~abs(a*(y*t-z*s)+b*(z*r-x*t)+c*(x*s-y*r))~a=1,b=0,c=0,x=0,y=2,z=0,r=0,s=0,t=3~Three edge vectors in orthonormal coordinates.~u³
matrix-inverse-entry~Inverse matrix upper-left entry~(A^{-1})_{11}=d/(ad-bc)~d/(a*d-b*c)~a=2,b=1,c=1,d=3~ad-bc nonzero; matrix [[a,b],[c,d]].~value
matrix-eigenvalue-plus~Larger real eigenvalue of a 2×2 matrix~\lambda_+=\frac{a+d+\sqrt{(a-d)^2+4bc}}2~(a+d+sqrt((a-d)^2+4*b*c))/2~a=2,b=1,c=1,d=3~Discriminant (a-d)²+4bc nonnegative.~value
matrix-eigenvalue-minus~Smaller real eigenvalue of a 2×2 matrix~\lambda_-=\frac{a+d-\sqrt{(a-d)^2+4bc}}2~(a+d-sqrt((a-d)^2+4*b*c))/2~a=2,b=1,c=1,d=3~Discriminant (a-d)²+4bc nonnegative.~value
complex-quotient-real~Complex quotient real component~\Re(z/w)=(ac+bd)/(c^2+d^2)~(a*c+b*d)/(c^2+d^2)~a=2,b=3,c=1,d=2~w=c+di nonzero.~value
complex-quotient-imag~Complex quotient imaginary component~\Im(z/w)=(bc-ad)/(c^2+d^2)~(b*c-a*d)/(c^2+d^2)~a=2,b=3,c=1,d=2~w=c+di nonzero.~value
`,
);
add(
  "Money & growth",
  String.raw`
annuity-future~Future value of equal end-period deposits~F=P((1+i)^n-1)/i~P*((1+i)^n-1)/i~P=100,i=0.05,n=10~i>0, P≥0, n nonnegative integer; deposits at each period end. Teaching model.~currency
annuity-present~Present value of equal end-period payments~V=P(1-(1+i)^{-n})/i~P*(1-(1+i)^(-n))/i~P=100,i=0.05,n=10~i>0, P≥0, n positive integer; discount rate per payment period. Teaching model.~currency
loan-payment~Fixed periodic loan payment~E=Pi(1+i)^n/((1+i)^n-1)~P*i*(1+i)^n/((1+i)^n-1)~P=10000,i=0.01,n=12~P>0, i>0, n positive integer; ideal fixed-rate end-period payments without fees. Teaching model.~currency/period
effective-annual~Effective annual rate~R=(1+r/m)^m-1~(1+r/m)^m-1~r=0.12,m=12~m positive integer; r is a decimal nominal annual rate with r≥0. Teaching model.~decimal rate
break-even-units~Break-even unit quantity~Q=F/(p-v)~F/(p-v)~F=1000,p=30,v=10~F≥0 and p>v≥0; constant unit prices and costs. Whole units may require rounding upward.~units
unit-contribution~Unit contribution margin~C=p-v~p-v~p=30,v=10~p and v are selling price and variable cost per unit in one currency.~currency/unit
logistic-population~Logistic population model~P(t)=K/(1+Ae^{-rt})~K/(1+A*exp(-r*t))~K=100,A=4,r=0.2,t=5~K>0, A>0, r≥0, t≥0; idealized carrying-capacity model.~count
half-life-remaining~Remaining amount after decay~N=N_0\,2^{-t/H}~N0*2^(-t/H)~N0=100,t=6,H=3~N0≥0, t≥0, H>0; constant half-life H. Teaching model.~amount
`,
);

const beginner = new Set(["max-two", "min-two"]);
const intermediate = new Set([
  "weighted-interpolation",
  "quadratic-completed",
  "quadratic-axis",
  "inverse-quadratic-positive",
  "absolute-v-shape",
  "root-separation",
  "harmonic-three",
  "geometric-three",
  "rms-two",
  "circle-sagitta",
  "circle-chord-distance",
  "circle-radius-from-chord",
  "triangle-angle-cosine",
  "circle-tangent-length",
  "ellipse-eccentricity",
  "pooled-mean",
  "at-least-one",
  "odds-to-probability",
  "probability-to-odds",
  "break-even-units",
  "unit-contribution",
  "half-life-remaining",
]);
for (const f of additionalFormulas) {
  if (beginner.has(f.id)) f.difficulty = "Beginner";
  else if (intermediate.has(f.id)) f.difficulty = "Intermediate";
}
