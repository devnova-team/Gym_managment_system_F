import { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();
const normalizeLanguage = (language) => language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => normalizeLanguage(i18n.resolvedLanguage || i18n.language));

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
