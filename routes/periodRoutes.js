const express = require("express");
const router = express.Router();

const periodController = require("../controllers/periodController");

/* HOME PAGE */
router.get(
  "/home",
  periodController.homePage
);

/* ADD PERIOD PAGE */
router.get(
  "/add-period",
  periodController.addPeriodPage
);

/* CREATE PERIOD */
router.post(
  "/add-period",
  periodController.addPeriod
);

/* PERIOD DETAILS */
router.get(
  "/period/:id",
  periodController.periodDetails
);

/* UPDATE TARGET */
router.post(
  "/update-target",
  periodController.updateTarget
);

/* CREDIT PAGE */
router.get(
  "/credit/:periodId",
  periodController.creditPage
);

/* ADVANCE PAGE */
router.get(
  "/advance/:periodId",
  periodController.advancePage
);

module.exports = router;