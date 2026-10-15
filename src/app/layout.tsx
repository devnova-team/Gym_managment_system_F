import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '../index.css';
import { Suspense } from 'react';
import Providers from '../shared/components/Providers';
import './metadata.css';

export const metadata = {
    title: 'Gym Management System',
    description: 'Multi-tenant Gym Management System dashboard',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" dir="ltr">
            <body className="font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased min-h-screen">
                <Suspense
                    fallback={
                        <div className="min-h-screen bg-slate-50 dark:bg-slate-950" role="status" />
                    }
                >
                    <Providers>{children}</Providers>
                </Suspense>
            </body>
        </html>
    );
}
