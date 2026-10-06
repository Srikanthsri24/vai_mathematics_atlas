import {formulas} from './formulaCatalog';
import {calculate,formatValue} from './formulaMath.mjs';
import type {Topic} from './data';
import type {Parameters} from './parameters';
import {solidMeasures} from './solidMath.mjs';
import {gcd,round,statistics,riemann,triangleMetrics} from './math.mjs';
export function relationship(t:Topic,p:Parameters){const a=Number(p.a),b=Number(p.b),r=Number(p.r),h=Number(p.h),n=Number(p.n);if(t.id.startsWith('lab-')){const f=formulas.find(f=>f.id===p.formulaId);return f?`${f.title}: ${formatValue(calculate(f.expression,p))} ${f.unit}`:'Choose a relationship in the model.'}switch(t.id){
case 'number':return `Position x = ${a}; distance |x| = ${Math.abs(a)} u`;
case 'place':return `${a} = 100 × ${Math.floor(a/100)} + 10 × ${Math.floor(a%100/10)} + ${a%10}`;
case 'addition':return p.operation==='Add'?`${a} + ${b} = ${a+b}`:`${a} − ${b} = ${a-b}`;
case 'array':case 'area':return `${a} × ${b} = ${a*b}${t.id==='area'?` u²; P = 2(${a}+${b}) = ${2*(a+b)} u`:' objects'}`;
case 'division':return `${a} = ${b} × ${Math.floor(a/b)} + ${a%b}`;
case 'fraction':return `${p.n} ÷ ${p.d} = ${round(n/Number(p.d),4)} = ${round(n/Number(p.d)*100,2)}%`;
case 'percentage':case 'decimal':return `${a}/100 = ${a/100} = ${a}%`;
case 'ratio':return `${a}:${b} = ${2*a}:${2*b}; quotient = ${round(a/b,3)}`;
case 'balance':return `x + ${a} = ${a+b} → x = ${a+b} − ${a} = ${b}`;
case 'angle':return `θ = ${a}°; ${a<=180?`supplement = 180 − ${a} = ${180-a}°`:'No nonnegative supplementary angle'}`;
case 'triangle':{const m=triangleMetrics(p.points as number[][]);return `Area = ${round(m.area/1600,3)} u²; perimeter = ${round(m.perimeter/40,3)} u; ${m.area<1?'degenerate triangle':'angle sum = 180°'}`}
case 'pythagoras':return `${a}² + ${b}² = ${round(a*a+b*b,3)}; c = ${round(Math.hypot(a,b),3)} u`;
case 'circle':return `A = π × ${a}² ≈ ${round(Math.PI*a*a,3)} u²; C ≈ ${round(2*Math.PI*a,3)} u`;
case 'net':return `SA = 6 × ${r}² = ${round(6*r*r,3)} u²`;
case 'solid':case 'volume':if(p.shape==='Hemisphere'||p.shape==='Frustum')return `V = ${round(solidMeasures(String(p.shape),r,h,Math.min(Number(p.top||.7),r)).volume,3)} u³; total SA = ${round(solidMeasures(String(p.shape),r,h,Math.min(Number(p.top||.7),r)).area,3)} u²`;return p.shape==='Cube'?`V = ${r}³ = ${round(r**3,3)} u³`:p.shape==='Sphere'?`V = (4/3)π × ${r}³ ≈ ${round(4/3*Math.PI*r**3,3)} u³`:p.shape==='Cuboid'?`V = ${r} × ${r} × ${h} = ${round(r*r*h,3)} u³`:`V = ${p.shape==='Cone'?'⅓ × ':''}π × ${r}² × ${h} ≈ ${round(Math.PI*r*r*h/(p.shape==='Cone'?3:1),3)} u³`;
case 'coordinate':return `d = √(${a}² + ${b}²) ≈ ${round(Math.hypot(a,b),3)} u`;
case 'graph':return `y = ${a}${p.func==='Quadratic'?'x²':p.func==='Cubic'?'x³':p.func==='Sine'?'sin(x)':'x'} ${b>=0?'+':'−'} ${Math.abs(b)}`;
case 'quadratic':return `D = (${b})² − 4 × ${a} × ${p.c} = ${b*b-4*a*Number(p.c)}${a===0?'; this is not a quadratic':''}`;
case 'sequence':return `aₙ = ${a} + (${n} − 1) × ${b} = ${a+(n-1)*b}; Sₙ = ${n/2*(2*a+(n-1)*b)}`;
case 'commercial':return p.mode==='Discount'?`₹${a} − (${b}/100 × ₹${a}) = ₹${round(a*(1-b/100),2)}`:`I = ${a} × ${p.rate} × ${p.time}/100 = ₹${round(a*Number(p.rate)*Number(p.time)/100,2)}`;
case 'factors':return `HCF(${a},${b}) = ${gcd(a,b)}; LCM = ${a*b}/${gcd(a,b)} = ${a*b/gcd(a,b)}`;
case 'trig':{const rad=a*Math.PI/180;return `sin ${a}° = ${round(Math.sin(rad),4)}; cos ${a}° = ${round(Math.cos(rad),4)}; sin²θ + cos²θ = 1`}
case 'vector':return `|v| = √(${p.x}² + ${p.y}² + ${p.z}²) ≈ ${round(Math.hypot(Number(p.x),Number(p.y),Number(p.z)),3)} u`;
case 'limit':return `(${a} + ${b})² = ${round((a+b)**2,5)} → ${a}² = ${a*a} as h → 0`;
case 'derivative':{const f=p.func==='Cubic'?(x:number)=>x**3/3:p.func==='Sine'?Math.sin:(x:number)=>x*x,d=p.func==='Cubic'?a*a:p.func==='Sine'?Math.cos(a):2*a;return `Δs/Δt = ${b===0?'undefined (0/0)':round((f(a+b)-f(a))/b,5)}; instantaneous rate = ${round(d,5)} m/s`}
case 'integral':{const left=Math.min(a,b),right=Math.max(a,b);return `Midpoint sum = ${round(riemann(left,right,n),5)}; exact = (${right}³ − (${left})³)/3 = ${round((right**3-left**3)/3,5)}`}
case 'statistics':{const values=String(p.text).split(/[\s,]+/).filter(Boolean).map(Number),s=values.length<=80&&values.every(x=>Number.isFinite(x)&&Math.abs(x)<=1000)?statistics(values):null;return s?`Mean = ${values.reduce((a,b)=>a+b,0)}/${values.length} = ${round(s.mean,3)}; median = ${s.median}; variance = ${round(s.variance,3)}`:'Enter a valid nonempty dataset to compute the relationship.'}
case 'probability':return `Expected probability per outcome = 1/${p.experiment==='Coin'?2:6}; ${p.trials} independent trials sampled`;
case 'matrix':return p.transform==='Scale'?`det A = ${a} × ${b} = ${a*b}; area multiplier = ${Math.abs(a*b)}`:p.transform==='Reflect'?'det A = −1; area preserved, orientation reversed':'det A = 1; area preserved';
case 'conic':return `Plane: y = ${p.offset} + tan(${p.angle}°) x; cone: x² + z² = y²`;
}}
export function formulaFor(t:Topic,p:Parameters){if(t.id.startsWith('lab-'))return formulas.find(f=>f.id===p.formulaId)?.tex||t.formula;if(t.id==='commercial'&&p.mode==='Discount')return 'D=Pr/100,\\quad payment=P-D';if(t.id==='graph'&&p.func!=='Linear')return `y=a${p.func==='Quadratic'?'x^2':p.func==='Cubic'?'x^3':'\\sin x'}+b`;if(t.id==='volume'||t.id==='solid')return p.shape==='Hemisphere'?'V=\\frac23\\pi r^3,\\quad SA=3\\pi r^2':p.shape==='Frustum'?'V=\\frac{\\pi h}{3}(r^2+rR+R^2)':p.shape==='Cube'?'V=s^3,\\quad SA=6s^2':p.shape==='Sphere'?'V=\\frac43\\pi r^3,\\quad SA=4\\pi r^2':p.shape==='Cone'?'V=\\frac13\\pi r^2h':p.shape==='Cuboid'?'V=w^2h':'V=\\pi r^2h';return t.formula}
