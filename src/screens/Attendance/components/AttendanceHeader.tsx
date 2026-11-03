import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { RiRefreshLine } from 'react-icons/ri';

const getSyncBadge = (t, { isOnline, isSyncing, pendingCount }) => {
    if (!isOnline) return { color: 'gray', label: t('attendance.syncStatusOffline') };
    if (isSyncing) return { color: 'blue', label: t('attendance.syncStatusSyncing') };
    if (pendingCount > 0) return { color: 'yellow', label: t('attendance.syncStatusPending', { count: pendingCount }) };
    return { color: 'green', label: t('attendance.syncStatusOnline') };
};

const AttendanceHeader = ({ isOnline, isSyncing, pendingCount, onSync }) => {
    const { t } = useTranslation();
    const badge = getSyncBadge(t, { isOnline, isSyncing, pendingCount });

    return (
        <Card
            radius="lg"
            p={{ base: 'md', sm: 'xl' }}
            className="bg-white! dark:bg-[#0e1517]! border border-slate-200/80 dark:border-[#85F40F]/25 shadow-[0_10px_30px_-5px_rgba(133,244,15,0.18)]"
        >
            <Group justify="space-between" align="center" gap="md" wrap="wrap">
                <Stack gap={6} className="min-w-0">
                    <Title className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                        {t('attendance.title')}
                    </Title>
                    <Text className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                        {t('attendance.description')}
                    </Text>
                </Stack>

                <Group gap="sm">
                    <Badge color={badge.color} variant="light" radius="sm" style={{ textTransform: 'none' }}>
                        {badge.label}
                    </Badge>
                    {isOnline && pendingCount > 0 && (
                        <Button
                            size="xs"
                            radius="md"
                            variant="light"
                            color="lime"
                            loading={isSyncing}
                            leftSection={<RiRefreshLine size={14} />}
                            onClick={onSync}
                            className="font-bold cursor-pointer"
                        >
                            {t('attendance.syncNow')}
                        </Button>
                    )}
                </Group>
            </Group>
        </Card>
    );
};

export default AttendanceHeader;
