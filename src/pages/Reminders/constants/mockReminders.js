import { addDays, todayISO } from '../../../utils/dateOnly';

// TEMPORARY (UI phase): dates are relative to today so overdue / due / upcoming all show up.
const today = todayISO();

export const MOCK_REMINDERS = [
    {
        id: 1,
        title: 'Renew facility insurance',
        due_date: addDays(today, -3),
        note: 'Call the insurance company and confirm the new premium.',
        created_at: '2026-09-20 10:00:00',
    },
    {
        id: 2,
        title: 'Pay electricity bill',
        due_date: today,
        note: null,
        created_at: '2026-10-01 09:15:00',
    },
    {
        id: 3,
        title: 'Order new dumbbell set',
        due_date: addDays(today, 4),
        note: 'Check prices from at least two suppliers.',
        created_at: '2026-10-05 13:40:00',
    },
    {
        id: 4,
        title: 'Monthly staff meeting',
        due_date: addDays(today, 12),
        note: 'Agenda: shift schedule and cleaning rota.',
        created_at: '2026-10-06 18:00:00',
    },
];
