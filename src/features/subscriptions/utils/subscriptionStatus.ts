const DAY_MS = 24 * 60 * 60 * 1000;
export const EXPIRING_SOON_DAYS = 7;

export const SUBSCRIPTION_STATUSES = ['active', 'expiringSoon', 'expired'];

export const SUBSCRIPTION_STATUS_STYLES = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    expiringSoon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    expired: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

export const PAYMENT_STATUS_STYLES = {
    paid: 'bg-[#85F40F]/15 text-brand-800 dark:text-[#85F40F] border-[#85F40F]/30',
    unpaid: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20',
};

// Parses "YYYY-MM-DD" (or "YYYY-MM-DD HH:mm:ss") as a local date to avoid UTC day shifts.
const toLocalDate = (value) => {
    const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
};

const startOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

export const getDaysLeft = (endDate) => Math.round(
    (toLocalDate(endDate).getTime() - startOfToday().getTime()) / DAY_MS,
);

export const getSubscriptionStatus = (endDate) => {
    const daysLeft = getDaysLeft(endDate);
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= EXPIRING_SOON_DAYS) return 'expiringSoon';
    return 'active';
};
