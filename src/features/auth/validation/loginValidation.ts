export function checkForm(identifier, password) {
    const errors = {};
    const cleanIdentifier = identifier.trim();

    if (cleanIdentifier === '') {
        errors.identifier = 'auth.errors.identifierRequired';
    } else {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanIdentifier);
        const isPhone = /^\+?\d{10,15}$/.test(cleanIdentifier);
        if (!isEmail && !isPhone) errors.identifier = 'auth.errors.identifierInvalid';
    }

    if (password === '') {
        errors.password = 'auth.errors.passwordRequired';
    } else if (password.length < 8) {
        errors.password = 'auth.errors.passwordShort';
    }

    return errors;
}
