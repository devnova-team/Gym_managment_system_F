export const EXPENSES_TABLE_HEADERS = [
    { key: 'category', labelKey: 'finance.category', fallback: 'Category', width: '18%' },
    { key: 'description', labelKey: 'finance.details', fallback: 'Details / Description', width: '32%' },
    { key: 'nature', labelKey: 'finance.nature', fallback: 'Nature', width: '14%' },
    { key: 'date', labelKey: 'finance.date', fallback: 'Date', width: '14%' },
    { key: 'amount', labelKey: 'finance.amount', fallback: 'Amount', width: '14%' },
    { key: 'actions', labelKey: 'common.actions', fallback: 'Actions', width: '8%', align: 'center' }
];

export const getExpensesTableHeaders = (t = (key, fallback) => fallback) => {
    return EXPENSES_TABLE_HEADERS.map((col) => {
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

export default getExpensesTableHeaders;