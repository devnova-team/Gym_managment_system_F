import { useTranslation } from 'react-i18next';
import { Button, Paper } from '@mantine/core';
import { RiErrorWarningLine, RiRefreshLine } from 'react-icons/ri';

const SubscriptionsErrorState = ({
    onRetry,
    isRetrying,
    titleKey = 'subscriptions.loadErrorTitle',
    descriptionKey = 'subscriptions.loadErrorDesc',
}) => {
    const { t } = useTranslation();

    return (
        <Paper
            radius="lg"
            className="p-12 flex flex-col items-center text-center bg-white dark:bg-[#0e1517]! border border-slate-200 dark:border-slate-800"
        >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
                <RiErrorWarningLine size={28} />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">{t(titleKey)}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{t(descriptionKey)}</p>
            <Button
                onClick={onRetry}
                loading={isRetrying}
                size="xs"
                radius="md"
                variant="light"
                color="red"
                leftSection={<RiRefreshLine size={14} />}
                className="mt-4 cursor-pointer"
            >
                {t('subscriptions.retry')}
            </Button>
        </Paper>
    );
};

export default SubscriptionsErrorState;
