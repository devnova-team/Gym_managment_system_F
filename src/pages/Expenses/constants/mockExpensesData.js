export const EXPENSE_CATEGORIES = [
    { key: 'rent', labelKey: 'finance.rent', color: 'violet', icon: 'RiBuildingLine' },
    { key: 'salaries', labelKey: 'finance.salaries', color: 'emerald', icon: 'RiUserStarLine' },
    { key: 'bills', labelKey: 'finance.bills', color: 'amber', icon: 'RiFlashlightLine' },
    { key: 'maintenance', labelKey: 'finance.maintenance', color: 'cyan', icon: 'RiToolsLine' },
    { key: 'other', labelKey: 'finance.other', color: 'orange', icon: 'RiMoreLine' }
];

export const EXPENSE_TYPES = [
    { key: 'fixed', labelKey: 'finance.fixed' },
    { key: 'variable', labelKey: 'finance.variable' }
];

export const getExpenseCategoryOptions = (t = (key, fallback) => fallback) =>
    EXPENSE_CATEGORIES.map((cat) => ({
        value: cat.key,
        label: t(cat.labelKey, cat.key)
    }));

export const getExpenseTypeOptions = (t = (key, fallback) => fallback) =>
    EXPENSE_TYPES.map((type) => ({
        value: type.key,
        label: t(type.labelKey, type.key)
    }));

export const mockExpensesList = [
    {
        id: 'exp-001',
        gym_id: 'gym-001',
        category: 'rent',
        type: 'fixed',
        title: 'Gym Facility Monthly Rent',
        amount: 25000,
        expense_date: '2026-10-01',
        vendor: 'Al-Noor Real Estate Group',
        receipt_number: 'REC-2026-1001',
        notes: 'Main floor and crossfit mezzanine lease payment for October'
    },
    {
        id: 'exp-002',
        gym_id: 'gym-001',
        category: 'salaries',
        type: 'fixed',
        title: 'Trainers & Front Desk Payroll',
        amount: 22000,
        expense_date: '2026-10-01',
        vendor: 'Staff Payroll (4 Coaches, 2 Receptionists)',
        receipt_number: 'PAY-2026-10',
        notes: 'Monthly fixed salary base for coaching and desk staff'
    },
    {
        id: 'exp-003',
        gym_id: 'gym-001',
        category: 'bills',
        type: 'variable',
        title: 'Commercial Electricity Bill',
        amount: 4850,
        expense_date: '2026-09-28',
        vendor: 'South Cairo Electricity Distribution Co.',
        receipt_number: 'ELEC-98214',
        notes: 'September air-conditioners and lighting consumption'
    },
    {
        id: 'exp-004',
        gym_id: 'gym-001',
        category: 'maintenance',
        type: 'variable',
        title: 'Treadmill Cables & Motor Service',
        amount: 3200,
        expense_date: '2026-09-25',
        vendor: 'TechnoGym Certified Service Center',
        receipt_number: 'SERV-4412',
        notes: 'Replaced running belts and lubricated motors on 3 treadmills'
    },
    {
        id: 'exp-005',
        gym_id: 'gym-001',
        category: 'bills',
        type: 'fixed',
        title: 'High-speed Fiber Internet & Sound System Subscription',
        amount: 950,
        expense_date: '2026-09-20',
        vendor: 'WE Telecom Egypt',
        receipt_number: 'NET-7719',
        notes: '200 Mbps fiber internet for gym sound and reception'
    },
    {
        id: 'exp-006',
        gym_id: 'gym-001',
        category: 'other',
        type: 'variable',
        title: 'Sanitizers, Towels & Floor Cleaning Detergents',
        amount: 1850,
        expense_date: '2026-09-18',
        vendor: 'CleanZone Supplies',
        receipt_number: 'INV-3109',
        notes: 'Monthly bulk package of gym sanitizer wipes and mop heads'
    },
    {
        id: 'exp-007',
        gym_id: 'gym-001',
        category: 'bills',
        type: 'variable',
        title: 'Water Utility & Sanitation Bill',
        amount: 1200,
        expense_date: '2026-09-15',
        vendor: 'Greater Cairo Water Company',
        receipt_number: 'WAT-5542',
        notes: 'Shower facilities and bathroom water bill'
    },
    {
        id: 'exp-008',
        gym_id: 'gym-001',
        category: 'maintenance',
        type: 'variable',
        title: 'Dumbbell Rack & Cable Cross Cable Replacement',
        amount: 2100,
        expense_date: '2026-09-10',
        vendor: 'IronForce Fitness Equipment',
        receipt_number: 'REP-1029',
        notes: 'Emergency cable replacement on functional trainer unit'
    },
    {
        id: 'exp-009',
        gym_id: 'gym-001',
        category: 'other',
        type: 'variable',
        title: 'Gym Marketing & Social Media Promotion Ads',
        amount: 3250,
        expense_date: '2026-09-05',
        vendor: 'Meta Ads Manager',
        receipt_number: 'META-66120',
        notes: 'Back-to-school promotional campaign for quarterly plans'
    }
];
