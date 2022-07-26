const Student = require("../student/studentModel");
const Payment = require("./paymentModel");
const config = process.env;
const MySecretKey = config.PAYSTACK_SECRET;
const axios = require("axios");
const paymentAxios = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${MySecretKey}`,
    "Content-Type": "application/json",
  },
});

exports.initializePayment = async (req, res) => {
  if (!req.body.amount)
    return res.status(422).json({ error: "Amount is required!" });
  if (!req.body.email)
    return res.status(422).json({ error: "Email field is required!" });
  const { error, data } = await paymentAxios.post("/transaction/initialize", {
    amount: req.body.amount * 100,
    email: req.body.email,
  });

  if (error) return res.status(400).json(error);
  if (data) {
    const payment = await Payment.create({
      amount: req.body.amount,
      email: req.body.email,
      reference: data.data.reference,
    });
    if (payment) data.data.payment = payment;
    return res.status(200).json(data);
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    let reference = req.params.reference;
    const { error, data } = await paymentAxios.get(
      `/transaction/verify/${reference}`
    );
    if (error) return res.status(400).json({ error: "not verified" });
    if (data) {
      if (data.data.status != "success")
        return res.status(200).json({
          message: `Your payment status is still ${data.data.status}`,
        });
      const paymentDetails = await Payment.findOne({ reference });
      if (!paymentDetails)
        return res
          .status(404)
          .json({ error: "Payment with reference not found" });
      const studentPaymentUpdate = await Student.findOneAndUpdate(
        { email: paymentDetails.email },
        { paid: "yes" }
      );
      if (!studentPaymentUpdate)
        return res
          .status(500)
          .json({ error: "Unable to update student payment, Try again!" });

      return res.status(200).json({ message: "successful", data });
    }
  } catch (err) {
    return { error: "Transaction was unsuccessful" };
  }
};
