import { Box, Stack, SimpleGrid, Grid, Card, Group, Skeleton } from '@mantine/core';

const DashboardSkeleton = ({ isDarkMode }) => {
    const cardStyle = {
        backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
        borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
        borderRadius: '16px'
    };

    return (
        <Box className="w-full pb-10 animate-pulse transition-all duration-300 ease-in-out">
            <Stack gap="xl">
                {/* Header Skeleton */}
                <Card
                    radius="lg"
                    p={{ base: 'md', sm: 'xl' }}
                    style={cardStyle}
                    className="border shadow-smoothCard"
                >
                    <Group justify="space-between" align="center" gap="md" wrap="wrap">
                        <Stack gap={8} className="flex-1 min-w-60">
                            <Skeleton height={28} width="40%" radius="xl" />
                            <Skeleton height={14} width="60%" radius="xl" />
                        </Stack>
                        <Group gap="xs" wrap="wrap">
                            <Skeleton height={36} width={130} radius="xl" />
                            <Skeleton height={36} width={140} radius="xl" />
                            <Skeleton height={36} width={100} radius="xl" />
                        </Group>
                    </Group>
                </Card>

                {/* 1. 6 KPI Stats Cards Skeletons */}
                <Grid gutter="md">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <Grid.Col
                            key={idx}
                            span={{ base: 12, sm: 6, lg: 4 }}
                        >
                            <Card
                                radius="lg"
                                p="lg"
                                style={cardStyle}
                                className="border shadow-smoothCard space-y-3 h-full"
                            >
                                <Group justify="space-between" align="flex-start" wrap="nowrap">
                                    <Stack gap={6} className="flex-1">
                                        <Skeleton height={14} width="55%" radius="xl" />
                                        <Skeleton height={10} width="75%" radius="xl" />
                                    </Stack>
                                    <Skeleton height={38} width={38} circle />
                                </Group>
                                <Box className="my-2">
                                    <Skeleton height={26} width="65%" radius="xl" />
                                </Box>
                                <Group gap="xs">
                                    <Skeleton height={18} width={50} radius="xl" />
                                    <Skeleton height={10} width={70} radius="xl" />
                                </Group>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>

                {/* 2. 4 Segment Counters Skeletons */}
                <Stack gap="sm">
                    <Stack gap={4}>
                        <Skeleton height={18} width={200} radius="xl" />
                        <Skeleton height={12} width={280} radius="xl" />
                    </Stack>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <Card
                                key={idx}
                                radius="lg"
                                p="lg"
                                style={cardStyle}
                                className="border shadow-smoothCard space-y-3"
                            >
                                <Group justify="space-between" align="flex-start" wrap="nowrap">
                                    <Stack gap={6} className="flex-1">
                                        <Skeleton height={14} width="45%" radius="xl" />
                                        <Skeleton height={10} width="70%" radius="xl" />
                                    </Stack>
                                    <Skeleton height={38} width={38} circle />
                                </Group>
                                <Box className="my-2">
                                    <Skeleton height={26} width="50%" radius="xl" />
                                </Box>
                                <Skeleton height={14} width="100%" radius="xl" />
                            </Card>
                        ))}
                    </SimpleGrid>
                </Stack>

                {/* 3. Mid Charts Grid */}
                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                    <Card radius="lg" p="lg" style={cardStyle} className="border space-y-4">
                        <Group justify="space-between" align="center">
                            <Skeleton height={20} width={160} radius="xl" />
                            <Skeleton height={28} width={130} radius="xl" />
                        </Group>
                        <Skeleton height={256} width="100%" radius="lg" />
                    </Card>
                    <Card radius="lg" p="lg" style={cardStyle} className="border space-y-4">
                        <Group justify="space-between" align="center">
                            <Skeleton height={20} width={160} radius="xl" />
                            <Skeleton height={16} width={100} radius="xl" />
                        </Group>
                        <Skeleton height={256} width="100%" radius="lg" />
                    </Card>
                </SimpleGrid>

                {/* 4. Bottom Grid (50 / 50) */}
                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                    <Card radius="lg" p="lg" style={cardStyle} className="border space-y-4 h-full">
                        <Skeleton height={20} width={160} radius="xl" />
                        <Skeleton height={256} width="100%" radius="lg" />
                        <Group gap="xs" justify="center" pt="xs">
                            <Skeleton height={28} width={110} radius="xl" />
                            <Skeleton height={28} width={110} radius="xl" />
                            <Skeleton height={28} width={110} radius="xl" />
                            <Skeleton height={28} width={110} radius="xl" />
                        </Group>
                    </Card>

                    <Card radius="lg" p="lg" style={cardStyle} className="border space-y-4 h-full">
                        <Group justify="space-between" align="center">
                            <Skeleton height={20} width={160} radius="xl" />
                            <Skeleton height={16} width={70} radius="xl" />
                        </Group>
                        <Stack gap="xs">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <Group key={idx} justify="space-between" align="center" py="xs">
                                    <Group gap="sm">
                                        <Skeleton height={32} width={32} radius="md" />
                                        <Stack gap={4}>
                                            <Skeleton height={12} width={120} radius="xl" />
                                            <Skeleton height={10} width={80} radius="xl" />
                                        </Stack>
                                    </Group>
                                    <Skeleton height={14} width={60} radius="xl" />
                                </Group>
                            ))}
                        </Stack>
                    </Card>
                </SimpleGrid>
            </Stack>
        </Box>
    );
};

export default DashboardSkeleton;