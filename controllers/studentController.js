const db = require("../database");

/* ADD STUDENT PAGE */
exports.addStudentPage = async (req, res) => {
  const result = await db.query(
    "SELECT * FROM students ORDER BY id DESC"
  );

  res.render("add-student", {
    students: result.rows
  });
};

/* ADD STUDENT */
exports.addStudent = async (req, res) => {
  const { name } = req.body;

  if (name) {
    await db.query(
      "INSERT INTO students(name) VALUES($1)",
      [name]
    );
  }

  res.redirect("/add-student");
};

/* DELETE STUDENT */
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  await db.query(
    "DELETE FROM students WHERE id=$1",
    [id]
  );

  res.redirect("/add-student");
};

/* STUDENT PAYMENT DETAILS */
exports.studentDetails = async (req, res) => {
  const { studentId, periodId } = req.params;

  const student = await db.query(
    "SELECT * FROM students WHERE id=$1",
    [studentId]
  );

  const payments = await db.query(
    `SELECT * FROM payments
     WHERE student_id=$1
     AND period_id=$2
     ORDER BY created_at DESC`,
    [studentId, periodId]
  );

  res.render("student-details", {
    student: student.rows[0],
    payments: payments.rows,
    periodId
  });
};