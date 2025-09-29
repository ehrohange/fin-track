import {
  ChevronRight,
  Loader2,
  Lock,
  LockKeyholeIcon,
  Save,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useState, type ChangeEvent, type FormEvent } from "react";
import ToastContent from "./toastcontent";
import { toast } from "sonner";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const UpdatePassword = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const token = useAuthHeader();
  const [processing, setProcessing] = useState<boolean>(false);

  const userId = currentUser?._id;
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setProcessing(true);
      const { newPassword, confirmNewPassword } = formData;
      if (!newPassword.trim() || !confirmNewPassword.trim()) {
        toast(<ToastContent icon="error" message="All fields are required!" />);
        setProcessing(false);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast(<ToastContent icon="error" message="Passwords do not match!" />);
        setProcessing(false);
        return;
      }
      const res = await api.patch(
        `/users/password/${userId}`,
        {
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.status === 200) {
        toast(<ToastContent icon="success" message={res.data.message} />);
        setFormData({ newPassword: "", confirmNewPassword: "" });
        setProcessing(false);
        return;
      }
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
            message="There was an error updating your password. Please try again."
          />
        );
      }
      setProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-full flex items-center justify-between"
        >
          <Lock />
          <span>Update Password</span>
          <ChevronRight />
        </Button>
      </DialogTrigger>

      <DialogContent className="px-4 sm:px-8 pt-6 sm:max-w-[425px]">
        <form
          autoComplete="off"
          className="grid gap-3"
          onSubmit={handleUpdatePassword}
        >
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center bg-primary/50 size-12 rounded-sm">
                <LockKeyholeIcon />
              </div>
              <div className="grid gap-2 text-left mt-[2px]">
                <DialogTitle>Update Password</DialogTitle>
                <DialogDescription>
                  Make changes to your password here.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <hr className="my-2" />
          <div className="grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                maxLength={30}
                placeholder="New Password"
                autoComplete="new-password"
                required
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                maxLength={30}
                placeholder="Confirm New Password"
                autoComplete="new-password"
                required
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter className="flex !flex-col gap-4 items-center">
            <div className="w-full flex items-center justify-between mt-2">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={processing}>
                {!processing ? (
                  <>
                    <Save /> Save Changes
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

export default UpdatePassword;
