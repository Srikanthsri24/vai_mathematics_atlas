import {labGroups} from './labGroups';
import {formulas} from './formulaCatalog';
import type {Engine} from './data';
import type {Parameters} from './parameters';
export type MicroConcept={id:string;engine:Engine;subtopic:string;label:string;preset:Parameters};
const groups:[Engine,string,[string,string,Parameters?][]][]=[
['number','Number systems',[['integer','Signed integers',{a:-3}],['distance','Absolute distance',{a:-5}]]],
['place','Base ten',[['hundreds','Hundreds, tens and ones',{a:372}]]],
['factors','Divisibility',[['prime','Prime and composite',{a:13,b:12}],['hcf','Highest common factor',{a:24,b:36}],['lcm','Least common multiple',{a:12,b:18}]]],
['fraction','Parts and equivalence',[['proper','Proper fractions',{n:3,d:4}],['improper','Improper and mixed fractions',{n:7,d:4}],['equivalent','Equivalent fractions',{n:3,d:4,factor:2,subdivide:true}],['compare','Comparing fractions',{n:3,d:4,cn:2,cd:3,compare:true}]]],
['decimal','Base-ten fractions',[['hundredths','Tenths and hundredths',{a:75}]]],
['percentage','Per hundred',[['grid','Percentage as a fraction',{a:35}]]],
['ratio','Proportional reasoning',[['scale','Equivalent ratios',{a:2,b:3}]]],
['addition','Operations',[['join','Addition',{a:3,b:2,operation:'Add'}],['take','Subtraction',{a:8,b:3,operation:'Subtract'}]]],
['array','Equal groups',[['product','Multiplication arrays',{a:4,b:6}]]],
['division','Equal sharing',[['remainder','Quotient and remainder',{a:17,b:5}]]],
['commercial','Money',[['discount','Discount',{a:500,b:20,mode:'Discount'}],['interest','Simple interest',{a:1000,rate:8,time:3,mode:'Simple interest'}]]],
['balance','Equations',[['isolate','Isolating an unknown',{a:3,b:4,removed:false}]]],
['quadratic','Quadratic equations',[['two','Two real roots',{a:1,b:-3,c:2}],['repeated','Repeated real root',{a:1,b:-2,c:1}],['nonreal','No real roots',{a:1,b:0,c:1}]]],
['sequence','Arithmetic progressions',[['nth','Nth term',{a:2,b:3,n:6}],['sum','Sum of terms',{a:2,b:3,n:10}]]],
['angle','Angle measurement',[['acute','Acute angles',{a:60}],['reflex','Reflex angles',{a:240}],['supplement','Supplementary angles',{a:145}]]],
['triangle','Triangle constructions',[['vertices','Sides and angles'],['centroid','Medians and centroid',{proof:true,centerMode:'Centroid'}],['incenter','Incenter and incircle',{proof:true,centerMode:'Incenter'}],['circumcenter','Circumcenter and circumcircle',{proof:true,centerMode:'Circumcenter'}],['orthocenter','Orthocenter',{proof:true,centerMode:'Orthocenter'}]]],
['pythagoras','Right triangles',[['squares','Squares on the sides',{a:3,b:4,proofStep:0}],['proof','Rearrangement proof',{a:3,b:4,proofStep:1}]]],
['circle','Circle measurement',[['radius','Radius and diameter',{a:3}],['area','Area and circumference',{a:4}]]],
['area','Plane measurement',[['cover','Area versus perimeter',{a:6,b:4}]]],
['solid','Solid shapes',[['cube','Cube',{shape:'Cube'}],['cuboid','Cuboid with square base',{shape:'Cuboid'}],['sphere','Sphere',{shape:'Sphere'}],['hemisphere','Hemisphere',{shape:'Hemisphere'}],['frustum','Frustum',{shape:'Frustum',top:.7}],['cylinder','Cylinder',{shape:'Cylinder'}],['cone','Cone',{shape:'Cone'}]]],
['net','Nets',[['fold','Folding a cube',{unfold:false}],['unfold','Cube net',{unfold:true}]]],
['volume','Solid measurement',[['fill','Cylinder layers and filling',{shape:'Cylinder',transparent:true,slice:true}],['units','Counting unit cubes',{shape:'Cube',r:3,units:true,transparent:true}]]],
['coordinate','Cartesian geometry',[['quadrants','Quadrants',{a:-3,b:4}],['distance','Distance from the origin',{a:3,b:4}]]],
['graph','Function families',[['linear','Slope and intercept',{func:'Linear',a:2,b:1}],['quadratic','Quadratic graphs',{func:'Quadratic',a:1,b:0}],['sine','Sine graphs',{func:'Sine',a:1,b:0}],['cubic','Cubic graphs',{func:'Cubic',a:1,b:0}]]],
['trig','Unit circle',[['projection','Sine and cosine',{a:35}],['quadrants','Signs across quadrants',{a:135}],['undefined','Undefined ratios',{a:90}]]],
['matrix','Linear transformations',[['scale','Scaling',{transform:'Scale',a:2,b:1}],['rotate','Rotation',{transform:'Rotate',a:45}],['reflect','Reflection',{transform:'Reflect'}],['shear','Shear',{transform:'Shear',a:1}]]],
['vector','Spatial coordinates',[['components','Components and magnitude',{x:3,y:4,z:0}]]],
['conic','Cone intersections',[['circle','Circular section',{angle:0}],['ellipse','Elliptical section',{angle:25}],['parabola','Parabolic section',{angle:45}],['hyperbola','Hyperbolic section',{angle:60}]]],
['limit','Approaching a value',[['left','Approach from the left',{a:2,b:-.5}],['right','Approach from the right',{a:2,b:.5}]]],
['derivative','Rates of change',[['secant','Average rate',{a:2,b:1,func:'Square'}],['tangent','Limiting instantaneous rate',{a:2,b:.05,func:'Square'}],['stationary','Stationary point',{a:0,b:.05,func:'Square'}]]],
['integral','Accumulation',[['midpoint','Midpoint rectangle sums',{a:0,b:3,n:12}],['refine','Refining the partition',{a:0,b:3,n:100}]]],
['statistics','Distribution and centre',[['centre','Mean, median and mode'],['spread','Range, variance and standard deviation'],['negative','Signed data',{text:'-4, -2, 0, 2, 4'}]]],
['probability','Random trials',[['die','Fair die',{experiment:'Die',outcomes:[0,0,0,0,0,0],trials:0}],['coin','Fair coin',{experiment:'Coin',outcomes:[0,0,0,0,0,0],trials:0}]]]];
export const microConcepts:MicroConcept[]=groups.flatMap(([engine,subtopic,entries])=>entries.map(([slug,label,preset={}])=>({id:`${engine}/${slug}`,engine,subtopic,label,preset})));
export const conceptsFor=(id:Engine)=>microConcepts.filter(c=>c.engine===id);

for(const [engine,g] of Object.entries(labGroups))for(const id of g.formulaIds){const f=formulas.find(f=>f.id===id);if(f)microConcepts.push({id:engine+'/'+id,engine:engine as Engine,subtopic:g.title,label:f.title,preset:{...f.defaults,formulaId:f.id}})}
