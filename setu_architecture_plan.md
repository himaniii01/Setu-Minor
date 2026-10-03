# SETU (Interoperability Gateway) - Architectural Blueprint & Plan

**SETU** ("bridge" in Hindi/Sanskrit) is an academic prototype of a unified, consent-based government service discovery and application tracking gateway for India.

---

## 1. Project Structure

```text
c:/Users/kawad/Desktop/minor/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # User, Profile, Document, Service, Application, Consent, Audit, Grievance, etc.
│   │   └── seed.ts              # 2 Citizens, 1 Admin, 12+ Services, 5 Connectors, Fictional Documents
│   ├── src/
│   │   ├── config/              # Environment variables & constants
│   │   ├── connectors/          # e-District (JSON), Scholarship (JSON), Municipal (XML->JSON), data.gov.in, DigiLocker
│   │   ├── controllers/         # Auth, Profile, Services, Consents, Applications, Grievances, Admin, Eligibility
│   │   ├── gateway/             # Trace ID, Data Normalizer, Canonical Status Mapper, Consent Enforcement, Idempotency
│   │   ├── middlewares/         # Auth JWT, RBAC, Rate Limiter, Error Handler, Audit Logger
│   │   ├── routes/              # Express API routers under /api/v1
│   │   ├── services/            # Core business logic
│   │   ├── utils/               # Logger, XML Parser, Argon2/Bcrypt hash helpers
│   │   └── app.ts               # Express server setup & Swagger docs
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── assets/              # Logos, emblems, banners
│   │   ├── components/          # Header, Footer, SideDrawer, ConnectorChip, Stepper, Modals, StatusBadge, Timeline
│   │   ├── context/             # AuthContext, LanguageContext, ToastContext
│   │   ├── i18n/                # English (en) and Hindi (hi) translations
│   │   ├── pages/               # Home, Services, Track, Grievances, Dashboard, ConsentDashboard, AdminHealth, ApplyFlow, etc.
│   │   ├── services/            # API client (Axios/Fetch) with trace ID support
│   │   ├── types/               # TypeScript models & schemas
│   │   ├── App.tsx
│   │   ├── index.css            # Custom CSS variables, Prajaseva tokens, smooth animations
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 2. Design System Tokens (Prajaseva Visual Language)

- **Primary**: Deep Navy `#0B2A5B` (Hover: `#12397A`)
- **Accent/Success**: Emerald Green `#16A34A` (Light bg: `#E8F8EE`)
- **Page Background**: Light cool grey-blue `#F5F8FC`
- **Card Background**: `#FFFFFF` with border `#E6ECF4` and radius `16px`
- **Category Card Tints**:
  - Light Blue (`#EFF6FF`)
  - Light Green (`#F0FDF4`)
  - Light Peach/Orange (`#FFF7ED`)
  - Light Purple (`#FAF5FF`)
  - Light Yellow (`#FEFCE8`)
  - Light Pink (`#FDF2F8`)
  - Light Teal (`#F0FDFA`)
- **Typography**: Geometric sans (`Plus Jakarta Sans` / `Inter`), Devanagari fallback (`Noto Sans`).
- **Footer**: Deep Navy `#0B2A5B` with a thin 3px emerald green top line `#16A34A`.

---

## 3. Connector Matrix & Integration Types

| Connector | Protocol / Format | Integration Label | Purpose / Scope |
| :--- | :--- | :--- | :--- |
| **e-District Income Certificate** | REST / JSON | `MOCK_SIMULATION` | Submission, document ref validation, status tracking |
| **Welfare Scholarship Service** | REST / JSON | `MOCK_SIMULATION` | Dynamic criteria verification & fee reimbursement application |
| **Municipal Birth Registry** | SOAP / XML | `MOCK_SIMULATION` | Demonstrates legacy XML to canonical JSON normalization |
| **Data.gov.in Open API** | REST / JSON | `PUBLIC_OPEN_DATA` | Public non-personal government stats and directory lists |
| **DigiLocker Simulator** | OAuth Mock | `MOCK_SIMULATION` | Mock document vault references (Income cert, Marks memo, Ration card) |

---

## 4. Implementation Steps Order

1. **Database Schema & Seed**: Setup Prisma SQLite schema with all 12 tables + seed script with 2 demo citizens, 1 admin, 12 services, 5 connectors, and mock applications.
2. **Backend Gateway & Services**: Implement Express server, Auth (JWT + Bcrypt), Service Catalog, Consent enforcement gateway, Connector Adapters (JSON + XML conversion), Status Normalizer, Audit logger, and Swagger OpenAPI docs.
3. **Frontend Infrastructure**: Setup Vite + React + TypeScript + Tailwind CSS with the exact Prajaseva theme tokens, i18n English/Hindi dictionary, and shared components (Header, SideDrawer, Footer, Banners, Toast, ConnectorChips).
4. **Core Public Pages**: Home (Hero card, quick tiles, popular services, 4-step strip, notices), Services Directory (8 categories + chips), Check Eligibility Modal, Track Application Page (Timeline view), Lodge Grievance Page.
5. **Citizen Secured Area**: Citizen Login modal, Multi-step Application Stepper (Personal -> Education -> Documents -> Preview & Consent), Citizen Dashboard, Document Vault, and Consent Dashboard (with instant revoke action).
6. **Admin Suite**: Interoperability Health Monitor (Latency, success rates, failure simulation switches), API Registry manager, and Append-only Audit Log viewer with Trace IDs.
7. **Verification & Deliverables**: End-to-end integration verification, Docker Compose file, Postman API collection, and detailed README.
