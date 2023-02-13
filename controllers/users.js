require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const Users = require("../models/Users");

// Create new user:
// Required in req.body: name, mobie_number,email, password, gender, date_of_birth, organisation, occupation
async function createNewUser(req, res) {
  try {
    // Check if username is already in use
    const user = await Users.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ status: "error", message: "duplicate email" });
    }

    // If no duplicate, create new account
    const hash = await bcrypt.hash(req.body.password, 12);
    const newUser = new Users({
      name: req.body.name,
      mobile_number: req.body.mobile_number,
      email: req.body.email,
      hash: hash,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
      organisation: req.body.organisation,
      occupation: req.body.occupation,
    });

    await newUser.save();
    console.log("created user is: ", newUser);
    res.json({ status: "okay", message: "user created" });
  } catch (error) {
    console.log("PUT /users/create", error);
    res.status(400).json({ status: "error", message: "an error has occured" });
  }
}

// Login
async function login(req, res) {
  try {
    // Check if email exists in database
    const user = await Users.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "not authorised" });
    }

    // If email exists, check if password is correct (using bcrypt)
    const result = await bcrypt.compare(req.body.password, user.hash);
    if (!result) {
      return res
        .status(400)
        .json({ status: "error", message: "not authorised" });
    }

    // If email and password is correct:
    // Create JWT
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    // Generate your access token via JWT
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    // Generate your refresh token via JWT
    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30D",
      jwtid: uuidv4(),
    });

    const response = { access, refresh };

    res.json(response);
  } catch (error) {
    console.log("POST /users/login", error);
    res.status(400).json({ status: "error", message: "login failed" });
  }
}

// Generate refresh token
async function getRefreshToken(req, res) {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);

    const payload = {
      id: decoded.id,
      name: decoded.name,
    };

    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const response = { access };
    res.json(response);
  } catch (error) {
    console.log("POST /users/refresh", error);
    res.status(401).json({ status: "error", message: "unauthorised" });
  }
}

module.exports = {
  createNewUser,
  login,
  getRefreshToken,
};
