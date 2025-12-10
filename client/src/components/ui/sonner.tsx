import {
  CheckCircle2,
  AlertCircle,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="size-4 text-green-500" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <AlertCircle className="size-4 text-red-500" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-zinc-900 group-[.toaster]:to-zinc-950 group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-xl group-[.toaster]:rounded-none",
          title: "group-[.toast]:rounded-none",
          description:
            "group-[.toast]:text-zinc-400 group-[.toast]:rounded-none",
          actionButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-50 group-[.toast]:rounded-none group-[.toast]:border group-[.toast]:border-zinc-700",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-50 group-[.toast]:rounded-none group-[.toast]:border group-[.toast]:border-zinc-700",
          success:
            "group-[.toaster]:border-green-500/30 group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-zinc-900 group-[.toaster]:via-zinc-900 group-[.toaster]:to-green-950/20 group-[.toaster]:rounded-none",
          error:
            "group-[.toaster]:border-red-500/30 group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-zinc-900 group-[.toaster]:via-zinc-900 group-[.toaster]:to-red-950/20 group-[.toaster]:rounded-none",
        },
        style: {
          borderRadius: 0, // Force boxy style via inline style
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
