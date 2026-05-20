const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../controller/contact.controller");

// POST: Send contact message via EmailJS securely
router.post("/", sendContactEmail);

module.exports = router;