import {vertices,shapeCenter} from './playgroundMath.mjs';
export function moveCanvasShape(shape,dx,dy){return {...shape,a:[shape.a[0]+dx,shape.a[1]+dy],b:[shape.b[0]+dx,shape.b[1]+dy],...(shape.points?{points:shape.points.map(([x,y])=>[x+dx,y+dy])}:{})};}
export function canvasBounds(shape){
 let points=vertices(shape);
 if(!points.length){const [x,y]=shape.a,r=Math.hypot(shape.b[0]-x,shape.b[1]-y);if(['Circle','Arc','Sector','Annulus','Semicircle'].includes(shape.kind))return {left:x-r,right:x+r,top:y-r,bottom:y+r};else if(shape.kind==='Ellipse'){const rx=Math.abs(shape.b[0]-x),ry=Math.abs(shape.b[1]-y);points=[[x-rx,y-ry],[x+rx,y-ry],[x+rx,y+ry],[x-rx,y+ry]];}else if(shape.kind==='Text')points=[[x,y-26],[x+Math.min(1500,(shape.label||'Your idea').length*16),y+6]];else points=shape.points||[shape.a,shape.b];}
 const [cx,cy]=shapeCenter(shape),angle=(shape.rotation||0)*Math.PI/180;
 const rotated=points.map(([x,y])=>[cx+(x-cx)*Math.cos(angle)-(y-cy)*Math.sin(angle),cy+(x-cx)*Math.sin(angle)+(y-cy)*Math.cos(angle)]);
 return {left:Math.min(...rotated.map(p=>p[0])),right:Math.max(...rotated.map(p=>p[0])),top:Math.min(...rotated.map(p=>p[1])),bottom:Math.max(...rotated.map(p=>p[1]))};
}
export function alignCanvasShape(shape,alignment){const bounds=canvasBounds(shape);const dx=alignment==='Left'?80-bounds.left:alignment==='Right'?1120-bounds.right:alignment==='Center horizontally'?600-(bounds.left+bounds.right)/2:0;const dy=alignment==='Top'?80-bounds.top:alignment==='Bottom'?640-bounds.bottom:alignment==='Center vertically'?360-(bounds.top+bounds.bottom)/2:0;return moveCanvasShape(shape,dx,dy);}
export function fitCanvas(shapes){const bounds=shapes.filter(s=>!s.hidden).map(canvasBounds);if(!bounds.length)return {x:600,y:360,zoom:1};const left=Math.min(...bounds.map(b=>b.left))-60,right=Math.max(...bounds.map(b=>b.right))+60,top=Math.min(...bounds.map(b=>b.top))-60,bottom=Math.max(...bounds.map(b=>b.bottom))+60;return {x:(left+right)/2,y:(top+bottom)/2,zoom:Math.max(.05,Math.min(2.5,1200/(right-left),720/(bottom-top)))};}
export function exactCanvasShape(kind,x,y,width,height,color,id){
 const a=[80+x*40,640-y*40],b=['Circle','Polygon','Star','Equilateral triangle','Sector','Annulus','Arc','Semicircle'].includes(kind)?[a[0]+width*40,a[1]]:kind==='Angle'?[a[0]+160*Math.cos(width*Math.PI/180),a[1]-160*Math.sin(width*Math.PI/180)]:[a[0]+width*40,a[1]-height*40];
 return {id,kind,a,b,color,sides:6,sweep:90,innerRatio:.5,label:'Your label'};
}
