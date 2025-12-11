import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-[0_0_5px_rgba(34,197,94,0.3)]",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
    success: "border-transparent bg-green-500/20 text-green-400 border border-green-500/50",
    warning: "border-transparent bg-yellow-500/20 text-yellow-400 border border-yellow-500/50",
    error: "border-transparent bg-red-500/20 text-red-400 border border-red-500/50",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
