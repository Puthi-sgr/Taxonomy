export const DockerData = {
  id: "docker",
  name: "Docker",
  description:
    "Docker is a platform to build, ship, and run apps in lightweight containers, backed by images.",
  details: {
    commands: ["docker version", "docker info", "docker context ls"],
    tips: [
      "Use contexts to target remote engines.",
      "Prefer BuildKit for cache-efficient builds.",
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
          "docker inspect app:1",
          "docker buildx build --platform linux/amd64,linux/arm64 -t app:multi .",
        ],
        tips: [
          "Pin base images by digest for repeatability.",
          "Use multi-stage builds to keep final images small.",
        ],
      },
      children: [
        {
          id: "layers",
          name: "Layers",
          description:
            "Each image is a stack of read‑only layers (copy-on-write). Cache reuses unchanged steps.",
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
          "Use `.dockerignore` to keep the build context small.",
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
        ],
      },
      children: [
        {
          id: "lifecycle",
          name: "Lifecycle",
          description:
            "Create → Start → Running → Stop/Exit → Remove; also Paused & Restarted states.",
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
            "local (default), nfs, smb, and cloud providers via plugins.",
        },
        {
          id: "backup",
          name: "Backup/Restore",
          description: "Snapshot/restore volume contents with tar or tools.",
        },
      ],
    },
    {
      id: "networks",
      name: "Networks",
      description:
        "Connectivity via drivers, subnets, IPAM, and DNS-based discovery.",
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
        "YAML to define multi-container apps; `docker compose up` manages lifecycle.",
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
        "Stores and serves images (push/pull). Examples: Docker Hub, GHCR, Harbor, private registry.",
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
          description: "Login, tokens, signing, policies.",
        },
        {
          id: "caches",
          name: "Caches/Proxies",
          description: "Mirrors/pull-through caches.",
        },
      ],
    },
    {
      id: "orchestration",
      name: "Orchestration",
      description:
        "Run containers across many machines with schedulers, health checks, and service discovery.",
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
              description: "Batch size, delay, rollback.",
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
              id: "deployments",
              name: "Deployments",
              description: "Declarative rollout/rollback.",
            },
            {
              id: "services-k8s",
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
              description: "Base64 encoded; secure with KMS.",
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
