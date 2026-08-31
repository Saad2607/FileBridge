const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDeletedFolders,
    getDeletedFiles,
    restoreFolder,
    restoreFile,
    deleteFolderForever,
    deleteFileForever } = require("../controllers/recycleBinController");

router.get("/folders", verifyToken, getDeletedFolders);

router.get("/files", verifyToken, getDeletedFiles);

router.patch("/folders/:id/restore", verifyToken, restoreFolder);

router.patch("/files/:id/restore", verifyToken, restoreFile);

router.delete("/folders/:id", verifyToken, deleteFolderForever);

router.delete("/files/:id", verifyToken, deleteFileForever);

module.exports = router;