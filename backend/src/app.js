require("dotenv").config();
const express = require("express");

const cors = require("cors");
const morgan = require("morgan");
const { clerkMiddleware, getAuth } = require("@clerk/express");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.get("/whoami", (req, res) => {
  const { userId, sessionId, sessionClaims } = getAuth(req);
  res.json({
    success: true,
    data: {
      status: "ok",
      message: "backend ishladi!!!",
      timestamp: new Date().toISOString(),
    },
    userId,
    sessionId,
    hasClaims: !!sessionClaims,
    auth0nReq: req.auth ?? null,
  });
});

const placeRoutes = require("./Routes/pleace.routes");
app.get("/health", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});
app.use("/api/places", placeRoutes);
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not Found" });
});
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "ZodError") {
    return res.status(400).json({ success: false, error: err.issues });
  }
  res.status(err.status || 500).json({ success: false, error: err.message });
});
module.exports = app;
