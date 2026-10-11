import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseButton } from '@mantine/core';
import { RiNotification3Line } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import { DueStatusTabs } from '../../components/DueStatus';
import { useLanguage } from '../../Context/LanguageContext';
import { formatISODate, todayISO } from '../../utils/dateOnly';
import { useReminders } from './hooks/useReminders';
import RemindersCalendar from './components/RemindersCalendar';
import RemindersList from './components/RemindersList';
import ReminderFormModal from './form/ReminderFormModal';

const Reminders = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const {
        reminders,
        totalCount,
        statusCounts,
        statusFilter,
        setStatusFilter,
        selectedDate,
        toggleSelectedDate,
        clearSelectedDate,
        dateMarkers,
        isLoading,
        isError,
        refetch,
        createReminder,
        isSaving,
    } = useReminders();

    const [isFormOpen, setIsFormOpen] = useState(false);

    // Pre-fill the form with the selected calendar day when it is not in the past.
    const initialDueDate = selectedDate && selectedDate >= todayISO() ? selectedDate : '';

    return (
        <div className="w-full space-y-6 pb-10">
            <PageHeader
                icon={<RiNotification3Line size={22} />}
                title={t('reminders.title', 'Administrative Reminders')}
                subtitle={t('reminders.subtitle', 'Administrative tasks and deadlines for your gym.')}
                actionLabel={t('reminders.addReminder', 'Create Reminder')}
                onAction={() => setIsFormOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-4 order-2 lg:order-1">
                    <DueStatusTabs value={statusFilter} onChange={setStatusFilter} counts={statusCounts} total={totalCount} />

                    {selectedDate && (
                        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#85F40F]/10 border border-[#85F40F]/30 text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {t('reminders.showingDate', {
                                date: formatISODate(selectedDate, language),
                                defaultValue: 'Showing reminders for {{date}}',
                            })}
                            <CloseButton
                                size="sm"
                                onClick={clearSelectedDate}
                                aria-label={t('reminders.clearDate', 'Show all dates')}
                            />
                        </div>
                    )}

                    <RemindersList
                        reminders={reminders}
                        totalCount={totalCount}
                        isLoading={isLoading}
                        isError={isError}
                        onRetry={refetch}
                        onAdd={() => setIsFormOpen(true)}
                    />
                </div>

                <div className="lg:col-span-4 order-1 lg:order-2">
                    <RemindersCalendar
                        dateMarkers={dateMarkers}
                        selectedDate={selectedDate}
                        onSelectDate={toggleSelectedDate}
                    />
                </div>
            </div>

            <ReminderFormModal
                opened={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialDueDate={initialDueDate}
                onCreate={createReminder}
                isSaving={isSaving}
            />
        </div>
    );
};

export default Reminders;
