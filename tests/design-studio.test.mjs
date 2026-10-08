import test from 'node:test';
import assert from 'node:assert/strict';
import {designPoints,designTiles} from '../src/designStudioMath.mjs';
test('Radial design vertices preserve radius and rotation for every supported repeat count',()=>{
 for(let count=3;count<=16;count++){
  const points=designPoints(count,110,37);
  assert.equal(points.length,count);
  for(const [x,y] of points)assert.ok(Math.abs(Math.hypot(x-360,y-240)-110)<1e-10);
  const rotated=designPoints(count,110,37+360/count);
  rotated.forEach(([x,y],i)=>{assert.ok(Math.abs(x-points[(i+1)%count][0])<1e-10);assert.ok(Math.abs(y-points[(i+1)%count][1])<1e-10)});
 }
});
test('Design tiles fit the preview and preserve row-by-column counts at all UI limits',()=>{
 for(let rows=3;rows<=7;rows++)for(let columns=3;columns<=16;columns++)for(const gap of [1,12]){
  const tiles=designTiles(rows,columns,gap);
  assert.equal(tiles.length,rows*columns);
  tiles.forEach(tile=>{assert.ok(tile.size>0);assert.ok(tile.x>=0&&tile.y>=0);assert.ok(tile.x+tile.size<=720&&tile.y+tile.size<=480)});
 }
});
