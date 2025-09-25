import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import type { MouseEvent } from "react";
import api from "@/lib/axios";
import { useDispatch } from "react-redux";
import { deleteGoal } from "@/redux/goal/goalsSlice";
import ToastContent from "./toastcontent";
import { toast } from "sonner";
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
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

interface DeleteGoalProps {
  goalId: string;
  processing: boolean;
  setProcessing: any;
}

const DeleteGoal = ({ goalId, processing, setProcessing }: DeleteGoalProps) => {
  const dispatch = useDispatch();
  const token = useAuthHeader();
  const handleDeleteGoal = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (!token) {
        toast(<ToastContent icon="error" message="Unauthorized access." />);
      }
      const res = await api.delete(`/finance/goal/${goalId}`, {
        headers: {
          Authorization: token,
        },
      });
      dispatch(deleteGoal(goalId));
      toast(<ToastContent icon="success" message={res.data.message} />);
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
            message="Error deleting goal. Please try again."
          />
        );
      }
    } finally {
      setProcessing(false);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="text-destructive !bg-destructive/10 !border-destructive/60 
                hover:!bg-destructive/60 hover:text-white/80"
        >
          {!processing ? <Trash /> : <Loader2 className="animate-spin" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this transaction?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this and
            remove it from our server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteGoal}
            className="bg-destructive/80 hover:bg-destructive cursor-pointer"
            disabled={processing}
          >
            {!processing ? (
              <>Continue</>
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

export default DeleteGoal;
