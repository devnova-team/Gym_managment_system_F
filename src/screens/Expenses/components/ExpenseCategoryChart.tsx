import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Doughnut } from 'react-chartjs-2';
import { Card, Group, Stack, Title, Text, Box, ThemeIcon, Badge } from '@mantine/core';
import { FiPieChart } from 'react-icons/fi';
import { getChartBaseOptions } from '../../../utils/chartConfig';
import { formatCurrency, formatNumberByLocale } from '../../../utils/formatters';

const CATEGORY_COLORS = {
    rent: '#8B5CF6',
    salaries: '#10B981',
    bills: '#F59E0B',
    maintenance: '#06B6D4',
    other: '#F97316'
};

const ExpenseCategoryChart = ({ expenses = [], isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    const categoryTotals = useMemo(() => {
        const totals = {
            rent: 0,
            salaries: 0,
            bills: 0,
            maintenance: 0,
            other: 0
        };

        let grandTotal = 0;

        expenses.forEach((item) => {
            const amt = Number(item.amount) || 0;
            const cat = item.category in totals ? item.category : 'other';
            totals[cat] += amt;
            grandTotal += amt;
        });

        return { totals, grandTotal };
    }, [expenses]);

    const { totals, grandTotal } = categoryTotals;

    const activeCategories = useMemo(() => {
        const entries = Object.entries(totals);
        const nonZero = entries.filter(([, amt]) => amt > 0);
        return nonZero.length > 0 ? nonZero : entries;
    }, [totals]);

    const chartData = useMemo(() => {
        const labels = Object.keys(totals).map((cat) => t(`finance.${cat}`, cat));
        const data = Object.values(totals);
        const backgroundColor = Object.keys(totals).map((cat) => CATEGORY_COLORS[cat]);

        const effectiveData = grandTotal === 0 ? [1] : data;
        const effectiveColors = grandTotal === 0
            ? [isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)']
            : backgroundColor;

        return {
            labels: grandTotal === 0 ? [t('common.noData', 'No Data')] : labels,
            datasets: [
                {
                    data: effectiveData,
                    backgroundColor: effectiveColors,
                    borderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    borderWidth: 2,
                    hoverOffset: grandTotal === 0 ? 0 : 6
                }
            ]
        };
    }, [totals, grandTotal, isDarkMode, t]);

    const chartOptions = useMemo(() => {
        const base = getChartBaseOptions({ isDarkMode, isRTL });
        return {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            layout: {
                padding: 4
            },
            plugins: {
                ...base.plugins,
                legend: {
                    display: false
                },
                tooltip: {
                    ...base.plugins.tooltip,
                    enabled: grandTotal > 0,
                    rtl: isRTL,
                    textDirection: isRTL ? 'rtl' : 'ltr',
                    titleAlign: 'left',
                    bodyAlign: isRTL ? 'right' : 'left',
                    footerAlign: 'left',
                    callbacks: {
                        label: (context) => {
                            const val = context.raw || 0;
                            const pct = grandTotal > 0 ? Math.round((val / grandTotal) * 100) : 0;
                            const formattedVal = formatCurrency(val, 'EGP', isRTL ? 'ar-EG' : 'en-US');
                            const formattedPct = formatNumberByLocale(pct, isRTL);
                            return ` ${context.label}: ${formattedVal} (${formattedPct}%)`;
                        }
                    }
                }
            }
        };
    }, [isDarkMode, isRTL, grandTotal]);

    return (
        <Card
            radius="lg"
            p="lg"
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}
            className="border shadow-smoothCard flex flex-col justify-between h-full"
        >
            {/* Header */}
            <Stack gap={2} className="mb-2">
                <Group gap="xs" align="start" wrap="nowrap" className="min-w-0">
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
                        <FiPieChart size={18} />
                    </ThemeIcon>
                    <Title
                        order={3}
                        style={{
                            color: isDarkMode ? '#ffffff' : '#1e293b',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        className="text-base font-bold min-w-0"
                    >
                        {t('finance.expensesBreakdown', 'Expense Breakdown')}
                    </Title>
                </Group>
                <Text
                    size="xs"
                    style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                >
                    {t('finance.expensesSubtitle', 'Distribution by category')}
                </Text>
            </Stack>

            {/* Doughnut Chart with Centered Total */}
            <Box className="h-56 sm:h-64 w-full relative flex items-center justify-center my-auto">
                {/* Centered Total behind canvas (z-0) so tooltips on canvas always render on top */}
                <Stack gap={0} align="center" justify="center" className="absolute inset-0 pointer-events-none z-0 px-4">
                    <Title
                        order={2}
                        style={{
                            color: isDarkMode ? '#ffffff' : '#0f172a',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        className="text-xl sm:text-2xl font-black tracking-tight text-center"
                    >
                        {formatCurrency(grandTotal, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
                    </Title>
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        className="font-semibold text-center mt-0.5"
                    >
                        {t('finance.totalExpenses', 'Total Outflow')}
                    </Text>
                </Stack>

                {/* Canvas layer with z-10 */}
                <Box className="w-full h-full relative z-10">
                    <Doughnut data={chartData} options={chartOptions} />
                </Box>
            </Box>

            {/* Category Breakdown Legend (Flex Row Badges with allow wrap) */}
            <Group
                gap="xs"
                wrap="wrap"
                justify="center"
                className="pt-3 border-t border-slate-100 dark:border-white/5"
            >
                {activeCategories.map(([cat, amt]) => {
                    const pct = grandTotal > 0 ? Math.round((amt / grandTotal) * 100) : 0;
                    const color = CATEGORY_COLORS[cat] || '#85F40F';

                    return (
                        <Badge
                            key={cat}
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
                                <span className="capitalize">{t(`finance.${cat}`, cat)}</span>
                                <span style={{ opacity: 0.5 }}>•</span>
                                <span>{formatCurrency(amt, 'EGP', isRTL ? 'ar-EG' : 'en-US')}</span>
                                <span dir="ltr">({formatNumberByLocale(pct, isRTL)}%)</span>
                            </span>
                        </Badge>
                    );
                })}
            </Group>
        </Card>
    );
};

export default ExpenseCategoryChart;
