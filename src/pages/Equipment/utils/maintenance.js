import { addDays, getDueStatus } from '../../../utils/dateOnly';

/**
 * next_maintenance_due = (last_maintenance_date || purchase_date) + maintenance_interval_days
 *
 * When the API returns `next_maintenance_due`, it is used as-is so the backend stays the
 * single source of truth; the local calculation is only a fallback (and the form preview).
 */
export const getNextMaintenanceDue = ({
    next_maintenance_due,
    last_maintenance_date,
    purchase_date,
    maintenance_interval_days,
}) => {
    if (next_maintenance_due) return next_maintenance_due;

    const interval = Number(maintenance_interval_days);
    const baseDate = last_maintenance_date || purchase_date;
    if (!baseDate || !Number.isInteger(interval) || interval <= 0) return null;

    return addDays(baseDate, interval);
};

/** Adds the derived `next_maintenance_due` and `status` fields used by the UI. */
export const withMaintenanceStatus = (equipment, today) => {
    const nextDue = getNextMaintenanceDue(equipment);
    return {
        ...equipment,
        next_maintenance_due: nextDue,
        status: nextDue ? getDueStatus(nextDue, today) : null,
    };
};

/** Soonest (or most overdue) maintenance first; items without a due date go last. */
export const compareByNextDue = (a, b) => {
    if (!a.next_maintenance_due) return 1;
    if (!b.next_maintenance_due) return -1;
    return a.next_maintenance_due.localeCompare(b.next_maintenance_due);
};
