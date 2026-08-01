const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const { createFolder, getFolders, deleteFolder, renameFolder } = require("../controllers/folderController");

router.post("/", verifyToken, createFolder);

router.get("/", verifyToken, getFolders);

router.delete("/:id", verifyToken, deleteFolder);

router.put("/:id", verifyToken, renameFolder);

module.exports = router;