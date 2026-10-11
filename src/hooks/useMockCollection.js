import { useCallback, useEffect, useState } from 'react';

// =====================================================================
// TEMPORARY (UI phase): stands in for the backend until the endpoints are live.
// It mirrors the RTK Query shape (data / isLoading / isError / mutations that
// reject with { status, data }) so the API-integration phase is a drop-in swap.
// =====================================================================

const LATENCY_MS = 400;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readStored = (storageKey, seed) => {
    try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : seed;
    } catch {
        return seed;
    }
};

const writeStored = (storageKey, items) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
        // Storage unavailable (private mode, quota): keep the data in memory only.
    }
};

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const nowTimestamp = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

const validationError = (field, message) => ({
    status: 422,
    data: { success: false, message: 'Validation failed.', errors: { [field]: [message] } },
});

const notFoundError = () => ({
    status: 404,
    data: { success: false, message: 'Resource not found.' },
});

/**
 * @param {object}   options
 * @param {string}   options.storageKey     localStorage key for the mock records
 * @param {object[]} options.seed           initial records
 * @param {string}   [options.uniqueField]  field the mock backend rejects duplicates on (422)
 * @param {string}   [options.uniqueMessage]
 */
export const useMockCollection = ({ storageKey, seed, uniqueField, uniqueMessage }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        await wait(LATENCY_MS);
        setItems(readStored(storageKey, seed));
        setIsLoading(false);
    }, [storageKey, seed]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const assertUnique = useCallback(
        (record, ignoreId) => {
            if (!uniqueField) return;
            const value = normalize(record[uniqueField]);
            const isTaken = items.some(
                (item) => item.id !== ignoreId && normalize(item[uniqueField]) === value
            );
            if (isTaken) throw validationError(uniqueField, uniqueMessage);
        },
        [items, uniqueField, uniqueMessage]
    );

    const commit = useCallback(
        async (buildNext) => {
            setIsMutating(true);
            try {
                await wait(LATENCY_MS);
                const { next, record } = buildNext();
                writeStored(storageKey, next);
                setItems(next);
                return record;
            } finally {
                setIsMutating(false);
            }
        },
        [storageKey]
    );

    const create = useCallback(
        (body) =>
            commit(() => {
                assertUnique(body);
                const record = { ...body, id: Date.now(), created_at: nowTimestamp() };
                return { next: [record, ...items], record };
            }),
        [commit, assertUnique, items]
    );

    const update = useCallback(
        (id, patch) =>
            commit(() => {
                const existing = items.find((item) => item.id === id);
                if (!existing) throw notFoundError();

                const record = { ...existing, ...patch };
                assertUnique(record, id);
                return { next: items.map((item) => (item.id === id ? record : item)), record };
            }),
        [commit, assertUnique, items]
    );

    return {
        data: items,
        isLoading,
        isError: false,
        error: null,
        refetch,
        create,
        update,
        isMutating,
    };
};

export default useMockCollection;
