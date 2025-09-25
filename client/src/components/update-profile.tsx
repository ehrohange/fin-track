import {
  ChevronRight,
  Loader2,
  Pencil,
  PencilLine,
  Save,
  Trash,
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import type { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  // useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import ToastContent from "./toastcontent";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { jwtDecode } from "jwt-decode";
import {
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "@/redux/user/userSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import type { User } from "@/lib/types-index";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const UpdateProfile = () => {
  // const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const dispatch = useDispatch();
  const signIn = useSignIn();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const token = useAuthHeader();
  const [formData, setFormData] = useState({
    profilePicture:
      currentUser?.profilePicture ||
      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    fullName: currentUser?.fullName || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const updateUserDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = currentUser?._id;
    if (!userId) return;

    dispatch(updateUserStart());
    setProcessing(true);
    try {
      const res = await api.patch(
        `/users/name/${userId}`,
        {
          fullName: formData.fullName,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.status === 200 && res.data.access_token) {
        // ✅ Save new token in auth-kit
        const success = signIn({
          auth: {
            token: res.data.access_token,
            type: "Bearer",
          },
        });

        if (success) {
          // ✅ Decode new user from token
          const decodedUser: User = jwtDecode(res.data.access_token);

          // ✅ Update Redux user
          dispatch(updateUserSuccess(decodedUser));
          setOpen(false);
          toast(<ToastContent icon="success" message="Full name updated!" />);
          setProcessing(false);
        }
      } else {
        setProcessing(false);

        throw new Error("Unexpected response");
      }
    } catch (error: any) {
      dispatch(updateUserFailure(error.message || "Update failed"));
      setProcessing(false);
      toast(<ToastContent icon="error" message="Update failed!" />);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-full flex items-center justify-between"
        >
          <Pencil />
          <span>Edit Profile</span>
          <ChevronRight />
        </Button>
      </DialogTrigger>

      <DialogContent className="grid gap-2 px-4 sm:px-8 pt-6 sm:max-w-[425px]">
        <form className="grid gap-2" onSubmit={updateUserDetails}>
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="size-12 flex items-center justify-center bg-primary/50 rounded-sm">
                <PencilLine />
              </div>
              <div className="grid gap-2 text-left mt-[2px]">
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <hr className="my-2" />
          <div className="w-full flex justify-center flex-col items-center">
            <Label htmlFor="avatar" className="mb-2">
              Profile Picture
            </Label>
            <div className="size-28 relative cursor-pointer">
              {/* <Input type="file" className="hidden" ref={fileRef} /> */}
              <Avatar className="size-full" id="avatar">
                <AvatarImage
                  src={formData.profilePicture}
                  alt="@shadcn"
                  // onClick={() => fileRef.current?.click()}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 p-2 bg-primary/90 rounded-full w-fit">
                <Pencil className="size-4" />
              </div>
            </div>
            <p className="text-center w-72 mt-2 text-secondary text-xs truncate">
              {currentUser?.email ?? ""}
            </p>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Full Name"
                autoComplete="off"
                onChange={handleChange}
                value={formData.fullName}
                required
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
            <hr className="h-1 w-full mt-4" />
            <DeleteAlertDialog />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAlertDialog = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const token = useAuthHeader();
  const [processing, setProcessing] = useState<boolean>(false);
  const handleDeleteUser = async () => {
    const userId = currentUser?._id;
    if (!userId) return;
    dispatch(deleteUserStart());
    setProcessing(true);
    try {
      const res = await api.delete(`/users/${userId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (res.status === 200) {
        dispatch(deleteUserSuccess());
        signOut();
        setProcessing(false);
        toast(
          <ToastContent
            icon="success"
            message={
              res.data.message ||
              "Account deleted. Thank you for using our services!"
            }
          />
        );
        navigate("/login");
      }
    } catch (error) {
      toast(
        <ToastContent
          icon="error"
          message="Account deletion failed. Please try again."
        />
      );
      setProcessing(false);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="mt-[-0.3rem] text-destructive hover:!bg-destructive/50 hover:!border-destructive hover:border-2"
        >
          <Trash className="mt-[-1px]" /> Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive/80 hover:bg-destructive"
            onClick={handleDeleteUser}
            disabled={processing}
          >
            {!processing ? (
              <>
                <Trash />
                Yes, delete my account
              </>
            ) : (
              <>
                <Loader2 className="animate-spin" /> Deleting...
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateProfile;
