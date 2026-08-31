const mongoose = require("mongoose");
const Folder = require("../models/Folder");
const File = require("../models/File");

const getDashboardStats = async (req, res) => {
    try {
        const owner = req.user.id || req.user._id;
        const ownerIds = [owner];
        if (mongoose.Types.ObjectId.isValid(owner)) {
            ownerIds.push(new mongoose.Types.ObjectId(owner));
        }

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
                owner: { $in: ownerIds },
                isDeleted: false,
            }),
            File.countDocuments({
                owner: { $in: ownerIds },
                isDeleted: false,
            }),
            Folder.countDocuments({
                owner: { $in: ownerIds },
                favorite: true,
                isDeleted: false,
            }),
            File.countDocuments({
                owner: { $in: ownerIds },
                favorite: true,
                isDeleted: false,
            }),
            File.countDocuments({
                owner: { $in: ownerIds },
                isPublic: true,
                isDeleted: false,
            }),
            Folder.countDocuments({
                owner: { $in: ownerIds },
                isDeleted: true,
            }),
            File.countDocuments({
                owner: { $in: ownerIds },
                isDeleted: true,
            }),
            File.aggregate([
                {
                    $match: {
                        owner: { $in: ownerIds },
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
                owner: { $in: ownerIds },
                isDeleted: false,
            })
                .sort({
                    createdAt: -1,
                })
                .limit(5)
                .select("originalName mimeType size createdAt"),
        ]);

        const storageUsed =
            storageResult.length > 0 && storageResult[0].totalSize
                ? storageResult[0].totalSize
                : 0;

        res.status(200).json({
            success: true,
            stats: {
                folders,
                files,
                favorites: favoriteFolders + favoriteFiles,
                shared: sharedFiles,
                recycleBin: deletedFolders + deletedFiles,
                storageUsed,
            },
            storageUsed,
            folders,
            files,
            favorites: favoriteFolders + favoriteFiles,
            shared: sharedFiles,
            recycleBin: deletedFolders + deletedFiles,
            recentFiles,
        });
    } catch (error) {
        console.error("getDashboardStats error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load dashboard.",
        });
    }
};

const getDashboardAnalytics = async (req, res) => {
    try {
        const owner = req.user.id || req.user._id;
        const ownerIds = [owner];
        if (mongoose.Types.ObjectId.isValid(owner)) {
            ownerIds.push(new mongoose.Types.ObjectId(owner));
        }

        const [
            fileTypeStats,
            largestFiles,
        ] = await Promise.all([
            File.aggregate([
                {
                    $match: {
                        owner: { $in: ownerIds },
                        isDeleted: false,
                    },
                },
                {
                    $group: {
                        _id: "$mimeType",
                        count: {
                            $sum: 1,
                        },
                        totalSize: {
                            $sum: "$size",
                        },
                    },
                },
                {
                    $sort: {
                        totalSize: -1,
                    },
                },
            ]),
            File.find({
                owner: { $in: ownerIds },
                isDeleted: false,
            })
                .sort({
                    size: -1,
                })
                .limit(5)
                .select("originalName mimeType size createdAt"),
        ]);

        res.status(200).json({
            success: true,
            fileTypeStats,
            largestFiles,
        });
    } catch (error) {
        console.error("getDashboardAnalytics error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load analytics.",
        });
    }
};

module.exports = {
    getDashboardStats,
    getDashboardAnalytics,
};