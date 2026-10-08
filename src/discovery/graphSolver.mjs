import {valueAt} from './graphMath.mjs';
export function bisectGraph(expression,left,right,params={},iterations=36){
 if(!Number.isFinite(left)||!Number.isFinite(right)||left>=right||!Number.isInteger(iterations)||iterations<1||iterations>60)return {error:'Use finite interval endpoints with left < right.',rows:[]};
 let a=left,b=right,fa=valueAt(expression,a,params),fb=valueAt(expression,b,params);const rows=[];
 if(!Number.isFinite(fa)||!Number.isFinite(fb))return {error:'The function must be defined at both endpoints.',rows};
 if(Math.abs(fa)<1e-10)return {root:a,residual:fa,rows};if(Math.abs(fb)<1e-10)return {root:b,residual:fb,rows};
 if(fa*fb>0)return {error:'Choose endpoints with opposite signs. A tangent root may need a different method.',rows};
 for(let i=0;i<iterations;i++){const middle=(a+b)/2,fm=valueAt(expression,middle,params);if(!Number.isFinite(fm))return {error:'The interval crosses an undefined value. Split the domain before solving.',rows};rows.push({iteration:i+1,left:a,right:b,middle,value:fm});if(Math.abs(fm)<1e-10)return {root:middle,residual:fm,rows};if(fa*fm<0)b=middle;else{a=middle;fa=fm;}}
 const root=(a+b)/2,residual=valueAt(expression,root,params);return Number.isFinite(residual)&&Math.abs(residual)<1e-6?{root,residual,rows}:{error:'The residual is not small. A discontinuity or difficult scale may prevent a valid root.',rows};
}
