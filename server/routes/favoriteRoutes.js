const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const { getFavorites } = require("../controllers/favoriteController");

router.get("/", verifyToken, getFavorites);

module.exports = router;