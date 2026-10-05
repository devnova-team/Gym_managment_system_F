import { useState, useMemo, useCallback } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { mockExpensesList } from '../constants/mockExpensesData';
import { useToast } from '../../../Context/ToastContext';
import {
    useTablePagination,
    useUrlFilter,
    useUrlSearch
} from '../../../utils/useUrlPagination';

export const useExpenses = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();

    // 1. Core Data State persisted in LocalStorage
    const [expenses, setExpenses] = useState(() => {
        const stored = localStorage.getItem('gym_expenses');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return mockExpensesList;
            }
        }
        return mockExpensesList;
    });

    // 2. Demo Modes & UI Loading States (Like Feature 3 DashboardOverview)
    const [isLoading, setIsLoading] = useState(false);
    const [isEmptyMode, setIsEmptyMode] = useState(false);

    // 3. URL Synchronization for Pagination & Page Size
    const {
        page,
        setPage,
        pageSize,
        handlePageSizeChange
    } = useTablePagination(
        { page: 'page', pageSize: 'pageSize' },
        { page: 1, pageSize: 6 }
    );

    // 4. URL Synchronization for Category, Nature, and Period Filters (Empty initial state)
    const [selectedCategory, setSelectedCategory] = useUrlFilter('category', '', 'page');
    const [selectedType, setSelectedType] = useUrlFilter('type', '', 'page');
    const [selectedPeriod, setSelectedPeriod] = useUrlFilter('period', '', 'page');

    // 5. URL Synchronization for Search Query
    const [searchQuery, setSearchQuery] = useUrlSearch('search', '', 'page');

    // Demo Toggle handler
    const toggleEmptyMode = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsEmptyMode((prev) => !prev);
            setIsLoading(false);
        }, 300);
    }, []);

    // Persist helper
    const persistExpenses = (updatedList) => {
        setExpenses(updatedList);
        localStorage.setItem('gym_expenses', JSON.stringify(updatedList));
    };

    // Add Expense (Optimistic & LocalStorage)
    const addExpense = useCallback((newExpense) => {
        const expenseWithGym = {
            ...newExpense,
            gym_id: newExpense.gym_id || 'gym-001',
            id: newExpense.id || `exp-${Date.now()}`
        };
        const updated = [expenseWithGym, ...expenses];
        persistExpenses(updated);
        showToast({
            type: 'success',
            message: t('finance.expenseAdded', 'Expense recorded successfully')
        });
    }, [expenses, showToast, t]);

    // Edit Expense
    const editExpense = useCallback((updatedExpense) => {
        const updated = expenses.map((item) =>
            item.id === updatedExpense.id ? { ...item, ...updatedExpense } : item
        );
        persistExpenses(updated);
        showToast({
            type: 'success',
            message: t('finance.expenseUpdated', 'Expense updated successfully')
        });
    }, [expenses, showToast, t]);

    // Delete Expense
    const deleteExpense = useCallback((id) => {
        const updated = expenses.filter((item) => item.id !== id);
        persistExpenses(updated);
        showToast({
            type: 'info',
            message: t('finance.expenseDeleted', 'Expense deleted successfully')
        });
    }, [expenses, showToast, t]);

    // Modal States & Handlers (via Mantine useDisclosure)
    const [isAddModalOpen, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [isDeleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpense, setDeletingExpense] = useState(null);

    const handleOpenAddModal = useCallback(() => {
        setEditingExpense(null);
        openAddModal();
    }, [openAddModal]);

    const handleOpenEdit = useCallback((expense) => {
        setEditingExpense(expense);
        openAddModal();
    }, [openAddModal]);

    const handleCloseModal = useCallback(() => {
        closeAddModal();
        setEditingExpense(null);
    }, [closeAddModal]);

    const handleOpenDelete = useCallback((expense) => {
        setDeletingExpense(expense);
        openDeleteModal();
    }, [openDeleteModal]);

    const handleCloseDelete = useCallback(() => {
        closeDeleteModal();
        setDeletingExpense(null);
    }, [closeDeleteModal]);

    const handleConfirmDelete = useCallback(() => {
        if (deletingExpense?.id) {
            deleteExpense(deletingExpense.id);
            closeDeleteModal();
            setDeletingExpense(null);
        }
    }, [deletingExpense, deleteExpense, closeDeleteModal]);

    // Base data based on empty mode toggle
    const baseExpenses = isEmptyMode ? [] : expenses;

    // Filtered Expenses List
    const filteredExpenses = useMemo(() => {
        if (isEmptyMode) return [];

        return baseExpenses.filter((item) => {
            // Category filter
            if (selectedCategory && selectedCategory !== 'all' && item.category !== selectedCategory) {
                return false;
            }

            // Nature filter (fixed / variable)
            if (selectedType && selectedType !== 'all' && item.type !== selectedType) {
                return false;
            }

            // Period filter
            if (selectedPeriod && selectedPeriod !== 'all') {
                if (selectedPeriod === 'this_month') {
                    const date = new Date(item.expense_date);
                    const now = new Date('2026-10-01');
                    if (date.getMonth() !== now.getMonth() || date.getFullYear() !== now.getFullYear()) {
                        return false;
                    }
                } else if (selectedPeriod === 'last_month') {
                    const date = new Date(item.expense_date);
                    if (date.getMonth() !== 8 || date.getFullYear() !== 2026) {
                        return false;
                    }
                } else if (selectedPeriod === 'this_quarter') {
                    const date = new Date(item.expense_date);
                    const month = date.getMonth(); // 9 = Oct (Q4), 6..8 = Q3
                    if (month < 9 && date.getFullYear() === 2026) {
                        return false;
                    }
                } else if (selectedPeriod === 'this_year') {
                    const date = new Date(item.expense_date);
                    if (date.getFullYear() !== 2026) {
                        return false;
                    }
                }
            }

            // Search query
            if (searchQuery && searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const title = (item.title || '').toLowerCase();
                const vendor = (item.vendor || '').toLowerCase();
                const receipt = (item.receipt_number || '').toLowerCase();
                const notes = (item.notes || '').toLowerCase();
                return title.includes(q) || vendor.includes(q) || receipt.includes(q) || notes.includes(q);
            }

            return true;
        });
    }, [baseExpenses, isEmptyMode, selectedCategory, selectedType, selectedPeriod, searchQuery]);

    // Pagination calculations
    const totalCount = filteredExpenses.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const paginatedExpenses = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredExpenses.slice(start, start + pageSize);
    }, [filteredExpenses, page, pageSize]);

    // Computed Stats for KPI Cards and Charts
    const stats = useMemo(() => {
        if (isEmptyMode || filteredExpenses.length === 0) {
            return {
                totalAmount: 0,
                fixedAmount: 0,
                variableAmount: 0,
                totalCount: 0,
                topCategory: { key: 'rent', amount: 0 },
                categoryBreakdown: {}
            };
        }

        let totalAmount = 0;
        let fixedAmount = 0;
        let variableAmount = 0;
        const categoryCounts = {};

        filteredExpenses.forEach((item) => {
            const amt = Number(item.amount) || 0;
            totalAmount += amt;

            if (item.type === 'fixed') {
                fixedAmount += amt;
            } else {
                variableAmount += amt;
            }

            const cat = item.category || 'other';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + amt;
        });

        let topCatKey = 'rent';
        let maxAmt = 0;
        Object.entries(categoryCounts).forEach(([cat, amt]) => {
            if (amt > maxAmt) {
                maxAmt = amt;
                topCatKey = cat;
            }
        });

        return {
            totalAmount,
            fixedAmount,
            variableAmount,
            totalCount: filteredExpenses.length,
            topCategory: {
                key: topCatKey,
                amount: maxAmt
            },
            categoryBreakdown: categoryCounts
        };
    }, [filteredExpenses, isEmptyMode]);

    return {
        // Data & Pagination
        expenses: paginatedExpenses,
        allFilteredExpenses: filteredExpenses,
        rawExpenses: baseExpenses,
        totalCount,
        totalPages,
        page,
        setPage,
        pageSize,
        handlePageSizeChange,

        // Filters
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedType,
        setSelectedType,
        selectedPeriod,
        setSelectedPeriod,

        // Actions & CRUD
        addExpense,
        editExpense,
        deleteExpense,

        // Modal States & Handlers (Mantine useDisclosure)
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        isDeleteModalOpen,
        openDeleteModal,
        closeDeleteModal,
        editingExpense,
        setEditingExpense,
        deletingExpense,
        setDeletingExpense,
        handleOpenAddModal,
        handleOpenEdit,
        handleCloseModal,
        handleOpenDelete,
        handleCloseDelete,
        handleConfirmDelete,

        // Stats & UI States
        stats,
        isLoading,
        setIsLoading,
        isEmptyMode,
        toggleEmptyMode,
        hasNoData: isEmptyMode || baseExpenses.length === 0
    };
};

export default useExpenses;