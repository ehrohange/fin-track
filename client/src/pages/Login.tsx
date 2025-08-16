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
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-68px)] w-full flex items-center px-4 py-10 lg:min-h-0 lg:flex-grow">
      <section className="w-full max-w-6xl flex flex-col items-center justify-center gap-10 mx-auto
      lg:flex-row-reverse">
        <Card className="w-full max-w-sm">
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
          <CardContent className="grid grid-cols-1 gap-5">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="Password" />
            </div>
          </CardContent>
          <CardAction className="w-full px-5 flex justify-end">
            <Button className="w-full max-w-1/2">Login</Button>
          </CardAction>
        </Card>
        <div className="relative w-full max-w-[480px] xl:max-w-[580px]">
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
