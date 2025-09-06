import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { NavigationMenuContent } from "@radix-ui/react-navigation-menu";
import { LogIn, PlusCircle } from "lucide-react";
import UpdateProfile from "./update-profile";
import UpdatePassword from "./update-password";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Logout from "./logout";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const pathLastPart = path.substring(path.lastIndexOf("/") + 1);
  const currentUser = useSelector(
    (state: RootState) => state.persistedReducer.user.currentUser
  );
  console.log(currentUser?.profilePicture);
  return (
    <NavigationMenu className="w-full block max-w-none" viewport={false}>
      <NavigationMenuList className="flex mx-auto items-center justify-between w-full max-w-6xl py-4 px-4">
        <SidebarTrigger className="md:hidden" />
        <NavigationMenuItem className="flex items-center justify-center flex-1 md:flex-none">
          <NavigationMenuLink className="ml-[-20px] md:ml-0" asChild>
            <Link to="/" className="w-fit gap-2 flex flex-row items-center">
              <span className="logo !bg-accent"></span>
              <h1 className="text-xl font-doto uppercase text-white font-bold">
                FinTrack
              </h1>
              <span className="logo rotate-180 ml-[-2px] !bg-accent"></span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuList className="md:flex items-center space-x-4 hidden">
          {currentUser ? (
            <>
              {pathLastPart !== "budget" && (
                <NavigationMenuItem>
                  <Link to={"/budget"}>
                    <Button>
                      <PlusCircle />
                      <span>Add Budget</span>
                    </Button>
                  </Link>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="relative">
                <NavigationMenuTrigger className="flex flex-row items-center gap-2 w-[200px]">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={
                        currentUser?.profilePicture ??
                        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
                      }
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0 pr-4 min-w-0 mt-[-2px] overflow-clip">
                    <h1 className="font-medium text-sm truncate">
                      {currentUser?.fullName ?? ""}
                    </h1>
                    <p className="text-secondary truncate text-xs">
                      {currentUser?.email ?? ""}
                    </p>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50 absolute top-full right-0 mt-2 w-[200px] rounded-md bg-popover shadow-lg p-2">
                  <ul className="grid gap-2">
                    <li>
                      <UpdateProfile />
                    </li>
                    <li>
                      <UpdatePassword />
                    </li>
                    <li>
                      <Logout />
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <Link to="/login">
                <Button className="text-white" variant={"default"}>
                  <LogIn />
                  <span>Login</span>
                </Button>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
