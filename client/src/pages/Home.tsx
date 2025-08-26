import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HomeFeatureCardProps } from "@/lib/types-index";
import { ArrowRightIcon, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, TextPlugin } from "gsap/all";
import gsap from "gsap";

const homeFeatureCards: HomeFeatureCardProps[] = [
  {
    title: "Effortless Expense Tracking",
    desc: "Log your daily expenses in seconds and see exactly where your money goes.",
    imgsrc: "/expense-tracking.webp",
  },
  {
    title: "Smart Budget Planning",
    desc: "Set monthly budgets and track your progress to stay on top of your financial goals.",
    imgsrc: "/budget-planning.webp",
  },
  {
    title: "Insightful Reports",
    desc: "Visualize your spending patterns with easy-to-read charts and reports.",
    imgsrc: "/reports.webp",
  },
];

gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin);

const Home = () => {
  // const timeline = gsap.timelin(
  //   {
  //     repeat: 0
  //   }
  // )

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#landing", // 👈 container of your hero section
        start: "top 80%", // when the top of #hero hits 80% of viewport
        toggleActions: "restart none none reset",
      },
    });

    tl.fromTo(
      ".header",
      { opacity: 0, y: 50, color: "#009F00" },
      { opacity: 1, y: 0, stagger: 0.3, color: "#FFFFFF", duration: 0.5 }
    );
    tl.fromTo(
      "#subheader",
      { opacity: 0, y: 50, color: "#000000" },
      { opacity: 1, y: 0, color: "#FAFAFA", duration: 0.5 }
    );
    tl.fromTo(
      "#getStarted",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, ease: "power1.out", duration: 0.5 }
    );
    tl.fromTo("#hero-pic", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.5 });
    tl.to("#getStarted", 
      {repeat: -1, y: 10, yoyo: true, duration: 0.5, ease: "back.inOut"}
    );

    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 50 },
      {
        delay: 0.5,
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#features",
          start: "top 80%", // when features section hits 80% of viewport
          toggleActions: "play none none reverse", // play on enter, reverse on leave
        },
      }
    );
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section
        id="landing"
        className="w-full flex flex-col min-h-[calc(100vh-68px)] py-10 lg:min-h-0 lg:py-26 gap-10 items-center justify-center
        lg:flex-row lg:justify-between xl:gap-0"
      >
        <div className="flex flex-col items-center gap-2 lg:items-start">
          <div className="flex items-center justify-center text-center flex-col gap-0 uppercase text-4xl md:text-5xl font-bold lg:text-left lg:items-start xl:text-6xl ">
            <h1 className="header font-doto">Take Control of</h1>
            <h1 className="header font-doto">Your Finances</h1>
            <h1 className="header font-doto">with FinTrack</h1>
          </div>
          <h3
            id="subheader"
            className="text-center text-secondary max-w-[330px] md:text-lg md:max-w-[420px] lg:text-left"
          >
            Stay on top of your income, expenses, and savings with powerful
            insights—so you can focus on building the future you want.
          </h3>
          <Link to={"/login"} className="mt-4">
            <Button id="getStarted" className="lg:text-2xl lg:py-6 lg:!px-10">
              Get Started
              <ArrowRightIcon className="size-4 lg:size-6" />
            </Button>
          </Link>
        </div>
        <div className="relative w-full max-w-[480px] xl:max-w-[580px]">
          <img
            id="hero-pic"
            src="/fintrack.webp"
            className="relative w-full"
            alt="hero-graphic"
          />
        </div>
      </section>
      {/* Features Section */}
      <section
        id="features"
        className="w-full py-10 lg:py-26 flex flex-col gap-10 items-center justify-center"
      >
        <div className="text-center w-full lg:text-left">
          <h1 className="text-2xl md:text-4xl font-doto uppercase font-bold">
            Discover What FinTrack Can Do for You
          </h1>
          <h3 className="text-secondary md:text-lg">
            Powerful tools and insights to make managing your money simple and
            stress-free.
          </h3>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
          {homeFeatureCards.map((item, index) => (
            <Link to="/login" key={index} className="h-full feature-card">
              <Card className="group space-y-[-1rem] !p-0 overflow-clip h-full flex flex-col hover:translate-y-[-10px] duration-300 ease-in-out">
                <CardHeader className="flex justify-between gap-2 pt-6">
                  <CardTitle className="text-2xl md:text-3xl xl:text-4xl mb-4">
                    {item.title}
                  </CardTitle>
                  <ArrowUpRight className="w-10 h-10 flex-shrink-0 group-hover:text-accent" />
                </CardHeader>
                <CardDescription className="px-6 mb-6 md:text-lg">
                  {item.desc}
                </CardDescription>

                {/* This will stick the image to the bottom of the card */}
                <CardContent className="!px-0 mt-auto">
                  <img
                    className="relative w-full h-auto"
                    src={item.imgsrc}
                    alt={item.title}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
