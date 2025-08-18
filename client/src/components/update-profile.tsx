import { ChevronRight, Pencil, Save, Trash } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const UpdateProfile = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant={"ghost"} className="w-full flex items-center justify-between">
            <Pencil />
            <span>Edit Profile</span>
            <ChevronRight />
          </Button>
        </DialogTrigger>

        <DialogContent className="px-4 sm:px-8 pt-6 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-center flex-col items-center">
            <Label htmlFor="avatar" className="mb-2">Profile Picture</Label>
            <div className="size-28 relative cursor-pointer">
              <Avatar className="size-full" id="avatar">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 p-2 bg-primary/90 rounded-full w-fit">
                <Pencil className="size-4" />
              </div>
            </div>
            <p className="text-center w-72 mt-2 text-secondary text-xs truncate">jorgeangelopangilinan@gmail.com</p>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" type="text" placeholder="First Name" autoComplete="off" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" type="text" placeholder="Last Name" autoComplete="off" />
            </div>
          </div>

          <DialogFooter className="flex !flex-col gap-4 items-center">
            <div className="w-full flex items-center justify-between mt-2">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button type="submit"><Save /> Save Changes</Button>
            </div>
            <hr className="h-1 w-full mt-4" />
            <Button
              variant={"ghost"}
              className="mt-[-0.3rem] text-destructive hover:!bg-destructive/50 hover:!border-destructive hover:border-2"
            >
              <Trash className="mt-[-1px]" /> Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default UpdateProfile;
