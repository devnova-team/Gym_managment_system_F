import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@mantine/core';
import { RiMoreLine, RiReceiptLine } from 'react-icons/ri';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { CATEGORY_ICONS, CATEGORY_STYLES } from './categoryStyles';
import ExpenseRowActions from './ExpenseRowActions';

const ExpenseRow = ({ item, isRTL, onEditExpense, onDeleteExpense }) => {
    const { t } = useTranslation();

    const CategoryIcon = CATEGORY_ICONS[item.category] || RiMoreLine;
    const categoryStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.other;

    return (
        <Table.Tr
            key={item.id}
            className="hover:bg-slate-50/70 dark:hover:bg-white/4 transition-colors text-xs border-b border-slate-100 dark:border-white/5"
        >
            {/* 1. Category with styled badge */}
            <Table.Td className="p-3.5">
                <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${categoryStyle}`}>
                        <CategoryIcon size={16} />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white capitalize whitespace-nowrap">
                        {t(`finance.${item.category}`, item.category)}
                    </span>
                </div>
            </Table.Td>

            {/* 2. Details / Description / Vendor */}
            <Table.Td className="p-3.5">
                <div className="min-w-0 max-w-xs sm:max-w-sm">
                    <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                        {item.vendor && <span className="font-medium">{item.vendor}</span>}
                        {item.receipt_number && (
                            <span
                                title={t('finance.receiptNumber', 'Receipt / Invoice #')}
                                className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono text-[10.5px]"
                            >
                                <RiReceiptLine size={12} className="shrink-0 text-slate-400 dark:text-slate-500" />
                                {item.receipt_number}
                            </span>
                        )}
                    </div>
                    {item.notes && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 italic">
                            {item.notes}
                        </p>
                    )}
                </div>
            </Table.Td>

            {/* 3. Nature: Fixed vs Variable */}
            <Table.Td className="p-3.5 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        item.type === 'fixed'
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}
                >
                    {t(`finance.${item.type}`, item.type)}
                </span>
            </Table.Td>

            {/* 4. Expense Date */}
            <Table.Td className="p-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap font-medium">
                {formatDate(item.expense_date, isRTL ? 'ar-EG' : 'en-US')}
            </Table.Td>

            {/* 5. Amount */}
            <Table.Td className="p-3.5 font-black text-sm text-rose-500 dark:text-rose-400 whitespace-nowrap text-start">
                {formatCurrency(item.amount, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
            </Table.Td>

            {/* 6. Action buttons (Edit & Delete) */}
            <Table.Td
                className="p-3.5 text-center! whitespace-nowrap"
                style={{ textAlign: 'center' }}
            >
                <ExpenseRowActions
                    item={item}
                    onEditExpense={onEditExpense}
                    onDeleteExpense={onDeleteExpense}
                />
            </Table.Td>
        </Table.Tr>
    );
};

export default ExpenseRow;