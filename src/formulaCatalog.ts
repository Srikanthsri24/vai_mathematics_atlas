export type FormulaEntry={id:string;title:string;domain:string;difficulty:string;tex:string;expression:string;defaults:Record<string,number>;condition:string;unit:string;keywords:string};
export const formulas:FormulaEntry[]=[];
function add(domain:string,difficulty:string,rows:string){for(const row of rows.trim().split('\n')){const [id,title,tex,expression,input,condition='Use consistent units and the stated domain.',unit='value']=row.split('~');const defaults=Object.fromEntries(input.split(',').map(pair=>{const [key,value]=pair.split('=');return [key,Number(value)]}));formulas.push({id,title,domain,difficulty,tex,expression,defaults,condition,unit,keywords:`${title} ${domain} ${Object.keys(defaults).join(' ')}`})}}
add('Numbers & arithmetic','Foundation',String.raw`
sum~Addition~S=a+b~a+b~a=5,b=3~Combines two quantities.~count
difference~Subtraction~D=a-b~a-b~a=8,b=3~Signed difference; negative results are permitted.~count
product~Multiplication~P=ab~a*b~a=4,b=6~Equal group sizes.~count
quotient~Division~Q=a/b~a/b~a=24,b=6~Divisor b must be nonzero.~value
remainder~Remainder~r=a-b\lfloor a/b\rfloor~a-b*floor(a/b)~a=17,b=5~Nonnegative integers a and positive integer b.~count
double~Doubling~D=2n~2*n~n=7~Two equal groups.~count
half~Halving~H=n/2~n/2~n=12~Two equal shares.~value
number-distance~Distance on number line~d=|b-a|~abs(b-a)~a=-3,b=4~A common unit interval.~u
absolute~Absolute value~d=|x|~abs(x)~x=-5~Distance from zero.~u
hundreds~Hundreds place~V=100h~100*h~h=3~h is a digit 0–9.~count
tens~Tens place~V=10t~10*t~t=7~t is a digit 0–9.~count
place-value~Three-digit place value~N=100h+10t+u~100*h+10*t+u~h=3,t=7,u=2~Each digit is an integer from 0 to 9.~count
even~Even numbers~N=2n~2*n~n=4~n is an integer.~count
odd~Odd numbers~N=2n+1~2*n+1~n=4~n is an integer.~count
round-ten~Round to nearest ten~N=10\lfloor x/10+1/2\rfloor~10*floor(x/10+0.5)~x=37~For nonnegative x; half-ties round upward.~count
round-hundred~Round to nearest hundred~N=100\lfloor x/100+1/2\rfloor~100*floor(x/100+0.5)~x=372~For nonnegative x; half-ties round upward.~count
bond~Missing number bond~b=S-a~S-a~S=10,a=3~a is at most total S for whole-number bonds.~count
successor~Successor~s=n+1~n+1~n=7~Integer n.~count
predecessor~Predecessor~p=n-1~n-1~n=7~Integer n.~count
average-two~Average of two values~m=(a+b)/2~(a+b)/2~a=4,b=8~Both quantities use the same unit.~value
`);
add('Fractions, decimals & ratios','Beginner',String.raw`
fraction-value~Fraction as quotient~v=n/d~n/d~n=3,d=4~d must be nonzero.~value
fraction-percent~Fraction to percent~p=100n/d~100*n/d~n=3,d=4~d must be nonzero.~%
percent-decimal~Percent to decimal~v=p/100~p/100~p=35~p is expressed in percent.~value
hundredths~Hundredths~v=n/100~n/100~n=75~n counts hundredths.~value
tenths~Tenths~v=n/10~n/10~n=7~n counts tenths.~value
fraction-quantity~Fraction of a quantity~q=Qn/d~Q*n/d~Q=24,n=3,d=4~d nonzero; quantities use consistent units.~value
fraction-add~Add unlike fractions~s=\frac ab+\frac cd~a/b+c/d~a=1,b=2,c=1,d=3~Both denominators must be nonzero.~value
fraction-subtract~Subtract fractions~s=\frac ab-\frac cd~a/b-c/d~a=3,b=4,c=1,d=2~Both denominators must be nonzero.~value
fraction-multiply~Multiply fractions~p=\frac{ac}{bd}~a*c/(b*d)~a=2,b=3,c=3,d=4~Both denominators must be nonzero.~value
fraction-divide~Divide fractions~q=\frac{ad}{bc}~a*d/(b*c)~a=2,b=3,c=4,d=5~b,c,d must be nonzero.~value
reciprocal~Reciprocal~r=1/x~1/x~x=4~x must be nonzero.~value
mixed~Mixed number to fraction value~v=w+n/d~w+n/d~w=2,n=1,d=3~d positive; for proper remainder 0≤n<d.~value
equivalent-num~Equivalent fraction numerator~N=kn~k*n~k=2,n=3~Apply the same nonzero scale to denominator.~count
equivalent-den~Equivalent fraction denominator~D=kd~k*d~k=2,d=4~k and d nonzero.~count
ratio-quotient~Ratio as quotient~r=a/b~a/b~a=2,b=3~b nonzero.~value
ratio-share~Share in a ratio~s=Ta/(a+b)~T*a/(a+b)~T=500,a=2,b=3~a,b nonnegative and sum positive.~value
direct~Direct proportion~y=kx~k*x~k=3,x=4~Constant proportionality k.~value
inverse~Inverse proportion~y=k/x~k/x~k=24,x=6~x nonzero.~value
unitary~Unit price~u=P/q~P/q~P=120,q=4~Quantity q positive.~₹ per item
scale-length~Scale drawing~l=ks~k*s~k=50,s=4~Scale factor k positive.~u
proportion-fourth~Fourth proportional~d=bc/a~b*c/a~a=2,b=3,c=6~a nonzero.~value
decimal-place~Decimal place value~v=t/10+h/100~t/10+h/100~t=7,h=5~Digits t,h between 0 and 9.~value
percent-of~Percentage of quantity~q=Qp/100~Q*p/100~Q=80,p=25~p expressed in percent.~value
percent-increase~Percentage increase~N=P(1+r/100)~P*(1+r/100)~P=200,r=10~Positive base P.~value
percent-decrease~Percentage decrease~N=P(1-r/100)~P*(1-r/100)~P=200,r=10~For nonnegative result use 0≤r≤100.~value
percent-change~Percentage change~r=100(N-O)/O~100*(N-O)/O~N=120,O=100~Original O positive.~%
successive-change~Successive percentage changes~N=P(1+a/100)(1+b/100)~P*(1+a/100)*(1+b/100)~P=100,a=10,b=-10~Percent changes may be signed.~value
reverse-percent~Recover original quantity~P=N/(1+r/100)~N/(1+r/100)~N=120,r=20~r cannot equal −100.~value
`);
add('Number theory & powers','Intermediate',String.raw`
gcd~Highest common factor~g=\gcd(a,b)~gcd(a,b)~a=24,b=36~Integer a,b not both zero.~count
lcm~Least common multiple~L=|ab|/\gcd(a,b)~abs(a*b)/gcd(a,b)~a=12,b=18~Positive integer inputs.~count
square~Square~S=x^2~x^2~x=5~Real x.~value
cube~Cube~C=x^3~x^3~x=3~Real x.~value
square-root~Square root~r=\sqrt{x}~sqrt(x)~x=25~x must be nonnegative.~value
cube-root~Positive cube root~r=x^{1/3}~x^(1/3)~x=27~This numeric form uses nonnegative x.~value
power~Power~P=a^n~a^n~a=2,n=5~For noninteger n use positive base a.~value
power-product~Product of powers~a^ma^n=a^{m+n}~a^(m+n)~a=2,m=3,n=2~Positive base for arbitrary real exponents.~value
power-quotient~Quotient of powers~a^m/a^n=a^{m-n}~a^(m-n)~a=2,m=5,n=3~a positive.~value
power-power~Power of a power~(a^m)^n=a^{mn}~a^(m*n)~a=2,m=3,n=2~a positive.~value
negative-power~Negative exponent~a^{-n}=1/a^n~1/a^n~a=2,n=3~a nonzero; use positive base for real n.~value
fractional-power~Fractional exponent~a^{1/n}=\sqrt[n]{a}~a^(1/n)~a=16,n=4~a nonnegative, n positive integer.~value
power-product-base~Power of a product~(ab)^n=a^nb^n~(a*b)^n~a=2,b=3,n=2~Positive bases for noninteger n.~value
scientific~Scientific notation value~x=m10^n~m*10^n~m=3.2,n=4~Normalized mantissa 1≤|m|<10; integer exponent.~value
surd-product~Product of square roots~\sqrt a\sqrt b=\sqrt{ab}~sqrt(a*b)~a=2,b=8~a,b nonnegative.~value
surd-quotient~Quotient of square roots~\sqrt a/\sqrt b=\sqrt{a/b}~sqrt(a/b)~a=18,b=2~a nonnegative and b positive.~value
rationalize~Rationalize a square-root denominator~1/\sqrt a=\sqrt a/a~sqrt(a)/a~a=3~a positive.~value
factorial~Factorial~n!=1\cdot2\cdots n~fact(n)~n=5~Integer 0≤n≤170; 0!=1.~count
triangular-number~Triangular number~T_n=n(n+1)/2~n*(n+1)/2~n=6~Nonnegative integer n.~count
square-number-difference~Consecutive square difference~(n+1)^2-n^2=2n+1~2*n+1~n=5~Integer n.~value
`);
add('Money & growth','Intermediate',String.raw`
profit~Profit~P=SP-CP~SP-CP~SP=600,CP=500~Positive cost price CP.~₹
loss~Loss~L=CP-SP~CP-SP~CP=500,SP=450~A loss occurs when SP<CP.~₹
profit-rate~Profit percentage~p=100(SP-CP)/CP~100*(SP-CP)/CP~SP=600,CP=500~CP positive.~%
loss-rate~Loss percentage~p=100(CP-SP)/CP~100*(CP-SP)/CP~CP=500,SP=450~CP positive.~%
sell-profit~Selling price with profit~SP=CP(1+p/100)~CP*(1+p/100)~CP=500,p=20~p expressed in percent.~₹
sell-loss~Selling price with loss~SP=CP(1-p/100)~CP*(1-p/100)~CP=500,p=10~0≤p≤100.~₹
cost-from-profit~Cost price from profit rate~CP=SP/(1+p/100)~SP/(1+p/100)~SP=600,p=20~p cannot equal −100.~₹
discount-amount~Discount amount~D=MPd/100~MP*d/100~MP=800,d=25~0≤d≤100.~₹
sale-price~Discounted selling price~SP=MP(1-d/100)~MP*(1-d/100)~MP=800,d=25~0≤d≤100.~₹
marked-price~Marked price from sale price~MP=SP/(1-d/100)~SP/(1-d/100)~SP=600,d=25~0≤d<100.~₹
tax-amount~Tax on a base price~T=Pr/100~P*r/100~P=1000,r=18~Illustrative rate; not a statement of current tax law.~₹
tax-inclusive~Price including tax~A=P(1+r/100)~P*(1+r/100)~P=1000,r=18~Illustrative percentage rate.~₹
tax-exclusive~Recover price before tax~P=A/(1+r/100)~A/(1+r/100)~A=1180,r=18~r≥0.~₹
simple-interest~Simple interest~I=Prt/100~P*r*t/100~P=1000,r=8,t=3~Annual percentage rate and time in years.~₹
simple-amount~Simple interest amount~A=P(1+rt/100)~P*(1+r*t/100)~P=1000,r=8,t=3~Principal stays fixed.~₹
interest-principal~Principal from simple interest~P=100I/(rt)~100*I/(r*t)~I=240,r=8,t=3~r,t positive.~₹
interest-rate~Simple interest rate~r=100I/(Pt)~100*I/(P*t)~I=240,P=1000,t=3~P,t positive.~%
interest-time~Time for simple interest~t=100I/(Pr)~100*I/(P*r)~I=240,P=1000,r=8~P,r positive.~years
compound-amount~Annual compound amount~A=P(1+r/100)^n~P*(1+r/100)^n~P=1000,r=8,n=3~n nonnegative integer years.~₹
compound-interest~Compound interest earned~I=P[(1+r/100)^n-1]~P*((1+r/100)^n-1)~P=1000,r=8,n=3~Annual compounding; n nonnegative.~₹
periodic-compound~Periodic compound amount~A=P(1+r/(100m))^{mt}~P*(1+r/(100*m))^(m*t)~P=1000,r=8,m=4,t=3~m positive periods per year.~₹
depreciation~Depreciation~V=P(1-r/100)^n~P*(1-r/100)^n~P=10000,r=10,n=3~0≤r<100; n years.~₹
population-growth~Population growth~N=N_0(1+r/100)^t~N*(1+r/100)^t~N=1000,r=2,t=5~Constant modeled annual rate.~count
continuous-growth~Continuous growth~A=Pe^{kt}~P*exp(k*t)~P=1000,k=0.08,t=3~k is a fractional rate per time unit.~value
doubling-time~Continuous doubling time~t=\ln2/k~log(2)/k~k=0.08~k positive.~time units
`);
add('Algebra & identities','Intermediate',String.raw`
linear-value~Linear expression~y=ax+b~a*x+b~a=2,x=3,b=1~Real inputs.~value
linear-solve~One-variable linear equation~x=(c-b)/a~(c-b)/a~a=2,b=3,c=11~a must be nonzero.~value
square-sum~Square of a sum~(a+b)^2=a^2+2ab+b^2~(a+b)^2~a=3,b=2~Real a,b.~value
square-difference~Square of a difference~(a-b)^2=a^2-2ab+b^2~(a-b)^2~a=5,b=2~Real a,b.~value
difference-squares~Difference of squares~a^2-b^2=(a-b)(a+b)~a^2-b^2~a=5,b=3~Real a,b.~value
sum-cubes~Sum of cubes~a^3+b^3=(a+b)(a^2-ab+b^2)~a^3+b^3~a=3,b=2~Real a,b.~value
difference-cubes~Difference of cubes~a^3-b^3=(a-b)(a^2+ab+b^2)~a^3-b^3~a=4,b=2~Real a,b.~value
cube-sum~Cube of a sum~(a+b)^3=a^3+3a^2b+3ab^2+b^3~(a+b)^3~a=3,b=2~Real a,b.~value
cube-difference~Cube of a difference~(a-b)^3=a^3-3a^2b+3ab^2-b^3~(a-b)^3~a=5,b=2~Real a,b.~value
three-square~Square of three terms~(a+b+c)^2=a^2+b^2+c^2+2ab+2bc+2ca~(a+b+c)^2~a=1,b=2,c=3~Real inputs.~value
sum-square-pair~Sum of two squares identity~a^2+b^2=(a+b)^2-2ab~a^2+b^2~a=3,b=4~Real a,b.~value
product-from-squares~Product from two squares~ab=((a+b)^2-(a-b)^2)/4~((a+b)^2-(a-b)^2)/4~a=5,b=3~Real a,b.~value
quadratic-value~Quadratic polynomial~y=ax^2+bx+c~a*x^2+b*x+c~a=1,x=2,b=-3,c=2~a nonzero for a quadratic.~value
discriminant~Quadratic discriminant~D=b^2-4ac~b^2-4*a*c~a=1,b=-3,c=2~a nonzero.~value
root-plus~Larger signed quadratic branch~x_+=(-b+\sqrt{b^2-4ac})/(2a)~(-b+sqrt(b^2-4*a*c))/(2*a)~a=1,b=-3,c=2~a nonzero and discriminant nonnegative; larger only if a>0.~value
root-minus~Other quadratic branch~x_-=(-b-\sqrt{b^2-4ac})/(2a)~(-b-sqrt(b^2-4*a*c))/(2*a)~a=1,b=-3,c=2~a nonzero and discriminant nonnegative.~value
root-sum~Sum of quadratic roots~s=-b/a~-b/a~a=1,b=-3~a nonzero; algebraic roots including complex roots.~value
root-product~Product of quadratic roots~p=c/a~c/a~a=1,c=2~a nonzero.~value
vertex-x~Quadratic vertex input~x_v=-b/(2a)~-b/(2*a)~a=1,b=-4~a nonzero.~value
vertex-y~Quadratic vertex output~y_v=c-b^2/(4a)~c-b^2/(4*a)~a=1,b=-4,c=1~a nonzero.~value
cubic-value~Cubic polynomial~y=ax^3+bx^2+cx+d~a*x^3+b*x^2+c*x+d~a=1,x=2,b=-1,c=2,d=1~a nonzero for degree three.~value
remainder-theorem~Polynomial remainder~R=f(k)=ak^2+bk+c~a*k^2+b*k+c~a=1,k=2,b=3,c=1~Divisor x−k.~value
two-lines-x~Two linear equations: x~x=(ed-bf)/(ad-bc)~(e*d-b*f)/(a*d-b*c)~a=2,b=1,c=1,d=-1,e=5,f=1~Equations ax+by=e and cx+dy=f; determinant nonzero.~value
two-lines-y~Two linear equations: y~y=(af-ec)/(ad-bc)~(a*f-e*c)/(a*d-b*c)~a=2,b=1,c=1,d=-1,e=5,f=1~Determinant ad−bc nonzero.~value
`);
add('Sequences & series','Advanced',String.raw`
ap-term~Arithmetic progression term~a_n=a+(n-1)d~a+(n-1)*d~a=2,n=6,d=3~Positive integer index n.~value
ap-sum~Arithmetic progression sum~S_n=n[2a+(n-1)d]/2~n*(2*a+(n-1)*d)/2~n=6,a=2,d=3~Positive integer n.~value
ap-last-sum~AP sum using last term~S_n=n(a+l)/2~n*(a+l)/2~n=6,a=2,l=17~a and l are endpoints of the same AP.~value
ap-difference~AP common difference~d=(l-a)/(n-1)~(l-a)/(n-1)~l=17,a=2,n=6~Integer n>1.~value
ap-index~AP term index~n=1+(l-a)/d~1+(l-a)/d~l=17,a=2,d=3~d nonzero; a valid term gives a positive integer.~index
arithmetic-mean~Arithmetic mean insertion~A=(a+b)/2~(a+b)/2~a=4,b=10~Real inputs.~value
gp-term~Geometric progression term~a_n=ar^{n-1}~a*r^(n-1)~a=2,r=3,n=4~Positive integer n.~value
gp-sum~Finite geometric sum~S_n=a(r^n-1)/(r-1)~a*(r^n-1)/(r-1)~a=2,r=3,n=4~r≠1; at r=1 the sum is na.~value
gp-infinite~Infinite geometric sum~S_\infty=a/(1-r)~a/(1-r)~a=4,r=0.5~Converges only for |r|<1.~value
geometric-mean~Positive geometric mean~G=\sqrt{ab}~sqrt(a*b)~a=4,b=9~a,b nonnegative.~value
harmonic-mean~Harmonic mean~H=2ab/(a+b)~2*a*b/(a+b)~a=4,b=6~a,b positive.~value
sum-natural~Sum of first n integers~S=n(n+1)/2~n*(n+1)/2~n=10~Nonnegative integer n.~value
sum-squares~Sum of first n squares~S=n(n+1)(2n+1)/6~n*(n+1)*(2*n+1)/6~n=5~Nonnegative integer n.~value
sum-cubes~Sum of first n cubes~S=[n(n+1)/2]^2~(n*(n+1)/2)^2~n=5~Nonnegative integer n.~value
sum-odd~Sum of first n odd numbers~S=n^2~n^2~n=5~Nonnegative integer n.~value
sum-even~Sum of first n positive even numbers~S=n(n+1)~n*(n+1)~n=5~Nonnegative integer n.~value
binomial-term~Binomial expansion term~T_{r+1}=\binom nr a^{n-r}b^r~choose(n,r)*a^(n-r)*b^r~n=5,r=2,a=2,b=1~Integers 0≤r≤n; n≤50 for numeric stability.~value
binomial-coefficient~Binomial coefficient~\binom nr=n!/[r!(n-r)!]~choose(n,r)~n=6,r=2~Integers 0≤r≤n≤50.~count
fibonacci-binet~Fibonacci number~F_n=(\phi^n-\psi^n)/\sqrt5~(((1+sqrt(5))/2)^n-((1-sqrt(5))/2)^n)/sqrt(5)~n=8~Nonnegative integer n; rounded numeric approximations for large n.~count
harmonic-term~Harmonic progression term~h_n=1/[a+(n-1)d]~1/(a+(n-1)*d)~a=2,n=5,d=1~Denominator must be nonzero.~value
`);
add('Plane geometry','Beginner',String.raw`
square-area~Square area~A=s^2~s^2~s=4~Side s positive.~u²
square-perimeter~Square perimeter~P=4s~4*s~s=4~Side s positive.~u
square-diagonal~Square diagonal~d=s\sqrt2~s*sqrt(2)~s=4~Side s positive.~u
rectangle-area~Rectangle area~A=lw~l*w~l=6,w=4~Lengths positive.~u²
rectangle-perimeter~Rectangle perimeter~P=2(l+w)~2*(l+w)~l=6,w=4~Lengths positive.~u
rectangle-diagonal~Rectangle diagonal~d=\sqrt{l^2+w^2}~sqrt(l^2+w^2)~l=6,w=4~Perpendicular sides.~u
triangle-area~Triangle area~A=bh/2~b*h/2~b=6,h=4~h is perpendicular to chosen base b.~u²
triangle-perimeter~Triangle perimeter~P=a+b+c~a+b+c~a=3,b=4,c=5~Positive lengths satisfying triangle inequality.~u
triangle-height~Triangle height from area~h=2A/b~2*A/b~A=12,b=6~Base b positive.~u
equilateral-area~Equilateral triangle area~A=\sqrt3s^2/4~sqrt(3)*s^2/4~s=4~Three equal sides of positive length s.~u²
equilateral-height~Equilateral triangle altitude~h=\sqrt3s/2~sqrt(3)*s/2~s=4~s positive.~u
parallelogram-area~Parallelogram area~A=bh~b*h~b=6,h=4~h perpendicular to base.~u²
parallelogram-perimeter~Parallelogram perimeter~P=2(a+b)~2*(a+b)~a=6,b=4~Adjacent side lengths.~u
rhombus-area~Rhombus area from diagonals~A=d_1d_2/2~d1*d2/2~d1=8,d2=6~Rhombus diagonals are perpendicular.~u²
rhombus-perimeter~Rhombus perimeter~P=4s~4*s~s=5~All sides equal.~u
trapezium-area~Trapezium area~A=(a+b)h/2~(a+b)*h/2~a=4,b=8,h=3~a,b parallel sides; h perpendicular separation.~u²
kite-area~Kite area~A=d_1d_2/2~d1*d2/2~d1=8,d2=5~Perpendicular diagonals.~u²
regular-perimeter~Regular polygon perimeter~P=ns~n*s~n=6,s=4~Integer n≥3; equal side length s.~u
interior-sum~Polygon interior angle sum~S=(n-2)180^\circ~(n-2)*180~n=6~Simple polygon; integer n≥3.~degrees
regular-angle~Regular polygon interior angle~\theta=180(n-2)/n~180*(n-2)/n~n=6~Integer n≥3.~degrees
exterior-angle~Regular polygon exterior angle~\theta=360/n~360/n~n=6~Integer n≥3.~degrees
polygon-diagonals~Number of polygon diagonals~D=n(n-3)/2~n*(n-3)/2~n=6~Integer n≥3.~count
regular-area~Regular polygon area from apothem~A=nsq/2~n*s*q/2~n=6,s=4,q=3.464~q is perpendicular apothem.~u²
regular-radius-area~Regular polygon circumradius area~A=nR^2\sin(2\pi/n)/2~n*R^2*sin(2*pi/n)/2~n=6,R=4~Integer n≥3; circumradius R positive.~u²
regular-apothem~Regular polygon apothem~q=s/[2\tan(\pi/n)]~s/(2*tan(pi/n))~s=4,n=6~Integer n≥3.~u
`);
add('Circles & triangles','Intermediate',String.raw`
circle-area~Circle area~A=\pi r^2~pi*r^2~r=3~Radius positive.~u²
circle-circumference~Circle circumference~C=2\pi r~2*pi*r~r=3~Radius positive.~u
circle-diameter~Circle diameter~d=2r~2*r~r=3~Radius nonnegative.~u
circle-radius~Radius from circumference~r=C/(2\pi)~C/(2*pi)~C=18.84956~C positive.~u
semicircle-area~Semicircle area~A=\pi r^2/2~pi*r^2/2~r=3~Radius positive.~u²
semicircle-perimeter~Semicircle perimeter~P=\pi r+2r~pi*r+2*r~r=3~Includes the straight diameter.~u
sector-area~Sector area in degrees~A=\pi r^2\theta/360~pi*r^2*theta/360~r=3,theta=60~0≤θ≤360 degrees.~u²
arc-length~Arc length in degrees~l=2\pi r\theta/360~2*pi*r*theta/360~r=3,theta=60~0≤θ≤360 degrees.~u
sector-radian~Sector area in radians~A=r^2\theta/2~r^2*theta/2~r=3,theta=1~θ in radians; nonnegative.~u²
arc-radian~Arc length in radians~l=r\theta~r*theta~r=3,theta=1~θ in radians; nonnegative.~u
chord~Chord length~c=2r\sin(\theta/2)~2*r*sin(theta*pi/360)~r=3,theta=60~θ is central angle in degrees, 0–360.~u
segment-area~Minor circular segment area~A=r^2(\theta-\sin\theta)/2~r^2*(theta-sin(theta))/2~r=3,theta=1~θ in radians, 0≤θ≤π.~u²
annulus~Annulus area~A=\pi(R^2-r^2)~pi*(R^2-r^2)~R=5,r=3~Outer R≥inner r≥0.~u²
pythagoras-hyp~Pythagoras hypotenuse~c=\sqrt{a^2+b^2}~sqrt(a^2+b^2)~a=3,b=4~a,b perpendicular legs.~u
pythagoras-leg~Pythagoras missing leg~b=\sqrt{c^2-a^2}~sqrt(c^2-a^2)~c=5,a=3~Hypotenuse c≥leg a>0.~u
heron~Heron's triangle area~A=\sqrt{s(s-a)(s-b)(s-c)},\ s=(a+b+c)/2~sqrt((a+b+c)/2*((a+b+c)/2-a)*((a+b+c)/2-b)*((a+b+c)/2-c))~a=3,b=4,c=5~Strict triangle inequalities and positive sides.~u²
triangle-inradius~Triangle inradius~r=2A/P~2*A/P~A=6,P=12~A and P belong to the same nondegenerate triangle.~u
triangle-circumradius~Triangle circumradius~R=abc/(4A)~a*b*c/(4*A)~a=3,b=4,c=5,A=6~A positive triangle area.~u
triangle-sine-area~Triangle area with included angle~A=ab\sin C/2~a*b*sin(C*pi/180)/2~a=5,b=4,C=60~Included angle C between 0° and 180°.~u²
cosine-side~Cosine rule side~c=\sqrt{a^2+b^2-2ab\cos C}~sqrt(a^2+b^2-2*a*b*cos(C*pi/180))~a=5,b=4,C=60~Included angle C in degrees.~u
sine-rule~Sine rule side~b=a\sin B/\sin A~a*sin(B*pi/180)/sin(A*pi/180)~a=5,A=40,B=60~A,B positive and sum below 180°.~u
triangle-third-angle~Third triangle angle~C=180^\circ-A-B~180-A-B~A=50,B=60~A,B positive with A+B<180°.~degrees
similar-area~Similarity area scale~A_2=k^2A_1~k^2*A~k=2,A=6~Similar figures; linear scale k positive.~u²
similar-volume~Similarity volume scale~V_2=k^3V_1~k^3*V~k=2,V=8~Similar solids; linear scale k positive.~u³
`);
add('Solid measurement','Intermediate',String.raw`
cube-volume~Cube volume~V=s^3~s^3~s=3~Positive side s.~u³
cube-surface~Cube total surface area~SA=6s^2~6*s^2~s=3~Six equal square faces.~u²
cube-lateral~Cube lateral area~LSA=4s^2~4*s^2~s=3~Four side faces; excludes top and bottom.~u²
cube-diagonal~Cube space diagonal~d=s\sqrt3~s*sqrt(3)~s=3~Positive side s.~u
cuboid-volume~Cuboid volume~V=lwh~l*w*h~l=4,w=3,h=2~Independent perpendicular dimensions.~u³
cuboid-surface~Cuboid total surface area~SA=2(lw+wh+hl)~2*(l*w+w*h+h*l)~l=4,w=3,h=2~Dimensions positive.~u²
cuboid-lateral~Cuboid lateral area~LSA=2h(l+w)~2*h*(l+w)~l=4,w=3,h=2~Base dimensions l,w.~u²
cuboid-diagonal~Cuboid space diagonal~d=\sqrt{l^2+w^2+h^2}~sqrt(l^2+w^2+h^2)~l=4,w=3,h=2~Perpendicular dimensions.~u
cylinder-volume~Cylinder volume~V=\pi r^2h~pi*r^2*h~r=2,h=3~Right circular cylinder.~u³
cylinder-curved~Cylinder curved area~CSA=2\pi rh~2*pi*r*h~r=2,h=3~Excludes end circles.~u²
cylinder-total~Cylinder total surface area~SA=2\pi r(r+h)~2*pi*r*(r+h)~r=2,h=3~Closed cylinder.~u²
cone-volume~Cone volume~V=\pi r^2h/3~pi*r^2*h/3~r=2,h=3~Right circular cone.~u³
cone-slant~Cone slant height~l=\sqrt{r^2+h^2}~sqrt(r^2+h^2)~r=2,h=3~Right circular cone.~u
cone-curved~Cone curved area~CSA=\pi r\sqrt{r^2+h^2}~pi*r*sqrt(r^2+h^2)~r=2,h=3~Right circular cone.~u²
cone-total~Cone total surface area~SA=\pi r(r+\sqrt{r^2+h^2})~pi*r*(r+sqrt(r^2+h^2))~r=2,h=3~Includes circular base.~u²
sphere-volume~Sphere volume~V=4\pi r^3/3~4*pi*r^3/3~r=3~Radius positive.~u³
sphere-surface~Sphere surface area~SA=4\pi r^2~4*pi*r^2~r=3~Radius positive.~u²
hemisphere-volume~Hemisphere volume~V=2\pi r^3/3~2*pi*r^3/3~r=3~Half a sphere.~u³
hemisphere-curved~Hemisphere curved area~CSA=2\pi r^2~2*pi*r^2~r=3~Excludes base disk.~u²
hemisphere-total~Hemisphere total area~SA=3\pi r^2~3*pi*r^2~r=3~Includes base disk.~u²
frustum-volume~Frustum volume~V=\pi h(R^2+Rr+r^2)/3~pi*h*(R^2+R*r+r^2)/3~R=3,r=1,h=4~Parallel circular ends of a right cone frustum.~u³
frustum-slant~Frustum slant height~l=\sqrt{h^2+(R-r)^2}~sqrt(h^2+(R-r)^2)~R=3,r=1,h=4~Outer R≥r≥0.~u
frustum-curved~Frustum curved area~CSA=\pi(R+r)\sqrt{h^2+(R-r)^2}~pi*(R+r)*sqrt(h^2+(R-r)^2)~R=3,r=1,h=4~Excludes both end circles.~u²
frustum-total~Frustum total area~SA=\pi[R^2+r^2+(R+r)l]~pi*(R^2+r^2+(R+r)*sqrt(h^2+(R-r)^2))~R=3,r=1,h=4~l is slant height.~u²
prism-volume~Prism volume~V=Bh~B*h~B=6,h=4~Constant base cross-section B and perpendicular height h.~u³
prism-total~Right prism surface area~SA=2B+Ph~2*B+P*h~B=6,P=12,h=4~P is base perimeter.~u²
pyramid-volume~Pyramid volume~V=Bh/3~B*h/3~B=16,h=6~h perpendicular to base.~u³
square-pyramid-surface~Right square pyramid area~SA=s^2+2s\sqrt{h^2+s^2/4}~s^2+2*s*sqrt(h^2+s^2/4)~s=4,h=6~Apex above centre of square base.~u²
tetra-volume~Regular tetrahedron volume~V=s^3/(6\sqrt2)~s^3/(6*sqrt(2))~s=4~All edges equal s.~u³
tetra-surface~Regular tetrahedron surface~SA=\sqrt3s^2~sqrt(3)*s^2~s=4~Four equilateral faces.~u²
euler~Euler polyhedron edge count~E=F+V-2~F+V-2~F=6,V=8~Convex polyhedron boundary; F faces and V vertices.~count
`);
add('Coordinate geometry','Intermediate',String.raw`
point-distance~Distance between two points~d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}~sqrt((x2-x1)^2+(y2-y1)^2)~x1=1,y1=2,x2=4,y2=6~Equal scale perpendicular axes.~u
midpoint-x~Midpoint x coordinate~x_m=(x_1+x_2)/2~(x1+x2)/2~x1=1,x2=5~Cartesian coordinates.~u
midpoint-y~Midpoint y coordinate~y_m=(y_1+y_2)/2~(y1+y2)/2~y1=2,y2=6~Cartesian coordinates.~u
section-x~Internal division x~x=(mx_2+nx_1)/(m+n)~(m*x2+n*x1)/(m+n)~m=2,n=1,x1=1,x2=7~AP:PB=m:n; m,n positive.~u
section-y~Internal division y~y=(my_2+ny_1)/(m+n)~(m*y2+n*y1)/(m+n)~m=2,n=1,y1=1,y2=7~AP:PB=m:n; m,n positive.~u
external-x~External division x~x=(mx_2-nx_1)/(m-n)~(m*x2-n*x1)/(m-n)~m=2,n=1,x1=1,x2=4~m,n positive and unequal.~u
slope~Slope between two points~m=(y_2-y_1)/(x_2-x_1)~(y2-y1)/(x2-x1)~x1=1,y1=2,x2=4,y2=8~Different x coordinates; vertical-line slope undefined.~value
line-slope~Slope-intercept line~y=mx+c~m*x+c~m=2,x=3,c=1~Real inputs.~u
point-slope~Point-slope line~y=y_1+m(x-x_1)~y1+m*(x-x1)~y1=2,m=2,x=4,x1=1~Nonvertical line.~u
intercept-line~Intercept line~y=b(1-x/a)~b*(1-x/a)~a=4,b=3,x=2~Nonzero x intercept a.~u
point-line-distance~Point to line distance~d=|ax+by+c|/\sqrt{a^2+b^2}~abs(a*x+b*y+c)/sqrt(a^2+b^2)~a=3,b=4,c=-10,x=2,y=3~a,b not both zero.~u
parallel-distance~Parallel line separation~d=|c_2-c_1|/\sqrt{a^2+b^2}~abs(c2-c1)/sqrt(a^2+b^2)~a=3,b=4,c1=2,c2=12~Lines share identical a,b coefficients.~u
centroid-x~Triangle centroid x~x_G=(x_1+x_2+x_3)/3~(x1+x2+x3)/3~x1=0,x2=6,x3=0~Three noncollinear vertices for a triangle.~u
centroid-y~Triangle centroid y~y_G=(y_1+y_2+y_3)/3~(y1+y2+y3)/3~y1=0,y2=0,y3=3~Three noncollinear vertices.~u
coordinate-area~Triangle area from coordinates~A=|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)|/2~abs(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))/2~x1=0,y1=0,x2=4,y2=0,x3=0,y3=3~Noncollinear vertices give positive area.~u²
perpendicular-slope~Perpendicular slope~m_2=-1/m_1~-1/m~m=2~Nonzero finite m; vertical/horizontal pair handled separately.~value
circle-upper~Circle upper semicircle~y=k+\sqrt{r^2-(x-h)^2}~k+sqrt(r^2-(x-h)^2)~k=0,r=3,x=1,h=0~|x−h|≤r; r positive.~u
parabola-up~Vertical parabola~y=x^2/(4a)~x^2/(4*a)~x=2,a=1~a nonzero; focus (0,a).~u
ellipse-upper~Ellipse upper half~y=b\sqrt{1-x^2/a^2}~b*sqrt(1-x^2/a^2)~a=4,b=2,x=1~a,b positive and |x|≤a.~u
hyperbola-upper~Hyperbola upper branch value~y=b\sqrt{x^2/a^2-1}~b*sqrt(x^2/a^2-1)~a=2,b=1,x=3~|x|≥a and a,b positive.~u
`);
add('Trigonometry','Advanced',String.raw`
sine~Sine ratio~y=\sin\theta~sin(theta*pi/180)~theta=30~θ in degrees.~value
cosine~Cosine ratio~x=\cos\theta~cos(theta*pi/180)~theta=60~θ in degrees.~value
tangent~Tangent ratio~t=\tan\theta~sin(theta*pi/180)/cos(theta*pi/180)~theta=45~Undefined at θ=90°+180°k.~value
cosecant~Cosecant ratio~c=1/\sin\theta~1/sin(theta*pi/180)~theta=30~Undefined at θ=180°k.~value
secant~Secant ratio~s=1/\cos\theta~1/cos(theta*pi/180)~theta=60~Undefined at θ=90°+180°k.~value
cotangent~Cotangent ratio~c=\cos\theta/\sin\theta~cos(theta*pi/180)/sin(theta*pi/180)~theta=45~Undefined at θ=180°k.~value
radians~Degrees to radians~r=\theta\pi/180~theta*pi/180~theta=90~θ in degrees.~radians
degrees~Radians to degrees~\theta=180r/\pi~180*r/pi~r=1.5707963268~r in radians.~degrees
pythagorean-trig~Sine-cosine identity~\sin^2\theta+\cos^2\theta=1~sin(theta*pi/180)^2+cos(theta*pi/180)^2~theta=35~All real angles.~value
tan-identity~Secant-tangent identity~\sec^2\theta-\tan^2\theta=1~1/cos(theta*pi/180)^2-tan(theta*pi/180)^2~theta=35~cosθ nonzero.~value
cot-identity~Cosecant-cotangent identity~\csc^2\theta-\cot^2\theta=1~1/sin(theta*pi/180)^2-(cos(theta*pi/180)/sin(theta*pi/180))^2~theta=35~sinθ nonzero.~value
sin-sum~Sine of angle sum~\sin(A+B)=\sin A\cos B+\cos A\sin B~sin(A*pi/180)*cos(B*pi/180)+cos(A*pi/180)*sin(B*pi/180)~A=30,B=45~A,B in degrees.~value
sin-difference~Sine of angle difference~\sin(A-B)=\sin A\cos B-\cos A\sin B~sin(A*pi/180)*cos(B*pi/180)-cos(A*pi/180)*sin(B*pi/180)~A=60,B=30~A,B in degrees.~value
cos-sum~Cosine of angle sum~\cos(A+B)=\cos A\cos B-\sin A\sin B~cos(A*pi/180)*cos(B*pi/180)-sin(A*pi/180)*sin(B*pi/180)~A=30,B=45~A,B in degrees.~value
cos-difference~Cosine of angle difference~\cos(A-B)=\cos A\cos B+\sin A\sin B~cos(A*pi/180)*cos(B*pi/180)+sin(A*pi/180)*sin(B*pi/180)~A=60,B=30~A,B in degrees.~value
tan-sum~Tangent of angle sum~\tan(A+B)=(\tan A+\tan B)/(1-\tan A\tan B)~(tan(A*pi/180)+tan(B*pi/180))/(1-tan(A*pi/180)*tan(B*pi/180))~A=20,B=30~Both tangents and final denominator defined.~value
sin-double~Sine double angle~\sin2A=2\sin A\cos A~2*sin(A*pi/180)*cos(A*pi/180)~A=30~A in degrees.~value
cos-double~Cosine double angle~\cos2A=1-2\sin^2A~1-2*sin(A*pi/180)^2~A=30~A in degrees.~value
tan-double~Tangent double angle~\tan2A=2\tan A/(1-\tan^2A)~2*tan(A*pi/180)/(1-tan(A*pi/180)^2)~A=20~Denominator nonzero and tanA defined.~value
sin-half~Positive sine half angle~\sin(A/2)=\sqrt{(1-\cos A)/2}~sqrt((1-cos(A*pi/180))/2)~A=60~0≤A≤360 ensures sine half-angle nonnegative.~value
cos-half~Positive cosine half angle~\cos(A/2)=\sqrt{(1+\cos A)/2}~sqrt((1+cos(A*pi/180))/2)~A=60~−180≤A≤180; otherwise choose sign by quadrant.~value
height-distance~Height from elevation~h=d\tan\theta~d*tan(theta*pi/180)~d=20,theta=30~0<θ<90°; level ground and observer datum.~u
inverse-sine~Principal inverse sine~\theta=\sin^{-1}x~asin(x)*180/pi~x=0.5~−1≤x≤1; output −90° to 90°.~degrees
inverse-cosine~Principal inverse cosine~\theta=\cos^{-1}x~acos(x)*180/pi~x=0.5~−1≤x≤1; output 0° to 180°.~degrees
inverse-tangent~Principal inverse tangent~\theta=\tan^{-1}x~atan(x)*180/pi~x=1~Output strictly between −90° and 90°.~degrees
`);
add('Logarithms & functions','Advanced',String.raw`
natural-log~Natural logarithm~y=\ln x~log(x)~x=3~x positive.~value
common-log~Common logarithm~y=\log_{10}x~log10(x)~x=100~x positive.~value
log-base~Logarithm change of base~\log_bx=\ln x/\ln b~log(x)/log(b)~x=8,b=2~x>0; b>0 and b≠1.~value
log-product~Logarithm of product~\ln(ab)=\ln a+\ln b~log(a)+log(b)~a=2,b=3~a,b positive.~value
log-quotient~Logarithm of quotient~\ln(a/b)=\ln a-\ln b~log(a)-log(b)~a=8,b=2~a,b positive.~value
log-power~Logarithm of power~\ln(a^n)=n\ln a~n*log(a)~a=2,n=3~a positive.~value
exponential~Natural exponential~y=e^x~exp(x)~x=2~Real x within finite numeric range.~value
exponential-base~Exponential function~y=b^x~b^x~b=2,x=3~b positive.~value
inverse-linear~Inverse linear function~x=(y-b)/a~(y-b)/a~y=7,b=1,a=2~a nonzero.~value
composition-linear~Composition of linear functions~f(g(x))=a(cx+d)+b~a*(c*x+d)+b~a=2,c=3,x=2,d=1,b=4~f(x)=ax+b and g(x)=cx+d.~value
`);
add('Calculus','Advanced',String.raw`
derivative-power~Power-rule derivative~f'(x)=nx^{n-1}~n*x^(n-1)~n=3,x=2~For general real n use x>0.~output / input
derivative-square~Derivative of square~f'(x)=2x~2*x~x=3~f(x)=x².~output / input
derivative-cubic~Derivative of cube~f'(x)=3x^2~3*x^2~x=2~f(x)=x³.~output / input
derivative-reciprocal~Derivative of reciprocal~f'(x)=-1/x^2~-1/x^2~x=2~x nonzero.~output / input
derivative-sqrt~Derivative of square root~f'(x)=1/(2\sqrt x)~1/(2*sqrt(x))~x=4~x positive.~output / input
derivative-exp~Derivative of exponential~f'(x)=e^x~exp(x)~x=1~f(x)=eˣ.~output / input
derivative-ln~Derivative of natural logarithm~f'(x)=1/x~1/x~x=2~x positive.~output / input
derivative-sin~Derivative of sine~f'(x)=\cos x~cos(x)~x=1~Input x is in radians.~output / input
derivative-cos~Derivative of cosine~f'(x)=-\sin x~-sin(x)~x=1~Input x in radians.~output / input
derivative-tan~Derivative of tangent~f'(x)=1/\cos^2x~1/cos(x)^2~x=0.5~x radians; cosx nonzero.~output / input
derivative-base~Derivative of a to x~f'(x)=a^x\ln a~a^x*log(a)~a=2,x=3~a positive.~output / input
chain-power~Chain rule for linear power~f'(x)=na(ax+b)^{n-1}~n*a*(a*x+b)^(n-1)~n=3,a=2,x=1,b=1~Positive inner expression for general real n.~output / input
product-example~Product-rule example~(xe^x)'=e^x(1+x)~exp(x)*(1+x)~x=1~Illustrates derivative of x times eˣ.~output / input
quotient-example~Quotient-rule example~\left(\frac{x}{x+1}\right)'=1/(x+1)^2~1/(x+1)^2~x=2~x≠−1.~output / input
secant-square~Square-function secant slope~m=2a+h~2*a+h~a=2,h=1~Difference quotient uses h≠0; expression extends to tangent at h=0.~output / input
second-derivative-cubic~Cubic second derivative~f''(x)=6x~6*x~x=2~f(x)=x³.~output / input²
integral-power~Power antiderivative representative~F(x)=x^{n+1}/(n+1)~x^(n+1)/(n+1)~x=2,n=2~n≠−1; use x>0 for general real n; add arbitrary C.~output × input
integral-ln~Reciprocal antiderivative representative~F(x)=\ln|x|~log(abs(x))~x=2~x nonzero; add arbitrary C.~value
integral-sin~Sine antiderivative representative~F(x)=-\cos x~-cos(x)~x=1~x in radians; add arbitrary C.~value
integral-cos~Cosine antiderivative representative~F(x)=\sin x~sin(x)~x=1~x in radians; add arbitrary C.~value
integral-exp~Exponential antiderivative representative~F(x)=e^x~exp(x)~x=1~Add arbitrary integration constant C.~value
definite-square~Definite integral of x squared~I=(b^3-a^3)/3~(b^3-a^3)/3~a=0,b=3~Signed integral follows the given bound order.~u²
definite-linear~Definite integral of x~I=(b^2-a^2)/2~(b^2-a^2)/2~a=0,b=4~Signed integral; bounds may be reversed.~u²
definite-constant~Integral of constant~I=c(b-a)~c*(b-a)~c=3,a=1,b=4~Constant c over interval.~output × input
definite-exp~Definite exponential integral~I=e^b-e^a~exp(b)-exp(a)~a=0,b=1~Input in compatible dimensionless units.~value
definite-sin~Definite sine integral~I=\cos a-\cos b~cos(a)-cos(b)~a=0,b=1.5707963268~Bounds in radians.~value
definite-cos~Definite cosine integral~I=\sin b-\sin a~sin(b)-sin(a)~a=0,b=1.5707963268~Bounds in radians.~value
average-function~Average of square function~f_{avg}=(b^3-a^3)/[3(b-a)]~(b^3-a^3)/(3*(b-a))~a=0,b=3~Distinct bounds a,b.~value
motion-position~Constant-acceleration position~s=ut+at^2/2~u*t+a*t^2/2~u=3,a=2,t=4~Constant acceleration model.~m
motion-velocity~Constant-acceleration velocity~v=u+at~u+a*t~u=3,a=2,t=4~Time t in seconds; a in m/s².~m/s
`);
add('Statistics & probability','Advanced',String.raw`
mean-three~Mean of three observations~\bar x=(a+b+c)/3~(a+b+c)/3~a=4,b=7,c=10~Equal observation weights.~data units
weighted-mean~Weighted mean of two values~\bar x=(w_1x_1+w_2x_2)/(w_1+w_2)~(w1*x1+w2*x2)/(w1+w2)~w1=2,x1=4,w2=3,x2=8~Weights nonnegative and sum positive.~data units
range~Data range~R=x_{max}-x_{min}~high-low~high=12,low=3~high≥low.~data units
variance-three~Population variance of three values~\sigma^2=\frac13\sum(x_i-\bar x)^2~((a-(a+b+c)/3)^2+(b-(a+b+c)/3)^2+(c-(a+b+c)/3)^2)/3~a=2,b=4,c=6~Entire three-observation population.~data units²
sample-variance-three~Sample variance of three values~s^2=\frac12\sum(x_i-\bar x)^2~((a-(a+b+c)/3)^2+(b-(a+b+c)/3)^2+(c-(a+b+c)/3)^2)/2~a=2,b=4,c=6~Three independent sample observations; denominator n−1.~data units²
standard-deviation~Standard deviation~\sigma=\sqrt V~sqrt(V)~V=4~Variance V nonnegative.~data units
z-score~Standard score~z=(x-\mu)/\sigma~(x-mu)/sigma~x=85,mu=70,sigma=10~Standard deviation σ positive.~value
coefficient-variation~Coefficient of variation~CV=100\sigma/\mu~100*sigma/mu~sigma=5,mu=20~Positive mean on ratio-scale data.~%
probability-classical~Classical probability~P(E)=f/N~f/N~f=3,N=6~Equally likely outcomes; integers 0≤f≤N.~probability
probability-complement~Complementary event~P(E^c)=1-p~1-p~p=0.3~0≤p≤1.~probability
probability-union~Union of two events~P(A\cup B)=p+q-r~p+q-r~p=0.4,q=0.3,r=0.1~r is valid intersection probability.~probability
probability-independent~Independent intersection~P(A\cap B)=pq~p*q~p=0.5,q=0.5~Independent events and probabilities in [0,1].~probability
conditional~Conditional probability~P(A|B)=P(A\cap B)/P(B)~joint/q~joint=0.2,q=0.5~q>0 and 0≤joint≤q.~probability
bayes~Bayes with two hypotheses~P(H_1|E)=pa/[pa+(1-p)b]~p*a/(p*a+(1-p)*b)~p=0.3,a=0.8,b=0.2~p prior; a,b likelihoods; evidence probability positive.~probability
permutations~Ordered selections~{}^nP_r=n!/(n-r)!~fact(n)/fact(n-r)~n=6,r=3~Integers 0≤r≤n≤50.~count
combinations~Unordered selections~{}^nC_r=n!/[r!(n-r)!]~choose(n,r)~n=6,r=3~Integers 0≤r≤n≤50.~count
replacement-orders~Ordered selections with replacement~N=n^r~n^r~n=6,r=3~Nonnegative integers n,r.~count
binomial-probability~Binomial probability~P(X=k)=\binom nk p^k(1-p)^{n-k}~choose(n,k)*p^k*(1-p)^(n-k)~n=6,k=3,p=0.5~Integer 0≤k≤n≤50; independent equal-p Bernoulli trials.~probability
binomial-mean~Binomial mean~E(X)=np~n*p~n=20,p=0.3~n trials and success probability p∈[0,1].~count
binomial-variance~Binomial variance~V(X)=np(1-p)~n*p*(1-p)~n=20,p=0.3~Independent Bernoulli trials.~count²
geometric-probability~Geometric first-success probability~P(X=k)=(1-p)^{k-1}p~(1-p)^(k-1)*p~p=0.3,k=3~k positive integer; 0<p≤1.~probability
geometric-mean~Geometric waiting-time mean~E(X)=1/p~1/p~p=0.3~Trials counted from 1; 0<p≤1.~count
poisson-probability~Poisson probability~P(X=k)=e^{-\lambda}\lambda^k/k!~exp(-lambda)*lambda^k/fact(k)~lambda=3,k=2~λ>0 and nonnegative integer k.~probability
expectation-two~Expected value of two outcomes~E(X)=px+(1-p)y~p*x+(1-p)*y~p=0.4,x=10,y=2~Exactly two outcomes; 0≤p≤1.~value
experimental-frequency~Experimental relative frequency~f=n/N~n/N~n=47,N=100~Integer counts 0≤n≤N and N>0.~probability
`);
add('Vectors, matrices & 3D coordinates','Advanced',String.raw`
vector-magnitude~Vector magnitude~|v|=\sqrt{x^2+y^2+z^2}~sqrt(x^2+y^2+z^2)~x=3,y=4,z=2~Perpendicular equal-scale axes.~u
dot-product~Dot product~u\cdot v=ax+by+cz~a*x+b*y+c*z~a=1,b=2,c=3,x=4,y=2,z=1~Components in an orthonormal basis.~u²
vector-angle~Angle between vectors~\theta=\cos^{-1}\frac{ax+by+cz}{|u||v|}~acos((a*x+b*y+c*z)/(sqrt(a^2+b^2+c^2)*sqrt(x^2+y^2+z^2)))*180/pi~a=1,b=0,c=0,x=1,y=1,z=0~Both vectors nonzero.~degrees
unit-vector-x~Unit vector x component~\hat v_x=x/|v|~x/sqrt(x^2+y^2+z^2)~x=3,y=4,z=0~Vector nonzero.~value
cross-x~Cross product x component~(u\times v)_x=bz-cy~b*z-c*y~b=2,c=3,y=4,z=1~Right-handed orthonormal basis.~u²
cross-y~Cross product y component~(u\times v)_y=cx-az~c*x-a*z~c=3,a=1,x=4,z=1~Right-handed orthonormal basis.~u²
cross-z~Cross product z component~(u\times v)_z=ay-bx~a*y-b*x~a=1,b=2,x=4,y=2~Right-handed orthonormal basis.~u²
projection~Scalar projection~p=(u\cdot v)/|v|~(a*x+b*y+c*z)/sqrt(x^2+y^2+z^2)~a=3,b=4,c=0,x=1,y=0,z=0~Projection direction v nonzero.~u
matrix-det~2 by 2 determinant~\det A=ad-bc~a*d-b*c~a=2,b=1,c=1,d=3~Matrix entries real.~value
matrix-trace~2 by 2 trace~tr(A)=a+d~a+d~a=2,d=3~Sum of diagonal entries.~value
matrix-x~Matrix transformed x~x'=ax+by~a*x+b*y~a=2,b=1,x=3,y=2~First row of 2×2 matrix.~u
matrix-y~Matrix transformed y~y'=cx+dy~c*x+d*y~c=1,d=3,x=3,y=2~Second row of 2×2 matrix.~u
rotation-x~Rotation x coordinate~x'=x\cos\theta-y\sin\theta~x*cos(theta*pi/180)-y*sin(theta*pi/180)~x=2,y=1,theta=45~Counterclockwise rotation; θ degrees.~u
rotation-y~Rotation y coordinate~y'=x\sin\theta+y\cos\theta~x*sin(theta*pi/180)+y*cos(theta*pi/180)~x=2,y=1,theta=45~Counterclockwise rotation.~u
matrix-area~Transformed area~A'=|ad-bc|A~abs(a*d-b*c)*A~a=2,b=0,c=0,d=3,A=4~Linear plane transformation.~u²
distance-3d~3D point distance~d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}~sqrt((x2-x1)^2+(y2-y1)^2+(z2-z1)^2)~x1=0,y1=0,z1=0,x2=2,y2=3,z2=6~Orthonormal Cartesian coordinates.~u
plane-distance~Point to plane distance~d=|ax+by+cz+d|/\sqrt{a^2+b^2+c^2}~abs(a*x+b*y+c*z+d)/sqrt(a^2+b^2+c^2)~a=1,b=2,c=2,d=-3,x=1,y=2,z=3~Normal (a,b,c) nonzero.~u
complex-modulus~Complex modulus~|z|=\sqrt{a^2+b^2}~sqrt(a^2+b^2)~a=3,b=4~z=a+bi.~value
complex-product-real~Complex product real part~Re(zw)=ac-bd~a*c-b*d~a=2,b=3,c=1,d=2~z=a+bi and w=c+di.~value
complex-product-imag~Complex product imaginary part~Im(zw)=ad+bc~a*d+b*c~a=2,b=3,c=1,d=2~z=a+bi and w=c+di.~value
`);
// Duplicate mathematical names across domains have stable, domain-qualified IDs.
const seen=new Set<string>();for(const f of formulas){if(seen.has(f.id))f.id=f.domain.toLowerCase().replace(/[^a-z]+/g,'-')+'-'+f.id;if(seen.has(f.id))throw Error('Duplicate formula '+f.id);seen.add(f.id)}
export const formulaDomains=[...new Set(formulas.map(f=>f.domain))];
export const difficultyLevels=['Foundation','Beginner','Intermediate','Advanced'];
