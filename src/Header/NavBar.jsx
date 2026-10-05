import { ActionIcon, Tooltip, Avatar, Menu } from "@mantine/core";
import { MdOutlineLightMode, MdOutlineDarkMode, MdWavingHand } from "react-icons/md";
import { RiGlobalLine } from "react-icons/ri";
import { HiMenuAlt2 } from "react-icons/hi";
import { FiLogOut, FiShield } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useContext } from "react";

import { useTheme } from "../Context/ThemeContext.jsx";
import { useLanguage } from "../Context/LanguageContext.jsx";
import { AuthContext } from "../AuthContext/AuthProvider.jsx";
import { useLogoutMutation } from "../Service/Apis/authApi";

const NavBar = ({ setIsSidebarOpen, isSidebarOpen }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { language, changeLanguage } = useLanguage();
    const { t } = useTranslation();
    const { user, logout } = useContext(AuthContext);
    const [logoutApi, { isLoading: isLogoutLoading }] = useLogoutMutation();


    const toggleLanguage = () => {
        changeLanguage(language === 'en' ? 'ar' : 'en');
    };
    const userRoleKey = user?.role ? `staff.${user.role.toLowerCase()}` : 'staff.owner';

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            console.error("Logout request completed or failed:", error);
        } finally {
            logout();
        }
    };

    return (
        <nav data-navbar="true" className="w-full h-20 bg-white dark:bg-[#0e1517] border-b border-slate-200 dark:border-slate-800/80 shadow-xs dark:shadow-none flex justify-between items-center px-4 md:px-8 z-10 sticky top-0 transition-colors">
            {/* LEFT: Menu Toggle & Greeting */}
            <div className="flex items-center gap-2 md:gap-4">
                <div className="md:hidden">
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        className="text-[#85F40F]! dark:text-[#85F40F]!"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label={t('common.toggleNavigation')}
                    >
                        <HiMenuAlt2 size={24} />
                    </ActionIcon>
                </div>

                <div className="hidden md:flex flex-col justify-center">
                    <h1 className="text-lg md:text-xl font-black flex items-center gap-2 text-slate-800 dark:text-white">
                        <span className="whitespace-nowrap">
                            {t('dashboard.welcome')}, {user?.name || t('nav.coach')}
                        </span>
                        <MdWavingHand className="text-[#85F40F] animate-pulse" size={22} />
                    </h1>
                    <p className="text-[11px] text-textColor dark:text-slate-400 font-semibold">
                        {t('nav.tenantLabel', { id: user?.gym_id || 'gym-001' })}
                    </p>
                </div>
            </div>


            {/* RIGHT: Action Group */}
            <div className="flex items-center gap-2 md:gap-3">
                {/* Language Toggle */}
                <div className="flex">
                    <Tooltip
                        label={t(language === 'en' ? 'common.switchToArabic' : 'common.switchToEnglish')}
                        withArrow
                        position="bottom"
                    >
                        <ActionIcon
                            variant="subtle"
                            size="lg"
                            radius="md"
                            onClick={toggleLanguage}
                            className="w-16! bg-gray/10! dark:bg-[#141b24]! text-slate-700! dark:text-slate-300! hover:bg-[#85F40F]! hover:text-brand-950! transition-all! duration-300! border dark:border-slate-800!"
                            aria-label={t('common.toggleLanguage')}
                        >
                            <div className="flex items-center gap-1 font-bold text-xs uppercase">
                                <RiGlobalLine size={18} />
                                <span className="uppercase">{language}</span>
                            </div>
                        </ActionIcon>
                    </Tooltip>
                </div>

                {/* Theme Toggle */}
                <div className="flex">
                    <Tooltip
                        label={isDarkMode ? t('common.lightMode', 'Light Mode') : t('common.darkMode', 'Dark Mode')}
                        withArrow
                        position="bottom"
                    >
                        <ActionIcon
                            variant="subtle"
                            size="lg"
                            radius="md"
                            onClick={toggleTheme}
                            className="bg-gray/10! dark:bg-[#141b24]! text-slate-700! dark:text-slate-300! hover:bg-[#85F40F]! hover:text-brand-950! transition-all! duration-300! border dark:border-slate-800!"
                            aria-label={t('common.toggleTheme')}
                        >
                            {isDarkMode ? <MdOutlineLightMode size={20} className="text-[#85F40F]" /> : <MdOutlineDarkMode size={20} />}
                        </ActionIcon>
                    </Tooltip>
                </div>

                {/* Profile & Role Dropdown */}
                <Menu shadow="md" width={220} position="bottom-end">
                    <Menu.Target>
                        <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-[#141b24] transition-colors cursor-pointer" aria-label={t('common.openProfileMenu')}>
                            <Avatar
                                radius="xl"
                                className="bg-linear-to-br from-[#85F40F] to-[#6CC80A] text-brand-950 font-black"
                            >
                                {user?.name ? user.name[0] : 'U'}
                            </Avatar>
                        </button>
                    </Menu.Target>

                    <Menu.Dropdown className="dark:bg-[#0e1517]! dark:border-slate-800!">
                        <Menu.Label className="dark:text-gray-400!">
                            {user?.name || t('nav.user')}
                        </Menu.Label>
                        <Menu.Item
                            leftSection={<FiShield size={14} className="text-main" />}
                            className="dark:text-slate-200! capitalize"
                        >
                            {t('nav.role')}: {t(userRoleKey, user?.role || t('staff.owner'))}
                        </Menu.Item>

                        <Menu.Divider />
                        <Menu.Item
                            color="red"
                            leftSection={<FiLogOut size={14} />}
                            onClick={handleLogout}
                            disabled={isLogoutLoading}
                        >
                            {t('nav.logout', 'Log Out')}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </nav>
    );
};

export default NavBar;
