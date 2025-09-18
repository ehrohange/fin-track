// src/routes/HideLoginAndHomeRoutes.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { resetState } from "@/redux/resetActions";
import { persistor } from "@/redux/store";

const HomeAndLoginRoutes = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // ✅ If no user, allow access (show login/home)
  if (!currentUser) {
    return <Outlet />;
  }

  // ✅ If token expired, reset everything and allow login/home
  if (currentUser.exp && Date.now() >= currentUser.exp * 1000) {
    dispatch(resetState());
    persistor.purge();
    return <Outlet />;
  }

  // ✅ If logged in and token valid, redirect away from login/home
  return <Navigate to="/dashboard" replace />;
};

export default HomeAndLoginRoutes;
