# Developer Basics — Site Map & Knowledge Index

> Auto-generated from `src/lessons/meta.ts`. Run `bun run sitemap` to refresh.

An interactive course with **14 modules** and **123 chapters**.
Student and teacher experiences share the same curriculum; the sidebar switcher
is persisted in `localStorage` (`devbasics.experience`).

## Features

- **Progress** — chapter read state, quiz answers, and capstone steps in IndexedDB
- **Search** — `Ctrl+K` / `⌘K` global search with section deep links (`?section=`)
- **Themes** — 30+ editor palettes plus a System option (`prefers-color-scheme`)
- **Classroom mode** — simplified layout for teaching
- **Capstone** — guided task-tracker path linking SQL, API, React, auth, tests, deploy

## Routes

| Route | Description |
| --- | --- |
| `/` | Home — modules, beginner path, capstone |
| `/lessons/:topic` | Interactive lesson or teacher lesson plan |

Routing uses `HashRouter` (GitHub Pages friendly). Lesson sections can be linked
with query params, e.g. `/#/lessons/process?section=hood`.

## Modules

### 🧱 Foundations (8 chapters)

The building blocks every program is made of: variables, control flow, data, encoding, memory, time, and failure.

Chapter ids: `variables, controlflow, data, json, floatingpoint, memory, time, errors`

### 🖥️ Systems & the OS (5 chapters)

How your code actually runs on a real machine and shares its resources.

Chapter ids: `filesystem, process, concurrency, compute, docker`

### 🧮 Data Structures & Algorithms (5 chapters)

Organize data well, search it efficiently, and reason about whether your code stays fast at scale.

Chapter ids: `datastructures, algorithms, search, recursion, trees`

### 🗃️ Databases & Persistence (7 chapters)

Why apps store data outside memory — models, ACID, and choosing SQL vs documents.

Chapter ids: `databases-intro, databases-architecture, databases-models, databases-acid, databases-schemas, databases-choosing, databases-hood`

### 🗄️ SQL & Relational Databases (14 chapters)

Tables, queries, joins, connectors, and a live SQLite playground.

Chapter ids: `sql-intro, sql-tables, sql-schema, sql-writes, sql-indexes, sql-transactions, sql-advanced, sql-conn-sqlite, sql-conn-postgres, sql-conn-pool, sql-conn-orm, sql-playground, sql-labs, sql-hood`

### 🍃 MongoDB & Documents (12 chapters)

Flexible documents, aggregation pipelines, PyMongo, and Motor.

Chapter ids: `mongodb-intro, mongodb-documents, mongodb-queries, mongodb-writes, mongodb-aggregation, mongodb-conn-pymongo, mongodb-conn-uri, mongodb-conn-motor, mongodb-conn-odm, mongodb-playground, mongodb-labs, mongodb-hood`

### 💾 Caching & Queues (2 chapters)

Trade memory for speed with caches, and decouple services with message queues.

Chapter ids: `caching, queues`

### 🌐 Networking & the Web (12 chapters)

HTTP, DNS, TLS, load balancing, reverse proxies, API gateways, and rate limits.

Chapter ids: `network, js-fundamentals, http-clients, browser-rendering, loadbalancing, apis, auth, web-reverse-proxy, web-nginx-routing, web-api-gateway, web-rate-limiting, web-edge-stack`

### 🎨 CSS & Layout (8 chapters)

The tricky parts new developers hit — box model, flex/grid layout, position, overflow, themes, and cascade.

Chapter ids: `css-intro, css-box-model, css-layout, css-position, css-overflow, css-themes, css-cascade, css-hacks`

### ⚡ FastAPI (15 chapters)

Build modern Python HTTP APIs — routes, validation, dependencies, async, and CORS.

Chapter ids: `fastapi-intro, fastapi-routes-basics, fastapi-routes-crud, fastapi-models-request, fastapi-models-response, fastapi-params-path, fastapi-params-query, fastapi-params-body, fastapi-deps-database, fastapi-deps-auth, fastapi-errors, fastapi-hood-asgi, fastapi-hood-openapi, fastapi-hood-cors, fastapi-hood-stack`

### ⚛️ React (19 chapters)

Interactive UIs with components, state, hooks, Context, and external stores.

Chapter ids: `react-intro, react-jsx-basics, react-jsx-rules, react-props, react-state, react-events, react-lists, react-effects, react-store-lift, react-store-context, react-store-patterns, react-store-external, react-store-choosing, react-lab-counter, react-lab-props, react-lab-lists, react-hood-vdom, react-hood-hooks, react-hood-stack`

