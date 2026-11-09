/**
 * Mock response adhering to GET /api/dashboard/stats
 * Feature 4: Owner Dashboard
 */

export const mockDashboardData = {
    gymInfo: {
        id: 'gym-001',
        name: 'FitPulse Arena',
        tier: 'Enterprise SaaS',
        timezone: 'Africa/Cairo',
    },
    summary: {
        totalMembers: {
            value: 468,
            change: '+8.4%',
            isPositive: true,
            periodKey: 'vs last month',
            description: 'Total registered gym members'
        },
        activeMembers: {
            value: 342,
            change: '+12.5%',
            isPositive: true,
            periodKey: 'vs last month',
            description: '342 active subscribed members'
        },
        monthlyRevenue: {
            value: 145800,
            currency: 'EGP',
            change: '+18.4%',
            isPositive: true,
            periodKey: 'vs last month',
            description: 'Total revenue this month'
        },
        presentToday: {
            value: 87,
            change: '+9',
            isPositive: true,
            capacityPercentage: 62,
            peakHours: '06:00 PM - 09:00 PM',
            description: 'Current visitors inside today'
        },
        monthlyExpenses: {
            value: 62400,
            currency: 'EGP',
            change: '-4.2%',
            isPositive: false,
            periodKey: 'vs last month',
            description: 'Operating facility expenses'
        },
        netProfit: {
            value: 83400,
            currency: 'EGP',
            change: '+24.5%',
            isPositive: true,
            periodKey: 'vs last month',
            description: 'Revenue - Expenses'
        }
    },

    // 4 Primary Segments from Feature 3 & Feature 4 specs
    segmentCounters: [
        {
            key: 'new',
            titleKey: 'dashboard.segmentNew',
            descKey: 'dashboard.segmentNewDesc',
            count: 48,
            badgeColor: 'emerald',
            accentColor: '#10B981',
            icon: 'RiUserAddLine',
            linkQuery: 'new'
        },
        {
            key: 'expiring',
            titleKey: 'dashboard.segmentExpiring',
            descKey: 'dashboard.segmentExpiringDesc',
            count: 23,
            badgeColor: 'amber',
            accentColor: '#F59E0B',
            icon: 'RiTimeLine',
            linkQuery: 'expiring'
        },
        {
            key: 'inactive',
            titleKey: 'dashboard.segmentInactive',
            descKey: 'dashboard.segmentInactiveDesc',
            count: 35,
            badgeColor: 'orange',
            accentColor: '#FB923C',
            icon: 'RiUserUnfollowLine',
            linkQuery: 'inactive'
        },
        {
            key: 'expired',
            titleKey: 'dashboard.segmentExpired',
            descKey: 'dashboard.segmentExpiredDesc',
            count: 64,
            badgeColor: 'rose',
            accentColor: '#F43F5E',
            icon: 'RiUserForbidLine',
            linkQuery: 'expired'
        }
    ],

    // Weekly attendance check-in traffic
    attendanceTrend: {
        labels: {
            en: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            ar: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
        },
        checkIns: [78, 92, 115, 108, 96, 124, 87],
        capacityLimit: 140,
        averageCheckIns: 100,
        todayIndex: (new Date().getDay() + 1) % 7, // Dynamic day index: 0=Sat ... 5=Thu, 6=Fri
        changeVsLastWeek: '+14%',
        hourly: {
            labels: {
                en: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'],
                ar: ['06:00 ص', '09:00 ص', '12:00 م', '03:00 م', '06:00 م', '09:00 م', '12:00 ص']
            },
            checkIns: [18, 35, 42, 58, 112, 94, 26]
        }
    },

    // 6 Months Revenue vs Expenses vs Net Profit
    revenueVsExpensesTrend: {
        months: {
            en: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            ar: ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر']
        },
        revenue: [112000, 124500, 131000, 138000, 142500, 145800],
        expenses: [58000, 64000, 59500, 61000, 65000, 62400],
        netProfit: [54000, 60500, 71500, 77000, 77500, 83400]
    },

    // Membership Plan Distribution
    membershipDistribution: {
        labels: {
            en: ['1 Month Pass', '3 Months Plan', '6 Months Plan', '1 Year Annual', 'VIP / PT Special'],
            ar: ['اشتراك شهر', 'اشتراك 3 شهور', 'اشتراك 6 شهور', 'اشتراك سنوي', 'باقة VIP خاصة']
        },
        counts: [145, 92, 54, 36, 15],
        colors: ['#85F40F', '#10B981', '#06B6D4', '#6366F1', '#F59E0B']
    },

    // Recent activity feed
    recentActivities: [
        {
            id: 'act-1',
            type: 'check_in',
            member: { en: 'Omar Farouk', ar: 'عمر فاروق' },
            phone: '01098765432',
            plan: { en: '1 Month Pass', ar: 'اشتراك شهر' },
            time: '10:45 AM',
            timeAgo: { en: '12m ago', ar: 'منذ 12 دقيقة' },
            status: 'active'
        },
        {
            id: 'act-2',
            type: 'renewal',
            member: { en: 'Karim Mostafa', ar: 'كريم مصطفى' },
            phone: '01122334455',
            plan: { en: '3 Months Plan', ar: 'اشتراك 3 شهور' },
            amount: 2200,
            time: '10:15 AM',
            timeAgo: { en: '42m ago', ar: 'منذ 42 دقيقة' },
            status: 'paid'
        },
        {
            id: 'act-3',
            type: 'new_member',
            member: { en: 'Nour El-Din', ar: 'نور الدين' },
            phone: '01234567890',
            plan: { en: '1 Year Annual', ar: 'اشتراك سنوي' },
            amount: 6500,
            time: '09:30 AM',
            timeAgo: { en: '1h 27m ago', ar: 'منذ ساعة و27 د' },
            status: 'paid'
        },
        {
            id: 'act-4',
            type: 'store_sale',
            member: { en: 'Ahmed Adel', ar: 'أحمد عادل' },
            item: { en: 'Iso Whey Protein 2kg', ar: 'واي بروتين 2 كجم' },
            amount: 1950,
            time: '09:05 AM',
            timeAgo: { en: '1h 52m ago', ar: 'منذ ساعة و52 د' },
            status: 'completed'
        },
        {
            id: 'act-5',
            type: 'check_in',
            member: { en: 'Mahmoud Hassan', ar: 'محمود حسن' },
            phone: '01511223344',
            plan: { en: '6 Months Plan', ar: 'اشتراك 6 شهور' },
            time: '08:40 AM',
            timeAgo: { en: '2h 17m ago', ar: 'منذ ساعتين و17 د' },
            status: 'active'
        },
        {
            id: 'act-6',
            type: 'renewal',
            member: { en: 'Youssef Ibrahim', ar: 'يوسف إبراهيم' },
            phone: '01012345678',
            plan: { en: '3 Months Plan', ar: 'اشتراك 3 شهور' },
            amount: 2200,
            time: '08:15 AM',
            timeAgo: { en: '2h 45m ago', ar: 'منذ ساعتين و45 د' },
            status: 'paid'
        },
        {
            id: 'act-7',
            type: 'store_sale',
            member: { en: 'Ziad Tarek', ar: 'زياد طارق' },
            item: { en: 'BCAA Amino 400g', ar: 'مكمل BCAA 400جم' },
            amount: 850,
            time: '07:50 AM',
            timeAgo: { en: '3h 10m ago', ar: 'منذ 3 ساعات و10 د' },
            status: 'completed'
        },
        {
            id: 'act-8',
            type: 'check_in',
            member: { en: 'Tamer Hosny', ar: 'تامر حسني' },
            phone: '01198765432',
            plan: { en: '1 Month Pass', ar: 'اشتراك شهر' },
            time: '07:20 AM',
            timeAgo: { en: '3h 40m ago', ar: 'منذ 3 ساعات و40 د' },
            status: 'active'
        }
    ]
};

