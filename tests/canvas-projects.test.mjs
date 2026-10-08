import test from 'node:test';
import assert from 'node:assert/strict';
import {guidedProjects,projectMatches} from '../src/guidedProjects.mjs';
import {exactCanvasShape,alignCanvasShape,canvasBounds,fitCanvas} from '../src/canvasTools.mjs';
import {measureShape} from '../src/playgroundMath.mjs';
import {bisectGraph} from '../src/discovery/graphSolver.mjs';
test('All 260 generated projects have achievable goals and reject incomplete starting geometry',()=>{
 assert.equal(guidedProjects.length,260);assert.equal(new Set(guidedProjects.map(p=>p.id)).size,260);
 for(const project of guidedProjects){assert.equal(project.steps.length,4);assert.ok(!projectMatches(project,project.objects),project.title+' starter must require work');const solution=project.check.metric==='count'?[project.solution,{...project.solution,id:2}]:[project.solution];assert.ok(projectMatches(project,solution),project.title);assert.ok(!projectMatches(project,solution.map(s=>({...s,hidden:true}))),project.title+' hidden objects');}
});
test('Precise insertion uses drawing units and alignment preserves area and boundary length',()=>{
 const shape=exactCanvasShape('Rectangle',4,4,6,4,'#2563eb',1);
 assert.equal(measureShape(shape).area,24);assert.equal(measureShape(shape).length,20);
 for(const alignment of ['Left','Right','Top','Bottom','Center horizontally','Center vertically']){const aligned=alignCanvasShape(shape,alignment);assert.equal(measureShape(aligned).area,24);assert.equal(measureShape(aligned).length,20);const b=canvasBounds(aligned);if(alignment==='Left')assert.equal(b.left,80);if(alignment==='Right')assert.equal(b.right,1120);if(alignment==='Center horizontally')assert.equal((b.left+b.right)/2,600);}
 const circle=exactCanvasShape('Circle',0,0,3,1,'#2563eb',2);assert.ok(Math.abs(measureShape(circle).area-9*Math.PI)<1e-10);assert.deepEqual(canvasBounds({...circle,rotation:45}),canvasBounds(circle));
 const fit=fitCanvas([shape,circle]);for(const item of [shape,circle]){const b=canvasBounds(item);assert.ok(b.left>=fit.x-600/fit.zoom&&b.right<=fit.x+600/fit.zoom);assert.ok(b.top>=fit.y-360/fit.zoom&&b.bottom<=fit.y+360/fit.zoom);}
});
test('Graph bisection finds a bracketed root and rejects poles, invalid intervals and missing sign changes',()=>{
 const root=bisectGraph('x^2-4',0,3);assert.ok(Math.abs(root.root-2)<1e-8);assert.ok(Math.abs(root.residual)<1e-6);assert.ok(root.rows.length>0);
 assert.ok(bisectGraph('1/x',-1,1).error);assert.ok(bisectGraph('x^2+1',-1,1).error);assert.ok(bisectGraph('sqrt(x)',-1,2).error);assert.ok(bisectGraph('x',3,0).error);assert.equal(bisectGraph('x',0,3).root,0);
});
