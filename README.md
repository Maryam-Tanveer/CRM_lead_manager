# Mini CRM Lead Manager (MERN Stack)

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Maryam-Tanveer/CRM_lead_manager)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://crm-lead-manager-client.vercel.app)

> 🔗 **GitHub Repository:** https://github.com/Maryam-Tanveer/CRM_lead_manager
> 🌐 **Live Demo:** https://crm-lead-manager-client.vercel.app

---

A modular, production-ready Lead Management System built as a MERN stack monorepo (`server/` + `client/`).

## System Architecture

```
lead-management/
├── package.json               # Monorepo workspace orchestrator
├── README.md                  # Project documentation & API guide
├── server/                    # Node.js + Express + MongoDB backend
│   └── src/
│       ├── config/            # Database connection & memory-server fallback
│       ├── constants/         # Roles and status enums
│       ├── controllers/       # Auth and lead business logic
│       ├── middleware/        # JWT auth, RBAC, validate, and error handler
│       ├── models/            # Mongoose schemas (User, Lead)
│       ├── routes/            # Express route definitions
│       ├── utils/             # Token generation and verification
│       ├── validations/       # Zod schemas (auth, lead)
│       ├── app.js             # Express app setup
│       └── server.js          # Entrypoint listener
└── client/                    # React + Vite + Tailwind CSS frontend
    ├── src/
    │   ├── components/
    │   │   ├── common/        # Modal, StatusBadge
    │   │   ├── dashboard/     # LeadTable, AnalyticsCards, FilterBar, Pagination, StatusDropdown
    │   │   └── layout/        # Navbar
    │   ├── context/           # AuthContext (JWT/RBAC), ThemeContext (Light/Dark)
    │   ├── pages/             # HomePage, AuthPage, DashboardPage
    │   ├── routes/            # AppRoutes, PublicRoute, ProtectedRoute
    │   ├── services/          # proxy.js (Axios 401 refresh interceptor), authService, leadService
    │   ├── validations/       # Zod client schemas
    │   ├── index.css          # Design system CSS variables & theme tokens
    │   ├── App.jsx            # App root & route providers
    │   └── main.jsx           # Client entrypoint
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Features

### Backend
- **Authentication**: JWT access tokens (15m expiry) and rotating refresh tokens (7d expiry) with HTTP-only cookie support.
- **Role-Based Access Control (RBAC)**: Support for `admin` and `user` roles with middleware protection.
- **Zod Validation**: Runtime schema validation on requests.
- **Lead Model**: Strictly follows the assignment specification:
  - `name`: String (required)
  - `email`: String (required, unique)
  - `phone`: String (required)
  - `status`: `"new"` | `"contacted"` | `"converted"`
  - `assignedTo`: String
  - `createdAt`: Date
- **Lead APIs**:
  - `POST /api/leads`: Create lead with validation.
  - `GET /api/leads`: Retrieve leads with pagination (`page`, `limit`), regex search, and status filter.
  - `PATCH /api/leads/:id/status`: Update status directly.
  - `PUT /api/leads/:id`: Full lead update.
  - `DELETE /api/leads/:id`: Remove lead with role checks.
  - `GET /api/leads/analytics`: Real-time pipeline metrics and conversion rate calculation.
- **Database Engine**: Supports any MongoDB connection string via `.env`. If no external database is configured, it automatically initializes an in-memory MongoDB instance for immediate out-of-the-box execution.

### Frontend
- **Design System & Theme**: Built with Tailwind CSS and CSS custom properties centered on a warm orange/amber palette. Changing theme colors globally requires only editing the CSS variables in `client/src/index.css`.
- **Dark & Light Mode**: Toggle with persistence in `localStorage`.
- **Dashboard & Analytics**: Real-time summary cards for Total Leads, New, Contacted, Converted, and Conversion Rate %.
- **Lead Management Table**:
  - Live debounced search across name, email, phone, and assigned representative.
  - Filter pills for quick status filtering (`All`, `New`, `Contacted`, `Converted`).
  - Inline status update dropdown to change lead status directly within the row.
  - Pagination controls with customizable per-page limits.
  - Modal form for creating and editing leads with field validation.
  - Deletion confirmation dialog.
- **Axios 401 Interceptor**: Automatically intercepts expired access tokens, requests a token refresh, and replays failed queries seamlessly.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
Run from the root repository:
```bash
npm install
```

### Running the Application
To run both backend and frontend concurrently:
```bash
npm run dev
```

The frontend will be available at:
`http://localhost:5173`

The backend API will be available at:
`http://localhost:5000`

---

## API Reference

### Auth Endpoints
- `POST /api/auth/register` - Create account (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` - Sign in (`email`, `password`)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Invalidate session
- `GET /api/auth/me` - Get authenticated user profile

### Lead Endpoints (Protected by JWT)
- `GET /api/leads` - List leads (query params: `page`, `limit`, `search`, `status`)
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Fetch single lead
- `PATCH /api/leads/:id/status` - Update status (`new`, `contacted`, `converted`)
- `PUT /api/leads/:id` - Update lead fields
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/analytics` - Pipeline statistics & conversion rate
