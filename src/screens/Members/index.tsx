import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton, Button } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { HiOutlinePlus } from "react-icons/hi2";

import { memberValidationSchema } from "./validation/MemberValidation";
import { getMemberFields } from "./validation/memberFields";

// =====================================================================
// TEMPORARY: Mock data. لما الـ API يشتغل، شيل السطر ده وفعّل اللي تحته.
// =====================================================================
import { MOCK_MEMBERS_RESPONSE } from "./mockData";
// import { useGetMembersQuery } from "../../Service/Apis/membersApi";

import MembersFilter from "./MembersFilter";
import MembersTable from "./MembersTable";
import DynamicFormModal from "../../components/DynamicForm/DynamicFormModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal"; // ← ADDED

// =====================================================================
// TEMPORARY: Mutations. لما السيرفر يشتغل، شيل التعليق عن السطرين دول.
// =====================================================================
// import {
//   useCreateMemberMutation,
//   useUpdateMemberMutation,
//   useDeleteMemberMutation, // ← ADDED (معلّق)
// } from "../../Service/Apis/membersApi";

const ITEMS_PER_PAGE = 10;

const Members = () => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipTypeFilter, setMembershipTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // =====================================================================
  // NEW: Members state (بيبدأ من الـ Mock، والـ Add/Edit بيعدّلوا عليه)
  // لما السيرفر يشتغل، الـ state ده يتشال، والبيانات تيجي من useGetMembersQuery
  // =====================================================================
  const [membersList, setMembersList] = useState(MOCK_MEMBERS_RESPONSE.data);
  // =====================================================================

  // =====================================================================
  // Modal state
  // =====================================================================
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // ← ADDED: Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState(null);
  // =====================================================================

  // =====================================================================
  // Mutations (معلّقين)
  // =====================================================================
  // const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
  // const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  // const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation(); // ← ADDED (معلّق)
  // =====================================================================

  // Debounce البحث
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  // =====================================================================
  // MODIFIED: الفلترة والـ pagination بيشتغلوا على membersList (state)
  // =====================================================================
  const { data, isLoading, isError } = useMemo(() => {
    const allMembers = membersList;

    const filtered = allMembers.filter((member) => {
      const matchesSearch =
        !debouncedSearch ||
        member.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        member.nameAr?.includes(debouncedSearch) ||
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
  }, [
    membersList,
    debouncedSearch,
    statusFilter,
    membershipTypeFilter,
    currentPage,
  ]);
  // =====================================================================

  // =====================================================================
  // PRODUCTION: فعّل ده لما السيرفر يشتغل
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
  // Handlers
  // =====================================================================

  const handleAddClick = () => {
    setEditingMember(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingMember(null);
  };

  // =====================================================================
  // MODIFIED: handleFormSubmit بيعدّل الـ membersList state
  // =====================================================================
  const handleFormSubmit = (formData) => {
    if (editingMember) {
      // ==================== EDIT ====================
      setMembersList((prev) =>
        prev.map((m) =>
          m.id === editingMember.id ? { ...m, ...formData } : m,
        ),
      );
    } else {
      // ==================== ADD ====================
      const newMember = {
        id: `member-${Date.now()}`,
        name: formData.name,
        nameAr: formData.nameAr || formData.name,
        phone: formData.phone,
        email: formData.email,
        join_date: formData.join_date,
        photo_url: formData.photo_url || "",
        status: "active",
        membershipType: "Monthly",
        createdAt: new Date().toISOString(),
      };
      setMembersList((prev) => [newMember, ...prev]);
    }
    handleCloseModal();
  };
  // =====================================================================

  // =====================================================================
  // PRODUCTION handleFormSubmit
  // =====================================================================
  // const handleFormSubmit = async (formData) => {
  //   try {
  //     if (editingMember) {
  //       await updateMember({ id: editingMember.id, ...formData }).unwrap();
  //     } else {
  //       await createMember(formData).unwrap();
  //     }
  //     handleCloseModal();
  //   } catch (err) {
  //     console.error("Failed to save member:", err);
  //   }
  // };
  // =====================================================================

  // =====================================================================
  // ADDED: Delete handlers
  // =====================================================================

  // فتح مودال تأكيد الحذف
  const handleDeleteClick = (member) => {
    setDeletingMember(member);
    setIsDeleteModalOpen(true);
  };

  // قفل مودال تأكيد الحذف
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingMember(null);
  };

  // تنفيذ الحذف
  const handleConfirmDelete = () => {
    // =====================================================================
    // TEMPORARY: Mock behavior (يشيل العضو من الـ state)
    // =====================================================================
    setMembersList((prev) => prev.filter((m) => m.id !== deletingMember.id));

    handleCloseDeleteModal();
    // =====================================================================

    // =====================================================================
    // PRODUCTION: فعّل ده لما السيرفر يشتغل وامسح بلوك الـ Mock فوق
    // =====================================================================
    // const handleConfirmDelete = async () => {
    //   try {
    //     await deleteMember(deletingMember.id).unwrap();
    //     handleCloseDeleteModal();
    //   } catch (err) {
    //     notifications.show({
    //       title: t("common.error", "Error"),
    //       message:
    //         err?.data?.message ||
    //         t("members.deleteError", "Failed to delete member"),
    //       color: "red",
    //     });
    //   }
    // };
    // =====================================================================
  };
  // =====================================================================

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
      {/* Page Title + Count + Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {t("members.title", "Members & Subscriptions Management")}
        </h2>
        <div className="flex items-center gap-3">
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            {data?.count || 0} {t("members.count", "members")}
          </p>
          <Button
            onClick={handleAddClick}
            leftSection={<HiOutlinePlus size={18} />}
            radius="md"
            className="bg-linear-to-r from-[#85F40F] to-[#6CC80A] hover:from-[#95E913] hover:to-[#79BE0D] text-brand-950 font-bold transition-all shadow-[0_0_15px_rgba(133,244,15,0.35)]"
          >
            {t("members.addMember", "Add Member")}
          </Button>
        </div>
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
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick} // ← ADDED
      />

      {/* DynamicFormModal */}
      <DynamicFormModal
        opened={isFormModalOpen}
        onClose={handleCloseModal}
        title={
          editingMember
            ? t("members.editMemberTitle", "Edit Member")
            : t("members.addMemberTitle", "Add New Member")
        }
        subtitle={
          editingMember
            ? t("members.editMemberSubtitle", "Update member information")
            : t(
                "members.addMemberSubtitle",
                "Enter the new member's information",
              )
        }
        fields={getMemberFields(t)}
        validationSchema={memberValidationSchema}
        onSubmit={handleFormSubmit}
        // isLoading={isCreating || isUpdating}
        defaultValues={
          editingMember
            ? {
                name: editingMember.name || "",
                phone: editingMember.phone || "",
                email: editingMember.email || "",
                join_date: editingMember.join_date || "",
                photo_url: editingMember.photo_url || "",
              }
            : {
                name: "",
                phone: "",
                email: "",
                join_date: "",
                photo_url: "",
              }
        }
        submitText={
          editingMember
            ? t("common.saveChanges", "Save Changes")
            : t("members.addMember", "Add Member")
        }
        size="lg"
      />

      {/* ← ADDED: DeleteConfirmModal */}
      <DeleteConfirmModal
        opened={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        memberName={deletingMember?.name || ""}
        // isLoading={isDeleting}
      />
      {/* ===================================================================== */}
    </div>
  );
};

export default Members;
