import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCalendarEventLine, RiCheckLine, RiNotification3Line, RiStickyNoteLine } from 'react-icons/ri';
import { DynamicFormModal } from '../../../components/DynamicForm';
import TextInputField from '../../../components/Forms/TextInputField';
import DateField from '../../../components/Forms/DateField';
import { useToast } from '../../../Context/ToastContext';
import { applyServerFieldErrors, getApiErrorMessage } from '../../../utils/apiErrors';
import { addYears, todayISO } from '../../../utils/dateOnly';
import { REMINDER_FIELDS, REMINDER_RULES } from '../constants/reminderConstants';
import { getReminderValidationSchema } from './validationSchema';
import { getReminderDefaultValues, toReminderPayload } from './reminderFormValues';

const ReminderFormModal = ({ opened, onClose, initialDueDate, onCreate, isSaving }) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const today = todayISO();

    const validationSchema = useMemo(() => getReminderValidationSchema(t, today), [t, today]);
    const defaultValues = useMemo(() => getReminderDefaultValues(initialDueDate), [initialDueDate]);

    const fields = useMemo(
        () => [
            {
                name: 'title',
                colSpan: 12,
                component: ({ field, error }) => (
                    <TextInputField
                        {...field}
                        label={t('reminders.titleLabel', 'Title')}
                        placeholder={t('reminders.titlePlaceholder', 'e.g. Pay electricity bill')}
                        maxLength={REMINDER_RULES.TITLE_MAX}
                        error={error}
                        required
                        leftSection={<RiNotification3Line size={16} className="text-slate-400" />}
                    />
                ),
            },
            {
                name: 'due_date',
                colSpan: 12,
                component: ({ field, error }) => (
                    <DateField
                        {...field}
                        label={t('reminders.dueDate', 'Due Date')}
                        minDate={today}
                        maxDate={addYears(today, REMINDER_RULES.MAX_YEARS_AHEAD)}
                        error={error}
                        required
                        leftSection={<RiCalendarEventLine size={16} className="text-slate-400" />}
                    />
                ),
            },
            {
                name: 'note',
                colSpan: 12,
                component: ({ field, error }) => (
                    <TextInputField
                        {...field}
                        value={field.value ?? ''}
                        textarea
                        minRows={3}
                        maxRows={6}
                        label={t('reminders.note', 'Reminder Details')}
                        placeholder={t('reminders.notePlaceholder', 'Optional details...')}
                        description={`${(field.value ?? '').length} / ${REMINDER_RULES.NOTE_MAX}`}
                        error={error}
                        leftSection={<RiStickyNoteLine size={16} className="text-slate-400" />}
                    />
                ),
            },
        ],
        [t, today]
    );

    const handleSubmit = async (values, { setError }) => {
        try {
            await onCreate(toReminderPayload(values));
            onClose();
        } catch (error) {
            if (!applyServerFieldErrors(error, setError, REMINDER_FIELDS)) {
                toast.error(getApiErrorMessage(error, t('common.errorOccurred', 'An error occurred. Please try again.')));
            }
        }
    };

    return (
        <DynamicFormModal
            opened={opened}
            onClose={onClose}
            title={t('reminders.addReminder', 'Create Reminder')}
            subtitle={t('reminders.formSubtitle', 'Keep track of administrative tasks and their deadlines.')}
            icon={<RiNotification3Line size={20} className="text-[#85F40F]" />}
            fields={fields}
            validationSchema={validationSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            size="md"
            submitText={t('reminders.addReminder', 'Create Reminder')}
            submitIcon={<RiCheckLine size={18} />}
            cancelText={t('common.cancel', 'Cancel')}
        />
    );
};

export default ReminderFormModal;
