'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { FiPlus } from 'react-icons/fi';
import { usePlans } from '@/features/plans/hooks/usePlans';
import PlansPanel from '@/features/plans/screens/PlansPanel';

const Plans = () => {
    const { t } = useTranslation();
    const { canManagePlans } = usePlans({ enabled: false });
    const [form, setForm] = useState({ opened: false, plan: null });

    const openCreate = useCallback(() => setForm({ opened: true, plan: null }), []);
    const openEdit = useCallback((plan) => setForm({ opened: true, plan }), []);
    const closeForm = useCallback(() => setForm((current) => ({ ...current, opened: false })), []);

    return (
        <Box className="w-full pb-10">
            <Stack gap="xl">
                <Card
                    radius="lg"
                    p={{ base: 'md', sm: 'xl' }}
                    className="bg-white! dark:bg-[#0e1517]! border border-slate-200/80 dark:border-[#85F40F]/25 shadow-[0_10px_30px_-5px_rgba(133,244,15,0.18)]"
                >
                    <Group justify="space-between" align="center" gap="md" wrap="wrap">
                        <Stack gap={6} className="min-w-0">
                            <Title className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                                {t('plans.title')}
                            </Title>
                            <Text className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                {t('plans.subtitle')}
                            </Text>
                        </Stack>
                        {canManagePlans && (
                            <Button
                                onClick={openCreate}
                                size="sm"
                                radius="md"
                                leftSection={<FiPlus size={16} />}
                                className="w-full! md:w-auto! justify-center font-bold cursor-pointer bg-[#85F40F]! hover:bg-[#79BE0D]! text-slate-950!"
                            >
                                {t('plans.create')}
                            </Button>
                        )}
                    </Group>
                </Card>
                <PlansPanel
                    form={form}
                    onCreate={openCreate}
                    onEdit={openEdit}
                    onCloseForm={closeForm}
                />
            </Stack>
        </Box>
    );
};

export default Plans;
