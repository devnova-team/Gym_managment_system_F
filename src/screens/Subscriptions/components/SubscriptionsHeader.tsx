import { useTranslation } from 'react-i18next';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { FiPlus } from 'react-icons/fi';

const SubscriptionsHeader = ({ onCreate }) => {
    const { t } = useTranslation();

    return (
        <Card
            radius="lg"
            p={{ base: 'md', sm: 'xl' }}
            className="bg-white! dark:bg-[#0e1517]! border border-slate-200/80 dark:border-[#85F40F]/25 shadow-[0_10px_30px_-5px_rgba(133,244,15,0.18)]"
        >
            <Group justify="space-between" align="center" gap="md" wrap="wrap">
                <Stack gap={6} className="min-w-0">
                    <Title className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                        {t('subscriptions.title')}
                    </Title>
                    <Text className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                        {t('subscriptions.subtitle')}
                    </Text>
                </Stack>

                <Button
                    onClick={onCreate}
                    size="sm"
                    radius="md"
                    leftSection={<FiPlus size={16} />}
                    className="w-full! md:w-auto! justify-center font-bold cursor-pointer bg-[#85F40F]! hover:bg-[#79BE0D]! text-slate-950!"
                >
                    {t('subscriptions.create')}
                </Button>
            </Group>
        </Card>
    );
};

export default SubscriptionsHeader;
