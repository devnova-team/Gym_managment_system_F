import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Box, Group, Stack, Text, Title, ThemeIcon, Button } from '@mantine/core';
import {
    RiUserFollowLine,
    RiTimeLine,
    RiShoppingBag3Line,
    RiShieldCheckLine
} from 'react-icons/ri';
import { formatCurrency } from '../../../utils/formatters';

const RecentActivityFeed = ({ activities = [], isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const lang = i18n.language === 'ar' ? 'ar' : 'en';

    const getActivityBadge = (type) => {
        switch (type) {
            case 'check_in':
                return {
                    icon: <RiUserFollowLine size={16} />,
                    bg: 'rgba(6, 182, 212, 0.15)',
                    color: '#22d3ee',
                    label: t('attendance.title', 'Check-in')
                };
            case 'renewal':
                return {
                    icon: <RiShieldCheckLine size={16} />,
                    bg: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    label: t('members.renew', 'Renewal')
                };
            case 'new_member':
                return {
                    icon: <RiUserFollowLine size={16} />,
                    bg: 'rgba(133, 244, 15, 0.15)',
                    color: '#85F40F',
                    label: t('common.new', 'New Member')
                };
            case 'store_sale':
            default:
                return {
                    icon: <RiShoppingBag3Line size={16} />,
                    bg: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    label: t('store.title', 'Store Sale')
                };
        }
    };

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
            <Group justify="space-between" align="center" className="mb-4">
                <Stack gap={2}>
                    <Group gap="xs" align="center" wrap="nowrap" className="min-w-0">
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
                            <RiTimeLine size={18} />
                        </ThemeIcon>
                        <Title
                            order={3}
                            style={{
                                color: isDarkMode ? '#ffffff' : '#1e293b',
                                fontFamily: 'Inter, sans-serif'
                            }}
                            className="text-base font-bold min-w-0"
                        >
                            {t('dashboard.recentActivity', 'Recent Activities')}
                        </Title>
                    </Group>
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                    >
                        {t('dashboard.recentActivitySubtitle', 'Live member entries, payments, and sales')}
                    </Text>
                </Stack>

                <Button
                    component={Link}
                    to="/dashboard/attendance"
                    variant="light"
                    size="xs"
                    style={{
                        color: isDarkMode ? '#85F40F' : '#65a30d',
                        textDecoration: 'none'
                    }}
                    className="font-bold cursor-pointer hover:underline"
                >
                    {t('dashboard.viewAll', 'View All')}
                </Button>
            </Group>

            {/* List */}
            <Stack gap={0} className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1 overflow-y-auto pr-1">
                {activities?.map((act) => {
                    const badge = getActivityBadge(act.type);
                    const memberName = typeof act.member === 'object' ? (act.member[lang] || act.member.en) : act.member;
                    const detailText = typeof act.plan === 'object'
                        ? (act.plan[lang] || act.plan.en)
                        : (typeof act.item === 'object' ? (act.item[lang] || act.item.en) : (act.plan || act.item || act.phone));
                    const timeAgoText = typeof act.timeAgo === 'object' ? (act.timeAgo[lang] || act.timeAgo.en) : (act.timeAgo || act.time);

                    return (
                        <Group key={act.id} justify="space-between" align="center" gap="sm" className="py-2.5 text-xs" wrap="nowrap">
                            <Group gap="sm" align="center" className="min-w-0 flex-1" wrap="nowrap">
                                <Box
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: badge.bg, color: badge.color }}
                                >
                                    {badge.icon}
                                </Box>
                                <Stack gap={1} className="min-w-0 flex-1">
                                    <Text
                                        size="xs"
                                        style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b' }}
                                        className="font-bold truncate"
                                    >
                                        {memberName}
                                    </Text>
                                    <Text
                                        size="xs"
                                        style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}
                                        className="text-[11px] truncate"
                                    >
                                        {detailText}
                                    </Text>
                                </Stack>
                            </Group>

                            <Stack gap={1} align="flex-end" className="shrink-0 text-end">
                                {act.amount ? (
                                    <Text
                                        component="span"
                                        dir="ltr"
                                        size="xs"
                                        style={{ color: isDarkMode ? '#85F40F' : '#15803d' }}
                                        className="font-bold"
                                    >
                                        +{formatCurrency(act.amount, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
                                    </Text>
                                ) : (
                                    <Text
                                        component="span"
                                        size="xs"
                                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                                        className="font-medium"
                                    >
                                        {badge.label}
                                    </Text>
                                )}
                                <Text
                                    component="span"
                                    size="xs"
                                    style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}
                                    className="text-[10px]"
                                >
                                    {timeAgoText}
                                </Text>
                            </Stack>
                        </Group>
                    );
                })}
            </Stack>
        </Card>
    );
};

export default RecentActivityFeed;