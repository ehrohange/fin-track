import { Loader2, Trash2 } from "lucide-react";
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
import api from "@/lib/axios";
import { toast } from "sonner";
import ToastContent from "./toastcontent";
import { useDispatch } from "react-redux";
import { updateGoal } from "@/redux/goal/goalsSlice";
import { useState } from "react";

interface DeleteTransProps {
  userId: string;
  _id: string;
  onDeleted?: (id: string) => void; // 👈 optional callback
}

const DeleteTransaction = ({ userId, _id, onDeleted }: DeleteTransProps) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleDeleteTransaction = async () => {
    try {
      setProcessing(true);
      const success = await api.delete(`/finance/transaction/${userId}/${_id}`);
      if (success.status === 404) {
        toast(<ToastContent icon="error" message="User not found." />);
        setProcessing(false);
        return;
      }
      if (success.data.updatedGoal) {
        dispatch(updateGoal(success.data.updatedGoal));
      }
      onDeleted?.(_id); // 👈 tell parent to remove from state
      toast(<ToastContent icon="success" message={success.data.message} />);
      setProcessing(false);
    } catch (error) {
      toast(
        <ToastContent
          icon="error"
          message="There was an error deleting this transaction. Please try again."
        />
      );
      setProcessing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="group size-8 flex items-center justify-center ml-auto mr-2 hover:bg-destructive/80 duration-200 rounded-sm cursor-pointer">
          <Trash2 className="size-5 text-destructive/60 group-hover:text-white duration-200" />
        </div>
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
            onClick={handleDeleteTransaction}
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

export default DeleteTransaction;
