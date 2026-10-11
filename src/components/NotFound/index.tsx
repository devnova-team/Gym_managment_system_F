'use client';

import { Title, Text, Button, Container, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-bg-light dark:bg-bg-dark overflow-hidden relative transition-colors">
            <Container className="text-center relative py-12">
                {/* Large Background 404 Text */}
                <div className="absolute inset-0 flex justify-center items-center -top-20 md:-top-32 pointer-events-none select-none opacity-20 dark:opacity-10">
                    <span className="text-[150px] md:text-[250px] font-black text-transparent bg-clip-text bg-linear-to-tr from-main to-subMain animate-pulse">
                        404
                    </span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <Title className="text-4xl md:text-6xl font-extrabold text-textSecondColor dark:text-white mb-4 animate-[fadeIn_0.8s_ease-out]">
                        {t('not_found_title', 'Page Not Found')}
                    </Title>
                    <Text size="lg" className="max-w-lg mx-auto mb-10 text-textColor dark:text-gray-400 font-medium animate-[fadeIn_1s_ease-out]">
                        {t('not_found_desc', "The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.")}
                    </Text>
                    <Group justify="center" mt={20} className="animate-[fadeIn_1.2s_ease-out]">
                        <Button
                            size="xl"
                            radius="xl"
                            className="bg-linear-to-r! from-main! to-subMain! hover:shadow-smoothCardHover! transition-all! duration-500! px-10! h-14! text-lg! font-bold! text-white! cursor-pointer"
                            onClick={() => router.push('/')}
                        >
                            {t('return_home', 'Return to Dashboard')}
                        </Button>
                    </Group>
                </div>

                {/* Decorative Glowing Elements */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-main/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-subMain/10 rounded-full blur-3xl pointer-events-none"></div>
            </Container>
        </div>
    );
}
