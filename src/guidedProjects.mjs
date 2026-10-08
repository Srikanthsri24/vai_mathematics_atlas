import {measureShape,shapeCenter,transformShape} from './playgroundMath.mjs';
const families=[
 ['Rectangle','Floor plans','Area & perimeter','▭','A=width×height. P=2(width+height).','A floor needs covering material; its boundary needs trim.'],
 ['Square','Tile designs','Area & perimeter','□','A=side². P=4×side.','Square tiles repeat in a grid without gaps.'],
 ['Triangle','Roof panels','Triangles','△','A=base×perpendicular height÷2.','A triangular roof panel needs material based on its area.'],
 ['Right triangle','Ramp panels','Triangles','◿','A=base×height÷2; the two legs are perpendicular.','A ramp side can be modeled as a right triangle.'],
 ['Circle','Circular gardens','Circles & curves','○','A=πr²; circumference=2πr.','Compare garden ground area with the fence around its edge.'],
 ['Ellipse','Oval decorations','Circles & curves','⬭','A=πab for perpendicular semi-axes a,b. The displayed perimeter is an approximation.','An oval decoration has two independent radii.'],
 ['Polygon','Polygon plazas','Polygons & symmetry','⬡','A=n r² sin(2π/n)÷2 for circumradius r; all vertices are equally spaced.','Regular polygons organize a plaza around a central point.'],
 ['Star','Festival stars','Polygons & symmetry','☆','This star alternates outer radius r and inner radius 0.45r. Area is calculated from its vertices.','A star decoration uses repeated rotations and alternating radii.'],
 ['Parallelogram','Slanted panels','Quadrilaterals','▱','A=base×perpendicular height. This template offsets the upper corners by one-quarter of the bounding width.','A slanted panel can have the same covered area as a rectangle.'],
 ['Trapezium','Trapezium beds','Quadrilaterals','⏢','A=(parallel side 1+parallel side 2)×height÷2. This template has a top base half as wide as its bottom base.','A garden bed can have two different parallel boundary lengths.'],
 ['Rhombus','Diamond ornaments','Quadrilaterals','◇','A=diagonal 1×diagonal 2÷2; the template diagonals are perpendicular.','A diamond ornament is measured by its diagonals.'],
 ['Kite','Kite workshop','Quadrilaterals','♢','A=diagonal 1×diagonal 2÷2. This template has perpendicular diagonals and a cross-point at 35% of the vertical diagonal.','A kite canopy can be planned from its two diagonals.'],
 ['Sector','Fan-shaped gardens','Circles & curves','◔','A=θπr²/360. Boundary includes the curved arc and two radii.','A fan-shaped garden occupies a fraction of a full circle.'],
 ['Annulus','Ring borders','Circles & curves','◎','A=πR²(1−q²) for inner/outer radius ratio q. Both circular edges count in the boundary.','A circular border covers the ring between two circles.'],
 ['Semicircle','Arch panels','Circles & curves','◒','A=πr²/2. The boundary is πr+2r, including the diameter.','A semicircular panel contains half a disk.'],
 ['Segment','Survey routes','Lines & measurement','╱','Length=√(Δx²+Δy²). A segment has endpoints and no covered area.','A surveyed straight route is measured between two locations.'],
 ['Vector','Delivery directions','Lines & measurement','↗','Magnitude=√(Δx²+Δy²). Direction and magnitude both matter.','A delivery move can be represented by a directed displacement.'],
 ['Angle','Door rotations','Angles & rotation','∠','Angles are measured counterclockwise from the rightward reference ray; one full turn is 360°.','A hinged door rotates about a fixed point.'],
 ['Equilateral triangle','Triangle emblems','Polygons & symmetry','▵','Three vertices are equally spaced on a circle; A=3√3 r²/4 for circumradius r.','An emblem can use a triangle with three equal sides.'],
 ['Arc','Curved walkways','Circles & curves','⌒','Arc length=θπr/180 when θ is in degrees. An arc is a curve, not a filled region.','A curved walkway follows part of a circular boundary.'],
];
const activities=['Measure & build','Change the scale','Compare footprints','Plan a budget','Design a blueprint','Read the boundary','Rotate & preserve','Mirror a layout','Duplicate a motif','Explain the model','Correct a report','Use consistent units','Predict the change'];
const palette=['#367f6c','#d59d4c','#558ec8','#986fba','#d56f62'];
export const guidedProjects=families.flatMap(([kind,name,category,icon,formula,context],family)=>activities.map((activity,variant)=>{
 const w=2+variant%5,h=2+(variant*2+family)%4,r=2+variant%3,n=3+variant%8,angle=30+variant*15;
 const radial=['Circle','Polygon','Star','Sector','Annulus','Semicircle','Equilateral triangle','Arc'].includes(kind);
 const desired={id:1,kind,a:[480,300],b:kind==='Angle'?[480+160*Math.cos(angle*Math.PI/180),300-160*Math.sin(angle*Math.PI/180)]:radial?[480+r*40,300]:[480+w*40,300+h*40],color:palette[family%5],sides:n,sweep:60+variant*15,innerRatio:.5,rotation:0};
 const measurement=measureShape(desired),areaModel=measurement.area>0;
 let metric=kind==='Angle'?'angle':areaModel?'area':'length',target=measurement[metric],unit=metric==='angle'?'°':metric==='area'?'u²':'u';
 let starter={...desired,b:[480+(desired.b[0]-480)*.65,300+(desired.b[1]-300)*.65]};
 if(kind==='Angle')starter={...desired,b:[640,300]};
 if(variant===5&&kind!=='Angle'){metric='length';target=measurement.length;unit='u';}
 if(variant===6){metric='rotation';target=90;unit='°';starter={...desired};}
 if(variant===7){metric='centerX';target=(1200-shapeCenter(desired)[0]-80)/40;unit='u';starter={...desired};}
 if(variant===8){metric='count';target=2;unit='objects';starter={...desired};}
 const f=v=>Number(v.toFixed(5)).toString(),goal=metric==='rotation'?`Rotate the ${kind.toLowerCase()} by 90° about its own center.`:metric==='centerX'?`Reflect the ${kind.toLowerCase()} across x=13 u. Its center should have x=${f(target)} u.`:metric==='count'?`Create two visible ${kind.toLowerCase()} objects by duplicating the starting motif.`:`Build a ${kind.toLowerCase()} with ${metric==='length'?'boundary / path length':metric} ${f(target)} ${unit}.`;
 const construction=kind==='Angle'?`Use Start as the vertex, then point End at ${angle}° counterclockwise from the rightward ray.`:radial?`Keep Start at (10,8.5) u. Set End ${r} units to its right. ${['Sector','Arc'].includes(kind)?`Set sweep to ${desired.sweep}°.`:kind==='Annulus'?'Set inner/outer ratio to 0.5.':kind==='Polygon'||kind==='Star'?`Set ${n} sides or points.`:''}`:kind==='Square'?`Use a horizontal drag of ${w} units; Square uses that distance for both sides.`:`Set the horizontal construction difference to ${w} u and the vertical difference to ${h} u. ${kind==='Ellipse'?'These are semi-axes, not full diameters.':''}`;
 const recipe=[`${context} Identify whether this task concerns covering, boundary, direction or placement. ${goal}`,`Select the starting object from Objects & layers. ${variant===6?'Use Rotate 90° in the object panel.':variant===7?'Use Reflect in the object panel.':variant===8?'Use Duplicate in the object panel.':construction+' Use the coordinate fields for exact construction; a grid drag is a convenient first estimate.'}`,`Explain the mathematics: ${formula} ${variant===6||variant===7?'Rigid transformations preserve area and length; position or orientation changes.':variant===8?'Duplication creates a second object; it does not enlarge the original.':`The target model has area ${f(measurement.area)} u² and boundary / path length ${f(measurement.length)} u.`}`,`Check geometry, then justify the result in your own words. ${variant===3&&areaModel?`At ₹12 per square unit, covering the target shape costs ₹${f(measurement.area*12)}; ignore waste only for this simplified model.`:variant===11?'If one drawing unit represents 2 metres, lengths multiply by 2 and areas by 4.':variant===10?'A report says doubling every length doubles the area. For filled shapes the factor is 4; for a line only its length changes.':'Export an SVG diagram showing your work and label the measured quantities.'}`];
 return {id:`guided-${family}-${variant}`,title:`${name} · ${activity}`,icon,tag:category,category,difficulty:variant<4?'Beginner':variant<9?'Intermediate':'Advanced',guide:goal,target:'custom',objects:[starter],steps:recipe,formula,context,goal,check:{kind,metric,target,unit},solution:variant===6?{...desired,rotation:90}:variant===7?transformShape(desired,'reflect'):desired,explanation:`${formula} ${construction} The displayed result comes from these construction dimensions, not from counting screen pixels.`,realTask:variant===3&&areaModel?`A covering supplier charges ₹12/u². Calculate the cost of the target area. Answer: ₹${f(measurement.area*12)}.`:`${context} Describe one assumption that this drawing makes and one measurement you would need before using it in a real plan.`};
}));
export function projectMatches(project,shapes){
 const {kind,metric,target}=project.check,items=shapes.filter(s=>s.kind===kind&&!s.hidden);
 if(metric==='count')return items.length===target;
 return items.some(s=>{const value=metric==='rotation'?((s.rotation||0)%360+360)%360:metric==='centerX'?(shapeCenter(s)[0]-80)/40:measureShape(s)[metric];return Number.isFinite(value)&&Math.abs(value-target)<=1e-3*Math.max(1,Math.abs(target))});
}
