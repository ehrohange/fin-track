import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  ChartSpline,
  ChevronRight,
  LogIn,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const AppSideBar = () => {
  return (
    <Sidebar className="md:hidden">
      <SidebarHeader>
        <SidebarGroup>
          <header className="w-full flex items-center justify-between">
            <h1 className="text-xl font-doto uppercase text-white font-bold">
              FinTrack
            </h1>
            <SidebarTrigger />
          </header>
        </SidebarGroup>
        <SidebarGroup className="hover:bg-primary/10 rounded-sm pt-0">
          <SidebarGroupLabel className="p-0 mb-2">User</SidebarGroupLabel>
          <SidebarGroupContent>
            <Link to={"/profile"} className="flex items-start gap-2">
              <Avatar className="size-10">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0 pr-4 min-w-0 mt-[-4px]">
                <h1 className="font-medium truncate">
                  Jorge Angelo M. Pangilinan
                </h1>
                <p className="text-secondary truncate text-xs">
                  jorgeangelopangilinan@gmail.com
                </p>
                <div className="w-full flex items-center justify-between text-secondary mt-2">
                  <span className="text-xs">Edit Profile</span>
                  <ChevronRight className="size-4" />
                </div>
              </div>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-[-10px] p-0">
          <SidebarGroupLabel className="mb-2">User</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-4 px-2">
            <Link to={"/budget"}>
              <Button className="w-full flex items-center justify-center">
                <LogIn />
                <span>Login</span>
              </Button>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <hr />
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mt-[-10px]">
          <SidebarGroupLabel className="mb-2">Application</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-4 px-2">
            <Link to={"/budget"}>
              <Button className="w-full flex items-center justify-center">
                <PlusCircle />
                <span>Add Budget</span>
              </Button>
            </Link>
            <Link to={"/dashboard"}>
              <Button
                className="w-full flex items-center justify-between"
                variant={"ghost"}
              >
                <ChartSpline />
                <span>Dashboard</span>
                <ChevronRight />
              </Button>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant={"ghost"}
          className="text-destructive bg-none border-destructive hover:!bg-destructive/10 hover:text-destructive hover:border-2
          flex items-center justify-between"
        >
          <LogOut />
          <span>Logout</span>
          <ChevronRight />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
