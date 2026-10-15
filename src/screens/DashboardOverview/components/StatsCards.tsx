import { useTranslation } from 'react-i18next';
import { Grid, Card, Box, Group, Stack, Text, Title, Badge, ThemeIcon } from '@mantine/core';
import {
    RiUserFollowLine,
    RiWallet3Line,
    RiUserSharedLine,
    RiMoneyDollarCircleLine,
    RiExchangeDollarLine,
    RiGroupLine
} from 'react-icons/ri';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import {
    formatCurrency,
    formatNumberByLocale,
    formatTimeRange,
    parseMetricChange
} from '../../../utils/formatters';

const StatsCards = ({ summary, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    if (!summary) return null;

    const peakHours = formatTimeRange(summary.presentToday?.peakHours, isRTL, {
        am: t('common.am'),
        pm: t('common.pm')
    });

    const cards = [
        {
            id: 'monthlyRevenue',
            title: t('dashboard.monthlyRevenue'),
            subtitle: t('finance.subRevenue'),
            value: formatCurrency(summary.monthlyRevenue?.value, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            change: summary.monthlyRevenue?.change,
            isPositive: summary.monthlyRevenue?.isPositive,
            periodNote: t('dashboard.vsLastMonth'),
            icon: <RiWallet3Line size={20} />,
            accent: '#10B981',
            glowColor: 'rgba(16, 185, 129, 0.35)',
            iconBg: 'rgba(16, 185, 129, 0.12)',
            iconBorder: 'rgba(16, 185, 129, 0.25)'
        },
        {
            id: 'monthlyExpenses',
            title: t('dashboard.monthlyExpenses'),
            subtitle: t('finance.fixedExpenses'),
            value: formatCurrency(summary.monthlyExpenses?.value, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            change: summary.monthlyExpenses?.change,
            isPositive: summary.monthlyExpenses?.isPositive,
            periodNote: t('dashboard.vsLastMonth'),
            icon: <RiExchangeDollarLine size={20} />,
            accent: '#FB923C',
            glowColor: 'rgba(251, 146, 60, 0.35)',
            iconBg: 'rgba(251, 146, 60, 0.12)',
            iconBorder: 'rgba(251, 146, 60, 0.25)'
        },
        {
            id: 'netProfit',
            title: t('dashboard.netProfit'),
            subtitle: t('finance.netProfitResult'),
            value: formatCurrency(summary.netProfit?.value, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            change: summary.netProfit?.change,
            isPositive: summary.netProfit?.isPositive,
            periodNote: t('dashboard.vsLastMonth'),
            icon: <RiMoneyDollarCircleLine size={20} />,
            accent: '#85F40F',
            glowColor: 'rgba(133, 244, 15, 0.45)',
            iconBg: 'rgba(133, 244, 15, 0.2)',
            iconBorder: 'rgba(133, 244, 15, 0.4)',
            isHighlight: true
        },
        {
            id: 'totalMembers',
            title: t('dashboard.totalMembers', 'Total Members'),
            subtitle: t('dashboard.totalMembersDesc', 'Total registered members'),
            value: formatNumberByLocale(summary.totalMembers?.value || 468, isRTL),
            change: summary.totalMembers?.change || '+8.4%',
            isPositive: summary.totalMembers?.isPositive !== false,
            periodNote: t('dashboard.vsLastMonth', 'vs last month'),
            icon: <RiGroupLine size={20} />,
            accent: '#6366F1',
            glowColor: 'rgba(99, 102, 241, 0.35)',
            iconBg: 'rgba(99, 102, 241, 0.12)',
            iconBorder: 'rgba(99, 102, 241, 0.25)'
        },
        {
            id: 'activeMembers',
            title: t('dashboard.activeSubscriptions', 'Active Subscriptions'),
            subtitle: t('dashboard.activeMembersDesc', 'Active subscribed members'),
            value: formatNumberByLocale(summary.activeMembers?.value || 0, isRTL),
            change: summary.activeMembers?.change,
            isPositive: summary.activeMembers?.isPositive,
            periodNote: t('dashboard.vsLastMonth', 'vs last month'),
            icon: <RiUserFollowLine size={20} />,
            accent: '#85F40F',
            glowColor: 'rgba(133, 244, 15, 0.35)',
            iconBg: 'rgba(133, 244, 15, 0.12)',
            iconBorder: 'rgba(133, 244, 15, 0.25)'
        },
        {
            id: 'presentToday',
            title: t('dashboard.presentToday', 'Present Today'),
            subtitle: `${t('dashboard.peakHoursLabel', 'Peak Hours')}: ${peakHours?.formatted || (isRTL ? '٠٦:٠٠ م - ٠٩:٠٠ م' : '06:00 PM - 09:00 PM')}`,
            value: summary.presentToday?.value?.toLocaleString(isRTL ? 'ar-EG' : 'en-US') || 0,
            change: summary.presentToday?.change,
            isPositive: summary.presentToday?.isPositive,
            capacityLabel: `${t('dashboard.capacityNow', 'Current Capacity')} ${formatNumberByLocale(summary.presentToday?.capacityPercentage || 0, isRTL)}%`,
            periodNote: t('common.today', 'Today'),
            icon: <RiUserSharedLine size={20} />,
            accent: '#06B6D4',
            glowColor: 'rgba(6, 182, 212, 0.35)',
            iconBg: 'rgba(6, 182, 212, 0.12)',
            iconBorder: 'rgba(6, 182, 212, 0.25)'
        }
    ];

    return (
        <Grid gutter="md">
            {cards.map((card) => {
                const isHighlight = card?.isHighlight;
                const changeData = parseMetricChange(card?.change, isRTL);

                return (
                    <Grid.Col
                        key={card?.id}
                        span={{ base: 12, sm: 6, lg: 4 }}
                    >
                        <Card
                            radius="lg"
                            p="lg"
                            style={{
                                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                                borderColor: isHighlight
                                    ? 'rgba(133, 244, 15, 0.4)'
                                    : (isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0'),
                                borderRadius: '16px',
                                boxShadow: isHighlight
                                    ? '0 10px 25px -5px rgba(133, 244, 15, 0.15)'
                                    : '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
                            }}
                            className="relative overflow-hidden transition-all duration-300 border flex flex-col justify-between group hover:-translate-y-0.5 h-full"
                        >
                            {/* Ambient Radial Glow in the top-corner behind the icon */}
                            <Box
                                className="absolute -top-10 -inset-e-10 w-28 h-28 rounded-full blur-2xl opacity-20 dark:opacity-30 pointer-events-none transition-opacity group-hover:opacity-40"
                                style={{ backgroundColor: card?.accent }}
                            />

                            {/* Top Row: Title & Subtitle + Glowing Icon */}
                            <Group justify="space-between" align="flex-start" gap="xs" wrap="nowrap" className="relative z-10">
                                <Stack gap={2} className="min-w-0 flex-1">
                                    <Title
                                        order={4}
                                        style={{
                                            color: isDarkMode ? '#ffffff' : '#1e293b',
                                            fontFamily: 'Inter, sans-serif'
                                        }}
                                        className="text-sm sm:text-base font-black tracking-tight leading-snug whitespace-normal lg:whitespace-nowrap"
                                    >
                                        {card?.title}
                                    </Title>
                                    <Text
                                        size="xs"
                                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                                        className="font-medium leading-relaxed whitespace-normal lg:whitespace-nowrap"
                                    >
                                        {card?.subtitle}
                                    </Text>
                                </Stack>

                                <ThemeIcon
                                    radius="xl"
                                    size={40}
                                    style={{
                                        backgroundColor: card?.iconBg,
                                        borderColor: card?.iconBorder,
                                        color: card?.accent,
                                        boxShadow: `0 0 16px ${card?.glowColor}`
                                    }}
                                    className="shrink-0 border transition-transform duration-300 group-hover:scale-105"
                                >
                                    {card?.icon}
                                </ThemeIcon>
                            </Group>

                            {/* Main Prominent Value */}
                            <Title
                                order={3}
                                style={{
                                    color: isDarkMode ? '#ffffff' : '#0f172a',
                                    fontFamily: 'Inter, sans-serif'
                                }}
                                className="text-2xl sm:text-[26px] font-black tracking-tight leading-tight my-3 relative z-10 whitespace-nowrap"
                            >
                                {card?.value}
                            </Title>

                            {/* Additional status badge (asc / desc) & period context */}
                            <Group gap={6} wrap="wrap" className="relative z-10 pt-1 text-xs lg:flex-nowrap">
                                {changeData && (
                                    <Badge
                                        variant="light"
                                        radius="xl"
                                        size="sm"
                                        color={!changeData.isNegative ? 'teal' : 'rose'}
                                        tt="none"
                                        leftSection={
                                            changeData.isNegative ? (
                                                <FiTrendingDown size={12} className="shrink-0" />
                                            ) : (
                                                <FiTrendingUp size={12} className="shrink-0" />
                                            )
                                        }
                                        style={{
                                            backgroundColor: !changeData.isNegative ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                                            borderColor: !changeData.isNegative ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
                                            color: !changeData.isNegative ? '#34d399' : '#fb7185',
                                            textTransform: 'none'
                                        }}
                                        className="border shrink-0 normal-case"
                                    >
                                        <Text component="span" dir="ltr" size="xs" className="font-bold tracking-tight text-[11px] whitespace-nowrap">
                                            {changeData.sign}{changeData.numericPart}
                                        </Text>
                                    </Badge>
                                )}

                                {card?.capacityLabel && (
                                    <Badge
                                        variant="light"
                                        radius="xl"
                                        size="sm"
                                        color="cyan"
                                        tt="none"
                                        style={{
                                            backgroundColor: 'rgba(6, 182, 212, 0.15)',
                                            borderColor: 'rgba(6, 182, 212, 0.3)',
                                            color: '#38bdf8',
                                            textTransform: 'none'
                                        }}
                                        className="border text-[11px] font-bold shrink-0 whitespace-nowrap normal-case"
                                    >
                                        {card?.capacityLabel}
                                    </Badge>
                                )}

                                <Text
                                    size="xs"
                                    style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                                    className="text-[11px] font-medium whitespace-normal lg:whitespace-nowrap"
                                >
                                    {card?.periodNote}
                                </Text>
                            </Group>

                            {/* Subtle bottom edge gradient line */}
                            <Box
                                className="absolute bottom-0 inset-x-5 h-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: card?.accent }}
                            />
                        </Card>
                    </Grid.Col>
                );
            })}
        </Grid>
    );
};

export default StatsCards;