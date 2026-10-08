import CanvasStarter from "./CanvasStarter";
import ProjectGallery from "./ProjectGallery";
import {guidedProjects,projectMatches} from "./guidedProjects.mjs";
import {alignCanvasShape,fitCanvas} from "./canvasTools.mjs";
import { circleIntersections } from "./playgroundAdvancedMath.mjs";
import { useState, useEffect, useRef, type PointerEvent } from "react";
import { toolGroups, constructionOptions, missions } from "./playgroundOptions";
import { calculate, formatValue } from "./formulaMath.mjs";
import {
  measureShape,
  vertices,
  shapeCenter,
  transformShape,
} from "./playgroundMath.mjs";
type P = [number, number];
type Shape = {
  id: number;
  kind: string;
  a: P;
  b: P;
  color: string;
  sides?: number;
  rotation?: number;
  points?: P[];
  hidden?: boolean;
  locked?: boolean;
  sweep?: number;
  innerRatio?: number;
  label?: string;
  strokeWidth?: number;
  dashed?: boolean;
  clockwise?: boolean;
};
const colors = ["#367f6c", "#d59d4c", "#558ec8", "#986fba", "#d56f62"];
const shape = (
  id: number,
  kind: string,
  a: P,
  b: P,
  color = colors[0],
  sides = 6,
): Shape => ({ id, kind, a, b, color, sides });
const seed = [
  shape(1, "Rectangle", [160, 160], [400, 320]),
  shape(2, "Circle", [680, 260], [800, 260], colors[1]),
  shape(3, "Triangle", [420, 420], [660, 580], colors[2]),
];
type GuidedProject={id:string;title:string;icon:string;tag:string;guide:string;target:string;objects:Shape[];category?:string;difficulty?:string;steps?:string[];formula?:string;explanation?:string;realTask?:string;goal?:string;check?:any};
export const projects:GuidedProject[] = [
  {
    id: "garden",
    title: "Geometry garden",
    icon: "▦",
    tag: "Area & perimeter",
    guide:
      "Compare shapes with the same area. Can you make two different rectangles of area 24 u²?",
    target: "rectangle",
    objects: seed,
  },
  {
    id: "angles",
    title: "Angle detective",
    icon: "∠",
    tag: "Angles & rotation",
    guide:
      "Use the protractor and Angle tool. Make a 45° angle, then rotate a ray and predict the result.",
    target: "angle",
    objects: [shape(1, "Angle", [600, 360], [760, 200], colors[1])],
  },
  {
    id: "polygons",
    title: "Polygon workshop",
    icon: "⬡",
    tag: "Regular polygons",
    guide:
      "Change the side count from 3 to 12. Compare boundaries and areas while the circumradius stays fixed.",
    target: "polygon",
    objects: [shape(1, "Polygon", [540, 340], [700, 340], colors[2], 6)],
  },
  {
    id: "symmetry",
    title: "Mirror studio",
    icon: "↔",
    tag: "Reflection",
    guide:
      "Select a shape and reflect it across the dotted mirror line. Does reflection preserve its area?",
    target: "square",
    objects: [shape(1, "Rectangle", [240, 220], [400, 380], colors[3])],
  },
  {
    id: "ellipse",
    title: "Ellipse atelier",
    icon: "⬭",
    tag: "Stretch & compare",
    guide:
      "An ellipse uses two perpendicular radii. Make one with semi-axes 3 and 2 units; compare it with a circle.",
    target: "ellipse",
    objects: [shape(1, "Ellipse", [500, 330], [620, 410], colors[1])],
  },
  {
    id: "triangles",
    title: "Triangle builder",
    icon: "△",
    tag: "Base & height",
    guide:
      "Compare an isosceles triangle with a right triangle of the same base and height. Both areas are base × height ÷ 2.",
    target: "right",
    objects: [
      shape(1, "Right triangle", [200, 240], [360, 360], colors[2]),
      shape(2, "Triangle", [620, 240], [780, 360], colors[0]),
    ],
  },
  {
    id: "vectors",
    title: "Vector route",
    icon: "↗",
    tag: "Direction & distance",
    guide:
      "Draw vectors to plan a route. The arrow shows direction; its measurement shows the straight-line length.",
    target: "segment",
    objects: [
      shape(1, "Vector", [260, 480], [420, 360], colors[0]),
      shape(2, "Vector", [420, 360], [660, 280], colors[1]),
    ],
  },
  {
    id: "mosaic",
    title: "Pattern maker",
    icon: "◈",
    tag: "Scale & duplicate",
    guide:
      "Duplicate, recolor and scale polygons to create a repeating pattern. A scale factor 1.5 multiplies area by 2.25.",
    target: "polygon",
    objects: [
      shape(1, "Polygon", [320, 340], [420, 340], colors[0], 6),
      shape(2, "Polygon", [600, 340], [700, 340], colors[1], 6),
      shape(3, "Polygon", [880, 340], [980, 340], colors[2], 6),
    ],
  },
];

