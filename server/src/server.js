// server.js
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Spin Reward server!");
});

// API Routes
app.use("/api/rent", require("./routes/rent"));
app.use("/api/reserve", require("./routes/reserve"));
app.use("/api/rewards", require("./routes/rewards"));
app.use("/api/pay", require("./routes/pay"));
app.use("/api/return", require("./routes/return"));
app.use("/api/admin", require("./routes/admin"));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Port Config
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const HOST = process.env.HOST || "localhost";
  console.log(`🚀 Server is running on ${HOST}:${PORT}`);
});

// const express = require('express');
// const cors = require('cors');
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Welcome to the Express server!');
// });

// // Load routes
// // app.use('/api/bikeActions', require('./routes/bikeActions'));
// app.use('/api/rent', require('./routes/rent'));
// app.use('/api/reserve', require('./routes/reserve'));
// app.use('/api/rewards', require('./routes/rewards'));
// app.use('/api/pay', require('./routes/pay'));
// app.use('/api/admin', require('./routes/admin'));

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });