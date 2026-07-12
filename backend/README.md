# AssetFlow ERP Backend Setup & Prisma Guide

This guide explains how to set up the backend service for AssetFlow ERP, establish connection to your PostgreSQL database, and use Prisma ORM for database modeling, migrations, and seeding.

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [npm](https://www.npmjs.com/) or another package manager
*   A running PostgreSQL database instance (local PostgreSQL or a hosted provider like [Neon](https://neon.tech/))

---

### 2. Installation
Navigate to the backend directory and install the project dependencies:
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

---

### 3. Environment Configuration
Prisma and the Express server rely on environment variables. 

1. Duplicate the `.env.example` file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open the new `.env` file and replace the values with your actual database details:
   ```env
   # PostgreSQL database connection string
   DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>?sslmode=require"

   # Express server port
   PORT=5000
   ```

---

## 🛠️ Working with Prisma ORM

Prisma is used for schema management, migrations, and data access. Here are the core commands you need:

### Generate Prisma Client
Whenever you update [schema.prisma](file:///c:/Users/ADMIN/Downloads/odoo_hackathon/backend/prisma/schema.prisma), you need to regenerate the Prisma Client to get type-safe queries:
```bash
npx prisma generate
```

### Sync Database Schema (Prototyping)
To push your Prisma schema state directly to the database without creating migration files (recommended for fast iterations during hackathons):
```bash
npx prisma db push
```

### Create Database Migrations (Production-Ready)
If you prefer tracking schema changes via incremental SQL migration files:
```bash
npx prisma migrate dev --name <migration_name>
```

### Seed the Database
To populate your database with initial mock data (like default roles, departments, employees, and asset categories) defined in [seed.ts](file:///c:/Users/ADMIN/Downloads/odoo_hackathon/backend/prisma/seed.ts):
```bash
# Using npm script defined in package.json
npm run seed

# Or using Prisma CLI directly
npx prisma db seed
```

### Open Prisma Studio
Prisma provides a visual database GUI to view and edit database tables and rows in your browser:
```bash
npx prisma studio
```
By default, this opens at `http://localhost:5555`.

---

## 🏃 Running the Application

### Development Mode
Start the development server with live reload enabled (using `nodemon` and `ts-node`):
```bash
npm run dev
```

### Production Build & Run
Compile TypeScript to JavaScript and run the compiled server:
```bash
# Build TypeScript files
npm run build

# Start the compiled production app
npm start
```
