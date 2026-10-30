import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Skeleton } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { HiOutlinePlus } from "react-icons/hi2";

import {
  useCreateMemberMutation,
  useDeleteMemberMutation,
  useGetAllMembersQuery,
  useUpdateMemberMutation,
} from "../../Service/Apis/membersApi";
import { useGetSubscriptionsQuery } from "../../Service/Apis/subscriptionsApi";
import { useGetTodayAttendanceQuery } from "../../Service/Apis/attendanceApi";
import { useToast } from "../../Context/ToastContext";
import { AuthContext } from "../../AuthContext/AuthProvider";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { getSubscriptionStatus } from "../Subscriptions/utils/subscriptionStatus";
import { memberValidationSchema } from "./validation/MemberValidation";
import { getMemberFields } from "./validation/memberFields";
import MembersFilter from "./MembersFilter";
import MembersTable from "./MembersTable";
import DynamicFormModal from "../../components/DynamicForm/DynamicFormModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";

const ITEMS_PER_PAGE = 10;

const normalizeMember = (member) => ({
  ...member,
  name: member.name ?? member.full_name ?? "",
  nameAr: member.nameAr ?? member.name_ar,
  phone: member.phone ?? member.phone_number ?? "",
  email: member.email ?? "",
  birth_date: member.birth_date ?? member.birthDate ?? "",
  photo: member.photo ?? member.photo_url ?? "",
  membershipType: member.membershipType ?? member.membership_type,
  createdAt: member.createdAt ?? member.created_at ?? member.join_date,
});

const getAttendanceList = (response) => {
  const payload = response?.data ?? response;
  const records = payload?.attendance ?? payload?.records ?? payload?.data ?? payload;
  return Array.isArray(records) ? records : [];
};

const getAttendanceMemberId = (record) => (
  record?.member_id
    ?? record?.memberId
    ?? record?.member?.id
    ?? record?.member_details?.id
);

const isCurrentlyPresent = (record) => {
  if (record?.check_out || record?.check_out_time || record?.checkOutTime) return false;
  const status = String(record?.status ?? record?.attendance_status ?? "").toLowerCase();
  return !["checked_out", "checked-out", "checked out", "left", "out"].includes(status);
};

const getSubscriptionState = (subscription) => {
  if (!subscription) return "noSubscription";
  const endDate = subscription.end_date ?? subscription.endDate;
  if (endDate && !Number.isNaN(Date.parse(endDate))) {
    return getSubscriptionStatus(endDate);
  }

  const status = String(subscription.status ?? "").toLowerCase();
  if (["active", "expired", "expiringsoon"].includes(status)) {
    return status === "expiringsoon" ? "expiringSoon" : status;
  }
  return "noSubscription";
};

