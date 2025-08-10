import React, { useEffect, useMemo, useRef, useState } from "react";
import { hierarchy, tree as d3tree } from "d3-hierarchy";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Home, Minimize2, Expand } from "lucide-react";

/**
 * Docker Taxonomy Tree Visualizer — Expanded
 * -----------------------------------------
 * • Nodes connect to their parent concept
 * • Hover a node: shows description tooltip
 * • Click a node: toggles sub-concepts (expand/collapse) and shows details
 * • Drag to pan; scroll (or buttons) to zoom
 * • Toolbar: Zoom in/out, Fit to screen, Expand All, Collapse All
 *
 * What's new in this expanded version:
 * - Much richer taxonomy with deeper concepts
 * - Per-node details: key commands & tips/gotchas in the info panel
 */

// --- Docker taxonomy data (expanded) --- //
const DOCKER_TAXONOMY = {
  id: "docker",
  name: "Docker",
  description:
    "Docker is a platform to build, ship, and run apps in lightweight containers, backed by images.",
  details: {
    commands: [
      "docker version",
      "docker info",
      "docker help",
      "docker context ls",
    ],
    tips: [
      "Use contexts to target remote engines or cloud environments.",
      "Prefer BuildKit for faster, cache-efficient builds.",
    ],
  },
  children: [
    {
      id: "images",
      name: "Images",
      description:
        "Immutable blueprints created from layers; referenced by tags or content-addressable digests.",
      details: {
        commands: [
          "docker build -t app:1 .",
          "docker images",
          "docker history app:1",
          "docker inspect app:1",
          "docker buildx build --platform linux/amd64,linux/arm64 -t app:multi .",
        ],
        tips: [
          "Pin base images by digest for repeatability (FROM node@sha256:...).",
          "Use multi-stage builds to keep final images small.",
          "Avoid `latest` in production; tag with immutable versions.",
        ],
      },
      children: [
        {
          id: "layers",
          name: "Layers",
          description:
            "Each image is a stack of read‑only layers (copy-on-write). Cache reuses unchanged steps.",
          details: {
            tips: [
              "Order Dockerfile steps to maximize cache hits (install deps before copying source).",
              "Combine RUN steps wisely; avoid invalidating cache unnecessarily.",
            ],
          },
          children: [
            {
              id: "union-fs",
              name: "UnionFS",
              description:
                "Union filesystems (e.g., overlay2) present multiple layers as one coherent tree.",
            },
          ],
        },
        {
          id: "tags",
          name: "Tags",
          description:
            "Human-friendly labels (e.g., :1.20-alpine) pointing at an image digest.",
          details: {
            tips: [
              "Use semantic tags (:1, :1.2, :1.2.3) plus a stable :prod tag for rollout.",
              "Automate retagging on release to keep provenance clear.",
            ],
          },
        },
        {
          id: "digests",
          name: "Digests",
          description:
            "Content-addressed identifiers (sha256:...) ensuring exact image bytes are used.",
        },
        {
          id: "manifest-list",
          name: "Manifest List (Multi‑arch)",
          description:
            "An index that points to architecture-specific images so pulls match the client platform.",
        },
        {
          id: "oci",
          name: "OCI Image Spec",
          description:
            "Open Container Initiative spec defines image format and metadata layout.",
        },
      ],
    },
    {
      id: "dockerfile",
      name: "Dockerfile",
      description:
        "Recipe to build images with instructions like FROM, RUN, COPY, CMD, ENTRYPOINT.",
      details: {
        commands: ["docker build -f Dockerfile -t app .", "docker buildx bake"],
        tips: [
          "Prefer explicit `COPY --chown` to set ownership.",
          "Use `.dockerignore` to keep build context small.",
          "Use exec-form for CMD/ENTRYPOINT to avoid shell signal issues.",
        ],
      },
      children: [
        {
          id: "instructions",
          name: "Instructions",
          description:
            "FROM, RUN, COPY/ADD, EXPOSE, ENV, ARG, WORKDIR, USER, VOLUME, LABEL, CMD, ENTRYPOINT.",
        },
        {
          id: "multistage",
          name: "Multi‑stage Builds",
          description:
            "Build artifacts in one stage and copy only essentials into a tiny final image.",
          details: {
            tips: [
              "Name stages (AS builder) and `COPY --from=builder` to final stage.",
            ],
          },
        },
        {
          id: "healthcheck",
          name: "HEALTHCHECK",
          description:
            "Command for the engine to evaluate container health (healthy/unhealthy).",
        },
        {
          id: "buildkit",
          name: "BuildKit",
          description:
            "Modern builder enabling parallel builds, mounts (RUN --mount), secrets, and better caching.",
          details: {
            tips: [
              "Use `RUN --mount=type=cache` to speed up package managers.",
              "Use `RUN --mount=type=secret` to avoid baking secrets into layers.",
            ],
          },
        },
        {
          id: "dockerignore",
          name: ".dockerignore",
          description:
            "Exclude files from the build context (node_modules, .git, build artifacts).",
        },
      ],
    },
    {
      id: "containers",
      name: "Containers",
      description:
        "Isolated processes created from images with a thin writable layer and namespaces.",
      details: {
        commands: [
          "docker run --rm -it alpine sh",
          "docker ps -a",
          "docker logs -f <id>",
          "docker exec -it <id> sh",
          "docker stop <id> && docker rm <id>",
        ],
        tips: [
          "Use `--rm` for ephemeral runs to auto-clean.",
          "Set restart policies for long-running services.",
          "Prefer healthchecks and graceful SIGTERM handling.",
        ],
      },
      children: [
        {
          id: "lifecycle",
          name: "Lifecycle",
          description:
            "Create → Start → (Running) → Stop/Exit → Remove; also Paused & Restarted states.",
          children: [
            {
              id: "restart-policies",
              name: "Restart Policies",
              description:
                "no | on-failure | always | unless-stopped; governs auto-restarts.",
            },
            {
              id: "logs",
              name: "Logs & TTY",
              description:
                "Stream stdout/stderr; attach interactive TTY; choose log drivers.",
            },
            {
              id: "resources",
              name: "Resources",
              description:
                "Limit CPU/memory/pids/blkio; monitor via `docker stats`.",
            },
          ],
        },
        {
          id: "networking",
          name: "Networking",
          description:
            "Join networks, resolve container names via embedded DNS, and publish/expose ports.",
          children: [
            {
              id: "ports",
              name: "Ports",
              description: "expose vs -p host:container mapping.",
            },
            {
              id: "dns",
              name: "DNS",
              description: "Automatic service discovery by container name.",
            },
            {
              id: "aliases",
              name: "Aliases",
              description: "Add extra DNS names per network.",
            },
          ],
        },
        {
          id: "storage",
          name: "Ephemeral Storage",
          description:
            "Writable layer lives with the container; durable data should use volumes/binds.",
          children: [
            {
              id: "overlay2",
              name: "overlay2",
              description: "Default storage driver on Linux.",
            },
            {
              id: "tmpfs",
              name: "tmpfs",
              description: "In-memory mount for sensitive or fast I/O.",
            },
          ],
        },
        {
          id: "entrypoint",
          name: "ENTRYPOINT vs CMD",
          description:
            "ENTRYPOINT defines the executable; CMD provides default args (or command if no entrypoint).",
        },
      ],
    },
    {
      id: "volumes",
      name: "Volumes",
      description:
        "Managed storage that survives container removal and supports drivers & sharing.",
      details: {
        commands: [
          "docker volume create data",
          "docker run -v data:/var/lib/app ...",
          "docker volume ls",
          "docker volume inspect data",
        ],
        tips: [
          "Prefer named volumes for portability; use bind mounts for local dev.",
          "Use `:ro` for mounts that shouldn't be written.",
        ],
      },
      children: [
        {
          id: "types",
          name: "Types",
          description:
            "Named volumes, anonymous volumes, and bind mounts to host paths.",
        },
        {
          id: "drivers",
          name: "Drivers",
          description:
            "local (default), nfs, smb, cloud providers via plugins.",
        },
        {
          id: "backup",
          name: "Backup/Restore",
          description:
            "Use tar or dedicated tools to snapshot/restore volume contents.",
        },
      ],
    },
    {
      id: "networks",
      name: "Networks",
      description:
        "Connectivity between containers via drivers, subnets, IPAM, and DNS-based discovery.",
      details: {
        commands: [
          "docker network create mynet",
          "docker network ls",
          "docker network inspect mynet",
          "docker run --network=mynet ...",
        ],
        tips: [
          "Bridge is default on a single host; overlay spans multiple nodes (Swarm).",
          "Use network aliases for stable service names.",
        ],
      },
      children: [
        {
          id: "bridge",
          name: "Bridge",
          description: "Default local network; NAT to host.",
        },
        {
          id: "host",
          name: "Host",
          description: "Share host network stack (no isolation).",
        },
        { id: "none", name: "None", description: "No network connectivity." },
        {
          id: "overlay",
          name: "Overlay",
          description: "Multi-host VXLAN overlay for Swarm.",
        },
        {
          id: "macvlan",
          name: "Macvlan",
          description: "Give containers their own MAC on LAN.",
        },
      ],
    },
    {
      id: "compose",
      name: "Docker Compose",
      description:
        "YAML spec to define multi-container apps; `docker compose up` manages the lifecycle.",
      details: {
        commands: [
          "docker compose up -d",
          "docker compose logs -f service",
          "docker compose down -v",
          "docker compose --profile dev up",
        ],
        tips: [
          "`depends_on` doesn't wait for health by default; use healthchecks or wait scripts.",
          "Split overrides into multiple -f files for environments.",
        ],
      },
      children: [
        {
          id: "services",
          name: "Services",
          description: "Containers plus config as units.",
        },
        {
          id: "env",
          name: "Env & Secrets",
          description: ".env files, secret injection.",
        },
        {
          id: "profiles",
          name: "Profiles",
          description: "Enable/disable subsets of services.",
        },
        {
          id: "netvol",
          name: "Networks & Volumes",
          description: "Define shared resources.",
        },
        {
          id: "scale",
          name: "Scale",
          description: "Run N replicas with --scale.",
        },
        {
          id: "deploy",
          name: "Deploy (Swarm)",
          description: "Compose fields for Swarm mode.",
        },
      ],
    },
    {
      id: "registry",
      name: "Registry",
      description:
        "Stores and serves images for push/pull. Examples: Docker Hub, GHCR, private registries.",
      details: {
        commands: [
          "docker login",
          "docker tag app:1 myrepo/app:1",
          "docker push myrepo/app:1",
          "docker pull myrepo/app:1",
        ],
        tips: [
          "Use access tokens over passwords for CI.",
          "Consider image signing and provenance (e.g., cosign/Notary).",
        ],
      },
      children: [
        {
          id: "hub",
          name: "Docker Hub",
          description: "Public registry with namespaces.",
        },
        {
          id: "ghcr",
          name: "GHCR",
          description: "GitHub Container Registry hosting.",
        },
        {
          id: "harbor",
          name: "Harbor",
          description: "Open-source enterprise registry with policies.",
        },
        {
          id: "auth",
          name: "Auth & Trust",
          description:
            "Login with tokens; enable signing and enforce retention or scanning policies.",
        },
        {
          id: "caches",
          name: "Caches/Proxies",
          description:
            "Registry mirrors and pull-through caches reduce latency and rate-limit issues.",
        },
      ],
    },
    {
      id: "orchestration",
      name: "Orchestration",
      description:
        "Run containers across many machines with schedulers, health checks, and service discovery.",
      details: {
        tips: [
          "Swarm is simple and integrated; Kubernetes is feature-rich and ubiquitous.",
        ],
      },
      children: [
        {
          id: "swarm",
          name: "Swarm",
          description:
            "Native orchestrator (services, stacks, secrets, configs).",
          children: [
            {
              id: "svc",
              name: "Services",
              description: "Desired-state tasks with updates.",
            },
            {
              id: "nodes",
              name: "Nodes",
              description: "Managers and workers in a cluster.",
            },
            {
              id: "secrets",
              name: "Secrets",
              description: "Encrypted at rest and in transit.",
            },
            {
              id: "stacks",
              name: "Stacks",
              description: "Compose‑like bundles for Swarm.",
            },
            {
              id: "update",
              name: "Updates/Rollback",
              description: "Control batch size/delay/rollback.",
            },
          ],
        },
        {
          id: "k8s",
          name: "Kubernetes",
          description:
            "Industry-standard orchestrator; Docker images run via a CRI runtime (containerd).",
          children: [
            {
              id: "pods",
              name: "Pods",
              description: "Smallest schedulable unit; 1+ containers.",
            },
            {
              id: "deploy",
              name: "Deployments",
              description: "Declarative rollout/rollback.",
            },
            {
              id: "svc-k8s",
              name: "Services",
              description: "Stable virtual IPs for pods.",
            },
            {
              id: "ingress",
              name: "Ingress",
              description: "HTTP routing and TLS termination.",
            },
            {
              id: "configmap",
              name: "ConfigMaps",
              description: "Inject non-secret config.",
            },
            {
              id: "secret-k8s",
              name: "Secrets",
              description: "Base64 encoded, better with KMS.",
            },
            {
              id: "pvc",
              name: "PVCs",
              description: "PersistentVolumeClaims for storage.",
            },
            {
              id: "daemonset",
              name: "DaemonSets",
              description: "Run one per node (e.g., agents).",
            },
            {
              id: "statefulset",
              name: "StatefulSets",
              description: "Stable identities and storage.",
            },
            {
              id: "jobs",
              name: "Jobs/CronJobs",
              description: "Batch and scheduled workloads.",
            },
          ],
        },
      ],
    },
    {
      id: "security",
      name: "Security",
      description:
        "Isolation via namespaces & cgroups; harden with capabilities, seccomp, AppArmor/SELinux.",
      details: {
        tips: [
          "Drop capabilities by default; grant only what's needed.",
          "Run as non-root (USER); consider rootless mode.",
          "Enable a strict seccomp profile and use read-only filesystems where possible.",
        ],
      },
      children: [
        {
          id: "namespaces",
          name: "Namespaces",
          description: "PID, NET, MNT, UTS, IPC, USER.",
        },
        {
          id: "cgroups",
          name: "cgroups v2",
          description: "Resource accounting and limits.",
        },
        {
          id: "caps",
          name: "Capabilities",
          description: "Fine‑grained kernel privileges.",
        },
        {
          id: "seccomp",
          name: "seccomp",
          description: "Syscall filtering profile.",
        },
        {
          id: "apparmor",
          name: "AppArmor/SELinux",
          description: "Mandatory access control.",
        },
        {
          id: "rootless",
          name: "Rootless",
          description: "Run Docker/containers without root.",
        },
        {
          id: "scan",
          name: "Scanning",
          description: "Scan images for CVEs and SBOMs.",
        },
      ],
    },
    {
      id: "daemon",
      name: "CLI & Daemon",
      description:
        "dockerd exposes an API; docker CLI talks to it; contexts select local/remote endpoints.",
      details: {
        commands: [
          "docker context create",
          "docker context use <name>",
          "docker system df",
          "docker system prune",
          "docker events",
        ],
        tips: [
          "Tune daemon.json (log-driver, storage-driver, default-address-pools).",
          "Use `docker buildx` and `docker compose` subcommands for modern workflows.",
        ],
      },
      children: [
        {
          id: "dockerd",
          name: "dockerd",
          description: "The Docker daemon process.",
        },
        {
          id: "cli",
          name: "docker CLI",
          description: "User commands: build, run, push, etc.",
        },
        {
          id: "api",
          name: "API",
          description: "HTTP API used by CLI and tools.",
        },
        {
          id: "context",
          name: "Contexts",
          description: "Switch between local/remote endpoints.",
        },
        {
          id: "logs-driver",
          name: "Log Drivers",
          description: "json-file, journald, syslog, fluentd, etc.",
        },
      ],
    },
    {
      id: "observability",
      name: "Observability",
      description:
        "Understand container behavior with logs, metrics, traces, and engine events.",
      children: [
        {
          id: "logs-obs",
          name: "Logs",
          description: "Per-container logs and centralized drivers.",
        },
        {
          id: "metrics",
          name: "Metrics",
          description: "cAdvisor/containerd metrics; engine metrics.",
        },
        {
          id: "events",
          name: "Events",
          description: "Real-time engine events stream.",
        },
      ],
    },
    {
      id: "runtimes",
      name: "Runtimes",
      description:
        "Under the hood: containerd manages images & containers; runc creates Linux containers.",
      children: [
        {
          id: "containerd",
          name: "containerd",
          description: "Core runtime used by Docker & K8s.",
        },
        {
          id: "runc",
          name: "runc",
          description: "OCI runtime that spawns containers.",
        },
        {
          id: "shim",
          name: "Shim",
          description: "Per-container process supervising the runtime.",
        },
        {
          id: "alt",
          name: "Alt Sandboxes",
          description: "gVisor, Kata for stronger isolation.",
        },
      ],
    },
  ],
};

