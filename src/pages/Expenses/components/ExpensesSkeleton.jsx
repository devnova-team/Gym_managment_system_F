import { Box, Stack, Card, Group, Skeleton } from '@mantine/core';

const ExpensesSkeleton = ({ isDarkMode }) => {
    const cardStyle = {
        backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
        borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
        borderRadius: '16px'
    };

    return (
        <Box className="w-full pb-10 animate-pulse transition-all duration-300 ease-in-out">
            <Stack gap="lg">
                {/* Header Skeleton */}
                <Card
                    radius="lg"
                    p={{ base: 'md', sm: 'xl' }}
                    style={cardStyle}
                    className="border shadow-smoothCard"
                >
                    <Group justify="space-between" align="center" gap="md" wrap="wrap">
                        <Stack gap={8} className="flex-1 min-w-60">
                            <Skeleton height={20} width={120} radius="xl" />
                            <Skeleton height={28} width="50%" radius="xl" />
                            <Skeleton height={14} width="70%" radius="xl" />
                        </Stack>
                        <Group gap="xs" wrap="wrap">
                            <Skeleton height={36} width={130} radius="xl" />
                            <Skeleton height={36} width={120} radius="xl" />
                            <Skeleton height={36} width={140} radius="xl" />
                        </Group>
                    </Group>
                </Card>

                {/* 1. Stats Cards Skeleton (Single Row, Full Width) */}
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <Card key={idx} radius="lg" p="md" style={cardStyle} className="border space-y-3 h-full flex flex-col justify-between">
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
                        ))}
                    </div>
                </div>

                {/* 2. Middle Row: Left Filter Skeleton (Vertical) + Right Doughnut Chart Skeleton (Equal Height) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Vertical Filters Skeleton (Search + 4 Selects) */}
                    <div className="lg:col-span-6 flex flex-col h-full">
                        <Card radius="lg" p="lg" style={cardStyle} className="border space-y-3 h-full flex flex-col justify-between">
                            <Stack gap={4} className="mb-2">
                                <Skeleton height={18} width={130} radius="xl" />
                                <Skeleton height={10} width={200} radius="xl" />
                            </Stack>
                            <Skeleton height={40} width="100%" radius="xl" />
                            <Skeleton height={40} width="100%" radius="xl" />
                            <Skeleton height={40} width="100%" radius="xl" />
                            <Skeleton height={40} width="100%" radius="xl" />
                            <Skeleton height={40} width="100%" radius="xl" />
                        </Card>
                    </div>

                    {/* Right: Doughnut Chart Skeleton */}
                    <div className="lg:col-span-6 flex flex-col h-full">
                        <Card radius="lg" p="lg" style={cardStyle} className="border space-y-4 h-full flex flex-col justify-between">
                            <Group gap="xs">
                                <Skeleton height={32} width={32} radius="md" />
                                <Stack gap={4} className="flex-1">
                                    <Skeleton height={16} width={140} radius="xl" />
                                    <Skeleton height={10} width={180} radius="xl" />
                                </Stack>
                            </Group>
                            <Box className="my-auto py-2 flex justify-center">
                                <Skeleton height={180} width={180} circle />
                            </Box>
                            <Group gap="xs" justify="center" wrap="wrap" className="pt-2 border-t border-slate-100 dark:border-white/5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} height={26} width={100} radius="xl" />
                                ))}
                            </Group>
                        </Card>
                    </div>
                </div>

                {/* Full Width Table Skeleton */}
                <div className="w-full">
                    <Card radius="lg" p="md" style={cardStyle} className="border space-y-4">
                        <Skeleton height={40} width="100%" radius="md" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} height={46} width="100%" radius="md" />
                        ))}
                        <Skeleton height={36} width={200} radius="xl" className="mx-auto" />
                    </Card>
                </div>
            </Stack>
        </Box>
    );
};

export default ExpensesSkeleton;