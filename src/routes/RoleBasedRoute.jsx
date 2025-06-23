import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useAuth();

  console.log("RoleBasedRoute: token =", token);
  console.log("RoleBasedRoute: role =", role);
  console.log("RoleBasedRoute: allowedRoles =", allowedRoles);

  if (!token) return <Navigate to="/login" />;

  if (role === null) return <div>Loading...</div>;  // role henüz yüklenmedi, bekle

  if (!allowedRoles.includes(role.trim().toUpperCase())) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};


export default RoleBasedRoute;
