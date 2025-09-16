// src/routes/PrivateRoutes.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { resetState } from "@/redux/resetActions";
import { persistor } from "@/redux/store";

const PrivateRoutes = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Check token expiry using `exp` (if provided by backend)
  if (currentUser.exp && Date.now() >= currentUser.exp * 1000) {
    dispatch(resetState());
    persistor.purge();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
