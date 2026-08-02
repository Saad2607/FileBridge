const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {createShareLink, getSharedFile} = require("../controllers/shareController");

router.post("/:id", verifyToken, createShareLink);

router.get("/:token", getSharedFile);

module.exports = router;