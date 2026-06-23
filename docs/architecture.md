# Monorepo Architecture: EduMetrics Platform

This document describes the architectural patterns and structural patterns employed across the EduMetrics monorepo.

---

## 1. Frontend Architecture: MVVM-Inspired Pattern

The React frontend utilizes a decoupled, MVVM-inspired design separating the visual layers, interaction logic, and network requests.

```
+-------------------------------------------------+
|                      VIEWS                      |
| (Pages, Components: Dashboard, Form, Login)      |
+-------------------------------------------------+
                        |
                        v (Hooks bind state/callbacks)
+-------------------------------------------------+
|                   VIEWMODELS                    |
| (React Custom Hooks: useStudents, useAnalytics) |
+-------------------------------------------------+
                        |
                        v (API queries/mutations)
+-------------------------------------------------+
|                 SERVICES LAYER                  |
| (Axios Wrapper: StudentService, AuthService)    |
+-------------------------------------------------+
```

### Layer Responsibilities
*   **Views (Pages & Components):** Exclusively render markup and map visual Tailwind CSS tokens. They bind directly to ViewModels and execute interaction event callbacks. They contain no hardcoded business logic or fetch triggers.
*   **ViewModels (Custom Hooks):** Manage component state, query offsets, search terms, validation errors, and mutation loading indicators. They encapsulate business rules and bind View elements to the Service layer.
*   **Services (Repository Layer):** Handle HTTP calls via Axios. They manage credentials, request payloads, and map responses to domain-specific TypeScript types.

---

## 2. Backend Architecture: Layered Controller-Service Pattern

The backend API uses a clean, layered architectural structure separating routing, validation, data parsing, and database transactions.

```
[ HTTP Request ] 
       |
       v
+--------------+
|    Routes    |  --> Registers endpoints & triggers authGuard middleware
+--------------+
       |
       v
+--------------+
| Controllers  |  --> Validates body schemas, extracts route parameters
+--------------+
       |
       v
+--------------+
|   Services   |  --> Computes score averages & executes Fuse.js fuzzy searches
+--------------+
       |
       v
+--------------+
|  Prisma Client| --> Executes queries against PostgreSQL
+--------------+
```

### Layer Responsibilities
*   **Routes:** Route mappings. Connect API endpoints to controllers. Apply security middleware (`authGuard`).
*   **Controllers:** Request parsing and response mapping. Extract request parameters, query terms, and body structures. Validate input fields and delegate execution to Services.
*   **Services:** House core business logic. Perform scores and averages computation, handle transactions, and initialize the Fuse.js search engine index.
*   **Prisma Client:** Performs type-safe queries to the PostgreSQL database.
