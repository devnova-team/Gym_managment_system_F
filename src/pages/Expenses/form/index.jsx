import React from 'react';
import { useTranslation } from 'react-i18next';
import { RiWallet3Line, RiCheckLine } from 'react-icons/ri';
import { DynamicFormModal } from '../../../components/DynamicForm';
import DynamicFormFields from './dynamicFormFields';

const ExpenseFormModal = ({
    opened,
    onClose,
    onAddExpense,
    onEditExpense,
    initialExpense = null,
    isLoading = false
}) => {
    const { t } = useTranslation();
    const isEditMode = Boolean(initialExpense?.id);

    const { form } = DynamicFormFields({
        initialExpense,
        onAddExpense,
        onEditExpense,
        onClose,
        isLoading
    });

    return (
        <DynamicFormModal
            opened={opened}
            onClose={onClose}
            title={
                isEditMode
                    ? t('finance.editExpense', 'Edit Expense')
                    : t('finance.recordExpense', 'Record New Expense')
            }
            subtitle={t('finance.expensesSubtitle', 'Log and monitor facility rent, staff payroll, bills, and upkeep costs.')}
            icon={<RiWallet3Line size={20} className="text-[#85F40F]" />}
            fields={form.fields}
            validationSchema={form.validationSchema}
            defaultValues={form.defaultValues}
            onSubmit={async (data, formHelpers) => {
                const success = await form.onSubmit(data, formHelpers);
                if (success) {
                    onClose?.();
                }
            }}
            isLoading={form.isLoading}
            size="lg"
            submitText={isEditMode ? t('common.saveChanges', 'Save Changes') : t('finance.recordExpense', 'Record Expense')}
            submitIcon={<RiCheckLine size={18} />}
            cancelText={t('common.cancel', 'Cancel')}
        />
    );
};

export default ExpenseFormModal;