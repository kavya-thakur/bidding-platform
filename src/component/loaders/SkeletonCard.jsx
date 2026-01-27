import { motion } from "framer-motion";

export default function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-white shadow p-6 space-y-4">
      <motion.div
        className="h-4 w-1/2 bg-slate-200 rounded"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
      <motion.div
        className="h-8 w-3/4 bg-slate-200 rounded"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
      <motion.div
        className="h-10 w-full bg-slate-200 rounded-xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
    </div>
  );
}
