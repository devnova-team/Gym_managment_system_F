import { lazy, Suspense, useContext } from 'react';
import { Box, Stack, SimpleGrid, Skeleton } from '@mantine/core';
import { AuthContext } from '../../AuthContext/AuthProvider';
import { useTheme } from '../../Context/ThemeContext';
import { useDashboardData } from './hooks/useDashboardData';
import DashboardOverviewHeader from './components/DashboardOverviewHeader';
import DashboardEmptyState from './components/DashboardEmptyState';
import DashboardSkeleton from './components/DashboardSkeleton';

const StatsCards = lazy(() => import('./components/StatsCards'));
const SegmentCounters = lazy(() => import('./components/SegmentCounters'));
const AttendanceChart = lazy(() => import('./components/AttendanceChart'));
const RevenueExpenseChart = lazy(() => import('./components/RevenueExpenseChart'));
const MembershipDistributionChart = lazy(() => import('./components/MembershipDistributionChart'));
const RecentActivityFeed = lazy(() => import('./components/RecentActivityFeed'));

const SectionFallback = ({ height }: { height: number }) => (
    <Box role="status" aria-label="Loading dashboard section">
        <Skeleton height={height} radius="lg" />
    </Box>
);

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
                        <Suspense fallback={<SectionFallback height={150} />}>
                            <StatsCards summary={data?.summary} isDarkMode={isDarkMode} />
                        </Suspense>

                        {/* 2. 4 Segment Counters */}
                        <Suspense fallback={<SectionFallback height={190} />}>
                            <SegmentCounters segments={data?.segmentCounters} isDarkMode={isDarkMode} />
                        </Suspense>

                        {/* 3. Main Analytics Charts Grid */}
                        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                            <Suspense fallback={<SectionFallback height={320} />}>
                                <AttendanceChart
                                    attendanceData={data?.attendanceTrend}
                                    isDarkMode={isDarkMode}
                                />
                            
                           
                                <RevenueExpenseChart
                                    trendData={data?.revenueVsExpensesTrend}
                                    isDarkMode={isDarkMode}
                                />
                            </Suspense>
                        </SimpleGrid>

                        {/* 4. Secondary Row: Membership Distribution & Live Activity (50 / 50) */}
                        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                            <Suspense fallback={<SectionFallback height={320} />}>
                                <MembershipDistributionChart
                                    distributionData={data?.membershipDistribution}
                                    isDarkMode={isDarkMode}
                                />
                            
                            
                                <RecentActivityFeed
                                    activities={data?.recentActivities}
                                    isDarkMode={isDarkMode}
                                />
                            </Suspense>
                        </SimpleGrid>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default DashboardOverview;