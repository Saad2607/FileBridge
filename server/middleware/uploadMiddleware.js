const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/files");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/files");
    },

    filename: (req, file, cb) => {
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uniqueName = Date.now() + "_" + sanitized;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
});

module.exports = upload;