import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockFinancialData } from '../constants/mockFinancialData';
import { useTablePagination } from '../../../utils/useUrlPagination';

export const useFinancialReport = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. URL Synced Period Selector ('monthly' | 'quarterly' | 'yearly' | 'custom' | 'empty')
    const selectedPeriod = searchParams.get('period') || 'monthly';
    const setSelectedPeriod = useCallback((period) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (period === 'monthly') {
                next.delete('period');
            } else {
                next.set('period', period);
            }
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    // 2. Custom Date Range State
    const [customRange, setCustomRange] = useState({
        startDate: '2026-09-01',
        endDate: '2026-10-31'
    });

    // 3. UI States (Loading & Empty Mode Toggle like Feature 3)
    const [isLoading, setIsLoading] = useState(false);
    const [isEmptyMode, setIsEmptyMode] = useState(false);

    // 4. Table Pagination for Audit Line Items
    const {
        page,
        setPage,
        pageSize,
        handlePageSizeChange
    } = useTablePagination(
        { page: 'tablePage', pageSize: 'tablePageSize' },
        { page: 1, pageSize: 10 }
    );

    // Toggle Empty State demo mode
    const toggleEmptyMode = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsEmptyMode((prev) => !prev);
            setIsLoading(false);
        }, 300);
    }, []);

    // Active Report Data calculation based on period selection
    const reportData = useMemo(() => {
        if (isEmptyMode || selectedPeriod === 'empty') {
            return mockFinancialData.emptyPeriod;
        }

        switch (selectedPeriod) {
            case 'quarterly':
                return mockFinancialData.quarterly;
            case 'yearly':
                return mockFinancialData.yearly;
            case 'custom':
                return {
                    ...mockFinancialData.monthly,
                    periodName: `Custom Range (${customRange.startDate} → ${customRange.endDate})`,
                    previousPeriodName: 'Preceding Equivalent Range'
                };
            case 'monthly':
            default:
                return mockFinancialData.monthly;
        }
    }, [selectedPeriod, isEmptyMode, customRange]);

    const isPeriodEmpty = isEmptyMode || selectedPeriod === 'empty' || (reportData.lineItems?.length || 0) === 0;

    // Paginated Line Items for the Table
    const allLineItems = reportData.lineItems || [];
    const totalLineItems = allLineItems.length;
    const totalPages = Math.ceil(totalLineItems / pageSize) || 1;
    const paginatedLineItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return allLineItems.slice(start, start + pageSize);
    }, [allLineItems, page, pageSize]);

    // Trend Data
    const trendData = mockFinancialData.trend;

    // Export to CSV with UTF-8 BOM for perfect Excel compatibility in Arabic & English
    const exportToCSV = useCallback(() => {
        const rows = [
            ['Gym Management System - Executive Financial Statement'],
            [`Gym ID: ${mockFinancialData.gym_id}`],
            [`Period: ${reportData.periodName} (vs ${reportData.previousPeriodName})`],
            [`Gross Revenue: ${reportData.grossRevenue} EGP (${reportData.grossRevenueChange || 'N/A'})`],
            [`Operating Expenses: ${reportData.operatingExpenses} EGP (${reportData.operatingExpensesChange || 'N/A'})`],
            [`Net Profit: ${reportData.netProfit} EGP (${reportData.netProfitChange || 'N/A'})`],
            [`Profit Margin: ${reportData.profitMargin}%`],
            [''],
            ['Line Item', 'Category', 'Current Period (EGP)', 'Previous Period (EGP)', 'Variance (EGP)', 'Growth %']
        ];

        allLineItems.forEach((item) => {
            rows.push([
                `"${(item.name || '').replace(/"/g, '""')}"`,
                item.category,
                item.current,
                item.previous,
                item.variance,
                item.percentChange
            ]);
        });

        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e) => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `GMS_Financial_Report_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [reportData, selectedPeriod, allLineItems]);

    return {
        // Period & Range
        selectedPeriod,
        setSelectedPeriod,
        customRange,
        setCustomRange,

        // Report Data & Metrics
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

        // UI States & Actions
        isLoading,
        setIsLoading,
        isEmptyMode,
        toggleEmptyMode,
        exportToCSV
    };
};

export default useFinancialReport;
