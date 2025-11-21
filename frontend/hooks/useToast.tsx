"use client"

import {  useCallback} from "react"
import { ToastNotification, type ToastType } from "@/components/ui/toast-notification"
import { createRoot } from "react-dom/client"

interface ToastOptions {
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

export function useToast() {
  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)

    // Create a container for the toast if it doesn't exist
    let toastContainer = document.getElementById("toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.id = "toast-container"
      toastContainer.className = "fixed bottom-0 right-0 z-50 p-4 space-y-4"
      document.body.appendChild(toastContainer)
    }

    // Create a div for this specific toast
    const toastDiv = document.createElement("div")
    toastDiv.id = `toast-${id}`
    toastContainer.appendChild(toastDiv)

    // Create and render the toast
    const root = createRoot(toastDiv)
    root.render(
      <ToastNotification
        {...options}
        onClose={() => {
          // Remove the toast element when closed
          root.unmount()
          toastDiv.remove()
          if (toastContainer && toastContainer.childNodes.length === 0) {
            toastContainer.remove()
          }
        }}
      />,
    )

    return id
  }, [])

  return { toast }
}