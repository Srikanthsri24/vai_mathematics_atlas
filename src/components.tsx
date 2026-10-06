import type {ReactNode} from 'react';
import katex from 'katex';
export function Formula({tex}:{tex:string}){return <span className="formula" dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{throwOnError:false,displayMode:true})}}/>}
export function Slider({label,value,onChange,min=0,max=12,step=1,unit=''}:{label:string;value:number;onChange:(v:number)=>void;min?:number;max?:number;step?:number;unit?:string}){return <label className="slider"><span>{label}<strong>{value}{unit}</strong></span><input type="range" aria-label={label} value={value} min={min} max={max} step={step} onChange={e=>onChange(Number(e.target.value))}/><small><span>{min}{unit}</span><span>{max}{unit}</span></small></label>}
export function Metric({label,value}:{label:string;value:ReactNode}){return <div className="metric"><small>{label}</small><strong>{value}</strong></div>}
export function Stage({children,label='Interactive mathematics visualization'}:{children:ReactNode;label?:string}){return <svg role="img" aria-label={label} viewBox="0 0 600 400" className="svg-stage">{children}</svg>}
export const colors={green:'#226d59',mint:'#82b6a0',orange:'#e4a35e',blue:'#718bc4',ink:'#163c33'};
