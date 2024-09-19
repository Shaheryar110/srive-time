const express = require("express");
const cors = require("cors");
const app = express();
const stripe = require("stripe")(
  "sk_test_51P2FrVRxtMIfYHGVHsANuSOsWDyRutmSBkuEy215Q6G6htFXR9WQlmgPfejhYophKhyYZitF085nyJzO0DgK8XMa00Xc3jYIpv"
);
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "cpanel14.olivelogo.com",
  port: 465,
  secure: true,
  auth: {
    user: "hugheyhartman@gmail.com", // Replace with your email
    pass: "kqfb zaqm ipeg jlbu", // Replace with your email password
  },
});

const port = 5001;
app.use(express.json());

var corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Authenticate DB connection

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/drive-time/create-payment-intent", async (req, res) => {
  console.log(req.body, "rq");
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});
app.post("/send-email", async (req, res) => {
  const { email, name, phone, message, selectedDay, selectedTime } = req.body;

  const mailOptions = {
    from: email, // User's email as the sender
    to: "hugheyhartman@gmail.com", // Replace with admin's email
    subject: "Your Appointment Has Been Schedeule ",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}\nSchedule Day and Time: ${selectedDay} - ${selectedTime}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

// Use CORS and routes

// Start the server using HTTP
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
