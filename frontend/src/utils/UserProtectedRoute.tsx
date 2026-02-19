import { Navigate, Outlet } from "react-router";
import { userInfoStore } from "../zustand/userInfoStore";

type Props = {
  type: "auth" | "protected";
};

function UserProtectedRoute({ type }: Props) {
  const { email, token } = userInfoStore();
  const isLoggedIn = Boolean(email && token);

  if (type === "auth") {
    return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default UserProtectedRoute;