// Utility: build a pruned tree that only includes children when parent is expanded
function buildVisibleTree(data, expandedIds, depth = 0, alwaysShowDepth = 1) {
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
function idsWithChildren(node, out = new Set()) {
  if (node.children && node.children.length) {
    out.add(node.id);
    node.children.forEach((c) => idsWithChildren(c, out));
  }
  return out;
}

// Compute a smooth cubic path between two points for links
function linkPath(from, to) {
  const x0 = from.x;
  const y0 = from.y;
  const x1 = to.x;
  const y1 = to.y;
  const mx = (y0 + y1) / 2;
  return `M ${y0},${x0} C ${mx},${x0} ${mx},${x1} ${y1},${x1}`;
}

// Tailwind-friendly button
function TB({ onClick, title, children }) {
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

const Docker = () => {
  // Expanded nodes: start with root expanded so first-level children show
  const [expanded, setExpanded] = useState(new Set(["docker"]));

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
  const [selected, setSelected] = useState(null);

  const containerRef = useRef(null);
  const dims = useContainerSize(containerRef);

  const visibleData = useMemo(() => {
    return buildVisibleTree(DOCKER_TAXONOMY, expanded, 0, 1);
  }, [expanded]);

  // Layout the visible tree
  const { nodes, links } = useMemo(() => {
    const width = Math.max(dims.width - 24, 640);
    const height = Math.max(dims.height - 120, 560);

    const root = hierarchy(visibleData);

    const treeLayout = d3tree()
      .nodeSize([56, 200])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.25));

    const laid = treeLayout(root);

    const nodes = laid.descendants().map((d) => ({
      id: d.data.id,
      name: d.data.name,
      description: d.data.description,
      depth: d.depth,
      x: d.x + height / 2, // center vertically
      y: d.y + 140, // left padding
      hasChildren: d.data.children && d.data.children.length > 0,
      data: d.data,
    }));

    const nodeById = new Map(nodes.map((n) => [n.id, n]));

    const links = laid.links().map((l) => ({
      source: nodeById.get(l.source.data.id),
      target: nodeById.get(l.target.data.id),
    }));

    return { nodes, links };
  }, [visibleData, dims.width, dims.height]);

  // Fit-to-screen initially
  const hasFitRef = useRef(false);
  useEffect(() => {
    if (!hasFitRef.current) {
      fitToScreen();
      hasFitRef.current = true;
    }
  }, [nodes.length, dims.width, dims.height]);

  function fitToScreen() {
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
  }

  function zoom(delta) {
    setScale((s) => Math.max(0.3, Math.min(2.2, s + delta)));
  }

  // Drag to pan
  const dragState = useRef({ dragging: false, x: 0, y: 0, tx: 0, ty: 0 });
  function onPointerDown(e) {
    dragState.current = {
      dragging: true,
      x: e.clientX,
      y: e.clientY,
      tx,
      ty,
    };
  }
  function onPointerMove(e) {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.x;
    const dy = e.clientY - dragState.current.y;
    setTx(dragState.current.tx + dx);
    setTy(dragState.current.ty + dy);
  }
  function onPointerUp() {
    dragState.current.dragging = false;
  }

  function toggle(id) {
    const hasKidsInFull = !!findNodeById(DOCKER_TAXONOMY, id)?.children?.length;
    if (!hasKidsInFull) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    const all = idsWithChildren(DOCKER_TAXONOMY);
    setExpanded(all);
  }
  function collapseAll() {
    setExpanded(new Set(["docker"]));
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
            Docker Taxonomy (Expanded)
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
            {links.map((l, i) => (
              <path
                key={`link-${i}`}
                d={linkPath(l.source, l.target)}
                className="fill-none stroke-slate-300"
                strokeWidth={2}
              />
            ))}

            {/* Nodes */}
            {nodes.map((n) => (
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

function Node({ node, isExpanded, onHover, onMove, onClick }) {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (hover) onHover(true);
    else onHover(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover]);

  const r = 20;
  const labelPadX = 14;
  const labelPadY = 10;

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
function findNodeById(node, id) {
  if (node.id === id) return node;
  for (const c of node.children || []) {
    const found = findNodeById(c, id);
    if (found) return found;
  }
  return null;
}

// Observe container size
function useContainerSize(ref) {
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

export default Docker;
