import { ChevronRight, Lock, LockKeyholeIcon, Save } from "lucide-react";
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
      const { newPassword, confirmNewPassword } = formData;
      if (!newPassword.trim() || !confirmNewPassword.trim()) {
        toast(<ToastContent icon="error" message="All fields are required!" />);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast(<ToastContent icon="error" message="Passwords do not match!" />);
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
        return;
      }
    } catch (error) {
      toast(
        <ToastContent
          icon="error"
          message="Failed to update password. Please try again."
        />
      );
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
              <Button type="submit">
                <Save /> Save Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePassword;
