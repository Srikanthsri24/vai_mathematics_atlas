import {labGroups} from './labGroups';
import type {Engine} from './data';
type Registration={family:string;spatialMeaning:string;depth:'representative'|'core'};
const families:Record<string,Engine[]>={arithmetic:['number','place','addition','array','division','percentage','ratio','balance'],geometry:['angle','triangle','circle','area'],graphs:['coordinate','graph','matrix','limit','integral'],data:['statistics','probability'],solids:['solid','net','volume','vector','conic'],extended:['decimal','factors','commercial','quadratic','sequence'],representative:['fraction','pythagoras','derivative','trig']};
const meanings:Record<string,string>={arithmetic:'Countable groups and physical quantities',geometry:'Extruded constructions and rotating measuring boards',graphs:'A coordinate board showing the same input/output relationship',data:'Observed outcomes and signed columns',solids:'Dimensions, surfaces, components, nets and intersections',extended:'Quantity boards, grouped objects, prices and plotted relationships',representative:'Pizza pieces, rearrangement tiles, motion and unit-circle projections'};
export const visualizationRegistry=Object.fromEntries(Object.entries(families).flatMap(([family,ids])=>ids.map(id=>[id,{family,spatialMeaning:meanings[family],depth:family==='representative'?'representative':'core'}]))) as Record<Engine,Registration>;

for(const id of Object.keys(labGroups))visualizationRegistry[id as Engine]={family:'formula',spatialMeaning:'Numeric input/output curve or two-input surface',depth:'core'};
