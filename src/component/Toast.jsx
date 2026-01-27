import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className={`px-4 py-2 rounded-xl shadow-lg text-sm font-medium
        ${type === "success" && "bg-emerald-100 text-emerald-700"}
        ${type === "error" && "bg-rose-100 text-rose-600"}
      `}
    >
      {message}
    </motion.div>
  );
}
