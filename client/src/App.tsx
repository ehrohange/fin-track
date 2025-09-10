import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { SidebarProvider } from "./components/ui/sidebar";
import AppSideBar from "./components/app-sidebar";
import Footer from "./components/footer";
import { Toaster } from "sonner";
import Budget from "./pages/Budget";

function App() {
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
          <Route path="/budget" element={<Budget />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

export default App;
