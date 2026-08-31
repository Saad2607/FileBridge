const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDashboardStats,
    getDashboardAnalytics
} = require("../controllers/dashboardController");

router.get(
    "/stats",
    verifyToken,
    getDashboardStats
);

router.get(
    "/analytics",
    verifyToken,
    getDashboardAnalytics
);

module.exports = router;