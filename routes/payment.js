const express = require("express");
const router = express.Router();
const paymentController = require("../app/payment/paymentController");

//initialize payment
router.post("/transaction/initialize", paymentController.initializePayment);

//verify payment
router.get("/transaction/verify/:reference", paymentController.verifyPayment);

module.exports = router;
