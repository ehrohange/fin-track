import type { ToastContentType } from "@/lib/types-index";
import { BadgeAlert, BadgeCheck, BadgeInfo, BadgeMinus } from "lucide-react";

const ToastContent = (props: ToastContentType) => {
  const { icon, message } = props;
  return (
    <div className="!w-full flex gap-4 items-center justify-center">
      {icon === "success" ? (
        <BadgeCheck className="text-primary" />
      ) : icon === "warning" ? (
        <BadgeMinus className="text-yellow-500" />
      ) : icon === "error" ? (
        <BadgeAlert className="text-destructive" />
      ) : (
        <BadgeInfo className="text-blue-400" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default ToastContent;
