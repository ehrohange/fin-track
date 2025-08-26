import { ChevronRight, Lock, Save} from "lucide-react";
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

const UpdatePassword = () => {
  return (
    <Dialog>
      <form autoComplete="off">
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
          <DialogHeader>
            <DialogTitle className="text-xl">Update Password</DialogTitle>
            <DialogDescription>
              Make changes to your password here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="New Password" autoComplete="new-password" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input id="confirmNewPassword" type="password" placeholder="Confirm New Password" autoComplete="new-password" />
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
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default UpdatePassword;
