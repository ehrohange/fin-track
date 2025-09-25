import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <div className="w-full bg-card border-t-2 px-4">
      <div className="max-w-6xl flex items-center justify-between mx-auto min-h-44">
        <Link to="/" className="w-fit gap-1">
          <Button variant={"ghost"} className="ml-[-20px] md:ml-0">
            <span className="logo !bg-accent"></span>
            <h1 className="text-xl font-doto uppercase text-white font-bold">
              FinTrack
            </h1>
            <span className="logo rotate-180 ml-[-2px] !bg-accent"></span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
