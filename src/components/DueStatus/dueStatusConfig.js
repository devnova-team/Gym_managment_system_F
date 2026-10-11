import { DUE_STATUS } from '../../utils/dateOnly';

export const DUE_STATUS_ORDER = [DUE_STATUS.OVERDUE, DUE_STATUS.DUE, DUE_STATUS.UPCOMING];

export const DUE_STATUS_STYLES = {
    [DUE_STATUS.OVERDUE]: {
        badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
        dot: 'bg-rose-500',
    },
    [DUE_STATUS.DUE]: {
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        dot: 'bg-amber-500',
    },
    [DUE_STATUS.UPCOMING]: {
        badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
        dot: 'bg-sky-500',
    },
};

export const DUE_STATUS_FALLBACK_LABELS = {
    [DUE_STATUS.OVERDUE]: 'Overdue',
    [DUE_STATUS.DUE]: 'Due today',
    [DUE_STATUS.UPCOMING]: 'Upcoming',
};

/** Counts records per status. `getStatus` maps a record to one of DUE_STATUS. */
export const countByDueStatus = (records, getStatus) =>
    records.reduce(
        (counts, record) => {
            const status = getStatus(record);
            if (status) counts[status] += 1;
            return counts;
        },
        { [DUE_STATUS.OVERDUE]: 0, [DUE_STATUS.DUE]: 0, [DUE_STATUS.UPCOMING]: 0 }
    );
