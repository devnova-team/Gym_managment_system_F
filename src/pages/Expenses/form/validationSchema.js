import * as Yup from 'yup';

export const getExpenseValidationSchema = (t = (key, fallback) => fallback) => {
    return Yup.object().shape({
        title: Yup.string()
            .trim()
            .required(t('finance.titleRequired', t('finance.requiredField', 'Expense title is required')))
            .min(3, t('finance.titleMin', 'Expense title must be at least 3 characters'))
            .max(100, t('finance.titleMax', 'Expense title cannot exceed 100 characters')),
        amount: Yup.string()
            .transform((value) => (value !== undefined && value !== null ? String(value) : ''))
            .trim()
            .required(t('finance.requiredField', 'Amount is required'))
            .matches(/^\d+(\.\d+)?$/, t('finance.invalidAmount', 'Amount must be a valid number'))
            .test(
                'min-amount',
                t('finance.amountMin', 'Amount must be at least 0.01'),
                (value) => {
                    const num = Number(value);
                    return !isNaN(num) && num >= 0.01;
                }
            )
            .test(
                'max-amount',
                t('finance.amountMax', 'Amount cannot exceed 10,000,000'),
                (value) => {
                    const num = Number(value);
                    return !isNaN(num) && num <= 10000000;
                }
            ),
        category: Yup.string()
            .required(t('finance.requiredField', 'Category is required')),
        type: Yup.string()
            .oneOf(['fixed', 'variable'], t('finance.invalidType', 'Invalid expense nature'))
            .required(t('finance.requiredField', 'Expense nature is required')),
        expense_date: Yup.string()
            .required(t('finance.requiredField', 'Expense date is required'))
            .test(
                'min-date',
                t('finance.dateMin', 'Expense date cannot be earlier than year 2000'),
                (val) => {
                    if (!val) return true;
                    return new Date(val).getFullYear() >= 2000;
                }
            )
            .test(
                'max-date',
                t('finance.dateMax', 'Expense date cannot be more than 1 year in the future'),
                (val) => {
                    if (!val) return true;
                    const d = new Date(val);
                    const maxFuture = new Date();
                    maxFuture.setFullYear(maxFuture.getFullYear() + 1);
                    return d <= maxFuture;
                }
            ),
        vendor: Yup.string()
            .trim()
            .transform((val) => (val === '' ? null : val))
            .nullable()
            .min(2, t('finance.vendorMin', 'Vendor name must be at least 2 characters'))
            .max(100, t('finance.vendorMax', 'Vendor name cannot exceed 100 characters')),
        receipt_number: Yup.string()
            .trim()
            .transform((val) => (val === '' ? null : val))
            .nullable()
            .min(2, t('finance.receiptMin', 'Receipt number must be at least 2 characters'))
            .max(50, t('finance.receiptMax', 'Receipt number cannot exceed 50 characters')),
        notes: Yup.string()
            .trim()
            .transform((val) => (val === '' ? null : val))
            .nullable()
            .max(500, t('finance.notesMax', 'Notes cannot exceed 500 characters')),
    });
};

export const expenseValidationSchema = getExpenseValidationSchema();

export default getExpenseValidationSchema;