const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dbConnect = require("./_lib/db");

const authRoutes = require("./_lib/routes/auth");
const userRoutes = require("./_lib/routes/users");
const teamRoutes = require("./_lib/routes/team");
const brandRoutes = require("./_lib/routes/brands");
const contractBrandRoutes = require("./_lib/routes/contractBrand");
const materialBrandRoutes = require("./_lib/routes/materialBrand");
const contactRoutes = require("./_lib/routes/contact");
const subscriptionRoutes = require("./_lib/routes/subscriptions");
const analyticsRoutes = require("./_lib/routes/analytics");
const pagesRoutes = require("./_lib/routes/pages");

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json());

// Frontend e API condividono lo stesso dominio Vercel: nessun CORS necessario.

// Garantisce una connessione Mongo pronta prima di ogni richiesta
// (pattern serverless: la connessione viene riusata tra invocazioni quando possibile).
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    console.error("Errore connessione MongoDB:", err);
    res.status(503).json({ message: "Servizio temporaneamente non disponibile" });
  }
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Troppe richieste, riprova tra qualche minuto." },
});
app.use(globalLimiter);

app.get("/api", (req, res) => res.status(200).json({ status: "ok", service: "Liguria Design Group API" }));
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/analytics", analyticsRoutes);
app.use("/api/materialpage/brands", materialBrandRoutes);
app.use("/api/contract/brands", contractBrandRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/pages", pagesRoutes);

app.use((err, req, res, next) => {
  if (err.name === "MulterError" || err.message?.includes("Solo immagini")) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Errore interno del server" });
});

module.exports = app;
