const paymentRoutes = require("./routes/payment");
const express = require('express');
const stripe = require("stripe")('sk_test_51MG5mMSAjIDYdsb42ais3kMYuPNI1Rm8mtXndywsF77nujsxeKbOO0geDGj880pk91FLXURfg1xRcSXrjcTtOFdp008mcdMrbL');
const cors = require('cors');
const mongoose = require('mongoose');

const connect = async () => {
    try {
       await mongoose.connect("mongodb://localhost:27017/newdb", {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("database connected!");
    } catch (error) {
      console.log(error.message);
      process.exit;
    }
  };

  connect();

const app = express();

app.post(
    "/api/webhook",
    express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf.toString();
      },
    })
  );

app.use(express.json());
app.use(cors());

app.use("/api/", paymentRoutes);

app.listen(3008, () => {
    console.log('Server started on port 3000');
});

