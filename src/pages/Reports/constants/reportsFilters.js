export const REPORT_PERIODS = [
    { key: 'monthly', labelKey: 'finance.monthly', fallback: 'Monthly (October 2026)' },
    { key: 'quarterly', labelKey: 'finance.quarterly', fallback: 'Quarterly (Q3 2026)' },
    { key: 'yearly', labelKey: 'finance.yearly', fallback: 'Full Year (2026)' },
    { key: 'custom', labelKey: 'finance.customPeriod', fallback: 'Custom Range' }
];

export const getReportPeriods = (t = (key, fallback) => fallback) => {
    return REPORT_PERIODS.map((period) => ({
        key: period.key,
        label: t(period.labelKey, period.fallback)
    }));
};

export const getReportPageSizeOptions = (t = (key, fallback) => fallback, isRTL = false) => [
    { value: '5', label: `5 ${t('common.perPage', isRTL ? 'لكل صفحة' : 'per page')}` },
    { value: '10', label: `10 ${t('common.perPage', isRTL ? 'لكل صفحة' : 'per page')}` },
    { value: '20', label: `20 ${t('common.perPage', isRTL ? 'لكل صفحة' : 'per page')}` }
];

export default getReportPeriods;
