import ToastContent from "@/components/toastcontent";
import { CardTitle, Card, CardContent } from "@/components/ui/card";
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
import {
  setTransactions,
  setTransactionsLoading,
} from "@/redux/transaction/transactionsSlice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { groupTransactions } from "@/lib/group-transactions";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import MonthlyBudget from "@/components/monthly-budget";

const chartConfig = {
  income: {
    label: "Income",
    color: "#009F00",
  },
  savings: {
    label: "Savings",
    color: "#DADADA",
  },
  expense: {
    label: "Expenses",
    color: "#EC5E61",
  },
} satisfies ChartConfig;

const Dashboard = () => {
  const [total, setTotal] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const token = useAuthHeader();

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
  const loadingGoals = useSelector((state: RootState) => state.goals.loading);

  const activeGoals = currentGoals
    .filter((goal) => goal.active === true)
    .reverse();

  useEffect(() => {
    const fetchGoals = async () => {
      if (!currentUser?._id) return;
      try {
        dispatch(setGoalsLoading(true));
        const res = await api.get(`/finance/goals/${currentUser._id}`, {
          headers: {
            Authorization: token,
          },
        });
        // store goals directly in Redux
        dispatch(setGoals(res.data.goals));
      } catch (error: any) {
        if (error.response.status === 429) {
          toast(
            <ToastContent
              icon="error"
              message="Too many requests! Please try again later."
            />
          );
        } else {
          toast(
            <ToastContent
              icon="error"
              message="There was an error fetching your goals. Please try again."
            />
          );
        }
        dispatch(setGoalsError("Failed to fetch goals"));
      } finally {
        dispatch(setGoalsLoading(false));
      }
    };

    fetchGoals();
  }, [currentUser?._id, dispatch]);

  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const loadingTrans = useSelector(
    (state: RootState) => state.transactions.loading
  );

  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [period, setPeriod] = useState<string>("month");

  const filterTransactions = (period: string, transactions: Transaction[]) => {
    const now = new Date();

    return transactions.filter((t) => {
      const txDate = new Date(t.date); // parses "Sep 23 2025"

      if (isNaN(txDate.getTime())) {
        console.warn("Invalid date:", t.date);
        return false;
      }

      if (period === "month") {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === "year") {
        return txDate.getFullYear() === now.getFullYear();
      }

      // "all"
      return true;
    });
  };

  useEffect(() => {
    setFilteredTransactions(filterTransactions(period, transactions));
  }, [period, transactions]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser?._id) return;
      try {
        dispatch(setTransactionsLoading(true));
        const res = await api.get(`/finance/transactions/${currentUser._id}`, {
          headers: {
            Authorization: token,
          },
        });

        const sorted = res.data.transactions.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        dispatch(setTransactions(sorted));
      } catch (error: any) {
        if (error.response.status === 429) {
          toast(
            <ToastContent
              icon="error"
              message="Too many requests! Please try again later."
            />
          );
        } else {
          toast(
            <ToastContent
              icon="error"
              message="There was an error fetching your transactions. Please try again."
            />
          );
        }
      }
    };

    fetchTransactions();
  }, [currentUser?._id]);

  useEffect(() => {
    let income = 0;
    let expense = 0;
    let savings = 0;

    filteredTransactions.forEach((t) => {
      if (t.categoryId.type === "income") income += t.amount;
      if (t.categoryId.type === "expense") expense += t.amount;
      if (t.categoryId.type === "savings") savings += t.amount;
    });
    setTotal(income - (expense + savings));
    setTotalIncome(income);
    setTotalExpenses(expense);
    setTotalSavings(savings);
  }, [filteredTransactions]);

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
    <div className="w-full h-full flex flex-col items-center justify-baseline px-4 pt-4 pb-10">
      {loadingGoals && loadingTrans ? (
        <section className="w-full grid gap-3 max-w-6xl">
          <div className="w-full flex flex-col gap-2 md:flex-row md:justify-between md:items-end">
            <div className="grid gap-3">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-8 w-64" />
            </div>
            <div className="grid grid-cols-2 gap-3 md:flex md:justify-end md:min-w-36">
              <Skeleton className="h-9 w-full md:hidden" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="w-full h-36" />
            <Skeleton className="w-full h-36" />
            <Skeleton className="w-full h-36" />
          </div>
          <Skeleton className="h-8 w-64 mt-8" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="w-full h-36" />
            <Skeleton className="w-full h-36 hidden sm:block" />
            <Skeleton className="w-full h-36 hidden lg:block" />
          </div>
          <Skeleton className="h-5 w-56 mt-8" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <div className="w-full flex items-center justify-between gap-4 mt-4 max-w-lg mx-auto">
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-14" />
          </div>
        </section>
      ) : (
        <>
          <section className="w-full grid gap-3 max-w-6xl animate-in fade-in animation-duration-[1s]">
            <div className="w-full flex flex-col gap-2 md:flex-row md:justify-between md:items-end">
              <div className="grid gap-3">
                <h4 className="text-white/80">
                  Hello, {firstName}. Welcome back!
                </h4>
                <h1 className="font-bold font-doto text-2xl sm:text-3xl mt-[-10px]">
                  Dashboard Overview
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-3 md:flex md:justify-end md:min-w-36">
                <Link to={"/transactions"} className="w-full flex-1 md:hidden">
                  <Button className="w-full">
                    <span className="hidden sm:inline-block">Go to</span>{" "}
                    Transactions <ArrowRight />
                  </Button>
                </Link>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Data by Period</SelectLabel>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                        {period === "month"
                          ? "for " +
                            new Date().toLocaleString("default", {
                              month: "long",
                            })
                          : period === "year"
                          ? "for " + new Date().getFullYear()
                          : "for All Time"}
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
                        As of {formatDate(date)}
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
                        {period === "month"
                          ? "for " +
                            new Date().toLocaleString("default", {
                              month: "long",
                            })
                          : period === "year"
                          ? "for " + new Date().getFullYear()
                          : "for All Time"}
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
                        <p className="text-white/80">
                          As of {formatDate(date)}
                        </p>
                      </span>
                    </div>
                    <ChartColumn className="size-12 text-white/95" />
                  </CardContent>
                </Card>
                <Card className="p-4 relative overflow-clip group border-destructive">
                  <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <img src="/expense.webp" className="h-fit" alt="" />
                  </div>
                  <CardTitle className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="font-regular text-sm">
                        Your Total Expenses
                      </p>
                      <p className="font-light text-sm text-white/80">
                        {period === "month"
                          ? "for " +
                            new Date().toLocaleString("default", {
                              month: "long",
                            })
                          : period === "year"
                          ? "for " + new Date().getFullYear()
                          : "for All Time"}
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
                        As of {formatDate(date)}
                      </span>
                    </div>
                    <ChartColumn className="size-12 text-white/95" />
                  </CardContent>
                </Card>
              </div>
              {filteredTransactions.length > 0 && (
                <Accordion
                  type="single"
                  className="mt-[-0.5rem] mb-[-1rem]"
                  collapsible
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="mx-auto flex flex-col gap-0 items-center w-full cursor-pointer">
                      <h1>Transactions Overview</h1>
                      <p className="text-center text-sm font-light text-white/80">
                        View Graph
                      </p>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card className="w-full pl-0 py-4 pr-4 md:pr-8">
                        <ChartContainer
                          config={chartConfig}
                          className="w-full h-full max-h-[200px]"
                        >
                          <BarChart
                            data={groupTransactions(
                              filteredTransactions,
                              period as "month" | "year" | "all"
                            )}
                            className="mx-auto"
                            accessibilityLayer
                          >
                            <CartesianGrid vertical={false} />
                            <ChartLegend
                              content={<ChartLegendContent />}
                              verticalAlign="top"
                              align="center"
                              className="!ml-8"
                            />
                            <XAxis
                              dataKey="label"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value: number) =>
                                formatCompactPeso(value)
                              }
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                              name={"Income"}
                              dataKey="income"
                              fill="#009F00"
                              radius={2}
                            />
                            <Bar
                              name={"Savings"}
                              dataKey="savings"
                              fill="#DDDDDD"
                              radius={2}
                            />
                            <Bar
                              name={"Expenses"}
                              dataKey="expense"
                              fill="#EC5E61"
                              radius={2}
                            />
                          </BarChart>
                        </ChartContainer>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>

            {filteredTransactions.length == 0 && <span className="mt-3"></span>}
            <div className="grid gap-3 my-3">
              <hr className="mb-2" />
              <div className="grid gap-3">
                <div className="grid gap-3">
                  <h4 className="text-white/80">Here is your</h4>
                  <h1 className="font-bold font-doto text-2xl sm:text-3xl mt-[-10px]">
                    Monthly Budget
                  </h1>
                </div>
                <div className="grid md:grid-cols-2">
                  <MonthlyBudget />
                </div>
              </div>
            </div>
            {/* SAVINGS */}
            <div className="w-full grid gap-3">
              <hr />
              {activeGoals.length > 0 ? (
                <Carousel className="max-w-full overflow-hidden pt-2">
                  <h1 className="font-bold font-doto text-2xl sm:text-3xl mb-1">
                    <span className="font-bold font-doto text-2xl sm:text-3xl hidden sm:inline-block">
                      Saving{" "}
                    </span>{" "}
                    Goals
                  </h1>
                  {activeGoals.length > 2 && <AddSavingGoal small={true} />}
                  <Link
                    to={"/goals"}
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
                        <SavingGoal
                          key={goal._id}
                          goal={goal}
                          formatCompactPeso={formatCompactPeso}
                        />
                      </CarouselItem>
                    ))}
                    <CarouselItem className="basis-7/8 sm:basis-2/3 lg:basis-1/3 pr-[1px]">
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
          <TransactionTable transactions={filteredTransactions} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
