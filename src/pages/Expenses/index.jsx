import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack } from '@mantine/core';
import { useTheme } from '../../Context/ThemeContext';
import { useExpenses } from './hooks/useExpenses';
import ExpensesHeader from './components/ExpensesHeader';
import ExpensesStatsCards from './components/ExpensesStatsCards';
import ExpenseFilters from './components/ExpenseFilters';
import ExpensesTable from './table';
import ExpenseCategoryChart from './components/ExpenseCategoryChart';
import ExpenseFormModal from './form';
import ExpensesSkeleton from './components/ExpensesSkeleton';
import ExpensesEmptyState from './components/ExpensesEmptyState';
import ConfirmModal from '../../components/ConfirmModal';

const Expenses = () => {
    const { t } = useTranslation();
    const { isDarkMode } = useTheme();
    const tableHeaderRef = useRef(null);

    const {
        expenses,
        allFilteredExpenses,
        rawExpenses,
        totalCount,
        totalPages,
        page,
        setPage,
        pageSize,
        handlePageSizeChange,
        stats,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedType,
        setSelectedType,
        selectedPeriod,
        setSelectedPeriod,
        addExpense,
        editExpense,
        deleteExpense,
        // Modal States & Handlers from hook
        isAddModalOpen,
        isDeleteModalOpen,
        editingExpense,
        deletingExpense,
        handleOpenAddModal,
        handleOpenEdit,
        handleCloseModal,
        handleOpenDelete,
        handleCloseDelete,
        handleConfirmDelete,
        isLoading,
        isEmptyMode,
        toggleEmptyMode,
        hasNoData
    } = useExpenses();

    if (isLoading) {
        return <ExpensesSkeleton isDarkMode={isDarkMode} />;
    }

    return (
        <Box className={`w-full transition-all duration-300 ease-in-out ${hasNoData ? 'pb-2' : 'pb-10'}`}>
            <Stack gap={hasNoData ? 'md' : 'xl'}>
                {/* 1. Top Executive Banner & Actions (Matching Feature 3 Header) */}
                <ExpensesHeader
                    isEmptyMode={isEmptyMode}
                    toggleEmptyMode={toggleEmptyMode}
                    onOpenAddModal={handleOpenAddModal}
                    isDarkMode={isDarkMode}
                    totalCount={totalCount}
                />

                {/* If empty mode or no data recorded */}
                {hasNoData ? (
                    <ExpensesEmptyState
                        onOpenAddModal={handleOpenAddModal}
                        isDarkMode={isDarkMode}
                    />
                ) : (
                    <>
                        {/* 1. Stats Cards (Single Row, Full Width) */}
                        <div className="w-full">
                            <ExpensesStatsCards stats={stats} isDarkMode={isDarkMode} />
                        </div>

                        {/* 2. Middle Row: Left Filter (Search + 4 Selects Vertical) + Right Category Chart (Equal Height) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                            {/* Left: Filter Controls Card (Search + 4 Selects all vertical) */}
                            <div className="lg:col-span-6 flex flex-col h-full">
                                <ExpenseFilters
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    selectedType={selectedType}
                                    setSelectedType={setSelectedType}
                                    selectedPeriod={selectedPeriod}
                                    setSelectedPeriod={setSelectedPeriod}
                                    pageSize={pageSize}
                                    onPageSizeChange={handlePageSizeChange}
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            {/* Right: Category Doughnut Chart Card (Equal Height) */}
                            <div className="lg:col-span-6 flex flex-col h-full">
                                <ExpenseCategoryChart
                                    expenses={allFilteredExpenses.length > 0 ? allFilteredExpenses : rawExpenses}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        </div>

                        {/* 3. Main Expenses Table (Full Width) */}
                        <div className="w-full">
                            <ExpensesTable
                                expenses={expenses}
                                totalCount={totalCount}
                                page={page}
                                setPage={setPage}
                                pageSize={pageSize}
                                totalPages={totalPages}
                                onEditExpense={handleOpenEdit}
                                onDeleteExpense={handleOpenDelete}
                                onOpenAddModal={handleOpenAddModal}
                                isDarkMode={isDarkMode}
                                scrollRef={tableHeaderRef}
                            />
                        </div>
                    </>
                )}
            </Stack>

            {/* 5. Add / Edit Expense Modal */}
            <ExpenseFormModal
                opened={isAddModalOpen}
                onClose={handleCloseModal}
                onAddExpense={addExpense}
                onEditExpense={editExpense}
                initialExpense={editingExpense}
            />

            {/* 6. Confirm Delete Modal */}
            <ConfirmModal
                opened={isDeleteModalOpen}
                close={handleCloseDelete}
                title={t('finance.deleteConfirmTitle', 'Delete Expense Record?')}
                description={`${t('finance.deleteConfirmDesc', 'Are you sure you want to delete this expense record?')}: ${deletingExpense?.title || ''}`}
                actionText={t('common.delete', 'Delete')}
                cancelText={t('common.cancel', 'Cancel')}
                color="red"
                handleConfirm={handleConfirmDelete}
            />
        </Box>
    );
};

export default Expenses;