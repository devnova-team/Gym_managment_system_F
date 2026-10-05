import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Table } from '@mantine/core';
import { RiFileListLine } from 'react-icons/ri';
import { useTheme } from '../../../Context/ThemeContext';
import {
    TableHeader,
    TableBody,
    TableFooter
} from '../../../components/Tables';
import { getReportsTableHeaders } from '../constants/reportsTableHeaders';
import ReportRow from './ReportRow';

const ReportsTable = ({
    lineItems = [],
    totalCount = 0,
    page = 1,
    setPage,
    pageSize = 10,
    totalPages = 1,
    isDarkMode: isDarkModeProp,
    scrollRef
}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const theme = useTheme();
    const isDarkMode = isDarkModeProp !== undefined ? isDarkModeProp : theme?.isDarkMode;

    const defaultHeaderRef = useRef(null);
    const targetScrollRef = scrollRef || defaultHeaderRef;

    const headers = useMemo(() => getReportsTableHeaders(t), [t]);

    return (
        <Paper
            p={{ base: 'xs', sm: 'md' }}
            radius="lg"
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}
            className="w-full bg-white dark:bg-[#0e1517]! border border-slate-200 dark:border-slate-800 shadow-smoothCard overflow-hidden"
        >
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5 scrollbar-thin">
                <Table
                    highlightOnHover
                    verticalSpacing="sm"
                    horizontalSpacing="md"
                    className="w-full text-xs sm:text-sm whitespace-nowrap min-w-195"
                    style={{
                        '--table-hover-color': isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'
                    }}
                >
                    <TableHeader ref={targetScrollRef} headers={headers} className="whitespace-nowrap" />

                    <TableBody
                        data={lineItems}
                        colSpan={headers.length}
                        emptyMessage={t('finance.noFinancialData', 'No Financial Records Found')}
                        emptyDescription={t('finance.noFinancialDataDesc', 'No subscription payments or expenses were found for the selected period.')}
                        emptyIcon={<RiFileListLine size={36} />}
                        renderRow={(item) => (
                            <ReportRow
                                key={item.id}
                                item={item}
                                isRTL={isRTL}
                            />
                        )}
                    />

                    {totalCount > 0 && (
                        <TableFooter
                            activePage={page}
                            page={page}
                            setPage={setPage}
                            totalPages={totalPages}
                            totalItems={totalCount}
                            pageSize={pageSize}
                            colSpan={headers.length}
                            itemName={t('common.records', 'records')}
                            scrollRef={targetScrollRef}
                        />
                    )}
                </Table>
            </div>
        </Paper>
    );
};

export default ReportsTable;
export { ReportsTable as FinancialSummaryTable };
