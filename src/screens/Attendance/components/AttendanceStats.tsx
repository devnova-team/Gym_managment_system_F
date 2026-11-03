import { useTranslation } from 'react-i18next';
import { Paper } from '@mantine/core';
import { RiCalendarCheckLine, RiDoorOpenLine, RiCloudOffLine } from 'react-icons/ri';

const Stat = ({ icon, label, value, accent }) => (
    <Paper
        radius="lg"
        p="md"
        className="bg-white dark:bg-[#0e1517]! border border-slate-200 dark:border-slate-800 shadow-smoothCard flex items-center gap-3"
    >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>{icon}</div>
        <div className="min-w-0">
            <div className="text-2xl font-black text-slate-800 dark:text-white leading-none">{value}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 truncate">{label}</div>
        </div>
    </Paper>
);

const AttendanceStats = ({ todayTotal, insideTotal, pendingCount }) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Stat
                icon={<RiCalendarCheckLine size={22} />}
                label={t('attendance.statToday')}
                value={todayTotal}
                accent="bg-[#85F40F]/15 text-brand-800 dark:text-[#85F40F]"
            />
            <Stat
                icon={<RiDoorOpenLine size={22} />}
                label={t('attendance.statInside')}
                value={insideTotal}
                accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />
            <Stat
                icon={<RiCloudOffLine size={22} />}
                label={t('attendance.statPending')}
                value={pendingCount}
                accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            />
        </div>
    );
};

export default AttendanceStats;
