import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  ChevronsUpDown,
  Check,
  Banknote,
  PlusCircle,
  Eye,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import ToastContent from "@/components/toastcontent";
import { useDispatch } from "react-redux";
import TransactionTable from "@/components/transaction-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import {
  transactionDateSelectFailure,
  transactionDateSelectStart,
  transactionDateSelectSuccess,
} from "@/redux/transaction/transactionPageDateSlice";
import type { RootState } from "@/redux/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AddSavingGoal from "@/components/add-saving-goal";
import SavingGoal from "@/components/saving-goal";
import { addTransaction } from "@/redux/transaction/transactionsSlice";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const Transactions = () => {
  const [open, setOpen] = useState(false);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const [value, setValue] = useState(""); // selected category
  const [tab, setTab] = useState("income"); // current selected tab
  const [total, setTotal] = useState<number>(0);
  const dispatch = useDispatch();
  const token = useAuthHeader();
  const [processing, setProcessing] = useState<boolean>(false);

  const currentGoals = useSelector((state: RootState) => state.goals.goals);
  const activeGoals = currentGoals.filter((goal) => goal.active === true);
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const currentUser = useSelector((state: any) => state.user.currentUser);
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
  const currentDate = useSelector(
    (state: any) => state.transactionDate.currentSelectedDate
  );

  // ✅ initial value: today
  const [date, setDate] = useState<Date | undefined>(() => {
    return currentDate ? new Date(currentDate) : new Date();
  });
  const [formData, setFormData] = useState({
    description: "",
    amount: null,
  });

  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day} ${year}`; // e.g. "Aug 25 2025"
  };

  const filteredTransactions = transactions.filter((t) => {
    if (!date) return false;
    return formatDate(new Date(t.date)) === formatDate(date);
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === "amount" ? parseFloat(value) || 0 : value,
    });
  };

  const handleAddTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setProcessing(true);
      if (!formData.amount || !value || !formData.description) {
        return toast(
          <ToastContent icon="error" message="All fields are required." />
        );
      }

      const res = await api.post(
        `/finance/transaction/${currentUser._id}/${value}`,
        {
          ...formData,
          date: formatDate(date), // backend expects "Aug 30 2025"
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      dispatch(addTransaction(res.data.transaction));

      toast(<ToastContent icon="success" message={res.data.message} />);

      // ✅ reset form
      setFormData({ description: "", amount: null });
      setValue("");
      setProcessing(false);
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
            message="There was an error creating transaction. Please try again."
          />
        );
      }
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (currentDate) {
      setDate(new Date(currentDate));
    }
  }, [currentDate]);

  useEffect(() => {
    dispatch(transactionDateSelectStart());
    try {
      dispatch(transactionDateSelectSuccess(formatDate(date)));
    } catch (error) {
      dispatch(transactionDateSelectFailure("Error updating date."));
    }
  }, [date]);

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
  }, [filteredTransactions]);

  // ✅ filter categories based on tab
  const filteredCategories = categories.filter((c) => c.type === tab);

  return (
    <div className="min-h-[calc(100vh-68px)] w-full flex flex-col justify-baseline items-start
    lg:items-center px-4 py-6 lg:min-h-0 lg:flex-grow animate-in fade-in animation-duration-[1s]">
      <section className="w-full max-w-6xl grid">
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
              <BreadcrumbPage>Add Transactions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <form
          className="w-full flex flex-col items-center gap-5 lg:flex-row lg:justify-center lg:items-start"
          onSubmit={handleAddTransaction}
        >
          <div className="w-full flex flex-col justify-between h-full gap-5 sm:max-w-md md:max-w-xl xl:max-w-xl">
            <div className="grid gap-3">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    name="date"
                    variant={"outline"}
                    className="w-full justify-between"
                  >
                    {date ? formatDate(date) : "Select a date"}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) =>
                      d > new Date() || d < new Date("2000-01-01")
                    }
                    captionLayout="dropdown"
                    startMonth={new Date(2010, 0)} // ✅ January 2000
                    endMonth={new Date(new Date().getFullYear(), 11)} // ✅ December current year
                    classNames={{
                      today: "bg-transparent text-foreground", // override default today style
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <img src="/addtrans.webp" className="my-auto" alt="" />
            </div>
          </div>
          <Card className="w-full p-6 sm:max-w-md md:max-w-xl xl:max-w-xl">
            <CardHeader className="p-0">
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center size-12 rounded-sm  ${
                    tab === "expense"
                      ? "bg-destructive/50"
                      : tab === "savings"
                      ? "bg-white/40"
                      : "bg-primary/50"
                  }`}
                >
                  <Banknote />
                </div>

                <div className="grid gap-2 text-left mt-[2px]">
                  <CardTitle>Add Transaction</CardTitle>
                  <CardDescription>
                    Enter your transaction details here.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <hr className="mt-[-6px]" />
            <div className="grid gap-3">
              <Label htmlFor="description">Transaction description</Label>
              <Input
                type="text"
                maxLength={30}
                id="description"
                placeholder="Transaction description"
                required
                className="w-full"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <Tabs
              defaultValue="income"
              className="w-full grid gap-5"
              onValueChange={setTab}
            >
              <div className="grid gap-3">
                <Label>Type of Transaction</Label>
                <TabsList className="w-full">
                  <TabsTrigger value="income" className="cursor-pointer">
                    Income
                  </TabsTrigger>
                  <TabsTrigger value="savings" className="cursor-pointer">
                    Savings
                  </TabsTrigger>
                  <TabsTrigger value="expense" className="cursor-pointer">
                    Expense
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Render combobox for each tab */}
              <TabsContent className="grid gap-3" value={tab}>
                <Label>Category</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {value
                        ? filteredCategories.find((c) => c._id === value)?.name
                        : "Select a category"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search category..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {filteredCategories.map((c) => (
                            <CommandItem
                              key={c._id}
                              value={c._id}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              {c.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === c._id ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="grid gap-3">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    type="number"
                    id="amount"
                    placeholder="Amount (₱)"
                    min={1}
                    max={1000000000}
                    step="0.01"
                    required
                    value={formData.amount ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </TabsContent>
              <Button type="submit" disabled={processing}>
                {!processing ? (
                  <>
                    <PlusCircle />
                    Add Transaction
                  </>
                ) : (
                  <>
                    <Loader2 className="animate-spin" /> Adding...
                  </>
                )}
              </Button>
            </Tabs>
          </Card>
        </form>
      </section>
      <section className="w-full max-w-6xl">
        <hr className="mb-3 mt-6" />
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
            <h1 className="font-bold font-doto text-3xl mb-3">Saving Goals</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <AddSavingGoal />
            </div>
          </>
        )}
      </section>
      {filteredTransactions.length !== 0 ? (
        <TransactionTable
          transactions={filteredTransactions}
          total={total}
          date={formatDate(date)}
        />
      ) : (
        <div className="w-full mx-auto sm:max-w-4xl lg:max-w-6xl xl:max-w-6xl grid mt-6">
          <hr className="mb-4 h-2 mt-3" />
          <h4 className="text-white/80 text-left w-full">These are all your</h4>
          <h1 className="font-bold font-doto text-3xl w-full text-left">
            Transactions for {formatDate(date)}
          </h1>
          <div className="relative w-full max-w-4xl mx-auto">
            <img
              src="/emptytrans.webp"
              className="w-full mx-auto mt-6 object-contain"
            />
            <Card
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                text-center text-sm md:text-lg font-medium px-4 py-2 bg-background/90
                rounded-full border-2 border-primary"
            >
              No transactions yet.
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
