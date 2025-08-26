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
import type { SignUpFormType, User } from "@/lib/types-index";
import { Loader2, LogIn } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { toast } from "sonner";
import ToastContent from "@/components/toastcontent";
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

const SignUp = () => {
  useGSAP(() => {
    const tl = gsap.timeline({ duration: 0.5, ease: "power1.out" });

    tl.fromTo(".form-card", { y: 20, opacity: 0 }, { y: 0, opacity: 1 });

    tl.fromTo(".graphic", { y: 20, opacity: 0 }, { y: 0, opacity: 1 });
  }, []);

  const signIn = useSignIn();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignUpFormType>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // ✅ Basic validations
      if (
        !formData.email.trim() ||
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.password.trim()
      ) {
        toast(<ToastContent icon="error" message="All fields are required!" />);
        setSubmitting(false);
        return;
      }
      if (formData.password !== confirmPassword) {
        toast(<ToastContent icon="error" message="Passwords do not match!" />);
        setSubmitting(false);
        return;
      }

      // ✅ Register new user
      const res = await api.post("/api/users", formData);

      if (res.status === 201) {
        toast(
          <ToastContent icon="success" message="Signed up successfully!" />
        );

        // ✅ Auto-login immediately after signup
        dispatch(loginStart());
        const loginRes = await api.post(
          "/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (loginRes.status === 200) {
          const data = loginRes.data;

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

        // ✅ Reset form
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
        });
        setConfirmPassword("");
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
  // JSX
  return (
    <div className="min-h-[calc(100vh-68px)] w-full flex items-center px-4 py-10">
      <section
        className="w-full max-w-6xl flex flex-col items-center justify-center gap-10 mx-auto
      lg:flex-row-reverse"
      >
        <Card className="form-card w-full max-w-sm">
          <CardHeader className="!min-w-fit">
            <CardTitle className="text-2xl">
              <h1>Hi, there.</h1>
              <h1>Welcome to FinTrack!</h1>
            </CardTitle>
            <hr className="my-2" />
            <div className="flex justify-between items-center mb-[-0.5rem]">
              <h1 className="font-semibold text-xl">Sign Up</h1>
              <Link to="/login">
                <Button variant={"link"}>Login</Button>
              </Link>
            </div>
          </CardHeader>
          <form className="space-y-5" onSubmit={handleSignUp}>
            <CardContent className="grid grid-cols-1 gap-5">
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
            </CardContent>
            <CardAction className="w-full px-5 space-y-5">
              <Button className="w-full" disabled={submitting} type="submit">
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Signing up...
                  </>
                ) : (
                  <>
                    <LogIn />
                    Sign up
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
            src="/signup.webp"
            className="relative w-full"
            alt="signup-graphic"
          />
        </div>
      </section>
    </div>
  );
};

export default SignUp;
