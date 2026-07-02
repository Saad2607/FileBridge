const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");

const { uploadFile, getFiles } = require("../controllers/fileController");

router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/", verifyToken, getFiles);

module.exports = router;