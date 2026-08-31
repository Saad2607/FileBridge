const Folder = require("../models/Folder");
const File = require("../models/File");

const search = async (req, res) => {

    try {
        const query = req.query.q?.trim();

        if (!query) {

            return res.status(200).json({
                success: true,
                folders: [],
                files: [],
            });
        }


        const regex = new RegExp(query, "i");

        const folders = await Folder.find({
            owner: req.user.id,
            name: regex,
            isDeleted: false
        });

        const files = await File.find({
            owner: req.user.id,
            originalName: regex,
            isDeleted: false,
        });

        res.status(200).json({
            success: true,
            folders,
            files,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to search.",
        });
    }
};

module.exports = { search }; 