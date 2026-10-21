import 'server-only';
import { ValidationError } from 'yup';

// Same shape the backend uses for 422 responses, so the client handles both alike.
export const validationErrorResponse = (errors) => Response.json(
    { success: false, message: 'Validation failed.', errors },
    { status: 422 },
);

export const notFoundResponse = () => Response.json(
    { success: false, message: 'Resource not found.' },
    { status: 404 },
);

const toFieldErrors = (error) => {
    const issues = error.inner.length ? error.inner : [error];
    return issues.reduce((errors, { path, message }) => {
        const field = path || 'body';
        (errors[field] ??= []).push(message);
        return errors;
    }, {});
};

/**
 * Parses the JSON body and validates it against a yup schema.
 * Returns `{ data }` (cast, unknown keys stripped) or `{ response }` with a 422.
 */
export async function validateJsonBody(request, schema) {
    let body;
    try {
        body = await request.json();
    } catch {
        return { response: validationErrorResponse({ body: ['common.errors.invalidBody'] }) };
    }

    try {
        const data = await schema.validate(body, { abortEarly: false, stripUnknown: true });
        return { data };
    } catch (error) {
        if (error instanceof ValidationError) {
            return { response: validationErrorResponse(toFieldErrors(error)) };
        }
        throw error;
    }
}
