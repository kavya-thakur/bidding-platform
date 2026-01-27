const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

// In-memory auction items
let items = [
  {
    id: 1,
    title: "Apple iPhone 15 Pro",
    startingPrice: 80000,
    currentBid: 80000,
    endTime: Date.now() + 10 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 2,
    title: "MacBook Air M2",
    startingPrice: 95000,
    currentBid: 95000,
    endTime: Date.now() + 12 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 3,
    title: "Sony WH-1000XM5 Headphones",
    startingPrice: 25000,
    currentBid: 25000,
    endTime: Date.now() + 8 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 4,
    title: "Samsung 55-inch 4K Smart TV",
    startingPrice: 60000,
    currentBid: 60000,
    endTime: Date.now() + 15 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 5,
    title: "Apple Watch Series 9",
    startingPrice: 35000,
    currentBid: 35000,
    endTime: Date.now() + 9 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 6,
    title: "PlayStation 5 Console",
    startingPrice: 50000,
    currentBid: 50000,
    endTime: Date.now() + 11 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 7,
    title: "Canon EOS R10 Mirrorless Camera",
    startingPrice: 70000,
    currentBid: 70000,
    endTime: Date.now() + 14 * 60 * 1000,
    lastBidder: null,
  },
  {
    id: 8,
    title: "Dyson Airwrap Styler",
    startingPrice: 42000,
    currentBid: 42000,
    endTime: Date.now() + 7 * 60 * 1000,
    lastBidder: null,
  },
];

// REST API
app.get("/items", (req, res) => {
  res.json(items);
});

// Socket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("BID_PLACED", ({ itemId, bidAmount, userId }) => {
    console.log("Bid received:", itemId, bidAmount, userId);

    const item = items.find((i) => i.id === itemId);

    if (!item) {
      socket.emit("BID_ERROR", "Item not found");
      return;
    }

    const now = Date.now();

    if (now > item.endTime) {
      socket.emit("BID_ERROR", "Auction ended");
      return;
    }

    if (bidAmount <= item.currentBid) {
      socket.emit("OUTBID", { itemId });
      return;
    }

    // Accept bid
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
