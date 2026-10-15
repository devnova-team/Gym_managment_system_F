import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { Card, Group, Stack, Title, Text, ThemeIcon, Box } from '@mantine/core';
import { getChartBaseOptions, BRAND_COLORS } from '../../../utils/chartConfig';
import { formatCurrency } from '../../../utils/formatters';
import { FiTrendingUp } from 'react-icons/fi';

const FinancialTrendChart = ({ trendData, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const lang = i18n.language === 'ar' ? 'ar' : 'en';

    const labels = useMemo(() => {
        return trendData?.labels?.[lang] || trendData?.labels?.en || [];
    }, [trendData, lang]);

    const revenue = useMemo(() => trendData?.revenue || [], [trendData]);
    const expenses = useMemo(() => trendData?.expenses || [], [trendData]);
    const profit = useMemo(() => trendData?.profit || [], [trendData]);

    const chartData = useMemo(() => {
        return {
            labels,
            datasets: [
                {
                    label: t('finance.grossRevenue', 'Gross Revenue'),
                    data: revenue,
                    borderColor: BRAND_COLORS.neonLime,
                    backgroundColor: isDarkMode ? 'rgba(133, 244, 15, 0.12)' : 'rgba(133, 244, 15, 0.25)',
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: BRAND_COLORS.neonLime,
                    pointBorderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: t('finance.totalExpenses', 'Expenses'),
                    data: expenses,
                    borderColor: BRAND_COLORS.rose,
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.35,
                    fill: false,
                    pointBackgroundColor: BRAND_COLORS.rose,
                    pointBorderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: t('finance.netProfitResult', 'Net Profit'),
                    data: profit,
                    borderColor: BRAND_COLORS.cyan,
                    backgroundColor: 'transparent',
                    tension: 0.35,
                    fill: false,
                    pointBackgroundColor: BRAND_COLORS.cyan,
                    pointBorderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }
            ]
        };
    }, [labels, revenue, expenses, profit, isDarkMode, t]);

    const chartOptions = useMemo(() => {
        const base = getChartBaseOptions({ isDarkMode, isRTL });
        return {
            ...base,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                ...base.plugins,
                legend: {
                    display: false
                },
                tooltip: {
                    ...base.plugins.tooltip,
                    mode: 'index',
                    intersect: false,
                    rtl: isRTL,
                    textDirection: isRTL ? 'rtl' : 'ltr',
                    titleAlign: 'left',
                    bodyAlign: isRTL ? 'right' : 'left',
                    footerAlign: 'left',
                    callbacks: {
                        label: (context) => {
                            const val = formatCurrency(context.raw || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US');
                            return `${context.dataset.label}: ${val}`;
                        }
                    }
                }
            },
            scales: {
                ...base.scales,
                y: {
                    ...base.scales.y,
                    ticks: {
                        ...base.scales.y.ticks,
                        callback: (value) => `${Math.round(value / 1000)}k`
                    }
                }
            }
        };
    }, [isDarkMode, isRTL]);

    return (
        <Card
            radius="lg"
            p="lg"
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                borderRadius: '16px'
            }}
            className="border shadow-smoothCard flex flex-col justify-between h-full"
        >
            {/* Header */}
            <div className="flex flex-col gap-2 mb-3">
                <div className="space-y-0.5">
                    <Group gap="xs">
                        <ThemeIcon
                            radius="md"
                            size={32}
                            style={{
                                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                color: '#10B981',
                                borderColor: 'rgba(16, 185, 129, 0.3)'
                            }}
                            className="border shrink-0"
                        >
                            <FiTrendingUp size={18} />
                        </ThemeIcon>
                        <Title
                            order={4}
                            style={{
                                color: isDarkMode ? '#ffffff' : '#1e293b',
                                fontFamily: 'Inter, sans-serif'
                            }}
                            className="text-base font-black"
                        >
                            {t('finance.monthlyFinancialTrend', 'Financial Trend Over Time')}
                        </Title>
                    </Group>
                    <Text size="xs" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }} className="font-medium">
                        {t('finance.financialSubtitle', '12-month performance of revenue, outflows, and net profit')}
                    </Text>
                </div>

                {/* Legend */}
                <Group gap="md" className="text-xs font-semibold pt-1">
                    <Group gap={6}>
                        <Box className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#85F40F]" />
                        <Text size="xs" className="text-slate-600 dark:text-slate-300 font-medium">
                            {t('finance.grossRevenue', 'Revenue')}
                        </Text>
                    </Group>
                    <Group gap={6}>
                        <Box className="w-2.5 h-2.5 rounded-full shrink-0 bg-rose-500" />
                        <Text size="xs" className="text-slate-600 dark:text-slate-300 font-medium">
                            {t('finance.totalExpenses', 'Expenses')}
                        </Text>
                    </Group>
                    <Group gap={6}>
                        <Box className="w-2.5 h-2.5 rounded-full shrink-0 bg-cyan-500" />
                        <Text size="xs" className="text-slate-600 dark:text-slate-300 font-medium">
                            {t('finance.netProfitResult', 'Profit')}
                        </Text>
                    </Group>
                </Group>
            </div>

            {/* Canvas */}
            <div className="h-80 sm:h-96 w-full relative">
                <Line data={chartData} options={chartOptions} />
            </div>
        </Card>
    );
};

export default FinancialTrendChart;
