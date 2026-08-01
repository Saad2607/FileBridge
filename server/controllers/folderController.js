const Folder = require("../models/Folder");
const File = require("../models/File");

const createFolder = async (req, res) => {
    try {
        const { name, parent } = req.body;

        const existingFolder = await Folder.findOne({
            name: name.trim(),
            owner: req.user.id,
            parent: parent || null,
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
        });

        if (!folder) {

            return res.status(404).json({
                success: false,
                message: "Folder not found.",
            });

        }

        const childFolders = await Folder.countDocuments({
            parentFolder: folder._id,
        });

        if (childFolders > 0) {

            return res.status(400).json({
                success: false,
                message: "Folder contains subfolders.",
            });

        }

        const files = await File.countDocuments({
            folder: folder._id,
        });

        if (files > 0) {

            return res.status(400).json({
                success: false,
                message: "Folder contains files.",
            });

        }

        await folder.deleteOne();

        res.status(200).json({
            success: true,
            message: "Folder deleted successfully.",
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

        const folders = await Folder.find(query).sort({
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
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found.",
            });
        }

        folder.name = name.trim();

        await folder.save();

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

module.exports = { createFolder, getFolders, deleteFolder, renameFolder };