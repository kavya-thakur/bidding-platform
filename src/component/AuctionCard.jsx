import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, XCircle, Gavel } from "lucide-react";
import Timer from "./Timer";

export default function AuctionCard({ item, onBid, userId }) {
  const [status, setStatus] = useState("idle");
  const [pulse, setPulse] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!item.lastBidder) return;

    if (item.lastBidder === userId) {
      setStatus("winning");
    } else {
      setStatus("outbid");
    }
  }, [item.lastBidder, userId]);
  useEffect(() => {
    if (!item.lastBidder) return;

    setPulse(true);
    const t = setTimeout(() => setPulse(false), 250);
    return () => clearTimeout(t);
  }, [item.currentBid]);

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="relative rounded-3xl p-[1px] "
    >
      <motion.div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-neutral-700 font-semibold">
            {item.title}
          </h3>
          <Gavel className="text-indigo-500" />
        </div>

        {/* Price */}
        <motion.p
          key={item.currentBid}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-indigo-600"
        >
          ${item.currentBid}
        </motion.p>

        {/* Timer */}
        <div className="mt-3">
          <Timer endTime={item.endTime} onEnd={() => setIsEnded(true)} />
        </div>

        {/* Status */}
        <div className="mt-4 h-8">
          <div className="mt-4 min-h-[2rem]">
            <AnimatePresence>
              {/* While running */}
              {status === "winning" && !isEnded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm"
                >
                  <Trophy size={16} /> You’re winning
                </motion.div>
              )}

              {status === "outbid" && !isEnded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-sm"
                >
                  <XCircle size={16} /> Outbid
                </motion.div>
              )}

              {/* When ended */}
              {isEnded && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm"
                >
                  🏁 Auction Ended
                  {item.lastBidder === userId ? (
                    <span className="text-emerald-600 font-medium">
                      You won
                    </span>
                  ) : (
                    <span className="text-rose-600 font-medium">You lost</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Button */}
        <motion.button
          // whileTap={{ scale: 0.96 }}
          disabled={isEnded}
          onClick={() => onBid(item.id, item.currentBid)}
          className={`mt-5 w-full py-3 rounded-xl cursor-pointer font-medium transition-all
            ${
              isEnded
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:shadow-lg hover:bg-indigo-600"
            }`}
        >
          {isEnded ? "Auction Ended" : "Place Bid + $10"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
