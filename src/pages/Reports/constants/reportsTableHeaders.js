export const REPORTS_TABLE_HEADERS = [
    { key: 'item', labelKey: 'finance.item', fallback: 'Financial Line Item', width: '32%' },
    { key: 'current', labelKey: 'finance.currentPeriod', fallback: 'Current Period', width: '18%' },
    { key: 'previous', labelKey: 'finance.previousPeriod', fallback: 'Previous Period', width: '18%' },
    { key: 'variance', labelKey: 'finance.variance', fallback: 'Variance (+/-)', width: '18%' },
    { key: 'change', labelKey: 'finance.changePercent', fallback: 'Growth %', width: '14%', align: 'center' }
];

export const getReportsTableHeaders = (t = (key, fallback) => fallback) => {
    return REPORTS_TABLE_HEADERS.map((col) => {
        const header = {
            label: t(col.labelKey, col.fallback),
            width: col.width
        };
        if (col.align) {
            header.align = col.align;
        }
        return header;
    });
};

export default getReportsTableHeaders;
