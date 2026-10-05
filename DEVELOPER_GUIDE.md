# 🚀 Team Member Developer Guide & Standards

Welcome to the Frontend Engineering Team! This document is the single source of truth for all developers working on the Gym Management System (GMS). Follow these conventions and workflows strictly to ensure code quality, UI consistency, and seamless integration.

---

## 📑 Table of Contents
1. [Initial Setup & Local Installation](#1-initial-setup--local-installation)
2. [Git Workflow & Pull Request (PR) Policy](#2-git-workflow--pull-request-pr-policy)
3. [Feature Development Lifecycle](#3-feature-development-lifecycle)
4. [State Management & RTK Query Guidelines](#4-state-management--rtk-query-guidelines)
5. [Dark & Light Mode Architecture](#5-dark--light-mode-architecture)
6. [Color Palette & Design Tokens](#6-color-palette--design-tokens)
7. [Typography & Text Styling Standards](#7-typography--text-styling-standards)
8. [React Icons Usage & Guidelines](#8-react-icons-usage--guidelines)
9. [Internationalization (i18n) & RTL Support](#9-internationalization-i18n--rtl-support)
10. [Shared Components Catalog & Examples](#10-shared-components-catalog--examples)

---

## 1. Initial Setup & Local Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm`
- **Git** installed and configured with your GitHub account

### First-Time Installation Steps
```bash
# 1. Clone the official repository to your machine
git clone https://github.com/devnova-team/Gym_managment_system_F.git

# 2. Navigate into the repository directory
cd Gym_managment_system_F

# 3. Open the folder in your IDE (e.g. VS Code, Cursor)
code .

# 4. Install all dependencies
npm i

# 5. Start the local development server
npm run dev
```

The application will launch on:
👉 **`http://localhost:3000`**

---

## 2. Git Workflow & Pull Request (PR) Policy

Every team member must follow this exact step-by-step workflow for all features, bug fixes, or enhancements.

### Step-by-Step Implementation Workflow
*(Example: Developer **Moamen** assigned to **Feature 3**)*

```bash
# Step 1: Switch to main branch
git checkout main

# Step 2: Pull the latest changes from remote
git pull

# Step 3: Create your dedicated working branch
# Choose the branch type: /ui for layout/styling or /api/integration for endpoint wiring
git checkout -b moamen/feature/three/ui
# OR for API integration phase:
# git checkout -b moamen/feature/three/api/integration

# Step 4: Implement all required components, logic, and tests
# (Edit files in src/...)

# Step 5: Stage all your changes
git add .

# Step 6: Commit using Conventional Commits format
git commit -m "feat(communication): build WhatsApp outreach tab and segment filters"

# Step 7: Push your branch to GitHub
git push -u origin moamen/feature/three/ui
```

### Step 8: GitHub Pull Request (PR) Protocol
After pushing your branch to GitHub:

1. **Open PR #1 (Production)**:
   - Target Branch: **`main`**
   - Source Branch: **`<your-branch-name>`** (e.g. `moamen/feature/three/ui`)
   - Purpose: Review for production deployment.
2. **Open PR #2 (Staging)**:
   - Target Branch: **`staging`**
   - Source Branch: **The SAME branch** (e.g. `moamen/feature/three/ui`)
   - Purpose: Review and integration testing on the staging environment.
3. ⚠️ **MANDATORY MERGE RULE**:
   > **DO NOT MERGE ANY PR ON YOUR OWN.**
   > All PRs must be reviewed, approved, and merged exclusively by the **Team Leader**.

---

## 3. Feature Development Lifecycle

To maintain high velocity and clean git history, split each feature into two distinct phases:

```
Feature Assignment
       │
       ├──► Phase 1: UI Implementation Branch (`<member>/feature/<number>/ui`)
       │     - Build page views, modals, cards, tabs, and tables
       │     - Use mock data or dummy state
       │     - Ensure Dark/Light mode and RTL/LTR look pixel-perfect
       │     - Open PRs on main & staging -> Team Leader Review
       │
       └──► Phase 2: API Integration Branch (`<member>/feature/<number>/api/integration`)
             - Inject endpoints into `src/Service/Apis/<featureApi>.js`
             - Replace mock data with RTK Query hooks
             - Implement optimistic updates, loading states, and error alerts
             - Open PRs on main & staging -> Team Leader Review
```

### Folder Placement Conventions
- Page components live in: `src/pages/<FeatureName>/index.jsx`
- Sub-components private to a feature live in: `src/pages/<FeatureName>/components/`
- Reusable components used across features live in: `src/components/`
- API endpoint injections live in: `src/Service/Apis/<featureApi>.js`
- ⚠️ **Path Casing**: Always use lowercase for folder names in imports:
  ```javascript
  // ✅ Correct
  import Members from '../pages/Members';
  import Loader from '../components/Loader';

  // ❌ INCORRECT (Breaks Vite HMR watcher on Windows)
  import Members from '../Pages/Members';
  import Loader from '../Components/Loader';
  ```

---

## 4. State Management & RTK Query Guidelines

FitPulse uses a centralized **RTK Query** architecture defined in `src/Service/baseApi.js`. You do **not** create a new API root; you inject your feature endpoints into `baseApi`.

### Step 1: Inject Endpoints in `src/Service/Apis/<featureApi>.js`
```javascript
import { baseApi } from '../baseApi';

export const communicationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Query: Fetch segmented members
        getSegmentedMembers: builder.query({
            query: (params) => ({
                url: '/members/segmented',
                method: 'GET',
                params,
            }),
            providesTags: ['Communication', 'Members'],
        }),

        // Mutation: Update message template
        updateMessageTemplate: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/message-templates/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['Communication'],
        }),
    }),
});

// Export auto-generated hooks
export const {
    useGetSegmentedMembersQuery,
    useUpdateMessageTemplateMutation,
} = communicationApi;
```

### Step 2: Using Queries in Components
```jsx
import { useGetSegmentedMembersQuery } from '../../Service/Apis/communicationApi';
import Loader from '../../components/Loader';

const CommunicationTab = () => {
    const { data, isLoading, isError, error, refetch } = useGetSegmentedMembersQuery({
        category: 'expiring',
    });

    if (isLoading) return <Loader isLoading={true} />;
    if (isError) return <div className="text-red-500">Error: {error?.data?.message || 'Failed to load'}</div>;

    const members = data?.data || [];

    return (
        <div>
            {members.map(member => (
                <div key={member.id}>{member.name}</div>
            ))}
        </div>
    );
};
```

### Step 3: Using Mutations in Components
```jsx
import { useUpdateMessageTemplateMutation } from '../../Service/Apis/communicationApi';

const EditTemplateForm = ({ templateId }) => {
    const [updateTemplate, { isLoading }] = useUpdateMessageTemplateMutation();

    const handleSave = async (formData) => {
        try {
            await updateTemplate({ id: templateId, body: formData.body }).unwrap();
            // Automatically refetches any query providing ['Communication'] tag
        } catch (err) {
            console.error('Failed to update template:', err);
        }
    };

    return (
        <button onClick={handleSave} disabled={isLoading} className="bg-btn-gradient px-4 py-2 rounded-xl">
            {isLoading ? 'Saving...' : 'Save Template'}
        </button>
    );
};
```

### Cache Tags Registered in `baseApi.js`
Always use one or more of these predefined tags for `providesTags` and `invalidatesTags`:
`'Auth'`, `'Members'`, `'Plans'`, `'Subscriptions'`, `'Attendance'`, `'Communication'`, `'Dashboard'`, `'Staff'`, `'Shifts'`, `'Expenses'`, `'Reports'`, `'Store'`, `'Equipment'`, `'Reminders'`.

---

## 5. Dark & Light Mode Architecture

FitPulse synchronizes Tailwind CSS dark mode and Mantine UI theme using `ThemeContext`.

### How It Works
- Light Mode: `<html>` has no `.dark` class, and `data-mantine-color-scheme="light"`.
- Dark Mode: `<html>` has `.dark` class, and `data-mantine-color-scheme="dark"`.

### Using the `useTheme` Hook
```jsx
import { useTheme } from '../Context/ThemeContext';

const MyComponent = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme}>
            Current: {isDarkMode ? 'Dark 🌙' : 'Light ☀️'}
        </button>
    );
};
```

### Styling Rules for Dark & Light
Always pair light and dark classes on every surface, text, and border:
```jsx
// Cards
<div className="bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-smoothCard p-5">
    {/* Headings */}
    <h3 className="text-slate-900 dark:text-white font-bold text-lg">Title</h3>
    {/* Body text */}
    <p className="text-slate-500 dark:text-slate-400 text-xs">Subtitle</p>
</div>
```

---

## 6. Color Palette & Design Tokens

FitPulse uses a signature **Electric Lime & Shadow Forest** theme.

### Brand Accent Palette
| Name | Hex Code | Tailwind / Custom Class | Recommended Use |
| :--- | :--- | :--- | :--- |
| **Electric Lime** | `#85F40F` | `text-[#85F40F]`, `bg-[#85F40F]` | Primary brand accent, active tabs, pulse dots |
| **Vibrant Leaf Green** | `#6CC80A` | `bg-[#6CC80A]` | Gradient end color, hover states |
| **Vibrant Lime Hover** | `#95E913` | `hover:bg-[#95E913]` | Button hover highlights |
| **Forest Shadow Dark** | `#275001` | `bg-brand-800` | Dark badge backgrounds, active pill tint |
| **Deep Forest Base** | `#061400` | `text-brand-950` | High-contrast text on lime buttons |

### Surfaces & Backgrounds
| Surface | Light Mode | Dark Mode | Class Syntax |
| :--- | :--- | :--- | :--- |
| **Main Page Background** | `#f8fafc` (slate-50) | `#0c101d` | `bg-slate-50 dark:bg-[#0c101d]` |
| **Card / Box Container** | `#ffffff` (white) | `#0e1517` | `bg-white dark:bg-[#0e1517]` |
| **Sidebar & Navbar** | `#ffffff` (white) | `#0e1517` | `bg-white dark:bg-[#0e1517]` |
| **Input Background** | `#f8fafc` (slate-50) | `#0c101d` | `bg-slate-50 dark:bg-[#0c101d]` |
| **Table / Card Borders** | `#e2e8f0` (slate-200) | `#1e293b` (slate-800) | `border-slate-200 dark:border-slate-800` |

### Gradients & Glows
- **Primary Action Button**: `className="bg-btn-gradient hover:bg-btn-gradient-hover text-brand-950 font-bold shadow-[0_0_18px_rgba(133,244,15,0.35)]"`
- **Active Tab Gradient**: `className="bg-tab-gradient"`
- **Subtle Neon Glow**: `className="shadow-[0_0_12px_rgba(133,244,15,0.25)]"`

---

## 7. Typography & Text Styling Standards

Fonts are automatically configured:
- **English & Latin Characters**: Inter (`--font-sans`)
- **Arabic Characters**: Cairo (`--font-arabic`)

### Hierarchy & Classes
```jsx
// 1. Page Title
<h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
    Page Title
</h1>

// 2. Section Heading
<h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
    Section Name
</h2>

// 3. Card Metric / Stat
<h3 className="text-2xl font-black text-slate-900 dark:text-white">
    1,248
</h3>

// 4. Subtitle / Helper Label
<p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
    Detailed explanatory note or subtitle.
</p>

// 5. Monospace ID / Code Snippet
<code className="font-mono text-xs text-[#85F40F] bg-[#85F40F]/10 px-2 py-0.5 rounded-md">
    MEM-2026-X
</code>
```

---

## 8. React Icons Usage & Guidelines

FitPulse imports icons from `react-icons`. Use standard icon packages consistently:
- `react-icons/fi`: Feather Icons (clean, minimal line icons)
- `react-icons/hi2`: Heroicons 2 (modern actions, checkmarks, arrows)
- `react-icons/ri`: Remix Icons (badges, shields, notifications, navigation)
- `react-icons/md`: Material Icons (fitness, status indicators)

### Standard Icon Conventions
```jsx
import { FiUsers, FiActivity } from 'react-icons/fi';
import { HiOutlineCheck, HiOutlinePlus } from 'react-icons/hi2';
import { RiWhatsappLine } from 'react-icons/ri';

// 1. Icon in KPI Card Box
<div className="w-10 h-10 rounded-xl bg-[#85F40F]/15 text-[#85F40F] flex items-center justify-center">
    <FiActivity size={20} />
</div>

// 2. Icon inside Primary Button
<button className="flex items-center gap-2 bg-btn-gradient text-brand-950 font-bold px-4 py-2.5 rounded-xl">
    <HiOutlinePlus size={18} />
    <span>Add Member</span>
</button>

// 3. WhatsApp Action Icon
<a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-400 transition-colors">
    <RiWhatsappLine size={18} />
</a>
```

---

## 9. Internationalization (i18n) & RTL Support

FitPulse fully supports **English (LTR)** and **Arabic (RTL)** with live dynamic switching.

### Step 1: Add Translation Keys
Always add keys to **BOTH**:
- `src/i18n/locales/en.json`
- `src/i18n/locales/ar.json`

Example (`en.json`):
```json
"communication": {
  "title": "Member Segments & Outreach",
  "sendWhatsApp": "Send WhatsApp Message",
  "expiringPrompt": "Your subscription expires in 3 days."
}
```

Example (`ar.json`):
```json
"communication": {
  "title": "تصنيفات المشتركين والتواصل",
  "sendWhatsApp": "إرسال رسالة واتساب",
  "expiringPrompt": "اشتراكك ينتهي خلال 3 أيام."
}
```

### Step 2: Use in Component via `useTranslation`
```jsx
import { useTranslation } from 'react-i18next';

const CommunicationHeader = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('communication.title', 'Member Segments & Outreach')}</h2>
            <button>{t('communication.sendWhatsApp', 'Send WhatsApp Message')}</button>
        </div>
    );
};
```

### Step 3: RTL-Safe CSS Rules
Never use directional hardcoded classes. Use logical CSS properties:
- ❌ Avoid: `text-left`, `text-right` ➔ ✅ Use: `text-start`, `text-end`
- ❌ Avoid: `ml-4`, `mr-4` ➔ ✅ Use: `ms-4` (margin start), `me-4` (margin end)
- ❌ Avoid: `pl-4`, `pr-4` ➔ ✅ Use: `ps-4`, `pe-4`

---

## 10. Shared Components Catalog & Examples

Before building a custom table, form, modal, or loader, inspect `src/components/` and reuse existing abstractions.

### 1. Data Tables (`src/components/Tables`)
```jsx
import {
    TableContainer,
    TableHeader,
    TableBody,
    TableSkeleton,
    TableEmptyState
} from '../../components/Tables';

const MembersTable = ({ data, isLoading }) => {
    const headers = [
        { label: 'Member Name', key: 'name' },
        { label: 'Phone', key: 'phone' },
        { label: 'Status', key: 'status' },
        { label: 'Actions', key: 'actions', align: 'text-end' },
    ];

    if (isLoading) return <TableSkeleton rows={5} columns={4} />;
    if (!data?.length) return <TableEmptyState message="No members found" />;

    return (
        <TableContainer minWidth="750px">
            <TableHeader columns={headers} />
            <TableBody>
                {data.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-white/2">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-white">{row.name}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{row.phone}</td>
                        <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-800/40 text-[#85F40F] border border-brand-600/30">
                                {row.status}
                            </span>
                        </td>
                        <td className="py-3 px-4 text-end">...</td>
                    </tr>
                ))}
            </TableBody>
        </TableContainer>
    );
};
```

### 2. Full-Page Loading Spinner (`src/components/Loader.jsx`)
```jsx
import Loader from '../../components/Loader';

// Inside component render:
if (isLoading) return <Loader isLoading={true} />;
```

### 3. Dynamic Form Modal (`src/components/DynamicForm`)
```jsx
import { DynamicFormModal } from '../../components/DynamicForm';
import TextInputField from '../../components/Forms/TextInputField';
import SelectField from '../../components/Forms/SelectField';
import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    plan: yup.string().required('Plan is required'),
});

const fields = [
    { name: 'name', label: 'Full Name', component: TextInputField, colSpan: 12 },
    {
        name: 'plan',
        label: 'Subscription Plan',
        component: SelectField,
        colSpan: 12,
        options: [
            { value: 'monthly', label: 'Monthly Plan' },
            { value: 'quarterly', label: '3-Month Plan' },
        ],
    },
];

<DynamicFormModal
    opened={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title="Register Member"
    fields={fields}
    validationSchema={schema}
    onSubmit={handleCreateMember}
    isLoading={isSubmitting}
/>
```

---

## 💡 Quick Checklist Before Submitting Your PR
- [ ] Switched to branch created from updated `main` (`git pull`).
- [ ] Named branch accurately: `<name>/feature/<number>/ui` or `<name>/feature/<number>/api/integration`.
- [ ] No hardcoded strings — all text uses `useTranslation` (`t('...')`) with Arabic and English keys.
- [ ] Dark and Light mode styles tested and visually verified.
- [ ] All table/page margins support RTL (`text-start`, `ms-*`, `me-*`).
- [ ] No lowercase/uppercase import casing mismatches (`../pages/`, not `../Pages/`).
- [ ] PR #1 opened against `main` (Production).
- [ ] PR #2 opened against `staging` (Staging).
- [ ] Awaiting Team Leader code review. Do **not** self-merge!

*Happy coding, DevNova Team! Let's build an extraordinary SaaS experience.* 🏋️‍♂️✨
