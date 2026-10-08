import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input, PasswordInput } from "@mantine/core";
import { FiActivity, FiMail, FiLock } from "react-icons/fi";

import { useLoginMutation } from "../../Service/Apis/authApi";
import { AuthContext } from "../../AuthContext/AuthProvider";

function checkForm(identifier, password) {
  let errors = {};

  const cleanIdentirier = identifier.trim();

  if (cleanIdentirier === "") {
    errors.identifier = "auth.errors.identifierRequired";
  } else {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanIdentirier);
    const isPhone = /^\+?\d{10,15}$/.test(cleanIdentirier);

    if (!isEmail && !isPhone) {
      errors.identifier = "auth.errors.identifierInvalid";
    }
  }

  if (password === "") {
    errors.password = "auth.errors.passwordRequired";
  } else if (password.length < 8) {
    errors.password = "auth.errors.passwordShort";
  }

  return errors;
}

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loginApi, { isLoading }] = useLoginMutation();

  const [identifier, setIdentifier] = useState("owner@fitpulse.com");
  const [password, setPassword] = useState("password123");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  //   // ============================================================
  //   // PRODUCTION MODE - فعّل البلوك ده لما الباك إند يشتغل
  //   // ============================================================

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrors({});
  //   setServerError("");

  //   const validationErrors = checkForm(identifier, password);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   // ============================================================

  //   try {
  //     const response = await loginApi({ identifier, password }).unwrap();
  //     const ok = login(response);
  //     if (ok) {
  //       navigate("/dashboard");
  //     } else {
  //       setServerError("auth.errors.serverError");
  //     }
  //   } catch (err) {
  //     if (err?.status === 401) {
  //       setServerError("auth.errors.invalidCredentials");
  //     } else if (err?.status) {
  //       setServerError("auth.errors.serverError");
  //     } else {
  //       setServerError("auth.errors.networkError");
  //     }
  //   }
  //   // ============================================================
  // };

  // ============================================================
  // NEW LOGIC - Demo Authentication (Email + Password Only)
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const validationErrors = checkForm(identifier, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const isOwner = identifier.trim().toLowerCase().includes("owner");

      const demoResponse = {
        data: {
          user: {
            id: isOwner ? 1 : 2,
            name: isOwner ? "Captain Ahmed" : "Sarah Receptionist",
            email: identifier.trim(),
            role: isOwner ? "owner" : "receptionist",
            gym_id: "gym-001",
          },
          access_token: "demo-jwt-token-" + Date.now(), // 👈 الاسم الصح
        },
      };

      const ok = login(demoResponse);

      if (ok) {
        navigate("/dashboard");
      } else {
        setServerError("auth.errors.serverError");
      }
    } catch (err) {
      setServerError("auth.errors.serverError");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0c101d]">
      <div className="w-full max-w-md bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 shadow-smoothCard">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-[#85F40F]/15 text-[#85F40F] mb-3 shadow-[0_0_15px_rgba(133,244,15,0.2)]">
            <FiActivity size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            {t("auth.loginTitle", "Welcome Back")}
          </h2>
          <p className="text-xs text-textColor dark:text-slate-400 mt-1">
            {t(
              "auth.loginSubtitle",
              "Sign in to your Gym Management Dashboard",
            )}
          </p>
        </div>

        {/* UnComment when the server start */}
        {/* {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900/60">
            {t(serverError)}
          </div>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t("auth.identifier", "Email or Phone Number")}
            </label>
            <Input
              // dir="auto"
              leftSection={<FiMail size={16} className="text-textColor" />}
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrors({});
                setServerError("");
              }}
              placeholder="owner@fitpulse.com"
              classNames={{
                input:
                  "rounded-xl! dark:bg-[#0c101d]! dark:text-white! dark:border-slate-800! focus:border-[#85F40F]!",
              }}
            />
            {errors.identifier && (
              <p className="text-red-500">{t(errors.identifier)}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t("auth.password", "Password")}
            </label>
            <PasswordInput
              // dir="auto"
              leftSection={<FiLock size={16} className="text-textColor" />}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({});
                setServerError("");
              }}
              placeholder="Enter password"
              classNames={{
                input:
                  "rounded-xl! dark:bg-[#0c101d]! dark:text-white! dark:border-slate-800! focus:border-[#85F40F]!",
              }}
            />
            {errors.password && (
              <p className="text-red-500">{t(errors.password)}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl font-black text-sm bg-linear-to-r from-[#85F40F] to-[#6CC80A] hover:from-[#95E913] hover:to-[#79BE0D] text-brand-950 transition-all duration-200 shadow-[0_0_20px_rgba(133,244,15,0.35)] cursor-pointer flex items-center justify-center mt-3 disabled:opacity-50"
          >
            {isLoading
              ? t("auth.loggingIn", "Signing in...")
              : t("auth.signInBtn", "Sign In")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
