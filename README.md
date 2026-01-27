# Live Auction Platform

A real-time auction platform built with React, Node.js, and Socket.io where multiple users can place bids on items and see updates instantly.

---

## Features

- Real-time bidding using Socket.io
- Live countdown timer synced with server time
- Winning / Outbid states for users
- Race condition handling (only the first valid bid is accepted)
- Instant UI updates and animations
- Responsive grid layout

---

## Tech Stack

**Frontend:** React, Tailwind CSS, Framer Motion  
**Backend:** Node.js, Express, Socket.io

---

## How It Works

- Backend sends auction items with an `endTime`
- Frontend calculates remaining time using server time
- When a bid is placed, the server validates and broadcasts updates to all clients
- UI updates instantly with Winning / Outbid status

---

## How to Run Locally

1. Clone the repository

```bash
git clone <your-repo-link>
```

2. Start backend

```bash
cd backend
npm install
node index.js
```

3. Start frontend

```bash
cd frontend
npm install
npm run dev
```

---

## How to Test Outbid Feature

1. Open the app in two browser windows (normal + incognito)

2. Place a bid on the same item from both windows

3. The first user will see Winning, and the second will see Outbid

---

## Live Demo

Frontend: https://your-vercel-link.vercel.app

Backend: https://your-render-link.onrender.com
