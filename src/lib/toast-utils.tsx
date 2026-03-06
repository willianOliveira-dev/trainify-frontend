"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { toast as sonnerToast } from "sonner";

export type ToastType = "default" | "success" | "error" | "warning" | "info";

interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  position?: "top-center" | "bottom-center" | "top-right" | "bottom-right";
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

const getToastConfig = (type: ToastType = "default") => {
  const configs = {
    default: {
      gradient: "from-gray-600 to-gray-700",
      icon: Info,
      iconColor: "text-gray-100",
      ButtonBg: "bg-white text-gray-700 hover:bg-gray-50",
    },
    success: {
      gradient: "from-green-500 to-green-600",
      icon: CheckCircle2,
      iconColor: "text-white",
      ButtonBg: "bg-white text-green-600 hover:bg-green-50",
    },
    error: {
      gradient: "from-red-500 to-red-600",
      icon: AlertCircle,
      iconColor: "text-white",
      ButtonBg: "bg-white text-red-600 hover:bg-red-50",
    },
    warning: {
      gradient: "from-yellow-500 to-yellow-600",
      icon: AlertTriangle,
      iconColor: "text-white",
      ButtonBg: "bg-white text-yellow-600 hover:bg-yellow-50",
    },
    info: {
      gradient: "from-blue-500 to-blue-600",
      icon: Info,
      iconColor: "text-white",
      ButtonBg: "bg-white text-blue-600 hover:bg-blue-50",
    },
  };

  return configs[type];
};

export const showToast = ({
  title,
  description,
  type = "default",
  duration = 8000,
  position = "bottom-right",
  action,
  secondaryAction,
  onDismiss,
}: ToastOptions) => {
  const config = getToastConfig(type);
  const Icon = config.icon;
  sonnerToast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={cn(
          "bg-linear-to-r text-white rounded-xl shadow-2xl p-3 flex items-start gap-4 max-w-md border border-white/20",
          config.gradient
        )}
      >
        <div className={cn("w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0", config.iconColor)}>
          <Icon className="size-5" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-md">{title}</h4>
          {description && (
            <p className="text-xs text-white/90 mt-1 leading-relaxed">
              {description}
            </p>
          )}
          
          {(action || secondaryAction) && (
            <div className="flex items-center gap-3 mt-3">
              {action && (
                <Button
                  onClick={() => {
                    sonnerToast.dismiss(t);
                    action.onClick();
                  }}
                  className={cn(
                    "font-semibold px-2 py-1 rounded-lg text-xs transition-colors shadow-md",
                    config.ButtonBg
                  )}
                >
                  {action.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    sonnerToast.dismiss(t);
                    secondaryAction.onClick();
                  }}
                  className="text-white/80 hover:text-white hover:bg-transparent text-xs font-medium underline-offset-2 hover:underline transition-all"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
        
        <Button
           variant="ghost"
          onClick={() => {
            sonnerToast.dismiss(t);
            onDismiss?.();
          }}
          className="absolute hover:bg-transparent hover:text-white top-3 right-3 text-white/70 hover:text-white"
        >
          <X className="size-4" />
        </Button>
      </motion.div>
    ),
    {
      duration,
      position,
    }
  );
};


export const toast = {
  default: (options: Omit<ToastOptions, "type">) => showToast({ ...options, type: "default" }),
  success: (options: Omit<ToastOptions, "type">) => showToast({ ...options, type: "success" }),
  error: (options: Omit<ToastOptions, "type">) => showToast({ ...options, type: "error" }),
  warning: (options: Omit<ToastOptions, "type">) => showToast({ ...options, type: "warning" }),
  info: (options: Omit<ToastOptions, "type">) => showToast({ ...options, type: "info" }),
};