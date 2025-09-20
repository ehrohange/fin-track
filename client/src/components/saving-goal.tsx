import type { Goal, Transaction } from "@/lib/types-index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  BanknoteArrowUp,
  CalendarIcon,
  CheckCircle,
  CircleFadingPlus,
  GoalIcon,
  Loader2,
  Package2,
  PackageOpen,
  Save,
} from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import { toast } from "sonner";
import ToastContent from "./toastcontent";
import api from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import type { AppDispatch, RootState } from "@/redux/store";
import { updateGoal } from "@/redux/goal/goalsSlice";
import DeleteGoal from "./delete-goal";

type SavingGoalProps = {
  goal: Goal;
  formatCompactPeso: (num: number) => string;
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
};

const SavingGoal = ({
  goal,
  formatCompactPeso,
  setTransactions,
}: SavingGoalProps) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const today = new Date();
  const [processing, setProcessing] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("trans");

  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day} ${year}`;
  };

  const [formData, setFormData] = useState<any>({
    description: goal.goalName,
    amount: null,
    date: formatDate(today),
  });

  const [goalData, setGoalData] = useState<any>({
    goalAmount: goal.goalAmount,
    goalDeadline: goal.goalDeadline ? new Date(goal.goalDeadline) : undefined,
  });

  const handleUpdateGoal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (goalData.goalAmount <= 0 || goalData.goalAmount === null) {
        toast(
          <ToastContent
            icon="error"
            message="Goal amount cannot be 0 or less."
          />
        );
        setProcessing(false);
        return;
      }
      const res = await api.patch(`/finance/goal/${goal._id}`, goalData);
      console.log(res);
      dispatch(updateGoal(res.data.updatedGoal));
      setOpen(false);
      toast(<ToastContent icon="success" message={res.data.message} />);
      setProcessing(false);
    } catch (error) {
      toast(<ToastContent icon="error" message="Error updating goal." />);
      setProcessing(false);
    }
  };

  const handleArchiveGoal = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (!goal.active) {
        toast(
          <ToastContent icon="error" message="This goal is already archived." />
        );
        setProcessing(false);
        return;
      }
      const res = await api.patch(`/finance/goal/deactivate/${goal._id}`);
      dispatch(updateGoal(res.data.updatedGoal));
      setOpen(false);
      toast(<ToastContent icon="success" message="Goal archived!" />);
      setProcessing(false); // ✅ stop spinner
    } catch (error) {
      setProcessing(false);
      toast(
        <ToastContent
          icon="error"
          message="Error archiving goal. Please try again."
        />
      );
    }
  };

  const handleUnarchiveGoal = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (goal.active) {
        toast(
          <ToastContent icon="error" message="This goal is already active." />
        );
        setProcessing(false);
        return;
      }
      const res = await api.patch(`/finance/goal/activate/${goal._id}`);
      dispatch(updateGoal(res.data.updatedGoal));
      setOpen(false);
      toast(<ToastContent icon="success" message="Goal unarchived!" />);
      setProcessing(false); // ✅ stop spinner
    } catch (error) {
      setProcessing(false);
      toast(
        <ToastContent
          icon="error"
          message="Error unarchiving goal. Please try again."
        />
      );
    }
  };

  const handleAddTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setProcessing(true);
      if (!formData.amount || !formData.description) {
        setProcessing(false);
        toast(<ToastContent icon="error" message="All fields are required." />);
        return;
      }

      const res = await api.post(
        `/finance/transaction/${currentUser?._id}/${goal.categoryId._id}`,
        {
          ...formData,
          date: formatDate(today),
        }
      );

      toast(<ToastContent icon="success" message={res.data.message} />);
      dispatch(
        updateGoal({
          ...goal,
          amount: goal.amount + formData.amount,
        })
      );
      if (typeof setTransactions === "function") {
        setTransactions((prev: any[]) => [res.data.transaction, ...prev]);
      }
      setFormData({ ...formData, amount: null }); // reset form
      setProcessing(false);
    } catch {
      setProcessing(false);
      toast(
        <ToastContent icon="error" message="Failed to create transaction." />
      );
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === "amount" ? parseFloat(value) || 0 : value,
    });
  };

  const handleAmountGoalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGoalData({
      ...goalData,
      [e.target.id]: parseFloat(e.target.value),
    });
  };

  // ✅ Helper: compare dates by year, month, and day only
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // ✅ Compute deadline status
  const deadlineDate = new Date(goal.goalDeadline);
  const deadlineToday = isSameDay(deadlineDate, today);

  let deadlineMessage: React.ReactNode;
  if (goal.amount >= goal.goalAmount) {
    deadlineMessage = (
      <span className="flex items-center justify-center gap-1 font-semibold">
        <CheckCircle className="size-3.5" /> Goal achieved!
      </span>
    );
  } else if (deadlineToday) {
    deadlineMessage = "Deadline today!";
  } else if (deadlineDate < today) {
    deadlineMessage = "Deadline exceeded. Extend?";
  } else {
    deadlineMessage = `Save until ${goal.goalDeadline}`;
  }

  // ✅ Shared condition for destructive theme (only past deadlines, not today)
  const isPastDeadline =
    deadlineDate < today && !deadlineToday && goal.amount < goal.goalAmount;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full relative group hover:translate-y-[-4px] duration-200 cursor-pointer">
        {!goal.active && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10 rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-2 justify-center text-white/80">
              <Package2 className="size-5 mb-0.5" />
              <span className="text-sm">This goal is archived.</span>
            </div>
          </div>
        )}
        <Card
          className={`relative ${
            isPastDeadline ? "border-destructive/60" : "border-primary/60"
          }`}
        >
          <div className="flex justify-between items-start mx-4">
            <div className="grid gap-2 mt-[2px] text-left">
              <CardTitle className="select-none">{goal.goalName}</CardTitle>
              <CardDescription
                className={`select-none ${
                  isPastDeadline ? "text-destructive" : "text-primary"
                }`}
              >
                {goal.categoryId.name}
              </CardDescription>
            </div>
            <div
              className={`${
                isPastDeadline
                  ? "bg-destructive/40 group-hover:bg-destructive/60"
                  : "bg-primary/40 group-hover:bg-primary/60"
              } select-none rounded-sm size-12 flex items-center justify-center duration-200`}
            >
              <GoalIcon />
            </div>
          </div>
          <CardContent>
            <div
              className={`relative w-full h-6 rounded-sm ${
                isPastDeadline ? "bg-destructive/15" : "bg-primary/15"
              } mt-[-8px] select-none`}
            >
              <div
                className={`h-full rounded-sm select-none ${
                  isPastDeadline ? "bg-destructive/40" : "bg-primary/40"
                }`}
                style={{
                  width: `${Math.min(
                    (goal.amount / goal.goalAmount) * 100,
                    100
                  )}%`,
                }}
              />
              <p className="absolute top-0 left-0 text-center w-full text-xs mt-[4px] select-none">
                {`${formatCompactPeso(goal.amount)} out of ${formatCompactPeso(
                  goal.goalAmount
                )}`}
              </p>
            </div>
            <p
              className={`text-xs text-center mt-2 mb-[-10px] ${
                goal.amount >= goal.goalAmount
                  ? "text-primary"
                  : deadlineToday
                  ? "text-destructive"
                  : isPastDeadline
                  ? "text-destructive"
                  : "text-white/80"
              } select-none`}
            >
              {deadlineMessage}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent
        className={`${
          isPastDeadline ? "border-destructive/80" : "border-primary/60"
        }`}
      >
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={`size-12 ${
                isPastDeadline ? "bg-destructive/40" : "bg-primary/40"
              } rounded-sm flex items-center justify-center`}
            >
              <GoalIcon />
            </div>
            <div className="grid gap-2 pt-[2px] text-left">
              <DialogTitle>{goal.goalName}</DialogTitle>
              <DialogDescription
                className={`text-sm ${
                  isPastDeadline ? "text-destructive" : "text-primary"
                }`}
              >
                Category: {goal.categoryId.name}
              </DialogDescription>
            </div>
          </div>

          <div
            className={`relative w-full h-6 rounded-sm ${
              isPastDeadline ? "bg-destructive/15" : "bg-primary/15"
            } mt-2 select-none`}
          >
            <div
              className={`${
                isPastDeadline ? "bg-destructive/40" : "bg-primary/40"
              } h-full rounded-sm select-none`}
              style={{
                width: `${Math.min(
                  (goal.amount / goal.goalAmount) * 100,
                  100
                )}%`,
              }}
            />
            <p className="absolute top-0 left-0 text-center w-full text-xs mt-[4px] select-none">
              {`${formatCompactPeso(goal.amount)} out of ${formatCompactPeso(
                goal.goalAmount
              )}`}
            </p>
          </div>

          <div className="flex items-center justify-between mt-[-0.5rem]">
            <p
              className={`text-xs text-left mt-2 mb-[-6px] select-none ${
                goal.amount >= goal.goalAmount
                  ? "text-primary/80 font-semibold"
                  : deadlineToday
                  ? "text-destructive"
                  : isPastDeadline
                  ? "text-destructive"
                  : "text-white/80"
              }`}
            >
              {deadlineMessage}
            </p>
          </div>
        </DialogHeader>
        <hr />

        {goal.active ? (
          isPastDeadline ? (
            <div className="relative">
              <img src="/deadline-exceeded.webp" alt="deadline exceeded" />
              <form onSubmit={handleUpdateGoal}>
                <Card className="absolute inset-0 m-auto py-2 w-fit h-fit border-destructive/60 px-4">
                  <CardContent className="grid gap-2 px-0">
                    <div className="flex items-center justify-center gap-2 mt-2 text-white/85">
                      <CalendarIcon className="size-4 mt-[-2px]" />
                      <p className="">Deadline exceeded!</p>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="goalDeadline"
                          name="goalDeadline"
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {goalData.goalDeadline
                            ? formatDate(goalData.goalDeadline)
                            : "Pick a date"}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={goalData.goalDeadline}
                          onSelect={(date) =>
                            setGoalData((prev: any) => ({
                              ...prev,
                              goalDeadline: date,
                            }))
                          }
                          disabled={(d) =>
                            d < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          captionLayout="dropdown"
                          startMonth={new Date(2010, 0)}
                          endMonth={new Date(new Date().getFullYear(), 11)}
                          classNames={{
                            today: "bg-transparent text-foreground",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                  <CardAction className="w-full flex flex-col items-center justify-center mt-[-1rem] mb-2">
                    <Button
                      type="submit"
                      disabled={processing}
                      className="mx-auto w-full"
                    >
                      {!processing ? (
                        <>
                          <CircleFadingPlus /> Extend Deadline
                        </>
                      ) : (
                        <>
                          <Loader2 className="animate-spin" /> Updating...
                        </>
                      )}
                    </Button>
                  </CardAction>
                  <hr className="mt-[-1rem] mb-[-1rem]" />
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Button
                      variant={"outline"}
                      disabled={processing}
                      type="button"
                      onClick={handleArchiveGoal}
                      className="text-white/80 flex justify-center items-center"
                    >
                      {!processing ? (
                        <>
                          <Package2 /> Archive Goal
                        </>
                      ) : (
                        <>
                          <Loader2 className="animate-spin" /> Archiving...
                        </>
                      )}
                    </Button>

                    <DeleteGoal
                      setProcessing={setProcessing}
                      processing={processing}
                      goalId={goal._id}
                    />
                  </div>
                </Card>
              </form>
            </div>
          ) : (
            <Tabs defaultValue={tab} value={tab} onValueChange={setTab}>
              <TabsList className="w-full mb-2">
                <TabsTrigger value="trans">Add Amount</TabsTrigger>
                <TabsTrigger value="edit">Update Goal</TabsTrigger>
              </TabsList>

              <TabsContent value="trans">
                <form className="grid gap-5" onSubmit={handleAddTransaction}>
                  <div className="grid gap-3">
                    <Label htmlFor="amount">Amount to be added</Label>
                    <Input
                      type="number"
                      id="amount"
                      placeholder="Amount (₱)"
                      value={formData.amount ?? ""}
                      onChange={handleChange}
                      min={1}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={processing}>
                    {!processing ? (
                      <>
                        <BanknoteArrowUp />
                        Add to Goal
                      </>
                    ) : (
                      <>
                        <Loader2 className="animate-spin" /> Adding...
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="edit">
                <form onSubmit={handleUpdateGoal} className="grid gap-5">
                  <div className="grid gap-3">
                    <Label htmlFor="amountGoal">Amount Goal</Label>
                    <Input
                      type="number"
                      placeholder="Amount Goal (₱)"
                      id="goalAmount"
                      value={goalData.goalAmount}
                      step={"0.01"}
                      min={1}
                      onChange={handleAmountGoalChange}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="goalDeadline">Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="goalDeadline"
                          name="goalDeadline"
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {goalData.goalDeadline
                            ? formatDate(goalData.goalDeadline)
                            : "Pick a date"}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={goalData.goalDeadline}
                          onSelect={(date) =>
                            setGoalData((prev: any) => ({
                              ...prev,
                              goalDeadline: date,
                            }))
                          }
                          disabled={(d) =>
                            d < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          captionLayout="dropdown"
                          startMonth={new Date()}
                          endMonth={new Date(new Date().getFullYear() + 70, 11)}
                          classNames={{
                            today: "bg-transparent text-foreground",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button disabled={processing} type="submit">
                    {!processing ? (
                      <>
                        <Save /> Update Goal
                      </>
                    ) : (
                      <>
                        <Loader2 className="animate-spin" /> Updating...
                      </>
                    )}
                  </Button>
                </form>
                <hr className="mt-4 mb-4" />
                <div className="flex items-center gap-2">
                  <Button
                    variant={"outline"}
                    disabled={processing}
                    type="button"
                    onClick={handleArchiveGoal}
                    className="text-white/80 flex justify-center items-center flex-1"
                  >
                    {!processing ? (
                      <>
                        <Package2 /> Archive Goal
                      </>
                    ) : (
                      <>
                        <Loader2 className="animate-spin" /> Archiving...
                      </>
                    )}
                  </Button>
                  <DeleteGoal
                    setProcessing={setProcessing}
                    processing={processing}
                    goalId={goal._id}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )
        ) : (
          <div className="relative">
            <img src="/deadline-exceeded.webp" alt="deadline exceeded" />
            <Card className="absolute inset-0 m-auto w-fit h-fit border-destructive/60 p-4">
              <CardHeader className="p-0 text-sm mb-[-1rem] text-center">
                This goal is archived.
              </CardHeader>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  disabled={processing}
                  onClick={handleUnarchiveGoal}
                >
                  {!processing ? (
                    <>
                      <PackageOpen /> Unarchive Goal
                    </>
                  ) : (
                    <>
                      <Loader2 className="animate-spin" /> Unarchiving...
                    </>
                  )}
                </Button>

                <DeleteGoal
                  setProcessing={setProcessing}
                  processing={processing}
                  goalId={goal._id}
                />
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SavingGoal;
