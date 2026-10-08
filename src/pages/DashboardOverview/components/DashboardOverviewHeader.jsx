import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Group, Stack, Title, Text, Button, Badge } from '@mantine/core';
import { FiUserPlus, FiCheckSquare, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const DashboardOverviewHeader = ({
    gymInfo,
    userName = 'Captain Ahmed',
    isEmptyMode,
    toggleEmptyMode,
    isDarkMode
}) => {
    const { t } = useTranslation();

    return (
        <Card
            radius="lg"
            p={{ base: 'md', sm: 'xl' }}
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(133, 244, 15, 0.25)' : 'rgba(226, 232, 240, 0.8)',
                borderRadius: '16px'
            }}
            className="border shadow-[0_10px_30px_-5px_rgba(133,244,15,0.18),0_4px_15px_-3px_rgba(108,200,10,0.15)] dark:shadow-[0_12px_35px_-8px_rgba(133,244,15,0.22),0_4px_15px_-3px_rgba(108,200,10,0.2)]"
        >
            <Group justify="space-between" align="center" gap="md" wrap="wrap">
                {/* Left: Gym Badge, Title & Greeting */}
                <Stack gap={4} className="min-w-0">
                    <Title
                        style={{
                            color: isDarkMode ? '#ffffff' : '#1e293b',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        className="text-xl sm:text-2xl font-black tracking-tight"
                    >
                        {t('dashboard.welcome', 'Welcome back')}, {userName}
                    </Title>
                    <Text
                        size="sm"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        className="text-xs sm:text-sm font-medium"
                    >
                        {t('dashboard.subtitle', 'Track your gym performance, member activity, and financial health in real time.')}
                    </Text>
                </Stack>

                {/* Right: Quick Actions with react-router-dom Link (Full width single row on mobile/responsive) */}
                <div
                    className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-2"
                >
                    {/* Demo Toggle (Empty vs Live) */}
                    <Button
                        variant="default"
                        size="sm"
                        radius="md"
                        leftSection={
                            isEmptyMode ? (
                                <FiToggleRight size={16} className="text-[#85F40F]" />
                            ) : (
                                <FiToggleLeft size={16} className="text-slate-400" />
                            )
                        }
                        onClick={toggleEmptyMode}
                        style={{
                            backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
                            borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                            color: isDarkMode ? '#e2e8f0' : '#334155',
                            borderRadius: '12px'
                        }}
                        className="w-full! md:w-auto! justify-center font-bold cursor-pointer"
                        title={t('dashboard.demoToggle', 'Toggle Empty State Demo')}
                    >
                        {isEmptyMode
                            ? t('dashboard.showLiveData', 'Show Live Data')
                            : t('dashboard.testEmptyState', 'Test Empty State')}
                    </Button>

                    {/* Quick Register Member */}
                    <Button
                        component={Link}
                        to="/dashboard/members"
                        variant="default"
                        size="sm"
                        radius="md"
                        leftSection={<FiUserPlus size={15} />}
                        style={{
                            backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
                            borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                            color: isDarkMode ? '#ffffff' : '#1e293b',
                            borderRadius: '12px'
                        }}
                        className="w-full! md:w-auto! justify-center font-bold cursor-pointer"
                    >
                        {t('members.addMember', 'Register Member')}
                    </Button>

                    {/* Quick Check-in */}
                    <Button
                        component={Link}
                        to="/dashboard/attendance"
                        size="sm"
                        radius="md"
                        leftSection={<FiCheckSquare size={15} />}
                        style={{
                            backgroundColor: '#85F40F',
                            color: '#020617',
                            borderRadius: '12px',
                            boxShadow: '0 4px 14px rgba(133, 244, 15, 0.3)'
                        }}
                        className="w-full! md:w-auto! justify-center font-black hover:opacity-95 cursor-pointer border-0"
                    >
                        {t('attendance.quickCheckIn', 'Quick Check-in')}
                    </Button>
                </div>
            </Group>
        </Card>
    );
};

export default DashboardOverviewHeader;