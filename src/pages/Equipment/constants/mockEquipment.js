import { addDays, todayISO } from '../../../utils/dateOnly';

// TEMPORARY (UI phase): dates are relative to today so every maintenance status shows up.
const today = todayISO();

export const MOCK_EQUIPMENT = [
    {
        id: 1,
        name: 'Treadmill T-900',
        purchase_date: addDays(today, -400),
        last_maintenance_date: addDays(today, -95),
        maintenance_interval_days: 90,
        created_at: '2026-01-10 10:00:00',
    },
    {
        id: 2,
        name: 'Leg Press Machine',
        purchase_date: addDays(today, -700),
        last_maintenance_date: addDays(today, -60),
        maintenance_interval_days: 60,
        created_at: '2026-01-10 10:05:00',
    },
    {
        id: 3,
        name: 'Rowing Machine',
        purchase_date: addDays(today, -200),
        last_maintenance_date: addDays(today, -20),
        maintenance_interval_days: 180,
        created_at: '2026-02-01 12:00:00',
    },
    {
        id: 4,
        name: 'Cable Crossover',
        purchase_date: addDays(today, -35),
        last_maintenance_date: null,
        maintenance_interval_days: 30,
        created_at: '2026-09-06 09:30:00',
    },
    {
        id: 5,
        name: 'Spin Bike #4',
        purchase_date: addDays(today, -150),
        last_maintenance_date: addDays(today, -27),
        maintenance_interval_days: 30,
        created_at: '2026-05-14 16:20:00',
    },
];
