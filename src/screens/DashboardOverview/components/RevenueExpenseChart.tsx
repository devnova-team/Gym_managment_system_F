import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { Card, Box, Group, Stack, Text, Title, ThemeIcon } from '@mantine/core';
import { getChartBaseOptions, BRAND_COLORS } from '../../../utils/chartConfig';
import { formatCurrency, formatNumberByLocale, formatCompactNumber } from '../../../utils/formatters';
import { RiExchangeDollarLine } from 'react-icons/ri';

const RevenueExpenseChart = ({ trendData, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const lang = i18n.language === 'ar' ? 'ar' : 'en';

    const months = useMemo(() => {
        return trendData?.months?.[lang] || trendData?.months?.en || [];
    }, [trendData, lang]);

    const revenue = useMemo(() => trendData?.revenue || [], [trendData]);
    const expenses = useMemo(() => trendData?.expenses || [], [trendData]);
    const netProfit = useMemo(() => trendData?.netProfit || [], [trendData]);

    const latestRevenue = revenue[revenue.length - 1] || 0;
    const latestNetProfit = netProfit[netProfit.length - 1] || 0;
    const netMarginPercentage = latestRevenue > 0
        ? ((latestNetProfit / latestRevenue) * 100).toFixed(1)
        : '0';

    const chartData = useMemo(() => {
        return {
            labels: months,
            datasets: [
                {
                    label: t('dashboard.monthlyRevenue', 'Revenue'),
                    data: revenue,
                    borderColor: BRAND_COLORS.neonLime,
                    backgroundColor: isDarkMode ? 'rgba(133, 244, 15, 0.12)' : 'rgba(133, 244, 15, 0.25)',
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: BRAND_COLORS.neonLime,
                    pointBorderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: t('dashboard.monthlyExpenses', 'Expenses'),
                    data: expenses,
                    borderColor: BRAND_COLORS.rose,
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.35,
                    fill: false,
                    pointBackgroundColor: BRAND_COLORS.rose,
                    pointBorderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: t('dashboard.netProfit', 'Net Profit'),
                    data: netProfit,
                    borderColor: BRAND_COLORS.cyan,
                    backgroundColor: 'transparent',
                    tension: 0.35,
                    fill: false,
                    pointBackgroundColor: BRAND_COLORS.cyan,
                    pointBorderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }
            ]
        };
    }, [months, revenue, expenses, netProfit, isDarkMode, t]);

    const chartOptions = useMemo(() => {
        const base = getChartBaseOptions({ isDarkMode, isRTL });
        return {
            ...base,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                ...base.plugins,
                legend: {
                    display: false,
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
                x: {
                    ...base.scales.x,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        ...base.scales.x.ticks,
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11,
                            weight: '600',
                        }
                    }
                },
                y: {
                    ...base.scales.y,
                    ticks: {
                        ...base.scales.y.ticks,
                        callback: (value) => formatCompactNumber(value)
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
                borderRadius: '16px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}
            className="border flex flex-col justify-between"
        >
            {/* Header */}
            <Stack gap="sm" className="mb-4">
                <Stack gap={2}>
                    <Group gap="xs" align="center" wrap="nowrap" className="min-w-0">
                        <ThemeIcon
                            radius="md"
                            size={32}
                            style={{
                                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                borderColor: 'rgba(16, 185, 129, 0.3)'
                            }}
                            className="border shrink-0"
                        >
                            <RiExchangeDollarLine size={18} />
                        </ThemeIcon>
                        <Title
                            order={3}
                            style={{
                                color: isDarkMode ? '#ffffff' : '#1e293b',
                                fontFamily: 'Inter, sans-serif'
                            }}
                            className="text-base font-bold min-w-0"
                        >
                            {t('dashboard.revenueVsExpenses', 'Revenue vs Expenses')}
                        </Title>
                    </Group>
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                    >
                        {t('dashboard.revenueVsExpensesSubtitle', 'Cash revenue vs operating expenses trend')}
                    </Text>
                </Stack>

                {/* Legend badges under title and subtitle */}
                <Group gap="md" wrap="wrap" className="pt-1 text-xs font-semibold">
                    <Group gap={6} align="center">
                        <Box className="w-2.5 h-2.5 rounded-full bg-[#85F40F] shadow-[0_0_8px_rgba(133,244,15,0.6)]" />
                        <Text size="xs" style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                            {t('dashboard.monthlyRevenue', 'Revenue')}
                        </Text>
                    </Group>
                    <Group gap={6} align="center">
                        <Box className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                        <Text size="xs" style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                            {t('dashboard.monthlyExpenses', 'Expenses')}
                        </Text>
                    </Group>
                    <Group gap={6} align="center">
                        <Box className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                        <Text size="xs" style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                            {t('dashboard.netProfit', 'Net Profit')}
                        </Text>
                    </Group>
                </Group>
            </Stack>

            {/* Canvas */}
            <Box className="h-64 w-full relative">
                <Line data={chartData} options={chartOptions} />
            </Box>

            {/* Footer Summary */}
            <Group
                justify="space-between"
                align="center"
                className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs"
            >
                <Group gap={4} align="center" dir={isRTL ? 'rtl' : 'ltr'}>
                    <Text size="xs" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                        {t('dashboard.latestMonthRevenue', 'Latest Month Revenue')}:
                    </Text>
                    <Text
                        component="span"
                        dir="ltr"
                        size="xs"
                        style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}
                        className="font-bold"
                    >
                        {formatCurrency(latestRevenue, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
                    </Text>
                </Group>

                <Group gap={4} align="center" dir={isRTL ? 'rtl' : 'ltr'}>
                    <Text component="span" dir="ltr" size="xs" className="text-emerald-500 dark:text-emerald-400 font-bold">
                        {formatNumberByLocale(netMarginPercentage, isRTL)}%
                    </Text>
                    <Text component="span" size="xs" className="text-emerald-500 dark:text-emerald-400 font-bold">
                        {t('dashboard.netMargin', 'Net Margin')}
                    </Text>
                </Group>
            </Group>
        </Card>
    );
};

export default RevenueExpenseChart;
