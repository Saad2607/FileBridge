const File = require("../models/File");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded.",
            });
        }

        const file = await File.create({
            originalName: req.file.originalname,
            storedName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            folder: req.body.folder || null,
            owner: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "File uploaded successfully.",
            file,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to upload file.",
        });
    }
};

const getFiles = async (req, res) => {
    try {
        const folder = req.query.folder || null;

        const query = {
            owner: req.user.id,
        };

        if (folder === null) {
            query.folder = null;
        } else {
            query.folder = folder;
        }

        const files = await File.find(query).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            files,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({ success: false, message: "Unable to fetch files." });
    }
};

module.exports = { uploadFile, getFiles };