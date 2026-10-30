import TextInputField from "../../../components/Forms/TextInputField"; // عدّل المسار حسب مكان الـ Forms في مشروعك
import {
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiImage,
} from "react-icons/fi";

// =====================================================================
// Member Form Fields
// =====================================================================
// دالة بترجّع array من الحقول، بتاخد t عشان الـ labels تترجم.
// الاستخدام: const fields = getMemberFields(t);
//
// NOTE: كل field لازم name يطابق اسمه في memberValidationSchema
// =====================================================================

export const getMemberFields = (t) => [
  {
    id: "name",
    name: "name",
    colSpan: 6,
    component: ({ field, error }) => (
      <TextInputField
        name="name"
        label={t("members.fields.name", "Full Name")}
        placeholder={t("members.namePlaceholder", "Enter member name")}
        value={field.value}
        onChange={field.onChange}
        error={error ? t(error) : undefined}
        leftSection={<FiUser size={16} />}
        required
      />
    ),
  },

  {
    id: "phone",
    name: "phone",
    colSpan: 6,
    component: ({ field, error }) => (
      <TextInputField
        name="phone"
        label={t("members.phone", "Phone Number")}
        placeholder={t("members.phonePlaceholder", "01xxxxxxxxx")}
        value={field.value}
        onChange={field.onChange}
        error={error ? t(error) : undefined}
        leftSection={<FiPhone size={16} />}
        required
      />
    ),
  },

  {
    id: "email",
    name: "email",
    colSpan: 6,
    component: ({ field, error }) => (
      <TextInputField
        name="email"
        type="email"
        label={t("members.email", "Email Address")}
        placeholder={t("members.emailPlaceholder", "member@example.com")}
        value={field.value}
        onChange={field.onChange}
        error={error ? t(error) : undefined}
        leftSection={<FiMail size={16} />}
        required
      />
    ),
  },

  {
    id: "birth_date",
    name: "birth_date",
    colSpan: 6,
    component: ({ field, error }) => (
      <TextInputField
        name="birth_date"
        type="date"
        label={t("members.birthDate", "Birth Date")}
        value={field.value}
        onChange={field.onChange}
        error={error ? t(error) : undefined}
        leftSection={<FiCalendar size={16} />}
        required
      />
    ),
  },

  {
    id: "photo",
    name: "photo",
    colSpan: 12,
    component: ({ field, error }) => (
      <TextInputField
        name="photo"
        label={t("members.photoUrl", "Photo URL")}
        placeholder={t(
          "members.fields.photoUrlPlaceholder",
          "https://example.com/photo.jpg",
        )}
        value={field.value}
        onChange={field.onChange}
        error={error ? t(error) : undefined}
        leftSection={<FiImage size={16} />}
      />
    ),
  },

  // =====================================================================
  // SUBSCRIPTION - معلّق لحد ما الليدر يأكد
  // لو الفورم بيضيف اشتراك مع العضو، شيل التعليق عن البلوك ده
  // وكمان شيل التعليق عن planId في memberValidationSchema
  // =====================================================================
  // {
  //   id: "planId",
  //   name: "planId",
  //   colSpan: 12,
  //   component: ({ field, error }) => (
  //     <SelectField
  //       name="planId"
  //       label={t("members.fields.plan", "Subscription Plan")}
  //       placeholder={t("members.fields.planPlaceholder", "Select a plan")}
  //       data={plans.map((plan) => ({
  //         value: String(plan.id),
  //         label: plan.name,
  //       }))}
  //       value={field.value}
  //       onChange={field.onChange}
  //       error={error}
  //       leftSection={<FiPackage size={16} />}
  //       required
  //     />
  //   ),
  // },
  // =====================================================================
];
