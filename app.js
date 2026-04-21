const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();
const db = require("./database");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

/* LOGIN PAGE */
app.get("/", (req, res) => {
  res.render("login");
});

/* LOGIN POST */
app.post("/login", (req, res) => {
  const { password } = req.body;

  if (password === process.env.PASSWORD) {
    req.session.loggedIn = true;
    res.redirect("/home");
  } else {
    res.send("Wrong password");
  }
});

/* AUTH MIDDLEWARE */
function checkAuth(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/");
  }
}

/* HOME PAGE */
app.get("/home", checkAuth, async (req, res) => {
  const result = await db.query("SELECT * FROM periods ORDER BY id DESC");
  res.render("home", { periods: result.rows });
});

/* ADD STUDENT PAGE */
app.get("/add-student", checkAuth, async (req, res) => {
  const result = await db.query("SELECT * FROM students ORDER BY id DESC");
  res.render("add-student", { students: result.rows });
});

/* ADD STUDENT */
app.post("/add-student", checkAuth, async (req, res) => {
  const { name } = req.body;

  if (name) {
    await db.query("INSERT INTO students(name) VALUES($1)", [name]);
  }

  res.redirect("/add-student");
});

/* DELETE STUDENT */
app.get("/delete-student/:id", checkAuth, async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM students WHERE id=$1", [id]);

  res.redirect("/add-student");
});

/* ADD PERIOD PAGE */
app.get("/add-period", checkAuth, (req, res) => {
  res.render("add-period");
});

/* CREATE PERIOD */
app.post("/add-period", checkAuth, async (req, res) => {
  const { name, target } = req.body;

  await db.query(
    "INSERT INTO periods(name, target_amount) VALUES($1,$2)",
    [name, target || 0]
  );

  res.redirect("/home");
});

/* PERIOD DETAILS PAGE */
app.get("/period/:id", checkAuth, async (req, res) => {
  const { id } = req.params;

  const period = await db.query(
    "SELECT * FROM periods WHERE id=$1",
    [id]
  );

  const students = await db.query("SELECT * FROM students");

  const payments = await db.query(
    "SELECT student_id, SUM(amount) as total FROM payments WHERE period_id=$1 GROUP BY student_id",
    [id]
  );

  res.render("period-details", {
    period: period.rows[0],
    students: students.rows,
    payments: payments.rows
  });
});

app.post("/add-payment", checkAuth, async (req, res) => {
  const { student_id, period_id, amount } = req.body;

  await db.query(
    "INSERT INTO payments(student_id, period_id, amount) VALUES($1,$2,$3)",
    [student_id, period_id, amount]
  );

  res.redirect("/period/" + period_id);
});

app.post("/update-target", checkAuth, async (req, res) => {
  const { period_id, target } = req.body;

  await db.query(
    "UPDATE periods SET target_amount=$1 WHERE id=$2",
    [target, period_id]
  );

  res.redirect("/period/" + period_id);
});

//STUDENT PAYMENTS DETAILS

app.get("/student/:studentId/:periodId", checkAuth, async (req, res) => {
  const { studentId, periodId } = req.params;

  const student = await db.query(
    "SELECT * FROM students WHERE id=$1",
    [studentId]
  );

  const payments = await db.query(
    "SELECT * FROM payments WHERE student_id=$1 AND period_id=$2 ORDER BY created_at DESC",
    [studentId, periodId]
  );

  res.render("student-details", {
    student: student.rows[0],
    payments: payments.rows,
    periodId: periodId   // <-- ADD THIS
  });
});

//CREDITS PAGE
app.get("/credit/:periodId", checkAuth, async (req, res) => {
  const { periodId } = req.params;

  const period = await db.query(
    "SELECT * FROM periods WHERE id=$1",
    [periodId]
  );

  const students = await db.query("SELECT * FROM students");

  const payments = await db.query(
    "SELECT student_id, SUM(amount) as total FROM payments WHERE period_id=$1 GROUP BY student_id",
    [periodId]
  );

  res.render("credit", {
    period: period.rows[0],
    students: students.rows,
    payments: payments.rows
  });
});

//IN ADVANCE PAYMENTS PAGE
app.get("/advance/:periodId", checkAuth, async (req, res) => {
  const { periodId } = req.params;

  const period = await db.query(
    "SELECT * FROM periods WHERE id=$1",
    [periodId]
  );

  const students = await db.query("SELECT * FROM students");

  const payments = await db.query(
    "SELECT student_id, SUM(amount) as total FROM payments WHERE period_id=$1 GROUP BY student_id",
    [periodId]
  );

  res.render("advance", {
    period: period.rows[0],
    students: students.rows,
    payments: payments.rows
  });
});

//UPDATE PAYMENT
app.post("/update-payment", checkAuth, async (req, res) => {
  const { payment_id, amount, period_id, student_id } = req.body;

  await db.query(
    "UPDATE payments SET amount=$1 WHERE id=$2",
    [amount, payment_id]
  );

  res.redirect(`/student/${student_id}/${period_id}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});