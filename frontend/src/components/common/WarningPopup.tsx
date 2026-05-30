import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WarningPopupProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const WarningPopup: React.FC<WarningPopupProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = "Sort & Continue",
  cancelText = "Cancel"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card max-w-md w-full p-8 rounded-[32px] border-yellow-500/30 bg-[#151515] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <button onClick={onCancel} className="text-white/20 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-yellow-500">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-syne font-bold">Optimization Required</h3>
                <p className="text-white/50 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onConfirm}
                  className="flex-grow bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {confirmText}
                </button>
                <button
                  onClick={onCancel}
                  className="flex-grow bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WarningPopup;
