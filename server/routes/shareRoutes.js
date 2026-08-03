const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const { createShareLink, getSharedFile, disableShare, getShareInfo, getSharedFiles } = require("../controllers/shareController");

router.post("/:id", verifyToken, createShareLink);

router.get("/:token", getShareInfo);

router.get("/:token/download", getSharedFile);

router.patch("/:id/disable", verifyToken, disableShare);

router.get("/", verifyToken, getSharedFiles);

module.exports = router;