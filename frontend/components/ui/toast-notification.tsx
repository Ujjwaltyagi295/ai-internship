"use client";

import { motion, useAnimation } from "framer-motion";
import { AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export const CheckCircle = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      pathLength: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    });
  }, [controls]);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-circle-check-big-icon lucide-circle-check-big"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={controls}
        d="M21.801 10A10 10 0 1 1 17 3.335"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={controls}
        d="M9 11l3 3L22 4"
      />
    </motion.svg>
  );
};

interface ToastNotificationProps {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  isVisible?: boolean;
}

const toastVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as any, // cast here to fix TS error
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as any, // cast here to fix TS error
    },
  },
};

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-500",
    borderColor: "border-emerald-400",
    bgGlow: "bg-emerald-500/10 dark:bg-emerald-500/20",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-500",
    textColor: "text-red-500",
    borderColor: "border-red-400",
    bgGlow: "bg-red-500/10 dark:bg-red-500/20",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-400",
    bgGlow: "bg-blue-500/10 dark:bg-blue-500/20",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-500",
    textColor: "text-amber-500",
    borderColor: "border-amber-400",
    bgGlow: "bg-amber-500/10 dark:bg-amber-500/20",
  },
};

export function ToastNotification({
  title,
  description,
  type = "success",
  duration = 5000,
  onClose,
  isVisible = true,
}: ToastNotificationProps) {
  const [visible, setVisible] = useState(isVisible);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 max-w-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={toastVariants}
    >
      <div className="w-full p-4 rounded-lg bg-zinc-900 dark:bg-white border border-zinc-800 dark:border-zinc-200 backdrop-blur-sm shadow-lg">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <motion.div
              className={`absolute inset-0 blur-xl rounded-full ${config.bgGlow}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.8,
                ease: "easeOut",
              }}
            />
            <div className={`relative z-10 p-1 rounded-full ${config.textColor}`}>
              <Icon size={20} />
            </div>
          </div>

          <div className="flex-1 pt-0.5">
            <h3 className="font-medium text-zinc-100 dark:text-zinc-900">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">{description}</p>
            )}
          </div>

          <button
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="flex-shrink-0 text-zinc-400 hover:text-zinc-100 dark:hover:text-zinc-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
