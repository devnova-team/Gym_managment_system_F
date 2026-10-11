import { Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { RiErrorWarningLine, RiNotification3Line } from 'react-icons/ri';
import { TableEmptyState } from '../../../components/Tables';
import { useLanguage } from '../../../Context/LanguageContext';
import ReminderCard from './ReminderCard';

const EmptyCard = (props) => (
    <div className="bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-smoothCard">
        <TableEmptyState {...props} />
    </div>
);

const RemindersList = ({ reminders, totalCount, isLoading, isError, onRetry, onAdd }) => {
    const { t } = useTranslation();
    const { language } = useLanguage();

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} height={96} radius="lg" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <EmptyCard
                icon={<RiErrorWarningLine size={28} className="text-rose-500" />}
                title={t('reminders.loadError', 'Could not load reminders')}
                description={t('common.errorOccurred', 'An error occurred. Please try again.')}
                actionLabel={t('common.retry', 'Retry')}
                onAction={onRetry}
            />
        );
    }

    if (totalCount === 0) {
        return (
            <EmptyCard
                icon={<RiNotification3Line size={28} />}
                title={t('reminders.emptyTitle', 'No reminders yet')}
                description={t('reminders.emptyDescription', 'Create a reminder so important admin tasks are never missed.')}
                actionLabel={t('reminders.addReminder', 'Create Reminder')}
                onAction={onAdd}
            />
        );
    }

    if (reminders.length === 0) {
        return (
            <EmptyCard
                icon={<RiNotification3Line size={28} />}
                title={t('common.noResults', 'No matching results')}
                description={t('common.noResultsHint', 'Try a different search or filter.')}
            />
        );
    }

    return (
        <div className="space-y-3">
            {reminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} language={language} />
            ))}
        </div>
    );
};

export default RemindersList;
