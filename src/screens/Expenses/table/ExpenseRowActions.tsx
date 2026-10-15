import React from 'react';
import { useTranslation } from 'react-i18next';
import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';

const ExpenseRowActions = ({ item, onEditExpense, onDeleteExpense }) => {
    const { t } = useTranslation();

    return (
        <Group gap={6} justify="center" wrap="nowrap">
            {/* Edit Action */}
            {onEditExpense && (
                <Tooltip label={t('finance.editExpense', 'Edit Expense')} withArrow position="top">
                    <ActionIcon
                        variant="subtle"
                        size="md"
                        radius="md"
                        color="blue"
                        onClick={() => onEditExpense(item)}
                        className="hover:bg-blue-50! dark:hover:bg-blue-950/30! text-blue-600! dark:text-blue-400!"
                        aria-label={t('finance.editExpense', 'Edit Expense')}
                    >
                        <HiOutlinePencilSquare size={18} />
                    </ActionIcon>
                </Tooltip>
            )}

            {/* Delete Action */}
            {onDeleteExpense && (
                <Tooltip label={t('finance.deleteExpense', 'Delete Expense')} withArrow position="top">
                    <ActionIcon
                        variant="subtle"
                        size="md"
                        radius="md"
                        color="red"
                        onClick={() => onDeleteExpense(item)}
                        className="hover:bg-red-50! dark:hover:bg-red-950/30! text-red-600! dark:text-red-400!"
                        aria-label={t('finance.deleteExpense', 'Delete Expense')}
                    >
                        <HiOutlineTrash size={18} />
                    </ActionIcon>
                </Tooltip>
            )}
        </Group>
    );
};

export default ExpenseRowActions;
