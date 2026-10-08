import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Stack, Text, Title, ThemeIcon, SimpleGrid, UnstyledButton } from '@mantine/core';
import { MdFitnessCenter } from 'react-icons/md';
import { RiUserAddLine, RiCalendarCheckLine, RiWallet3Line } from 'react-icons/ri';

const DashboardEmptyState = ({ isDarkMode }) => {
    const { t } = useTranslation();

    const quickLinks = [
        {
            to: '/dashboard/members',
            label: t('dashboard.addFirstMember', 'Register First Member'),
            icon: <RiUserAddLine size={18} />,
            color: '#85F40F',
            bg: 'rgba(133, 244, 15, 0.15)',
            hoverBorder: 'hover:border-[#85F40F]'
        },
        {
            to: '/dashboard/attendance',
            label: t('attendance.quickCheckIn', 'Record Check-in'),
            icon: <RiCalendarCheckLine size={18} />,
            color: '#06B6D4',
            bg: 'rgba(6, 182, 212, 0.15)',
            hoverBorder: 'hover:border-cyan-500'
        },
        {
            to: '/dashboard/expenses',
            label: t('dashboard.addFirstExpense', 'Record First Expense'),
            icon: <RiWallet3Line size={18} />,
            color: '#FB923C',
            bg: 'rgba(251, 146, 60, 0.15)',
            hoverBorder: 'hover:border-orange-500'
        }
    ];

    return (
        <Card
            radius="xl"
            p={{ base: 'md', sm: 'xl' }}
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                borderRadius: '20px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}
            className="border text-center max-w-xl mx-auto my-1"
        >
            <Stack align="center" gap="sm">
                <ThemeIcon
                    radius="lg"
                    size={54}
                    style={{
                        backgroundColor: 'rgba(133, 244, 15, 0.15)',
                        color: '#85F40F',
                        borderRadius: '16px'
                    }}
                    className="shadow-md shadow-[#85F40F]/10 mx-auto"
                >
                    <MdFitnessCenter size={28} />
                </ThemeIcon>

                <Stack gap={2} className="max-w-md mx-auto">
                    <Title
                        order={3}
                        style={{
                            color: isDarkMode ? '#ffffff' : '#1e293b',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        className="text-base sm:text-lg font-black"
                    >
                        {t('dashboard.emptyTitle', 'Welcome to Your Gym Management Dashboard!')}
                    </Title>
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        className="leading-relaxed"
                    >
                        {t('dashboard.emptyDesc', 'No operational records yet. Start by registering members, subscription plans, and logging attendance.')}
                    </Text>
                </Stack>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs" className="w-full mt-2">
                    {quickLinks.map((link) => (
                        <UnstyledButton
                            key={link.to}
                            component={Link}
                            to={link.to}
                            style={{
                                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc',
                                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                                borderRadius: '12px',
                                textDecoration: 'none'
                            }}
                            className={`p-2.5 border transition-all flex flex-col items-center gap-1.5 group cursor-pointer hover:-translate-y-0.5 ${link.hoverBorder}`}
                        >
                            <ThemeIcon
                                radius="md"
                                size={32}
                                style={{
                                    backgroundColor: link.bg,
                                    color: link.color,
                                    borderRadius: '8px'
                                }}
                                className="transition-transform group-hover:scale-105"
                            >
                                {link.icon}
                            </ThemeIcon>
                            <Text
                                size="xs"
                                style={{ color: isDarkMode ? '#e2e8f0' : '#334155' }}
                                className="font-bold text-[11px] group-hover:text-white"
                            >
                                {link.label}
                            </Text>
                        </UnstyledButton>
                    ))}
                </SimpleGrid>
            </Stack>
        </Card>
    );
};

export default DashboardEmptyState;