projects.push(
  {
    id: "stars",
    title: "Star constellation",
    icon: "☆",
    tag: "Radial symmetry",
    guide:
      "Compare five-point and eight-point stars. Change the point count, then rotate and duplicate the pattern.",
    target: "star",
    objects: [
      shape(1, "Star", [420, 340], [560, 340], colors[1], 5),
      shape(2, "Star", [820, 340], [960, 340], colors[3], 8),
    ],
  },
  {
    id: "quadrilaterals",
    title: "Four-sided city",
    icon: "▱",
    tag: "Compare quadrilaterals",
    guide:
      "Create a parallelogram, trapezium, rhombus and kite. Compare their measured areas with rectangles spanning the same bounds.",
    target: "rectangle",
    objects: [
      shape(1, "Parallelogram", [160, 200], [400, 360]),
      shape(2, "Trapezium", [620, 200], [860, 360], colors[1]),
    ],
  },
  {
    id: "arcs",
    title: "Circular architecture",
    icon: "⌒",
    tag: "Arc, sector & ring",
    guide:
      "Explore an arc, sector and annulus with the same radius. Change the sweep angle or inner radius in the inspector.",
    target: "sector",
    objects: [
      { ...shape(1, "Sector", [300, 400], [440, 400]), sweep: 90 },
      shape(2, "Annulus", [820, 360], [960, 360], colors[1]),
    ],
  },
  {
    id: "construction",
    title: "Compass constructions",
    icon: "⊕",
    tag: "Centers & bisectors",
    guide:
      "Select two objects in the construction panel. Create their midpoint, perpendicular bisector and a circle passing through both centers.",
    target: "midpoint",
    objects: [
      shape(1, "Point", [320, 360], [320, 360]),
      shape(2, "Point", [800, 280], [800, 280], colors[1]),
    ],
  },
  {
    id: "equilateral",
    title: "Equal-sided explorer",
    icon: "▵",
    tag: "Triangle symmetry",
    guide:
      "Draw an equilateral triangle from a center and vertex. Compare its area and perimeter as you scale it.",
    target: "equilateral",
    objects: [
      shape(1, "Equilateral triangle", [500, 350], [660, 350], colors[2]),
    ],
  },
  {
    id: "tiles",
    title: "Square tile maker",
    icon: "□",
    tag: "Tessellation",
    guide:
      "Use Square, Duplicate and exact coordinates to tile a floor. Compare a single tile with the assembled pattern.",
    target: "square",
    objects: [
      shape(1, "Square", [200, 200], [360, 360]),
      shape(2, "Square", [360, 200], [520, 360], colors[1]),
      shape(3, "Square", [200, 360], [360, 520], colors[2]),
    ],
  },
  {
    id: "routes",
    title: "Infinite route planner",
    icon: "↔",
    tag: "Lines & rays",
    guide:
      "Draw a line through two control points and a ray from a starting point. Use construction actions to create parallel and perpendicular routes.",
    target: "segment",
    objects: [
      shape(1, "Line", [240, 450], [460, 340]),
      shape(2, "Ray", [650, 450], [870, 340], colors[1]),
    ],
  },
  {
    id: "poster",
    title: "Mathematical poster",
    icon: "T",
    tag: "Annotate & export",
    guide:
      "Build a composition with shapes, text and styles. Edit the text in the inspector, then export your diagram as SVG or save an editable project.",
    target: "rectangle",
    objects: [
      {
        ...shape(1, "Text", [200, 130], [200, 130]),
        label: "VisionicX · My mathematical discovery",
      },
      shape(2, "Sector", [360, 440], [520, 440], colors[1]),
      shape(3, "Star", [840, 380], [980, 380], colors[3], 5),
    ],
  },
);
for(const p of projects){p.steps=[p.guide,"Select a starting object. Read its construction points in the object inspector and change one dimension at a time.","Compare the measurements before and after your change. Explain whether the action changed area, boundary length, position or orientation.","Use Check my canvas for the stated mission. Export your labeled SVG and describe where this model could be useful."];p.explanation=p.objects.map(s=>`${s.kind}: initial area ${measureShape(s).area.toFixed(3)} u²; boundary / path length ${measureShape(s).length.toFixed(3)} u. Check whether your task is about covering a region or measuring a boundary.`).join(' ');p.realTask="Describe a real object or plan that this scene could model. State its units and one assumption that the drawing makes.";}
projects.push(...guidedProjects as unknown as GuidedProject[]);
function readProject() {
  try {
    return (
      localStorage.getItem("vx-playground-project") ||
      (localStorage.getItem("vx-playground-v2") ? "custom" : "garden")
    );
  } catch {
    return "garden";
  }
}
function read() {
  try {
    const s = JSON.parse(localStorage.getItem("vx-playground-v2") || "null");
    return Array.isArray(s) ? s : seed;
  } catch {
    return seed;
  }
}
export default function Playground() {
  const [shapes, S] = useState<Shape[]>(read),
    [past, H] = useState<Shape[][]>([]),
    [future, F] = useState<Shape[][]>([]),
    [tool, T] = useState("Select"),
    [color, C] = useState(colors[0]),
    [selected, Q] = useState<number | null>(null),
    [draft, D] = useState<Shape | null>(null),
    [snap, N] = useState(true),
    [grid, G] = useState(true),
    [labels, L] = useState(true),
    [filled, I] = useState(true),
    [zoom, Z] = useState(1),
    [viewCenter, VC] = useState([600,360]),
    [challenge, B] = useState("rectangle"),
    [message, M] = useState(""),
    [project, J] = useState(readProject),
    [sides, K] = useState(6),
    [protractor, O] = useState(false),
    [ruler, R] = useState(false),
    [mirror, W] = useState(false),
    [help, U] = useState(false),
    [historyStatus, HS] = useState(""),
    [toolQuery, TQ] = useState(""),
    [toolCategory, TC] = useState("Essentials"),
    [galleryOpen,GO]=useState(false),
    [canvasFocus,FOCUS]=useState(false),
    [showInspector,SI]=useState(true),
    [autoSelect,AS]=useState(true),
    [projectLimit, PL] = useState(8),
    [graph, GP] = useState(false),
    [expression, EX] = useState("a*(x-b)^2+c"),
    [coeff, CF] = useState({ a: 0.15, b: 13, c: 1 }),
    [first, FI] = useState(""),
    [second, SE] = useState(""),
    [rotation, ROT] = useState(30),
    [scaleFactor, SF] = useState(1.2),
    [translateX, TX] = useState(1),
    [translateY, TY] = useState(0),
    [copies, CO] = useState(6);
  const file = useRef<HTMLInputElement>(null);
  const svg = useRef<SVGSVGElement>(null),
    gesture = useRef<{ start: P; original: Shape | null } | null>(null),
    current = useRef<Shape | null>(null);
  const activeProject = projects.find((p) => p.id === project);
  useEffect(() => {
    try {
      localStorage.setItem("vx-playground-v2", JSON.stringify(shapes));
    } catch {}
  }, [shapes]);
  useEffect(() => {
    try {
      localStorage.setItem("vx-playground-project", project);
    } catch {}
  }, [project]);
  const commit = (next: Shape[]) => {
    H([...past, shapes].slice(-80));
    S(next);
    F([]);
    M("");
    HS("Canvas updated");
  };
  const pos = (e: PointerEvent): P => {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      svg.current!.getScreenCTM()!.inverse(),
    );
    return snap
      ? [Math.round(p.x / 20) * 20, Math.round(p.y / 20) * 20]
      : [p.x, p.y];
  };
  const picked = shapes.find((s) => s.id === selected),
    update = (changes: Partial<Shape>) => {
      if (picked)
        commit(
          shapes.map((s) => (s.id === picked.id ? { ...s, ...changes } : s)),
        );
    };
  const transform = (action: string) => {
    if (!picked || picked.locked) return;
    const next = transformShape(picked, action) as Shape;
    if (action === "duplicate") {
      next.id = Date.now();
      commit([...shapes, next]);
      Q(next.id);
    } else commit(shapes.map((s) => (s.id === picked.id ? next : s)));
  };
  const render = (s: Shape, preview = false) => {
    if (s.hidden) return null;
    const [x, y] = s.a,
      [u, v] = s.b,
      m = measureShape(s),
      pts = vertices(s),
      center = shapeCenter(s),
      common = {
        stroke: s.color,
        strokeWidth:
          selected === s.id
            ? Math.max(4, s.strokeWidth || 2.5)
            : s.strokeWidth || 2.5,
        strokeDasharray: s.dashed ? "10 7" : undefined,
        fill: filled ? s.color + "20" : "none",
      };
    const angleRadians = (m.angle * Math.PI) / 180,
      arcEnd = [
        x + 70 * Math.cos(angleRadians),
        y - 70 * Math.sin(angleRadians),
      ];
    return (
      <g
        key={s.id}
        transform={
          s.rotation
            ? `rotate(${s.rotation} ${center[0]} ${center[1]})`
            : undefined
        }
        opacity={preview ? 0.65 : 1}
        onPointerDown={(e) => {
          if (preview) return;
          if (tool === "Eraser") {
            e.stopPropagation();
            if (!s.locked) {
              commit(shapes.filter((v) => v.id !== s.id));
              Q(null);
            }
          } else if (tool === "Select") {
            e.stopPropagation();
            Q(s.id);
            if (!s.locked) {
              svg.current?.setPointerCapture(e.pointerId);
              gesture.current = { start: pos(e), original: s };
            }
          }
        }}
      >
        {s.kind === "Text" ? (
          <text x={x} y={y} fill={s.color} fontSize="26" fontWeight="600">
            {s.label || "Your idea"}
          </text>
        ) : ["Arc", "Sector", "Semicircle", "Annulus"].includes(s.kind) ? (
          (() => {
            const r = m.r * 40,
              start = Math.atan2(y - v, u - x),
              theta = ((m.angle * Math.PI) / 180) * (s.clockwise ? -1 : 1),
              end = [
                x + r * Math.cos(start + theta),
                y - r * Math.sin(start + theta),
              ],
              arc = `M${x + r * Math.cos(start)} ${y - r * Math.sin(start)}A${r} ${r} 0 ${m.angle > 180 ? 1 : 0} ${s.clockwise ? 1 : 0} ${end[0]} ${end[1]}`;
            return s.kind === "Annulus" ? (
              <>
                <circle cx={x} cy={y} r={r} {...common} fill="none" />
                <circle
                  cx={x}
                  cy={y}
                  r={r * (s.innerRatio ?? 0.5)}
                  {...common}
                  fill="none"
                />
                {filled && (
                  <path
                    d={`M${x + r} ${y}a${r} ${r} 0 1 0 ${-2 * r} 0a${r} ${r} 0 1 0 ${2 * r} 0M${x + r * (s.innerRatio ?? 0.5)} ${y}a${r * (s.innerRatio ?? 0.5)} ${r * (s.innerRatio ?? 0.5)} 0 1 0 ${-2 * r * (s.innerRatio ?? 0.5)} 0a${r * (s.innerRatio ?? 0.5)} ${r * (s.innerRatio ?? 0.5)} 0 1 0 ${2 * r * (s.innerRatio ?? 0.5)} 0`}
                    fill={s.color + "20"}
                    fillRule="evenodd"
                  />
                )}
              </>
            ) : (
              <path
                d={s.kind === "Arc" ? arc : arc + `L${x} ${y}Z`}
                {...common}
                fill={s.kind === "Arc" ? "none" : common.fill}
              />
            );
          })()
        ) : s.kind === "Point" ? (
          <circle cx={x} cy={y} r="6" fill={s.color} />
        ) : s.kind === "Circle" ? (
          <circle cx={x} cy={y} r={m.r * 40} {...common} />
        ) : s.kind === "Ellipse" ? (
          <ellipse
            cx={x}
            cy={y}
            rx={Math.abs(u - x)}
            ry={Math.abs(v - y)}
            {...common}
          />
        ) : pts.length ? (
          <polygon points={pts.map((p) => p.join(",")).join(" ")} {...common} />
        ) : s.kind === "Pen" ? (
          <polyline
            points={(s.points || [s.a, s.b]).map((p) => p.join(",")).join(" ")}
            {...common}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : s.kind === "Angle" ? (
          <>
            <path
              d={`M${x + 120} ${y}H${x}L${u} ${v}`}
              {...common}
              fill="none"
            />
            <path
              d={`M${x + 70} ${y}A70 70 0 ${m.angle > 180 ? 1 : 0} 0 ${arcEnd[0]} ${arcEnd[1]}`}
              stroke={s.color}
              fill="none"
              strokeWidth="1.5"
            />
          </>
        ) : (
          <>
            <defs>
              <marker
                id={"arrow-" + s.id}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0L10 5L0 10Z" fill={s.color} />
              </marker>
            </defs>
            <line
              x1={s.kind === "Line" ? x - (u - x) * 100 : x}
              y1={s.kind === "Line" ? y - (v - y) * 100 : y}
              x2={["Line", "Ray"].includes(s.kind) ? x + (u - x) * 100 : u}
              y2={["Line", "Ray"].includes(s.kind) ? y + (v - y) * 100 : v}
              {...common}
              fill="none"
              markerEnd={
                ["Vector", "Ray"].includes(s.kind)
                  ? `url(#arrow-${s.id})`
                  : undefined
              }
            />
            <line
              x1={x}
              y1={y}
              x2={u}
              y2={v}
              stroke="transparent"
              strokeWidth="18"
            />
          </>
        )}
        {labels && !["Point", "Text"].includes(s.kind) && (
          <text
            x={
              [
                "Circle",
                "Ellipse",
                "Polygon",
                "Star",
                "Equilateral triangle",
                "Angle",
                "Arc",
                "Sector",
                "Semicircle",
                "Annulus",
              ].includes(s.kind)
                ? x
                : (x + u) / 2
            }
            y={Math.min(y, v) - 15}
            textAnchor="middle"
            fill={s.color}
            fontSize="15"
            fontWeight="600"
          >
            {["Line", "Ray"].includes(s.kind)
              ? s.kind
              : s.kind === "Angle"
                ? m.angle.toFixed(1) + "°"
                : m.area > 0
                  ? "A = " + m.area.toFixed(2) + " u²"
                  : "L = " + m.length.toFixed(2) + " u"}
          </text>
        )}
        {selected === s.id && (
          <>
            <circle cx={x} cy={y} r="5" fill="white" stroke={s.color} />
            <circle cx={u} cy={v} r="5" fill="white" stroke={s.color} />
          </>
        )}
      </g>
    );
  };
  const finish = () => {
    if (current.current) {
      const s = current.current;
      if(!gesture.current?.original&&!["Point","Text"].includes(s.kind)&&measureShape(s).area<1e-8&&measureShape(s).length<1e-8){gesture.current=null;current.current=null;D(null);HS("Drag to give the shape a size, or use Add a precise shape.");return;}
      if(autoSelect&&!gesture.current?.original)T("Select");
      commit(
        gesture.current?.original
          ? shapes.map((v) => (v.id === s.id ? s : v))
          : [...shapes, s],
      );
      Q(s.id);
    }
    gesture.current = null;
    current.current = null;
    D(null);
  };
  const exportSvg = () => {
    const data = svg.current?.outerHTML.replace(
      "<svg",
      '<svg xmlns="http://www.w3.org/2000/svg"',
    );
    if (!data) return;
    const url = URL.createObjectURL(
      new Blob([data], { type: "image/svg+xml" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "visionicx-geometry.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportProject = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ visionicx: 1, shapes }, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "visionicx-project.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importProject = async (input: HTMLInputElement) => {
    const f = input.files?.[0];
    if (!f) return;
    try {
      if (f.size > 1000000) throw new Error();
      const data = JSON.parse(await f.text());
      const allowed = toolGroups.flatMap((g) => g.tools.map((t) => t[0]));
      if (
        data.visionicx !== 1 ||
        !Array.isArray(data.shapes) ||
        data.shapes.length > 200 ||
        !data.shapes.every(
          (s: Shape) =>
            allowed.includes(s.kind) &&
            [s.a, s.b, ...(s.points || [])].every(
              (p) =>
                Array.isArray(p) &&
                p.length === 2 &&
                p.every((n) => Number.isFinite(n) && Math.abs(n) < 10000),
            ) &&
            /^#[0-9a-f]{6}$/i.test(s.color) &&
            (!s.label ||
              (typeof s.label === "string" && s.label.length <= 120)) &&
            (!s.rotation || Number.isFinite(s.rotation)) &&
            (!s.sweep ||
              (Number.isFinite(s.sweep) && s.sweep >= 1 && s.sweep <= 359)) &&
            (!s.innerRatio ||
              (Number.isFinite(s.innerRatio) &&
                s.innerRatio >= 0.05 &&
                s.innerRatio <= 0.95)) &&
            (!s.strokeWidth ||
              (Number.isFinite(s.strokeWidth) &&
                s.strokeWidth >= 1 &&
                s.strokeWidth <= 10)) &&
            (!s.sides ||
              (Number.isInteger(s.sides) && s.sides >= 3 && s.sides <= 12)),
        )
      )
        throw new Error();
      commit(
        data.shapes.map((s: Shape, i: number) => ({
          ...s,
          id: Date.now() + i,
        })),
      );
      Q(null);
      J("custom");
      HS("Editable project imported");
    } catch {
      HS(
        "Choose a valid VisionicX project with at most 200 objects and a file size below 1 MB.",
      );
    }
    input.value = "";
  };
  const construct = (action: string) => {
    const a = shapes.find((s) => String(s.id) === first),
      b = shapes.find((s) => String(s.id) === second);
    if (!a || !b || a.id === b.id) {
      HS("Choose two different objects for this construction.");
      return;
    }
    if (action === "Circle intersection points") {
      if (a.kind !== "Circle" || b.kind !== "Circle") {
        HS("Choose two circles to construct their actual intersections.");
        return;
      }
      const points = circleIntersections(
        a.a,
        measureShape(a).r * 40,
        b.a,
        measureShape(b).r * 40,
      ) as P[];
      if (!points.length) {
        HS(
          "These circles have no finite intersection points. Coincident circles have infinitely many.",
        );
        return;
      }
      commit([
        ...shapes,
        ...points.map((p, i) => shape(Date.now() + i, "Point", p, p, color)),
      ]);
      HS(points.length + " circle intersection point(s) constructed");
      return;
    }
    const p = shapeCenter(a),
      q = shapeCenter(b),
      mid: P = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2],
      dx = q[0] - p[0],
      dy = q[1] - p[1];
    if (Math.hypot(dx, dy) < 0.01) {
      HS("The two centers must be different.");
      return;
    }
    const id = Date.now();
    const created =
      action === "Join centers"
        ? shape(id, "Segment", p, q, color)
        : action === "Midpoint"
          ? shape(id, "Point", mid, mid, color)
          : action === "Perpendicular bisector"
            ? shape(id, "Line", mid, [mid[0] - dy, mid[1] + dx], color)
            : action === "Circle through centers"
              ? shape(id, "Circle", mid, p, color)
              : shape(
                  id,
                  "Line",
                  q,
                  action === "Parallel through second center"
                    ? [q[0] + dx, q[1] + dy]
                    : [q[0] - dy, q[1] + dx],
                  color,
                );
    commit([...shapes, created]);
    Q(id);
    HS(action + " constructed from the two centers");
  };
  let plotPath = "",
    plotActive = false;
  for (let i = 0; i <= 520; i++) {
    const x = i / 20,
      y = calculate(expression, { ...coeff, x });
    if (Number.isFinite(y) && y >= 0 && y <= 14) {
      plotPath +=
        (plotActive ? "L" : "M") + (80 + x * 40) + " " + (640 - y * 40) + " ";
      plotActive = true;
    } else plotActive = false;
  }
  const check = () => {
    if(activeProject?.check){M(projectMatches(activeProject,shapes)?"Your geometry meets the measured project goal. Explain why it works, then try the real-life task.":"Not yet. Read the goal and use exact coordinates or transformations. Hidden objects are not counted.");return;}
    const success = shapes
      .filter((s) => !s.hidden)
      .some((s) => {
        const m = measureShape(s);
        const near = (a: number, b: number) => Math.abs(a - b) < 0.05;
        const extra: Record<string, boolean> = {
          star: s.kind === "Star" && s.sides === 5 && m.area > 0.01,
          equilateral: s.kind === "Equilateral triangle" && near(m.r, 2),
          sector:
            s.kind === "Sector" && near(m.r, 2) && near(s.sweep || 90, 90),
          annulus:
            s.kind === "Annulus" &&
            near(m.r, 2) &&
            near(s.innerRatio ?? 0.5, 0.5),
          parallelogram: s.kind === "Parallelogram" && near(m.area, 12),
          trapezium: s.kind === "Trapezium" && near(m.area, 12),
          rhombus: s.kind === "Rhombus" && near(m.area, 8),
          midpoint:
            s.kind === "Point" &&
            near((s.a[0] - 80) / 40, 13) &&
            near((640 - s.a[1]) / 40, 7),
        };
        if (challenge in extra) return extra[challenge];
        return challenge === "rectangle"
          ? s.kind === "Rectangle" && Math.abs(m.area - 24) < 0.05
          : challenge === "circle"
            ? s.kind === "Circle" && Math.abs(m.r - 3) < 0.05
            : challenge === "segment"
              ? s.kind === "Segment" && Math.abs(m.length - 5) < 0.05
              : challenge === "angle"
                ? s.kind === "Angle" && Math.abs(m.angle - 45) < 0.1
                : challenge === "polygon"
                  ? s.kind === "Polygon" && s.sides === 6 && m.area > 0.01
                  : challenge === "ellipse"
                    ? s.kind === "Ellipse" &&
                      Math.abs(m.area - 6 * Math.PI) < 0.05
                    : challenge === "right"
                      ? s.kind === "Right triangle" &&
                        Math.abs(m.area - 6) < 0.05
                      : (s.kind === "Square" ||
                          (s.kind === "Rectangle" &&
                            Math.abs(
                              Math.abs(s.b[0] - s.a[0]) -
                                Math.abs(s.b[1] - s.a[1]),
                            ) < 0.1)) &&
                        Math.abs(m.area - 16) < 0.05;
      });
    M(
      success
        ? "You did it! The visible objects match the target."
        : "Keep exploring. Check the target, grid and object measurements.",
    );
  };
  return (
    <div className={"play-studio "+(canvasFocus?"canvas-focus":"")}>
      <div className="canvas-focus-bar"><strong>Geometry canvas · draw with purpose</strong><button onClick={()=>FOCUS(!canvasFocus)}>{canvasFocus?"← Back to projects & guidance":"Focus on the canvas ↗"}</button><button onClick={()=>SI(!showInspector)}>{showInspector?"Hide object panel":"Show object panel"}</button></div>
      <section className="play-hero">
        <div>
          <span className="eyebrow">YOUR PERSONAL MATHEMATICS STUDIO</span>
          <h2>Draw an idea. Discover a relationship.</h2>
          <p>
            Construct, transform and measure with a canvas built for
            exploration.
          </p>
        </div>
        <span className="play-status">
          {shapes.length} objects · saved on this device
        </span>
      </section>
      <details className="project-drawer" open={galleryOpen} onToggle={e=>GO(e.currentTarget.open)}><summary>Browse guided projects · {projects.length} activities with search & filters</summary><ProjectGallery projects={projects} active={project} onOpen={p=>{commit(p.objects.map((v:Shape,i:number)=>({...v,id:Date.now()+i})));Q(null);J(p.id);B(p.target);T("Select");O(p.objects.some((v:Shape)=>v.kind==="Angle"));W(p.id==="symmetry");Z(1);VC([600,360]);M("");GO(false)}}/></details>
      <div className="canvas-quick-guide"><strong>1. Choose a tool</strong><span>2. Drag to draw · select to move</span><span>3. Edit the object · export your work</span><p>Current tool: <b>{tool}</b>. {tool==='Select'?'Click an object to select it. Drag it to move. Use the object panel for measurements and styling.':tool==='Text'?'Click the canvas to place text, then edit its label in the object panel.':'Drag across the canvas to draw. Use Select when you want to move or style an object.'}</p></div>
      {activeProject && (
        <div className="play-guided-note">
          <strong>{activeProject.title}</strong>
          <p>{activeProject.guide}</p>
          {activeProject.steps&&<><details className="project-step-guide"><summary>Follow the four-step project guide</summary><ol className="project-instructions">{activeProject.steps.map((step,i)=><li key={step}><strong>Step {i+1}</strong><p>{step}</p></li>)}</ol></details><details><summary>Why the mathematics works</summary><p>{activeProject.explanation}</p><h4>Use it in real life</h4><p>{activeProject.realTask}</p></details><button className="primary" onClick={check}>Check project geometry →</button><p role="status">{message}</p></>}

        </div>
      )}
      {help && (
        <div className="play-help">
          <p>
            <strong>Draw:</strong> select a tool, then drag on the canvas.
            Polygon and circle Start is the center. Ellipse End sets both radii.
            Angle is measured counterclockwise from its rightward ray.
          </p>
          <p>
            <strong>Edit:</strong> use the object list or click a shape; edit
            coordinates, color or polygon sides. Transformations preserve shape
            measurements except scaling.
          </p>
          <p>
            <strong>Explore:</strong> use the ruler, protractor or mirror. Undo
            restores complete canvas actions. Export saves the visible SVG
            scene.
          </p>
        </div>
      )}
      <CanvasStarter color={color} onInsert={s=>{commit([...shapes,s]);Q(s.id);T("Select");HS("Shape added. Select it in the canvas or Objects & layers to edit.")}}/>
      <div className="play-instruments">
        <strong>Instruments</strong>
        {[
          ["Protractor", protractor, O],
          ["Ruler", ruler, R],
          ["Mirror line", mirror, W],
          ["Shape fill", filled, I],
        ].map(([label, value, set]) => (
          <button
            key={String(label)}
            className={value ? "selected" : ""}
            aria-pressed={!!value}
            onClick={() => (set as (v: boolean) => void)(!value)}
          >
            {String(label)}
          </button>
        ))}
        <label>
          Polygon sides{" "}
          <input
            aria-label="New polygon sides"
            type="number"
            min="3"
            max="12"
            value={sides}
            onChange={(e) =>
              K(
                Math.max(
                  3,
                  Math.min(12, Math.round(Number(e.target.value) || 3)),
                ),
              )
            }
          />
        </label>
      </div>
      <details className="play-lab-panel">
        <summary>
          Function plotter{" "}
          <span>
            Explore powers, waves, exponentials and custom relationships
          </span>
        </summary>
        <div className="plotter-controls">
          <label>
            <input
              type="checkbox"
              checked={graph}
              onChange={(e) => GP(e.target.checked)}
            />
            Show function on canvas
          </label>
          <label>
            f(x) ={" "}
            <input
              aria-label="Playground function"
              value={expression}
              onChange={(e) => {
                EX(e.target.value);
                GP(true);
              }}
            />
          </label>
          <div>
            {[
              ["Parabola", "a*(x-b)^2+c", 0.15, 13, 1],
              ["Wave", "a*sin(b*x)+c", 2, 1, 6],
              ["Line", "a*x+c", 0.35, 0, 1],
              ["Exponential", "a*exp(b*x)+c", 1, 0.1, 0],
              ["Root", "a*sqrt(x)+c", 2, 0, 0],
              ["Reciprocal", "a/(x+b)+c", 8, 1, 1],
            ].map(([name, exp, a, b, c]) => (
              <button
                key={String(name)}
                onClick={() => {
                  EX(String(exp));
                  CF({ a: Number(a), b: Number(b), c: Number(c) });
                  GP(true);
                }}
              >
                {String(name)}
              </button>
            ))}
          </div>
          {(["a", "b", "c"] as const).map((k) => (
            <label key={k}>
              {k}
              <input
                aria-label={"Function coefficient " + k}
                type="number"
                step=".1"
                value={coeff[k]}
                onChange={(e) => CF({ ...coeff, [k]: Number(e.target.value) })}
              />
            </label>
          ))}
          <p>
            Plot domain: x = 0–26, y = 0–14 u. Trig uses radians. f(5) ={" "}
            {formatValue(calculate(expression, { ...coeff, x: 5 }))}.
            Expressions support + − × / ^, sin, cos, sqrt, log and exp.
          </p>
        </div>
      </details>
      <details className="play-lab-panel">
        <summary>
          Geometry constructions{" "}
          <span>Build relationships from two existing objects</span>
        </summary>
        <div className="construction-controls">
          {[
            ["First object", first, FI],
            ["Second object", second, SE],
          ].map(([label, value, set]) => (
            <label key={String(label)}>
              {String(label)}
              <select
                aria-label={String(label)}
                value={value as string}
                onChange={(e) => (set as (s: string) => void)(e.target.value)}
              >
                <option value="">Choose an object</option>
                {shapes
                  .filter((s) => !s.hidden)
                  .map((s, i) => (
                    <option key={s.id} value={s.id}>
                      {s.kind} {i + 1}
                    </option>
                  ))}
              </select>
            </label>
          ))}
          <div>
            {constructionOptions.map((action) => (
              <button key={action} onClick={() => construct(action)}>
                {action}
              </button>
            ))}
          </div>
          <p>
            Actions use the center of each object. Lines through a center use
            the direction between the two centers.
          </p>
        </div>
      </details>
      <details className="play-lab-panel">
        <summary>
          Precision transforms & radial patterns{" "}
          <span>
            Arbitrary rotation, exact scaling, translation and repeated copies
          </span>
        </summary>
        <div className="precision-controls">
          {[
            ["Rotation (degrees)", rotation, ROT, -360, 360],
            ["Scale factor", scaleFactor, SF, 0.1, 5],
            ["Translate x (units)", translateX, TX, -20, 20],
            ["Translate y (units)", translateY, TY, -20, 20],
            ["Radial copies", copies, CO, 2, 16],
          ].map(([label, value, set, min, max]) => (
            <label key={String(label)}>
              {String(label)}
              <input
                aria-label={String(label)}
                type="number"
                min={min as number}
                max={max as number}
                step={String(label) === "Radial copies" ? 1 : 0.1}
                value={value as number}
                onChange={(e) =>
                  (set as (n: number) => void)(
                    Math.max(
                      min as number,
                      Math.min(max as number, Number(e.target.value)),
                    ),
                  )
                }
              />
            </label>
          ))}
          <div className="button-row">
            <button
              disabled={!picked || picked.locked}
              onClick={() =>
                update({ rotation: (picked?.rotation || 0) + rotation })
              }
            >
              Apply rotation
            </button>
            <button
              disabled={!picked || picked.locked}
              onClick={() => {
                if (!picked) return;
                const c = shapeCenter(picked),
                  move = (p: P): P => [
                    c[0] + (p[0] - c[0]) * scaleFactor,
                    c[1] + (p[1] - c[1]) * scaleFactor,
                  ];
                update({
                  a: move(picked.a),
                  b: move(picked.b),
                  ...(picked.points ? { points: picked.points.map(move) } : {}),
                });
              }}
            >
              Apply scale
            </button>
            <button
              disabled={!picked || picked.locked}
              onClick={() => {
                if (!picked) return;
                const move = (p: P): P => [
                  p[0] + translateX * 40,
                  p[1] - translateY * 40,
                ];
                update({
                  a: move(picked.a),
                  b: move(picked.b),
                  ...(picked.points ? { points: picked.points.map(move) } : {}),
                });
              }}
            >
              Apply translation
            </button>
            <button
              disabled={!picked || picked.locked}
              onClick={() => {
                if (!picked) return;
                const c = shapeCenter(picked),
                  total = Math.round(copies),
                  id = Date.now(),
                  next = Array.from({ length: total - 1 }, (_, i) => {
                    const angle = (2 * Math.PI * (i + 1)) / total,
                      nc: P = [
                        600 +
                          (c[0] - 600) * Math.cos(angle) -
                          (c[1] - 360) * Math.sin(angle),
                        360 +
                          (c[0] - 600) * Math.sin(angle) +
                          (c[1] - 360) * Math.cos(angle),
                      ],
                      move = (p: P): P => [
                        p[0] + nc[0] - c[0],
                        p[1] + nc[1] - c[1],
                      ];
                    return {
                      ...picked,
                      id: id + i,
                      a: move(picked.a),
                      b: move(picked.b),
                      rotation:
                        (picked.rotation || 0) + ((i + 1) * 360) / total,
                      ...(picked.points
                        ? { points: picked.points.map(move) }
                        : {}),
                    };
                  });
                commit([...shapes, ...next]);
                HS("Radial pattern created around canvas center");
              }}
            >
              Create radial pattern
            </button>
          </div>
          <p>
            Select an unlocked object first. Rotation and scaling use its
            center. Translation uses the displayed coordinate units. Radial
            copies orbit the canvas center and rotate with their position. Undo
            restores each operation.
          </p>
        </div>
      </details>
      <div className="canvas-workflow"><span><b>01</b> Draw or insert</span><span><b>02</b> Select & style</span><span><b>03</b> Measure & explain</span><span><b>04</b> Export your work</span></div>
      <div className={"play-layout "+(!showInspector?"inspector-hidden":"")} tabIndex={0} aria-label="Geometry workspace: V select, R rectangle, C circle, Ctrl Z undo, Ctrl D duplicate, Delete remove" onKeyDown={e=>{if((e.target as HTMLElement).closest('input,textarea,select'))return;const key=e.key.toLowerCase();if(e.ctrlKey||e.metaKey){if(key==='z'){e.preventDefault();if(e.shiftKey&&future.length){H([...past,shapes]);S(future[0]);F(future.slice(1));Q(null)}else if(!e.shiftKey&&past.length){F([shapes,...future]);S(past[past.length-1]);H(past.slice(0,-1));Q(null)}}if(key==='d'){e.preventDefault();transform('duplicate')}}else if(key==='delete'&&picked&&!picked.locked){commit(shapes.filter(s=>s.id!==picked.id));Q(null)}else if(key==='escape'){Q(null);T('Select')}else if(key==='v')T('Select');else if(key==='r')T('Rectangle');else if(key==='c')T('Circle')}}>

        <aside className="play-tools">
          <span className="eyebrow">YOUR DRAWING TOOLKIT</span>
          <h3>What do you want to draw?</h3><p className="toolkit-hint">Choose a tool below, then drag on the canvas. Choose Select to move or edit your work.</p>
          <input
            aria-label="Search playground tools"
            placeholder="Find a tool…"
            value={toolQuery}
            onChange={(e) => TQ(e.target.value)}
          />
          <label>Tool collection<select aria-label="Tool collection" value={toolCategory} onChange={e=>TC(e.target.value)}>{["Essentials",...toolGroups.map(g=>g.name),"All tools"].map(x=><option key={x}>{x}</option>)}</select></label>
          {toolGroups.filter(g=>toolQuery||toolCategory==="Essentials"||toolCategory==="All tools"||g.name===toolCategory).map((g) => (
            <div className="tool-group" key={g.name}>
              <small>{g.name}</small>
              {g.tools
                .filter(([t]) =>
                  t.toLowerCase().includes(toolQuery.toLowerCase()) && (!!toolQuery || toolCategory!=="Essentials" || ["Select","Text","Circle","Rectangle","Triangle","Star","Segment","Pen"].includes(t)),
                )
                .map(([t, icon]) => (
                  <button
                    key={t}
                    aria-pressed={tool === t}
                    className={tool === t ? "selected" : ""}
                    onClick={() => T(t)}
                  >
                    <span>{icon}</span>
                    {t}
                  </button>
                ))}
            </div>
          ))}
          <div className="play-colors">
            {colors.map((c) => (
              <button
                key={c}
                style={{ background: c }}
                aria-label={"Draw in " + c}
                aria-pressed={color === c}
                onClick={() => C(c)}
                className={color === c ? "chosen" : ""}
              />
            ))}
          </div>
          <label><input type="checkbox" checked={autoSelect} onChange={e=>AS(e.target.checked)}/>Select after drawing</label>
          <label>
            <input
              type="checkbox"
              checked={snap}
              onChange={(e) => N(e.target.checked)}
            />
            Snap to grid
          </label>
          <label>
            <input
              type="checkbox"
              checked={grid}
              onChange={(e) => G(e.target.checked)}
            />
            Show grid
          </label>
          <label>
            <input
              type="checkbox"
              checked={labels}
              onChange={(e) => L(e.target.checked)}
            />
            Measurements
          </label>
        </aside>
        <div className="play-canvas-wrap">
          <div className="play-canvas-bar">
            <span>
              {tool === "Select"
                ? "Select mode · click a shape to edit; drag it to move"
                : tool === "Eraser"
                  ? "Click an unlocked object to erase"
                  : tool === "Point"
                    ? "Click to add a point"
                    : "Drag to draw · " + tool}
            </span>
            <div>
              <button
                disabled={!past.length}
                onClick={() => {
                  F([shapes, ...future]);
                  S(past[past.length - 1]);
                  H(past.slice(0, -1));
                  Q(null);
                  HS("Previous canvas restored");
                }}
              >
                Undo
              </button>
              <button
                disabled={!future.length}
                onClick={() => {
                  H([...past, shapes]);
                  S(future[0]);
                  F(future.slice(1));
                  Q(null);
                  HS("Canvas action restored");
                }}
              >
                Redo
              </button>
            </div>
          </div>
          <svg
            ref={svg}
            className="play-canvas"
            tabIndex={0}
            viewBox={`${viewCenter[0] - 600 / zoom} ${viewCenter[1] - 360 / zoom} ${1200 / zoom} ${720 / zoom}`}
            aria-label="Interactive geometry canvas"
            onPointerDown={(e) => {
              if (tool === "Select") {
                Q(null);
                return;
              }
              if (tool === "Eraser") return;
              e.currentTarget.setPointerCapture(e.pointerId);
              const p = pos(e),
                s: Shape = {
                  id: Date.now(),
                  kind: tool,
                  a: p,
                  b: p,
                  color,
                  sides,
                  sweep: 90,
                  innerRatio: 0.5,
                  label: "Your idea",
                  ...(tool === "Pen" ? { points: [p] } : {}),
                };
              gesture.current = { start: p, original: null };
              current.current = s;
              D(s);
            }}
            onPointerMove={(e) => {
              const g = gesture.current;
              if (!g) return;
              const p = pos(e),
                dx = p[0] - g.start[0],
                dy = p[1] - g.start[1];
              const s: Shape = g.original
                ? {
                    ...g.original,
                    a: [g.original.a[0] + dx, g.original.a[1] + dy],
                    b: [g.original.b[0] + dx, g.original.b[1] + dy],
                    ...(g.original.points
                      ? {
                          points: g.original.points.map(
                            (q) => [q[0] + dx, q[1] + dy] as P,
                          ),
                        }
                      : {}),
                  }
                : {
                    ...current.current!,
                    b: p,
                    ...(tool === "Pen"
                      ? { points: [...(current.current!.points || []), p] }
                      : {}),
                  };
              current.current = s;
              D(s);
            }}
            onPointerUp={finish}
            onPointerCancel={() => {
              gesture.current = null;
              current.current = null;
              D(null);
            }}
          >
            <defs>
              <pattern
                id="play-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0H0V40"
                  stroke="#d4e2db"
                  fill="none"
                  strokeWidth=".8"
                />
                <circle cx="0" cy="0" r="1.4" fill="#9db9aa" />
              </pattern>
            </defs>
            <rect
              x="-1200"
              y="-720"
              width="3600"
              height="2160"
              fill="#f8fcf9"
            />
            {grid && (
              <rect
                x="-1200"
                y="-720"
                width="3600"
                height="2160"
                fill="url(#play-grid)"
              />
            )}
            <path
              d="M80 80V640H1120"
              fill="none"
              stroke="#96b7a6"
              strokeWidth="1.5"
            />
            <text x="88" y="666" fill="#719483" fontSize="13">
              0
            </text>
            <text x="1100" y="666" fill="#719483" fontSize="13">
              x
            </text>
            <text x="60" y="85" fill="#719483" fontSize="13">
              y
            </text>
            {mirror && (
              <g pointerEvents="none">
                <line
                  x1="600"
                  x2="600"
                  y1="50"
                  y2="640"
                  stroke="#986fba"
                  strokeDasharray="8 8"
                  strokeWidth="2"
                />
                <text x="610" y="70" fill="#986fba" fontSize="13">
                  mirror · x = 13 u
                </text>
              </g>
            )}
            {protractor && (
              <g pointerEvents="none" opacity=".65">
                <path
                  d="M440 360A160 160 0 0 1 760 360Z"
                  fill="#edc67820"
                  stroke="#bc8f42"
                />
                {Array.from({ length: 19 }, (_, i) => {
                  const a = (i * Math.PI) / 18;
                  return (
                    <g key={i}>
                      <line
                        x1={600 + 150 * Math.cos(a)}
                        y1={360 - 150 * Math.sin(a)}
                        x2={600 + 160 * Math.cos(a)}
                        y2={360 - 160 * Math.sin(a)}
                        stroke="#bc8f42"
                      />
                      <text
                        x={600 + 135 * Math.cos(a)}
                        y={364 - 135 * Math.sin(a)}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#916719"
                      >
                        {i * 10}
                      </text>
                    </g>
                  );
                })}
                <circle cx="600" cy="360" r="4" fill="#bc8f42" />
              </g>
            )}
            {ruler && (
              <g pointerEvents="none">
                <rect
                  x="80"
                  y="605"
                  width="1040"
                  height="35"
                  fill="#efdfb8b0"
                />
                {Array.from({ length: 27 }, (_, i) => (
                  <g key={i}>
                    <line
                      x1={80 + i * 40}
                      x2={80 + i * 40}
                      y1="605"
                      y2="615"
                      stroke="#a68a55"
                    />
                    <text
                      x={80 + i * 40}
                      y="632"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#81652f"
                    >
                      {i}
                    </text>
                  </g>
                ))}
              </g>
            )}
            {graph && (
              <g pointerEvents="none">
                <path
                  d={plotPath}
                  stroke="#c75c71"
                  strokeWidth="3"
                  fill="none"
                />
                {Array.from({ length: 14 }, (_, i) => (
                  <text
                    key={i}
                    x={80 + i * 80}
                    y="685"
                    fontSize="13"
                    fill="#8d6473"
                  >
                    {i * 2}
                  </text>
                ))}
                <text x="95" y="100" fontSize="16" fill="#ac4560">
                  f(x) = {expression}
                </text>
              </g>
            )}
            {shapes.filter((s) => s.id !== draft?.id).map((s) => render(s))}
            {draft && render(draft, true)}
          </svg>
          <div className="play-canvas-bar">
            <span>1 square = 1 unit · geometry origin at lower left</span>
            <div>
              <button
                aria-label="Zoom out"
                onClick={() => Z(Math.max(0.5, zoom - 0.25))}
              >
                −
              </button>
              <button onClick={() => {Z(1);VC([600,360])}}>{Math.round(zoom * 100)}%</button>
              <button
                aria-label="Zoom in"
                onClick={() => Z(Math.min(2.5, zoom + 0.25))}
              >
                +
              </button>
              <button onClick={()=>{const fit=fitCanvas(shapes);Z(fit.zoom);VC([fit.x,fit.y])}}>Fit all objects</button>
              <button onClick={()=>VC([viewCenter[0]-120/zoom,viewCenter[1]])}>Pan left</button><button onClick={()=>VC([viewCenter[0]+120/zoom,viewCenter[1]])}>Pan right</button><button onClick={()=>VC([viewCenter[0],viewCenter[1]-80/zoom])}>Pan up</button><button onClick={()=>VC([viewCenter[0],viewCenter[1]+80/zoom])}>Pan down</button>
              <button onClick={exportSvg}>Export SVG</button>
              <button onClick={exportProject}>Save project</button>
              <button onClick={() => file.current?.click()}>
                Import project
              </button>
              <input
                ref={file}
                type="file"
                accept=".json"
                hidden
                onChange={(e) => void importProject(e.currentTarget)}
              />
            </div>
          </div>
          <p className="play-history-status" aria-live="polite">
            {historyStatus}
          </p>
        </div>
        <aside className="play-inspector">
          <span className="eyebrow">OBJECT INSPECTOR</span>
          <h3>{picked ? picked.kind : "Select a discovery"}</h3>
          {picked ? (
            <>
              <div className="play-measure">
                <strong>
                  {picked.kind === "Text"
                    ? "Aa"
                    : picked.kind === "Point"
                      ? `(${((picked.a[0] - 80) / 40).toFixed(1)}, ${((640 - picked.a[1]) / 40).toFixed(1)})`
                      : picked.kind === "Angle"
                        ? measureShape(picked).angle.toFixed(1)
                        : measureShape(picked).area > 0
                          ? measureShape(picked).area.toFixed(2)
                          : measureShape(picked).length.toFixed(2)}
                </strong>
                <span>
                  {picked.kind === "Text"
                    ? "editable annotation"
                    : picked.kind === "Point"
                      ? "coordinates in units"
                      : picked.kind === "Angle"
                        ? "degrees · counterclockwise angle"
                        : measureShape(picked).area > 0
                          ? "square units · area"
                          : ["Line", "Ray"].includes(picked.kind)
                            ? "units between construction points"
                            : "units · length"}
                </span>
                {measureShape(picked).area > 0 && (
                  <small>
                    Boundary: {measureShape(picked).length.toFixed(2)} u{" "}
                    {picked.kind === "Ellipse" ? "(approx.)" : ""}
                  </small>
                )}
              </div>
              {(["a", "b"] as const).map((k) => (
                <div className="coordinate-inputs" key={k}>
                  <strong>{k === "a" ? "Start" : "End"}</strong>
                  {[0, 1].map((i) => (
                    <label key={i}>
                      {i ? "y" : "x"}
                      <input
                        aria-label={k + " " + (i ? "y" : "x") + " coordinate"}
                        disabled={picked.locked}
                        type="number"
                        step=".5"
                        value={
                          (i ? 640 - picked[k][i] : picked[k][i] - 80) / 40
                        }
                        onChange={(e) => {
                          const p = [...picked[k]] as P;
                          p[i] = i
                            ? 640 - Number(e.target.value) * 40
                            : 80 + Number(e.target.value) * 40;
                          update({ [k]: p });
                        }}
                      />
                    </label>
                  ))}
                </div>
              ))}
              {["Polygon", "Star"].includes(picked.kind) && (
                <label className="inspector-label">
                  Sides
                  <input
                    aria-label="Selected polygon sides"
                    type="number"
                    min="3"
                    max="12"
                    disabled={picked.locked}
                    value={picked.sides || 6}
                    onChange={(e) =>
                      update({
                        sides: Math.max(
                          3,
                          Math.min(12, Math.round(Number(e.target.value) || 3)),
                        ),
                      })
                    }
                  />
                </label>
              )}
              <div className="play-colors">
                {colors.map((c) => (
                  <button
                    key={c}
                    aria-label={"Recolor selected object " + c}
                    style={{ background: c }}
                    disabled={picked.locked}
                    onClick={() => update({ color: c })}
                  />
                ))}
              </div>
              {picked.kind === "Text" && (
                <label className="inspector-label">
                  Annotation
                  <input
                    aria-label="Object annotation"
                    maxLength={120}
                    value={picked.label || ""}
                    disabled={picked.locked}
                    onChange={(e) => update({ label: e.target.value })}
                  />
                </label>
              )}
              {["Arc", "Sector"].includes(picked.kind) && (
                <label className="inspector-label">
                  Sweep angle (degrees)
                  <input
                    aria-label="Arc sweep angle"
                    type="number"
                    min="1"
                    max="359"
                    value={picked.sweep || 90}
                    disabled={picked.locked}
                    onChange={(e) =>
                      update({
                        sweep: Math.max(
                          1,
                          Math.min(359, Number(e.target.value) || 1),
                        ),
                      })
                    }
                  />
                </label>
              )}
              {picked.kind === "Annulus" && (
                <label className="inspector-label">
                  Inner / outer radius
                  <input
                    aria-label="Ring radius ratio"
                    type="number"
                    min=".05"
                    max=".95"
                    step=".05"
                    value={picked.innerRatio ?? 0.5}
                    disabled={picked.locked}
                    onChange={(e) =>
                      update({
                        innerRatio: Math.max(
                          0.05,
                          Math.min(0.95, Number(e.target.value) || 0.05),
                        ),
                      })
                    }
                  />
                </label>
              )}
              <label className="inspector-label">
                Line weight
                <input
                  aria-label="Object line weight"
                  type="number"
                  min="1"
                  max="10"
                  value={picked.strokeWidth || 2.5}
                  disabled={picked.locked}
                  onChange={(e) =>
                    update({
                      strokeWidth: Math.max(
                        1,
                        Math.min(10, Number(e.target.value) || 1),
                      ),
                    })
                  }
                />
              </label>
              <label className="inspector-label">
                <span>
                  <input
                    type="checkbox"
                    checked={!!picked.dashed}
                    disabled={picked.locked}
                    onChange={(e) => update({ dashed: e.target.checked })}
                  />{" "}
                  Dashed outline
                </span>
              </label>
              <label className="inspector-label">Custom color<input aria-label="Selected object color" type="color" disabled={picked.locked} value={picked.color} onChange={e=>update({color:e.target.value})}/></label>
              <details className="object-alignment"><summary>Align on the canvas</summary><div>{["Left","Center horizontally","Right","Top","Center vertically","Bottom"].map(action=><button key={action} disabled={picked.locked} onClick={()=>{const aligned=alignCanvasShape(picked,action);commit(shapes.map(s=>s.id===picked.id?aligned:s));HS("Object aligned: "+action)}}>{action}</button>)}</div><small>Alignment uses the original 1200 × 720 drawing page, with a margin of 80 pixels. It preserves size.</small></details>
              <div className="play-transform-buttons">
                {[
                  ["Duplicate", "duplicate"],
                  ["Rotate 90°", "rotate"],
                  ["Reflect", "reflect"],
                  ["Scale ×1.5", "enlarge"],
                  ["Scale ÷1.5", "shrink"],
                ].map(([label, action]) => (
                  <button
                    key={action}
                    disabled={picked.locked}
                    onClick={() => transform(action)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p>
                Square uses horizontal drag length for both sides. Circle, arc,
                star and regular triangle Start is their center. Reflect uses x
                = 13 u. Rotation acts around the object center. Coordinate
                fields describe its construction before rotation.
              </p>
              <button
                disabled={picked.locked}
                onClick={() => {
                  commit(shapes.filter((s) => s.id !== picked.id));
                  Q(null);
                }}
              >
                Delete object
              </button>
            </>
          ) : (
            <p>
              Click a shape or select it from the object list. Then try its
              transformations or edit exact coordinates.
            </p>
          )}
          <div className="play-layer-panel">
            <span className="eyebrow">OBJECTS & LAYERS</span>
            {!shapes.length && (
              <p>Your canvas is ready for its first object.</p>
            )}
            {shapes.map((s, i) => (
              <div key={s.id} className={selected === s.id ? "selected" : ""}>
                <button
                  aria-label={"Select " + s.kind + " " + (i + 1)}
                  onClick={() => Q(s.id)}
                >
                  <i style={{ background: s.color }} />
                  {s.kind} {i + 1}
                </button>
                <button
                  aria-label={
                    (s.hidden ? "Show " : "Hide ") + s.kind + " " + (i + 1)
                  }
                  onClick={() =>
                    commit(
                      shapes.map((v) =>
                        v.id === s.id ? { ...v, hidden: !v.hidden } : v,
                      ),
                    )
                  }
                >
                  {s.hidden ? "○" : "◉"}
                </button>
                <button
                  aria-label={
                    (s.locked ? "Unlock " : "Lock ") + s.kind + " " + (i + 1)
                  }
                  onClick={() =>
                    commit(
                      shapes.map((v) =>
                        v.id === s.id ? { ...v, locked: !v.locked } : v,
                      ),
                    )
                  }
                >
                  {s.locked ? "🔒" : "♧"}
                </button>
              </div>
            ))}
            {picked && (
              <div className="layer-order">
                <button
                  onClick={() =>
                    commit([
                      ...shapes.filter((s) => s.id !== picked.id),
                      picked,
                    ])
                  }
                >
                  Bring to front
                </button>
                <button
                  onClick={() =>
                    commit([
                      picked,
                      ...shapes.filter((s) => s.id !== picked.id),
                    ])
                  }
                >
                  Send to back
                </button>
              </div>
            )}
          </div>
          <div className="play-challenge">
            <span className="eyebrow">CONSTRUCTION MISSION</span>
            <select
              aria-label="Drawing challenge"
              value={challenge}
              onChange={(e) => {
                B(e.target.value);
                M("");
              }}
            >
              {missions.map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
            <button className="primary" onClick={check}>
              Check my canvas →
            </button>
            <p role="status">
              {message || "Construct the target, then check your idea."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
