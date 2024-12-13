require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

const corsOptions = {
  origin: '*',
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const materialBrandRoutes = require("./routes/materialBrand");
app.use("/api/materialpage/brands", materialBrandRoutes);
const contractBrandRoutes = require("./routes/contractBrand");
app.use("/api/contract/brands", contractBrandRoutes);

const contactRoutes = require("./routes/contact");
const subscriptionRoutes = require("./routes/subscriptions");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const teamRoutes = require("./routes/team");
const brandRoutes = require("./routes/brands");
const fairRoutes = require("./routes/fairs");

app.use("/api/contact", contactRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/fairs", fairRoutes);

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
