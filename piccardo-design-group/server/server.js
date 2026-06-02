require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());
app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Origine non consentita dal CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Troppe richieste, riprova tra qualche minuto." },
});
app.use(globalLimiter);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Content-Disposition", "inline");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

const materialBrandRoutes = require("./routes/materialBrand");
const contractBrandRoutes = require("./routes/contractBrand");
const contactRoutes = require("./routes/contact");
const subscriptionRoutes = require("./routes/subscriptions");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const teamRoutes = require("./routes/team");
const brandRoutes = require("./routes/brands");

app.use("/api/materialpage/brands", materialBrandRoutes);
app.use("/api/contract/brands", contractBrandRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/brands", brandRoutes);

app.use((err, req, res, next) => {
  if (err.name === "MulterError" || err.message?.includes("Solo immagini")) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Errore interno del server" });
});

const dbURI = process.env.MONGO_URI;
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
