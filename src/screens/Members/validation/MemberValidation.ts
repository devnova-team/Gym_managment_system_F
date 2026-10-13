import * as yup from "yup";

// =====================================================================
// Member Validation Schema
// =====================================================================
// الحقول المطلوبة: name, phone, email, join_date, photo_url
//
// NOTE: حقل planId خاص بالاشتراك (subscription) مش العضو.
// العلاقة: Member -> Subscription -> Plan
// لو الفورم هيضيف اشتراك مع العضو، فعّل planId (شيل التعليق).
// =====================================================================

export const memberValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("members.errors.nameRequired")
    .min(3, "members.errors.nameShort"),

  phone: yup
    .string()
    .trim()
    .required("members.errors.phoneRequired")
    .matches(/^\+?\d{10,15}$/, "members.errors.phoneInvalid"),

  email: yup
    .string()
    .trim()
    .required("members.errors.emailRequired")
    .email("members.errors.invalidEmail"),

  join_date: yup.string().trim().required("members.errors.joinDateRequired"),

  photo_url: yup
    .string()
    .trim()
    .url("members.errors.photoInvalid")
    .notRequired(),

  // =====================================================================
  // SUBSCRIPTION (معلّق لحد ما الليدر يأكد)
  // لو الفورم بيضيف اشتراك مع العضو، شيل التعليق عن الأسطر دي
  // =====================================================================
  // planId: yup
  //   .number()
  //   .typeError("members.errors.planRequired")
  //   .required("members.errors.planRequired"),
  // =====================================================================
});
