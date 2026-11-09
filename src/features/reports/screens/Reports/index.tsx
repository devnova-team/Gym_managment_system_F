import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Grid } from '@mantine/core';
import { useTheme } from '@/shared/providers/ThemeContext';
import { useFinancialReport } from '@/features/reports/screens/Reports/hooks/useFinancialReport';

import ReportsHeader from '@/features/reports/screens/Reports/components/ReportsHeader';
import FinancialKPICards from '@/features/reports/screens/Reports/components/FinancialKPICards';
import PeriodSelector from '@/features/reports/screens/Reports/components/PeriodSelector';
import FinancialTrendChart from '@/features/reports/screens/Reports/components/FinancialTrendChart';
import RevenueStreamsChart from '@/features/reports/screens/Reports/components/RevenueStreamsChart';
import ExpensesBreakdownChart from '@/features/reports/screens/Reports/components/ExpensesBreakdownChart';
import ReportsTable from '@/features/reports/screens/Reports/table/index';
import FinancialEmptyState from '@/features/reports/screens/Reports/components/FinancialEmptyState';
import FinancialSkeleton from '@/features/reports/screens/Reports/components/FinancialSkeleton';

const Reports = () => {
    const { t } = useTranslation();
    const { isDarkMode } = useTheme();
    const tableHeaderRef = useRef(null);

    const {
        selectedPeriod,
        setSelectedPeriod,
        customRange,
        setCustomRange,
        reportData,
        trendData,
        isPeriodEmpty,
        allLineItems,
        paginatedLineItems,
        totalLineItems,
        totalPages,
        page,
        setPage,
        pageSize,
        handlePageSizeChange,
        isLoading,
        isEmptyMode,
        toggleEmptyMode
    } = useFinancialReport();

    if (isLoading) {
        return <FinancialSkeleton isDarkMode={isDarkMode} />;
    }

    return (
        <Box className={`w-full transition-all duration-300 ease-in-out ${isPeriodEmpty ? 'pb-2' : 'pb-10'}`}>
            <Stack gap={isPeriodEmpty ? 'md' : 'xl'}>
                {/* 1. Header: Title, Subtitle & Test Empty State Button */}
                <ReportsHeader
                    isEmptyMode={isEmptyMode}
                    toggleEmptyMode={toggleEmptyMode}
                    isDarkMode={isDarkMode}
                />

                {/* 2. Period Switcher & Table Page Size Filter */}
                <PeriodSelector
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                    customRange={customRange}
                    setCustomRange={setCustomRange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    isDarkMode={isDarkMode}
                />

                {/* If period has no data */}
                {isPeriodEmpty ? (
                    <FinancialEmptyState
                        onSelectMonthly={() => setSelectedPeriod('monthly')}
                        isDarkMode={isDarkMode}
                    />
                ) : (
                    <>
                        {/* 3. Primary KPI Cards: 6 Cards in 2 Rows of 3 via Mantine Grid */}
                        <div className="w-full">
                            <FinancialKPICards reportData={reportData} isDarkMode={isDarkMode} />
                        </div>

                        {/* 4. Financial Trend Chart: Full Width Single Row */}
                        <div className="w-full">
                            <FinancialTrendChart trendData={trendData} isDarkMode={isDarkMode} />
                        </div>

                        {/* 5. Two Doughnut Charts: Shared Row Beneath Trend */}
                        <Grid gutter="md" align="stretch" className="w-full">
                            {/* Doughnut 1: Revenue Streams */}
                            <Grid.Col span={{ base: 12, md: 6 }} className="flex flex-col">
                                <RevenueStreamsChart reportData={reportData} isDarkMode={isDarkMode} />
                            </Grid.Col>

                            {/* Doughnut 2: Expense Outflows Breakdown */}
                            <Grid.Col span={{ base: 12, md: 6 }} className="flex flex-col">
                                <ExpensesBreakdownChart reportData={reportData} isDarkMode={isDarkMode} />
                            </Grid.Col>
                        </Grid>

                        {/* 5. Detailed Audit Breakdown Table (Full Width) */}
                        <div className="w-full space-y-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-black text-slate-800 dark:text-white">
                                    {t('finance.financialSummary', 'Audit Breakdown & Variance')}
                                </h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                    {reportData.periodName} {t('finance.vsPreviousPeriod', 'vs')} {reportData.previousPeriodName}
                                </p>
                            </div>

                            <ReportsTable
                                lineItems={paginatedLineItems}
                                totalCount={totalLineItems}
                                page={page}
                                setPage={setPage}
                                pageSize={pageSize}
                                totalPages={totalPages}
                                isDarkMode={isDarkMode}
                                scrollRef={tableHeaderRef}
                            />
                        </div>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default Reports;
