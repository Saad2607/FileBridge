const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const path = require("path");

const File = require("../models/File");
const { logUserActivity } = require("../utils/activityLogger");

const createShareLink = async (req, res) => {
    try {
        const { expiry, password, burnAfterDownload } = req.body;

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

        let shareExpiry = null;

        switch (expiry) {
            case "10m":
                shareExpiry = new Date(Date.now() + 10 * 60 * 1000);
                break;
            case "1h":
                shareExpiry = new Date(Date.now() + 60 * 60 * 1000);
                break;
            case "24h":
                shareExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
                break;
            case "7d":
                shareExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
                shareExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                shareExpiry = null;
        }

        file.shareToken = uuidv4();
        file.isPublic = true;
        file.shareExpiry = shareExpiry;
        file.burnAfterDownload = Boolean(burnAfterDownload);

        if (password && password.trim()) {
            file.sharePassword = await bcrypt.hash(password, 10);
        } else {
            file.sharePassword = null;
        }

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "SHARE_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
            metadata: { expiry, hasPassword: !!file.sharePassword, burnAfterDownload: file.burnAfterDownload },
        });

        const clientOrigin = req.get("origin") || req.get("referer")?.replace(/\/$/, "") || "http://localhost:5173";
        const shareUrl = `${clientOrigin}/share/${file.shareToken}`;

        res.status(200).json({
            success: true,
            shareToken: file.shareToken,
            shareUrl,
            burnAfterDownload: file.burnAfterDownload,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to generate share link.",
        });
    }
};

const getSharedFile = async (req, res) => {
    try {
        const file = await File.findOne({
            shareToken: req.params.token,
            isPublic: true,
            isDeleted: false,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "Shared file not found or has been burned.",
            });
        }

        if (file.shareExpiry && file.shareExpiry < new Date()) {
            return res.status(410).json({
                success: false,
                message: "This share link has expired.",
            });
        }

        if (file.sharePassword) {
            const password = req.query.password;

            if (!password) {
                return res.status(401).json({
                    success: false,
                    requiresPassword: true,
                    message: "Password required.",
                });
            }

            const valid = await bcrypt.compare(password, file.sharePassword);

            if (!valid) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password.",
                });
            }
        }

        // Handle Burn After Download logic
        file.downloadCount = (file.downloadCount || 0) + 1;
        if (file.burnAfterDownload) {
            file.isPublic = false;
            file.shareToken = null;
            file.shareExpiry = null;
            file.sharePassword = null;
            file.burnAfterDownload = false;
        }
        await file.save();

        const filePath = path.resolve(file.path);
        res.download(filePath, file.originalName);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to download shared file.",
        });
    }
};

const disableShare = async (req, res) => {

    try {
        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        file.isPublic = false;
        file.shareToken = null;
        file.shareExpiry = null;
        file.sharePassword = null;

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "UNSHARE_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
        });

        res.status(200).json({
            success: true,
            message: "Sharing disabled successfully.",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to disable sharing.",
        });
    }
};

const getShareInfo = async (req, res) => {

    try {
        const file = await File.findOne({
            shareToken: req.params.token,
            isPublic: true,
        });

        if (!file) {

            return res.status(404).json({
                success: false,
                message: "Shared file not found.",
            });
        }

        if (file.shareExpiry && new Date() > file.shareExpiry) {
            return res.status(410).json({
                success: false,
                message: "Share link expired.",
            });
        }

        res.status(200).json({
            success: true,
            file: {
                id: file._id,
                originalName: file.originalName,
                size: file.size,
                mimeType: file.mimeType,
                requiresPassword: !!file.sharePassword,
                burnAfterDownload: Boolean(file.burnAfterDownload),
                shareExpiry: file.shareExpiry,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch share information.",
        });
    }
};

const getSharedFiles = async (req, res) => {
    try {
        const files = await File.find({
            owner: req.user.id,
            isPublic: true,
            isDeleted: false,
        })
            .select(
                "originalName mimeType size shareToken shareExpiry sharePassword burnAfterDownload createdAt"
            )
            .sort({
                createdAt: -1,
            });

        res.status(200).json({
            success: true,
            files,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch shared files.",
        });

    }

};

module.exports = { createShareLink, getSharedFile, disableShare, getShareInfo, getSharedFiles };