const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/files");
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "_" + file.originalname;
        
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
});

module.exports = upload;