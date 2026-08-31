const File = require("../models/File");
const path = require("path");
const { logUserActivity } = require("../utils/activityLogger");

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

        logUserActivity({
            user: req.user.id,
            action: "UPLOAD_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
            metadata: { size: file.size, mimeType: file.mimeType },
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

        const files = await File.find({
            ...query,
            isDeleted: false,
        }).sort({
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

const downloadFile = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: false,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        logUserActivity({
            user: req.user.id,
            action: "DOWNLOAD_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
        });

        const filePath = path.resolve(file.path);

        res.download(
            filePath,
            file.originalName
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to download file.",
        });
    }
};

const deleteFile = async (req, res) => {

    try {

        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: false,
        });

        if (!file) {

            return res.status(404).json({
                success: false,
                message: "File not found.",
            });

        }

        file.isDeleted = true;

        file.deletedAt = new Date();

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "DELETE_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
        });

        res.status(200).json({
            success: true,
            message: "File moved to Recycle Bin.",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete file.",
        });

    }

};

const renameFile = async (req, res) => {
    try {
        const { originalName } = req.body;

        if (!originalName || !originalName.trim()) {
            return res.status(400).json({
                success: false,
                message: "File name is required.",
            });
        }

        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: false,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        const oldName = file.originalName;
        file.originalName = originalName.trim();

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "RENAME_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
            metadata: { oldName },
        });

        res.status(200).json({
            success: true,
            message: "File renamed successfully.",
            file,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to rename file.",
        });
    }
};

const toggleFavoriteFile = async (req, res) => {

    try {

        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: false,
        });

        if (!file) {

            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        file.favorite = !file.favorite;

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: file.favorite ? "FAVORITE_FILE" : "UNFAVORITE_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
        });

        res.status(200).json({
            success: true,
            favorite: file.favorite,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to update favorite.",
        });
    }
};

module.exports = { uploadFile, getFiles, downloadFile, deleteFile, renameFile, toggleFavoriteFile };