const Folder = require("../models/Folder");
const File = require("../models/File");
const { logUserActivity } = require("../utils/activityLogger");

const createFolder = async (req, res) => {
    try {
        const { name, parent } = req.body;

        const existingFolder = await Folder.findOne({
            name: name.trim(),
            owner: req.user.id,
            parent: parent || null,
            isDeleted: false,
        });

        if (existingFolder) {
            return res.status(400).json({
                success: false,
                message: "Folder already exists."
            });
        }

        const folder = await Folder.create({
            name,
            parent: parent || null,
            owner: req.user.id,
        });

        logUserActivity({
            user: req.user.id,
            action: "CREATE_FOLDER",
            targetType: "folder",
            targetId: folder._id,
            targetName: folder.name,
        });

        res.status(201).json({
            success: true,
            folder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to create folder.",
        });
    }
};

const deleteFolder = async (req, res) => {

    try {

        const folder = await Folder.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: false,
        });

        if (!folder) {

            return res.status(404).json({
                success: false,
                message: "Folder not found.",
            });

        }

        const childFolders = await Folder.countDocuments({
            parent: folder._id,
            isDeleted: false,
        });

        if (childFolders > 0) {

            return res.status(400).json({
                success: false,
                message: "Folder contains subfolders.",
            });

        }

        const files = await File.countDocuments({
            folder: folder._id,
            isDeleted: false,
        });

        if (files > 0) {

            return res.status(400).json({
                success: false,
                message: "Folder contains files.",
            });

        }

        folder.isDeleted = true;

        folder.deletedAt = new Date();

        await folder.save();

        logUserActivity({
            user: req.user.id,
            action: "DELETE_FOLDER",
            targetType: "folder",
            targetId: folder._id,
            targetName: folder.name,
        });

        res.status(200).json({
            success: true,
            message: "Folder moved to Recycle Bin.",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete folder.",
        });

    }

};

const getFolders = async (req, res) => {
    try {
        const parent = req.query.parent || null;

        const query = {
            owner: req.user.id,
        };

        if (parent === null) {
            query.parent = null;
        } else {
            query.parent = parent;
        }

        const folders = await Folder.find({ ...query, isDeleted: false }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            folders,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch folders.",
        });
    }
};

const renameFolder = async (req, res) => {

    try {

        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Folder name is required.",
            });
        }

        const folder = await Folder.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: false,
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found.",
            });
        }

        const oldName = folder.name;
        folder.name = name.trim();

        await folder.save();

        logUserActivity({
            user: req.user.id,
            action: "RENAME_FOLDER",
            targetType: "folder",
            targetId: folder._id,
            targetName: folder.name,
            metadata: { oldName },
        });

        res.status(200).json({
            success: true,
            message: "Folder renamed successfully.",
            folder,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to rename folder.",
        });

    }

};

const toggleFavoriteFolder = async (req, res) => {
    try {

        const folder = await Folder.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: false,
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found.",
            });
        }

        folder.favorite = !folder.favorite;

        await folder.save();

        logUserActivity({
            user: req.user.id,
            action: folder.favorite ? "FAVORITE_FOLDER" : "UNFAVORITE_FOLDER",
            targetType: "folder",
            targetId: folder._id,
            targetName: folder.name,
        });

        res.status(200).json({
            success: true,
            favorite: folder.favorite,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to update favorite.",
        });
    }
};

module.exports = { createFolder, getFolders, deleteFolder, renameFolder, toggleFavoriteFolder };