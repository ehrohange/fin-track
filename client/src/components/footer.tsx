import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowUpFromLine, Bug, Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import ToastContent from "./toastcontent";
import api from "@/lib/axios";

const Footer = () => {
  const [formData, setFormData] = useState<{
    reportTitle: string;
    reportDetails: string;
  }>({
    reportTitle: "",
    reportDetails: "",
  });
  const [processing, setProcessing] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const handleSubmitReport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (!formData.reportTitle.trim() || !formData.reportDetails.trim()) {
        toast(
          <ToastContent icon="error" message="Please fill in all fields!" />
        );
        setProcessing(false);
        return;
      }
      const res = await api.post("/feedback/report", {
        header: formData.reportTitle,
        details: formData.reportDetails,
      });
      if (res.status === 201) {
        toast(
          <ToastContent
            icon="success"
            message="Report submitted successfully!"
          />
        );
        setFormData({ reportTitle: "", reportDetails: "" });
        setOpen(false);
        setProcessing(false);
      }
    } catch (error) {
      toast(<ToastContent icon="error" message="Error submitting report." />);
      setProcessing(false);
    }
  };

  return (
    <>
      <span className="w-full h-8 opacity-30 bg-[linear-gradient(to_top,#2A6512,rgba(0,0,0,0))]"></span>

      <div className="w-full bg-card border-t-2 px-4">
        <div className="max-w-4xl py-6 mx-auto min-h-44 flex flex-col justify-between md:justify-center md:gap-8">
          <div className=" flex items-center justify-center gap-3 flex-col md:flex-row md:justify-between">
            <Link to="/" className="w-fit gap-1">
              <Button variant={"ghost"} className="ml-[-20px] md:ml-0">
                <span className="logo !bg-accent"></span>
                <h1 className="text-xl font-doto uppercase text-white font-bold">
                  FinTrack
                </h1>
                <span className="logo rotate-180 ml-[-2px] !bg-accent"></span>
              </Button>
            </Link>
            <div className="flex gap-2 items-center flex-col mb-4 md:mb-0 md:flex-row">
              <Link
                to={"https://github.com/ehrohange/fin-track"}
                target={"_blank"}
              >
                <Button variant={"ghost"} className="w-fit h-fit p-2 text-xs">
                  <Code /> GitHub Source Code
                </Button>
              </Link>
              <span className="hidden md:block w-[1px] h-5 rounded-full bg-white"></span>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="w-fit h-fit p-2 text-xs hover:!bg-destructive/60"
                  >
                    <Bug /> Report a Bug
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <div className="flex items-start gap-4">
                      <div className="min-w-12 min-h-12 bg-primary/50 rounded-sm flex items-center justify-center">
                        <Bug />
                      </div>
                      <div className="grid gap-2 pt-[2px] text-left">
                        <DialogTitle>Bug or Issue Report</DialogTitle>

                        <DialogDescription className="text-sm text-primary">
                          Report bugs or issues you encounter while using
                          FinTrack.
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <hr />
                  <form
                    className="w-full grid gap-5"
                    onSubmit={handleSubmitReport}
                  >
                    <div className="grid gap-3">
                      <Label htmlFor="reportTitle">Report Title</Label>
                      <Input
                        type="text"
                        id="reportTitle"
                        maxLength={30}
                        placeholder="Report Title"
                        value={formData.reportTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportTitle: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="reportDetails">Report Details</Label>
                      <Textarea
                        id="reportDetails"
                        placeholder="Report Details"
                        maxLength={500}
                        value={formData.reportDetails}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportDetails: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button type="submit">
                      <ArrowUpFromLine /> Submit Report
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <p className="text-center text-xs text-white/80 select-none">
            2025 © FinTrack. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
