const express = require("express");
const router = express.Router();
const {} = require("../controllers/volunteerSlots");

// READ: Get slot vacancies for the month
router.put("/vacancies");

// CREATE:
router.post("/new");

module.exports = router;
