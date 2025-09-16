import { Button } from "./ui/button";
import { ChevronRight, LogOut } from "lucide-react";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../redux/user/userSlice";
import { resetState } from "@/redux/resetActions";
import { persistor } from "@/redux/store";

const Logout = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    signOut();
    dispatch(logoutAction());
    dispatch(resetState());
    await persistor.purge();
    navigate("/login");
  };
  return (
    <Button
      variant={"ghost"}
      className="w-full text-destructive bg-none border-destructive hover:!bg-destructive/10 hover:text-destructive hover:border-2
                flex justify-between items-center"
      onClick={handleLogout}
    >
      <LogOut />
      <span>Logout</span>
      <ChevronRight />
    </Button>
  );
};

export default Logout;