/**
 * Empty gym state mock for new tenants (Doc Page 22)
 */
export const mockEmptyDashboardData = {
    gymInfo: {
        id: 'gym-002',
        name: 'New Branch Gym',
        tier: 'Starter SaaS',
        timezone: 'Africa/Cairo',
    },
    summary: {
        activeMembers: { value: 0, change: '0%', isPositive: true },
        monthlyRevenue: { value: 0, currency: 'EGP', change: '0%', isPositive: true },
        presentToday: { value: 0, change: '0', capacityPercentage: 0 },
        monthlyExpenses: { value: 0, currency: 'EGP', change: '0%', isPositive: true },
        netProfit: { value: 0, currency: 'EGP', change: '0%', isPositive: true }
    },
    segmentCounters: [
        { key: 'new', titleKey: 'dashboard.segmentNew', count: 0, badgeColor: 'emerald', linkQuery: 'new' },
        { key: 'expiring', titleKey: 'dashboard.segmentExpiring', count: 0, badgeColor: 'amber', linkQuery: 'expiring' },
        { key: 'inactive', titleKey: 'dashboard.segmentInactive', count: 0, badgeColor: 'orange', linkQuery: 'inactive' },
        { key: 'expired', titleKey: 'dashboard.segmentExpired', count: 0, badgeColor: 'rose', linkQuery: 'expired' }
    ],
    attendanceTrend: {
        labels: { en: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], ar: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'] },
        checkIns: [0, 0, 0, 0, 0, 0, 0],
        capacityLimit: 100,
        averageCheckIns: 0,
        todayIndex: (new Date().getDay() + 1) % 7,
        changeVsLastWeek: '0%',
        hourly: {
            labels: {
                en: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'],
                ar: ['06:00 ص', '09:00 ص', '12:00 م', '03:00 م', '06:00 م', '09:00 م', '12:00 ص']
            },
            checkIns: [0, 0, 0, 0, 0, 0, 0]
        }
    },
    revenueVsExpensesTrend: {
        months: { en: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], ar: ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر'] },
        revenue: [0, 0, 0, 0, 0, 0],
        expenses: [0, 0, 0, 0, 0, 0],
        netProfit: [0, 0, 0, 0, 0, 0]
    },
    membershipDistribution: {
        labels: { en: [], ar: [] },
        counts: [],
        colors: []
    },
    recentActivities: []
};