const Members = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch] = useDebouncedValue(searchQuery.trim(), 300);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState(null);

  const role = String(user?.role ?? "").toLowerCase();
  const canManageMembers = role === "owner" || role === "receptionist";
  const canDeleteMembers = canManageMembers;

  const {
    data: memberData,
    isLoading: isMembersLoading,
    isFetching: isMembersFetching,
    isError: isMembersError,
    refetch: refetchMembers,
  } = useGetAllMembersQuery(undefined);
  const {
    data: subscriptions = [],
    isLoading: isSubscriptionsLoading,
    isError: isSubscriptionsError,
    refetch: refetchSubscriptions,
  } = useGetSubscriptionsQuery(undefined);
  const {
    data: attendanceData,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
    refetch: refetchAttendance,
  } = useGetTodayAttendanceQuery(undefined);

  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, planFilter, attendanceFilter]);

  const allMembers = useMemo(() => (memberData ?? []).map(normalizeMember), [memberData]);
  const attendanceRecords = useMemo(
    () => getAttendanceList(attendanceData),
    [attendanceData],
  );
  const subscriptionsByMember = useMemo(() => {
    const byMember = new Map();
    subscriptions.forEach((subscription) => {
      const memberId = subscription.member_id ?? subscription.memberId ?? subscription.member?.id;
      if (memberId == null) return;
      const key = String(memberId);
      byMember.set(key, [...(byMember.get(key) ?? []), subscription]);
    });
    return byMember;
  }, [subscriptions]);
  const presentMemberIds = useMemo(() => new Set(
    attendanceRecords
      .filter(isCurrentlyPresent)
      .map(getAttendanceMemberId)
      .filter((id) => id != null)
      .map(String),
  ), [attendanceRecords]);

  const members = useMemo(() => allMembers.map((member) => {
    const memberId = String(member.id ?? member.member_id);
    const nestedSubscriptions = member.subscriptions
      ?? (member.subscription ? [member.subscription] : []);
    const subscriptionsForMember = subscriptionsByMember.get(memberId) ?? nestedSubscriptions;
    const memberSubscriptions = Array.isArray(subscriptionsForMember)
      ? subscriptionsForMember
      : [subscriptionsForMember];
    const latestSubscription = [...memberSubscriptions].sort((left, right) => (
      String(right.end_date ?? "").localeCompare(String(left.end_date ?? ""))
    ))[0];
    const planName = latestSubscription?.plan?.name
      ?? latestSubscription?.plan_name
      ?? latestSubscription?.membership_type
      ?? member.membershipType
      ?? "";

    return {
      ...member,
      membershipType: planName,
      subscriptionStatus: isSubscriptionsError
        ? "unavailable"
        : getSubscriptionState(latestSubscription),
      attendanceStatus: isAttendanceError
        ? "unavailable"
        : presentMemberIds.has(memberId)
          ? "attended"
          : "notAttended",
    };
  }), [
    allMembers,
    isAttendanceError,
    isSubscriptionsError,
    presentMemberIds,
    subscriptionsByMember,
  ]);

  const filteredMembers = useMemo(() => {
    const search = debouncedSearch.toLowerCase();
    return members.filter((member) => {
      const matchesSearch = !search || [
        member.name,
        member.phone,
        member.email,
      ].some((value) => String(value ?? "").toLowerCase().includes(search));
      const matchesStatus = statusFilter === "all"
        || member.subscriptionStatus === statusFilter;
      const matchesPlan = planFilter === "all"
        || member.membershipType === planFilter;
      const matchesAttendance = attendanceFilter === "all"
        || (attendanceFilter === "attended"
          ? member.attendanceStatus === "attended"
          : member.attendanceStatus === "notAttended");

      return matchesSearch && matchesStatus && matchesPlan && matchesAttendance;
    });
  }, [attendanceFilter, debouncedSearch, members, planFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / ITEMS_PER_PAGE));
  const pageMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const planOptions = useMemo(() => [...new Set(
    members.map((member) => member.membershipType).filter(Boolean),
  )].map((planName) => ({ value: planName, label: planName })), [members]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const defaultValues = useMemo(() => ({
    name: editingMember?.name || "",
    phone: editingMember?.phone || "",
    email: editingMember?.email || "",
    birth_date: editingMember?.birth_date || "",
    photo: editingMember?.photo || editingMember?.photo_url || "",
  }), [editingMember]);

  const handleAddClick = () => {
    setEditingMember(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isCreating || isUpdating) return;
    setIsFormModalOpen(false);
    setEditingMember(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingMember) {
        await updateMember({ id: editingMember.id, ...formData }).unwrap();
        toast.success(t("members.updateSuccess", "Member updated successfully"));
      } else {
        await createMember(formData).unwrap();
        toast.success(t("members.createSuccess", "Member created successfully"));
      }

      setIsFormModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t));
    }
  };

  const handleDeleteClick = (member) => {
    setDeletingMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setDeletingMember(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;

    try {
      await deleteMember(deletingMember.id).unwrap();
      toast.success(t("members.deleteSuccess", "Member deleted successfully"));
      setIsDeleteModalOpen(false);
      setDeletingMember(null);

      if (filteredMembers.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, t));
    }
  };

  if (isMembersLoading || isSubscriptionsLoading || isAttendanceLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {t("members.title", "Members & Subscriptions Management")}
        </h2>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={40} mt="sm" radius="md" />
          ))}
        </div>
      </div>
    );
  }

  if (isMembersError) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {t("members.title", "Members & Subscriptions Management")}
        </h2>
        <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center space-y-4">
          <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold">
            {t("members.loadError", "Failed to load members. Please try again.")}
          </p>
          <Button variant="light" color="red" onClick={refetchMembers} loading={isMembersFetching}>
            {t("common.retry", "Try again")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {t("members.title", "Members & Subscriptions Management")}
        </h2>
        <div className="flex items-center gap-3">
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            {filteredMembers.length} {t("members.count", "members")}
          </p>
          {canManageMembers && (
            <Button
              onClick={handleAddClick}
              leftSection={<HiOutlinePlus size={18} />}
              radius="md"
              className="bg-linear-to-r from-[#85F40F] to-[#6CC80A] hover:from-[#95E913] hover:to-[#79BE0D] text-brand-950 font-bold transition-all shadow-[0_0_15px_rgba(133,244,15,0.35)]"
            >
              {t("members.addMember", "Add Member")}
            </Button>
          )}
        </div>
      </div>

      {(isSubscriptionsError || isAttendanceError) && (
        <Alert color="yellow" title={t("members.statusSourceError.title", "Some member statuses are unavailable")}>
          <div className="flex flex-col gap-2">
            <span>{t("members.statusSourceError.message", "Subscription or attendance data could not be loaded.")}</span>
            <Button
              variant="light"
              color="yellow"
              size="xs"
              className="self-start"
              onClick={() => {
                if (isSubscriptionsError) refetchSubscriptions();
                if (isAttendanceError) refetchAttendance();
              }}
            >
              {t("common.retry", "Try again")}
            </Button>
          </div>
        </Alert>
      )}

      <MembersFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        attendanceFilter={attendanceFilter}
        setAttendanceFilter={setAttendanceFilter}
        planOptions={planOptions}
        subscriptionsUnavailable={isSubscriptionsError}
        attendanceUnavailable={isAttendanceError}
      />

      <MembersTable
        members={pageMembers}
        pagination={{ totalPages }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        canManageMembers={canManageMembers}
        canDeleteMembers={canDeleteMembers}
      />

      <DynamicFormModal
        opened={isFormModalOpen}
        onClose={handleCloseModal}
        title={editingMember
          ? t("members.editMemberTitle", "Edit Member")
          : t("members.addMemberTitle", "Add New Member")}
        subtitle={editingMember
          ? t("members.editMemberSubtitle", "Update member information")
          : t("members.addMemberSubtitle", "Enter the new member's information")}
        fields={getMemberFields(t)}
        validationSchema={memberValidationSchema}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
        defaultValues={defaultValues}
        submitText={editingMember
          ? t("common.saveChanges", "Save Changes")
          : t("members.addMember", "Add Member")}
        size="lg"
      />

      <DeleteConfirmModal
        opened={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        memberName={deletingMember?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Members;
