import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../Context/ToastContext';
import { useMockCollection } from '../../../hooks/useMockCollection';
import { ALL_STATUSES, DUE_STATUS_ORDER, countByDueStatus } from '../../../components/DueStatus';
import { getDueStatus, todayISO } from '../../../utils/dateOnly';
import { REMINDERS_STORAGE_KEY } from '../constants/reminderConstants';
import { MOCK_REMINDERS } from '../constants/mockReminders';

/** Most urgent status per date, used for the calendar markers. */
const buildDateMarkers = (reminders) =>
    reminders.reduce((markers, { due_date: date, status }) => {
        const current = markers[date];
        const isMoreUrgent = !current || DUE_STATUS_ORDER.indexOf(status) < DUE_STATUS_ORDER.indexOf(current);
        if (isMoreUrgent) markers[date] = status;
        return markers;
    }, {});

// API phase: replace useMockCollection with useGetRemindersQuery and
// useCreateReminderMutation from remindersApi.
export const useReminders = () => {
    const { t } = useTranslation();
    const { toast } = useToast();

    const { data, isLoading, isError, refetch, create, isMutating } = useMockCollection({
        storageKey: REMINDERS_STORAGE_KEY,
        seed: MOCK_REMINDERS,
    });

    const [statusFilter, setStatusFilter] = useState(ALL_STATUSES);
    const [selectedDate, setSelectedDate] = useState(null);

    const reminders = useMemo(() => {
        const today = todayISO();
        return data
            .map((reminder) => ({ ...reminder, status: getDueStatus(reminder.due_date, today) }))
            .sort((a, b) => a.due_date.localeCompare(b.due_date));
    }, [data]);

    const statusCounts = useMemo(() => countByDueStatus(reminders, (item) => item.status), [reminders]);
    const dateMarkers = useMemo(() => buildDateMarkers(reminders), [reminders]);

    const visibleReminders = useMemo(
        () =>
            reminders.filter(
                (reminder) =>
                    (statusFilter === ALL_STATUSES || reminder.status === statusFilter) &&
                    (!selectedDate || reminder.due_date === selectedDate)
            ),
        [reminders, statusFilter, selectedDate]
    );

    const toggleSelectedDate = useCallback(
        (date) => setSelectedDate((current) => (current === date ? null : date)),
        []
    );

    /** Rejects with the API error so the form can show field errors. */
    const createReminder = useCallback(
        async (payload) => {
            await create(payload);
            toast.success(t('reminders.created', 'Reminder created successfully'));
        },
        [create, toast, t]
    );

    return {
        reminders: visibleReminders,
        totalCount: reminders.length,
        statusCounts,
        statusFilter,
        setStatusFilter,
        selectedDate,
        toggleSelectedDate,
        clearSelectedDate: () => setSelectedDate(null),
        dateMarkers,
        isLoading,
        isError,
        refetch,
        createReminder,
        isSaving: isMutating,
    };
};

export default useReminders;
