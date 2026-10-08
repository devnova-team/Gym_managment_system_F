export const EXPENSE_PERIODS = [
    { key: 'this_month', labelKey: 'common.thisMonth', fallback: 'This Month' },
    { key: 'last_month', labelKey: 'finance.lastMonth', fallback: 'Last Month' },
    { key: 'this_quarter', labelKey: 'finance.thisQuarter', fallback: 'This Quarter' },
    { key: 'this_year', labelKey: 'finance.thisYear', fallback: 'This Year' }
];

/**
 * Returns translated period options for the filter bar
 */
export const getExpensePeriods = (t = (key, fallback) => fallback) => {
    return EXPENSE_PERIODS.map((period) => ({
        key: period.key,
        label: t(period.labelKey, period.fallback)
    }));
};

export default getExpensePeriods;
