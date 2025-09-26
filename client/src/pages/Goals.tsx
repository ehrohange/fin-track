import AddSavingGoal from "@/components/add-saving-goal";
import SavingGoal from "@/components/saving-goal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { RootState } from "@/redux/store";
import { GoalIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Goals = () => {
  const formatCompactPeso = (num: number) => {
    if (num === null || num === undefined) return "";

    const abs = Math.abs(num);
    let formatted = "";

    if (abs >= 1_000_000_000_000) {
      formatted =
        (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
    } else if (abs >= 1_000_000_000) {
      formatted = (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (abs >= 1_000_000) {
      formatted = (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (abs >= 1_000) {
      formatted = (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      formatted = num.toString();
    }

    return `₱${formatted}`;
  };
  const currentGoals = useSelector((state: RootState) => state.goals.goals);
  const activeGoals = currentGoals
    .filter((goal) => goal.active === true)
    .reverse();
  const inactiveGoals = currentGoals
    .filter((goal) => goal.active === false)
    .reverse();

  return (
    <section className="relative w-full h-full flex flex-col items-center justify-baseline p-4 animate-in fade-in animation-duration-[1s]">
      <div className="absolute w-full h-full flex items-center justify-center top-0 left-0 z-[-1]">
        <GoalIcon className="size-96 rotate-[-35deg] opacity-5" />
      </div>
      <div className="w-full max-w-6xl">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  className="text-white/85 hover:underline hover:underline-offset-2 duration-200"
                  to={"/"}
                >
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Saving Goals</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="w-full grid gap-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4">
            <AddSavingGoal />
            {activeGoals.length > 0 &&
              activeGoals.map((item) => (
                <SavingGoal goal={item} formatCompactPeso={formatCompactPeso} />
              ))}
            {inactiveGoals.length > 0 &&
              inactiveGoals.map((item) => (
                <SavingGoal goal={item} formatCompactPeso={formatCompactPeso} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Goals;
