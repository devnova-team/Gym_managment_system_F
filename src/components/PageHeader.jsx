import { Button } from '@mantine/core';
import { HiOutlinePlus } from 'react-icons/hi2';

/** Page title, subtitle and an optional primary action button. */
const PageHeader = ({ title, subtitle, icon, actionLabel, onAction, actionIcon = <HiOutlinePlus size={18} /> }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            {icon && (
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#85F40F]/15 text-[#85F40F] flex items-center justify-center">
                    {icon}
                </div>
            )}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>

        {actionLabel && onAction && (
            <Button
                onClick={onAction}
                radius="md"
                leftSection={actionIcon}
                className="h-10! px-5! font-bold text-sm text-brand-950! shadow-[0_0_18px_rgba(133,244,15,0.35)]"
                style={{ backgroundImage: 'linear-gradient(to right, #85F40F, #6CC80A)', color: '#061400' }}
            >
                {actionLabel}
            </Button>
        )}
    </div>
);

export default PageHeader;
