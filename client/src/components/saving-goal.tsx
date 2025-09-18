import type { Goal } from "@/lib/types-index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  BanknoteArrowUp,
  CalendarIcon,
  CheckCircle,
  GoalIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import ToastContent from "./toastcontent";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

type SavingGoalProps = {
  goal: Goal;
  formatCompactPeso: (num: number) => string;
};

const SavingGoal = ({ goal, formatCompactPeso }: SavingGoalProps) => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const date = new Date();

  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day} ${year}`; // e.g. "Aug 25 2025"
  };

  const [formData, setFormData] = useState<any>({
    description: goal.goalName,
    amount: null,
    date: formatDate(date),
  });

  const [goalDeadline, setGoalDeadline] = useState<any>(goal.goalDeadline);

  const [goalData, setGoalData] = useState<any>({
    goalAmount: goal.goalAmount,
    goalDeadline: goalDeadline,
    active: goal.active,
  });

  const handleAddTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!formData.amount || !formData.description) {
        return toast(
          <ToastContent icon="error" message="All fields are required." />
        );
      }

      const res = await api.post(
        `/finance/transaction/${currentUser._id}/${goal.categoryId._id}`,
        {
          ...formData,
          date: formatDate(date), // backend expects "Aug 30 2025"
        }
      );

      toast(<ToastContent icon="success" message={res.data.message} />);

      // ✅ reset form
      setFormData({ ...formData, amount: null });
    } catch (error) {
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

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Card className="relative group hover:translate-y-[-4px] duration-200 cursor-pointer">
          <div className="flex justify-between items-start mx-4">
            <div className="grid gap-2 mt-[2px] text-left">
              <CardTitle className="select-none">{goal.goalName}</CardTitle>
              <CardDescription className="select-none">
                {goal.categoryId.name}
              </CardDescription>
            </div>
            <div
              className={`bg-primary/40 select-none rounded-sm size-12 flex items-center justify-center group-hover:bg-primary/60 duration-200`}
            >
              <GoalIcon />
            </div>
          </div>
          <CardContent>
            <div className="relative w-full h-6 rounded-sm bg-primary/15 mt-[-8px] select-none">
              <div
                className={`bg-primary/40 h-full rounded-sm select-none`}
                style={{
                  width: `${Math.min(
                    (goal.amount / goal.goalAmount) * 100,
                    100
                  )}%`,
                }}
              ></div>
              <p className="absolute top-0 left-0 text-center w-full text-xs mt-[4px] select-none">
                {`${formatCompactPeso(goal.amount)} out of ${formatCompactPeso(
                  goal.goalAmount
                )}`}
              </p>
            </div>
            <p className="text-xs text-center mt-2 mb-[-6px] text-destructive select-none">
              Save until {goal.goalDeadline}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="size-12 bg-primary/50 rounded-sm flex items-center justify-center">
              <GoalIcon />
            </div>
            <div className="grid gap-2 pt-[2px] text-left">
              <DialogTitle>{goal.goalName}</DialogTitle>

              <DialogDescription className="text-sm text-primary">
                Category: {goal.categoryId.name}
              </DialogDescription>
            </div>
          </div>
          <div className="relative w-full h-6 rounded-sm bg-primary/15 mt-2 select-none">
            <div
              className={`bg-primary/40 h-full rounded-sm select-none`}
              style={{
                width: `${Math.min(
                  (goal.amount / goal.goalAmount) * 100,
                  100
                )}%`,
              }}
            ></div>
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
                  ? "text-primary/80 font-semibold uppercase"
                  : "text-destructive"
              }`}
            >
              {goal.amount >= goal.goalAmount ? (
                <div className="flex items-center gap-1 font-semibold">
                  <CheckCircle className="size-3.5" /> Goal achieved!
                </div>
              ) : (
                `Save until ${goal.goalDeadline}`
              )}
            </p>
            {/* <Button
              variant={"link"}
              className="px-0 pt-3 pb-0 flex items-center cursor-pointer text-white/75 hover:text-white hover:translate-y-[-2px] duration-200"
            >
              <PencilLine className="size-3.5 mt-[1px]"/> Edit Goal
            </Button> */}
          </div>
        </DialogHeader>
        <hr />
        <Tabs defaultValue="trans">
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
              <Button type="submit">
                <BanknoteArrowUp />
                Add to Goal
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="edit">
            <form className="grid gap-5">
              <div className="grid gap-3">
                <Label htmlFor="amountGoal">Amount Goal</Label>
                <Input type="number" placeholder="Amoung Goal (₱)" />
              </div>
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
                    {goalDeadline}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={goalDeadline}
                    onSelect={setGoalDeadline}
                    disabled={(d) =>
                      d < new Date(new Date().setHours(0, 0, 0, 0))
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
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SavingGoal;
