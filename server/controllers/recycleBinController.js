const Folder = require("../models/Folder");
const File = require("../models/File");
const { logUserActivity } = require("../utils/activityLogger");

const fs = require("fs");

const getDeletedFolders = async (req, res) => {

    try {
        const folders = await Folder.find({
            owner: req.user.id,
            isDeleted: true,
        }).sort({
            deletedAt: -1,
        });

        res.status(200).json({
            success: true,
            folders,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch deleted folders.",
        });
    }
};

const getDeletedFiles = async (req, res) => {

    try {
        const files = await File.find({
            owner: req.user.id,
            isDeleted: true,
        }).sort({
            deletedAt: -1
        });

        res.status(200).json({
            success: true,
            files,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch deleted files.",
        })
    }
};

const restoreFolder = async (req, res) => {

    try {
        const folder = await Folder.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: true,
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found.",
            });
        }

        folder.isDeleted = false;
        folder.deletedAt = null;

        await folder.save();

        logUserActivity({
            user: req.user.id,
            action: "RESTORE_FOLDER",
            targetType: "folder",
            targetId: folder._id,
            targetName: folder.name,
        });

        res.status(200).json({
            success: true,
            message: "Folder restored successfully.",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to restore folder.",
        });
    }
};

const restoreFile = async (req, res) => {

    try {
        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: true,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        file.isDeleted = false;
        file.deletedAt = null;

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "RESTORE_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
        });

        res.status(200).json({
            success: true,
            message: "File restored successfully.",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to restore file.",
        });
    }
};

const deleteFolderForever = async (req, res) => {

    try {
        const folder = await Folder.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: true,
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found.",
            });
        }

        const childFolders = await Folder.countDocuments({
            parent: folder._id,
            isDeleted: true,
        });

        if (childFolders > 0) {
            return res.status(400).json({
                success: false,
                message: "Restore or delete child folders first.",
            });
        }

        const files = await File.countDocuments({
            folder: folder._id,
            isDeleted: true,
        });

        if (files > 0) {
            return res.status(400).json({
                success: false,
                message: "Restore or delete files first.",
            });
        }

        const folderName = folder.name;
        const folderId = folder._id;

        await folder.deleteOne();

        logUserActivity({
            user: req.user.id,
            action: "PERMANENT_DELETE_FOLDER",
            targetType: "folder",
            targetId: folderId,
            targetName: folderName,
        });

        res.status(200).json({
            success: true,
            message: "Folder permanently deleted.",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete folder permanently.",
        });
    }
};

const deleteFileForever = async (req, res) => {

    try {
        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: true,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        const fileName = file.originalName;
        const fileId = file._id;

        await file.deleteOne();

        logUserActivity({
            user: req.user.id,
            action: "PERMANENT_DELETE_FILE",
            targetType: "file",
            targetId: fileId,
            targetName: fileName,
        });

        res.status(200).json({
            success: true,
            message: "File permanently deleted.",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete file permanently.",
        });
    }
};

module.exports = { getDeletedFolders, getDeletedFiles, restoreFolder, restoreFile, deleteFolderForever, deleteFileForever };