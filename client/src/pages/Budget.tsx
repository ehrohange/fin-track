import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

const Budget = () => {
  // ✅ initial value: today
  const [date, setDate] = useState<Date | undefined>(new Date());

  // ✅ Format: Mmm D YYYY (e.g., Aug 7 2025)
  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate(); // no leading zero
    const year = d.getFullYear();
    return `${month} ${day} ${year}`;
  };

  return (
    <div className="min-h-[calc(100vh-68px)] w-full flex items-start lg:items-center px-4 py-10 lg:min-h-0 lg:flex-grow">
      <section className="w-full max-w-6xl grid">
        <form className="w-full flex flex-col items-center" action="">
          <div className="w-full flex flex-col gap-5 max-w-[320px]">
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
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="uppercase text-5xl text-left">
                <h1 className="font-doto font-bold">budget for</h1>
                <h1 className="font-doto font-bold">{date ? formatDate(date) : "Select a date"}</h1>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Budget;
