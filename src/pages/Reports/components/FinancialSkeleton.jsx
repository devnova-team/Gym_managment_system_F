import { Box, Stack, Card, Group, Skeleton, Grid, SimpleGrid } from '@mantine/core';

const FinancialSkeleton = ({ isDarkMode }) => {
    const cardStyle = {
        backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
        borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
        borderRadius: '16px'
    };

    return (
        <Box className="w-full pb-10 animate-pulse transition-all duration-300 ease-in-out">
            <Stack gap="lg">
                {/* Header Skeleton */}
                <Card radius="lg" p={{ base: 'md', sm: 'xl' }} style={cardStyle} className="border shadow-smoothCard">
                    <Group justify="space-between" align="center" gap="md" wrap="wrap">
                        <Stack gap={8} className="flex-1 min-w-60">
                            <Group gap="xs">
                                <Skeleton height={22} width={120} radius="xl" />
                                <Skeleton height={22} width={100} radius="xl" />
                            </Group>
                            <Skeleton height={28} width="50%" radius="xl" />
                            <Skeleton height={14} width="70%" radius="xl" />
                        </Stack>
                        <Group gap="xs" wrap="wrap">
                            <Skeleton height={36} width={140} radius="xl" />
                            <Skeleton height={36} width={120} radius="xl" />
                        </Group>
                    </Group>
                </Card>

                {/* 5 KPI Cards Skeletons */}
                <Grid gutter="md">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <Grid.Col key={idx} span={{ base: 12, sm: 6, lg: idx === 4 ? 4 : 2.66 }}>
                            <Card radius="lg" p="lg" style={cardStyle} className="border space-y-3">
                                <Group justify="space-between" align="flex-start">
                                    <Stack gap={6} className="flex-1">
                                        <Skeleton height={14} width="60%" radius="xl" />
                                        <Skeleton height={10} width="75%" radius="xl" />
                                    </Stack>
                                    <Skeleton height={38} width={38} circle />
                                </Group>
                                <Box className="my-2">
                                    <Skeleton height={26} width="65%" radius="xl" />
                                </Box>
                                <Skeleton height={16} width={90} radius="xl" />
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>

                {/* Period Selector Skeleton */}
                <Card radius="lg" p="md" style={cardStyle} className="border space-y-3">
                    <Group justify="space-between">
                        <Skeleton height={34} width={320} radius="xl" />
                        <Skeleton height={34} width={130} radius="xl" />
                    </Group>
                </Card>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    <div className="lg:col-span-2">
                        <Card radius="lg" p="lg" style={cardStyle} className="border space-y-4">
                            <Skeleton height={22} width={200} radius="xl" />
                            <Skeleton height={240} width="100%" radius="lg" />
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card radius="lg" p="lg" style={cardStyle} className="border space-y-4">
                            <Skeleton height={22} width={150} radius="xl" />
                            <Skeleton height={180} width="100%" radius="lg" />
                            <Skeleton height={70} width="100%" radius="md" />
                        </Card>
                    </div>
                </div>

                {/* Audit Table Skeleton */}
                <Card radius="lg" p="md" style={cardStyle} className="border space-y-4">
                    <Skeleton height={38} width="100%" radius="md" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} height={44} width="100%" radius="md" />
                    ))}
                </Card>
            </Stack>
        </Box>
    );
};

export default FinancialSkeleton;
