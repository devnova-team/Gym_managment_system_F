import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Group, Stack, Text, Button } from '@mantine/core';
import { FiCalendar, FiSliders, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import PageSizeFilter from '../../../components/PageSizeFilter';
import DateField from '../../../components/Forms/DateField';
import { getReportPeriods, getReportPageSizeOptions } from '../constants/reportsFilters';

const PeriodSelector = ({
    selectedPeriod,
    setSelectedPeriod,
    customRange,
    setCustomRange,
    pageSize,
    onPageSizeChange,
    isDarkMode
}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    const periods = useMemo(() => getReportPeriods(t), [t]);
    const pageSizeOptions = useMemo(() => getReportPageSizeOptions(t, isRTL), [t, isRTL]);

    return (
        <Card
            radius="lg"
            p="md"
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}
            className="border shadow-smoothCard space-y-3"
        >
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Period Pills */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-1.5">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 me-2 flex items-center gap-1.5 ps-1">
                        <FiCalendar size={14} className="text-[#85F40F]" />
                        {t('finance.period', 'Reporting Period')}:
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-1.5">
                    {periods.map((p) => {
                        const isActive = selectedPeriod === p.key;
                        return (
                            <Button
                                key={p.key}
                                size="xs"
                                radius="xl"
                                variant={isActive ? 'filled' : 'default'}
                                onClick={() => setSelectedPeriod(p.key)}
                                style={
                                    isActive
                                        ? {
                                            background: 'linear-gradient(to right, #85F40F, #6CC80A)',
                                            color: '#061400',
                                            boxShadow: '0 0 15px rgba(133, 244, 15, 0.35)',
                                            fontWeight: 900,
                                            border: 'none'
                                        }
                                        : {
                                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
                                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
                                            color: isDarkMode ? '#cbd5e1' : '#475569',
                                            fontWeight: 700
                                        }
                                }
                                className={`w-full sm:w-auto transition-all duration-200 cursor-pointer text-xs ${
                                    isActive ? 'scale-102' : 'hover:scale-102'
                                }`}
                            >
                                {p.label}
                            </Button>
                        );
                    })}
                    </div>
                </div>

                {/* Right controls: Page Size Filter for the Table */}
                {onPageSizeChange && (
                    <div className="w-full sm:w-auto sm:self-start lg:self-auto">
                        <PageSizeFilter
                            id="reports-page-size-select"
                            name="reports_page_size"
                            value={pageSize}
                            onChange={onPageSizeChange}
                            defaultValue={10}
                            size="sm"
                            searchable={false}
                            clearable={false}
                            className="w-full sm:w-56"
                            options={pageSizeOptions}
                            leftSection={<FiSliders size={16} className="text-slate-400 dark:text-[#85F40F]" />}
                        />
                    </div>
                )}
            </div>

            {/* If Custom Period is active, render Mantine DateField inputs with indicators */}
            {selectedPeriod === 'custom' && (
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-4">
                    {/* Start Date Group with Indicator */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-[#85F40F] shadow-[0_0_8px_rgba(133,244,15,0.6)]" />
                            {t('common.startDate', 'Start Date')}:
                        </span>
                        <div className="w-48 sm:w-56">
                            <DateField
                                id="reports-custom-start"
                                name="custom_start_date"
                                placeholder={t('common.startDate', 'Start Date')}
                                size="sm"
                                value={customRange?.startDate || ''}
                                onChange={(val) =>
                                    setCustomRange?.((prev) => ({ ...prev, startDate: val || '' }))
                                }
                                classNames={{
                                    input: 'bg-slate-50! dark:bg-[#0e1517]! border-slate-200! dark:border-white/10! text-slate-800! dark:text-white! font-medium text-xs hover:border-[#85F40F]/60! focus:border-[#85F40F]! transition-all rounded-xl! h-10!'
                                }}
                            />
                        </div>
                    </div>

                    <span className="text-slate-400 dark:text-slate-600 hidden sm:inline-flex items-center">
                        {isRTL ? <FiArrowLeft size={16} /> : <FiArrowRight size={16} />}
                    </span>

                    {/* End Date Group with Indicator */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                            {t('common.endDate', 'End Date')}:
                        </span>
                        <div className="w-48 sm:w-56">
                            <DateField
                                id="reports-custom-end"
                                name="custom_end_date"
                                placeholder={t('common.endDate', 'End Date')}
                                size="sm"
                                value={customRange?.endDate || ''}
                                onChange={(val) =>
                                    setCustomRange?.((prev) => ({ ...prev, endDate: val || '' }))
                                }
                                classNames={{
                                    input: 'bg-slate-50! dark:bg-[#0e1517]! border-slate-200! dark:border-white/10! text-slate-800! dark:text-white! font-medium text-xs hover:border-[#85F40F]/60! focus:border-[#85F40F]! transition-all rounded-xl! h-10!'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default PeriodSelector;
