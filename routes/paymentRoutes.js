const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

/* ADD PAYMENT */
router.post(
  "/add-payment",
  paymentController.addPayment
);

/* UPDATE PAYMENT */
router.post(
  "/update-payment",
  paymentController.updatePayment
);

module.exports = router;