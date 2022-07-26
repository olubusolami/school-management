const Student = require("./paymentModel");
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
  if (data) return res.status(200).json(data);
};

exports.verifyPayment = async (req, res) => {
  try {
    let reference = req.params.reference;
    const { error, data } = await paymentAxios.get(
      `/transaction/verify/${reference}`
    );
    if (error) return res.status(400).json({ error: "not verified" });
    if (data) return res.status(200).json({ message: "successful", data });
  } catch (err) {
    return { error: "Fetching Transaction was unsuccessful" };
  }
};

// exports.paidStudent = async (req, res) => {
//   Student.findByIdAndUpdate(
//     req.params.id,
//     {
//       paid: req.body.paid,
//     },
//     (err, student) => {
//       if (err) {
//         return res.status(500).json({ message: err });
//       } else if (!student) {
//         return res.status(404).json({ message: "student not found" });
//       } else {
//         student.save((err, savedstudent) => {
//           if (err) {
//             return res.status(400).json({ message: err });
//           } else {
//             return res
//               .status(200)
//               .json({ message: "student have paid fee" });
//           }
//         });
//       }
//     }
//   );
// };
