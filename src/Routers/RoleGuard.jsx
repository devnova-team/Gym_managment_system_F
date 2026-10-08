import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthProvider";

const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);

  if (!allowedRoles) {
    return children;
  }

  const userRole = user?.role?.toLowerCase();
  const normalizedAllowed = allowedRoles.map((role) => role.toLowerCase());

  if (!normalizedAllowed.includes(userRole)) {
    return <Navigate to="/Unauthorized" replace />;
  }

  return children;
};

export default RoleGuard;