// =====================================================================
// MOCK DATA - TEMPORARY
// =====================================================================
// السبب: الباك إند لسه مش جاهز، ومحتاجين نبني الصفحة.
// لما الـ API يشتغل، هذا الملف يتشال بالكامل.
//
// IMPORTANT: الشكل هنا مطابق تماماً لشكل رد GET /api/members
// =====================================================================

export const MOCK_MEMBERS_RESPONSE = {
  success: true,
  count: 12,
  pagination: {
    currentPage: 1,
    totalPages: 2,
    limit: 10,
  },
  data: [
    {
      id: "member-001",
      name: "Ahmed Ali",
      nameAr: "أحمد علي",
      phone: "01012345678",
      status: "active",
      membershipType: "Annual",
      createdAt: "2026-01-15T10:00:00Z",
    },
    {
      id: "member-002",
      name: "Sara Mohamed",
      nameAr: "سارة محمد",
      phone: "01187654321",
      status: "expired",
      membershipType: "Monthly",
      createdAt: "2024-06-10T10:00:00Z",
    },
    {
      id: "member-003",
      name: "Mohamed Hassan",
      nameAr: "محمد حسن",
      phone: "01234567890",
      status: "active",
      membershipType: "Annual",
      createdAt: "2025-03-20T10:00:00Z",
    },
    {
      id: "member-004",
      name: "Nour Ibrahim",
      nameAr: "نور إبراهيم",
      phone: "01098765432",
      status: "suspended",
      membershipType: "Monthly",
      createdAt: "2024-11-05T10:00:00Z",
    },
    {
      id: "member-005",
      name: "Youssef Khaled",
      nameAr: "يوسف خالد",
      phone: "01555123456",
      status: "active",
      membershipType: "Annual",
      createdAt: "2025-02-01T10:00:00Z",
    },
    {
      id: "member-006",
      name: "Mariam Adel",
      nameAr: "مريم عادل",
      phone: "01099887766",
      status: "active",
      membershipType: "Monthly",
      createdAt: "2025-04-12T10:00:00Z",
    },
    {
      id: "member-007",
      name: "Omar Tarek",
      nameAr: "عمر طارق",
      phone: "01277665544",
      status: "expired",
      membershipType: "Monthly",
      createdAt: "2024-08-22T10:00:00Z",
    },
    {
      id: "member-008",
      name: "Hana Sameh",
      nameAr: "هنا سامح",
      phone: "01122334455",
      status: "active",
      membershipType: "Annual",
      createdAt: "2025-05-18T10:00:00Z",
    },
    {
      id: "member-009",
      name: "Karim Nabil",
      nameAr: "كريم نبيل",
      phone: "01066778899",
      status: "active",
      membershipType: "Annual",
      createdAt: "2025-01-30T10:00:00Z",
    },
    {
      id: "member-010",
      name: "Layla Mahmoud",
      nameAr: "ليلى محمود",
      phone: "01555443322",
      status: "suspended",
      membershipType: "Monthly",
      createdAt: "2024-09-14T10:00:00Z",
    },
    {
      id: "member-011",
      name: "Hassan Fathy",
      nameAr: "حسن فتحي",
      phone: "01233445566",
      status: "active",
      membershipType: "Monthly",
      createdAt: "2025-06-01T10:00:00Z",
    },
    {
      id: "member-012",
      name: "Dina Mostafa",
      nameAr: "دينا مصطفى",
      phone: "01011223344",
      status: "expired",
      membershipType: "Annual",
      createdAt: "2024-05-20T10:00:00Z",
    },
  ],
};
