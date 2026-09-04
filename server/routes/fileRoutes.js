const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");

const {
    uploadFile,
    getFiles,
    downloadFile,
    deleteFile,
    renameFile,
    toggleFavoriteFile,
    previewFile,
    updateFileContent,
    updateFileTags,
    batchUpdateTags,
    getFileVersions,
    restoreFileVersion,
} = require("../controllers/fileController");

router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/", verifyToken, getFiles);

router.get("/download/:id", verifyToken, downloadFile);
router.get("/preview/:id", previewFile);

router.delete("/:id", verifyToken, deleteFile);

router.put("/:id/content", verifyToken, updateFileContent);
router.put("/:id", verifyToken, renameFile);

router.patch("/favorite/:id", verifyToken, toggleFavoriteFile);

// Tags Management
router.patch("/:id/tags", verifyToken, updateFileTags);
router.post("/batch-tags", verifyToken, batchUpdateTags);

// File Revision History & Version Control
router.get("/:id/versions", verifyToken, getFileVersions);
router.post("/:id/versions/:versionId/restore", verifyToken, restoreFileVersion);

module.exports = router;