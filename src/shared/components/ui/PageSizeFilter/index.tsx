import { useMemo } from 'react';
import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const DEFAULT_PAGE_SIZE_OPTIONS = [
    { value: '6', label: '6 per page' },
    { value: '12', label: '12 per page' },
    { value: '24', label: '24 per page' },
    { value: '50', label: '50 per page' },
];

const PageSizeFilter = ({
    id,
    name = 'pageSize',
    value = 6,
    onChange,
    defaultValue = 6,
    options,
    placeholder,
    className = 'w-36 sm:w-40',
    leftSection,
    ...rest
}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    const defaultOptions = useMemo(() => [
        { value: '6', label: `6 ${t('common.perPage', isRTL ? 'لكل صفحة' : 'per page')}` },
        { value: '12', label: `12 ${t('common.perPage', isRTL ? 'لكل صفحة' : 'per page')}` },
        { value: '24', label: `24 ${t('common.perPage', isRTL ? 'لكل صفحة' : 'per page')}` },
        { value: '50', label: `50 ${t('common.perPage', isRTL ? 'لكل صفحة' : 'per page')}` },
    ], [t, isRTL]);

    const data = options || defaultOptions;

    return (
        <Select
            id={id || rest.id || name}
            name={name}
            value={String(value || defaultValue)}
            onChange={(val) => onChange?.(Number(val) || defaultValue)}
            data={data}
            placeholder={placeholder || t('common.pageSize', isRTL ? 'عناصر لكل صفحة' : 'Page Size')}
            leftSection={leftSection}
            size={rest.size || 'sm'}
            radius="md"
            searchable={rest.searchable !== undefined ? rest.searchable : true}
            clearable={rest.clearable !== undefined ? rest.clearable : false}
            clearSectionMode={rest.clearSectionMode || 'clear'}
            allowDeselect={rest.allowDeselect !== undefined ? rest.allowDeselect : false}
            className={className}
            comboboxProps={{
                transitionProps: { transition: 'pop-top-left', duration: 150 },
                shadow: 'md',
                radius: 'md',
            }}
            classNames={rest.classNames || {
                input:
                    'bg-slate-50! dark:bg-[#0e1517]! border-slate-200! dark:border-white/10! text-slate-800! dark:text-white! font-medium text-xs hover:border-[#85F40F]/60! focus:border-[#85F40F]! transition-all rounded-xl! h-10! placeholder:text-slate-400 dark:placeholder:text-slate-500 data-[placeholder]:text-slate-400! dark:data-[placeholder]:text-slate-500!',
                dropdown:
                    'dark:bg-[#0e1517]! dark:border-white/10! shadow-xl border border-slate-200 rounded-xl!',
                option:
                    'text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg! mx-1 my-0.5 transition-colors cursor-pointer [&:not([data-checked])]:hover:bg-[#85F40F]/15! dark:[&:not([data-checked])]:hover:bg-[#85F40F]/15! [&:not([data-checked])]:hover:text-[#549E06]! dark:[&:not([data-checked])]:hover:text-[#85F40F]! [&:not([data-checked])][data-hovered]:bg-[#85F40F]/15! dark:[&:not([data-checked])][data-hovered]:bg-[#85F40F]/15! [&:not([data-checked])][data-hovered]:text-[#549E06]! dark:[&:not([data-checked])][data-hovered]:text-[#85F40F]! data-[checked]:bg-[#85F40F]! data-[checked]:text-[#061400]! data-[checked]:font-black data-[checked]:hover:bg-[#95E913]! data-[checked]:hover:text-[#061400]! dark:data-[checked]:hover:bg-[#95E913]! dark:data-[checked]:hover:text-[#061400]! data-[checked][data-hovered]:bg-[#95E913]! data-[checked][data-hovered]:text-[#061400]! dark:data-[checked][data-hovered]:bg-[#95E913]! dark:data-[checked][data-hovered]:text-[#061400]!',
            }}
            {...rest}
        />
    );
};

export default PageSizeFilter;