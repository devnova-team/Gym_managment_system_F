const dateFromToday = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const communicationProfiles = {
    1: { joinDate: dateFromToday(-5), planName: 'Starter', subscriptionEndDate: dateFromToday(55), lastAttendance: dateFromToday(-1), memberStatus: 'Active' },
    2: { joinDate: dateFromToday(-120), planName: 'Monthly', subscriptionEndDate: dateFromToday(5), lastAttendance: dateFromToday(-2), memberStatus: 'Active' },
    3: { joinDate: dateFromToday(-180), planName: 'Quarterly', subscriptionEndDate: dateFromToday(60), lastAttendance: dateFromToday(-45), memberStatus: 'Active' },
    4: { joinDate: dateFromToday(-240), planName: 'Monthly', subscriptionEndDate: dateFromToday(-4), lastAttendance: dateFromToday(-35), memberStatus: 'Expired' },
    5: { joinDate: dateFromToday(-100), planName: 'Quarterly', subscriptionEndDate: dateFromToday(75), lastAttendance: dateFromToday(-3), memberStatus: 'Active' },
    6: { joinDate: dateFromToday(-60), planName: 'Monthly', subscriptionEndDate: dateFromToday(10), lastAttendance: dateFromToday(-4), memberStatus: 'Active' },
    7: { joinDate: dateFromToday(-140), planName: 'Quarterly', subscriptionEndDate: dateFromToday(90), lastAttendance: dateFromToday(-52), memberStatus: 'Active' },
    8: { joinDate: dateFromToday(-220), planName: 'Monthly', subscriptionEndDate: dateFromToday(-20), lastAttendance: dateFromToday(-10), memberStatus: 'Expired' },
    9: { joinDate: dateFromToday(-90), planName: 'Quarterly', subscriptionEndDate: dateFromToday(65), lastAttendance: dateFromToday(-1), memberStatus: 'Active' },
};

export const mockMembers = [
    {
        id: 1,
        name: 'Ahmed Mohamed',
        nameAr: 'أحمد محمد',
        phone: '010 1234 5678',
        photo: null,
        attendanceStatus: 'not_coming',
        checkInTime: null,
    },
    {
        id: 2,
        name: 'Sara Ahmed',
        nameAr: 'سارة أحمد',
        phone: '011 2345 6789',
        photo: null,
        attendanceStatus: 'present',
        checkInTime: '2026-09-30T09:05:00',
    },
    {
        id: 3,
        name: 'Omar Hassan',
        nameAr: 'عمر حسن',
        phone: '012 3456 7890',
        photo: null,
        attendanceStatus: 'not_coming',
        checkInTime: null,
    },
    {
        id: 4,
        name: 'Mariam Ali',
        nameAr: 'مريم علي',
        phone: '010 9876 5432',
        photo: null,
        attendanceStatus: 'present',
        checkInTime: '2026-09-30T11:10:00',
    },
    {
        id: 5,
        name: 'Youssef Mahmoud',
        nameAr: 'يوسف محمود',
        phone: '015 4567 8910',
        photo: null,
        attendanceStatus: 'not_coming',
        checkInTime: null,
    },
    {
        id: 6,
        name: 'Nour Khaled',
        nameAr: 'نور خالد',
        phone: '010 5555 1234',
        photo: null,
        attendanceStatus: 'not_coming',
        checkInTime: null,
    },
    {
        id: 7,
        name: 'Karim Adel',
        nameAr: 'كريم عادل',
        phone: '011 7777 8888',
        photo: null,
        attendanceStatus: 'not_coming',
        checkInTime: null,
    },
    {
        id: 8,
        name: 'Hana Samir',
        nameAr: 'هنا سمير',
        phone: '012 9999 1111',
        photo: null,
        attendanceStatus: 'late',
        checkInTime: '2026-09-30T11:10:00',
    },
    {
        id: 9,
        name: 'Amr Fathy',
        nameAr: 'عمرو فتحي',
        phone: '015 2222 3333',
        photo: null,
        attendanceStatus: 'not_coming',
        checkInTime: null,
    },
    ].map((member) => ({ ...member, ...communicationProfiles[member.id] }));

export const mockAttendanceRecords = [
    {
        id: 'attendance-001',
        memberId: 2,
        memberName: 'Sara Ahmed',
        checkInTime: `${dateFromToday(0)}T09:05:00.000Z`,
        status: 'Present',
        attendanceStatus: 'present',
    },
    {
        id: 'attendance-002',
        memberId: 5,
        memberName: 'Youssef Mahmoud',
        checkInTime: `${dateFromToday(0)}T10:15:00.000Z`,
        status: 'Late',
        attendanceStatus: 'late',
    },
    {
        id: 'attendance-003',
        memberId: 3,
        memberName: 'Omar Hassan',
        checkInTime: `${dateFromToday(0)}T11:00:00.000Z`,
        status: 'Not Coming',
        attendanceStatus: 'not_coming',
    },
];