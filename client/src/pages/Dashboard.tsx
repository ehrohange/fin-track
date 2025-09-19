import ToastContent from "@/components/toastcontent";
import {
  CardTitle,
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import api from "@/lib/axios";
import type { Transaction } from "@/lib/types-index";
import { type AppDispatch, type RootState } from "@/redux/store";
import {
  ArrowRight,
  Banknote,
  BanknoteArrowDown,
  BanknoteX,
  ChartColumn,
  Eye,
  GoalIcon,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  setGoals,
  setLoading as setGoalsLoading,
  setError as setGoalsError,
} from "../redux/goal/goalsSlice";
import AddSavingGoal from "@/components/add-saving-goal";
import TransactionTable from "@/components/transaction-table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SavingGoal from "@/components/saving-goal";

const Dashboard = () => {
  const [total, setTotal] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const date = new Date();

  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day} ${year}`; // e.g. "Aug 25 2025"
  };

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();

  const currentGoals = useSelector((state: RootState) => state.goals.goals);
  const activeGoals = currentGoals.filter((goal) => goal.active === true);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!currentUser?._id) return;
      try {
        dispatch(setGoalsLoading(true));
        const res = await api.get(`/finance/goals/${currentUser._id}`);
        // store goals directly in Redux
        dispatch(setGoals(res.data.goals));
      } catch (err) {
        dispatch(setGoalsError("Failed to fetch goals"));
      } finally {
        dispatch(setGoalsLoading(false));
      }
    };

    fetchGoals();
  }, [currentUser?._id, dispatch]);

  // Always read from Redux
  const savingGoals = [...currentGoals].reverse();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser?._id) return;
      try {
        const res = await api.get(`/finance/transactions/${currentUser._id}`);

        const sorted = res.data.transactions.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(sorted);
      } catch (error) {
        toast(
          <ToastContent icon="error" message="Failed to fetch transactions." />
        );
      }
    };

    fetchTransactions();
  }, [currentUser?._id]);

  useEffect(() => {
    let income = 0;
    let expense = 0;
    let savings = 0;

    transactions.forEach((t) => {
      if (t.categoryId.type === "income") income += t.amount;
      if (t.categoryId.type === "expense") expense += t.amount;
      if (t.categoryId.type === "savings") savings += t.amount;
    });
    setTotal(income - (expense + savings));
    setTotalIncome(income);
    setTotalExpenses(expense);
  }, [transactions]);

  const toPeso = (num: number) => {
    return num.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    });
  };

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

  const firstName = currentUser?.fullName.split(" ")[0] || "User";
  return (
    <div className="w-full h-full flex flex-col items-center justify-baseline p-4">
      <section className="w-full grid gap-3 max-w-6xl">
        <h4 className="text-white/80">Hello, {firstName}. Welcome back!</h4>
        <h1 className="font-bold font-doto text-2xl sm:text-3xl mt-[-10px]">
          Dashboard Overview
        </h1>
        <Link to={"/transactions"} className=" md:hidden">
          <Button className="w-full">
            Go to Transactions <ArrowRight />
          </Button>
        </Link>
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4 relative overflow-clip group">
              <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <img src="/income.webp" className="h-fit" alt="" />
              </div>
              <CardTitle className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="font-regular text-sm">Your Total Balance</p>
                  <p className="font-light text-sm text-white/80">
                    As of {formatDate(date)}
                  </p>
                </div>
                <span className="w-12 aspect-square rounded-md bg-primary/40 flex items-center justify-center group-hover:bg-primary/70 duration-200">
                  <Banknote className="size-8" />
                </span>
              </CardTitle>
              <CardContent className="flex items-end justify-between text-2xl w-full p-0">
                <div className="flex flex-col">
                  <h1 className="font-semibold">{toPeso(total)}</h1>
                  <span className="flex items-center gap-1 font-light text-sm">
                    <TrendingUp className="size-5 text-primary/80" />
                    <p className="text-white/80">Up by 20%</p>
                  </span>
                </div>
                <ChartColumn className="size-12 text-white/95" />
              </CardContent>
            </Card>
            <Card className="p-4 relative overflow-clip group">
              <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <img src="/income.webp" className="h-fit" alt="" />
              </div>
              <CardTitle className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="font-regular text-sm">Your Total Income</p>
                  <p className="font-light text-sm text-white/80">
                    As of {formatDate(date)}
                  </p>
                </div>
                <span className="w-12 aspect-square rounded-md bg-primary/40 flex items-center justify-center group-hover:bg-primary/70 duration-200">
                  <BanknoteArrowDown className="size-8" />
                </span>
              </CardTitle>
              <CardContent className="flex items-end justify-between text-2xl w-full p-0">
                <div className="flex flex-col">
                  <h1 className="font-semibold">{toPeso(totalIncome)}</h1>
                  <span className="flex items-center gap-1 font-light text-sm">
                    <TrendingUp className="size-5 text-primary/80" />
                    <p className="text-white/80">Up by 20%</p>
                  </span>
                </div>
                <ChartColumn className="size-12 text-white/95" />
              </CardContent>
            </Card>
            <Card className="p-4 relative overflow-clip group">
              <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <img src="/expense.webp" className="h-fit" alt="" />
              </div>
              <CardTitle className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="font-regular text-sm">Your Total Expenses</p>
                  <p className="font-light text-sm text-white/80">
                    As of {formatDate(date)}
                  </p>
                </div>
                <span className="w-12 aspect-square rounded-md bg-destructive/50 flex items-center justify-center group-hover:bg-destructive/70 duration-200">
                  <BanknoteX className="size-8" />
                </span>
              </CardTitle>
              <CardContent className="flex items-end justify-between text-2xl w-full p-0">
                <div className="flex flex-col">
                  <h1 className="font-semibold">{toPeso(totalExpenses)}</h1>
                  <span className="flex items-center gap-1 font-light text-sm">
                    <TrendingUp className="size-5 text-primary/80" />
                    <p className="text-white/80">Up by 20%</p>
                  </span>
                </div>
                <ChartColumn className="size-12 text-white/95" />
              </CardContent>
            </Card>
          </div>
        </div>
        {/* SAVINGS */}
        <div className="w-full grid gap-3 mt-6">
          <hr />
          {activeGoals.length > 0 ? (
            <Carousel className="max-w-full overflow-hidden pt-2">
              <h1 className="font-bold font-doto text-2xl sm:text-3xl mb-1">
                <span className="font-bold font-doto text-2xl sm:text-3xl hidden sm:inline-block">Saving </span> Goals
              </h1>
              {
                activeGoals.length > 2 && 
              <AddSavingGoal small={true} /> 
              }
              <Link
                to={"/"}
                className="absolute top-2 sm:top-3 right-0 sm:right-[86px] "
              >
                <Card className="py-[5px] hover:bg-primary/25 hover:translate-y-[-2px] duration-200">
                  <CardContent className="px-3">
                    <div className="flex items-center gap-1">
                      <Eye className="size-4" />
                      <h1 className="text-sm">View all</h1>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <div className="absolute right-[52px] top-7 hidden sm:block">
                <CarouselPrevious className="cursor-pointer" />
                <CarouselNext className="cursor-pointer" />
              </div>
              <CarouselContent className="pt-2">
                {activeGoals.map((goal) => (
                  <CarouselItem
                    key={goal._id}
                    className="basis-7/8 sm:basis-2/3 lg:basis-1/3"
                  >
                    <SavingGoal key={goal._id} goal={goal} formatCompactPeso={formatCompactPeso} />
                  </CarouselItem>
                ))}
                <CarouselItem className="basis-7/8 sm:basis-2/3 lg:basis-1/3 pr-[1px] max-w-56">
                  <AddSavingGoal />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          ) : (
            <>
              <h1 className="font-bold font-doto text-3xl">Saving Goals</h1>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                <AddSavingGoal />
              </div>
            </>
          )}
        </div>
      </section>
      <TransactionTable
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </div>
  );
};

export default Dashboard;
