import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const ToastContext = React.createContext(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const addToast = React.useCallback((message, type = "default") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto dismiss
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-4 rounded-md border p-4 shadow-lg transition-all font-mono text-sm",
              toast.type === "default" && "bg-background border-border text-foreground",
              toast.type === "error" && "bg-destructive text-destructive-foreground border-destructive",
              toast.type === "success" && "bg-green-900/20 border-green-500/50 text-green-400",
              toast.type === "warning" && "bg-yellow-900/20 border-yellow-500/50 text-yellow-400"
            )}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-md p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
