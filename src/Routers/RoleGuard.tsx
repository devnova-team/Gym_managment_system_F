'use client';

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../AuthContext/AuthProvider";

const RoleGuard = ({ allowedRoles = ["owner"], children }) => {
  const { user, isReady } = useContext(AuthContext);
  const router = useRouter();
  const userRole = user?.role?.toLowerCase();
  const isAllowed = allowedRoles.some((role) => role.toLowerCase() === userRole);

  useEffect(() => {
    if (isReady && !isAllowed) router.replace("/unauthorized");
  }, [isAllowed, isReady, router]);

  return isReady && isAllowed ? children : null;
};

export default RoleGuard;