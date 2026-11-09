import { useRef } from 'react';
import { Pagination } from '@mantine/core';

const PaginationComp = ({
    activePage = 1,
    totalPages = 1,
    onPageChange,
    size = 'md',
    className = '',
    scrollRef,
    targetRef
}) => {
    const rootRef = useRef(null);

    if (!totalPages || totalPages <= 1) return null;

    const handlePageChange = (page) => {
        onPageChange?.(page);

        // 1. Resolve explicit ref or fallback to closest table header
        const explicitTarget =
            scrollRef?.current ||
            targetRef?.current ||
            (typeof scrollRef === 'function' ? scrollRef() : null) ||
            (scrollRef instanceof HTMLElement ? scrollRef : null);

        const autoTarget = rootRef.current
            ? rootRef.current.closest('table')?.querySelector('thead') ||
              rootRef.current.closest('.mantine-Paper-root') ||
              rootRef.current.closest('table')
            : null;

        const targetElement = explicitTarget || autoTarget;
        const scrollContainer =
            document.querySelector('main[data-panel="true"]') ||
            document.querySelector('.overflow-y-auto');

        if (targetElement && scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            // Scroll with 20px margin above target element
            const offset = targetRect.top - containerRect.top + scrollContainer.scrollTop - 20;
            scrollContainer.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
        } else if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div ref={rootRef} className={`flex justify-center items-center py-4 ${className}`}>
            <Pagination
                value={activePage}
                onChange={handlePageChange}
                total={totalPages}
                radius="md"
                size={size}
                className="flex justify-center items-center"
                classNames={{
                    control:
                        'data-[active]:!bg-[#85F40F] data-[active]:!text-[#020617] data-[active]:!font-black data-[active]:!border-[#85F40F] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors',
                }}
            />
        </div>
    );
};

export default PaginationComp;