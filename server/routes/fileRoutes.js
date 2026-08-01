const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");

const { uploadFile, getFiles, downloadFile, deleteFile } = require("../controllers/fileController");

router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/", verifyToken, getFiles);

router.get("/download/:id", verifyToken, downloadFile);

router.delete("/:id", verifyToken, deleteFile);

module.exports = router;