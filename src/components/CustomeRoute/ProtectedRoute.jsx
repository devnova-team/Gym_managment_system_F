import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext/AuthProvider";

const ProtectedRoute = ({ allowedRoles, isAuthenticated: propIsAuthenticated, children }) => {
  const { isAuthenticated: contextIsAuthenticated, user } = useContext(AuthContext);

  // استخدم الـ prop لو موجودة، وإلا خدها من الـ Context
  const isAuthenticated = propIsAuthenticated ?? contextIsAuthenticated;

  // 1. لو المستخدم مش مسجّل، نحوله للـ login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. لو فيه محددات صلاحيات، نتأكد إن الدور مسموح
  if (allowedRoles) {
    const userRole = user?.role?.toLowerCase();
    const normalizedAllowed = allowedRoles.map((role) => role.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return <Navigate to="/Unauthorized" replace />;
    }
  }

  // 3. لو فيه children، اعرضها. لو لأ، اعرض Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
// const ProtectedRoute = ({ isAuthenticated, children }) => {
//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }
//     return children;
// };
