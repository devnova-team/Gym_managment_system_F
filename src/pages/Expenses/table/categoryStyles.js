import {
    RiBuildingLine,
    RiUserStarLine,
    RiFlashlightLine,
    RiToolsLine,
    RiMoreLine
} from 'react-icons/ri';

export const CATEGORY_ICONS = {
    rent: RiBuildingLine,
    salaries: RiUserStarLine,
    bills: RiFlashlightLine,
    maintenance: RiToolsLine,
    other: RiMoreLine
};

export const CATEGORY_STYLES = {
    rent: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    salaries: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    bills: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    maintenance: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    other: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
};
