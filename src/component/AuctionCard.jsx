
import { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, XCircle, Gavel } from "lucide-react";
import Timer from "./Timer";

const AuctionCard = memo(function AuctionCard({ item, onBid, userId, now }) {
  const [isEnded, setIsEnded] = useState(false);
  const [isBidding, setIsBidding] = useState(false);

  // reset when new auction starts
  useEffect(() => {
    setIsEnded(false);
  }, [item.endTime]);

  // derive status instead of storing it
  const isWinning = item.lastBidder === userId;
  const isOutbid = item.lastBidder && item.lastBidder !== userId;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="relative rounded-3xl p-[1px]"
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
          <Timer
            key={item.endTime}
            endTime={item.endTime}
            now={now}
            onEnd={() => setIsEnded(true)}
          />
        </div>

        {/* Status */}
        <div className="mt-4 min-h-[2rem]">
          <AnimatePresence>
            {!isEnded && isWinning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm"
              >
                <Trophy size={16} /> You’re winning
              </motion.div>
            )}

            {!isEnded && isOutbid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-sm"
              >
                <XCircle size={16} /> Outbid
              </motion.div>
            )}

            {isEnded && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm"
              >
                🏁 Auction Ended
                {isWinning ? (
                  <span className="text-emerald-600 font-medium">You won</span>
                ) : (
                  <span className="text-rose-600 font-medium">You lost</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Button */}
        <motion.button
          disabled={isEnded || isBidding}
          onClick={() => {
            setIsBidding(true);
            onBid(item.id, item.currentBid);
            setTimeout(() => setIsBidding(false), 300);
          }}
          className={`mt-5 w-full py-3 rounded-xl font-medium transition-all
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
});

export default AuctionCard;
