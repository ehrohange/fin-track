import ToastContent from "@/components/toastcontent";
import { Button } from "@/components/ui/button";
import { CardTitle, Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import type { Goal, GoalRes, Transaction } from "@/lib/types-index";
import { cn } from "@/lib/utils";
import { type AppDispatch, type RootState } from "@/redux/store";
import {
  Banknote,
  BanknoteArrowDown,
  BanknoteX,
  ChartColumn,
  GoalIcon,
  PlusCircle,
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

const Dashboard = () => {
  const [total, setTotal] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [savingGoals, setSavingGoals] = useState<Goal[]>([]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = transactions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
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

  useEffect(() => {
    const fetchGoals = async () => {
      if (!currentUser?._id) return;
      try {
        dispatch(setGoalsLoading(true));
        const res: GoalRes = await api.get(`/finance/goals/${currentUser._id}`);
        setSavingGoals(res.data.goals);
        dispatch(setGoals(res.data.goals));
      } catch (err) {
        dispatch(setGoalsError("Failed to fetch goals"));
      } finally {
        dispatch(setGoalsLoading(false));
      }
    };

    fetchGoals();
  }, [currentUser?._id, dispatch]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/finance/transactions/${currentUser?._id}`);

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
  }, []);

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

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const firstName = currentUser?.fullName.split(" ")[0] || "User";
  return (
    <div className="w-full h-full flex flex-col items-center justify-baseline p-6">
      <section className="w-full grid gap-3 max-w-6xl">
        <h4 className="text-white/80">Hello, {firstName}. Welcome back!</h4>
        <h1 className="font-bold font-doto text-3xl mt-[-10px]">
          Dashboard Overview
        </h1>
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
          <h1 className="font-bold font-doto text-3xl">Saving Goals</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savingGoals.length > 0 ? (
              <>
                <Card>
                  <CardTitle>
                    <div className="flex justify-between items-center"></div>
                  </CardTitle>
                </Card>
              </>
            ) : (
              <AddSavingGoal />
            )}
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mt-6">
        <h1 className="font-bold font-doto text-3xl">All Your Transactions</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Desc</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((item, index) => (
              <TableRow
                key={item._id}
                className={(index % 2 && "bg-primary/8") || ""}
              >
                <TableCell>
                  {formatDate(item.date ? new Date(item.date) : undefined)}
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  {capitalizeFirstLetter(item.categoryId.type)}
                </TableCell>
                <TableCell>{item.categoryId.name}</TableCell>
                <TableCell
                  className={
                    cn(
                      item.categoryId.type === "expense" && "text-destructive",
                      item.categoryId.type === "savings" && "text-white",
                      item.categoryId.type === "income" &&
                        "text-primary font-semibold"
                    ) + " text-right"
                  }
                >
                  {item.categoryId.type === "income"
                    ? `+${toPeso(item.amount)}`
                    : `-${toPeso(item.amount)}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="w-full flex items-center justify-center gap-4 mt-4 max-w-lg mx-auto">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>

          <p className="text-sm text-white/85 flex-grow text-center">
            Page{" "}
            <span className="text-primary font-bold text-[15px]">
              {currentPage}
            </span>{" "}
            of {totalPages}
          </p>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
