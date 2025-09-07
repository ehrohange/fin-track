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
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";

const AddSavingGoal = () => {
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
      <DialogTrigger className="w-full">
        <Card className="cursor-pointer">
          <CardContent className="flex flex-row-reverse items-start justify-between gap-4">
            <span className="bg-primary/40 rounded-md size-14 flex items-center justify-center">
              <GoalIcon />
            </span>
            <div className="grid gap-2">
              <h1 className="font-bold text-xl text-left">
                Have a goal in mind?
              </h1>
              <div className="flex items-center gap-1">
                <Plus className="size-4 text-white/80 mt-[-1px]" />
                <p className="text-white/80 text-sm">Click here to add.</p>
              </div>
            </div>
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
              <DialogTitle>Saving Goal Details</DialogTitle>

              <DialogDescription className="text-sm text-primary">
                Enter your saving goal details here.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <hr />

        <form action="">
          <div className="grid gap-5">
            <div className="grid gap-3">
              <Label>Saving Goal Name</Label>
              <Input type="text" placeholder="Saving Goal Name" required />
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
              <Input type="number" min={1} placeholder="Goal Amount (₱)" required />
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
                    onSelect={setDate}
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
          </div>
          <DialogFooter className="flex !flex-col gap-4 items-center mt-5">
            <div className="w-full flex items-center justify-between mt-2">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <Save /> Save Goal
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSavingGoal;
