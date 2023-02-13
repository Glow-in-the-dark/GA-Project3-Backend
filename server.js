require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
// const Users = require("./model/Users");
// const VolunteerSlots = require("./model/VolunteerSlots");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB(process.env.MONGODB_URI);

app.listen(process.env.PORT, () => {
  console.log("server started on Port 5001");
});
