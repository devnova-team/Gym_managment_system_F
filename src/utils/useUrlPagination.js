import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook to synchronize pagination page with URL search params (e.g. ?page=2)
 */
export const useUrlPagination = (key = 'page', initialPage = 1) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get(key)) || initialPage;

    const setPage = useCallback((newPage) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            const pageNumber = typeof newPage === 'function' ? newPage(page) : newPage;
            if (pageNumber <= 1) {
                next.delete(key);
            } else {
                next.set(key, pageNumber.toString());
            }
            return next;
        }, { replace: true });
    }, [key, page, setSearchParams]);

    return [page, setPage];
};

/**
 * Hook to synchronize filter value with URL search params (e.g. ?status=active)
 * Automatically resets page param when filter changes.
 */
export const useUrlFilter = (key = 'status', defaultValue = 'all', pageKey = 'page') => {
    const [searchParams, setSearchParams] = useSearchParams();

    const value = searchParams.get(key) || defaultValue;

    const setFilter = useCallback((newValue) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            // Reset page when filter changes
            if (pageKey) next.delete(pageKey);

            if (!newValue || newValue === defaultValue) {
                next.delete(key);
            } else {
                next.set(key, newValue.toString());
            }
            return next;
        }, { replace: true });
    }, [key, defaultValue, pageKey, setSearchParams]);

    return [value, setFilter];
};

/**
 * Hook to synchronize search input with URL search params (e.g. ?search=keyword)
 * Automatically resets page param when search changes.
 */
export const useUrlSearch = (
    key = 'search',
    defaultValue = '',
    pageKey = 'page',
    externalSearch = undefined,
    setExternalSearch = undefined
) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isInitialMount = useRef(true);

    const search = searchParams.get(key) || defaultValue;

    const setSearch = useCallback((newSearch) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            // Reset page when search changes
            if (pageKey) next.delete(pageKey);

            const trimmed = (newSearch || '').trim();
            if (!trimmed || trimmed === defaultValue) {
                next.delete(key);
            } else {
                next.set(key, trimmed);
            }
            return next;
        }, { replace: true });
    }, [key, defaultValue, pageKey, setSearchParams]);

    // 1. Initial mount only: sync existing URL search parameter to external search input
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (search && setExternalSearch) {
                setExternalSearch(search);
            }
        }
    }, [search, setExternalSearch]);

    // 2. Sync external search query changes to URL search param
    useEffect(() => {
        if (externalSearch === undefined) return;

        const trimmed = (externalSearch || '').trim();
        if (!trimmed) {
            if (search !== defaultValue) {
                setSearch('');
            }
        } else if (trimmed !== search) {
            setSearch(trimmed);
        }
    }, [externalSearch, search, defaultValue, setSearch]);

    return [search, setSearch];
};

/**
 * Hook to synchronize both page and page size with URL search params
 */
export const useTablePagination = (
    keys = { page: 'page', pageSize: 'pageSize', ps: 'pageSize' },
    defaults = { page: 1, pageSize: 6, ps: 6 }
) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageKey = keys?.page || 'page';
    const sizeKey = keys?.pageSize || keys?.ps || 'pageSize';
    const defaultPage = defaults?.page || 1;
    const defaultPageSize = defaults?.pageSize || defaults?.ps || 6;

    const activePage = Number(searchParams.get(pageKey)) || defaultPage;
    const pageSize = Number(searchParams.get(sizeKey) || searchParams.get('pageSize') || searchParams.get('ps')) || defaultPageSize;

    const setActivePage = useCallback((newPage) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            const pageNumber = typeof newPage === 'function' ? newPage(activePage) : newPage;
            if (pageNumber <= 1) {
                next.delete(pageKey);
            } else {
                next.set(pageKey, pageNumber.toString());
            }
            return next;
        }, { replace: true });
    }, [pageKey, activePage, setSearchParams]);

    const handlePageSizeChange = useCallback((newSizeValue) => {
        const newSize = Number(newSizeValue);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            // Reset page when page size changes
            next.delete(pageKey);

            if (newSize === defaultPageSize) {
                next.delete(sizeKey);
                if (sizeKey !== 'pageSize') next.delete('pageSize');
                if (sizeKey !== 'ps') next.delete('ps');
            } else {
                next.set(sizeKey, newSize.toString());
            }
            return next;
        }, { replace: true });
    }, [pageKey, sizeKey, defaultPageSize, setSearchParams]);

    return {
        activePage,
        page: activePage,
        pageSize,
        setActivePage,
        setPage: setActivePage,
        handlePageSizeChange,
        setPageSize: handlePageSizeChange,
        onPageSizeChange: handlePageSizeChange
    };
};

export default useUrlPagination;