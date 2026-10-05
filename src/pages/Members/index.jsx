// import { useTranslation } from 'react-i18next';
// import { useGetMembersQuery } from '../../Service/Apis/membersApi';

// const Members = () => {
//     const { t } = useTranslation();
//     const { data: _members } = useGetMembersQuery();

//     return (
//         <div className="space-y-4">
//             <h2 className="text-xl font-bold text-slate-800 dark:text-white">
//                 {t('members.title', 'Members & Subscriptions Management')}
//             </h2>
//             <div className="p-8 rounded-2xl bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80 shadow-smoothCard text-center">
//                 <p className="text-sm text-textColor dark:text-slate-400">
//                     Ready for Feature 1 (Youssef): Connected to <code className="font-mono text-[#85F40F]">membersApi</code>.
//                 </p>
//             </div>
//         </div>
//     );
// };

import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

// =====================================================================
// TEMPORARY: Mock data. لما الـ API يشتغل، شيل السطر ده وفعّل اللي تحته.
// =====================================================================
import { MOCK_MEMBERS_RESPONSE } from "./mockData";
// import { useGetMembersQuery } from "../../Service/Apis/membersApi";

import MembersFilter from "./MembersFilter";
import MembersTable from "./MembersTable";

const ITEMS_PER_PAGE = 10;

const Members = () => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipTypeFilter, setMembershipTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce البحث عشان ما نبعش request مع كل حرف
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  // =====================================================================
  // TEMPORARY: Mock data + فلترة محلية تحاكي السيرفر
  // لما الـ API يشتغل، شيل البلوك ده وفعّل الـ hook المعلّق
  // =====================================================================
  const { data, isLoading, isError } = useMemo(() => {
    const allMembers = MOCK_MEMBERS_RESPONSE.data;

    const filtered = allMembers.filter((member) => {
      const matchesSearch =
        !debouncedSearch ||
        member.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        member.nameAr.includes(debouncedSearch) ||
        member.phone.includes(debouncedSearch);

      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;

      const matchesType =
        membershipTypeFilter === "all" ||
        member.membershipType === membershipTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

    return {
      data: {
        data: paginated,
        pagination: {
          currentPage,
          totalPages: Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1,
          limit: ITEMS_PER_PAGE,
        },
        count: filtered.length,
      },
      isLoading: false,
      isError: false,
    };
  }, [debouncedSearch, statusFilter, membershipTypeFilter, currentPage]);

  // =====================================================================
  // PRODUCTION: فعّل ده لما السيرفر يشتغل وامسح بلوك الـ Mock
  // =====================================================================
  // const { data, isLoading, isError } = useGetMembersQuery({
  //   search: debouncedSearch || undefined,
  //   status: statusFilter !== "all" ? statusFilter : undefined,
  //   membershipType: membershipTypeFilter !== "all" ? membershipTypeFilter : undefined,
  //   page: currentPage,
  //   limit: ITEMS_PER_PAGE,
  // });
  // =====================================================================

  // صفّر الصفحة لما تتغير أي فلتر
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, membershipTypeFilter]);

  const members = data?.data || [];
  const pagination = data?.pagination;

  // =====================================================================
  // RENDER: Loading
  // =====================================================================
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {t("members.title", "Members & Subscriptions Management")}
        </h2>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={40} mt="sm" radius="md" />
          ))}
        </div>
      </div>
    );
  }

  // =====================================================================
  // RENDER: Error
  // =====================================================================
  if (isError) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {t("members.title", "Members & Subscriptions Management")}
        </h2>
        <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center">
          <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold">
            {t(
              "members.loadError",
              "Failed to load members. Please try again.",
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Title + Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {t("members.title", "Members & Subscriptions Management")}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          {data?.count || 0} {t("members.count", "members")}
        </p>
      </div>

      {/* Filters */}
      <MembersFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        membershipTypeFilter={membershipTypeFilter}
        setMembershipTypeFilter={setMembershipTypeFilter}
      />

      {/* Table */}
      <MembersTable
        members={members}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Members;
