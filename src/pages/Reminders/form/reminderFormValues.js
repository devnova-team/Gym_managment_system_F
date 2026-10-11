export const getReminderDefaultValues = (dueDate = '') => ({
    title: '',
    due_date: dueDate,
    note: '',
});

/** gym_id is never sent: the backend derives it from the access token. */
export const toReminderPayload = (values) => ({
    title: values.title.trim(),
    due_date: values.due_date,
    note: values.note?.trim() || null,
});
