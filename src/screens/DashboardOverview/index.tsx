import { useContext } from 'react';
import { Box, Stack, SimpleGrid, Grid } from '@mantine/core';
import { AuthContext } from '../../AuthContext/AuthProvider';
import { useTheme } from '../../Context/ThemeContext';
import { useDashboardData } from './hooks/useDashboardData';
import DashboardOverviewHeader from './components/DashboardOverviewHeader';
import StatsCards from './components/StatsCards';
import SegmentCounters from './components/SegmentCounters';
import AttendanceChart from './components/AttendanceChart';
import RevenueExpenseChart from './components/RevenueExpenseChart';
import MembershipDistributionChart from './components/MembershipDistributionChart';
import RecentActivityFeed from './components/RecentActivityFeed';
import DashboardEmptyState from './components/DashboardEmptyState';
import DashboardSkeleton from './components/DashboardSkeleton';

const DashboardOverview = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode } = useTheme();

    const {
        data,
        hasNoData,
        isLoading,
        isEmptyMode,
        toggleEmptyMode
    } = useDashboardData();

    if (isLoading) {
        return <DashboardSkeleton isDarkMode={isDarkMode} />;
    }

    return (
        <Box className={`w-full transition-all duration-300 ease-in-out ${hasNoData ? 'pb-2' : 'pb-10'}`}>
            <Stack gap={hasNoData ? 'md' : 'xl'}>
                {/* Top Welcome & Executive Header */}
                <DashboardOverviewHeader
                    gymInfo={data?.gymInfo}
                    userName={user?.name}
                    isEmptyMode={isEmptyMode}
                    toggleEmptyMode={toggleEmptyMode}
                    isDarkMode={isDarkMode}
                />

                {/* If empty mode is active */}
                {hasNoData ? (
                    <DashboardEmptyState isDarkMode={isDarkMode} />
                ) : (
                    <>
                        {/* 1. Primary KPI Stats Cards (5 cards) */}
                        <StatsCards summary={data?.summary} isDarkMode={isDarkMode} />

                        {/* 2. 4 Segment Counters */}
                        <SegmentCounters segments={data?.segmentCounters} isDarkMode={isDarkMode} />

                        {/* 3. Main Analytics Charts Grid */}
                        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                            <AttendanceChart
                                attendanceData={data?.attendanceTrend}
                                isDarkMode={isDarkMode}
                            />
                            <RevenueExpenseChart
                                trendData={data?.revenueVsExpensesTrend}
                                isDarkMode={isDarkMode}
                            />
                        </SimpleGrid>

                        {/* 4. Secondary Row: Membership Distribution & Live Activity (50 / 50) */}
                        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                            <MembershipDistributionChart
                                distributionData={data?.membershipDistribution}
                                isDarkMode={isDarkMode}
                            />
                            <RecentActivityFeed
                                activities={data?.recentActivities}
                                isDarkMode={isDarkMode}
                            />
                        </SimpleGrid>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default DashboardOverview;