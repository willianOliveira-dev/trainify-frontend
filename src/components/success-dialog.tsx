// components/workout-day/success-dialog.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelayMs?: number; 
  title?: string;
  message?: string;
}

export function SuccessDialog({
  isOpen,
  onClose,
  autoCloseDelayMs = 10000,
  title = "Parabéns!",
  message = "Treino concluído com sucesso. Continue assim!",
}: SuccessDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDelayMs);

    return () => clearTimeout(timer);
  }, [isOpen, onClose, autoCloseDelayMs]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: autoCloseDelayMs / 1000, ease: "linear" }}
              className="absolute top-0 left-0 right-0 h-1 bg-green-500 origin-left"
            />
            
            <div className="p-6 flex flex-col items-center text-center">

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.1 
                }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"
              >
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </motion.div>
              </motion.div>


              <motion.h5
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-tight text-2xl font-bold text-gray-900 dark:text-white mb-2"
              >
                {title}
              </motion.h5>


              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-tight text-gray-600 dark:text-gray-300 mb-6"
              >
                {message}
              </motion.p>


              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * 400 - 200,
                      y: -20,
                      rotate: 0,
                      scale: 0
                    }}
                    animate={{ 
                      x: Math.random() * 400 - 200,
                      y: 400,
                      rotate: 720,
                      scale: [0, 1, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2,
                      delay: 0.5 + Math.random() * 0.5,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                      left: '50%',
                    }}
                  />
                ))}
              </motion.div>


              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Continuar
              </motion.button>
            </div>


            <Button
              onClick={onClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="size-5" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}