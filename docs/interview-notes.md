# Technical Interview Preparation Guide: EduMetrics

This document serves as a comprehensive reference guide to prepare for technical interviews. It contains deep-dives into technology selection, architectural rationale, implementation trade-offs, and scaling plans.

---

## 1. Core Technology Selection

### Why React?
*   **Component Composition:** React facilitates decomposing complex layouts into simple, atomic, reusable building blocks (e.g. `SideNavBar`, `Header`, `Table`, `AnalyticsDrawer`).
*   **State Synchronization:** React's unidirectional data flow ensures that updates to data state (such as clicking a student row to display analytics) trigger UI re-renders immediately.
*   **Widespread Ecosystem:** Simple integrations with mature packages like Chart.js (`react-chartjs-2`), React Hook Form, and React Router.

### Why TypeScript?
*   **Static Type Contracts:** Enforces compile-time type checks on both spaces (e.g., matching API response schemas to custom models in the client). This eliminates runtime crashes due to undefined objects.
*   **Self-documenting Code:** Simplifies review processes during developer interviews by clarifying input parameters and returns directly inside files.
*   **Better IDE Introspection:** Enables autocompletions and speeds up refactor tasks.

### Why Express?
*   **Simplicity and Control:** Unopinionated, lightweight framework. Facilitates simple routing without loading complex abstractions.
*   **Middleware Pipeline:** Express allows writing simple pipelines for common concerns (e.g. `CORS` configuration, JWT authorization guards via `authGuard`, and global error formatting).
*   **Low Overhead:** Faster compile and startup times than nested frameworks (like NestJS), making it easier to explain within a short 60-minute interview window.

### Why Prisma?
*   **Type-safe ORM Client:** Generates a custom TypeScript client matching database schema schemas automatically.
*   **Declarative Migrations:** Tracks schema changes as incremental, readable SQL migration scripts.
*   **Prisma Client API:** Replaces complex SQL queries with clean, auto-typed object queries (e.g., `prisma.student.findUnique({ include: { marks: true } })`).

### Why PostgreSQL?
*   **Relational Integrity:** Performance reports naturally form a rigid one-to-many relationship (Student → Marks, Subject → Marks, Month → Marks). Relational foreign keys and composite unique constraints prevent corrupt entries.
*   **ACID Compliance:** Ensures database transactions remain safe and consistent, particularly when updating student records and marks simultaneously in a single transaction.

---

## 2. Architectural Rationale

### Why MVVM-inspired Frontend?
*   **Separation of Concerns:** React Components (Views) remain purely presentation-focused, utilizing only Tailwind CSS class mappings. Custom Hooks (ViewModels) encapsulate state management, rendering logic, and event callback flows. Services handle pure HTTP communication.
*   **Testability:** ViewModels can be tested in isolation (using hook testing libraries) without rendering DOM structures.
*   **Maintainability:** Changing API endpoint URLs only requires updating the Service layer, leaving components and hooks untouched.

### Why Layered Backend Architecture?
*   **Clean Separation:** Request routing (`routes`), input parsing/validation (`controllers`), business operations (`services`), and data queries (`Prisma`) are isolated into distinct, sequential files.
*   **Fuzzy Search Decoupling:** Isolating fuzzy search inside `StudentService` prevents controller bloat.

---

## 3. Fuzzy Search Engine (Fuse.js) Design

### How it Works
*   Fuse.js is a lightweight, zero-dependency fuzzy search library executing in memory.
*   Instead of doing exact SQL matches (`LIKE %search%`), Fuse.js implements the Bitap algorithm to evaluate string distances, allowing it to return relevant items even when the query contains spelling errors.

### Threshold Configuration
*   **Chosen Threshold:** `0.4`.
*   **RATIONALE:** A threshold of `0.0` requires an exact match (defeating fuzzy search), while a threshold of `1.0` matches any string. A value of `0.4` offers a balance, catching spelling errors (e.g., `rahul` → `raahul`, `rhaul`) while filtering out unrelated names (e.g., `rahul` → `rohan`).

### Trade-offs & Scaling
*   **Current Model:** Searches are executed in memory after pulling all students from the database.
*   **Trade-off:** In-memory search is fast and does not require third-party engine installs (like Elasticsearch) or complex configuration. This keeps the project extremely simple and easy to explain.
*   **Scaling Limit:** When the student body exceeds 10,000 records, in-memory searches will degrade CPU performance.
*   **Scaling Strategy:** Move fuzzy search to the database level (e.g., PostgreSQL `pg_trgm` extension or GIN index queries) or deploy a dedicated search engine (like Elasticsearch or Meilisearch).

---

## 4. Security & JWT

### Authentication Flow
*   Admin credentials (`admin` / `password123`) are evaluated against environment variables.
*   On success, the backend signs a JWT token using `jsonwebtoken` with an expiration limit of 24 hours.
*   The client stores this token in `localStorage` and injects it into outgoing HTTP headers via an Axios request interceptor (`Authorization: Bearer <token>`).
*   The `authGuard` middleware validates the signature on every protected API call.

### Trade-off: LocalStorage vs HTTP-Only Cookies
*   **Why LocalStorage:** Simplifies development by avoiding complex cross-origin cookie configurations. It makes the authorization flow extremely easy to explain in a technical interview.
*   **Vulnerability:** Susceptible to Cross-Site Scripting (XSS) attacks.
*   **Production Improvement:** Move tokens to `httpOnly` secure cookies to prevent client-side JavaScript access.

---

## 5. Architectural Trade-offs & Future Improvements

| Current Trade-off | Rationale for Interview | Production-Grade Upgrade |
| :--- | :--- | :--- |
| **In-Memory Fuzzy Search** | Simple to write, requires no external dependencies. | Move to PostgreSQL full-text search (`pg_trgm`) or Elasticsearch. |
| **LocalStorage Tokens** | Easy to implement and explain. | Move to secure, httpOnly cookies with CSRF validation. |
| **InMemory Pagination** | Faster prototype development for 100 students. | Execute SQL `LIMIT` and `OFFSET` queries at database level. |
| **Single Admin User** | Meets initial auth requirements without registration bloat. | Implement Role-Based Access Control (RBAC) with database-backed Users. |
