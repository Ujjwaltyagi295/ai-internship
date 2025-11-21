// utils/toastUtils.ts
import { toast } from "sonner"
import { AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "error" | "success" | "info"

interface ToastOptions {
  title?: string
  description: string
  type?: ToastType
}

export const showAppToast = ({ title, description, type = "info" }: ToastOptions) => {
  let icon
  let color = ""

  switch (type) {
    case "error":
      icon = <AlertTriangle className="h-5 w-5 text-red-600" />
      color = "text-red-600"
      title = title || "Something went wrong"
      break
    case "success":
      icon = <CheckCircle2 className="h-5 w-5 text-green-600" />
      color = "text-green-600"
      title = title || "Success"
      break
    case "info":
    default:
      icon = <Info className="h-5 w-5 text-blue-600" />
      color = "text-blue-600"
      title = title || "Heads up"
      break
  }

  toast.custom(() => (
    <div className="flex flex-col gap-1 p-3 px-4 bg-neutral-950 text-white dark:bg-slate-950 shadow-md rounded-md border border-slate-200 dark:border-slate-800 ">
      <div className="flex items-center gap-2 font-medium">
        {icon}
        <span className={cn("text-sm", color)}>{title}</span>
      </div>
      <p className="text-sm text-white dark:text-slate-400">{description}</p>
    </div>
  ))
}