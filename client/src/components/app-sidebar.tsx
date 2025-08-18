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
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import UpdateProfile from "./update-profile";
import UpdatePassword from "./update-password";

const AppSideBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(true);

  return (
    <Sidebar className="md:hidden">
      <SidebarHeader>
        <SidebarGroup>
          <header className="w-full flex items-center justify-between">
            <Link to={"/"}>
              <h1 className="text-xl font-doto uppercase text-white font-bold">
                FinTrack
              </h1>
            </Link>
            <SidebarTrigger />
          </header>
        </SidebarGroup>
        {isLoggedIn ? (
          <>
            <SidebarGroup className="pt-0">
              <SidebarGroupLabel className="p-0 mb-2">User</SidebarGroupLabel>
              <SidebarGroupContent>
                <Accordion
                  type="single"
                  collapsible
                  content="w-full"
                  className="my-[-20px]"
                >
                  <AccordionItem value="profile">
                    <AccordionTrigger className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-10">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0 pr-4 w-[180px] mt-[-4px]">
                          <h1 className="font-medium truncate">
                            Jorge Angelo M. Pangilinan
                          </h1>
                          <p className="text-secondary truncate text-xs">
                            jorgeangelopangilinan@gmail.com
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-1 space-y-3">
                      <UpdateProfile />
                      <UpdatePassword />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <hr />
            </SidebarGroup>
          </>
        ) : (
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
        )}
      </SidebarHeader>
      {isLoggedIn && (
        <>
          <SidebarContent>
            <SidebarGroup className="mt-[-10px]">
              <SidebarGroupLabel className="mb-2">
                Application
              </SidebarGroupLabel>
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
        </>
      )}
    </Sidebar>
  );
};

export default AppSideBar;
