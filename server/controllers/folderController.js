const Folder = require("../models/Folder");

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

const getFolders = async (req, res) => {
    try {
        const parent = req.query.parent || null;

        const query = {
            owner: req.user.id,
        };

        if(parent === null) {
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

module.exports = { createFolder, getFolders };