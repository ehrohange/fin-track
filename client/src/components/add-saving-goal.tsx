import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  GoalIcon,
  Loader2,
  Plus,
  Save,
} from "lucide-react";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import type { GoalSubmission } from "@/lib/types-index";
import { toast } from "sonner";
import ToastContent from "./toastcontent";
import { useDispatch, useSelector } from "react-redux";
import { addGoal } from "@/redux/goal/goalsSlice";

interface AddSavingGoalProps {
  small?: boolean;
}

const AddSavingGoal = ({ small }: AddSavingGoalProps) => {
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState<boolean>(false);

  const currentUser = useSelector((state: any) => state.user.currentUser);

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day} ${year}`; // e.g. "Aug 25 2025"
  };

  const [formData, setFormData] = useState<GoalSubmission>({
    goalName: "",
    goalAmount: null,
    goalDeadline: formatDate(date),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === "goalAmount" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSaveGoal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setProcessing(true);
      const { goalName, goalAmount, goalDeadline } = formData;
      if (!value) {
        toast(
          <ToastContent icon="error" message="Please select a category." />
        );
        setProcessing(false);
        return;
      }

      if (!goalName.trim()) {
        toast(<ToastContent icon="error" message="Goal Name is required." />);
        setProcessing(false);
        return;
      }
      if (goalAmount === null || goalAmount <= 0) {
        toast(
          <ToastContent
            icon="error"
            message="Goal Amount must be greater than 0."
          />
        );
        setProcessing(false);
        return;
      }
      if (!goalDeadline) {
        toast(<ToastContent icon="error" message="Deadline is required." />);
        setProcessing(false);
        return;
      }

      const res = await api.post(
        `/finance/goal/${currentUser._id}/${value}`,
        formData
      );

      if (res.status !== 201) {
        toast(<ToastContent icon="error" message={res.data.message} />);
        setProcessing(false);
        return;
      }

      // ✅ Success
      toast(<ToastContent icon="success" message="Goal created!" />);
      dispatch(addGoal(res.data.goal));

      // ✅ Reset form + close dialog
      setFormData({
        goalName: "",
        goalAmount: null,
        goalDeadline: formatDate(new Date()),
      });
      setValue("");
      setDate(new Date());
      setOpen(false);
      setProcessing(false);
    } catch (error) {
      console.error(error);
      toast(
        <ToastContent
          icon="error"
          message="There was an error creating goal. Please try again."
        />
      );
      setProcessing(false);
    }
  };

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

  const filteredCategories = categories.filter((c) => c.type === "savings");

  return (
    <Dialog>
      {!small ? (
        <DialogTrigger className="w-full h-full min-h-36">
          <Card className="group bg-primary/75 hover:bg-primary/85 cursor-pointer h-full group hover:translate-y-[-4px] duration-200 overflow-hidden relative">
            <GoalIcon
              className="absolute top-2 size-60 right-[-3.5rem] rotate-[-35deg] text-white/30
            group-hover:translate-y-[-6px] group-hover:text-white/65 group-hover:rotate-[325deg] duration-200"
            />
            <CardContent className="flex items-start justify-between gap-4 my-auto">
              <div className="grid gap-2">
                <h1 className="font-bold text-xl text-left group-hover:text-shadow-lg">
                  Have a goal in mind?
                </h1>
                <div className="flex items-center gap-1 group-hover:text-shadow-lg">
                  <Plus className="size-4 text-white/80 mt-[-1px]" />
                  <p className="text-white/80 text-sm">Click here to add.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
      ) : (
        <DialogTrigger
          className="absolute top-[9px] sm:top-3.5 right-27 sm:right-[195px]
        hover:translate-y-[-2px] cursor-pointer duration-200"
        >
          <Card className="rounded-full bg-primary/80 p-1.5 hover:bg-primary/90">
            <Plus className="size-4" />
          </Card>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="size-12 bg-primary/50 rounded-sm flex items-center justify-center">
              <GoalIcon />
            </div>
            <div className="grid gap-2 pt-[2px] text-left">
              <DialogTitle>Saving Goal Details</DialogTitle>

              <DialogDescription className="text-sm text-primary">
                Enter your saving goal details here.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <hr />

        <form onSubmit={handleSaveGoal}>
          <div className="grid gap-5">
            <div className="grid gap-3">
              <Label>Saving Goal Name</Label>
              <Input
                type="text"
                placeholder="Saving Goal Name"
                id="goalName"
                value={formData.goalName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-3">
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
            </div>
            <div className="grid gap-3">
              <Label>Goal</Label>
              <Input
                type="number"
                min={1}
                step="0.01"
                id="goalAmount"
                value={formData.goalAmount ?? ""}
                onChange={handleChange}
                placeholder="Goal Amount (₱)"
                required
              />
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
                    {date ? formatDate(date) : "Select a date"}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d); // update local date state
                      setFormData((prev) => ({
                        ...prev,
                        goalDeadline: formatDate(d),
                      }));
                    }}
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
          </div>
          <DialogFooter className="flex !flex-col gap-4 items-center mt-5">
            <div className="w-full flex items-center justify-between mt-2">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={processing}>
                {!processing ? (
                  <>
                    <Save /> Save Goal
                  </>
                ) : (
                  <>
                    <Loader2 className="animate-spin" /> Saving...
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSavingGoal;
