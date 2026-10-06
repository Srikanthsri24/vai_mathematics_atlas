import {formulas,type FormulaEntry} from './formulaCatalog';
import {calculate,formatValue} from './formulaMath.mjs';
import {contextsForFormula} from './situationContexts';
export const situationTypes=['Apply a formula','Compare options','Meet a target','Predict a change','Diagnose an error'] as const;
export type SituationType=typeof situationTypes[number];
export type Situation={id:string;formulaId:string;type:SituationType;title:string;story:string;question:string;given:Record<string,number>;alternative:Record<string,number>;unit:string;answer:number|string;steps:string[];choices?:string[]};
const countKeys=new Set(['n','N','k','f','F','V']);
export function admissible(f:FormulaEntry,v:Record<string,number>):boolean{
 if(Object.values(v).some(n=>!Number.isFinite(n))||!Number.isFinite(calculate(f.expression,v)))return false;
 const id=f.id;
 if(/integer|digit|count|index|trials|outcomes|polyhedron/i.test(f.condition)){for(const k of Object.keys(v))if(countKeys.has(k)&&!Number.isInteger(v[k]))return false}
 if(/place|hundreds|tens/.test(id)&&Object.values(v).some(n=>!Number.isInteger(n)||n<0||n>9))return false;
 if(/regular-|polygon-|interior-sum|exterior-angle/.test(id)&&v.n<3)return false;
 if(['ap-term','ap-sum','ap-last-sum','gp-term','gp-sum','harmonic-term'].includes(id)&&v.n<1)return false;
 if(id==='ap-difference'&&v.n<=1)return false;
 if(id==='gp-infinite'&&Math.abs(v.r)>=1)return false;
 if(id==='remainder'&&(!Number.isInteger(v.a)||!Number.isInteger(v.b)||v.a<0||v.b<=0))return false;
 if(id==='bond'&&(v.a<0||v.a>v.S))return false;
 if(['probability-classical','experimental-frequency'].includes(id)){const n=v.f??v.n;if(n<0||n>v.N||v.N<=0)return false}
 if(['probability-complement','probability-independent','probability-union','conditional','bayes','binomial-probability','binomial-mean','binomial-variance','geometric-probability','statistics-probability-geometric-mean','expectation-two'].includes(id)){
   for(const k of ['p','q','joint'])if(k in v&&(v[k]<0||v[k]>1))return false;
   if(id==='probability-union'&&(v.r<Math.max(0,v.p+v.q-1)||v.r>Math.min(v.p,v.q)))return false;
   if(id==='conditional'&&(v.q<=0||v.joint>v.q))return false;
   if(id==='bayes'&&([v.a,v.b].some(n=>n<0||n>1)))return false;
   if(/geometric/.test(id)&&v.p<=0)return false;
 }
 if(/binomial|permutations|combinations/.test(id)){if(v.n<0||v.n>50)return false;const k=v.k??v.r;if(k!==undefined&&(!Number.isInteger(k)||k<0||k>v.n))return false}
 if(id==='factorial'&&(!Number.isInteger(v.n)||v.n<0||v.n>170))return false;
 if(id==='poisson-probability'&&(v.lambda<=0||v.k<0||!Number.isInteger(v.k)))return false;
 if(id==='height-distance'&&(v.d<=0||v.theta<=0||v.theta>=90))return false;
 if(['sector-area','arc-length','chord'].includes(id)&&(v.theta<0||v.theta>360))return false;
 if(id==='segment-area'&&(v.theta<0||v.theta>Math.PI))return false;
 if(['sin-half','cos-half'].includes(id)&&(v.theta<0||v.theta>180))return false;
 if(id==='annulus'&&(v.r<0||v.R<v.r))return false;
 if(/frustum/.test(id)&&(v.R<v.r||v.r<=0||v.h<=0))return false;
 if(['heron','triangle-perimeter'].includes(id)&&!(v.a+v.b>v.c&&v.a+v.c>v.b&&v.b+v.c>v.a))return false;
 if(id==='triangle-third-angle'&&(v.A<=0||v.B<=0||v.A+v.B>=180))return false;
 if(id==='triangle-circumradius'){const s=(v.a+v.b+v.c)/2,area=Math.sqrt(s*(s-v.a)*(s-v.b)*(s-v.c));if(Math.abs(area-v.A)>1e-7)return false}
 if(['regular-area'].includes(id)&&Math.abs(v.q-v.s/(2*Math.tan(Math.PI/v.n)))>.001)return false;
 if(['square-area','square-perimeter','square-diagonal','rectangle-area','rectangle-perimeter','rectangle-diagonal','triangle-area','triangle-height','equilateral-area','equilateral-height','parallelogram-area','parallelogram-perimeter','rhombus-area','rhombus-perimeter','kite-area','trapezium-area'].includes(id)&&Object.values(v).some(n=>n<=0))return false;
 if(['Solid measurement','Circles & triangles'].includes(f.domain)&&Object.entries(v).some(([k,n])=>['r','R','s','l','w','h','a','b','c','A','P','B'].includes(k)&&n<=0))return false;
 if(['discount-amount','sale-price','sell-loss'].includes(id)&&((v.d??v.p)<0||(v.d??v.p)>100))return false;
 if(id==='marked-price'&&(v.d<0||v.d>=100))return false;
 if(id==='depreciation'&&(v.r<0||v.r>=100))return false;
 if(['compound-amount','compound-interest'].includes(id)&&(!Number.isInteger(v.n)||v.n<0))return false;
 return true;
}
export function alternativeFor(f:FormulaEntry):Record<string,number>{
 const base=f.defaults;
 if(f.id==='triangle-circumradius')return {...base,a:base.a*1.2,b:base.b*1.2,c:base.c*1.2,A:base.A*1.44};
 if(f.id==='regular-area')return {...base,s:base.s*1.2,q:base.q*1.2};
 for(const key of Object.keys(base)){
  const value=base[key];const candidates=[value+1,value-1,value*1.2,value*.8,value+.1,value-.1];
  for(const x of candidates){const v={...base,[key]:x};if(admissible(f,v)&&Math.abs(calculate(f.expression,v)-calculate(f.expression,base))>1e-8)return v}
 }
 for(const key of Object.keys(base)){const v={...base,[key]:base[key]+.1};if(admissible(f,v))return v}
 return {...base};
}
export const describeInputs=(v:Record<string,number>)=>Object.entries(v).map(([k,n])=>`${k} = ${formatValue(n)}`).join(', ');
const same=(a:number,b:number)=>Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b));
export const formulaSituations:Situation[]=formulas.flatMap(f=>{
 const contexts=contextsForFormula(f),a={...f.defaults},b=alternativeFor(f),outA=calculate(f.expression,a),outB=calculate(f.expression,b),changed=Object.keys(b).filter(k=>b[k]!==a[k]).map(k=>`${k}: ${formatValue(a[k])} → ${formatValue(b[k])}`).join('; ')||'all parameters unchanged',direction=same(outA,outB)?'Stays the same':outB>outA?'Increases':'Decreases',targetChoice=same(outA,outB)?'Both A and B':'Configuration B',wrong=outA+Math.max(1,Math.abs(outA)*.1),correction=outA-wrong;
 const base={formulaId:f.id,story:contexts[0].story,given:a,alternative:b,unit:f.unit};
 return situationTypes.map((type,index)=>{const context=contexts[index];const scenarioBase={...base,story:context.story};
  const common=[`Use ${f.title.toLowerCase()}: ${f.expression}.`,`Configuration A: ${describeInputs(a)} gives ${formatValue(outA)} ${f.unit}.`,`Applicability: ${f.condition}`];
  if(index===0)return {...scenarioBase,id:f.id+'/apply',type,title:context.setting+' · calculate',question:`${context.story} Use ${f.title.toLowerCase()} with ${describeInputs(a)}. What is the modeled result?`,answer:outA,steps:common};
  if(index===1)return {...scenarioBase,id:f.id+'/compare',type,title:context.setting+' · compare',question:`${context.story} Two proposed configurations use ${f.title.toLowerCase()}. A: ${describeInputs(a)}. B: ${describeInputs(b)}. Find the signed difference output B − output A.`,answer:outB-outA,steps:[...common,`Configuration B gives ${formatValue(outB)} ${f.unit}.`,`Subtract B − A: ${formatValue(outB-outA)} ${f.unit}.`]};
  if(index===2)return {...scenarioBase,id:f.id+'/target',type,title:context.setting+' · choose a plan',question:`${context.story} The required ${f.title.toLowerCase()} result is ${formatValue(outB)} ${f.unit}. Which tested configuration meets this target? A: ${describeInputs(a)}. B: ${describeInputs(b)}.`,answer:targetChoice,choices:['Configuration A','Configuration B','Both A and B','Neither configuration'],steps:[...common,`B evaluates to the target ${formatValue(outB)} ${f.unit}.`,`Answer: ${targetChoice}. This compares the tested configurations; it does not assert a unique inverse solution.`]};
  if(index===3)return {...scenarioBase,id:f.id+'/predict',type,title:context.setting+' · predict',question:`${context.story} Before calculating, predict how the ${f.title.toLowerCase()} output changes when ${changed}. Keep every other input fixed.`,answer:direction,choices:['Increases','Decreases','Stays the same'],steps:[...common,`After the change: ${formatValue(outB)} ${f.unit}.`,`The output ${direction.toLowerCase()}.`]};
  return {...scenarioBase,id:f.id+'/diagnose',type,title:context.setting+' · check a report',question:`${context.story} A report claims ${f.title.toLowerCase()} gives ${formatValue(wrong)} ${f.unit} for ${describeInputs(a)}. What signed correction (correct − reported) is required?`,answer:correction,steps:[...common,`The reported value is ${formatValue(wrong)}; the correct value is ${formatValue(outA)}.`,`Signed correction: ${formatValue(correction)} ${f.unit}. A negative correction means reduce the report.`]};
 });
});
