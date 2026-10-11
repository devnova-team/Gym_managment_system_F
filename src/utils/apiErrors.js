/**
 * Helpers for the API error contract:
 *   { success: false, message: "Validation failed.", errors: { field: ["message"] } }
 */

/**
 * Copies 422 field errors from the backend onto the matching form fields.
 * Returns true when at least one field error was applied.
 */
export const applyServerFieldErrors = (error, setError, fieldNames = []) => {
    const fieldErrors = error?.data?.errors;
    if (error?.status !== 422 || !fieldErrors || typeof setError !== 'function') return false;

    let applied = false;
    Object.entries(fieldErrors).forEach(([field, messages]) => {
        if (fieldNames.length && !fieldNames.includes(field)) return;
        const message = Array.isArray(messages) ? messages[0] : messages;
        if (!message) return;
        setError(field, { type: 'server', message }, { shouldFocus: !applied });
        applied = true;
    });

    return applied;
};

export const getApiErrorMessage = (error, fallback) => error?.data?.message || fallback;
