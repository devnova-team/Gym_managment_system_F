/**
 * Mock response and calculations for Feature 7: Comprehensive Financial Report
 * Formula:
 * Net Profit = (Subscription Revenue + Store Sales) - Total Operating Expenses
 */

export const mockFinancialData = {
    gym_id: 'gym-001',
    currency: 'EGP',

    // Monthly Period: October 2026 (Current) vs September 2026 (Previous)
    monthly: {
        periodName: 'October 2026',
        periodKey: 'month',
        previousPeriodName: 'September 2026',
        
        // Revenue
        subscriptionsRevenue: 122300,
        subscriptionsPrev: 108500,
        subscriptionsChange: '+12.7%',
        
        storeSalesRevenue: 23500,
        storeSalesPrev: 18200,
        storeSalesChange: '+29.1%',
        
        grossRevenue: 145800, // 122300 + 23500
        grossRevenuePrev: 126700,
        grossRevenueChange: '+15.1%',

        // Expenses
        operatingExpenses: 62400,
        operatingExpensesPrev: 65000,
        operatingExpensesChange: '-4.0%', // Reduction in expenses is positive
        
        // Net Profit = grossRevenue - operatingExpenses
        netProfit: 83400, // 145800 - 62400
        netProfitPrev: 61700, // 126700 - 65000
        netProfitChange: '+35.2%',
        profitMargin: 57.2, // (83400 / 145800) * 100
        profitMarginPrev: 48.7,

        // Itemized breakdown table
        lineItems: [
            {
                id: 'item-1',
                category: 'revenue',
                nameKey: 'finance.subRevenue',
                name: 'Subscriptions Cash Revenue',
                current: 122300,
                previous: 108500,
                variance: 13800,
                percentChange: '+12.7%',
                isPositive: true
            },
            {
                id: 'item-2',
                category: 'revenue',
                nameKey: 'finance.storeSales',
                name: 'Internal Store & POS Sales',
                current: 23500,
                previous: 18200,
                variance: 5300,
                percentChange: '+29.1%',
                isPositive: true
            },
            {
                id: 'item-3',
                category: 'subtotal_revenue',
                nameKey: 'finance.grossRevenue',
                name: 'Total Gross Revenue',
                current: 145800,
                previous: 126700,
                variance: 19100,
                percentChange: '+15.1%',
                isPositive: true,
                isBold: true
            },
            {
                id: 'item-4',
                category: 'expense',
                nameKey: 'finance.rent',
                name: 'Facility Lease / Rent',
                current: 25000,
                previous: 25000,
                variance: 0,
                percentChange: '0.0%',
                isPositive: true
            },
            {
                id: 'item-5',
                category: 'expense',
                nameKey: 'finance.salaries',
                name: 'Trainers & Staff Payroll',
                current: 22000,
                previous: 22000,
                variance: 0,
                percentChange: '0.0%',
                isPositive: true
            },
            {
                id: 'item-6',
                category: 'expense',
                nameKey: 'finance.bills',
                name: 'Utility Bills (Power, Water, Net)',
                current: 7000,
                previous: 8200,
                variance: -1200,
                percentChange: '-14.6%',
                isPositive: true // Less expense is positive
            },
            {
                id: 'item-7',
                category: 'expense',
                nameKey: 'finance.maintenance',
                name: 'Machine Service & Repairs',
                current: 5300,
                previous: 6100,
                variance: -800,
                percentChange: '-13.1%',
                isPositive: true
            },
            {
                id: 'item-8',
                category: 'expense',
                nameKey: 'finance.other',
                name: 'Sanitizers & Operational Supplies',
                current: 3100,
                previous: 3700,
                variance: -600,
                percentChange: '-16.2%',
                isPositive: true
            },
            {
                id: 'item-9',
                category: 'subtotal_expense',
                nameKey: 'finance.totalExpenses',
                name: 'Total Operational Expenses',
                current: 62400,
                previous: 65000,
                variance: -2600,
                percentChange: '-4.0%',
                isPositive: true,
                isBold: true
            },
            {
                id: 'item-10',
                category: 'net_profit',
                nameKey: 'finance.netProfitResult',
                name: 'Net Operating Profit',
                current: 83400,
                previous: 61700,
                variance: 21700,
                percentChange: '+35.2%',
                isPositive: true,
                isHighlight: true
            }
        ]
    },

    // Quarterly Period: Q3 2026 vs Q2 2026
    quarterly: {
        periodName: 'Q3 2026 (Jul - Sep)',
        periodKey: 'quarter',
        previousPeriodName: 'Q2 2026 (Apr - Jun)',

        subscriptionsRevenue: 345000,
        subscriptionsPrev: 310000,
        subscriptionsChange: '+11.3%',

        storeSalesRevenue: 66500,
        storeSalesPrev: 52000,
        storeSalesChange: '+27.9%',

        grossRevenue: 411500,
        grossRevenuePrev: 362000,
        grossRevenueChange: '+13.7%',

        operatingExpenses: 185500,
        operatingExpensesPrev: 181500,
        operatingExpensesChange: '+2.2%',

        netProfit: 226000,
        netProfitPrev: 180500,
        netProfitChange: '+25.2%',
        profitMargin: 54.9,
        profitMarginPrev: 49.9,

        lineItems: [
            {
                id: 'q-item-1',
                category: 'revenue',
                nameKey: 'finance.subRevenue',
                name: 'Subscriptions Cash Revenue',
                current: 345000,
                previous: 310000,
                variance: 35000,
                percentChange: '+11.3%',
                isPositive: true
            },
            {
                id: 'q-item-2',
                category: 'revenue',
                nameKey: 'finance.storeSales',
                name: 'Internal Store & POS Sales',
                current: 66500,
                previous: 52000,
                variance: 14500,
                percentChange: '+27.9%',
                isPositive: true
            },
            {
                id: 'q-item-3',
                category: 'subtotal_revenue',
                nameKey: 'finance.grossRevenue',
                name: 'Total Gross Revenue',
                current: 411500,
                previous: 362000,
                variance: 49500,
                percentChange: '+13.7%',
                isPositive: true,
                isBold: true
            },
            {
                id: 'q-item-4',
                category: 'subtotal_expense',
                nameKey: 'finance.totalExpenses',
                name: 'Total Operational Expenses',
                current: 185500,
                previous: 181500,
                variance: 4000,
                percentChange: '+2.2%',
                isPositive: false,
                isBold: true
            },
            {
                id: 'q-item-5',
                category: 'net_profit',
                nameKey: 'finance.netProfitResult',
                name: 'Net Operating Profit',
                current: 226000,
                previous: 180500,
                variance: 45500,
                percentChange: '+25.2%',
                isPositive: true,
                isHighlight: true
            }
        ]
    },

    // Yearly Period: 2026 (YTD) vs 2025
    yearly: {
        periodName: 'Year 2026 (Full Year Projection)',
        periodKey: 'year',
        previousPeriodName: 'Year 2025',

        subscriptionsRevenue: 1380000,
        subscriptionsPrev: 1150000,
        subscriptionsChange: '+20.0%',

        storeSalesRevenue: 245000,
        storeSalesPrev: 175000,
        storeSalesChange: '+40.0%',

        grossRevenue: 1625000,
        grossRevenuePrev: 1325000,
        grossRevenueChange: '+22.6%',

        operatingExpenses: 740000,
        operatingExpensesPrev: 710000,
        operatingExpensesChange: '+4.2%',

        netProfit: 885000,
        netProfitPrev: 615000,
        netProfitChange: '+43.9%',
        profitMargin: 54.5,
        profitMarginPrev: 46.4,

        lineItems: [
            {
                id: 'y-item-1',
                category: 'revenue',
                nameKey: 'finance.subRevenue',
                name: 'Subscriptions Cash Revenue',
                current: 1380000,
                previous: 1150000,
                variance: 230000,
                percentChange: '+20.0%',
                isPositive: true
            },
            {
                id: 'y-item-2',
                category: 'revenue',
                nameKey: 'finance.storeSales',
                name: 'Internal Store & POS Sales',
                current: 245000,
                previous: 175000,
                variance: 70000,
                percentChange: '+40.0%',
                isPositive: true
            },
            {
                id: 'y-item-3',
                category: 'subtotal_revenue',
                nameKey: 'finance.grossRevenue',
                name: 'Total Gross Revenue',
                current: 1625000,
                previous: 1325000,
                variance: 300000,
                percentChange: '+22.6%',
                isPositive: true,
                isBold: true
            },
            {
                id: 'y-item-4',
                category: 'subtotal_expense',
                nameKey: 'finance.totalExpenses',
                name: 'Total Operational Expenses',
                current: 740000,
                previous: 710000,
                variance: 30000,
                percentChange: '+4.2%',
                isPositive: false,
                isBold: true
            },
            {
                id: 'y-item-5',
                category: 'net_profit',
                nameKey: 'finance.netProfitResult',
                name: 'Net Operating Profit',
                current: 885000,
                previous: 615000,
                variance: 270000,
                percentChange: '+43.9%',
                isPositive: true,
                isHighlight: true
            }
        ]
    },

    // 12-Month Historical Trend for Charting
    trend: {
        labels: {
            en: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            ar: ['نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر']
        },
        revenue: [95000, 102000, 110000, 108000, 118000, 125000, 128000, 134000, 137000, 141000, 143000, 145800],
        expenses: [55000, 58000, 60000, 59000, 61000, 62000, 60000, 63000, 59500, 61000, 65000, 62400],
        profit: [40000, 44000, 50000, 49000, 57000, 63000, 68000, 71000, 77500, 80000, 78000, 83400]
    },

    // Empty Period Mock (Doc Page 26 Edge Case)
    emptyPeriod: {
        periodName: 'Custom Period (No Data)',
        periodKey: 'empty',
        subscriptionsRevenue: 0,
        storeSalesRevenue: 0,
        grossRevenue: 0,
        operatingExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        lineItems: []
    }
};
