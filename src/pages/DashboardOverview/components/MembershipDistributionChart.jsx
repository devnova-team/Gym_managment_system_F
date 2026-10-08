import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Doughnut } from 'react-chartjs-2';
import { Card, Box, Group, Stack, Text, Title, ThemeIcon, Badge } from '@mantine/core';
import { getChartBaseOptions } from '../../../utils/chartConfig';
import { formatNumberByLocale } from '../../../utils/formatters';
import { FiPieChart } from 'react-icons/fi';

const MembershipDistributionChart = ({ distributionData, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const lang = i18n.language === 'ar' ? 'ar' : 'en';

    const labels = useMemo(() => {
        return distributionData?.labels?.[lang] || distributionData?.labels?.en || [];
    }, [distributionData, lang]);

    const counts = useMemo(() => distributionData?.counts || [], [distributionData]);
    const totalMembers = useMemo(() => counts.reduce((acc, curr) => acc + curr, 0), [counts]);

    const chartData = useMemo(() => {
        return {
            labels,
            datasets: [
                {
                    data: counts,
                    backgroundColor: distributionData?.colors || [
                        '#85F40F',
                        '#10B981',
                        '#06B6D4',
                        '#6366F1',
                        '#F59E0B'
                    ],
                    borderColor: isDarkMode ? '#0e1517' : '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 8,
                }
            ]
        };
    }, [labels, counts, distributionData, isDarkMode]);

    const chartOptions = useMemo(() => {
        const base = getChartBaseOptions({ isDarkMode, isRTL });
        return {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%', // Thicker doughnut ring
            layout: {
                padding: 4 // Allows doughnut diameter to fill maximum available space
            },
            plugins: {
                ...base.plugins,
                legend: {
                    display: false,
                },
                tooltip: {
                    ...base.plugins.tooltip,
                    rtl: isRTL,
                    textDirection: isRTL ? 'rtl' : 'ltr',
                    titleAlign: 'left',
                    bodyAlign: isRTL ? 'right' : 'left',
                    footerAlign: 'left',
                    callbacks: {
                        label: (context) => {
                            const val = context.raw || 0;
                            const pct = totalMembers > 0 ? Math.round((val / totalMembers) * 100) : 0;
                            const formattedVal = formatNumberByLocale(val, isRTL);
                            const formattedPct = formatNumberByLocale(pct, isRTL);
                            const suffix = t('attendance.membersUnit', 'members');
                            return `${context.label}: ${formattedVal} ${suffix} (${formattedPct}%)`;
                        }
                    }
                }
            }
        };
    }, [isDarkMode, isRTL, totalMembers, t]);

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
            className="border flex flex-col justify-between h-full"
        >
            {/* Header */}
            <Stack gap={2} className="mb-4">
                <Group gap="xs" align="start" wrap="nowrap" className="min-w-0">
                    <ThemeIcon
                        radius="md"
                        size={32}
                        style={{
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            borderColor: 'rgba(99, 102, 241, 0.3)'
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
                        {t('dashboard.membershipDistribution', 'Membership Plans')}
                    </Title>
                </Group>
                <Text
                    size="xs"
                    style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                >
                    {t('dashboard.activeSubscriptions', 'Active membership breakdown by plan type')}
                </Text>
            </Stack>

            {/* Doughnut Chart with Centered Total */}
            <Box className="h-64 w-full relative flex items-center justify-center my-2">
                {/* Centered Total behind canvas (z-0) so tooltips on canvas always render on top */}
                <Stack gap={0} align="center" justify="center" className="absolute inset-0 pointer-events-none z-0">
                    <Title
                        order={2}
                        style={{
                            color: isDarkMode ? '#ffffff' : '#0f172a',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        className="text-3xl font-black"
                    >
                        {formatNumberByLocale(totalMembers, isRTL)}
                    </Title>
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        className="font-semibold"
                    >
                        {t('dashboard.totalMembers', 'Total Members')}
                    </Text>
                </Stack>

                {/* Canvas layer with z-10 */}
                <Box className="w-full h-full relative z-10">
                    <Doughnut data={chartData} options={chartOptions} />
                </Box>
            </Box>

            {/* Plan Breakdown Legend (Flex Row Badges) */}
            <Group
                gap="xs"
                wrap="wrap"
                justify="center"
                className="pt-3 border-t border-slate-100 dark:border-slate-800/60"
            >
                {labels.map((label, idx) => {
                    const count = counts[idx] || 0;
                    const pct = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
                    const color = distributionData?.colors?.[idx] || '#85F40F';

                    return (
                        <Badge
                            key={idx}
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
                                <span>{label}</span>
                                <span style={{ opacity: 0.5 }}>•</span>
                                <span>{formatNumberByLocale(count, isRTL)}</span>
                                <span dir="ltr">({formatNumberByLocale(pct, isRTL)}%)</span>
                            </span>
                        </Badge>
                    );
                })}
            </Group>
        </Card>
    );
};

export default MembershipDistributionChart;
