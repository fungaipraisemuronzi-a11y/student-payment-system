const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");

router.get(
  "/add-student",
  studentController.addStudentPage
);

router.post(
  "/add-student",
  studentController.addStudent
);

router.get(
  "/delete-student/:id",
  studentController.deleteStudent
);

router.get(
  "/student/:studentId/:periodId",
  studentController.studentDetails
);

module.exports = router;