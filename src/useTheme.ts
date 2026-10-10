import {useEffect,useState} from 'react';
/** Observe the shared theme so WebGL scenes update without remounting camera controls. */
export function useDarkTheme(){
 const [dark,setDark]=useState(()=>document.documentElement.dataset.theme==='dark');
 useEffect(()=>{const root=document.documentElement;const sync=()=>setDark(root.dataset.theme==='dark');sync();const observer=new MutationObserver(sync);observer.observe(root,{attributes:true,attributeFilter:['data-theme']});return()=>observer.disconnect()},[]);
 return dark;
}
