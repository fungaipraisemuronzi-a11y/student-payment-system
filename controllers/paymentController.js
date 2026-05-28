const db = require("../database");

/* ADD PAYMENT */
exports.addPayment = async (req, res) => {
  const { student_id, period_id, amount } = req.body;

  await db.query(
    "INSERT INTO payments(student_id, period_id, amount) VALUES($1,$2,$3)",
    [student_id, period_id, amount]
  );

  res.redirect("/period/" + period_id);
};

/* UPDATE PAYMENT */
exports.updatePayment = async (req, res) => {
  const {
    payment_id,
    amount,
    period_id,
    student_id
  } = req.body;

  await db.query(
    "UPDATE payments SET amount=$1 WHERE id=$2",
    [amount, payment_id]
  );

  res.redirect(`/student/${student_id}/${period_id}`);
};