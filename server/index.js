// server/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data (mock database)
const users = [];
const tickers = ["GOOG", "AAPL", "TSLA", "META", "AMZN"];

app.post("/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  if (!users.includes(email)) users.push(email);
  return res.json({ message: "Login successful", email });
});

app.get("/tickers", (req, res) => {
  res.json(tickers);
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const userSubscriptions = {}; // { socket.id: ['GOOG', 'TSLA'] }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("subscribe", (tickers) => {
    userSubscriptions[socket.id] = tickers;
    console.log("Subscribed:", tickers);
  });

  socket.on("disconnect", () => {
    delete userSubscriptions[socket.id];
  });
});

// Function to generate random stock prices
function randomPrice(base = 100) {
  return (base + (Math.random() - 0.5) * 10).toFixed(2);
}

// Send updates every second
setInterval(() => {
  for (const [socketId, subs] of Object.entries(userSubscriptions)) {
    const updates = subs.map((t) => ({
      ticker: t,
      price: randomPrice(),
    }));
    io.to(socketId).emit("priceUpdate", updates);
  }
}, 1000);

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
