import { createContext, useContext, useEffect, useState } from 'react';
import i18n from '@/shared/i18n/index';

type LanguageContextValue = {
    language: 'ar' | 'en';
    changeLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
    language: 'en',
    changeLanguage: () => {},
});
const normalizeLanguage = (language?: string): 'ar' | 'en' =>
    language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState<'ar' | 'en'>(() =>
        normalizeLanguage(i18n.resolvedLanguage || i18n.language)
    );

    const changeLanguage = (lng) => {
        i18n.changeLanguage(normalizeLanguage(lng));
    };

    useEffect(() => {
        const syncLanguage = (lng) => setLanguage(normalizeLanguage(lng));
        i18n.on('languageChanged', syncLanguage);
        syncLanguage(i18n.resolvedLanguage || i18n.language);

        return () => i18n.off('languageChanged', syncLanguage);
    }, []);

    useEffect(() => {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
