'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation';

export const useSearchParams = () => {
    const router = useRouter();
    const pathname = usePathname();
    const currentParams = useNextSearchParams();
    const query = currentParams.toString();

    const setSearchParams = useCallback((nextInit, options = {}) => {
        const previous = new URLSearchParams(query);
        const nextParams = typeof nextInit === 'function'
            ? nextInit(previous)
            : new URLSearchParams(nextInit);
        const nextQuery = nextParams.toString();
        const url = nextQuery ? `${pathname}?${nextQuery}` : pathname;
        if (options.replace === false) {
            router.push(url, { scroll: false });
        } else {
            router.replace(url, { scroll: false });
        }
    }, [pathname, query, router]);

    return [new URLSearchParams(query), setSearchParams];
};
