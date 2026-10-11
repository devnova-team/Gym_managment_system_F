import * as yup from 'yup';
import { addYears, todayISO } from '../../../utils/dateOnly';
import { HAS_LETTER_PATTERN, blankToNull, isoDateString } from '../../../utils/validationRules';
import { REMINDER_RULES } from '../constants/reminderConstants';

const { TITLE_MIN, TITLE_MAX, NOTE_MAX, MAX_YEARS_AHEAD } = REMINDER_RULES;

export const getReminderValidationSchema = (t, today = todayISO()) => {
    const latestDueDate = addYears(today, MAX_YEARS_AHEAD);

    return yup.object({
        title: yup
            .string()
            .trim()
            .required(t('reminders.validation.titleRequired', 'Reminder title is required'))
            .min(TITLE_MIN, t('reminders.validation.titleMin', { min: TITLE_MIN, defaultValue: 'Title must be at least {{min}} characters' }))
            .max(TITLE_MAX, t('reminders.validation.titleMax', { max: TITLE_MAX, defaultValue: 'Title cannot exceed {{max}} characters' }))
            .matches(HAS_LETTER_PATTERN, t('validation.mustContainLetters', 'Must contain letters, not only numbers or symbols')),

        due_date: isoDateString(t('validation.invalidDate', 'Enter a valid date'))
            .required(t('reminders.validation.dueDateRequired', 'Due date is required'))
            .test(
                'not-past',
                t('reminders.validation.dueDatePast', 'Due date cannot be in the past'),
                (value) => !value || value >= today
            )
            .test(
                'not-too-far',
                t('reminders.validation.dueDateTooFar', { years: MAX_YEARS_AHEAD, defaultValue: 'Due date must be within {{years}} years' }),
                (value) => !value || value <= latestDueDate
            ),

        note: yup
            .string()
            .trim()
            .transform(blankToNull)
            .nullable()
            .max(NOTE_MAX, t('reminders.validation.noteMax', { max: NOTE_MAX, defaultValue: 'Note cannot exceed {{max}} characters' })),
    });
};

export default getReminderValidationSchema;
