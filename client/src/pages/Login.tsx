import ToastContent from "@/components/toastcontent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import type { LoginFormType, User } from "@/lib/types-index";
import { Loader2, LogIn } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice";
import OAuth from "@/components/oauth";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Login = () => {
  useGSAP(() => {
    const tl = gsap.timeline({ duration: 0.5, ease: "power1.out" });

    tl.fromTo(".form-card", { y: 20, opacity: 0 }, { y: 0, opacity: 1 });

    tl.fromTo(".graphic", { y: 20, opacity: 0 }, { y: 0, opacity: 1 });
  }, []);

  const dispatch = useDispatch();

  const signIn = useSignIn();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormType>({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (!formData.email.trim() || !formData.password.trim()) {
        toast(<ToastContent icon="error" message="All fields are required!" />);
        setSubmitting(false);
        return;
      }

      dispatch(loginStart());
      const res = await api.post(
        "/auth/login",
        formData
      );

      if (res.status === 200 && res.data.access_token) {
        const data = res.data;

        const success = signIn({
          auth: {
            token: data.access_token,
            type: "Bearer",
          },
        });

        if (success) {
          // ✅ Decode token & save user in Redux
          const decodedUser: User = jwtDecode(data.access_token);
          const user: User = {
            _id: decodedUser._id,
            email: decodedUser.email,
            firstName: decodedUser.firstName,
            lastName: decodedUser.lastName,
            createdAt: decodedUser.createdAt,
            updatedAt: decodedUser.updatedAt,
            __v: decodedUser.__v,
            iat: decodedUser.iat,
            exp: decodedUser.exp,
            // add other properties if your User type requires them
          };
          dispatch(loginSuccess(user));

          toast(
            <ToastContent icon="success" message="Logged in successfully!" />
          );
          navigate("/dashboard");
        }
      }
      setSubmitting(false);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      dispatch(loginFailure(msg));
      toast(<ToastContent icon="error" message={msg} />);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] w-full flex items-center px-4 py-10 lg:min-h-0 lg:flex-grow">
      <section
        className="w-full max-w-6xl flex flex-col items-center justify-center gap-10 mx-auto
      lg:flex-row-reverse"
      >
        <Card className="form-card w-full max-w-sm">
          <CardHeader className="!min-w-fit">
            <CardTitle className="text-2xl">
              <h1>Hello, there.</h1>
              <h1>Welcome back!</h1>
            </CardTitle>
            <hr className="my-2" />
            <div className="flex justify-between items-center mb-[-0.5rem]">
              <h1 className="font-semibold text-xl">Login</h1>
              <Link to="/signup">
                <Button variant={"link"}>Sign Up</Button>
              </Link>
            </div>
          </CardHeader>
          <form onSubmit={handleLogin} className="space-y-5">
            <CardContent className="grid grid-cols-1 gap-5">
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>
            </CardContent>
            <CardAction className="w-full px-5 grid gap-4">
              <Button className="w-full" disabled={submitting} type="submit">
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Logging in...
                  </>
                ) : (
                  <>
                    <LogIn />
                    Login
                  </>
                )}
              </Button>
              <hr />
              <OAuth />
            </CardAction>
          </form>
        </Card>
        <div className="graphic relative w-full max-w-[480px] xl:max-w-[580px]">
          <img
            src="/login.webp"
            className="relative w-full"
            alt="login-graphic"
          />
        </div>
      </section>
    </div>
  );
};

export default Login;
