import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { SidebarProvider } from "./components/ui/sidebar";
import AppSideBar from "./components/app-sidebar";
import Footer from "./components/footer";
import { Toaster } from "sonner";
import PrivateRoutes from "./routes/PrivateRoutes";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { useEffect } from "react";
import { logout } from "./redux/user/userSlice";
import { resetState } from "./redux/resetActions";
import HomeAndLoginRoutes from "./routes/HomeAndLoginRoutes";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";

interface JwtPayload {
  exp?: number;
}

function App() {
  const dispatch = useDispatch();
  const currentUser: JwtPayload | null = useSelector(
    (state: RootState) => state.user.currentUser
  );

  useEffect(() => {
    if (currentUser?.exp) {
      try {
        const isExpired = currentUser.exp * 1000 < Date.now();
        if (isExpired) {
          dispatch(logout()); // ✅ clears redux + persist
          dispatch(resetState());
        }
      } catch {
        dispatch(logout());
        dispatch(resetState());
      }
    }
  }, [dispatch, currentUser]);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative w-full flex flex-col overflow-hidden">
        <Toaster position="bottom-center" theme="light" />
        {/* Background for extra-large screens */}
        <img
          src="/bg.webp"
          className="hidden 2xl:block fixed top-0 left-0 w-full z-[-1] object-contain opacity-30"
        />
        <AppSideBar />
        <Navbar />
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/goals" element={<Goals />} />
          </Route>
          <Route element={<HomeAndLoginRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

export default App;
