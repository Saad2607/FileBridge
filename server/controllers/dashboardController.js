const Folder = require("../models/Folder");
const File = require("../models/File");

const getDashboardStats = async (req, res) => {

    try {

        const owner = req.user.id;

        const [
            folders,
            files,
            favoriteFolders,
            favoriteFiles,
            sharedFiles,
            deletedFolders,
            deletedFiles,
            storageResult,
            recentFiles,
        ] = await Promise.all([

            Folder.countDocuments({
                owner,
                isDeleted: false,
            }),

            File.countDocuments({
                owner,
                isDeleted: false,
            }),

            Folder.countDocuments({
                owner,
                favorite: true,
                isDeleted: false,
            }),

            File.countDocuments({
                owner,
                favorite: true,
                isDeleted: false,
            }),

            File.countDocuments({
                owner,
                isPublic: true,
                isDeleted: false,
            }),

            Folder.countDocuments({
                owner,
                isDeleted: true,
            }),

            File.countDocuments({
                owner,
                isDeleted: true,
            }),

            File.aggregate([
                {
                    $match: {
                        owner: req.user._id,
                        isDeleted: false,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalSize: {
                            $sum: "$size",
                        },
                    },
                },
            ]),

            File.find({
                owner,
                isDeleted: false,
            })
                .sort({
                    createdAt: -1,
                })
                .limit(5)
                .select(
                    "originalName mimeType size createdAt"
                ),

        ]);

        const storageUsed =
            storageResult.length > 0
                ? storageResult[0].totalSize
                : 0;

        res.status(200).json({

            success: true,

            stats: {

                folders,

                files,

                favorites:
                    favoriteFolders +
                    favoriteFiles,

                shared: sharedFiles,

                recycleBin:
                    deletedFolders +
                    deletedFiles,

                storageUsed,

            },

            recentFiles,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Unable to load dashboard.",

        });

    }

};

module.exports = {
    getDashboardStats,
};