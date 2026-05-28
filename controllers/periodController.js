const db = require("../database");

exports.instructionsPage = (req, res) => {
  res.render("instructions");
};  

/* HOME PAGE */
exports.homePage = async (req, res) => {
  const result = await db.query(
    "SELECT * FROM periods ORDER BY id DESC"
  );

  res.render("home", {
    periods: result.rows
  });
};

/* ADD PERIOD PAGE */
exports.addPeriodPage = (req, res) => {
  res.render("add-period");
};

/* CREATE PERIOD */
exports.addPeriod = async (req, res) => {
  const { name, target } = req.body;

  await db.query(
    "INSERT INTO periods(name, target_amount) VALUES($1,$2)",
    [name, target || 0]
  );

  res.redirect("/home");
};

/* PERIOD DETAILS */
exports.periodDetails = async (req, res) => {
  const { id } = req.params;

  const period = await db.query(
    "SELECT * FROM periods WHERE id=$1",
    [id]
  );

  const students = await db.query(
    "SELECT * FROM students"
  );

  const payments = await db.query(
    `SELECT student_id, SUM(amount) as total
     FROM payments
     WHERE period_id=$1
     GROUP BY student_id`,
    [id]
  );

  res.render("period-details", {
    period: period.rows[0],
    students: students.rows,
    payments: payments.rows
  });
};

/* UPDATE TARGET */
exports.updateTarget = async (req, res) => {
  const { period_id, target } = req.body;

  await db.query(
    "UPDATE periods SET target_amount=$1 WHERE id=$2",
    [target, period_id]
  );

  res.redirect("/period/" + period_id);
};

/* CREDIT PAGE */
exports.creditPage = async (req, res) => {
  const { periodId } = req.params;

  const period = await db.query(
    "SELECT * FROM periods WHERE id=$1",
    [periodId]
  );

  const students = await db.query(
    "SELECT * FROM students"
  );

  const payments = await db.query(
    `SELECT student_id, SUM(amount) as total
     FROM payments
     WHERE period_id=$1
     GROUP BY student_id`,
    [periodId]
  );

  res.render("credit", {
    period: period.rows[0],
    students: students.rows,
    payments: payments.rows
  });
};

/* ADVANCE PAGE */
exports.advancePage = async (req, res) => {
  const { periodId } = req.params;

  const period = await db.query(
    "SELECT * FROM periods WHERE id=$1",
    [periodId]
  );

  const students = await db.query(
    "SELECT * FROM students"
  );

  const payments = await db.query(
    `SELECT student_id, SUM(amount) as total
     FROM payments
     WHERE period_id=$1
     GROUP BY student_id`,
    [periodId]
  );

  res.render("advance", {
    period: period.rows[0],
    students: students.rows,
    payments: payments.rows
  });
};