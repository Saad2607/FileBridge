const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const { createShareLink, getSharedFile, disableShare, getShareInfo, getSharedFiles } = require("../controllers/shareController");

router.get("/", verifyToken, getSharedFiles);
router.post("/:id", verifyToken, createShareLink);
router.patch("/:id/disable", verifyToken, disableShare);
router.get("/:token", getShareInfo);
router.get("/:token/download", getSharedFile);

module.exports = router;