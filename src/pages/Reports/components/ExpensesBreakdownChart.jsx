import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Doughnut } from 'react-chartjs-2';
import { Card, Group, Stack, Title, Text, Box, ThemeIcon, Badge } from '@mantine/core';
import { RiPieChartLine } from 'react-icons/ri';
import { formatCurrency, formatNumberByLocale } from '../../../utils/formatters';
import '../../../utils/chartConfig';

const CATEGORY_COLORS = {
    rent: '#8B5CF6',
    salaries: '#10B981',
    bills: '#F59E0B',
    maintenance: '#06B6D4',
    other: '#F97316'
};

const ExpensesBreakdownChart = ({ reportData, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    // Extract itemized expense categories from lineItems
    const expenseCategories = useMemo(() => {
        const items = reportData?.lineItems || [];
        const result = {
            rent: 0,
            salaries: 0,
            bills: 0,
            maintenance: 0,
            other: 0
        };

        let total = 0;

        items.forEach((item) => {
            if (item.category === 'expense') {
                if (item.nameKey === 'finance.rent') result.rent = item.current;
                else if (item.nameKey === 'finance.salaries') result.salaries = item.current;
                else if (item.nameKey === 'finance.bills') result.bills = item.current;
                else if (item.nameKey === 'finance.maintenance') result.maintenance = item.current;
                else if (item.nameKey === 'finance.other') result.other = item.current;
                total += item.current || 0;
            }
        });

        // Fallback to sample distribution if aggregated quarterly/yearly summary
        if (total === 0 && reportData?.operatingExpenses > 0) {
            const op = reportData.operatingExpenses;
            result.rent = Math.round(op * 0.40);
            result.salaries = Math.round(op * 0.35);
            result.bills = Math.round(op * 0.11);
            result.maintenance = Math.round(op * 0.09);
            result.other = Math.round(op * 0.05);
            total = op;
        }

        return { result, total };
    }, [reportData]);

    const { result, total } = expenseCategories;

    const activeCategories = useMemo(() => {
        const raw = [
            { key: 'rent', val: result.rent, label: t('finance.rent', 'Rent') },
            { key: 'salaries', val: result.salaries, label: t('finance.salaries', 'Salaries') },
            { key: 'bills', val: result.bills, label: t('finance.bills', 'Bills') },
            { key: 'maintenance', val: result.maintenance, label: t('finance.maintenance', 'Maintenance') },
            { key: 'other', val: result.other, label: t('finance.other', 'Other') }
        ];
        const nonZero = raw.filter((item) => item.val > 0);
        return nonZero.length > 0 ? nonZero : raw;
    }, [result, t]);

    const chartData = useMemo(() => {
        return {
            labels: [
                t('finance.rent', 'Rent'),
                t('finance.salaries', 'Salaries'),
                t('finance.bills', 'Bills'),
                t('finance.maintenance', 'Maintenance'),
                t('finance.other', 'Other')
            ],
            datasets: [
                {
                    data: [result.rent, result.salaries, result.bills, result.maintenance, result.other],
                    backgroundColor: [
                        CATEGORY_COLORS.rent,
                        CATEGORY_COLORS.salaries,
                        CATEGORY_COLORS.bills,
                        CATEGORY_COLORS.maintenance,
                        CATEGORY_COLORS.other
                    ],
                    borderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 6
                }
            ]
        };
    }, [result, isDarkMode, t]);

    const chartOptions = useMemo(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '74%',
            layout: { padding: 6 },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                    titleColor: isDarkMode ? '#ffffff' : '#0f172a',
                    bodyColor: isDarkMode ? '#ffffff' : '#0f172a',
                    borderColor: isDarkMode ? 'rgba(133, 244, 15, 0.3)' : 'rgba(226, 232, 240, 1)',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 10,
                    rtl: isRTL,
                    callbacks: {
                        label: (context) => {
                            const val = context.raw || 0;
                            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                            return ` ${context.label}: ${formatCurrency(val, 'EGP', isRTL ? 'ar-EG' : 'en-US')} (${pct}%)`;
                        }
                    }
                }
            }
        };
    }, [isDarkMode, isRTL, total]);

    return (
        <Card
            radius="lg"
            p="lg"
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                borderRadius: '16px'
            }}
            className="border shadow-smoothCard flex flex-col h-full flex-1"
        >
            {/* Header */}
            <div className="space-y-0.5 mb-2">
                <Group gap="xs">
                    <ThemeIcon
                        radius="md"
                        size={32}
                        style={{
                            backgroundColor: 'rgba(244, 63, 94, 0.15)',
                            color: '#f43f5e',
                            borderColor: 'rgba(244, 63, 94, 0.3)'
                        }}
                        className="border shrink-0"
                    >
                        <RiPieChartLine size={18} />
                    </ThemeIcon>
                    <Title
                        order={4}
                        style={{
                            color: isDarkMode ? '#ffffff' : '#1e293b',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        className="text-base font-black"
                    >
                        {t('finance.expensesBreakdown', 'Expense Outflows')}
                    </Title>
                </Group>
                <Text size="xs" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }} className="font-medium">
                    {t('finance.expensesSubtitle', 'Cost allocations by operational branch')}
                </Text>
            </div>

            {/* Doughnut Chart with Centered Total (fixed square so both cards match) */}
            <Box className="w-full flex items-center justify-center py-4">
            <Box className="relative w-64 h-64 sm:w-72 sm:h-72 max-w-full">
                {/* Centered Total behind canvas (z-0) */}
                <Stack gap={0} align="center" justify="center" className="absolute inset-0 pointer-events-none z-0 px-6">
                    <Title
                        order={2}
                        style={{
                            color: isDarkMode ? '#ffffff' : '#0f172a',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        className="text-xl sm:text-2xl font-black tracking-tight text-center whitespace-nowrap"
                    >
                        {formatCurrency(total, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
                    </Title>
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        className="text-[11px] font-semibold text-center mt-0.5"
                    >
                        {t('finance.totalExpenses', 'Total Expenses')}
                    </Text>
                </Stack>

                {/* Canvas layer with z-10 */}
                <Box className="w-full h-full relative z-10">
                    <Doughnut data={chartData} options={chartOptions} />
                </Box>
            </Box>
            </Box>

            {/* Category Breakdown Legend (fills remaining height so sibling cards align) */}
            <Group
                gap="xs"
                wrap="wrap"
                justify="center"
                className="flex-1 content-start pt-3 border-t border-slate-100 dark:border-white/5"
            >
                {activeCategories.map((item) => {
                    const pct = total > 0 ? Math.round((item.val / total) * 100) : 0;
                    const color = CATEGORY_COLORS[item.key] || '#85F40F';

                    return (
                        <Badge
                            key={item.key}
                            variant="outline"
                            size="md"
                            radius="xl"
                            leftSection={
                                <Box
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: `0 0 6px ${color}80`
                                    }}
                                />
                            }
                            style={{
                                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
                                color: isDarkMode ? '#e2e8f0' : '#1e293b',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '11px',
                                padding: '6px 10px',
                                height: '28px'
                            }}
                            className="border transition-all hover:scale-105"
                        >
                            <span className="inline-flex items-center gap-1.5" dir={isRTL ? 'rtl' : 'ltr'}>
                                <span>{item.label}</span>
                                <span style={{ opacity: 0.5 }}>•</span>
                                <span>{formatCurrency(item.val, 'EGP', isRTL ? 'ar-EG' : 'en-US')}</span>
                                <span dir="ltr">({formatNumberByLocale(pct, isRTL)}%)</span>
                            </span>
                        </Badge>
                    );
                })}
            </Group>
        </Card>
    );
};

export default ExpensesBreakdownChart;
