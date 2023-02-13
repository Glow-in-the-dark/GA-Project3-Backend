require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const users = require("./routers/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB(process.env.MONGODB_URI);

// Route to all user endpoints
app.use("/users", users);

app.listen(process.env.PORT, () => {
  console.log("server started on Port 5001");
});
