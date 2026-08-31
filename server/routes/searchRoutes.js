const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const { search } = require("../controllers/searchController");

router.get("/", verifyToken, search);

module.exports = router;