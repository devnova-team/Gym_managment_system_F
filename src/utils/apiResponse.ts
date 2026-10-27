// The backend may return a list as a plain array or as a Laravel paginator ({ data: [...] }).
export const toList = (value) => (Array.isArray(value) ? value : value?.data ?? []);
