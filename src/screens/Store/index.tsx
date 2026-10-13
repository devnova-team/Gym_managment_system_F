import { useTranslation } from 'react-i18next';
import { useGetStoreProductsQuery } from '../../Service/Apis/storeApi';

const Store = () => {
    const { t } = useTranslation();
    const { data: _store } = useGetStoreProductsQuery();

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {t('store.title', 'Internal Store & POS')}
            </h2>
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80 shadow-smoothCard text-center">
                <p className="text-sm text-textColor dark:text-slate-400">
                    Ready for Feature 8 (Mohamed): Connected to <code className="font-mono text-[#85F40F]">storeApi</code>.
                </p>
            </div>
        </div>
    );
};

export default Store;
