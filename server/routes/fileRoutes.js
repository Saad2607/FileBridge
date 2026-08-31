const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");

const { uploadFile, getFiles, downloadFile, deleteFile, renameFile, toggleFavoriteFile, previewFile } = require("../controllers/fileController");

router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/", verifyToken, getFiles);

router.get("/download/:id", verifyToken, downloadFile);
router.get("/preview/:id", previewFile);

router.delete("/:id", verifyToken, deleteFile);

router.put("/:id", verifyToken, renameFile);

router.patch("/favorite/:id", verifyToken, toggleFavoriteFile);

module.exports = router;