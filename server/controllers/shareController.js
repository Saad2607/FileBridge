const { v4: uuidv4 } = require("uuid");

const File = require("../models/File");

const createShareLink = async (req, res) => {

    try {

        const { expiry } = req.body;

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

            case "1h":
                shareExpiry = new Date(
                    Date.now() + 60 * 60 * 1000
                );
                break;

            case "24h":
                shareExpiry = new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                );
                break;

            case "7d":
                shareExpiry = new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                );
                break;

            case "30d":
                shareExpiry = new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                );
                break;

            default:
                shareExpiry = null;

        }

        file.shareToken = uuidv4();

        file.isPublic = true;

        file.shareExpiry = shareExpiry;

        await file.save();

        const shareUrl =
            `${req.protocol}://${req.get("host")}/api/share/${file.shareToken}`;

        res.status(200).json({
            success: true,
            shareUrl,
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
                message: "Shared file not found.",
            });

        }

        if (
            file.shareExpiry &&
            file.shareExpiry < new Date()
        ) {

            return res.status(410).json({
                success: false,
                message: "This share link has expired.",
            });

        }

        res.download(
            file.path,
            file.originalName
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to download shared file.",
        });

    }

};

module.exports = { createShareLink, getSharedFile };