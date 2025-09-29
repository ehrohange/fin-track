import { app } from "@/firebase";
import { Button } from "./ui/button";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import api from "@/lib/axios";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { jwtDecode } from "jwt-decode";
import type { User } from "@/lib/types-index";
import { toast } from "sonner";
import ToastContent from "@/components/toastcontent";
import { setCategories } from "@/redux/categories/categoriesSlice";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signIn = useSignIn();
      const [processing, setProcessing] = useState<boolean>(false);

  const handleGoogleLogin = async () => {
    try {
      setProcessing(true);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      const payload = {
        email: firebaseUser.email,
        fullName: firebaseUser.displayName || "",
        profilePicture: firebaseUser.photoURL,
      };

      dispatch(loginStart());
      const res = await api.post("/auth/google", payload);

      if (res.status === 200 && res.data.access_token) {
        const data = res.data;

        const success = signIn({
          auth: {
            token: data.access_token,
            type: "Bearer",
          },
        });

        if (success) {
          const decodedUser: User = jwtDecode(data.access_token);
          

          const res = await api.get(`/finance/categories`);
          dispatch(setCategories(res.data.categories));

          dispatch(loginSuccess(decodedUser));

          toast(
            <ToastContent icon="success" message="Logged in with Google!" />
          );
          setProcessing(false);
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      if (error.response.status === 429) {
        toast(
          <ToastContent
            icon="error"
            message="Too many requests! Please try again later."
          />
        );
      } else {
        toast(
          <ToastContent
            icon="error"
            message="There was an error creating goal. Please try again."
          />
        );
      }
      dispatch(loginFailure(error.message));
      setProcessing(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full"
      variant="outline"
      disabled={processing}
    >
      {
        !processing ? "Continue with Google" : (<>
        <Loader2 className="animate-spin" /> Logging you in...
        </>)
      }
    </Button>
  );
};

export default OAuth;
