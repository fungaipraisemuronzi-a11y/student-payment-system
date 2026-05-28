const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

/* ROUTES */
const studentRoutes = require("./routes/studentRoutes");
const periodRoutes = require("./routes/periodRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

/* MIDDLEWARE */
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* VIEW ENGINE */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* HOME REDIRECT */
app.get("/", (req, res) => {
  res.redirect("/home");
});

/* ROUTES */
app.use(studentRoutes);
app.use(periodRoutes);
app.use(paymentRoutes);

/* SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});