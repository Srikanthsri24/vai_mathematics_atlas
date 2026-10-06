import {lazy,Suspense,Component,type ReactNode} from 'react';
import {useLab} from './parameters';
const Spatial=lazy(()=>import('./SpatialScenes'));
class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<><div className="scene-error" role="status">The spatial view could not start. The linked 2D model remains available.</div><button className="secondary" onClick={()=>this.setState({failed:false})}>Retry 3D view</button>{this.props.fallback}</>:this.props.children}}
export default function Viewport({children,spatial}:{children:ReactNode;spatial?:ReactNode}){const {view,topic}=useLab();const fallback=<div className="viewport-pane">{children}</div>;return <div className={`linked-viewport mode-${view.toLowerCase()}`}>
{view!=='3D'&&<div className="viewport-pane"><span className="pane-label">2D · mathematical model</span>{children}</div>}
{view!=='2D'&&<div className="viewport-pane spatial-pane"><span className="pane-label">3D · {spatial?'spatial model':'physical interpretation'}</span><SceneBoundary fallback={fallback}><Suspense fallback={<div className="scene-loading"><span className="loading-orbit"/><strong>Setting up your learning world</strong><p>Preparing {topic.title.toLowerCase()}…</p></div>}>{spatial||<Spatial/>}</Suspense></SceneBoundary><small className="orbit-hint">Drag to orbit · pinch / scroll to zoom · right-drag to pan</small></div>}
</div>}
