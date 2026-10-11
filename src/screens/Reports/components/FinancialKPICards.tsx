import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Card, Box, Group, Stack, Text, Title, Badge, ThemeIcon } from '@mantine/core';
import {
    RiMoneyDollarCircleLine,
    RiShieldCheckLine,
    RiStore2Line,
    RiWallet3Line,
    RiExchangeDollarLine,
    RiPercentLine
} from 'react-icons/ri';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatCurrency, formatNumberByLocale, parseMetricChange } from '../../../utils/formatters';

const FinancialKPICards = ({ reportData, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    if (!reportData) return null;

    const marginDiff = Number(((reportData.profitMargin || 0) - (reportData.profitMarginPrev || 0)).toFixed(1));
    const marginChangeStr = marginDiff >= 0 ? `+${marginDiff}%` : `${marginDiff}%`;

    const cards = [
        // Row 1: Revenue Streams
        {
            id: 'gross',
            title: t('finance.grossRevenue', 'Total Gross Revenue'),
            subtitle: `${t('finance.vsPreviousPeriod', 'vs previous')}: ${formatCurrency(reportData.grossRevenuePrev || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US')}`,
            value: formatCurrency(reportData.grossRevenue || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            change: reportData.grossRevenueChange || '+15.1%',
            isPositive: true,
            periodNote: t('finance.vsPreviousPeriod', 'vs previous period'),
            icon: <RiMoneyDollarCircleLine size={20} />,
            accent: '#10B981',
            glowColor: 'rgba(16, 185, 129, 0.45)',
            iconBg: 'rgba(16, 185, 129, 0.15)',
            iconBorder: 'rgba(16, 185, 129, 0.3)'
        },
        {
            id: 'subs',
            title: t('finance.subRevenue', 'Subscription Revenue'),
            subtitle: `${formatNumberByLocale(Math.round(((reportData.subscriptionsRevenue || 0) / (reportData.grossRevenue || 1)) * 100), isRTL)}% ${t('finance.grossRevenue', 'of revenue')}`,
            value: formatCurrency(reportData.subscriptionsRevenue || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            change: reportData.subscriptionsChange || '+12.7%',
            isPositive: true,
            periodNote: t('finance.vsPreviousPeriod', 'vs previous period'),
            icon: <RiShieldCheckLine size={20} />,
            accent: '#06B6D4',
            glowColor: 'rgba(6, 182, 212, 0.45)',
            iconBg: 'rgba(6, 182, 212, 0.15)',
            iconBorder: 'rgba(6, 182, 212, 0.3)'
        },
        {
            id: 'store',
            title: t('finance.storeSales', 'Store & POS Sales'),
            subtitle: `${formatNumberByLocale(Math.round(((reportData.storeSalesRevenue || 0) / (reportData.grossRevenue || 1)) * 100), isRTL)}% ${t('finance.grossRevenue', 'of revenue')}`,
            value: formatCurrency(reportData.storeSalesRevenue || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            change: reportData.storeSalesChange || '+29.1%',
            isPositive: true,
            periodNote: t('finance.vsPreviousPeriod', 'vs previous period'),
            icon: <RiStore2Line size={20} />,
            accent: '#F59E0B',
            glowColor: 'rgba(245, 158, 11, 0.45)',
            iconBg: 'rgba(245, 158, 11, 0.15)',
            iconBorder: 'rgba(245, 158, 11, 0.3)'
        },

        // Row 2: Outflows & Profitability
        {
            id: 'expenses',
            title: t('finance.totalExpenses', 'Operating Expenses'),
            subtitle: `${t('finance.vsPreviousPeriod', 'vs previous')}: ${formatCurrency(reportData.operatingExpensesPrev || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US')}`,
            value: formatCurrency(reportData.operatingExpenses || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            change: reportData.operatingExpensesChange || '-4.0%',
            isPositive: (reportData.operatingExpensesChange || '').startsWith('-'), // Expense decrease is positive
            periodNote: t('finance.vsPreviousPeriod', 'vs previous period'),
            icon: <RiWallet3Line size={20} />,
            accent: '#F43F5E',
            glowColor: 'rgba(244, 63, 94, 0.45)',
            iconBg: 'rgba(244, 63, 94, 0.15)',
            iconBorder: 'rgba(244, 63, 94, 0.3)'
        },
        {
            id: 'netProfit',
            title: t('finance.netProfitResult', 'Net Operating Profit'),
            subtitle: `${formatNumberByLocale(reportData.profitMargin || 0, isRTL)}% ${t('finance.profitMargin', 'Margin')}`,
            value: formatCurrency(reportData.netProfit || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            change: reportData.netProfitChange || '+35.2%',
            isPositive: true,
            periodNote: t('finance.vsPreviousPeriod', 'vs previous period'),
            icon: <RiExchangeDollarLine size={20} />,
            accent: '#85F40F',
            glowColor: 'rgba(133, 244, 15, 0.55)',
            iconBg: 'rgba(133, 244, 15, 0.22)',
            iconBorder: 'rgba(133, 244, 15, 0.45)',
            isHighlight: true
        },
        {
            id: 'profitMargin',
            title: t('finance.profitMargin', 'Net Profit Margin'),
            subtitle: `${t('finance.vsPreviousPeriod', 'vs previous')}: ${formatNumberByLocale(reportData.profitMarginPrev || 0, isRTL)}%`,
            value: `${formatNumberByLocale(reportData.profitMargin || 0, isRTL)}%`,
            change: marginChangeStr,
            isPositive: marginDiff >= 0,
            periodNote: t('finance.marginEfficiency', 'Profit conversion efficiency'),
            icon: <RiPercentLine size={20} />,
            accent: '#8B5CF6',
            glowColor: 'rgba(139, 92, 246, 0.45)',
            iconBg: 'rgba(139, 92, 246, 0.15)',
            iconBorder: 'rgba(139, 92, 246, 0.3)'
        }
    ];

    return (
        <Grid gutter="md">
            {cards.map((card) => {
                const isHighlight = card.isHighlight;
                const changeData = parseMetricChange(card?.change, isRTL);

                return (
                    <Grid.Col
                        key={card.id}
                        span={{ base: 12, sm: 6, md: 4 }}
                    >
                        <Card
                            radius="lg"
                            p="lg"
                            style={{
                                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                                borderColor: isHighlight
                                    ? 'rgba(133, 244, 15, 0.45)'
                                    : (isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0'),
                                borderRadius: '16px',
                                boxShadow: isHighlight
                                    ? '0 10px 25px -5px rgba(133, 244, 15, 0.18)'
                                    : '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
                            }}
                            className="relative overflow-hidden transition-all duration-300 border flex flex-col justify-between group hover:-translate-y-0.5 h-full"
                        >
                            {/* Ambient Radial Glow in the top-corner behind the icon */}
                            <Box
                                className="absolute -top-10 -inset-e-10 w-28 h-28 rounded-full blur-2xl opacity-20 dark:opacity-30 pointer-events-none transition-opacity group-hover:opacity-40"
                                style={{ backgroundColor: card.accent }}
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
                                        className="text-sm font-black tracking-tight leading-snug whitespace-nowrap"
                                    >
                                        {card.title}
                                    </Title>
                                    <Text
                                        size="xs"
                                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                                        className="font-medium leading-relaxed truncate"
                                    >
                                        {card.subtitle}
                                    </Text>
                                </Stack>

                                <ThemeIcon
                                    radius="xl"
                                    size={40}
                                    style={{
                                        backgroundColor: card.iconBg,
                                        borderColor: card.iconBorder,
                                        color: card.accent,
                                        boxShadow: `0 0 16px ${card.glowColor}`
                                    }}
                                    className="shrink-0 border transition-transform duration-300 group-hover:scale-105"
                                >
                                    {card.icon}
                                </ThemeIcon>
                            </Group>

                            {/* Main Prominent Value */}
                            <Title
                                order={3}
                                style={{
                                    color: isDarkMode ? '#ffffff' : '#0f172a',
                                    fontFamily: 'Inter, sans-serif'
                                }}
                                className="text-2xl sm:text-[25px] font-black tracking-tight leading-tight my-3 relative z-10 whitespace-nowrap"
                            >
                                {card.value}
                            </Title>

                            {/* Bottom row: Badge & Period context */}
                            <Group gap={6} wrap="nowrap" className="relative z-10 pt-1 text-xs">
                                {changeData && (
                                    <Badge
                                        variant="light"
                                        radius="xl"
                                        size="sm"
                                        color={card.isPositive ? 'teal' : 'rose'}
                                        tt="none"
                                        leftSection={
                                            card.isPositive ? (
                                                <FiTrendingUp size={12} className="shrink-0" />
                                            ) : (
                                                <FiTrendingDown size={12} className="shrink-0" />
                                            )
                                        }
                                        style={{
                                            backgroundColor: card.isPositive
                                                ? 'rgba(16, 185, 129, 0.15)'
                                                : 'rgba(244, 63, 94, 0.15)',
                                            borderColor: card.isPositive
                                                ? 'rgba(16, 185, 129, 0.3)'
                                                : 'rgba(244, 63, 94, 0.3)',
                                            color: card.isPositive ? '#34d399' : '#fb7185',
                                            textTransform: 'none'
                                        }}
                                        className="border shrink-0 normal-case"
                                    >
                                        <Text component="span" dir="ltr" size="xs" className="font-bold tracking-tight text-[11px] whitespace-nowrap">
                                            {card.change}
                                        </Text>
                                    </Badge>
                                )}

                                <Text
                                    size="xs"
                                    style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                                    className="text-[11px] font-medium truncate"
                                >
                                    {card.periodNote}
                                </Text>
                            </Group>

                            {/* Subtle bottom edge gradient line */}
                            <Box
                                className="absolute bottom-0 inset-x-5 h-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: card.accent }}
                            />
                        </Card>
                    </Grid.Col>
                );
            })}
        </Grid>
    );
};

export default FinancialKPICards;
