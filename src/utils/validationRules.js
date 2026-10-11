import * as yup from 'yup';
import { isValidISODate } from './dateOnly';

/** Text must contain at least one letter (Arabic or Latin), not only digits/symbols. */
export const HAS_LETTER_PATTERN = /\p{L}/u;

/** Turns blank optional inputs into null so they are not sent as empty strings. */
export const blankToNull = (value) => (typeof value === 'string' && value.trim() === '' ? null : value);

/**
 * Optional `YYYY-MM-DD` string that must be a real calendar date when provided.
 * ISO date strings compare correctly as plain strings, so min/max checks can use `<` / `>`.
 */
export const isoDateString = (invalidMessage) =>
    yup
        .string()
        .trim()
        .transform(blankToNull)
        .nullable()
        .test('iso-date', invalidMessage, (value) => !value || isValidISODate(value));

/**
 * Whole number typed into a text input. Blank → undefined so `.required()` reports it.
 */
export const integerFromInput = (typeErrorMessage, integerMessage) =>
    yup
        .number()
        .transform((value, originalValue) =>
            typeof originalValue === 'string' && originalValue.trim() === '' ? undefined : value
        )
        .typeError(typeErrorMessage)
        .integer(integerMessage);
