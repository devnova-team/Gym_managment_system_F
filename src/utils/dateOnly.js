/**
 * Helpers for calendar dates stored as `YYYY-MM-DD` strings (the API date format).
 * All math is done in local time so a date never shifts by a day because of UTC conversion.
 */

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const DUE_STATUS = {
    OVERDUE: 'overdue',
    DUE: 'due',
    UPCOMING: 'upcoming',
};

/**
 * Parses a strict `YYYY-MM-DD` string. Returns null for malformed or impossible dates (e.g. 2026-02-30).
 */
export const parseISODate = (value) => {
    if (typeof value !== 'string') return null;

    const match = ISO_DATE_PATTERN.exec(value.trim());
    if (!match) return null;

    const [, year, month, day] = match.map(Number);
    const date = new Date(year, month - 1, day);

    const isRealDate =
        date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

    return isRealDate ? date : null;
};

export const isValidISODate = (value) => parseISODate(value) !== null;

export const toISODate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export const todayISO = () => toISODate(new Date());

export const addDays = (isoDate, days) => {
    const date = parseISODate(isoDate);
    if (!date) return null;
    date.setDate(date.getDate() + days);
    return toISODate(date);
};

export const addYears = (isoDate, years) => {
    const date = parseISODate(isoDate);
    if (!date) return null;
    date.setFullYear(date.getFullYear() + years);
    return toISODate(date);
};

/**
 * Whole days from `from` to `to` (positive when `to` is later).
 */
export const diffInDays = (from, to) => {
    const start = parseISODate(from);
    const end = parseISODate(to);
    if (!start || !end) return null;
    return Math.round((end - start) / MS_PER_DAY);
};

/**
 * Overdue  → the date has passed.
 * Due      → the date is today.
 * Upcoming → the date is still ahead.
 */
export const getDueStatus = (isoDate, today = todayISO()) => {
    const days = diffInDays(today, isoDate);
    if (days === null) return null;
    if (days < 0) return DUE_STATUS.OVERDUE;
    if (days === 0) return DUE_STATUS.DUE;
    return DUE_STATUS.UPCOMING;
};

/**
 * Formats a `YYYY-MM-DD` string for display without timezone shifts.
 */
export const formatISODate = (isoDate, locale = 'en') => {
    const date = parseISODate(isoDate);
    if (!date) return '-';
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
};
