import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const init = async () => {
    // Nếu có accessToken nhưng chưa có user, hoặc có accessToken nhưng đã hết hạn, thì cần fetch lại thông tin người dùng hoặc refresh token
    if (!accessToken) {
      await refresh();
    }
    if (accessToken && !user) {
      await fetchMe();
    }
    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (starting ||loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }



  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
