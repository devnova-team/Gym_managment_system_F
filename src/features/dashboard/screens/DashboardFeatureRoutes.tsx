'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '@/features/auth/context/AuthProvider';

const routes = [
    { href: '/dashboard/overview', label: 'nav.overview' },
    { href: '/dashboard/staff', label: 'nav.staff', ownerOnly: true },
    { href: '/dashboard/expenses', label: 'nav.expenses', ownerOnly: true },
    { href: '/dashboard/reports', label: 'nav.reports', ownerOnly: true },
    { href: '/dashboard/plans', label: 'nav.plans' },
    { href: '/dashboard/store', label: 'nav.store', ownerOnly: true },
    { href: '/dashboard/equipment', label: 'nav.equipment', ownerOnly: true },
    { href: '/dashboard/reminders', label: 'nav.reminders', ownerOnly: true },
];

const DashboardFeatureRoutes = () => {
    const pathname = usePathname();
    const { t } = useTranslation();
    const { isOwner } = useContext(AuthContext);
    const activeRoute = routes.find(
        ({ href }) => pathname === href || pathname === href.replace('/dashboard', ''),
    );

    if (!activeRoute) return null;

    return (
        <nav
            aria-label={t('nav.featureRoutes')}
            className="mb-6 flex w-full gap-2 overflow-x-auto border-b border-slate-200 dark:border-white/10"
        >
            {routes
                .filter((route) => !route.ownerOnly || isOwner)
                .map((route) => {
                    const isActive = route.href === activeRoute.href;

                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                                isActive
                                    ? 'border-[#85F40F] text-brand-800 dark:text-[#85F40F]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            {t(route.label)}
                        </Link>
                    );
                })}
        </nav>
    );
};

export default DashboardFeatureRoutes;
