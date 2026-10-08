import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SimpleGrid, Card, Box, Group, Stack, Text, Title, ThemeIcon } from '@mantine/core';
import {
    RiUserAddLine,
    RiTimeLine,
    RiUserUnfollowLine,
    RiUserForbidLine,
    RiArrowRightLine,
    RiArrowLeftLine
} from 'react-icons/ri';
import { formatNumberByLocale } from '../../../utils/formatters';

const SegmentCounters = ({ segments, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    if (!segments) return null;

    const getSegmentCount = (key) => {
        if (Array.isArray(segments)) {
            return segments.find((s) => s?.key === key)?.count ?? 0;
        }
        return segments?.[key]?.count ?? segments?.[key] ?? 0;
    };

    const cards = [
        {
            id: 'new',
            title: t('dashboard.segmentNew'),
            subtitle: t('dashboard.segmentNewDesc'),
            value: formatNumberByLocale(getSegmentCount('new'), isRTL),
            icon: <RiUserAddLine size={20} />,
            accent: '#10B981',
            glowColor: 'rgba(16, 185, 129, 0.35)',
            iconBg: 'rgba(16, 185, 129, 0.12)',
            iconBorder: 'rgba(16, 185, 129, 0.25)',
            actionLabel: t('dashboard.viewAll'),
            to: '/dashboard/communication?segment=new'
        },
        {
            id: 'expiring',
            title: t('dashboard.segmentExpiring'),
            subtitle: t('dashboard.segmentExpiringDesc'),
            value: formatNumberByLocale(getSegmentCount('expiring'), isRTL),
            icon: <RiTimeLine size={20} />,
            accent: '#F59E0B',
            glowColor: 'rgba(245, 158, 11, 0.35)',
            iconBg: 'rgba(245, 158, 11, 0.12)',
            iconBorder: 'rgba(245, 158, 11, 0.25)',
            actionLabel: t('dashboard.viewAll'),
            to: '/dashboard/communication?segment=expiring'
        },
        {
            id: 'inactive',
            title: t('dashboard.segmentInactive'),
            subtitle: t('dashboard.segmentInactiveDesc'),
            value: formatNumberByLocale(getSegmentCount('inactive'), isRTL),
            icon: <RiUserUnfollowLine size={20} />,
            accent: '#FB923C',
            glowColor: 'rgba(251, 146, 60, 0.35)',
            iconBg: 'rgba(251, 146, 60, 0.12)',
            iconBorder: 'rgba(251, 146, 60, 0.25)',
            actionLabel: t('dashboard.viewAll'),
            to: '/dashboard/communication?segment=inactive'
        },
        {
            id: 'expired',
            title: t('dashboard.segmentExpired'),
            subtitle: t('dashboard.segmentExpiredDesc'),
            value: formatNumberByLocale(getSegmentCount('expired'), isRTL),
            icon: <RiUserForbidLine size={20} />,
            accent: '#F43F5E',
            glowColor: 'rgba(244, 63, 94, 0.35)',
            iconBg: 'rgba(244, 63, 94, 0.12)',
            iconBorder: 'rgba(244, 63, 94, 0.25)',
            actionLabel: t('dashboard.viewAll'),
            to: '/dashboard/communication?segment=expired'
        }
    ];

    return (
        <Stack gap="sm">
            <Stack gap={2}>
                <Title
                    order={3}
                    style={{
                        color: isDarkMode ? '#ffffff' : '#1e293b',
                        fontFamily: 'Inter, sans-serif'
                    }}
                    className="text-base font-bold"
                >
                    {t('dashboard.segmentsTitle')}
                </Title>
                <Text
                    size="xs"
                    style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                >
                    {t('dashboard.segmentsSubtitle')}
                </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                {cards?.map((card) => (
                    <Card
                        key={card?.id}
                        component={Link}
                        to={card?.to}
                        radius="lg"
                        p="lg"
                        style={{
                            backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                            borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                        className="relative overflow-hidden transition-all duration-300 border flex flex-col justify-between group hover:-translate-y-0.5 cursor-pointer"
                    >
                        {/* Ambient Radial Glow in the top-corner behind the icon */}
                        <Box
                            className="absolute -top-10 -inset-e-10 w-28 h-28 rounded-full blur-2xl opacity-15 dark:opacity-20 pointer-events-none transition-opacity group-hover:opacity-35"
                            style={{ backgroundColor: card?.accent }}
                        />

                        {/* Top Row: Title & Subtitle + Glowing Circular Icon */}
                        <Group justify="space-between" align="flex-start" gap="xs" wrap="nowrap" className="relative z-10">
                            <Stack gap={2} className="min-w-0 flex-1">
                                <Title
                                    order={4}
                                    style={{
                                        color: isDarkMode ? '#ffffff' : '#1e293b',
                                        fontFamily: 'Inter, sans-serif'
                                    }}
                                    className="text-sm sm:text-base font-black tracking-tight leading-snug"
                                >
                                    {card?.title}
                                </Title>
                                <Text
                                    size="xs"
                                    style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                                    className="font-medium leading-relaxed"
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
                            className="text-2xl sm:text-[26px] font-black tracking-tight leading-tight my-3 relative z-10"
                        >
                            {card?.value}
                        </Title>

                        {/* Bottom action row: 'View Members' with animated arrow */}
                        <Group
                            justify="space-between"
                            align="center"
                            className="text-xs font-semibold pt-2 border-t border-slate-100 dark:border-slate-800/60 relative z-10"
                        >
                            <Text
                                size="xs"
                                style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                                className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                            >
                                {card?.actionLabel}
                            </Text>
                            <Box
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                                style={{ color: card?.accent }}
                            >
                                {isRTL ? <RiArrowLeftLine size={16} /> : <RiArrowRightLine size={16} />}
                            </Box>
                        </Group>

                        {/* Subtle bottom edge gradient line */}
                        <Box
                            className="absolute bottom-0 inset-x-5 h-0.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: card?.accent }}
                        />
                    </Card>
                ))}
            </SimpleGrid>
        </Stack>
    );
};

export default SegmentCounters;
