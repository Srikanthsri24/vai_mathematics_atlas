export function designPoints(count,radius,phase=0,cx=360,cy=240){
 return Array.from({length:count},(_,i)=>{const angle=(phase+i*360/count)*Math.PI/180;return [cx+radius*Math.cos(angle),cy+radius*Math.sin(angle)]});
}
export function designTiles(rows,columns,gap=4){
 const size=Math.min(440/rows,620/columns);
 return Array.from({length:rows*columns},(_,i)=>({x:360-columns*size/2+i%columns*size+gap/2,y:240-rows*size/2+Math.floor(i/columns)*size+gap/2,size:Math.max(1,size-gap),row:Math.floor(i/columns),column:i%columns}));
}
