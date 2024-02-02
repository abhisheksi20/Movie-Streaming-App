const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connection is successful"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoute);

app.use("/api/users", userRoute);

app.listen(3000, () => {
  console.log("The backend Server is running");
});
