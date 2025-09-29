import {
  BanknoteX,
  CalendarIcon,
  Loader2,
  SaveIcon,
  Trash,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import api from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  deleteMonthlyBudget,
  setMonthlyBudget,
  updateMonthlyBudget,
} from "@/redux/budget/MonthlyBudgetSlice";
import { toast } from "sonner";
import ToastContent from "./toastcontent";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import type { MonthlyBudgetInterface } from "@/lib/types-index";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface MonthlyBudgetPropsInterface {
  formatPeso: (amount: number) => string;
}

const MonthlyBudget = ({ formatPeso }: MonthlyBudgetPropsInterface) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.user.currentUser?._id);
  const monthlyBudget = useSelector(
    (state: RootState) => state.monthlyBudget.budget
  );
  const now = new Date();
  const token = useAuthHeader();
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const [amountLimit, setAmountLimit] = useState<number>(
    monthlyBudget?.amountLimit || 0
  );

  useEffect(() => {
    const fetchBudget = async () => {
      if (monthlyBudget === null) {
        try {
          const res = await api.get(`/finance/budget/${userId}`, {
            headers: {
              Authorization: token,
            },
          });
          if (res.status === 200) {
            dispatch(setMonthlyBudget(res.data.budget));
          }
          return;
        } catch (error: any) {
          toast(
            <ToastContent
              icon="error"
              message={
                error.response.data.message || "Failed to fetch monthly budget."
              }
            />
          );
        }
      }
    };
    fetchBudget();
  }, []);

  useEffect(() => {
    if (monthlyBudget !== null && transactions.length > 0) {
      let total = 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        if (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          transaction.categoryId.type === "expense"
        ) {
          total += transaction.amount;
        }
      });

      if (total !== monthlyBudget.amount) {
        dispatch(updateMonthlyBudget({ ...monthlyBudget, amount: total }));
      }

      const perc = (total / (monthlyBudget.amountLimit || 1)) * 100;
      setPercentage(perc > 100 ? 100 : perc);
    }
  }, [transactions, monthlyBudget?.amountLimit]);

  const handleSaveBudget = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (monthlyBudget !== null) {
        const res = await api.patch(
          `/finance/budget/${monthlyBudget._id}`,
          { amountLimit: amountLimit },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data: MonthlyBudgetInterface = res.data.budget;

        dispatch(updateMonthlyBudget({ ...monthlyBudget, ...data }));
        toast(
          <ToastContent icon="success" message="Monthly budget updated!" />
        );
      } else {
        const res = await api.post(
          `/finance/budget/${userId}`,
          { amountLimit: amountLimit },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data: MonthlyBudgetInterface = res.data.budget;
        dispatch(setMonthlyBudget(data));
        toast(<ToastContent icon="success" message="Monthly budget set!" />);
      }
    } catch (error) {
      toast(
        <ToastContent icon="error" message="Failed to save monthly budget." />
      );
    } finally {
      setProcessing(false);
      setOpen(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmountLimit(parseFloat(e.target.value));
  };

  const handleDeleteMonthlyBudget = async (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (monthlyBudget === null || !monthlyBudget._id) {
        toast(
          <ToastContent icon="error" message="No monthly budget to delete." />
        );
        setProcessing(false);
        return;
      }
      const res = await api.delete(`/finance/budget/${monthlyBudget._id}`, {
        headers: {
          Authorization: token,
        },
      });
      dispatch(deleteMonthlyBudget());
      setAmountLimit(0);
      toast(
        <ToastContent
          icon="success"
          message={res.data.message || "Monthly expenses budget deleted!"}
        />
      );
      setProcessing(false);
      setOpen(false);
    } catch (error: any) {
      if (error.response.status === 429) {
        toast(
          <ToastContent
            icon="error"
            message="Too many requests! Please try again later."
          />
        );
      } else if (error.response.status === 404) {
        toast(
          <ToastContent icon="error" message="Monthly budget not found." />
        );
      } else {
        toast(
          <ToastContent
            icon="error"
            message="Error deleting monthly budget. Please try again."
          />
        );
      }
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="relative overflow-hidden border-destructive/60 w-full group cursor-pointer hover:translate-y-[-4px] duration-200">
          <BanknoteX
            className="absolute top-2 size-60 right-[-3.5rem] rotate-[-35deg] text-white/5
            group-hover:translate-y-[-6px] group-hover:text-white/10 group-hover:rotate-[325deg] duration-200"
          />
          <div className="flex items-start justify-between gap-3 px-6 z-[10]">
            <div className="grid gap-3">
              <CardTitle>
                <h1 className="">Monthly Expenses Budget</h1>
              </CardTitle>
              <CardDescription>
                <p className="font-light text-white/80 mt-[-0.3rem]">
                  for{" "}
                  {now.toLocaleString("default", {
                    month: "long",
                  })}
                  , {now.getFullYear()}
                </p>
              </CardDescription>
            </div>
            <div
              className={`bg-[#A44649] group-hover:bg-[#AD494C] select-none rounded-sm size-12 flex items-center justify-center duration-200`}
            >
              <BanknoteX />
            </div>
          </div>
          <CardContent>
            {monthlyBudget ? (
              <div className="w-full h-6 relative">
                <div className="absolute h-full w-full flex items-center justify-center text-xs mb-2 z-10">
                  <h1>
                    {formatPeso(monthlyBudget.amount || 0)} out of{" "}
                    {formatPeso(monthlyBudget.amountLimit)}
                  </h1>
                </div>
                <Progress
                  value={percentage}
                  className="h-full w-full rounded-sm bg-[#361718]"
                />
              </div>
            ) : (
              <div className="flex items-start justify-center gap-4">
                <p className="text-center text-sm text-white/80">
                  Click or tap here to set it up!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="min-w-12 h-12 bg-primary/50 rounded-sm flex items-center justify-center">
              <CalendarIcon />
            </div>
            <div className="grid gap-2 pt-[2px] text-left">
              <DialogTitle>Monthly Expenses Budget</DialogTitle>

              <DialogDescription className="text-sm text-white/80">
                Set or up date your monthly budget to keep track of your
                expenses here.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <hr />
        <form className="grid gap-5" onSubmit={handleSaveBudget}>
          <div className="grid gap-3">
            <Label>Input</Label>
            <Input
              type="number"
              placeholder="Monthly Budget Limit"
              id="amountLimit"
              onChange={handleChange}
              value={amountLimit === 0 ? "" : amountLimit}
              required
              min={1}
              step={0.01}
              max={1000000000}
            />
          </div>
          <div className="w-full flex items-center gap-2">
            <Button type="submit" className="flex-grow" disabled={processing}>
              {!processing ? (
                <>
                  <SaveIcon /> Save Monthly Budget
                </>
              ) : (
                <>
                  <Loader2 className="animate-spin" /> Saving...
                </>
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"outline"}
                  className="text-destructive !bg-destructive/10 !border-destructive/60 
                hover:!bg-destructive/60 hover:text-white/80"
                >
                  {!processing ? (
                    <Trash />
                  ) : (
                    <Loader2 className="animate-spin" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete your monthly goal?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone, but you can still set it up
                    after deleting.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive/80 hover:bg-destructive cursor-pointer"
                    disabled={processing}
                    onClick={handleDeleteMonthlyBudget}
                  >
                    {!processing ? (
                      <>Continue</>
                    ) : (
                      <>
                        <Loader2 className="animate-spin" /> Deleting...
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyBudget;
