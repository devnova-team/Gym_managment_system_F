import * as yup from 'yup';

// =====================================================================
// Subscription Validation Schemas
// =====================================================================
// Shared between the client forms and the server route handlers
// (src/app/api/subscriptions). Messages are i18n keys under
// "subscriptions.errors". The backend stays the final authority.
// =====================================================================

export const PAYMENT_STATUSES = ['paid', 'unpaid'];
export const PAYMENT_METHODS = ['cash']; // Cash only in the MVP

// Empty form values ('' / null from a cleared select) count as missing, not as invalid numbers.
const toUndefinedIfEmpty = (value, originalValue) => (
    originalValue === '' || originalValue === null ? undefined : value
);

const recordId = (requiredMessage) => yup
    .number()
    .transform(toUndefinedIfEmpty)
    .typeError('subscriptions.errors.invalidId')
    .integer('subscriptions.errors.invalidId')
    .positive('subscriptions.errors.invalidId')
    .required(requiredMessage);

const paymentStatus = yup
    .string()
    .trim()
    .lowercase()
    .oneOf(PAYMENT_STATUSES, 'subscriptions.errors.paymentStatusInvalid')
    .required('subscriptions.errors.paymentStatusRequired');

const paymentMethod = yup
    .string()
    .trim()
    .lowercase()
    .oneOf(PAYMENT_METHODS, 'subscriptions.errors.paymentMethodInvalid')
    .default('cash');

// POST /api/subscriptions
export const createSubscriptionSchema = yup.object({
    member_id: recordId('subscriptions.errors.memberIdRequired'),
    plan_id: recordId('subscriptions.errors.planIdRequired'),
    payment_status: paymentStatus,
    payment_method: paymentMethod,
});

// POST /api/subscriptions/renew
export const renewSubscriptionSchema = yup.object({
    subscription_id: recordId('subscriptions.errors.subscriptionIdRequired'),
    plan_id: recordId('subscriptions.errors.planIdRequired'),
    payment_status: paymentStatus,
    payment_method: paymentMethod,
});

// GET /api/subscriptions/{id}
export const subscriptionIdSchema = recordId('subscriptions.errors.subscriptionIdRequired');
