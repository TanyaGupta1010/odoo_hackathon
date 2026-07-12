# AssetFlow — Enterprise Asset & Resource Management System

AssetFlow is a centralized, production-ready ERP system designed to simplify how modern organizations track, allocate, and maintain physical assets and shared resources. 

Built with a robust role-based access model, the platform manages asset lifecycles, schedules shared facilities conflict-free, handles multi-stage maintenance workflows, runs audit verification cycles, and compiles visual operational analytics.

---

## Core Features & Modules

### 1. Asset Catalog & Registry
*   **Centralized Asset Cataloging**: Register and track corporate hardware, electronics, vehicles, and office furniture with unique auto-generated or custom asset tags.
*   **Real-time State & Condition Tracking**: Track asset lifecycle states (`Available`, `Allocated`, `Under Maintenance`, `Lost`) and physical condition status (`Good`, `Fair`, `Poor`).

### 2. Allocation & Assignment
*   **Direct Assignments**: Allocate assets to employees, departments, or physical locations with checkout records, expected return dates, and dynamic return tracking.
*   **Operational Validation**: Checks for active allocation conflicts or limits (e.g., alert prompts if an employee already holds a similar category of hardware).

### 3. Inter-Departmental Transfers
*   **Workflow Pipelines**: Transfer assets directly between departments, offices, or employees.
*   **Request & Approval Flow**: Enables managers to request transfers, which remain pending until approved or rejected by the target department head. Updates location parameters automatically upon approval.

### 4. Resource Booking System
*   **Shared Resource Calendaring**: Reserve shared enterprise assets (e.g., conference rooms, projectors, company vehicles).
*   **Overlap Prevention**: Strict backend validations prevent double-booking or scheduling conflicts for identical time slots.

### 5. Maintenance Management (Kanban Board)
*   **Interactive Kanban**: Track tickets through dynamic columns: `Pending` ➔ `Approved` ➔ `In Progress` ➔ `Resolved`.
*   **Ticket Customization**: Report issues with description text, priority levels (`Low`, `Medium`, `High`, `Urgent`), photo attachments, and technician assignments.
*   **State Syncing**: Approving a ticket automatically updates the asset status to `Under Maintenance`. Resolving the ticket restores it to `Available`.

### 6. Asset Audit & Verification
*   **Campaign Management**: View historical campaigns or run active verification campaigns.
*   **Audit Checklists**: Select a campaign to load scoped department assets and verify conditions: **Verified** (green), **Missing** (red), or **Damaged** (yellow).
*   **Automatic Discrepancies**: Flags missing or damaged items in real-time. Closing a cycle automatically updates missing items to `Lost` and damaged items to `Poor` condition in the database.

### 7. Reports & Analytics Dashboard
*   **Interactive Visualizations**: Dynamic charts powered by Recharts (Bar chart for Departmental Asset Utilization, Line chart for Monthly Maintenance Frequency).
*   **Actionable Insights**: List widgets highlighting highly booked spaces, idle assets (>30 days inactive), and hardware nearing retirement age.
*   **CSV Exports**: Compile and download complete spreadsheet reports of active inventories and alerts.

### 8. Activity Logs & Notifications
*   Unified chronological logging feed of all database transactions.
*   Tabbed filters for **All**, **Alerts** (overdue items, discrepancies), **Approvals** (maintenance, transfers), and **Bookings**.
*   Relative timestamps (e.g. `2m ago`, `1h ago`) and context-specific visual indicators.

---

## Technology Stack

*   **Frontend**: React.js (Vite), TypeScript, TailwindCSS, Recharts, Lucide Icons, Axios.
*   **Backend**: Node.js, Express, TypeScript, Zod (Request validation), Prisma ORM.
*   **Database**: PostgreSQL (Hosted on Neon serverless DB).

---

## 📂 Project Structure

```text
odoo_hackathon/
├── backend/
│   ├── prisma/             # Database schemas & seed scripts
│   └── src/
│       ├── config/         # Prisma client & env loading
│       ├── controllers/    # API controllers (input parsing)
│       ├── routes/         # Express endpoint mappings
│       ├── services/       # Core business logic & transactions
│       └── validators/     # Zod payload validation schemas
└── frontend/
    └── src/
        ├── components/     # Layout headers, sidebars, forms
        ├── constants/      # Sidebar routing constants
        ├── pages/          # React views 
        └── routes/         # React Router configurations
```

---

## Quick Local Setup

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Duplicate `.env.example` to `.env` and fill in your PostgreSQL URL:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<dbname>?sslmode=require"
   PORT=5000
   ```
4. Push the schema to your PostgreSQL database:
   ```bash
   npx prisma db push
   ```
5. Seed the database with initial enterprise data:
   ```bash
   npm run seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.
