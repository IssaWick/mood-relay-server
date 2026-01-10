import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ================================
// SERVER STATE (IN-MEMORY)
// ================================
let latestMood = "ROUND";
let lastUpdated = Date.now();

// ================================
// ROUTES
// ================================

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "Mood Relay Server",
    latestMood,
    lastUpdated
  });
});

// Python app sends mood here
app.post("/update-mood", (req, res) => {
  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({ error: "Mood is required" });
  }

  latestMood = String(mood).trim().toUpperCase();
  lastUpdated = Date.now();

  console.log(`[UPDATE] Mood set to: ${latestMood}`);

  res.json({
    success: true,
    mood: latestMood
  });
});

// ESP32 fetches mood from here
app.get("/get-mood", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ mood: latestMood });
});


// ================================
// START SERVER
// ================================
app.listen(PORT, () => {
  console.log("====================================");
  console.log(" Mood Relay Server RUNNING");
  console.log(` Port: ${PORT}`);
  console.log("====================================");
});
