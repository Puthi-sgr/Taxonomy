/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { hierarchy, tree as d3tree } from "d3-hierarchy";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Home, Minimize2, Expand } from "lucide-react";
import { TaxonomyNode, SelectedItem } from "../../TaxonomyData/Taxonomy.dto";
import { TaxonomyContext } from "../../context/TaxonomyContext";
import taxonomyData from "../../TaxonomyData/TaxonomyData";

/**
 * Taxonomy Tree Visualizer
 * -----------------------------------------
 * • Nodes connect to their parent concept
 * • Hover a node: shows description tooltip
 * • Click a node: toggles sub-concepts (expand/collapse) and shows details
 * • Drag to pan; scroll (or buttons) to zoom
 * • Toolbar: Zoom in/out, Fit to screen, Expand All, Collapse All
 *
 * This component is generic and renders any hierarchical taxonomy.
 */

// ---------------- Taxonomy data & types ---------------- //

// Utility: build a pruned tree that only includes children when parent is expanded
function buildVisibleTree(
  data: TaxonomyNode,
  expandedIds: Set<string>,
  depth = 0,
  alwaysShowDepth = 1
): TaxonomyNode {
  const node = { ...data };
  const showChildren = depth < alwaysShowDepth || expandedIds.has(data.id);
  if (node.children && node.children.length) {
    node.children = showChildren
      ? node.children.map((c) =>
          buildVisibleTree(c, expandedIds, depth + 1, alwaysShowDepth)
        )
      : [];
  }
  return node;
}

// Collect ids of all nodes with children
function idsWithChildren(node: TaxonomyNode, out: Set<string> = new Set()) {
  if (node.children && node.children.length) {
    out.add(node.id);
    node.children.forEach((c) => idsWithChildren(c, out));
  }
  return out;
}

// Compute a smooth cubic path between two points for links
function linkPath(from: GraphNode, to: GraphNode) {
  const x0 = from.x;
  const y0 = from.y;
  const x1 = to.x;
  const y1 = to.y;
  const mx = (y0 + y1) / 2;
  return `M ${y0},${x0} C ${mx},${x0} ${mx},${x1} ${y1},${x1}`;
}

// Tailwind-friendly button
interface TBProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

function TB({ onClick, title, children }: TBProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="inline-flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-3 py-2 text-sm shadow hover:shadow-md border border-slate-200 hover:bg-white transition"
    >
      {children}
    </button>
  );
}

interface GraphNode extends TaxonomyNode {
  depth: number;
  x: number;
  y: number;
  hasChildren: boolean;
  data: TaxonomyNode;
}

const TaxonomyGraph = () => {
  const { taxonomy } = React.useContext(TaxonomyContext);
  // Dynamically set TAXONOMY_DATA based on the selected taxonomy
  const TAXONOMY_DATA: TaxonomyNode = taxonomyData[taxonomy] || {
    id: "root",
    name: "No Data",
  };

  const ROOT_ID = TAXONOMY_DATA.id;
  // Expanded nodes: start with root expanded so first-level children show
  const [expanded, setExpanded] = useState<Set<string>>(new Set([ROOT_ID]));
  const hasFitRef = useRef(false);

  // When the taxonomy changes, reset the expanded set so the new tree starts
  // from a clean state. Also reset the fit flag so the view recenters.
  useEffect(() => {
    setExpanded(new Set([ROOT_ID]));
    hasFitRef.current = false;
    setSelected(null);
    setTooltip((t) => ({ ...t, visible: false }));
  }, [ROOT_ID]);

  // Pan/zoom state
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  // Selection for info bar
  const [selected, setSelected] = useState<SelectedItem | null>(null);

  const containerRef = useRef(null);
  const dims = useContainerSize(containerRef);

  const visibleData = useMemo(
    () => buildVisibleTree(TAXONOMY_DATA, expanded, 0, 1),
    [expanded, TAXONOMY_DATA]
  );

  // Layout the visible tree
  const { nodes, links } = useMemo(() => {
    const height = Math.max(dims.height - 120, 560);

    const root: any = hierarchy(visibleData);

    const treeLayout = d3tree()
      .nodeSize([56, 200])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.25));

    const laid = treeLayout(root);

    const nodes = laid.descendants().map((d: any) => ({
      id: d.data.id,
      name: d.data.name,
      description: d.data.description,
      depth: d.depth,
      x: d.x + height / 2, // center vertically
      y: d.y + 140, // left padding
      hasChildren: d.data.children && d.data.children.length > 0,
      data: d.data,
    }));

    const nodeById = new Map(nodes.map((n: any) => [n.id, n]));

    const links = laid.links().map((l: any) => ({
      source: nodeById.get(l.source.data.id),
      target: nodeById.get(l.target.data.id),
    }));

    return { nodes, links };
  }, [visibleData, dims.height]);

  // Fit-to-screen initially
  const fitToScreen = React.useCallback(() => {
    if (!nodes.length || !dims.width || !dims.height) return;
    const pad = 48;
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const minX = Math.min(...xs) - pad;
    const maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad;
    const maxY = Math.max(...ys) + pad;
    const w = maxY - minY;
    const h = maxX - minX;
    const scaleX = (dims.width - 24) / w;
    const scaleY = (dims.height - 120) / h;
    const s = Math.max(0.4, Math.min(1.2, Math.min(scaleX, scaleY)));
    setScale(s);
    // Center the content
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    setTx(dims.width / 2 - cy * s);
    setTy((dims.height - 80) / 2 - cx * s);
  }, [nodes, dims.width, dims.height]);

  useEffect(() => {
    if (!hasFitRef.current) {
      fitToScreen();
      hasFitRef.current = true;
    }
  }, [fitToScreen]);

  function zoom(delta: number) {
    setScale((s) => Math.max(0.3, Math.min(2.2, s + delta)));
  }

  // Drag to pan
  const dragState = useRef({ dragging: false, x: 0, y: 0, tx: 0, ty: 0 });
  function onPointerDown(e: any) {
    dragState.current = {
      dragging: true,
      x: e.clientX,
      y: e.clientY,
      tx,
      ty,
    };
  }
  function onPointerMove(e: any) {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.x;
    const dy = e.clientY - dragState.current.y;
    setTx(dragState.current.tx + dx);
    setTy(dragState.current.ty + dy);
  }
  function onPointerUp() {
    dragState.current.dragging = false;
  }

  function toggle(id: string) {
    const hasKidsInFull = !!findNodeById(TAXONOMY_DATA, id)?.children?.length;
    if (!hasKidsInFull) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    const all = idsWithChildren(TAXONOMY_DATA);
    setExpanded(all);
  }
  function collapseAll() {
    setExpanded(new Set([ROOT_ID]));
  }

  return (
    <div
      className="w-full h-full min-h-[760px] bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800"
      ref={containerRef}
    >
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white/70 backdrop-blur px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">
            {taxonomy || "Didn't load"}
            {taxonomyData[taxonomy]?.name}
          </span>
          <span className="text-xs text-slate-500">
            hover for info • click to expand
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TB onClick={() => zoom(0.15)} title="Zoom in">
            <ZoomIn className="h-4 w-4" /> <span>Zoom in</span>
          </TB>
          <TB onClick={() => zoom(-0.15)} title="Zoom out">
            <ZoomOut className="h-4 w-4" /> <span>Zoom out</span>
          </TB>
          <TB onClick={fitToScreen} title="Fit to screen">
            <Home className="h-4 w-4" /> <span>Fit</span>
          </TB>
          <TB onClick={expandAll} title="Expand all">
            <Expand className="h-4 w-4" /> <span>Expand all</span>
          </TB>
          <TB onClick={collapseAll} title="Collapse all">
            <Minimize2 className="h-4 w-4" /> <span>Collapse</span>
          </TB>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative h-[calc(100%-56px)] select-none"
        onPointerMove={(e) => {
          if (tooltip.visible)
            setTooltip((t) => ({ ...t, x: e.clientX + 12, y: e.clientY + 12 }));
          onPointerMove(e);
        }}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerLeave={onPointerUp}
        onWheel={(e) => {
          e.preventDefault();
          const delta = -Math.sign(e.deltaY) * 0.1;
          zoom(delta);
        }}
      >
        <svg
          className="absolute inset-0"
          width={dims.width}
          height={dims.height - 56}
        >
          <defs>
            <filter
              id="softShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="6"
                floodOpacity="0.18"
              />
            </filter>
          </defs>
          <g transform={`translate(${tx},${ty}) scale(${scale})`}>
            {/* Links */}
            {links.map((l: any, i) => (
              <path
                key={`link-${i}`}
                d={linkPath(l.source, l.target)}
                className="fill-none stroke-slate-300"
                strokeWidth={2}
              />
            ))}

            {/* Nodes */}
            {nodes.map((n: any) => (
              <Node
                key={n.id}
                node={n}
                isExpanded={expanded.has(n.id)}
                onHover={(show) =>
                  setTooltip((t) => ({
                    ...t,
                    visible: show,
                    x: t.x,
                    y: t.y,
                    text: `${n.name}: ${n.description}`,
                  }))
                }
                onMove={(x, y) => setTooltip((t) => ({ ...t, x, y }))}
                onClick={() => {
                  setSelected(n);
                  toggle(n.id);
                }}
              />
            ))}
          </g>
        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            style={{ left: tooltip.x, top: tooltip.y }}
            className="pointer-events-none absolute z-30 max-w-xs rounded-xl border border-slate-200 bg-white p-2 text-xs shadow-lg"
          >
            {tooltip.text}
          </div>
        )}

        {/* Info footer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-3 pb-3">
          {selected ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white/85 p-4 shadow backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm uppercase tracking-wide text-slate-500">
                    Selected
                  </div>
                  <div className="text-base font-semibold truncate">
                    {selected.name}
                  </div>
                  <div className="text-sm text-slate-700">
                    {selected.description}
                  </div>
                </div>
                <div className="text-xs text-slate-500 shrink-0 pl-2">
                  Depth: {selected.depth} •{" "}
                  {selected.hasChildren ? "has sub‑concepts" : "leaf"}
                </div>
              </div>

              {selected.data?.details?.commands?.length ? (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-600 mb-1">
                    Key commands
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selected.data.details.commands.map((c, i) => (
                      <code
                        key={i}
                        className="rounded-md bg-slate-100 px-2 py-1 text-[11px]"
                      >
                        {c}
                      </code>
                    ))}
                  </div>
                </div>
              ) : null}

              {selected.data?.details?.tips?.length ? (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-600 mb-1">
                    Tips & gotchas
                  </div>
                  <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                    {selected.data.details.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </motion.div>
          ) : (
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/70 p-3 text-center text-sm text-slate-600 shadow backdrop-blur">
              Tip: Hover nodes for quick info. Click nodes to reveal
              sub‑concepts and see commands & tips here. Drag the canvas to pan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NodeProps {
  node: GraphNode;
  isExpanded: boolean;
  onHover: (state: boolean) => void;
  onMove: (x: number, y: number) => void;
  onClick: () => void;
}

function Node({ node, isExpanded, onHover, onMove, onClick }: NodeProps) {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (hover) onHover(true);
    else onHover(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover]);

  const r = 20;
  const labelPadX = 14;

  return (
    <g
      transform={`translate(${node.y},${node.x})`}
      onPointerEnter={(e) => {
        setHover(true);
        onMove(e.clientX + 12, e.clientY + 12);
      }}
      onPointerLeave={() => setHover(false)}
      onPointerMove={(e) => onMove(e.clientX + 12, e.clientY + 12)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="cursor-pointer"
    >
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Node bubble */}
        <circle
          r={r}
          className={`fill-white stroke-2 ${
            node.hasChildren ? "stroke-blue-400" : "stroke-slate-300"
          }`}
          filter="url(#softShadow)"
        />
        {/* Plus/chevron indicator */}
        {node.hasChildren && (
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className="select-none text-[12px] font-bold"
          >
            {isExpanded || node.depth < 1 ? "–" : "+"}
          </text>
        )}

        {/* Label pill */}
        <g transform={`translate(${r + 8},${-r})`}>
          <rect
            rx={16}
            ry={16}
            width={Math.max(80, node.name.length * 8) + labelPadX * 2}
            height={r * 2}
            className={`${
              hover
                ? "fill-blue-50 stroke-blue-300"
                : "fill-white/90 stroke-slate-200"
            }`}
            strokeWidth={1.5}
          />
          <text
            x={labelPadX}
            y={r}
            dominantBaseline="central"
            className="select-none text-sm"
          >
            {node.name}
          </text>
        </g>
      </motion.g>
    </g>
  );
}

// Find a node by id in the full taxonomy
function findNodeById(
  node: TaxonomyNode,
  id: string
): TaxonomyNode | undefined {
  if (node.id === id) return node;
  for (const c of node.children || []) {
    const found = findNodeById(c, id);
    if (found) return found;
  }
  return undefined;
}

// Observe container size
function useContainerSize(ref: React.RefObject<HTMLDivElement>): {
  width: number;
  height: number;
} {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export default TaxonomyGraph;
