const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://bidding-platform-one.vercel.app",
  "http://localhost:5173",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// In-memory auction items
let items = [
  {
    id: 1,
    title: "Apple iPhone 15 Pro",
    startingPrice: 999,
    currentBid: 999,
    endTime: Date.now() + 1 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 2,
    title: "MacBook Air M2 ",
    startingPrice: 1399,
    currentBid: 1399,
    endTime: Date.now() + 2 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 3,
    title: "Sony Noise Cancelling Headphones",
    startingPrice: 299,
    currentBid: 299,
    endTime: Date.now() + 9 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 4,
    title: "Samsung Tv",
    startingPrice: 799,
    currentBid: 799,
    endTime: Date.now() + 18 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 5,
    title: "Apple Watch Ultra",
    startingPrice: 799,
    currentBid: 799,
    endTime: Date.now() + 10 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 6,
    title: "PlayStation 5 r",
    startingPrice: 549,
    currentBid: 549,
    endTime: Date.now() + 14 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 7,
    title: "Canon Mirrorless Camera ",
    startingPrice: 999,
    currentBid: 999,
    endTime: Date.now() + 16 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 8,
    title: "Dyson Airwrap Complete Long",
    startingPrice: 599,
    currentBid: 599,
    endTime: Date.now() + 8 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 9,
    title: "Nike Air Jordan ",
    startingPrice: 350,
    currentBid: 350,
    endTime: Date.now() + 11 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 10,
    title: "Rolex Oyster Perpetual",
    startingPrice: 8500,
    currentBid: 8500,
    endTime: Date.now() + 20 * 60 * 1000,
    lastBidder: null,
  },
];
// REST API
app.get("/items", (req, res) => {
  res.json(items);
});

// Reset endpoint (for demo)
app.post("/reset", (req, res) => {
  items = items.map((item) => ({
    ...item,
    currentBid: item.startingPrice,
    lastBidder: null,
    endTime: Date.now() + 2 * 60 * 1000, // reset to 10 minutes
  }));

  io.emit("RESET_ITEMS", items);
  res.json({ message: "Auctions reset" });
});

// Socket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("BID_PLACED", ({ itemId, bidAmount, userId }) => {
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      socket.emit("BID_ERROR", "Item not found");
      return;
    }

    if (Date.now() > item.endTime) {
      socket.emit("BID_ERROR", "Auction ended");
      return;
    }

    if (bidAmount <= item.currentBid) {
      socket.emit("OUTBID", { itemId });
      return;
    }

    // Accept bid (race condition handled by single-threaded Node)
    item.currentBid = bidAmount;
    item.lastBidder = userId;

    io.emit("UPDATE_BID", {
      itemId: item.id,
      currentBid: item.currentBid,
      userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
