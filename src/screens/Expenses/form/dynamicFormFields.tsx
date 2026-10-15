import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import TextInputField from '../../../components/Forms/TextInputField';
import SelectField from '../../../components/Forms/SelectField';
import DateField from '../../../components/Forms/DateField';
import {
    RiFileListLine,
    RiMoneyDollarCircleLine,
    RiCalendarLine,
    RiUserFollowLine,
    RiBillLine,
    RiPriceTag3Line,
    RiPieChartLine,
    RiStickyNoteLine
} from 'react-icons/ri';
import { getExpenseValidationSchema, expenseValidationSchema } from './validationSchema';
import { getExpenseCategoryOptions, getExpenseTypeOptions } from '../constants/mockExpensesData';

const inputClasses = {
    input: 'bg-slate-50! dark:bg-white/5! border-slate-200! dark:border-white/10! text-slate-900! dark:text-white! focus:[&:not([data-error]):not([data-invalid]):not([aria-invalid="true"])]:border-[#85F40F]! transition-colors rounded-xl!',
    label: 'text-xs! font-bold! text-slate-700! dark:text-slate-200! mb-1.5!',
    description: 'text-[11px] text-slate-400 mb-1',
    dropdown: 'bg-white! dark:bg-[#0e1517]! border border-slate-200! dark:border-white/10! rounded-xl! shadow-xl',
    option: 'text-xs! font-medium! hover:bg-slate-100! dark:hover:bg-white/10! rounded-lg!',
};

export const getExpenseDefaultValues = (initialExpense = null) => ({
    id: initialExpense?.id || undefined,
    title: initialExpense?.title || '',
    amount: initialExpense?.amount !== undefined && initialExpense?.amount !== null ? String(initialExpense.amount) : '',
    category: initialExpense?.category || 'rent',
    type: initialExpense?.type || 'fixed',
    expense_date: initialExpense?.expense_date || new Date().toISOString().split('T')[0],
    vendor: initialExpense?.vendor || '',
    receipt_number: initialExpense?.receipt_number || '',
    notes: initialExpense?.notes || ''
});


