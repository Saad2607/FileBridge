const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {getRecentActivities} = require("../controllers/activityController");
router.get("/", verifyToken, getRecentActivities);

module.exports = router;