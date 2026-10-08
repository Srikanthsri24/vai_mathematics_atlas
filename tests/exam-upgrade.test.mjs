import test from 'node:test';
import assert from 'node:assert/strict';
import {examCase,examLessons,practiceSet,scoreExam,workedQuestionCount,practiceQuestionCount} from '../src/examContent.mjs';
import {createTiming,visitQuestion,recordAnswerTime,finishTiming,durationMs,timeLabel,reportHtml} from '../src/examAttempt.mjs';
test('Expanded lessons have checked starter answers and exact live inventory counts',()=>{
 const expected={'fraction-add':1,'decimal-multiply':.6,divisibility:3,'prime-factors':4,'square-mental':441,'unit-conversion':10,'reverse-percentage':200,'marked-profit':600,'false-weight':100,replacement:22.5,'average-replacement':22,'simple-discount':500,'stocks-dividends':8.333333,'compound-ratio':4,'ap-sum-exam':155,gp:32,simultaneous:4,races:20,'cyclic-work':5,escalator:10,'triangle-area-exam':15,heron:6,'polygon-angles':180,'sector-area':3.141593,'surface-area':52,'cone-volume':12.566371,'sphere-volume':4.18879,similarity:2.25,'height-distance':10,'coordinate-slope':2,'binomial-count':.004608,'alphabet-rank':26,'word-formation':'No','letter-count':4,'seating-facing':'West','floor-puzzle':3,scheduling:'Task 41','relations-maternal':'Maternal uncle','syllogism-some':'Yes',assumptions:'Same per-worker rate','logic-sufficiency':'Both together only',mirror:'(-1, 3)','water-image':'(2, -4)','paper-fold':2,dice:6,'line-chart':20,'pie-chart':18,'stacked-chart':90,'missing-data':15,median:20,mode:10,'range-data':7,'combined-data':36,caselet:100,'data-ratio':1.5};
 for(const [id,a] of Object.entries(expected))assert.equal(examCase(id).answer,a,id);
 assert.equal(examLessons.length,120);assert.equal(workedQuestionCount,960);assert.equal(practiceQuestionCount,2400);
});
test('All advanced variants preserve independent geometry, dilution, divisors and alternating-work calculations',()=>{
 const close=(id,n,value)=>assert.ok(Math.abs(examCase(id,n).answer-value)<1e-6,id+' '+n);
 for(let n=0;n<20;n++){
  close('replacement',n,(40+4*n)*.75*.75);close('sphere-volume',n,4*Math.PI*(n+1)**3/3);close('cone-volume',n,Math.PI*(n+2)**2);close('sector-area',n,Math.PI*(n+2)**2/4);
  const a=n%5+1,b=Math.floor(n/5)+1,num=2**a*3**b;let divisors=0;for(let i=1;i<=num;i++)if(num%i===0)divisors++;close('prime-factors',n,divisors);
  const at=2*(n+2),bt=2*at;let remain=1,day=0;while(remain>1e-10){const rate=day%2===0?1/at:1/bt;if(remain<=rate+1e-10){day+=remain/rate;break;}remain-=rate;day++;}close('cyclic-work',n,day);
  const h=2+n%10,m=20+5*Math.floor(n/10),diff=Math.abs((h*30+m/2)-m*6);close('clock',n,Math.min(diff,360-diff));
 }
});
test('Question timings accumulate visits, preserve answer timestamps and sum to exam duration',()=>{
 let t=createTiming(['a','b'],1000);t=visitQuestion(t,'b',5000);t=recordAnswerTime(t,'b',6000);t=visitQuestion(t,'a',9000);t=finishTiming(t,10000);
 assert.deepEqual(t.spent,{a:5000,b:4000});assert.equal(t.answeredAt.b,5000);assert.equal(durationMs(t),9000);assert.equal(Object.values(t.spent).reduce((a,b)=>a+b),durationMs(t));assert.deepEqual(finishTiming(t,20000),t);assert.equal(timeLabel(125000),'2:05');
});
test('Timing caps a late background callback at the deadline and ignores backward clock movement',()=>{
 let t=createTiming(['a','b'],1000,60000);t=visitQuestion(t,'b',500);assert.equal(t.spent.a,0);t=visitQuestion(t,'a',2000);t=finishTiming(t,100000);assert.equal(durationMs(t),60000);assert.equal(t.spent.a+t.spent.b,60000);assert.equal(t.endedAt,61000);
});
test('Negative scores and selected-topic random sets use the chosen scoring and scope',()=>{
 const qs=practiceSet({area:'Data',topics:['Statistics & summaries','Tables & charts'],level:'Foundation',count:30,seed:9});assert.equal(qs.length,30);assert.equal(new Set(qs.map(q=>q.id)).size,30);assert.ok(qs.every(q=>{const l=examLessons.find(l=>l.id===q.lessonId);return l.area==='Data'&&l.level==='Foundation'&&['Statistics & summaries','Tables & charts'].includes(l.topic)}));
 const answers=Object.fromEntries(qs.map(q=>[q.id,String(q.options.find(v=>String(v)!==String(q.answer)))]));const stats=scoreExam(qs,answers,1);assert.equal(stats.score,-30);assert.equal(stats.wrong,30);
});
test('Downloaded report includes real answers, timing and penalty details with escaped HTML',()=>{
 const qs=[examCase('work')],answers={[qs[0].id]:'wrong'},timing=finishTiming(createTiming(qs.map(q=>q.id),1000),61000);const html=reportHtml({questions:qs,answers,timing,stats:scoreExam(qs,answers,.25),penalty:.25,lessonNames:{work:'<script>alert(1)</script>'},reportId:'sample'});
 assert.ok(html.includes('-0.25/1'));assert.ok(html.includes('1:00'));assert.ok(html.includes('Last answered at'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));assert.ok(html.includes('Penalty deducted: 0.25'));assert.ok(html.includes('Incorrect'));
});
