# AICTE Security Deposit / FDR Management Portal
### Zero-Trust Architecture with Cryptographic Verification

A full-stack monorepo system for the All India Council for Technical Education (AICTE) to automate, verify, and manage Fixed Deposit Receipts (FDR) and institutional security deposits with cryptographic trust guarantees.

---

## 🏛 Architecture Overview

- **Frontend (`/client`)**: React 18 / 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend (`/server`)**: Node.js, Express, TypeScript, node-cron, JSON Web Tokens (JWT), PostgreSQL (`pg`).
- **Database (`/server/src/db/schema.sql`)**: PostgreSQL with UUID primary keys, cryptographic verification hashes, and Account Aggregator consent records.

---

## 📁 Monorepo Structure

```
aicte-fdr-portal/
├── client/                     # React Frontend (Vite + TS + Tailwind CSS)
│   ├── src/
│   │   ├── App.tsx             # Zero-Trust Landing Page & Dashboard Entry
│   │   ├── index.css           # Tailwind Directives & Custom Styles
│   │   └── main.tsx            # React Entry Point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
├── server/                     # Node.js + Express Backend (TypeScript)
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Auth, role-based access, and validation
│   │   ├── db/                 # Database schema and connection pool
│   │   │   └── schema.sql      # PostgreSQL DDL with UUIDs & Foreign Keys
│   │   ├── services/           # Setu AA integration & crypto services
│   │   └── server.ts           # Express server entry point (Port 5000)
│   ├── .env.example            # Backend environment variables template
│   ├── package.json
│   └── tsconfig.json
├── .env.example                # Root environment template
├── .gitignore                  # Ignores node_modules, .env, and dist/build folders
├── package.json                # Monorepo workspaces config
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (v13+)

### 2. Environment Configuration
Copy `.env.example` in `server`:
```bash
cp server/.env.example server/.env
```

### 3. Run Development Servers
From the root directory:
```bash
# Start backend server (Port 5000)
npm run dev:server

# Start frontend development client (Port 5173)
npm run dev:client
```
