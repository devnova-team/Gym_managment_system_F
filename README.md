# 🏋️ FitPulse — Gym Management System (GMS) Frontend Dashboard

A modern, multi-tenant **SaaS Gym Management System** dashboard built with **Next.js App Router + React 19 + Redux Toolkit (RTK Query) + Mantine UI + Tailwind CSS**.

The architecture follows a modular, enterprise-grade pattern inspired by the **Alegny Dashboard Architecture**:
- Unified Dark / Light mode synchronization between Tailwind CSS and Mantine UI.
- Real-time Language & Direction switching (Arabic RTL & English LTR).
- Collapsible sidebar navigation powered by a reusable `SharedTabs` menu.
- Normalized data fetching with **RTK Query**, featuring separated API modules per feature and automatic token re-authentication.

---

## 📑 Table of Contents

- [1. Overview & Objectives](#1-overview--objectives)
- [2. Tech Stack](#2-tech-stack)
- [3. Project Architecture & Folder Structure](#3-project-architecture--folder-structure)
- [4. Getting Started & Installation](#4-getting-started--installation)
- [5. Dark Mode, Light Mode & RTL Localization](#5-dark-mode-light-mode--rtl-localization)
- [6. Navigation Architecture (NavBar & SharedTabs)](#6-navigation-architecture-navbar--sharedtabs)
- [7. State Management & RTK Query Architecture](#7-state-management--rtk-query-architecture)
- [8. Official API Contract & Endpoint Catalog](#8-official-api-contract--endpoint-catalog)
- [9. Team Division & Sprint Breakdown](#9-team-division--sprint-breakdown)
- [10. Multi-Tenancy & Data Isolation](#10-multi-tenancy--data-isolation)
- [11. Git Workflow & Collaboration Rules](#11-git-workflow--collaboration-rules)

---

## 1. Overview & Objectives

### The Problem FitPulse Solves
Small and medium gym facilities typically suffer from:
- Manual, paper-based, or fragmented subscription tracking.
- Inability to quickly check who is currently inside the gym.
- Lack of proactive notifications for expiring subscriptions, newcomers, or churned members.
- Disconnected store sales, staff shifts, and maintenance records.
- Difficulty calculating accurate net profit across cash subscriptions, store sales, and operational expenses.
- Data loss or operational blockage when internet connectivity drops.

### Core Objectives
1. **Speed & Reliability**: Instant check-in and search, with offline sync capabilities via idempotent `local_id`.
2. **Role-Based Access Control (RBAC)**:
   - **Owner**: Full access to all gym records, financials, staff, store, equipment, expenses, and system settings.
   - **Receptionist**: Dedicated operational access to members, subscriptions, attendance check-in, and member messaging. Sensitive financial metrics and configuration are restricted.
3. **Multi-Tenant SaaS Isolation**: Complete isolation of gym records using `gym_id`.
4. **No Self-Registration**: Accounts are invited/provisioned by the Gym Owner or System Administrator.

---

## 2. Tech Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Framework & Runtime** | [Next.js App Router](https://nextjs.org/docs/app) + [React 19](https://react.dev/) | Server/client rendering, route handlers, and production builds |
| **Routing** | Next.js App Router | File-system routes, nested layouts, and client-side navigation |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Mantine UI v7+](https://mantine.dev/) | Utility-first styling paired with accessible Mantine UI components & hooks |
| **State & Data Fetching** | [Redux Toolkit & RTK Query](https://redux-toolkit.js.org/) | Global state, normalized cache, automatic tag invalidation, and queries |
| **HTTP Layer** | `fetchBaseQuery` (RTK Query) | JWT Bearer headers, language injection, and automatic 401 reauth retry |
| **Localization (i18n)** | [i18next](https://www.i18next.com/) + `react-i18next` | Arabic (`ar`) & English (`en`) with dynamic RTL/LTR direction switching |
| **Session Management** | `js-cookie` | Token and session cookie persistence with inactivity timeout protection |
| **Iconography** | [React Icons](https://react-icons.github.io/react-icons/) | Feather Icons (`fi`), Hi Icons (`hi`, `hi2`), and Material Icons (`md`) |

---

## 3. Project Architecture & Folder Structure

The app uses App Router pages/layouts with feature modules and server-only API proxy code:

```
src/
├── app/                              # Next.js App Router pages and route handlers
│   ├── (auth)/login/
│   ├── (dashboard)/{members,attendance,overview}/
│   ├── dashboard/                    # Backward-compatible /dashboard/* routes
│   └── api/{auth,members}/            # Server-side API proxy handlers
├── features/{auth,members,attendance}/
│   ├── components/
│   ├── api/
│   ├── hooks/
│   ├── services/
│   └── validation/
├── screens/                           # Existing dashboard screen implementations
├── server/{auth,backend}/             # Server-only session, permissions, API client
├── shared/{components,hooks}/         # Providers, auth gates, and shared hooks
└── store/store.js                    # Redux store factory
```

---

## 4. Getting Started & Installation

### Prerequisites
- **Node.js**: v20.9.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install
```bash
git clone https://github.com/devnova-team/Gym_managment_system_F.git
cd Gym_managment_system_F
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory to configure the upstream gym API:
```env
GYM_API_BASE_URL=http://localhost:8000/api
```
When unset, API proxy routes return `503` with a configuration message.

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```

---

## 5. Dark Mode, Light Mode & RTL Localization

### 🎨 Theme Management (`ThemeContext.jsx`)
- Toggling dark/light mode automatically synchronizes:
  1. Tailwind CSS `dark` class on `document.documentElement`.
  2. Mantine UI `data-mantine-color-scheme` attribute.
  3. `localStorage.getItem('theme')`.
- Usage in any component:
  ```jsx
  import { useTheme } from '../Context/ThemeContext';
  const { isDarkMode, toggleTheme } = useTheme();
  ```

### 🌐 Arabic (RTL) & English (LTR) Localization (`LanguageContext.jsx`)
- Language selection dynamically switches between `ar` and `en`.
- Automatically sets `document.documentElement.dir = 'rtl'` or `'ltr'`.
- Applies Google's **Cairo** font for Arabic and **Inter** for English.
- Usage:
  ```jsx
  import { useLanguage } from '../Context/LanguageContext';
  import { useTranslation } from 'react-i18next';

  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  ```

---

## 6. Navigation Architecture (NavBar & SharedTabs)

### 📌 Top Header (`Header/NavBar.jsx`)
- **Left**: Mobile menu toggle (`HiMenuAlt2`) and user greeting with waving hand icon.
- **Center**: Debounced `SearchInput` component with clear button (`HiXMark`).
- **Right**:
  - Language toggle button with Tooltip (`RiGlobalLine`).
  - Dark / Light mode toggle button with Tooltip (`MdOutlineLightMode` / `MdOutlineDarkMode`).
  - User avatar with dropdown menu (Profile role indicator, Log Out action with `useLogoutMutation`).

### 📌 Shared Menu Tabs (`Menu/SharedTabs.jsx`)
- Implemented with Mantine's `<Tabs />` component with custom pills styling.
- Responsive orientation: vertical for desktop sidebar, horizontal for compact views.
- Active tab pill indicator with text gradient and icons.
- Desktop sidebar collapse button (`IoIosArrowBack`) with automatic rotation based on RTL / LTR direction.

---

## 7. State Management & RTK Query Architecture

Data fetching and caching use **Redux Toolkit (RTK Query)** configured in `Service/`:

1. **`Service/baseApi.js`**:
   - Central `createApi` instance with `baseQueryWithReauth`.
   - Automatically attaches `Authorization: Bearer <token>` from Cookies/LocalStorage.
   - Attaches `Accept: application/json` and `Accept-Language: ar|en`.
   - Intercepts `401 Unauthorized` responses to seamlessly refresh the Access Token via `/api/auth/refresh`.
   - Defines cache `tagTypes` for cache invalidation.

2. **`Service/Apis/` (Separated API per Feature)**:
   - Every feature injects its own endpoints into `baseApi`:
     ```js
     import { baseApi } from '../baseApi';

     export const featureApi = baseApi.injectEndpoints({
         endpoints: (builder) => ({
             // Queries and mutations here
         }),
     });
     export const { use...Query, use...Mutation } = featureApi;
     ```

3. **`Service/Store.jsx`**:
   - Single Redux store registering `baseApi.reducer` and `baseApi.middleware`.

---

## 8. Official API Contract & Endpoint Catalog

Based on the official GMS API Contract specification:

### 🔹 Feature 0 — Authentication (`authApi.js`)
- `POST /api/auth/login`: Authenticate with email/phone + password. Returns Access Token, session cookie, user role (`owner` / `receptionist`), and `gym_id`.
- `POST /api/auth/refresh`: Refresh expired Access Token using HttpOnly Refresh Cookie.
- `POST /api/auth/logout`: Invalidate session on backend.

### 🔹 Feature 1 — Members & Subscriptions (`membersApi.js`)
- `GET /api/members`: Fetch member list with search and filters.
- `POST /api/members`: Register new member (name, phone, birth date, photo).
- `GET /api/members/{id}`: Member profile details.
- `PUT /api/members/{id}`: Update member profile.
- `DELETE /api/members/{id}`: Soft delete member.
- `GET /api/plans`: Fetch available subscription plans.
- `POST /api/plans`: Create new plan (*Owner only*).
- `PUT /api/plans/{id}`: Edit plan.
- `DELETE /api/plans/{id}`: Delete plan (*rejected if linked to active subscriptions*).
- `POST /api/subscriptions`: Add new subscription for member (*payment_method is fixed to 'cash'*).
- `POST /api/subscriptions/renew`: Renew subscription (*supports early renewal from old expiry date*).

### 🔹 Feature 2 — Attendance & Check-in (`attendanceApi.js`)
- `POST /api/attendance/check-in`: Manual member check-in with subscription validation.
- `GET /api/attendance/today`: List members currently inside the gym today.
- `POST /api/attendance/sync`: Sync offline records recorded during internet outage (*idempotent using unique local_id*).

### 🔹 Feature 3 — Segmentation & Communication (`communicationApi.js`)
- `GET /api/members/segmented`: Get members grouped into 4 categories (`new`, `expiring`, `inactive`, `expired`) with pre-filled WhatsApp `wa.me` links.
- `GET /api/message-templates`: Fetch templates for each segment.
- `PUT /api/message-templates/{id}`: Edit template message text (*Owner only*).

### 🔹 Feature 4 — Dashboard Stats (`dashboardApi.js`)
- `GET /api/dashboard/stats`: KPI metrics, 4 segment counters, and attendance chart data in a single request.

### 🔹 Feature 5 — Staff & Shifts (`staffApi.js`)
- `GET /api/staff`: List staff members (owner, receptionist, trainer).
- `POST /api/staff`: Register new staff member.
- `GET /api/shifts`: List shift schedules.
- `POST /api/shifts`: Create shift schedule.
- `POST /api/staff/attendance`: Staff clock in / clock out (*separated from member attendance*).

### 🔹 Feature 6 — Operational Expenses (`expensesApi.js`)
- `GET /api/expenses`: List and filter expenses (*rent, salaries, bills, maintenance, other*).
- `POST /api/expenses`: Record operational expense.

### 🔹 Feature 7 — Financial Report (`reportsApi.js`)
- `GET /api/reports/financial-summary`: Comprehensive financial summary (*Owner only*):
  $$\text{Net Profit} = \text{Cash Subscriptions} + \text{Store Sales} - \text{Expenses}$$

### 🔹 Feature 8 — Internal Store / POS (`storeApi.js`)
- `GET /api/store/products`: List products, unit prices, and stock inventory.
- `POST /api/store/products`: Add product to store.
- `POST /api/store/sales`: Record sale with automatic stock deduction (*guards against out-of-stock items*).

### 🔹 Feature 9 — Equipment & Maintenance (`equipmentApi.js`)
- `GET /api/equipment`: Equipment registry with maintenance schedules.
- `POST /api/equipment`: Add machine/equipment.
- `PUT /api/equipment/{id}`: Update equipment or maintenance records.

### 🔹 Feature 10 — Administrative Reminders (`remindersApi.js`)
- `GET /api/reminders`: List administrative tasks and reminders.
- `POST /api/reminders`: Create administrative reminder.

---

## 9. Team Division & Sprint Breakdown

| Team Member | Area of Responsibility | Features Assigned |
| :--- | :--- | :--- |
| **Youssef** | **Core & Members** | Feature 0 (Auth) & Feature 1 (Members & Plans) |
| **Mariam** | **Operations & Engagement** | Feature 2 (Attendance) & Feature 3 (Segments & Messaging) |
| **Moamen** | **Finance & Analytics** | Feature 4 (Dashboard), Feature 6 (Expenses), Feature 7 (Reports) |
| **Mohamed** | **Staff, Store & Facilities** | Feature 5 (Staff), Feature 8 (Store), Feature 9 (Equipment), Feature 10 (Reminders) |

---

## 10. Multi-Tenancy & Data Isolation

FitPulse is a SaaS platform serving multiple gyms simultaneously:
- Every database query and cache key is automatically scoped by `gym_id`.
- The backend infers `gym_id` from the verified JWT access token.
- No user can access or view another gym's data.

---

## 11. Git Workflow & Collaboration Rules

### Branching Model
- **`main`**: Production release only. Direct commits are forbidden.
- **`staging`**: Integration and team testing branch.
- **`feature/<name>/feature-<number>`**: Feature branches branched from `staging`.

```bash
# Update staging
git checkout staging
git pull origin staging

# Create feature branch
git checkout -b youssef/feature-1

# Commit & Push
git add .
git commit -m "feat(members): implement member CRUD and plan association"
git push origin youssef/feature-1
```

---

*FitPulse GMS • Powered by DevNova Team • 2026*
