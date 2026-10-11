import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@mantine/core';
import { formatCurrency } from '../../../utils/formatters';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { RiExchangeDollarLine, RiArrowUpCircleLine, RiArrowDownCircleLine } from 'react-icons/ri';

const ReportRow = ({ item, isRTL }) => {
    const { t } = useTranslation();

    const isHighlight = Boolean(item.isHighlight);
    const isBold = Boolean(item.isBold || isHighlight);
    const isPositiveVariance = item.variance > 0;
    const isNeutral = item.variance === 0;

    // For expenses, a positive variance (spending more) is negative/bad, and vice-versa
    const isAdverse = item.category === 'expense' ? isPositiveVariance : !isPositiveVariance && !isNeutral;

    return (
        <Table.Tr
            key={item.id}
            className={`transition-colors text-xs border-b border-slate-100 dark:border-white/5 ${
                isHighlight
                    ? 'bg-[#85F40F]/10 dark:bg-[#85F40F]/15 font-black text-slate-900 dark:text-white'
                    : isBold
                        ? 'bg-slate-50/80 dark:bg-white/4 font-bold text-slate-900 dark:text-white'
                        : 'hover:bg-slate-50/70 dark:hover:bg-white/3 text-slate-700 dark:text-slate-300'
            }`}
        >
            {/* 1. Line Item Name with Category Badge / Icon */}
            <Table.Td className="p-3.5">
                <div className="flex items-center gap-2.5">
                    {item.category === 'revenue' && (
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
                            <RiArrowUpCircleLine size={14} />
                        </div>
                    )}
                    {item.category === 'expense' && (
                        <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center shrink-0">
                            <RiArrowDownCircleLine size={14} />
                        </div>
                    )}
                    {isHighlight && (
                        <div className="w-6 h-6 rounded-lg bg-[#85F40F]/25 border border-[#85F40F]/50 text-[#020617] dark:text-[#85F40F] flex items-center justify-center shrink-0">
                            <RiExchangeDollarLine size={15} />
                        </div>
                    )}

                    <span className={`${isBold ? 'font-black' : 'font-medium'} ${isHighlight ? 'text-[#065F46] dark:text-[#85F40F] text-sm' : 'text-slate-900 dark:text-slate-100'}`}>
                        {t(item.nameKey, item.name)}
                    </span>
                </div>
            </Table.Td>

            {/* 2. Current Period Amount */}
            <Table.Td className={`p-3.5 text-start whitespace-nowrap ${isBold ? 'font-black text-sm' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
                <span className={isHighlight ? 'text-[#065F46] dark:text-[#85F40F]' : ''}>
                    {formatCurrency(item.current, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
                </span>
            </Table.Td>

            {/* 3. Previous Period Amount */}
            <Table.Td className="p-3.5 text-start font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {formatCurrency(item.previous, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
            </Table.Td>

            {/* 4. Variance (+/-) */}
            <Table.Td className="p-3.5 text-start font-bold whitespace-nowrap">
                <span
                    className={
                        isNeutral
                            ? 'text-slate-400'
                            : isAdverse
                                ? 'text-rose-500 dark:text-rose-400'
                                : 'text-emerald-500 dark:text-emerald-400'
                    }
                >
                    {item.variance > 0 ? '+' : ''}
                    {formatCurrency(item.variance, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
                </span>
            </Table.Td>

            {/* 5. Growth % Pill */}
            <Table.Td
                className="p-3.5 text-center! whitespace-nowrap"
                style={{ textAlign: 'center' }}
            >
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        isNeutral
                            ? 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400 border-slate-200 dark:border-white/10'
                            : isAdverse
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}
                >
                    {isNeutral ? (
                        <FiMinus size={11} />
                    ) : isAdverse ? (
                        <FiTrendingDown size={12} />
                    ) : (
                        <FiTrendingUp size={12} />
                    )}
                    {item.changePercent}
                </span>
            </Table.Td>
        </Table.Tr>
    );
};

export default ReportRow;
