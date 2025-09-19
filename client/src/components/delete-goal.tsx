import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import type { MouseEvent } from "react";
import api from "@/lib/axios";
import { useDispatch } from "react-redux";
import { deleteGoal } from "@/redux/goal/goalsSlice";
import ToastContent from "./toastcontent";
import { toast } from "sonner";

interface DeleteGoalProps {
  goalId: string;
  processing: boolean;
  setProcessing: any;
}

const DeleteGoal = ({ goalId, processing, setProcessing }: DeleteGoalProps) => {
  const dispatch = useDispatch();
  const handleDeleteGoal = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await api.delete(`/finance/goal/${goalId}`);
      dispatch(deleteGoal(goalId));
      toast(<ToastContent icon="success" message={res.data.message} />);
    } catch (error) {
      toast(<ToastContent icon="error" message="Error deleting goal." />);
    } finally {
      setProcessing(false);
    }
  };
  return (
    <Button
      variant={"outline"}
      className="text-destructive !bg-destructive/10 !border-destructive/60 
                hover:!bg-destructive/60 hover:text-white/80"
      onClick={handleDeleteGoal}
      disabled={processing}
    >
      {!processing ? <Trash /> : <Loader2 className="animate-spin" />}
    </Button>
  );
};

export default DeleteGoal;
