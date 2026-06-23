# EduMetrics Student Performance Analytics Platform

EduMetrics is a full-stack student performance management and analytics platform. It allows educational institutions to manage student directory metadata and visually audit monthly performance trends via interactive Chart.js line charts.

---

## 🚀 Tech Stack

### Frontend
*   **Core:** React (v18.3), TypeScript, Vite
*   **State & ViewModels:** React Hooks (custom view models)
*   **Routing:** React Router (v6)
*   **Styling:** Tailwind CSS (v3), PostCSS
*   **Forms:** React Hook Form
*   **Charts:** Chart.js, `react-chartjs-2`
*   **HTTP client:** Axios

### Backend
*   **Core:** Node.js, Express, TypeScript
*   **Database ORM:** Prisma
*   **Database:** PostgreSQL
*   **Authentication:** JSON Web Tokens (JWT)
*   **Search Engine:** Fuse.js (in-memory fuzzy matching)

---

## 📁 Project Structure

```
student-performance-analytics/
├── frontend/             # Vite + React Client
│   ├── src/
│   │   ├── pages/         # Views
│   │   ├── components/    # Reusable UI widgets
│   │   ├── hooks/         # ViewModels (useAuth, useStudents, useAnalytics)
│   │   ├── services/      # Axios API Client & wrappers
│   │   └── context/       # Auth Context Provider
│   └── package.json
│
├── backend/              # Node.js + Express API Server
│   ├── src/
│   │   ├── controllers/   # Request/Response formatting
│   │   ├── services/      # Student fuzzy search & averages calculation
│   │   └── routes/        # Router endpoint configuration
│   ├── prisma/            # Prisma Schema & Database Seeder
│   └── package.json
│
├── docs/                 # Architectural & API Documentation
│   ├── architecture.md    # Code Architecture & Directory Maps
│   ├── api.md             # REST API Contract Specifications
│   ├── database.md        # Database Schema & Entity Relationships
│   ├── DESIGN.md          # Stitch Visual Design System Specification
│   └── interview-notes.md # Interview Q&A, Trade-offs & Architecture Decisions
│
└── README.md
```

---

## 🔧 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL running locally (Port 5432)

### 1. Database Setup
Ensure PostgreSQL is active. Run:
```bash
psql -d postgres -c "CREATE DATABASE edu_analytics;"
```

### 2. Configure Backend Env
Create a `.env` file under `backend/`:
```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/edu_analytics?schema=public"
PORT=5001
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
JWT_SECRET=super_secret_key
```

### 3. Install Dependencies & Build Databases
Install backend packages, run Prisma migrations, and execute the seeder:
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

Install frontend packages:
```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Application

To run the full stack locally:

### Start Backend Server:
```bash
cd backend
npm run dev
```
*(Runs on `http://localhost:5001`)*

### Start Frontend Dev Server:
```bash
cd frontend
npm run dev
```
*(Runs on `http://localhost:5173`)*
