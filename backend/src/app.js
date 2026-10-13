require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { clerkMiddleware, getAuth } = require("@clerk/express");

const placeRoutes = require("./Routes/pleace.routes");
const commentRoutes = require("./Routes/comment.routes");
const userRoutes = require("./Routes/user.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(morgan("dev"));
app.use(cors({ origin: allowedOrigins, credentials: true }));
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
    authOnReq: req.auth ?? null,
  });
});

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
app.use("/api", commentRoutes);
app.use("/api", userRoutes);

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
