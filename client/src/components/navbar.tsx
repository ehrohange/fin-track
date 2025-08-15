import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  return (
    <div className="w-full">
      <nav className="bg-background text-foreground flex mx-auto items-center justify-between w-full max-w-6xl py-4 px-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex items-center justify-center flex-1 md:flex-none">
          <Link
            to="/"
            className="w-fit gap-1"
          >
            <Button variant={"ghost"} className="ml-[-20px] md:ml-0">
              <span className="logo !bg-accent"></span>
              <h1 className="text-xl font-doto uppercase text-white font-bold">
                FinTrack
              </h1>
              <span className="logo rotate-180 ml-[-2px] !bg-accent"></span>
            </Button>
          </Link>
        </div>
        <ul className="md:flex items-center space-x-4 hidden">
          <li>
            <Link to="/dashboard">
              <Button className="text-white" variant={"ghost"}>
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <Button className="text-white" variant={"ghost"}>
                Profile
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/login">
              <Button className="text-white" variant={"default"}>
                Login
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
