const Folder = require("../models/Folder");
const File = require("../models/File");

const getFavorites = async (req, res) => {

    try {
        const folders = await Folder.find({
            owner: req.user.id,
            favorite: true,
            isDeleted: false,
        }).sort({
            updatedAt: -1,
        });

        const files = await File.find({
            owner: req.user.id,
            favorite: true,
            isDeleted: false
        }).sort({
            updatedAt: -1,
        });

        res.status(200).json({
            success: true,
            folders,
            files
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch favorites.",
        });
    }
};

module.exports = { getFavorites };