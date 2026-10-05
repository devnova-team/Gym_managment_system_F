import { useTranslation } from 'react-i18next';
import { Card, Box, Group, Stack, Text, Title, Badge, ThemeIcon } from '@mantine/core';
import {
    RiWallet3Line,
    RiLock2Line,
    RiPulseLine,
    RiPieChart2Line
} from 'react-icons/ri';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatCurrency, formatNumberByLocale } from '../../../utils/formatters';

const ExpensesStatsCards = ({ stats, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    if (!stats) return null;

    const fixedRatio = stats.totalAmount > 0
        ? Math.round((stats.fixedAmount / stats.totalAmount) * 100)
        : 0;
    const variableRatio = stats.totalAmount > 0
        ? Math.round((stats.variableAmount / stats.totalAmount) * 100)
        : 0;

    const cards = [
        {
            id: 'total',
            title: t('finance.totalExpensesThisMonth', 'Total Expenses'),
            subtitle: `${formatNumberByLocale(stats.totalCount || 0, isRTL)} ${t('common.records', 'records recorded')}`,
            value: formatCurrency(stats.totalAmount || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            badge: {
                label: isRTL ? '-٤.٠%' : '-4.0%',
                isNegative: true,
                sign: '-'
            },
            periodNote: t('dashboard.vsLastMonth', 'vs last month'),
            icon: <RiWallet3Line size={20} />,
            accent: '#F43F5E',
            glowColor: 'rgba(244, 63, 94, 0.45)',
            iconBg: 'rgba(244, 63, 94, 0.15)',
            iconBorder: 'rgba(244, 63, 94, 0.3)',
            isHighlight: true
        },
        {
            id: 'fixed',
            title: t('finance.fixedExpenses', 'Fixed Expenses'),
            subtitle: `${formatNumberByLocale(fixedRatio, isRTL)}% ${t('finance.allCategories', 'of total outflow')}`,
            value: formatCurrency(stats.fixedAmount || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            badge: {
                label: `${formatNumberByLocale(fixedRatio, isRTL)}%`,
                isNegative: true,
                sign: ''
            },
            periodNote: t('finance.fixed', 'Fixed rent & salaries'),
            icon: <RiLock2Line size={20} />,
            accent: '#8B5CF6',
            glowColor: 'rgba(139, 92, 246, 0.35)',
            iconBg: 'rgba(139, 92, 246, 0.12)',
            iconBorder: 'rgba(139, 92, 246, 0.25)'
        },
        {
            id: 'variable',
            title: t('finance.variableExpenses', 'Variable Expenses'),
            subtitle: `${formatNumberByLocale(variableRatio, isRTL)}% ${t('finance.allCategories', 'of total outflow')}`,
            value: formatCurrency(stats.variableAmount || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            badge: {
                label: `${formatNumberByLocale(variableRatio, isRTL)}%`,
                isNegative: false,
                sign: ''
            },
            periodNote: t('finance.variable', 'Utilities & upkeep'),
            icon: <RiPulseLine size={20} />,
            accent: '#F59E0B',
            glowColor: 'rgba(245, 158, 11, 0.35)',
            iconBg: 'rgba(245, 158, 11, 0.12)',
            iconBorder: 'rgba(245, 158, 11, 0.25)'
        },
        {
            id: 'topCategory',
            title: t('finance.topExpenseCategory', 'Top Spending Category'),
            subtitle: t(`finance.${stats.topCategory?.key || 'rent'}`, stats.topCategory?.key || 'Rent'),
            value: formatCurrency(stats.topCategory?.amount || 0, 'EGP', isRTL ? 'ar-EG' : 'en-US'),
            badge: {
                label: t(`finance.${stats.topCategory?.key || 'rent'}`, stats.topCategory?.key || 'Rent'),
                isCategory: true
            },
            periodNote: t('finance.nature', 'Largest cash consumption'),
            icon: <RiPieChart2Line size={20} />,
            accent: '#85F40F',
            glowColor: 'rgba(133, 244, 15, 0.45)',
            iconBg: 'rgba(133, 244, 15, 0.2)',
            iconBorder: 'rgba(133, 244, 15, 0.4)'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {cards?.map((card) => {
                const isHighlight = card.isHighlight;

                return (
                    <Card
                        key={card.id}
                        radius="lg"
                        p="md"
                            style={{
                                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                                borderColor: isHighlight
                                    ? 'rgba(244, 63, 94, 0.4)'
                                    : (isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0'),
                                borderRadius: '16px',
                                boxShadow: isHighlight
                                    ? '0 10px 25px -5px rgba(244, 63, 94, 0.15)'
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
                                className="text-xl sm:text-2xl font-black tracking-tight leading-tight my-2 relative z-10 whitespace-nowrap"
                            >
                                {card.value}
                            </Title>

                            {/* Bottom row: Badge & Period context */}
                            <Group gap={6} wrap="nowrap" className="relative z-10 pt-1 text-xs">
                                {card.badge?.isCategory ? (
                                    <Badge
                                        variant="light"
                                        radius="xl"
                                        size="sm"
                                        color="lime"
                                        tt="none"
                                        style={{
                                            backgroundColor: 'rgba(133, 244, 15, 0.15)',
                                            borderColor: 'rgba(133, 244, 15, 0.3)',
                                            color: '#85F40F',
                                            textTransform: 'none'
                                        }}
                                        className="border shrink-0 font-bold"
                                    >
                                        {card.badge.label}
                                    </Badge>
                                ) : (
                                    (() => {
                                        const isNegative = card.badge?.isNegative ?? (
                                            card.badge?.label?.startsWith('-') || card.badge?.sign === '-'
                                        );

                                        return (
                                            <Badge
                                                variant="light"
                                                radius="xl"
                                                size="sm"
                                                color={!isNegative ? 'teal' : 'rose'}
                                                tt="none"
                                                leftSection={
                                                    isNegative ? (
                                                        <FiTrendingDown size={12} className="shrink-0" />
                                                    ) : (
                                                        <FiTrendingUp size={12} className="shrink-0" />
                                                    )
                                                }
                                                style={{
                                                    backgroundColor: !isNegative
                                                        ? 'rgba(16, 185, 129, 0.15)'
                                                        : 'rgba(244, 63, 94, 0.15)',
                                                    borderColor: !isNegative
                                                        ? 'rgba(16, 185, 129, 0.3)'
                                                        : 'rgba(244, 63, 94, 0.3)',
                                                    color: !isNegative ? '#34d399' : '#fb7185',
                                                    textTransform: 'none'
                                                }}
                                                className="border shrink-0 normal-case"
                                            >
                                                <Text component="span" dir="ltr" size="xs" className="font-bold tracking-tight text-[11px] whitespace-nowrap">
                                                    {card.badge?.label}
                                                </Text>
                                            </Badge>
                                        );
                                    })()
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
                    );
                })}
            </div>
        );
    };

export default ExpensesStatsCards;
