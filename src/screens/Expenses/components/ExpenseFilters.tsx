import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Group, Stack, Title, Text, ThemeIcon, Button } from '@mantine/core';
import { FiFilter, FiCalendar, FiSliders, FiLayers, FiRefreshCw } from 'react-icons/fi';
import { EXPENSE_CATEGORIES, EXPENSE_TYPES } from '../constants/mockExpensesData';
import { getExpensePeriods } from '../constants/expenseFilters';
import SearchInput from '../../../components/SearchInput';
import PageSizeFilter from '../../../components/PageSizeFilter';
import SelectField from '../../../components/Forms/SelectField';

const ExpenseFilters = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedPeriod,
    setSelectedPeriod,
    pageSize,
    onPageSizeChange,
    isDarkMode,
    className = ''
}) => {
    const { t } = useTranslation();

    const periodOptions = useMemo(() => {
        return getExpensePeriods(t).map((p) => ({
            value: p.key,
            label: p.label
        }));
    }, [t]);

    const categoryOptions = useMemo(() => {
        return EXPENSE_CATEGORIES.map((cat) => ({
            value: cat.key,
            label: t(cat.labelKey, cat.key)
        }));
    }, [t]);

    const typeOptions = useMemo(() => {
        return EXPENSE_TYPES.map((type) => ({
            value: type.key,
            label: t(type.labelKey, type.key)
        }));
    }, [t]);

    const hasActiveFilters = Boolean(
        searchQuery ||
        (selectedPeriod && selectedPeriod !== 'all') ||
        (selectedCategory && selectedCategory !== 'all') ||
        (selectedType && selectedType !== 'all')
    );

    const handleClearAll = () => {
        setSearchQuery('');
        setSelectedPeriod('');
        setSelectedCategory('');
        setSelectedType('');
    };

    const selectClassNames = {
        input:
            '!bg-slate-50 dark:!bg-[#0e1517] !border-slate-200 dark:!border-white/10 text-slate-800 dark:!text-white font-medium text-xs hover:!border-[#85F40F]/60 focus:!border-[#85F40F] transition-all rounded-xl! h-10! placeholder:!text-slate-400 dark:placeholder:!text-slate-500 data-[placeholder]:!text-slate-400 dark:data-[placeholder]:!text-slate-500',
        dropdown:
            'dark:!bg-[#0e1517] dark:!border-white/10 shadow-xl border border-slate-200 rounded-xl!',
        option:
            'text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg! mx-1 my-0.5 transition-colors cursor-pointer [&:not([data-checked])]:hover:!bg-[#85F40F]/15 dark:[&:not([data-checked])]:hover:!bg-[#85F40F]/15 [&:not([data-checked])]:hover:!text-[#549E06] dark:[&:not([data-checked])]:hover:!text-[#85F40F] [&:not([data-checked])][data-hovered]:!bg-[#85F40F]/15 dark:[&:not([data-checked])][data-hovered]:!bg-[#85F40F]/15 [&:not([data-checked])][data-hovered]:!text-[#549E06] dark:[&:not([data-checked])][data-hovered]:!text-[#85F40F] data-[checked]:!bg-[#85F40F] data-[checked]:!text-[#061400] data-[checked]:!font-black data-[checked]:hover:!bg-[#95E913] data-[checked]:hover:!text-[#061400] dark:data-[checked]:hover:!bg-[#95E913] dark:data-[checked]:hover:!text-[#061400] data-[checked][data-hovered]:!bg-[#95E913] data-[checked][data-hovered]:!text-[#061400] dark:data-[checked][data-hovered]:!bg-[#95E913] dark:data-[checked][data-hovered]:!text-[#061400]'
    };

    const comboboxProps = {
        transitionProps: { transition: 'pop-top-left', duration: 150 },
        shadow: 'md',
        radius: 'md'
    };

    return (
        <Card
            radius="lg"
            p="lg"
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}
            className={`border shadow-smoothCard flex flex-col justify-between h-full ${className}`}
        >
            {/* Header */}
            <Stack gap={2} className="mb-4">
                <Group justify="space-between" align="center" wrap="nowrap" className="min-w-0">
                    <Group gap="xs" align="center" wrap="nowrap" className="min-w-0">
                        <ThemeIcon
                            radius="md"
                            size={32}
                            style={{
                                backgroundColor: 'rgba(133, 244, 15, 0.15)',
                                color: '#85F40F',
                                borderColor: 'rgba(133, 244, 15, 0.3)'
                            }}
                            className="border shrink-0"
                        >
                            <FiFilter size={18} />
                        </ThemeIcon>
                        <Title
                            order={3}
                            style={{
                                color: isDarkMode ? '#ffffff' : '#1e293b',
                                fontFamily: 'Inter, sans-serif'
                            }}
                            className="text-base font-bold min-w-0"
                        >
                            {t('common.filter', 'Filter & Search')}
                        </Title>
                    </Group>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="xs"
                            radius="md"
                            onClick={handleClearAll}
                            leftSection={<FiRefreshCw size={12} className="transition-transform group-hover:rotate-180 duration-300" />}
                            className="group text-xs font-semibold border-rose-500/40! text-rose-500! dark:text-rose-400! bg-transparent! hover:bg-rose-500! hover:text-white! hover:border-rose-500! dark:hover:bg-rose-500! dark:hover:text-white! dark:hover:border-rose-500! transition-all duration-200 shadow-xs"
                        >
                            {t('common.reset', 'Reset')}
                        </Button>
                    )}
                </Group>
                <Text
                    size="xs"
                    style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                >
                    {t('finance.filterByDate', 'Filter by text, period, category & nature')}
                </Text>
            </Stack>

            {/* Vertical Stack of Search and 4 Select Filters */}
            <div className="flex flex-col gap-3 flex-1 justify-between">
                {/* 1. Search Input */}
                <div className="w-full">
                    <SearchInput
                        id="expenses-search-input"
                        name="expenses_search"
                        placeholder={t('common.search', 'Search expenses, vendors, receipts, notes...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        className="w-full"
                    />
                </div>

                {/* 2. Period Filter */}
                <SelectField
                    name="period"
                    value={selectedPeriod && selectedPeriod !== 'all' ? selectedPeriod : null}
                    onChange={(val) => setSelectedPeriod(val || '')}
                    data={periodOptions}
                    placeholder={t('finance.period', 'Period')}
                    leftSection={<FiCalendar size={16} className="text-slate-400 dark:text-[#85F40F]" />}
                    size="sm"
                    radius="md"
                    searchable
                    clearable
                    clearSectionMode="clear"
                    nothingFoundMessage={t('common.noResults', 'No options found')}
                    className="w-full"
                    containerClassName="w-full"
                    comboboxProps={comboboxProps}
                    classNames={selectClassNames}
                />

                {/* 3. Category Filter */}
                <SelectField
                    name="category"
                    value={selectedCategory && selectedCategory !== 'all' ? selectedCategory : null}
                    onChange={(val) => setSelectedCategory(val || '')}
                    data={categoryOptions}
                    placeholder={t('finance.category', 'Category')}
                    leftSection={<FiFilter size={16} className="text-slate-400 dark:text-[#85F40F]" />}
                    size="sm"
                    radius="md"
                    searchable
                    clearable
                    clearSectionMode="clear"
                    nothingFoundMessage={t('common.noResults', 'No options found')}
                    className="w-full"
                    containerClassName="w-full"
                    comboboxProps={comboboxProps}
                    classNames={selectClassNames}
                />

                {/* 4. Expense Type (Nature) Filter */}
                <SelectField
                    name="type"
                    value={selectedType && selectedType !== 'all' ? selectedType : null}
                    onChange={(val) => setSelectedType(val || '')}
                    data={typeOptions}
                    placeholder={t('finance.nature', 'Expense Nature')}
                    leftSection={<FiSliders size={16} className="text-slate-400 dark:text-[#85F40F]" />}
                    size="sm"
                    radius="md"
                    searchable
                    clearable
                    clearSectionMode="clear"
                    nothingFoundMessage={t('common.noResults', 'No options found')}
                    className="w-full"
                    containerClassName="w-full"
                    comboboxProps={comboboxProps}
                    classNames={selectClassNames}
                />

                {/* 5. Page Size Filter */}
                {onPageSizeChange && (
                    <div className="w-full">
                        <PageSizeFilter
                            id="expenses-page-size-select"
                            name="expenses_page_size"
                            value={pageSize}
                            onChange={onPageSizeChange}
                            defaultValue={6}
                            size="sm"
                            searchable={false}
                            clearable={false}
                            className="w-full"
                            leftSection={<FiLayers size={16} className="text-slate-400 dark:text-[#85F40F]" />}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ExpenseFilters;
