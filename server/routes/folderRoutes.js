const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const { createFolder, getFolders } = require("../controllers/folderController");

router.post("/", verifyToken, createFolder);
router.get("/", verifyToken, getFolders);

module.exports = router;