### 🔐 Security & Cryptography (2 chapters)

Protect data and users — from hashing fundamentals to everyday defenses.

Chapter ids: `crypto, security`

### 🛠️ Tooling & Workflow (9 chapters)

The everyday craft of shipping code: the shell, version control, tests, and debugging.

Chapter ids: `cli, git, git-advanced, package-managers, env-config, regex, testing, cicd, debugging`

### 🎨 Programming & Design (5 chapters)

Structure code that other people (including future you) can actually maintain.

Chapter ids: `classes, oop, patterns, functional, capstone`

## Chapter index

| Module | Title | Path | Level | Minutes |
| --- | --- | --- | --- | --- |
| Foundations | Variables & Types | `/lessons/variables` | Beginner | 15 |
| Foundations | Control Flow & Logic | `/lessons/controlflow` | Beginner | 17 |
| Foundations | Data & Encoding | `/lessons/data` | Beginner | 16 |
| Foundations | JSON & Serialization | `/lessons/json` | Beginner | 16 |
| Foundations | Floating Point & Precision | `/lessons/floatingpoint` | Beginner | 16 |
| Foundations | Memory: Stack & Heap | `/lessons/memory` | Intermediate | 27 |
| Foundations | Time, Dates & Timezones | `/lessons/time` | Beginner | 18 |
| Foundations | Errors & Exceptions | `/lessons/errors` | Beginner | 16 |
| Systems & the OS | The Filesystem | `/lessons/filesystem` | Beginner | 17 |
| Systems & the OS | Processes & the CPU | `/lessons/process` | Beginner | 19 |
| Systems & the OS | Concurrency & Races | `/lessons/concurrency` | Intermediate | 28 |
| Systems & the OS | Compute Instances | `/lessons/compute` | Intermediate | 18 |
| Systems & the OS | Docker for Developers | `/lessons/docker` | Intermediate | 16 |
| Data Structures & Algorithms | Data Structures | `/lessons/datastructures` | Intermediate | 22 |
| Data Structures & Algorithms | Algorithms & Big-O | `/lessons/algorithms` | Intermediate | 22 |
| Data Structures & Algorithms | Searching & Binary Search | `/lessons/search` | Beginner | 17 |
| Data Structures & Algorithms | Recursion | `/lessons/recursion` | Beginner | 20 |
| Data Structures & Algorithms | Trees & Graphs | `/lessons/trees` | Intermediate | 19 |
| Databases & Persistence | Why databases | `/lessons/databases-intro` | Beginner | 4 |
| Databases & Persistence | Clients, servers & drivers | `/lessons/databases-architecture` | Beginner | 5 |
| Databases & Persistence | Data models | `/lessons/databases-models` | Beginner | 5 |
| Databases & Persistence | ACID & transactions | `/lessons/databases-acid` | Beginner | 5 |
| Databases & Persistence | Schema design | `/lessons/databases-schemas` | Beginner | 5 |
| Databases & Persistence | SQL vs MongoDB | `/lessons/databases-choosing` | Beginner | 5 |
| Databases & Persistence | Replication & backups | `/lessons/databases-hood` | Beginner | 5 |
| SQL & Relational Databases | Why SQL | `/lessons/sql-intro` | Beginner | 4 |
| SQL & Relational Databases | Tables & queries | `/lessons/sql-tables` | Beginner | 5 |
| SQL & Relational Databases | Schema, keys & relationships | `/lessons/sql-schema` | Beginner | 5 |
| SQL & Relational Databases | Insert, update & delete | `/lessons/sql-writes` | Beginner | 4 |
| SQL & Relational Databases | Indexes & query performance | `/lessons/sql-indexes` | Beginner | 5 |
| SQL & Relational Databases | Transactions & isolation | `/lessons/sql-transactions` | Beginner | 5 |
| SQL & Relational Databases | Joins, aggregates & subqueries | `/lessons/sql-advanced` | Beginner | 5 |
| SQL & Relational Databases | SQLite & sqlite3 | `/lessons/sql-conn-sqlite` | Beginner | 5 |
| SQL & Relational Databases | PostgreSQL drivers | `/lessons/sql-conn-postgres` | Beginner | 4 |
| SQL & Relational Databases | Connection pools | `/lessons/sql-conn-pool` | Beginner | 4 |
| SQL & Relational Databases | ORMs & SQLAlchemy | `/lessons/sql-conn-orm` | Beginner | 5 |
| SQL & Relational Databases | SQL playground | `/lessons/sql-playground` | Beginner | 8 |
| SQL & Relational Databases | Python SQL labs | `/lessons/sql-labs` | Beginner | 6 |
| SQL & Relational Databases | Indexes, planners & injection | `/lessons/sql-hood` | Beginner | 5 |
| MongoDB & Documents | Why MongoDB | `/lessons/mongodb-intro` | Intermediate | 4 |
| MongoDB & Documents | Documents & collections | `/lessons/mongodb-documents` | Intermediate | 5 |
| MongoDB & Documents | Finding documents | `/lessons/mongodb-queries` | Intermediate | 4 |
| MongoDB & Documents | Insert, update & delete | `/lessons/mongodb-writes` | Intermediate | 4 |
| MongoDB & Documents | Aggregation pipelines | `/lessons/mongodb-aggregation` | Intermediate | 5 |
| MongoDB & Documents | PyMongo driver | `/lessons/mongodb-conn-pymongo` | Intermediate | 5 |
| MongoDB & Documents | Connection URIs | `/lessons/mongodb-conn-uri` | Intermediate | 4 |
| MongoDB & Documents | Motor (async driver) | `/lessons/mongodb-conn-motor` | Intermediate | 4 |
| MongoDB & Documents | ODMs (Beanie / MongoEngine) | `/lessons/mongodb-conn-odm` | Intermediate | 4 |
| MongoDB & Documents | MongoDB playground | `/lessons/mongodb-playground` | Intermediate | 8 |
| MongoDB & Documents | Python document labs | `/lessons/mongodb-labs` | Intermediate | 6 |
| MongoDB & Documents | Embed, indexes & sharding | `/lessons/mongodb-hood` | Intermediate | 5 |
| Caching & Queues | Caching & LRU | `/lessons/caching` | Intermediate | 21 |
| Caching & Queues | Queue Architecture | `/lessons/queues` | Intermediate | 18 |
| Networking & the Web | How the Web Talks | `/lessons/network` | Intermediate | 18 |
| Networking & the Web | JavaScript Fundamentals | `/lessons/js-fundamentals` | Beginner | 18 |
| Networking & the Web | HTTP Clients | `/lessons/http-clients` | Beginner | 15 |
| Networking & the Web | How Browsers Render Pages | `/lessons/browser-rendering` | Intermediate | 16 |
| Networking & the Web | Load Balancing | `/lessons/loadbalancing` | Intermediate | 17 |
| Networking & the Web | APIs & REST | `/lessons/apis` | Beginner | 17 |
| Networking & the Web | Auth, Sessions & Tokens | `/lessons/auth` | Intermediate | 18 |
| Networking & the Web | Reverse proxies | `/lessons/web-reverse-proxy` | Intermediate | 6 |
| Networking & the Web | nginx API routing | `/lessons/web-nginx-routing` | Intermediate | 6 |
| Networking & the Web | API gateways | `/lessons/web-api-gateway` | Intermediate | 6 |
| Networking & the Web | Rate limiting & throttling | `/lessons/web-rate-limiting` | Intermediate | 6 |
| Networking & the Web | Edge stack in production | `/lessons/web-edge-stack` | Advanced | 6 |
| CSS & Layout | Why CSS feels hard | `/lessons/css-intro` | Beginner | 5 |
| CSS & Layout | The box model | `/lessons/css-box-model` | Beginner | 6 |
| CSS & Layout | Layout with Flex & Grid | `/lessons/css-layout` | Beginner | 7 |
| CSS & Layout | Position & stacking | `/lessons/css-position` | Beginner | 6 |
| CSS & Layout | Overflow & scrolling | `/lessons/css-overflow` | Beginner | 5 |
| CSS & Layout | Themes & CSS variables | `/lessons/css-themes` | Beginner | 6 |
| CSS & Layout | Cascade & specificity | `/lessons/css-cascade` | Beginner | 5 |
| CSS & Layout | Hacks vs proper fixes | `/lessons/css-hacks` | Beginner | 6 |
| FastAPI | Why FastAPI | `/lessons/fastapi-intro` | Intermediate | 4 |
| FastAPI | GET routes & JSON responses | `/lessons/fastapi-routes-basics` | Intermediate | 5 |
| FastAPI | POST, PUT & DELETE | `/lessons/fastapi-routes-crud` | Intermediate | 4 |
| FastAPI | Request models (Pydantic) | `/lessons/fastapi-models-request` | Intermediate | 5 |
| FastAPI | Response models & status codes | `/lessons/fastapi-models-response` | Intermediate | 4 |
| FastAPI | Path parameters | `/lessons/fastapi-params-path` | Intermediate | 3 |
| FastAPI | Query parameters | `/lessons/fastapi-params-query` | Intermediate | 4 |
| FastAPI | Request body | `/lessons/fastapi-params-body` | Intermediate | 4 |
| FastAPI | Database dependencies | `/lessons/fastapi-deps-database` | Intermediate | 5 |
| FastAPI | Auth dependencies | `/lessons/fastapi-deps-auth` | Intermediate | 5 |
| FastAPI | Errors & HTTPException | `/lessons/fastapi-errors` | Intermediate | 4 |
| FastAPI | ASGI & async handlers | `/lessons/fastapi-hood-asgi` | Intermediate | 4 |
| FastAPI | OpenAPI & /docs | `/lessons/fastapi-hood-openapi` | Intermediate | 3 |
| FastAPI | CORS & React integration | `/lessons/fastapi-hood-cors` | Intermediate | 4 |
| FastAPI | Full-stack stack | `/lessons/fastapi-hood-stack` | Intermediate | 3 |
| React | Why React | `/lessons/react-intro` | Intermediate | 4 |
| React | Components & JSX | `/lessons/react-jsx-basics` | Intermediate | 5 |
| React | JSX syntax rules | `/lessons/react-jsx-rules` | Intermediate | 4 |
| React | Props: data flows down | `/lessons/react-props` | Intermediate | 4 |
| React | State with useState | `/lessons/react-state` | Intermediate | 5 |
| React | Event handlers | `/lessons/react-events` | Intermediate | 4 |
| React | Lists & keys | `/lessons/react-lists` | Intermediate | 5 |
| React | Side effects with useEffect | `/lessons/react-effects` | Intermediate | 5 |
| React | Prop drilling & lifting state | `/lessons/react-store-lift` | Intermediate | 6 |
| React | Context API | `/lessons/react-store-context` | Intermediate | 8 |
| React | Context patterns | `/lessons/react-store-patterns` | Intermediate | 7 |
| React | External stores (Zustand / Redux) | `/lessons/react-store-external` | Intermediate | 8 |
| React | Choosing state placement | `/lessons/react-store-choosing` | Intermediate | 5 |
| React | Lab: counter & state | `/lessons/react-lab-counter` | Intermediate | 4 |
| React | Lab: props playground | `/lessons/react-lab-props` | Intermediate | 4 |
| React | Lab: todo list | `/lessons/react-lab-lists` | Intermediate | 5 |
| React | Virtual DOM & reconciliation | `/lessons/react-hood-vdom` | Intermediate | 8 |
| React | Rules of hooks | `/lessons/react-hood-hooks` | Intermediate | 7 |
| React | React ecosystem | `/lessons/react-hood-stack` | Intermediate | 7 |
| Security & Cryptography | Hashing & Cryptography | `/lessons/crypto` | Intermediate | 21 |
| Security & Cryptography | Security Basics | `/lessons/security` | Intermediate | 18 |
| Tooling & Workflow | The Command Line & Pipes | `/lessons/cli` | Beginner | 16 |
| Tooling & Workflow | Version Control with Git | `/lessons/git` | Beginner | 17 |
| Tooling & Workflow | Git: Conflicts, Rebase & PRs | `/lessons/git-advanced` | Intermediate | 18 |
| Tooling & Workflow | Package Managers & Semver | `/lessons/package-managers` | Beginner | 14 |
| Tooling & Workflow | Environment Variables & Config | `/lessons/env-config` | Beginner | 14 |
| Tooling & Workflow | Regular Expressions | `/lessons/regex` | Beginner | 17 |
| Tooling & Workflow | Testing & TDD | `/lessons/testing` | Beginner | 30 |
| Tooling & Workflow | CI/CD Pipelines | `/lessons/cicd` | Intermediate | 17 |
| Tooling & Workflow | Debugging & Logging | `/lessons/debugging` | Beginner | 28 |
| Programming & Design | Classes & Objects | `/lessons/classes` | Beginner | 20 |
| Programming & Design | Object-Oriented Programming | `/lessons/oop` | Intermediate | 21 |
| Programming & Design | Design Patterns | `/lessons/patterns` | Advanced | 27 |
| Programming & Design | Functional Programming | `/lessons/functional` | Intermediate | 18 |
| Programming & Design | Capstone: Task Tracker | `/lessons/capstone` | Intermediate | 20 |
