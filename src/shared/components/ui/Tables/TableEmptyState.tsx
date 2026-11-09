import { Button } from "@mantine/core";
import { HiOutlineInbox } from "react-icons/hi2";

const TableEmptyState = ({
    title = "No Data Found",
    description = "There are no records matching your current filter or query.",
    icon,
    actionLabel,
    onAction,
}) => {
    return (
        <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                {icon || <HiOutlineInbox size={28} />}
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
                {title}
            </h4>
            {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    size="xs"
                    radius="md"
                    className="mt-4 bg-[#85F40F] hover:bg-[#79BE0D] text-brand-950 font-bold"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default TableEmptyState;
