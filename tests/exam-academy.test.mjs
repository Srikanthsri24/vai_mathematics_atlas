import test from 'node:test';
import assert from 'node:assert/strict';
import {examLessons,examCase,practiceSet,scoreExam,correctExamAnswer} from '../src/examContent.mjs';
test('Worked foundation examples have checked numerical and logical answers',()=>{
 const expected={simplify:30,fractions:72,hcf:4,lcm:24,remainder:3,ratio:80,proportion:100,percentage:30,'percent-change':25,successive:-1,profit:20,discount:600,'simple-interest':240,compound:1210,average:12,weighted:55,mixture:'1:2',partnership:200,ages:25,work:4,pipes:6,speed:120,'average-speed':26.666667,'relative-speed':2,trains:30,boats:10,linear:4,quadratic:2,ap:17,area:24,volume:24,pythagoras:5,trig:.6,permutation:20,combination:10,probability:.333333,table:180,'chart-share':30,'data-growth':40,'data-sufficiency':'Both together only','number-series':14,'letter-series':'I',coding:'DBU',analogy:16,classification:7,directions:'North-east',blood:'Grandmother',ranking:10,'linear-arrangement':'Tara',circular:2,syllogism:'Yes',inequalities:'Asha > Tara',calendar:'Thursday',clock:50,cubes:12,indices:32,surds:'2√2',inverse:6,circle:4,cylinder:88,'without-replacement':.2,venn:40,'conditional-logic':'No',arguments:'No','input-output':11};
 assert.deepEqual(new Set(Object.keys(expected)),new Set(examLessons.map(l=>l.id)));
 for(const [id,value] of Object.entries(expected))assert.equal(examCase(id).answer,value,id);
});
test('All 325 variants have five worked methods, valid choices and distinct givens',()=>{
 assert.equal(examLessons.length,65);assert.equal(new Set(examLessons.map(l=>l.id)).size,65);
 for(const l of examLessons){const prompts=new Set();for(let i=0;i<5;i++){const q=examCase(l.id,i);prompts.add(q.prompt);assert.equal(q.ways.length,5,l.id);assert.equal(new Set(q.ways.map(m=>m.title)).size,5);assert.ok(q.ways.every(m=>m.steps.length>0&&m.steps.every(s=>s.trim().length>0)));assert.equal(q.options.length,4);assert.equal(q.options.filter(v=>correctExamAnswer(v,q.answer)).length,1,l.id);if(typeof q.answer==='number')assert.ok(Number.isFinite(q.answer));}assert.equal(prompts.size,5,l.id);}
});
test('Variant calculations preserve rate, growth, counting and geometric models',()=>{
 const factorial=n=>n<2?1:n*factorial(n-1);
 for(let i=0;i<5;i++){
  const k=i+2;
  assert.equal(examCase('work',i).answer,1/(1/(3*k)+1/(6*k)));
  assert.ok(Math.abs(examCase('pipes',i).answer-1/(1/(2*k)-1/(6*k)))<1e-8);
  assert.equal(examCase('compound',i).answer,(1000+500*i)*121/100);
  assert.equal(examCase('successive',i).answer,(100+10+5*i)*.9-100);
  assert.equal(examCase('permutation',i).answer,(i+5)*(i+4));
  assert.equal(examCase('combination',i).answer,(i+5)*(i+4)/2);
  assert.equal(examCase('circular',i).answer,factorial(i+2));
  assert.equal(examCase('cubes',i).answer,(i+3)**3-8-6*(i+1)**2-(i+1)**3);
  assert.equal(examCase('cylinder',i).answer,22*(i+2)**2);
  const red=i+3,total=red*2,p=red*(red-1)/(total*(total-1));
  assert.ok(Math.abs(examCase('without-replacement',i).answer-p)<1e-6);
 }
});
test('Practice sampling honors filters, excludes duplicates and caps small pools',()=>{
 const config={area:'Quantitative',topic:'Counting & chance',level:'Advanced',count:20,seed:2026};
 const a=practiceSet(config);assert.equal(a.length,5);assert.equal(new Set(a.map(q=>q.id)).size,5);assert.ok(a.every(q=>q.lessonId==='without-replacement'));assert.deepEqual(a,practiceSet(config));
 assert.notDeepEqual(practiceSet({count:20,seed:1}).map(q=>q.id),practiceSet({count:20,seed:2}).map(q=>q.id));
 assert.deepEqual(practiceSet({area:'No such area'}),[]);
});
test('Scoring handles correct, wrong, skipped and zero-valued answers without inventing accuracy',()=>{
 const qs=[examCase('successive',0),examCase('work',0),examCase('calendar',0)];
 const result=scoreExam(qs,{[qs[0].id]:'-1',[qs[1].id]:'5'},.25);
 assert.deepEqual(result,{correct:1,wrong:1,skipped:1,score:.75,accuracy:50});
 assert.equal(correctExamAnswer('',0),false);assert.equal(correctExamAnswer('0',0),true);assert.equal(correctExamAnswer('abc',4),false);
 assert.equal(scoreExam(qs,{}).accuracy,0);assert.equal(scoreExam(qs,{}).skipped,3);
});
