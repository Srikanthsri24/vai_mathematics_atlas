import {formulas,type FormulaEntry} from './formulaCatalog';
import {calculate} from './formulaMath.mjs';
import {admissible,describeInputs} from './situations';
export type Challenge={id:string;classNumber:number;topic:string;level:string;title:string;question:string;answer:number;unit:string;hint:string;steps:string[];formulaId?:string;inputs?:Record<string,number>;visual?:{kind:string;values:number[]}};
type Question=Omit<Challenge,'id'|'classNumber'|'topic'|'level'>;
type Builder=(i:number)=>Question;
function q(title:string,question:string,answer:number,unit:string,hint:string,steps:string[],visual?:Question['visual']):Question{return {title,question,answer,unit,hint,steps,visual}}
const gradeOne:[string,Builder][]=[
 ['Counting',i=>q('Count the collection',`Count the dots in this collection. How many are there?`,i+1,'dots','Touch or count each dot once.',[`Count in order from 1 to ${i+1}.`,`There are ${i+1} dots.`],{kind:'dots',values:[i+1]})],
 ['Number bonds',i=>q('Complete the bond',`A box needs 10 crayons. It has ${i} crayons. How many more are needed?`,10-i,'crayons','The two parts must make 10.',[`10 − ${i} = ${10-i}.`])],
 ['Addition',i=>q('Add two groups',`There are ${i+1} red beads and 4 blue beads. How many beads altogether?`,i+5,'beads','Count both groups together.',[`${i+1} + 4 = ${i+5}.`],{kind:'groups',values:[i+1,4]})],
 ['Subtraction',i=>q('What remains?',`You have ${i+6} stickers and give away 5. How many remain?`,i+1,'stickers','Count back five.',[`${i+6} − 5 = ${i+1}.`])],
 ['Comparing numbers',i=>q('Which is larger?',`Which number is larger: ${i+3} or ${i+7}? Enter the larger number.`,i+7,'','Compare the two positions on a number line.',[`${i+7} is to the right of ${i+3}, so it is larger.`])],
 ['Number order',i=>q('The next number',`A counting path ends at ${i+8}. Which number comes immediately next?`,i+9,'','Add one.',[`${i+8} + 1 = ${i+9}.`])],
 ['Skip counting',i=>q('Count in twos',`The pattern ends with ${2*i+2}, ${2*i+4}, __. What comes next?`,2*i+6,'','Every step adds two.',[`${2*i+4} + 2 = ${2*i+6}.`])],
 ['Place value',i=>q('Tens and ones',`Build the number with 2 tens and ${i} ones.`,20+i,'','Two tens make twenty.',[`2 × 10 + ${i} = ${20+i}.`])],
 ['Measurement',i=>q('Compare ribbon lengths',`One ribbon is ${i+4} cm long; another is ${i+6} cm long. Enter the length of the longer ribbon.`,i+6,'cm','The larger number represents the longer length.',[`${i+6} cm is longer than ${i+4} cm.`])],
 ['Money',i=>q('Count the coins',`You have ₹${i+1} and receive ₹3 more. How many rupees do you have?`,i+4,'₹','Combine the amounts.',[`${i+1} + 3 = ${i+4}.`])]
];
const gradeTwo:[string,Builder][]=[
 ['Place value',i=>q('Read a three-digit number',`Write the number with 1 hundred, ${i} tens and 4 ones.`,104+10*i,'','Add each place-value contribution.',[`100 + ${10*i} + 4 = ${104+10*i}.`])],
 ['Addition',i=>q('Library donations',`The library receives ${25+i*3} books on Monday and 18 on Tuesday. Find the total.`,43+i*3,'books','Add ones, then tens.',[`${25+i*3} + 18 = ${43+i*3}.`])],
 ['Subtraction',i=>q('Remaining pages',`A book has ${50+i*4} pages. You read 23. How many remain?`,27+i*4,'pages','Subtract the read pages from the total.',[`${50+i*4} − 23 = ${27+i*4}.`])],
 ['Multiplication',i=>q('Equal packets',`There are ${i+2} packets with 3 biscuits each. How many biscuits?`,(i+2)*3,'biscuits','Add three for each packet.',[`${i+2} × 3 = ${(i+2)*3}.`],{kind:'array',values:[i+2,3]})],
 ['Equal sharing',i=>q('Share equally',`Share ${(i+2)*4} beads equally among 4 children. How many does each receive?`,i+2,'beads','Make four equal groups.',[`${(i+2)*4} ÷ 4 = ${i+2}.`])],
 ['Halves',i=>q('Half a collection',`Half of a collection of ${2*i+4} marbles is blue. How many are blue?`,i+2,'marbles','Divide into two equal parts.',[`${2*i+4} ÷ 2 = ${i+2}.`])],
 ['Time',i=>q('Hours to minutes',`A journey lasts ${i+1} complete hours. How many minutes is that?`,60*(i+1),'minutes','Each hour contains 60 minutes.',[`${i+1} × 60 = ${60*(i+1)}.`])],
 ['Length',i=>q('Metres to centimetres',`A rope is ${i+1} m long. How many centimetres is that?`,100*(i+1),'cm','One metre contains 100 centimetres.',[`${i+1} × 100 = ${100*(i+1)}.`])],
 ['Shapes',i=>q('Rectangle corners',`A display has ${i+1} separate rectangle cards. Count all their corners.`,4*(i+1),'corners','Each rectangle has four corners.',[`4 × ${i+1} = ${4*(i+1)}.`])],
 ['Money',i=>q('Find the change',`You pay ₹100 for an item costing ₹${20+i*5}. Find the change.`,80-i*5,'₹','Subtract the price from the amount paid.',[`100 − ${20+i*5} = ${80-i*5}.`])]
];
const plans:Record<number,[string,string][]>={
 3:[['Multiplication','product'],['Division','quotient'],['Fractions of quantities','fraction-quantity'],['Place value','place-value'],['Measurement','scale-length'],['Area','rectangle-area'],['Perimeter','rectangle-perimeter'],['Data averages','average-two'],['Money','unitary'],['Number patterns','even']],
 4:[['Factors and multiples','gcd'],['Fraction operations','fraction-add'],['Decimals','hundredths'],['Percentages','percent-of'],['Angles','triangle-third-angle'],['Triangles','triangle-area'],['Area and perimeter','square-perimeter'],['Data','range'],['Unitary method','unitary'],['Number powers','square']],
 5:[['Fractions','fraction-multiply'],['Decimals and percents','fraction-percent'],['Percentage quantities','percent-of'],['Averages','mean-three'],['Volume','cube-volume'],['Angles','regular-angle'],['Ratios','ratio-share'],['Area','trapezium-area'],['Coordinates','midpoint-x'],['Profit and loss','profit']],
 6:[['Integers','number-distance'],['Fractions','fraction-divide'],['Decimal operations','decimal-place'],['Linear equations','linear-solve'],['Ratios','direct'],['Angles','interior-sum'],['Mensuration','rectangle-area'],['Statistics','mean-three'],['Divisibility','lcm'],['Powers','power']],
 7:[['Rational numbers','fraction-subtract'],['Simple equations','linear-solve'],['Percentage change','percent-change'],['Profit percentage','profit-rate'],['Simple interest','simple-interest'],['Exponents','power-product'],['Triangle angles','triangle-third-angle'],['Triangle measurement','triangle-area'],['Probability','probability-classical'],['Data comparisons','range']],
 8:[['Exponents','negative-power'],['Algebraic identities','square-sum'],['Linear equations','linear-solve'],['Factorization identities','difference-squares'],['Discounts','sale-price'],['Compound growth','compound-amount'],['Quadrilaterals','rhombus-area'],['Cubes and roots','cube-root'],['Volume','cuboid-volume'],['Data and spread','variance-three']],
 9:[['Polynomials','remainder-theorem'],['Linear models','linear-value'],['Coordinate geometry','point-distance'],['Triangles','triangle-perimeter'],['Heron area','heron'],['Circles','circle-circumference'],['Statistics','mean-three'],['Surface area','cylinder-total'],['Volumes','cone-volume'],['Number systems','surd-product']],
 10:[['Quadratic equations','root-plus'],['Arithmetic progressions','ap-term'],['Similarity','similar-area'],['Right triangles','pythagoras-hyp'],['Trigonometry','height-distance'],['Circle sectors','sector-area'],['Solid measurement','frustum-volume'],['Statistics','weighted-mean'],['Probability','probability-classical'],['Coordinate geometry','coordinate-area']],
 11:[['Counting and combinations','combinations'],['Probability','probability-independent'],['Trigonometric functions','sin-sum'],['Sequences and series','gp-term'],['Straight lines','point-line-distance'],['Conic curves','parabola-up'],['Limits of polynomials','quadratic-value'],['Derivatives','derivative-power'],['Binomial theorem','binomial-term'],['Statistics','sample-variance-three']],
 12:[['Matrices','matrix-x'],['Determinants','matrix-det'],['Linear systems','two-lines-x'],['Vectors','dot-product'],['3D geometry','plane-distance'],['Derivatives','chain-power'],['Derivative applications','second-derivative-cubic'],['Definite integrals','definite-square'],['Conditional probability','conditional'],['Binomial distribution','binomial-probability']]
};
function variation(f:FormulaEntry,i:number):Record<string,number>{
 const base={...f.defaults};
 if(['triangle-perimeter','heron'].includes(f.id)){const k=1+i*.2;return {...base,a:base.a*k,b:base.b*k,c:base.c*k}}
 if(f.id==='probability-independent')return {...base,p:.1+i*.05};
 if(f.id==='conditional')return {...base,joint:.02+i*.03};
 if(f.id==='fraction-quantity')return {...base,Q:4*(i+3),n:i%3+1,d:4};
 if(f.id==='place-value')return {...base,h:1+i%9,t:Math.floor(i/2),u:i%10};
 if(f.id==='decimal-place')return {...base,t:i,h:(i+3)%10};
 if(f.id==='linear-solve')return {...base,a:2,b:3,c:3+2*(i+1)};
 if(f.id==='root-plus'){const r1=i+1,r2=i+3;return {a:1,b:-(r1+r2),c:r1*r2}}
 if(f.id==='variance-three'||f.id==='sample-variance-three')return {...base,a:2+i,b:5+2*i,c:8+3*i};
 if(f.id==='binomial-probability')return {...base,n:i+4,k:2,p:.5};
 if(f.id==='combinations')return {...base,n:i+4,r:2};
 if(f.id==='binomial-term')return {...base,n:i+3,r:2};
 if(f.id==='negative-power')return {...base,a:i+2,n:2};
 if(f.id==='cube-root')return {x:(i+2)**3};
 const keys=Object.keys(base),preferred=f.id==='probability-classical'?['N','f']:f.id==='fraction-percent'?['d','n']:f.id==='gp-term'?['n','a']:f.id==='derivative-power'?['x','n']:f.id==='quadratic-value'?['x']:keys;
 for(const key of preferred){for(const candidate of [base[key]+i+1,base[key]+(i+1)*.1,base[key]+(i+1)*.01,base[key]*(i+2)]){const next={...base,[key]:candidate};if(admissible(f,next))return next}}
 throw new Error('No valid challenge variation: '+f.id);
}
function formulaQuestion(f:FormulaEntry,i:number):Question{
 const inputs=variation(f,i),answer=calculate(f.expression,inputs),given=describeInputs(inputs);let question=`Find ${f.title.toLowerCase()} when ${given}.`;
 if(f.id==='product')question=`A workshop has ${inputs.a} trays with ${inputs.b} items in each. How many items altogether?`;
 if(f.id==='quotient')question=`Divide ${inputs.a} equally among ${inputs.b} groups. Enter the exact share, using a fraction if needed.`;
 if(f.id==='rectangle-area')question=`A rectangle has length ${inputs.l} and width ${inputs.w} units. Find its area.`;
 if(f.id==='quadratic-value')question=`For the polynomial f(x) = ${inputs.a}x² + (${inputs.b})x + ${inputs.c}, find its limit as x approaches ${inputs.x}.`;
 if(f.id==='root-plus')question=`Find the larger root of x² + (${inputs.b})x + ${inputs.c} = 0.`;
 const hint=f.id==='quadratic-value'?'Polynomials are continuous. Substitute the approached input into the polynomial.':`Use ${f.title.toLowerCase()}. ${f.condition}`;
 return {title:f.title,question,answer,unit:f.unit,hint,steps:[`Model: ${f.expression}.`,`Substitute ${given}.`,`Evaluate to obtain ${answer.toPrecision(8)} ${f.unit}.`,`Check: ${f.condition}`],formulaId:f.id,inputs};
}
export const challenges:Challenge[]=Array.from({length:12},(_,g)=>g+1).flatMap(classNumber=>{
 const builders:[string,Builder][]=classNumber===1?gradeOne:classNumber===2?gradeTwo:plans[classNumber].map(([topic,id])=>{const f=formulas.find(f=>f.id===id);if(!f)throw new Error('Missing challenge formula: '+id);return [topic,(i:number)=>formulaQuestion(f,i)]});
 return builders.flatMap(([topic,build],t)=>Array.from({length:10},(_,i)=>({...build(i),id:`class-${classNumber}/topic-${t}/question-${i+1}`,classNumber,topic,level:i<3?'Warm-up':i<7?'Build confidence':'Stretch'})));
});
