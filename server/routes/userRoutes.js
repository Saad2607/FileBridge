const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

router.get("/me", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

module.exports = router;