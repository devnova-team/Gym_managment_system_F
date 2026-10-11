import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Doughnut } from 'react-chartjs-2';
import { Card, Group, Stack, Title, Text, ThemeIcon, Box, Badge } from '@mantine/core';
import { formatCurrency } from '../../../utils/formatters';
import { RiPieChartLine } from 'react-icons/ri';
import '../../../utils/chartConfig';

const RevenueStreamsChart = ({ reportData, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    const subs = reportData?.subscriptionsRevenue || 0;
    const store = reportData?.storeSalesRevenue || 0;
    const total = subs + store;

    const chartData = useMemo(() => {
        return {
            labels: [
                t('finance.subscriptions', 'Subscriptions'),
                t('finance.storeSalesShort', 'Store Sales')
            ],
            datasets: [
                {
                    data: [subs, store],
                    backgroundColor: ['#85F40F', '#F59E0B'],
                    borderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 6
                }
            ]
        };
    }, [subs, store, isDarkMode, t]);

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
                            backgroundColor: 'rgba(133, 244, 15, 0.15)',
                            color: '#85F40F',
                            borderColor: 'rgba(133, 244, 15, 0.3)'
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
                        {t('finance.revenueStreams', 'Revenue Streams')}
                    </Title>
                </Group>
                <Text size="xs" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }} className="font-medium">
                    {t('finance.financialSubtitle', 'Subscriptions vs POS Store sales')}
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
                        {t('finance.grossRevenue', 'Total Revenue')}
                    </Text>
                </Stack>

                {/* Canvas layer with z-10 */}
                <Box className="w-full h-full relative z-10">
                    <Doughnut data={chartData} options={chartOptions} />
                </Box>
            </Box>
            </Box>

            {/* Revenue Breakdown Legend (fills remaining height so sibling cards align) */}
            <Group
                gap="xs"
                wrap="wrap"
                justify="center"
                className="flex-1 content-start pt-3 border-t border-slate-100 dark:border-white/5"
            >
                <Badge
                    variant="outline"
                    size="md"
                    radius="xl"
                    leftSection={
                        <Box
                            className="w-2 h-2 rounded-full shrink-0 bg-[#85F40F]"
                            style={{ boxShadow: '0 0 6px rgba(133, 244, 15, 0.5)' }}
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
                        <span>{t('finance.subscriptions', 'Subscriptions')}</span>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span>{formatCurrency(subs, 'EGP', isRTL ? 'ar-EG' : 'en-US')}</span>
                        <span dir="ltr">({total > 0 ? Math.round((subs / total) * 100) : 0}%)</span>
                    </span>
                </Badge>

                <Badge
                    variant="outline"
                    size="md"
                    radius="xl"
                    leftSection={
                        <Box
                            className="w-2 h-2 rounded-full shrink-0 bg-amber-500"
                            style={{ boxShadow: '0 0 6px rgba(245, 158, 11, 0.5)' }}
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
                        <span>{t('finance.storeSalesShort', 'Store Sales')}</span>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span>{formatCurrency(store, 'EGP', isRTL ? 'ar-EG' : 'en-US')}</span>
                        <span dir="ltr">({total > 0 ? Math.round((store / total) * 100) : 0}%)</span>
                    </span>
                </Badge>
            </Group>
        </Card>
    );
};

export default RevenueStreamsChart;
