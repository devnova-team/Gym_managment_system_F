/**
 * Extracts a user-facing message from an RTK Query error.
 * Prefers the first field error (422), then the API message, then a generic fallback.
 * Messages may be i18n keys (from our route handlers) or plain backend text.
 */
export const getApiErrorMessage = (error, t) => {
    const data = error?.data;
    const firstFieldError = data?.errors ? Object.values(data.errors).flat()[0] : null;
    const message = firstFieldError || data?.message;

    return message ? t(message, message) : t('common.errorOccurred', 'An error occurred. Please try again.');
};
