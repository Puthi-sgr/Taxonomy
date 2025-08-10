export const LaravelData = {
  id: "laravel",
  name: "Laravel",
  description: "A full-stack PHP framework for modern web apps.",
  children: [
    {
      id: "getting-started",
      name: "Prologue & Getting Started",
      description: "Initial setup, environment, and project bootstrapping.",
      details: {
        commands: [
          "composer create-project laravel/laravel app",
          "cp .env.example .env && php artisan key:generate",
          "php artisan serve",
          "./vendor/bin/sail up -d",
        ],
        tips: [
          "Never commit .env.",
          "Point document root to /public.",
          "Cache config/routes/views in prod.",
        ],
      },
      children: [
        {
          id: "install-config",
          name: "Installation & Configuration",
          description: "Create app, set env, verify PHP extensions.",
          details: {
            commands: [
              "composer create-project",
              "php artisan key:generate",
              "php -m",
            ],
            tips: [
              "Use config() not env() at runtime.",
              "Tune APP_ENV/APP_DEBUG/APP_URL early.",
            ],
          },
        },
        {
          id: "starter-kits",
          name: "Starter Kits & Vite",
          description: "Auth scaffolding and asset bundling setup.",
          details: {
            commands: [
              "composer require laravel/breeze --dev",
              "php artisan breeze:install",
              "npm install && npm run dev",
            ],
            tips: [
              "Breeze minimal; Jetstream feature-rich.",
              "Use @vite for assets, HMR in dev.",
            ],
          },
        },
      ],
    },

    {
      id: "core-architecture",
      name: "Core Architecture Concepts",
      description: "How requests flow and services are wired.",
      details: {
        tips: [
          "Master kernel pipeline before debugging.",
          "Prefer constructor DI for testability.",
        ],
      },
      children: [
        {
          id: "lifecycle",
          name: "Request Lifecycle",
          description:
            "Index.php boots the app, the kernel builds a pipeline, routes resolve, a response is produced, and termination hooks run.",
          details: {
            tips: [
              "Think ‘pipeline’: bootstrap → middleware → route/controller → response → terminate.",
              "Cache config/routes/views in prod to shorten the path.",
            ],
            commands: [
              "php artisan route:list",
              "php artisan config:cache && php artisan route:cache && php artisan view:cache",
            ],
          },
          children: [
            {
              id: "entry-bootstrap",
              name: "Entry & Bootstrap",
              description:
                "public/index.php loads Composer, creates the app, and resolves the HTTP kernel.",
              details: {
                tips: [
                  "Bootstrappers prepare env, config, and exception handling early.",
                ],
              },
            },
            {
              id: "kernel-http",
              name: "HTTP Kernel",
              description:
                "Kernel composes middleware stacks and dispatches the request through the pipeline.",
              details: {
                tips: [
                  "Global middleware applies to every request.",
                  "Groups (‘web’, ‘api’) add context-specific layers.",
                ],
              },
              children: [
                {
                  id: "providers-register",
                  name: "Service Providers: register()",
                  description:
                    "Bindings and singletons are added to the container before handling requests.",
                  details: {
                    tips: ["Defer heavy work; register bindings only."],
                  },
                },
                {
                  id: "providers-boot",
                  name: "Service Providers: boot()",
                  description:
                    "Routes, events, and runtime hooks are wired once the app is ready.",
                  details: {
                    tips: ["Reading config/services happens here safely."],
                  },
                },
              ],
            },
            {
              id: "middleware-pipeline",
              name: "Middleware Pipeline",
              description:
                "Request passes through global, group, and route middleware before reaching a route.",
              details: {
                commands: ["php artisan make:middleware CheckSomething"],
                tips: [
                  "Order matters; register in Kernel.",
                  "Use after/terminable middleware for post-response work.",
                ],
              },
              children: [
                {
                  id: "middleware-global",
                  name: "Global Middleware",
                  description:
                    "Runs for all routes (e.g., maintenance mode, trimming, trust proxies).",
                },
                {
                  id: "middleware-groups",
                  name: "Middleware Groups",
                  description:
                    "‘web’ manages sessions/CSRF; ‘api’ handles stateless concerns like throttling.",
                },
                {
                  id: "middleware-route",
                  name: "Route Middleware",
                  description:
                    "Per-route checks (auth, can, throttle) applied selectively.",
                },
                {
                  id: "middleware-terminable",
                  name: "Terminable Middleware",
                  description:
                    "Receives response after send for cleanup or logging.",
                },
              ],
            },
            {
              id: "routing",
              name: "Routing & Resolution",
              description:
                "Router matches method+URI to a route definition and resolves its action.",
              details: {
                commands: ["php artisan route:list"],
                tips: [
                  "Use names for stability and signed routes for sensitive links.",
                ],
              },
              children: [
                {
                  id: "model-binding",
                  name: "Model Binding",
                  description:
                    "Implicitly resolves route parameters to Eloquent models (or custom resolvers).",
                  details: { tips: ["Customize keys via getRouteKeyName()."] },
                },
              ],
            },
            {
              id: "controller-stage",
              name: "Controller & Action",
              description:
                "Container injects dependencies; the action executes domain logic.",
              details: {
                commands: [
                  "php artisan make:controller PostController --invokable",
                  "php artisan make:request StorePostRequest",
                ],
                tips: ["Keep controllers thin; push logic to services."],
              },
              children: [
                {
                  id: "formrequest-validation",
                  name: "FormRequest Validation",
                  description:
                    "FormRequest resolves, authorizes, and validates before the action body runs.",
                  details: {
                    tips: ["Centralize rules and messages for reuse."],
                  },
                },
                {
                  id: "authorization-gates-policies",
                  name: "Authorization (Gates/Policies)",
                  description:
                    "Policies/gates check abilities at model or action level.",
                  details: {
                    tips: ["Guard routes with can middleware where possible."],
                  },
                },
              ],
            },
            {
              id: "response-building",
              name: "Response Building",
              description:
                "Action returns View/JSON/Redirect/Stream; kernel prepares a standardized Response.",
              details: {
                commands: [
                  "return response()->json([...])",
                  "return view('posts.index', $data)",
                  "return redirect()->route('home')",
                ],
                tips: ["Prefer API Resources to shape JSON payloads."],
              },
            },
            {
              id: "view-rendering",
              name: "View Rendering (Blade/Vite)",
              description:
                "Blade compiles templates; Vite-built assets are referenced with @vite.",
              details: {
                tips: ["Cache views in prod: php artisan view:cache."],
              },
            },
            {
              id: "response-send",
              name: "Send Response & After Middleware",
              description:
                "Response is emitted to client; after middleware may mutate headers or log.",
              details: {
                tips: ["Avoid heavy work here; queue IO-heavy tasks."],
              },
            },
            {
              id: "exceptions",
              name: "Exception Handling",
              description:
                "Handler renders errors; report() logs or sends to Sentry; custom render for APIs.",
              details: {
                tips: [
                  "Map domain exceptions to HTTP codes.",
                  "Hide sensitive data; disable debug in prod.",
                ],
                commands: ["php artisan make:exception DomainException"],
              },
            },
            {
              id: "termination",
              name: "Termination",
              description:
                "Kernel → middleware terminate hooks run; session/cookies are persisted.",
              details: {
                tips: ["Use terminate() for short post-send tasks only."],
              },
            },
            {
              id: "events-hooks",
              name: "Framework Events",
              description:
                "Core events (e.g., RequestHandled) fire for auditing and instrumentation.",
              details: {
                tips: [
                  "Listen to events for metrics without coupling to controllers.",
                ],
              },
            },
            {
              id: "queues-async",
              name: "Queues & Async Side-Effects",
              description:
                "Jobs/mail/notifications triggered during the request are queued for workers.",
              details: {
                tips: [
                  "Keep request fast; push heavy work to queues.",
                  "Monitor with Horizon when using Redis.",
                ],
                commands: ["php artisan queue:work", "php artisan horizon"],
              },
            },
            {
              id: "console-lifecycle",
              name: "Console Lifecycle (Artisan)",
              description:
                "Console kernel boots providers, resolves a command, executes, and exits with code.",
              details: {
                tips: [
                  "One cron entry triggers the scheduler to run due tasks.",
                ],
              },
              children: [
                {
                  id: "console-entry",
                  name: "Entry",
                  description:
                    "artisan.php boots the app and resolves the Console kernel.",
                },
                {
                  id: "console-kernel-boot",
                  name: "Console Kernel Boot",
                  description:
                    "Registers commands and schedule in Console\\Kernel.",
                },
                {
                  id: "console-exec",
                  name: "Command Resolve & Execute",
                  description:
                    "Container injects dependencies; command handles IO and returns exit code.",
                  details: {
                    commands: [
                      "php artisan app:sync",
                      "php artisan schedule:run",
                    ],
                    tips: [
                      "Test with artisan() helpers; avoid long blocking IO.",
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          id: "container",
          name: "Service Container (IoC/DI)",
          description: "Central dependency resolver and binding registry.",
          details: {
            commands: ["app()->bind()", "app()->singleton()"],
            tips: [
              "Type-hint interfaces; bind implementations.",
              "Avoid manual container lookups inside domain.",
            ],
          },
        },
        {
          id: "providers",
          name: "Service Providers",
          description: "Bootstrapping points for bindings and events.",
          details: {
            tips: [
              "Put bindings in register(); runtime in boot().",
              "Keep provider logic idempotent/light.",
            ],
          },
        },
        {
          id: "facades-contracts",
          name: "Facades & Contracts",
          description: "Static-like proxies and framework interfaces.",
          details: {
            tips: [
              "Great DX; test with dependency injection.",
              "Packages should program to contracts.",
            ],
          },
        },
      ],
    },

    {
      id: "http-basics",
      name: "The Basics (HTTP Layer)",
      description: "Routing, controllers, requests, responses, and views.",
      children: [
        {
          id: "routing",
          name: "Routing & Model Binding",
          description: "Define endpoints and auto-resolve models.",
          details: {
            commands: [
              "Route::get()",
              "Route::resource()",
              "php artisan route:list",
            ],
            tips: [
              "Use named routes for stability.",
              "Customize keys via getRouteKeyName().",
            ],
          },
        },
        {
          id: "middleware",
          name: "Middleware",
          description: "Request/response filters and cross-cutting concerns.",
          details: {
            commands: ["php artisan make:middleware Foo"],
            tips: [
              "Register correctly in kernel.",
              "Use after middleware sparingly.",
            ],
          },
        },
        {
          id: "controllers",
          name: "Controllers",
          description: "Organize request handlers and actions.",
          details: {
            commands: [
              "php artisan make:controller PostController",
              "php artisan make:controller --resource",
              "php artisan make:controller --invokable",
            ],
            tips: ["Keep methods thin; push logic to services."],
          },
        },
        {
          id: "requests-responses",
          name: "Requests, Validation & Responses",
          description: "Input handling, validation rules, and outputs.",
          details: {
            commands: [
              "php artisan make:request StorePostRequest",
              "return response()->json(...)",
              "return response()->streamDownload(...)",
            ],
            tips: [
              "Prefer FormRequest for reuse.",
              "Use bail/sometimes for complex flows.",
            ],
          },
        },
        {
          id: "views-blade",
          name: "Views & Blade",
          description: "Server-side templating with components and slots.",
          details: {
            commands: [
              "@extends",
              "@section",
              "<x-component />",
              "@vite([...])",
            ],
            tips: [
              "Use components for reuse.",
              "Stacks manage per-page scripts.",
            ],
          },
        },
        {
          id: "urls-sessions-errors",
          name: "URLs, Sessions, Errors & Logging",
          description: "Link generation, session state, and observability.",
          details: {
            commands: [
              "route('name')",
              "session()->flash()",
              "logger()->info(...)",
            ],
            tips: [
              "Use signed URLs for sensitive flows.",
              "Tune logging level per environment.",
            ],
          },
        },
      ],
    },

    {
      id: "frontend-integration",
      name: "Frontend Integration",
      description: "Ways to pair UI with Laravel backends.",
      children: [
        {
          id: "vite",
          name: "Vite Bundling",
          description: "ES module bundler for JS/CSS assets.",
          details: {
            commands: [
              "npm run dev",
              "npm run build",
              "@vite(['resources/js/app.js'])",
            ],
            tips: [
              "Enable code-splitting for size.",
              "Configure HMR behind proxies.",
            ],
          },
        },
        {
          id: "livewire",
          name: "Livewire",
          description: "Server-driven components without a SPA.",
          details: {
            commands: ["composer require livewire/livewire"],
            tips: [
              "Debounce inputs to reduce chatter.",
              "Great for CRUD dashboards.",
            ],
          },
        },
        {
          id: "inertia",
          name: "Inertia",
          description: "SPA experience using classic server routing.",
          details: {
            tips: [
              "Share data via Inertia::share() prudently.",
              "Choose React/Vue/Svelte per team.",
            ],
          },
        },
        {
          id: "folio",
          name: "Folio (File-based Routing)",
          description: "Pages mapped directly from view files.",
          details: {
            tips: [
              "Keep pages in resources/views/pages.",
              "Good for content-heavy sites.",
            ],
          },
        },
      ],
    },

    {
      id: "security",
      name: "Security",
      description: "Authn/z, crypto, CSRF, and abuse protections.",
      children: [
        {
          id: "auth",
          name: "Authentication",
          description: "Identify users via guards and providers.",
          details: {
            tips: ["Starter kits speed up secure auth flows."],
          },
        },
        {
          id: "authorization",
          name: "Authorization (Gates & Policies)",
          description: "Check permissions at model or ability level.",
          details: {
            commands: ["php artisan make:policy PostPolicy --model=Post"],
            tips: ["Use can middleware and @can in Blade."],
          },
        },
        {
          id: "crypto",
          name: "Hashing & Encryption",
          description: "Password hashing and secure value storage.",
          details: {
            commands: [
              "Hash::make()",
              "Crypt::encryptString()/decryptString()",
            ],
            tips: [
              "Prefer Argon2id for passwords.",
              "Plan before rotating APP_KEY.",
            ],
          },
        },
        {
          id: "csrf-rate",
          name: "CSRF & Rate Limiting",
          description: "Request forgery defense and traffic control.",
          details: {
            tips: [
              "Always include @csrf in forms.",
              "Define custom RateLimiter buckets.",
            ],
          },
        },
      ],
    },

    {
      id: "api-auth",
      name: "API Auth & Identity",
      description: "Token-based auth and social identity providers.",
      children: [
        {
          id: "sanctum",
          name: "Sanctum",
          description: "SPA cookie auth and personal access tokens.",
          details: {
            commands: [
              "composer require laravel/sanctum",
              'php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"',
              "php artisan migrate",
            ],
            tips: [
              "Configure stateful domains for SPAs.",
              "Use abilities to scope tokens.",
            ],
          },
        },
        {
          id: "passport",
          name: "Passport (OAuth2)",
          description: "First-party OAuth2 authorization server.",
          details: {
            commands: [
              "composer require laravel/passport",
              "php artisan migrate",
              "php artisan passport:install",
            ],
            tips: ["Pick grants that match your clients."],
          },
        },
        {
          id: "socialite",
          name: "Socialite",
          description: "OAuth login for social providers.",
          details: {
            commands: ["composer require laravel/socialite"],
            tips: [
              "Persist provider IDs and emails.",
              "Use stateless() for pure APIs.",
            ],
          },
        },
      ],
    },

    {
      id: "data-eloquent",
      name: "Database & Eloquent",
      description: "Schema changes, querying, and ORM modeling.",
      children: [
        {
          id: "migrations",
          name: "Migrations",
          description: "Version-controlled schema changes.",
          details: {
            commands: [
              "php artisan make:migration",
              "php artisan migrate",
              "php artisan migrate:status",
            ],
            tips: ["Index FKs and search columns."],
          },
        },
        {
          id: "seed-factory",
          name: "Seeding & Factories",
          description: "Generate sample or test data.",
          details: {
            commands: [
              "php artisan make:factory",
              "php artisan make:seeder",
              "php artisan db:seed",
            ],
            tips: ["Use factories in tests for realism."],
          },
        },
        {
          id: "query-builder",
          name: "Query Builder",
          description: "Fluent SQL builder without models.",
          details: {
            commands: [
              "DB::table()",
              "DB::transaction()",
              "->chunk()/->cursor()",
            ],
            tips: ["Wrap multi-write ops in transactions."],
          },
        },
        {
          id: "pagination",
          name: "Pagination",
          description: "Chunk results with page metadata.",
          details: {
            commands: [
              "Model::paginate(15)",
              "->simplePaginate()",
              "->cursorPaginate()",
            ],
            tips: ["Use cursor for infinite scroll stability."],
          },
        },
        {
          id: "redis",
          name: "Redis",
          description: "In-memory store for cache, queues, limits.",
          details: { tips: ["Prefer phpredis ext in production."] },
        },
        {
          id: "eloquent",
          name: "Eloquent ORM",
          description: "ActiveRecord-style models and relations.",
          children: [
            {
              id: "relations",
              name: "Relationships",
              description: "Link models via one/many/polymorphic types.",
              details: {
                commands: [
                  "hasOne/hasMany/belongsTo/belongsToMany",
                  "morphOne/morphMany/morphTo",
                ],
                tips: ["Use pivot models for rich many-to-many."],
              },
            },
            {
              id: "eager",
              name: "Eager Loading",
              description: "Preload relations to avoid N+1 queries.",
              details: {
                commands: ["Model::with()", "->loadMissing()"],
                tips: ["Constrain with() to trim payloads."],
              },
            },
            {
              id: "casts-mutators",
              name: "Casts & Mutators",
              description: "Transform attributes on read/write.",
              details: {
                commands: ["$casts = {...}", "getXAttribute()/setXAttribute()"],
                tips: ["Use custom casts for value objects."],
              },
            },
            {
              id: "scopes",
              name: "Scopes",
              description: "Reusable query constraints.",
              details: {
                commands: ["scopeActive()", "addGlobalScope()"],
                tips: ["Use global scopes sparingly."],
              },
            },
            {
              id: "soft-deletes",
              name: "Soft Deletes",
              description: "Flag rows deleted instead of removing.",
              details: {
                commands: ["use SoftDeletes;", "withTrashed()/onlyTrashed()"],
                tips: ["Index deleted_at for performance."],
              },
            },
            {
              id: "events-observers",
              name: "Events & Observers",
              description: "Model lifecycle hooks and listeners.",
              details: {
                commands: ["php artisan make:observer --model=Post"],
                tips: ["Keep hooks small; queue heavy work."],
              },
            },
            {
              id: "api-resources",
              name: "API Resources & Serialization",
              description: "Transform models to API-friendly shapes.",
              details: {
                commands: ["php artisan make:resource"],
                tips: ["Wrap collections consistently."],
              },
            },
          ],
        },
      ],
    },

    {
      id: "async-realtime",
      name: "Async, Real-time & Background Work",
      description: "Queues, events, broadcasting, and WebSockets.",
      children: [
        {
          id: "queues",
          name: "Queues & Jobs",
          description: "Background processing for heavy tasks.",
          details: {
            commands: [
              "php artisan queue:table && php artisan migrate",
              "php artisan queue:work",
              "php artisan queue:retry all",
            ],
            tips: ["Make jobs idempotent; set backoff/retries."],
          },
        },
        {
          id: "horizon",
          name: "Horizon (Redis queues)",
          description: "Dashboard and supervisor for Redis queues.",
          details: {
            commands: [
              "composer require laravel/horizon",
              "php artisan horizon:install && php artisan migrate",
              "php artisan horizon",
            ],
            tips: ["Run under systemd/supervisord; tag jobs."],
          },
        },
        {
          id: "events",
          name: "Events & Listeners",
          description: "Decouple side-effects with pub/sub.",
          details: {
            commands: ["php artisan make:event", "php artisan make:listener"],
            tips: ["Queue listeners that do IO."],
          },
        },
        {
          id: "broadcasting",
          name: "Broadcasting & WebSockets",
          description: "Real-time messages over channels.",
          details: {
            commands: ["php artisan make:event --broadcast"],
            tips: [
              "Secure private/presence channels.",
              "Use Echo on the client.",
            ],
          },
        },
        {
          id: "reverb",
          name: "Reverb (First-party WebSockets)",
          description: "First-party WebSocket server integration.",
          details: {
            tips: [
              "Pair with broadcasting for WS events.",
              "Scale and secure auth endpoints.",
            ],
          },
        },
      ],
    },

    {
      id: "infra-io",
      name: "Caching, Files & Mail/Notify",
      description: "Data caching, file storage, email, and notifications.",
      children: [
        {
          id: "cache",
          name: "Cache",
          description: "Store computed data for faster reads.",
          details: {
            commands: ["Cache::remember()", "Cache::tags()", "Cache::lock()"],
            tips: ["Invalidate on writes; use atomic locks."],
          },
        },
        {
          id: "filesystem",
          name: "Filesystem",
          description: "Local/cloud storage abstraction.",
          details: {
            commands: ["Storage::put()", "Storage::disk('s3')->temporaryUrl()"],
            tips: ["Set proper visibility/ACL; stream large IO."],
          },
        },
        {
          id: "mail",
          name: "Mail",
          description: "Templated emails and transports.",
          details: {
            commands: ["php artisan make:mail --markdown=..."],
            tips: ["Queue mails; use test mailboxes in non-prod."],
          },
        },
        {
          id: "notifications",
          name: "Notifications",
          description: "Multi-channel user alerts.",
          details: {
            commands: ["php artisan make:notification"],
            tips: ["Use database channel for audit trails."],
          },
        },
      ],
    },

    {
      id: "dev-ux",
      name: "CLI & Developer UX",
      description: "Console tooling, scheduling, prompts, and style.",
      children: [
        {
          id: "artisan",
          name: "Artisan Console",
          description: "CLI for generators and app commands.",
          details: {
            commands: [
              "php artisan list",
              "php artisan tinker",
              "php artisan make:*",
            ],
            tips: ["Use generators to enforce patterns."],
          },
        },
        {
          id: "scheduler",
          name: "Task Scheduling",
          description: "Cron-driven job orchestration.",
          details: {
            commands: [
              "* * * * * php /path/to/artisan schedule:run",
              "$schedule->command('queue:work')->everyMinute()",
            ],
            tips: ["Single cron; use withoutOverlapping()."],
          },
        },
        {
          id: "prompts",
          name: "Prompts (CLI UX)",
          description: "Type-safe, user-friendly CLI input.",
          details: { tips: ["Validate user input at the edge."] },
        },
        {
          id: "pint",
          name: "Pint (Code Style)",
          description: "Opinionated PHP code formatter.",
          details: {
            commands: ["vendor/bin/pint", "vendor/bin/pint --test"],
            tips: ["Run in CI to prevent drift."],
          },
        },
      ],
    },

    {
      id: "http-client-process",
      name: "HTTP Client & Processes",
      description: "Call external APIs and run shell commands.",
      children: [
        {
          id: "http-client",
          name: "HTTP Client",
          description: "Fluent wrapper over Guzzle for requests.",
          details: {
            commands: [
              "Http::get()",
              "Http::retry(5, 100)",
              "Http::pool()",
              "Http::fake()",
            ],
            tips: ["Always set timeouts; validate responses."],
          },
        },
        {
          id: "processes",
          name: "Processes",
          description: "Spawn external processes safely.",
          details: {
            commands: ["Process::run('git --version')"],
            tips: ["Avoid long-running tasks in web requests."],
          },
        },
      ],
    },

    {
      id: "validation-concurrency",
      name: "Validation UX & Concurrency",
      description: "Live validation and parallel task execution.",
      children: [
        {
          id: "precognition",
          name: "Precognition",
          description: "Server-validated forms before submit.",
          details: {
            tips: ["Requires headers/routes; great for SPAs."],
          },
        },
        {
          id: "concurrency",
          name: "Concurrency Facade",
          description: "Run independent tasks in parallel.",
          details: {
            commands: ["Concurrency::run([fn()=>A(), fn()=>B()])"],
            tips: ["Use for IO-bound, independent work."],
          },
        },
      ],
    },

    {
      id: "testing",
      name: "Testing",
      description: "End-to-end testing strategies and tooling.",
      children: [
        {
          id: "philosophy-setup",
          name: "Philosophy & Setup",
          description: "Testing pyramid, determinism, and environment prep.",
          details: {
            commands: [
              "php artisan test",
              "php artisan test --filter=MyTest",
              "php artisan test --coverage",
            ],
            tips: [
              "Keep tests isolated and deterministic.",
              "Use .env.testing; never hit live services.",
              "Favor feature tests for behavior; unit tests for pure logic.",
            ],
          },
        },
        {
          id: "frameworks",
          name: "Test Frameworks",
          description: "PHPUnit and Pest runners and syntax.",
          children: [
            {
              id: "phpunit",
              name: "PHPUnit",
              description: "Default test runner with classic assertions.",
              details: {
                commands: ["vendor/bin/phpunit", "php artisan test"],
                tips: [
                  "Organize by Unit/Feature directories.",
                  "Use data providers for parameterized cases.",
                ],
              },
            },
            {
              id: "pest",
              name: "Pest",
              description: "Expressive, minimal syntax over PHPUnit.",
              details: {
                commands: [
                  "composer require pestphp/pest --dev",
                  "php artisan pest:install",
                ],
                tips: [
                  "Great for concise tests and plugins.",
                  "Still uses PHPUnit underneath.",
                ],
              },
            },
          ],
        },
        {
          id: "running-tests",
          name: "Running Tests",
          description: "CLI flags, filtering, coverage, and profiling.",
          details: {
            commands: [
              "php artisan test --parallel",
              "php artisan test --testsuite=Feature",
              "php artisan test --profile",
            ],
            tips: [
              "--profile surfaces slow tests.",
              "Use Xdebug/PCOV for coverage locally.",
            ],
          },
        },
        {
          id: "env-config",
          name: "Env & Config",
          description: "phpunit.xml, env vars, and logging for tests.",
          details: {
            tips: [
              "Tune phpunit.xml for process isolation when needed.",
              "Set LOG_CHANNEL=stack or null to reduce noise.",
              "Seed minimal data; avoid global fixtures.",
            ],
          },
        },
        {
          id: "db-strategies",
          name: "Database Strategies",
          description: "Choosing RefreshDatabase vs. transactions vs. fresh.",
          children: [
            {
              id: "refresh-db",
              name: "RefreshDatabase",
              description:
                "Migrate once and wrap each test with transactions (when possible).",
              details: {
                tips: [
                  "Fast for most suites; rolls back between tests.",
                  "Works best with a single connection.",
                ],
              },
            },
            {
              id: "database-transactions",
              name: "DatabaseTransactions",
              description:
                "Begin/rollback around each test without re-migrating.",
              details: {
                tips: [
                  "Great for unit-level DB checks.",
                  "Avoid if code opens new connections.",
                ],
              },
            },
            {
              id: "migrate-fresh",
              name: "Migrate Fresh",
              description: "Drop all tables and re-run migrations.",
              details: {
                commands: ["php artisan migrate:fresh --seed"],
                tips: [
                  "Use for suites needing clean slate each run.",
                  "Slower; parallel DBs mitigate cost.",
                ],
              },
            },
            {
              id: "parallel-testing",
              name: "Parallel Testing",
              description: "Run tests concurrently with separate databases.",
              details: {
                commands: [
                  "php artisan test --parallel",
                  "php artisan test --parallel --processes=4",
                  "php artisan test --parallel --recreate-databases",
                ],
                tips: [
                  "Avoid shared resources (files, caches).",
                  "SQLite :memory: is per-process, not shared.",
                ],
              },
            },
          ],
        },
        {
          id: "factories-fixtures",
          name: "Factories & Fixtures",
          description: "Realistic model data and stateful factories.",
          details: {
            commands: [
              "php artisan make:factory PostFactory",
              "Model::factory()->state([...])->create()",
            ],
            tips: [
              "Prefer factories over hand-built fixtures.",
              "Use factory states for variations.",
              "Use WithFaker for randomized inputs.",
            ],
          },
        },
        {
          id: "assertions-db",
          name: "Database Assertions",
          description: "Assert persisted state and soft deletes.",
          details: {
            commands: [
              "assertDatabaseHas('users', [...])",
              "assertDatabaseMissing('orders', [...])",
              "assertSoftDeleted('posts', [...])",
              "assertDatabaseCount('users', 3)",
            ],
            tips: [
              "Assert minimal, meaningful columns.",
              "Prefer IDs over broad payload checks.",
            ],
          },
        },
        {
          id: "http-feature",
          name: "HTTP & Feature Tests",
          description: "Request/response assertions and JSON helpers.",
          details: {
            commands: [
              "get('/api/posts')->assertOk()",
              "postJson('/api', [...])->assertCreated()",
              "assertJsonPath('data.0.id', 1)",
              "assertJsonValidationErrors(['email'])",
            ],
            tips: [
              "Use named routes: get(route('posts.index')).",
              "Assert status, shape, and critical fields.",
            ],
          },
        },
        {
          id: "auth-testing",
          name: "Authentication Testing",
          description: "Simulate users and token flows.",
          children: [
            {
              id: "acting-as",
              name: "actingAs & guards",
              description: "Authenticate test user with chosen guard.",
              details: {
                commands: [
                  "$this->actingAs($user)",
                  "$this->actingAs($admin, 'admin')",
                ],
                tips: ["Create clear user factories for roles."],
              },
            },
            {
              id: "sanctum-acting-as",
              name: "Sanctum actingAs",
              description: "Token-based auth for APIs and SPAs.",
              details: {
                commands: ["Sanctum::actingAs($user, ['*'])"],
                tips: ["Scope abilities to mimic real clients."],
              },
            },
            {
              id: "passport-acting-as",
              name: "Passport actingAs",
              description: "OAuth2 token simulation for Passport apps.",
              details: {
                commands: ["Passport::actingAs($user)"],
                tips: ["Include scopes matching your policies."],
              },
            },
          ],
        },
        {
          id: "authorization-tests",
          name: "Authorization Tests",
          description: "Gates, policies, and forbidden paths.",
          details: {
            commands: [
              "Gate::allows('update', $post)",
              "get(...)->assertForbidden()",
              "get(...)->assertUnauthorized()",
            ],
            tips: [
              "Test policy methods directly and via HTTP.",
              "Use @can in views and assert outcomes.",
            ],
          },
        },
        {
          id: "validation-tests",
          name: "Validation & Form Requests",
          description: "Rule verification and error payload checks.",
          details: {
            commands: [
              "post('/users', [...])->assertSessionHasErrors('email')",
              "assertInvalid(['email' => 'The email field ...'])",
            ],
            tips: [
              "Prefer testing via endpoints using FormRequests.",
              "Custom rules: test valid and invalid datasets.",
            ],
          },
        },
        {
          id: "file-upload-storage",
          name: "File Uploads & Storage",
          description: "Fake disks and assert file operations.",
          details: {
            commands: [
              "Storage::fake('s3')",
              "UploadedFile::fake()->image('avatar.jpg')",
              "Storage::disk('s3')->assertExists('avatars/1.jpg')",
            ],
            tips: [
              "Never hit real cloud disks in tests.",
              "Stream large files in production code; fake in tests.",
            ],
          },
        },
        {
          id: "queues-jobs",
          name: "Queues & Jobs",
          description: "Dispatch, chain, batch, and assert queue behavior.",
          details: {
            commands: [
              "Queue::fake()",
              "Bus::fake()",
              "Bus::assertDispatched(SomeJob::class)",
              "Bus::assertChained([...])",
            ],
            tips: [
              "Make jobs idempotent and assert retries/backoff.",
              "Use tags and assert on tagged batches when relevant.",
            ],
          },
        },
        {
          id: "events-listeners",
          name: "Events & Listeners",
          description: "Publish/subscribe flow and broadcast checks.",
          details: {
            commands: [
              "Event::fake()",
              "Event::assertDispatched(OrderPlaced::class)",
            ],
            tips: [
              "Keep listeners small; mark as ShouldQueue if IO heavy.",
              "For broadcasts, assert channel names and payloads.",
            ],
          },
        },
        {
          id: "mail",
          name: "Mail",
          description: "Fake transports and assert mailable content.",
          details: {
            commands: ["Mail::fake()", "Mail::assertSent(InvoiceMail::class)"],
            tips: [
              "Use Markdown mail for stable snapshots.",
              "Queue mail in app code; assert queued in tests.",
            ],
          },
        },
        {
          id: "notifications",
          name: "Notifications",
          description: "Assert recipients and channels.",
          details: {
            commands: [
              "Notification::fake()",
              "Notification::assertSentTo($user, OrderShipped::class)",
            ],
            tips: [
              "Prefer database channel for audit trails.",
              "Assert not-sent for negative paths.",
            ],
          },
        },
        {
          id: "http-client-tests",
          name: "HTTP Client",
          description: "Fake external APIs and assert requests.",
          details: {
            commands: [
              "Http::fake(['*' => Http::response([...], 200)])",
              "Http::assertSent(fn($req)=>...)",
              "Http::fakeSequence()->push(...)->pushStatus(500)",
            ],
            tips: [
              "Set timeouts and retries in app code.",
              "Use sequences to simulate flakiness.",
            ],
          },
        },
        {
          id: "process-tests",
          name: "Process Facade",
          description: "Test shell invocations safely.",
          details: {
            commands: ["Process::run('git --version')->successful()"],
            tips: [
              "Prefer wrapping process calls; assert command building.",
              "Avoid invoking real binaries in CI.",
            ],
          },
        },
        {
          id: "time-helpers",
          name: "Time Travel",
          description: "Freeze/shift time to test scheduling and TTLs.",
          details: {
            commands: [
              "$this->travelTo(now())",
              "$this->travel(10)->minutes()",
              "$this->freezeTime()",
            ],
            tips: [
              "Reset time after test; helpers auto-clean per test.",
              "Great for cache expiry and rate limits.",
            ],
          },
        },
        {
          id: "middleware-tests",
          name: "Middleware Tests",
          description: "Assert request filters and side-effects.",
          details: {
            tips: [
              "Test middleware in isolation with a dummy route.",
              "Use withoutMiddleware() to isolate controllers.",
            ],
          },
        },
        {
          id: "console-tests",
          name: "Console & Prompts",
          description: "Test artisan commands and interactive prompts.",
          details: {
            commands: [
              "$this->artisan('app:sync')->expectsOutput('Done')->assertExitCode(0)",
              "$this->artisan('app:setup')->expectsQuestion('Continue?', 'yes')",
            ],
            tips: [
              "Test success and failure codes.",
              "Mock external processes your command triggers.",
            ],
          },
        },
        {
          id: "dusk",
          name: "Dusk (Browser E2E)",
          description: "End-to-end UI automation in a real browser.",
          children: [
            {
              id: "dusk-basics",
              name: "Basics",
              description: "Start, selectors, asserts, and auth.",
              details: {
                commands: [
                  "php artisan dusk:install",
                  "php artisan dusk",
                  "$browser->loginAs($user)->visit('/')->assertSee('Dashboard')",
                ],
                tips: [
                  "Use page objects and components.",
                  "Take screenshots on failures for debugging.",
                ],
              },
            },
            {
              id: "dusk-interactions",
              name: "Interactions",
              description: "Forms, uploads, drag/drop, modals, waits.",
              details: {
                commands: [
                  "$browser->type('email','a@b.com')->press('Submit')",
                  "$browser->attach('avatar', __DIR__.'/avatar.jpg')",
                  "$browser->waitForText('Saved')",
                ],
                tips: [
                  "Prefer explicit waits (waitFor*) over sleeps.",
                  "Seed stable data; avoid random flakiness.",
                ],
              },
            },
            {
              id: "dusk-ci",
              name: "CI Setup",
              description: "Headless runs and artifacts.",
              details: {
                tips: [
                  "Run headless Chrome in CI.",
                  "Upload screenshots/videos as artifacts.",
                ],
              },
            },
          ],
        },
        {
          id: "organization",
          name: "Organization & Naming",
          description: "Structure suites and test names for intent.",
          details: {
            tips: [
              "One behavior per test; clear names (it_… in Pest).",
              "Group by feature/domain rather than controllers.",
            ],
          },
        },
        {
          id: "mocking-spies",
          name: "Mocking & Spies",
          description: "Replace collaborators and assert interactions.",
          details: {
            tips: [
              "Use fakes when available (Mail, Queue, Event, Http, Storage).",
              "For others, use Mockery or interface-driven DI.",
            ],
          },
        },
        {
          id: "ci-integration",
          name: "CI Integration",
          description: "Automate tests on push/PR with caches and artifacts.",
          details: {
            commands: [
              "php artisan test --parallel --coverage --min=90",
              "vendor/bin/pint --test",
            ],
            tips: [
              "Cache composer/npm deps to speed CI.",
              "Fail builds on style/test regressions.",
            ],
          },
        },
        {
          id: "performance-tips",
          name: "Performance Tips",
          description: "Keep the suite fast and reliable.",
          details: {
            tips: [
              "Prefer factories over seeders in tests.",
              "Avoid hitting network/cloud; use fakes.",
              "Profile slow tests and fix hotspots.",
            ],
          },
        },
        {
          id: "assertion-toolkit",
          name: "Assertion Toolkit",
          description: "Common, high-signal assertions.",
          details: {
            commands: [
              "assertOk()/assertCreated()/assertNoContent()",
              "assertJson()/assertJsonPath()/assertExactJson()",
              "assertRedirect()/assertSessionHas()/assertSessionHasErrors()",
              "assertDatabaseHas()/assertSoftDeleted()",
            ],
            tips: [
              "Assert only what matters; avoid brittle full-payload asserts.",
              "Combine status + shape + side-effect checks.",
            ],
          },
        },
      ],
    },

    {
      id: "observability-performance",
      name: "Observability & Performance",
      description: "Debugging tools and runtime optimization.",
      children: [
        {
          id: "telescope",
          name: "Telescope",
          description: "Requests, queries, jobs, and log inspector.",
          details: {
            commands: [
              "composer require laravel/telescope --dev",
              "php artisan telescope:install && php artisan migrate",
              "php artisan serve",
            ],
            tips: ["Protect non-local access; consider sampling."],
          },
        },
        {
          id: "pulse",
          name: "Pulse",
          description: "Performance and usage insights dashboard.",
          details: { tips: ["Watch queue latency and cache hit-rate."] },
        },
        {
          id: "octane",
          name: "Octane (Performance Runtime)",
          description: "Long-lived workers via Swoole/RoadRunner.",
          details: {
            commands: [
              "composer require laravel/octane",
              "php artisan octane:install",
              "php artisan octane:start",
            ],
            tips: ["Ensure worker-safe code; no per-request globals."],
          },
        },
      ],
    },

    {
      id: "search-indexing",
      name: "Search & Indexing",
      description: "Full-text syncing between models and engines.",
      children: [
        {
          id: "scout",
          name: "Scout",
          description: "Model syncing to Algolia/Meilisearch/Typesense.",
          details: {
            commands: [
              "composer require laravel/scout",
              'php artisan scout:import "App\\Models\\Post"',
            ],
            tips: ["Keep payloads small; use queues for indexing."],
          },
        },
      ],
    },

    {
      id: "local-dev",
      name: "Local Dev Environments",
      description: "Official options for consistent local stacks.",
      children: [
        {
          id: "sail",
          name: "Sail (Docker)",
          description: "Dockerized environment for Laravel projects.",
          details: {
            commands: [
              "php artisan sail:install",
              "./vendor/bin/sail up -d",
              "./vendor/bin/sail artisan migrate",
            ],
            tips: ["Mirror prod services to reduce surprises."],
          },
        },
        {
          id: "valet",
          name: "Valet (macOS)",
          description: "Lightweight Nginx + PHP dev for macOS.",
          details: {
            commands: ["valet install", "valet link", "valet secure"],
            tips: ["Great for small apps and quick demos."],
          },
        },
        {
          id: "homestead",
          name: "Homestead (VM)",
          description: "Vagrant-based, OS-agnostic dev box.",
          details: {
            commands: ["vagrant up", "vagrant ssh"],
            tips: ["Sync config with Homestead.yaml."],
          },
        },
      ],
    },

    {
      id: "deploy-ops",
      name: "Deployment & Ops",
      description: "Build, runtime workers, and platform choices.",
      children: [
        {
          id: "build-optimize",
          name: "Build & Optimize",
          description: "Prepare artifacts and cache metadata.",
          details: {
            commands: [
              "php artisan migrate --force",
              "php artisan config:cache route:cache view:cache event:cache",
              "npm run build",
            ],
            tips: ["Run storage:link; fail fast on migrations."],
          },
        },
        {
          id: "runtime",
          name: "Runtime (Workers & Scheduler)",
          description: "Queues, horizon, and scheduled tasks.",
          details: {
            commands: [
              "php artisan queue:work --sleep=1 --tries=3",
              "php artisan horizon",
              "cron: * * * * * php artisan schedule:run",
            ],
            tips: ["Supervise workers; right-size concurrency."],
          },
        },
        {
          id: "platforms",
          name: "Platforms (Forge, Envoyer, Vapor)",
          description: "Provisioning, zero-downtime deploys, serverless.",
          details: {
            tips: [
              "Forge: provision+deploy hooks.",
              "Envoyer: atomic symlink releases.",
              "Vapor: AWS serverless; design stateless.",
            ],
          },
        },
      ],
    },

    {
      id: "first-party-packages",
      name: "First-Party & Notable Packages",
      description: "Official packages that extend core capabilities.",
      children: [
        {
          id: "cashier",
          name: "Cashier (Stripe/Paddle)",
          description: "Subscriptions, invoices, and payments.",
          details: { tips: ["Queue webhooks; handle proration."] },
        },
        {
          id: "pennant",
          name: "Pennant (Feature Flags)",
          description: "Conditional features and gradual rollouts.",
          details: { tips: ["Segment by user or percentage."] },
        },
        {
          id: "envoy",
          name: "Envoy (SSH Tasks)",
          description: "Blade-like remote task runner.",
          details: {
            commands: ["vendor/bin/envoy run deploy"],
            tips: ["Script simple deploys in Envoy.blade.php."],
          },
        },
        {
          id: "dusk-pkg",
          name: "Dusk",
          description: "Browser automation for E2E tests.",
          details: { tips: ["See Testing > Dusk for commands."] },
        },
        {
          id: "pint-pkg",
          name: "Pint",
          description: "Code style tool for consistent formatting.",
          details: { tips: ["Run pre-commit and in CI."] },
        },
      ],
    },

    {
      id: "package-dev",
      name: "Package Development",
      description: "Author reusable libraries with providers/config.",
      details: {
        commands: [
          "composer init",
          "composer require orchestra/testbench --dev",
          "php artisan vendor:publish",
        ],
        tips: [
          "Expose a ServiceProvider and config stub.",
          "Avoid work in global scope.",
          "Keep API minimal and tested.",
        ],
      },
    },
  ],
};
