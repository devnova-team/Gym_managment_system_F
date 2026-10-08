import { useTranslation } from 'react-i18next';
import { formatNumberByLocale } from '../utils/formatters';

const DashboardFooter = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const currentYear = formatNumberByLocale(new Date().getFullYear(), isRTL);

    return (
        <footer className="w-full mt-auto pt-6 pb-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 select-none">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
                {/* Left: Copyright */}
                <div className="flex items-center gap-1.5 text-center sm:text-start">
                    <span>©</span>
                    <span>{currentYear}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {t('app.name')}
                    </span>
                    <span>•</span>
                    <span>{t('common.allRightsReserved')}</span>
                </div>

                {/* Right: Powered by DevNova Team */}
                <div className="flex items-center gap-1.5">
                    <span>{t('common.poweredBy')}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black text-[#85F40F] bg-[#85F40F]/10 border border-[#85F40F]/30 tracking-tight shadow-xs hover:border-[#85F40F] transition-colors">
                        DevNova Team
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default DashboardFooter;