export const DynamicFormFields = ({
    initialExpense = null,
    onAddExpense,
    onEditExpense,
    onClose,
    isLoading = false
} = {}) => {
    const { t } = useTranslation();
    const isEditMode = Boolean(initialExpense?.id);

    // Memoized default values
    const defaultValues = useMemo(
        () => ({
            id: initialExpense?.id || undefined,
            title: initialExpense?.title || '',
            amount: initialExpense?.amount !== undefined && initialExpense?.amount !== null ? String(initialExpense.amount) : '',
            category: initialExpense?.category || 'rent',
            type: initialExpense?.type || 'fixed',
            expense_date: initialExpense?.expense_date || new Date().toISOString().split('T')[0],
            vendor: initialExpense?.vendor || '',
            receipt_number: initialExpense?.receipt_number || '',
            notes: initialExpense?.notes || ''
        }),
        [initialExpense]
    );

    const validationSchema = useMemo(() => getExpenseValidationSchema(t), [t]);
    const categoryOptions = useMemo(() => getExpenseCategoryOptions(t), [t]);
    const typeOptions = useMemo(() => getExpenseTypeOptions(t), [t]);

    const handleSubmit = useCallback(
        async (data, formHelpers) => {
            try {
                const payload = {
                    id: initialExpense?.id || `exp-${Date.now()}`,
                    gym_id: initialExpense?.gym_id || 'gym-001',
                    title: data.title?.trim() || t(`finance.${data.category}`, data.category),
                    category: data.category,
                    type: data.type,
                    amount: parseFloat(data.amount),
                    expense_date: data.expense_date,
                    vendor: data.vendor?.trim() || 'Internal Expense',
                    receipt_number: data.receipt_number?.trim() || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
                    notes: data.notes?.trim() || ''
                };

                if (isEditMode && onEditExpense) {
                    await onEditExpense(payload);
                } else if (onAddExpense) {
                    await onAddExpense(payload);
                }

                formHelpers?.reset?.();
                onClose?.();
                return true;
            } catch (error) {
                console.error('Error submitting expense form:', error);
                return false;
            }
        },
        [initialExpense, isEditMode, onAddExpense, onEditExpense, onClose, t]
    );

    const form = {
        fields: [
            {
                id: 'title',
                name: 'title',
                colSpan: 12,
                condition: () => true,
                component: ({ field, error }) => (
                    <TextInputField
                        {...field}
                        label={t('finance.expenseTitle', 'Expense Title / Description')}
                        placeholder={t('finance.expenseTitlePlaceholder', 'e.g. October Facility Rent, AC Repair, Electricity Bill')}
                        error={error}
                        required
                        leftSection={<RiFileListLine size={16} className="text-slate-400" />}
                        classNames={inputClasses}
                    />
                )
            },
            {
                id: 'amount',
                name: 'amount',
                colSpan: 6,
                condition: () => true,
                component: ({ field, error }) => (
                    <TextInputField
                        {...field}
                        value={field.value ?? ''}
                        type="text"
                        inputMode="decimal"
                        label={t('finance.amount', 'Amount (EGP)')}
                        placeholder="0.00"
                        error={error}
                        required
                        leftSection={<RiMoneyDollarCircleLine size={16} className="text-emerald-500" />}
                        rightSection={<span className="text-[11px] font-bold text-slate-400 pe-2">EGP</span>}
                        classNames={inputClasses}
                    />
                )
            },
            {
                id: 'expense_date',
                name: 'expense_date',
                colSpan: 6,
                condition: () => true,
                component: ({ field, error }) => (
                    <DateField
                        {...field}
                        label={t('finance.date', 'Expense Date')}
                        error={error}
                        required
                        leftSection={<RiCalendarLine size={16} className="text-slate-400 dark:text-[#85F40F]" />}
                        classNames={inputClasses}
                    />
                )
            },
            {
                id: 'category',
                name: 'category',
                colSpan: 6,
                condition: () => true,
                component: ({ field, error }) => (
                    <SelectField
                        {...field}
                        label={t('finance.category', 'Category')}
                        placeholder={t('finance.category', 'Category')}
                        searchable
                        data={categoryOptions}
                        error={error}
                        required
                        leftSection={<RiPriceTag3Line size={16} className="text-slate-400" />}
                        classNames={inputClasses}
                    />
                )
            },
            {
                id: 'type',
                name: 'type',
                colSpan: 6,
                condition: () => true,
                component: ({ field, error }) => (
                    <SelectField
                        {...field}
                        label={t('finance.nature', 'Expense Nature')}
                        placeholder={t('finance.nature', 'Expense Nature')}
                        searchable
                        data={typeOptions}
                        error={error}
                        required
                        leftSection={<RiPieChartLine size={16} className="text-slate-400" />}
                        classNames={inputClasses}
                    />
                )
            },
            {
                id: 'vendor',
                name: 'vendor',
                colSpan: 6,
                condition: () => true,
                component: ({ field, error }) => (
                    <TextInputField
                        {...field}
                        label={t('finance.vendor', 'Vendor / Payee')}
                        placeholder={t('finance.vendorPlaceholder', 'e.g. Al-Nasr AC Maintenance, Landlord')}
                        error={error}
                        leftSection={<RiUserFollowLine size={16} className="text-slate-400" />}
                        classNames={inputClasses}
                    />
                )
            },
            {
                id: 'receipt_number',
                name: 'receipt_number',
                colSpan: 6,
                condition: () => true,
                component: ({ field, error }) => (
                    <TextInputField
                        {...field}
                        label={t('finance.receiptNumber', 'Receipt / Invoice #')}
                        placeholder={t('finance.receiptPlaceholder', 'e.g. REC-9842')}
                        error={error}
                        leftSection={<RiBillLine size={16} className="text-slate-400" />}
                        classNames={inputClasses}
                    />
                )
            },
            {
                id: 'notes',
                name: 'notes',
                colSpan: 12,
                condition: () => true,
                component: ({ field, error }) => (
                    <TextInputField
                        {...field}
                        textarea
                        label={t('finance.notes', 'Internal Notes')}
                        placeholder={t('finance.notesPlaceholder', 'Additional audit details, payment method, bank ref...')}
                        error={error}
                        minRows={2.5}
                        autosize
                        leftSection={<RiStickyNoteLine size={16} className="text-slate-400" />}
                        classNames={inputClasses}
                    />
                )
            }
        ],
        validationSchema,
        onSubmit: handleSubmit,
        isLoading,
        defaultValues
    };

    return { form };
};

export { getExpenseValidationSchema, expenseValidationSchema };
export default DynamicFormFields;