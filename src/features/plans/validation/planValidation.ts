import * as yup from 'yup';

// =====================================================================
// Plan Validation Schemas
// =====================================================================
// Shared between the plan form and the server route handlers
// (src/app/api/plans). Messages are i18n keys under "plans.errors".
// The backend stays the final authority.
// =====================================================================

export const PLAN_TYPES = ['daily', '2x_week', '3x_week'];

// Quick picks for the duration field (monthly, quarterly, ... yearly).
export const DURATION_PRESETS = [
    { key: 'monthly', days: 30 },
    { key: 'quarterly', days: 90 },
    { key: 'semiAnnual', days: 180 },
    { key: 'yearly', days: 365 },
];

const MAX_DURATION_DAYS = 3650; // 10 years

// Empty inputs ('' / null) count as missing, not as invalid numbers.
const toUndefinedIfEmpty = (value, originalValue) => (
    originalValue === '' || originalValue === null ? undefined : value
);

const number = () => yup.number().transform(toUndefinedIfEmpty).typeError('plans.errors.numberInvalid');

const fields = {
    name: yup
        .string()
        .trim()
        .min(2, 'plans.errors.nameShort')
        .max(100, 'plans.errors.nameLong'),
    type: yup
        .string()
        .oneOf(PLAN_TYPES, 'plans.errors.typeInvalid'),
    duration_days: number()
        .integer('plans.errors.wholeNumber')
        .min(1, 'plans.errors.durationMin')
        .max(MAX_DURATION_DAYS, 'plans.errors.durationMax'),
    price: number()
        .positive('plans.errors.pricePositive')
        .max(1_000_000, 'plans.errors.priceMax'),
    absence_threshold_days: number()
        .integer('plans.errors.wholeNumber')
        .min(1, 'plans.errors.absenceMin'),
};

// An absence threshold longer than the plan itself makes no sense.
const absenceWithinDuration = (schema) => schema.test(
    'absence-within-duration',
    'plans.errors.absenceMax',
    function check(value) {
        const { duration_days: duration } = this.parent;
        return value === undefined || duration === undefined || value <= duration;
    },
);

// POST /api/plans
export const createPlanSchema = yup.object({
    name: fields.name.required('plans.errors.nameRequired'),
    type: fields.type.required('plans.errors.typeRequired'),
    duration_days: fields.duration_days.required('plans.errors.durationRequired'),
    price: fields.price.required('plans.errors.priceRequired'),
    absence_threshold_days: absenceWithinDuration(fields.absence_threshold_days.required('plans.errors.absenceRequired')),
});

// PUT /api/plans/{id} - all fields optional, at least one required (as the backend expects)
export const updatePlanSchema = yup.object({
    name: fields.name,
    type: fields.type,
    duration_days: fields.duration_days,
    price: fields.price,
    absence_threshold_days: absenceWithinDuration(fields.absence_threshold_days),
}).test(
    'at-least-one-field',
    'plans.errors.atLeastOneField',
    (plan) => Object.values(plan ?? {}).some((value) => value !== undefined),
);

// GET/PUT/DELETE /api/plans/{id}
export const planIdSchema = yup
    .number()
    .typeError('plans.errors.invalidId')
    .integer('plans.errors.invalidId')
    .positive('plans.errors.invalidId')
    .required('plans.errors.invalidId');
