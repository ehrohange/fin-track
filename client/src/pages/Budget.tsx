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
} from "lucide-react";
import {
  Card,
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import ToastContent from "@/components/toastcontent";
import { type Goal, type Transaction } from "@/lib/types-index";
import { useDispatch } from "react-redux";
import {
  budgetDateSelectStart,
  budgetDateSelectSuccess,
  budgetDateSelectFailure,
} from "../redux/budget/budgetPageDateSlice";

const Budget = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [value, setValue] = useState(""); // selected category
  const [tab, setTab] = useState("income"); // current selected tab
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [goals, setGoals] = useState<Goal[]>([]);
  const dispatch = useDispatch();
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = transactions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const currentUser = useSelector((state: any) => state.user.currentUser);

  const currentDate = useSelector(
    (state: any) => state.budgetDate.currentSelectedDate
  );

  // ✅ initial value: today
  const [date, setDate] = useState<Date | undefined>(() => {
    return currentDate ? new Date(currentDate) : new Date();
  });
  const [formData, setFormData] = useState({
    description: "",
    amount: 1,
  });

  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day} ${year}`; // e.g. "Aug 25 2025"
  };

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
        }
      );

      toast(<ToastContent icon="success" message={res.data.message} />);

      // ✅ refresh list
      setTransactions((prev) => [res.data.transaction, ...prev]);

      // ✅ reset form
      setFormData({ description: "", amount: 1 });
      setValue("");
    } catch (error) {
      toast(
        <ToastContent icon="error" message="Failed to create transaction." />
      );
    }
  };

  useEffect(() => {
    if (currentDate) {
      setDate(new Date(currentDate));
    }
  }, [currentDate]);

  useEffect(() => {
    dispatch(budgetDateSelectStart());
    try {
      dispatch(budgetDateSelectSuccess(formatDate(date)));
    } catch (error) {
      dispatch(budgetDateSelectFailure("Error updating date."));
    }
  }, [date]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/finance/categories`);
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const formattedDate = formatDate(date);

        const res = await api.get(
          `/finance/transactionsByDate/${currentUser._id}`,
          {
            params: { date: formattedDate }, // ⬅️ query param
          }
        );

        setTransactions(res.data.transactions.reverse());
      } catch (error) {
        toast(
          <ToastContent icon="error" message="Failed to fetch transactions." />
        );
      }
    };

    fetchTransactions();
  }, [date]);

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
  }, [transactions]);

  // ✅ filter categories based on tab
  const filteredCategories = categories.filter((c) => c.type === tab);

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

  return (
    <div className="min-h-[calc(100vh-68px)] w-full flex flex-col justify-baseline items-start lg:items-center px-4 py-6 lg:min-h-0 lg:flex-grow">
      <section className="w-full max-w-6xl grid">
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
                    tab === "expense" ? "bg-destructive/50" : tab === "savings" ? "bg-white/40" : "bg-primary/50"
                  }`}
                >
                  <Banknote />
                </div>

                <div className="grid gap-2 text-left mt-[2px]">
                  <CardTitle>Transaction</CardTitle>
                  <CardDescription>
                    Enter your transaction details here.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <hr className="mt-[-6px]" />
            <Tabs
              defaultValue="income"
              className="w-full grid gap-5"
              onValueChange={setTab}
            >
              <div className="grid gap-3">
                <Label>Type of Transaction</Label>
                <TabsList className="w-full">
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="savings">Savings</TabsTrigger>
                  <TabsTrigger value="expense">Expense</TabsTrigger>
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
                  <Label htmlFor="description">Transaction description</Label>
                  <Input
                    type="text"
                    id="description"
                    placeholder="Transaction description"
                    required
                    className="w-full"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    type="number"
                    id="amount"
                    placeholder="Amount"
                    min={1}
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              </TabsContent>
              <Button type="submit">
                <PlusCircle />
                Add Transaction
              </Button>
            </Tabs>
          </Card>
        </form>
      </section>
      <section className="w-full mx-auto sm:max-w-4xl lg:max-w-6xl xl:max-w-6xl grid mt-6">
        <div className="w-full uppercase flex flex-col items-center sm:flex-row sm:gap-6 text-4xl justify-center my-2 lg:justify-start">
          <Banknote className="size-7 mr-[-10px] hidden sm:block" />
          <h1 className="font-doto font-bold">budget for</h1>
          <h1 className="font-doto font-bold">
            {date ? formatDate(date) : "Select a date"}
          </h1>
        </div>
        <hr />
        {transactions.length !== 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Desc</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      {capitalizeFirstLetter(item.categoryId.type)}
                    </TableCell>
                    <TableCell>{item.categoryId.name}</TableCell>
                    <TableCell
                      className={
                        cn(
                          item.categoryId.type === "expense" &&
                            "text-destructive",
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
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total Balance</TableCell>
                  <TableCell
                    className={`font-bold ${
                      total > 0
                        ? "text-primary"
                        : total < 0
                        ? "text-destructive"
                        : "text-white"
                    } text-right`}
                  >
                    {toPeso(total)}
                  </TableCell>
                </TableRow>
              </TableFooter>
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
          </>
        ) : (
          <div className="relative w-full max-w-4xl mx-auto">
            <img
              src="/emptytrans.webp"
              className="w-full mx-auto mt-6 object-contain"
            />
            <Card
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                text-center text-lg font-medium px-4 py-2 bg-background/90
                rounded-full border-2 border-primary"
            >
              No transactions yet.
            </Card>
          </div>
        )}
      </section>
    </div>
  );
};

export default Budget;
