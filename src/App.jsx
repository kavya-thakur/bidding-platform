import { useEffect, useState, useCallback } from "react";
import { socket } from "./services/socket";
import AuctionGrid from "./component/AuctionGrid";
import ToastContainer from "./component/ToastContainer";
import SkeletonCard from "./component/loaders/SkeletonCard";
import { motion } from "framer-motion";
import AmbientBackground from "./component/background/AmbientBackground";

function App() {
  const [items, setItems] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(() => {
    const saved = localStorage.getItem("userId");
    if (saved) return saved;
    const newId = Math.random().toString(36).substring(2, 7);
    localStorage.setItem("userId", newId);
    return newId;
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/items`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    socket.on("UPDATE_BID", (data) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === data.itemId
            ? { ...item, currentBid: data.currentBid, lastBidder: data.userId }
            : item,
        ),
      );

      if (data.userId === userId) {
        showToast("Bid placed successfully", "success");
      } else {
        showToast("You were outbid", "error");
      }
    });

    return () => socket.off("UPDATE_BID");
  }, [userId]);
  useEffect(() => {
    socket.on("RESET_ITEMS", (data) => {
      console.log("RESET_ITEMS received", data);
      setItems(data);
      showToast("Auctions reset", "success");
    });

    return () => socket.off("RESET_ITEMS");
  }, []);

  const showToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 500);
  };

  // const placeBid = (itemId, currentBid) => {
  //   socket.emit("BID_PLACED", {
  //     itemId,
  //     bidAmount: currentBid + 10,
  //     userId,
  //   });
  // };
  const placeBid = useCallback(
    (itemId, currentBid) => {
      socket.emit("BID_PLACED", {
        itemId,
        bidAmount: currentBid + 10,
        userId,
      });
    },
    [userId],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa] text-slate-800 px-3">
      {/* Ambient background pattern */}
      <AmbientBackground />
      {/* Floating Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-4 mx-auto max-w-6xl px-6 py-3 
             backdrop-blur-xl bg-white/70 border border-slate-200 
             rounded-2xl shadow-sm z-90"
      >
        <div className=" relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-indigo-500" />
            <span className="font-semibold text-slate-800 tracking-tight">
              AuctionOS
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-500">
            <span className="hover:text-slate-900 transition cursor-pointer">
              Dashboard
            </span>
            <span className="hover:text-slate-900 transition cursor-pointer">
              Live
            </span>
            <span className="hover:text-slate-900 transition cursor-pointer">
              Activity
            </span>
          </nav>

          <div className="text-xs text-slate-400">User: {userId}</div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="z-90 relative max-w-6xl mx-auto px-3 pt-16 pb-10"
      >
        <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
          Place your bid in real time
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">
          Compete with other users in the final seconds of live auctions.
          Updates are synchronized instantly across all clients.
        </p>
        <button
          className="mt-3 cursor-pointer bg-neutral-200 px-4 py-2 rounded-xl"
          onClick={async () => {
            await fetch(`${import.meta.env.VITE_API_URL}/reset`, {
              method: "POST",
            });

            const res = await fetch(`${import.meta.env.VITE_API_URL}/items`);
            const data = await res.json();
            setItems(data);
          }}
        >
          Reset Auctions (Demo)
        </button>
      </motion.section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            <AuctionGrid items={items} onBid={placeBid} userId={userId} />
          </motion.div>
        )}
      </main>

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default App;
