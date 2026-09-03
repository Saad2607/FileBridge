const File = require("../models/File");
const path = require("path");
const fs = require("fs");
const { logUserActivity } = require("../utils/activityLogger");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded.",
            });
        }

        const file = await File.create({
            originalName: req.file.originalname,
            storedName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            folder: req.body.folder || null,
            owner: req.user.id,
        });

        logUserActivity({
            user: req.user.id,
            action: "UPLOAD_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
            metadata: { size: file.size, mimeType: file.mimeType },
        });

        res.status(201).json({
            success: true,
            message: "File uploaded successfully.",
            file,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to upload file.",
        });
    }
};

const getFiles = async (req, res) => {
    try {
        const folder = req.query.folder || null;

        const query = {
            owner: req.user.id,
        };

        if (folder === null) {
            query.folder = null;
        } else {
            query.folder = folder;
        }

        const files = await File.find({
            ...query,
            isDeleted: false,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            files,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({ success: false, message: "Unable to fetch files." });
    }
};

const downloadFile = async (req, res) => {
    try {
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

        logUserActivity({
            user: req.user.id,
            action: "DOWNLOAD_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
        });

        const candidatePaths = [
            file.path ? path.resolve(file.path) : null,
            file.storedName ? path.join(__dirname, "../uploads/files", file.storedName) : null,
            file.storedName ? path.join(__dirname, "../uploads", file.storedName) : null,
            file.storedName ? path.resolve("uploads/files", file.storedName) : null,
            file.storedName ? path.resolve("server/uploads/files", file.storedName) : null,
            file.storedName ? path.resolve("uploads", file.storedName) : null,
            file.path ? path.join(__dirname, "..", file.path) : null,
            file.path ? path.join(__dirname, "../..", file.path) : null,
        ].filter(Boolean);

        for (const p of candidatePaths) {
            if (fs.existsSync(p)) {
                return res.download(p, file.originalName);
            }
        }

        if (file.url) {
            return res.redirect(file.url);
        }

        // If it is a text/code document, initialize it on disk so the user can immediately edit and save
        const ext = file.originalName ? file.originalName.split(".").pop().toLowerCase() : "";
        const isTextOrCode = (file.mimeType && file.mimeType.startsWith("text/")) || [
            "txt", "html", "htm", "css", "js", "jsx", "ts", "tsx", "json", "md", "markdown",
            "py", "sql", "env", "yaml", "yml", "xml", "csv", "log", "sh", "bat", "svg"
        ].includes(ext);

        if (isTextOrCode) {
            const uploadDir = path.resolve(__dirname, "../uploads/files");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fallbackPath = path.join(uploadDir, file.storedName || `${file._id}-${file.originalName}`);
            if (!fs.existsSync(fallbackPath)) {
                fs.writeFileSync(fallbackPath, "", "utf8");
            }
            file.path = fallbackPath;
            await file.save();
            return res.download(fallbackPath, file.originalName);
        }

        return res.status(404).json({
            success: false,
            message: "File asset not found on disk.",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to download file.",
        });
    }
};

const deleteFile = async (req, res) => {

    try {

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

        file.isDeleted = true;

        file.deletedAt = new Date();

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "DELETE_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
        });

        res.status(200).json({
            success: true,
            message: "File moved to Recycle Bin.",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete file.",
        });

    }

};

const renameFile = async (req, res) => {
    try {
        const { originalName } = req.body;

        if (!originalName || !originalName.trim()) {
            return res.status(400).json({
                success: false,
                message: "File name is required.",
            });
        }

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

        const oldName = file.originalName;
        file.originalName = originalName.trim();

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "RENAME_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
            metadata: { oldName },
        });

        res.status(200).json({
            success: true,
            message: "File renamed successfully.",
            file,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to rename file.",
        });
    }
};

const toggleFavoriteFile = async (req, res) => {

    try {

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

        file.favorite = !file.favorite;

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: file.favorite ? "FAVORITE_FILE" : "UNFAVORITE_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
        });

        res.status(200).json({
            success: true,
            favorite: file.favorite,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to update favorite.",
        });
    }
};

const previewFile = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (file.mimeType) {
            res.setHeader("Content-Type", file.mimeType);
        }

        const candidatePaths = [
            file.path ? path.resolve(file.path) : null,
            file.storedName ? path.join(__dirname, "../uploads/files", file.storedName) : null,
            file.storedName ? path.join(__dirname, "../uploads", file.storedName) : null,
            file.storedName ? path.resolve("uploads/files", file.storedName) : null,
            file.storedName ? path.resolve("uploads", file.storedName) : null,
            file.storedName ? path.join(__dirname, "../../uploads/files", file.storedName) : null,
        ].filter(Boolean);

        for (const p of candidatePaths) {
            if (fs.existsSync(p)) {
                return res.sendFile(p);
            }
        }

        if (file.url) {
            return res.redirect(file.url);
        }

        // If it is a text/code document, initialize empty file on disk and send
        const ext = file.originalName ? file.originalName.split(".").pop().toLowerCase() : "";
        const isTextOrCode = (file.mimeType && file.mimeType.startsWith("text/")) || [
            "txt", "html", "htm", "css", "js", "jsx", "ts", "tsx", "json", "md", "markdown",
            "py", "sql", "env", "yaml", "yml", "xml", "csv", "log", "sh", "bat", "svg"
        ].includes(ext);

        if (isTextOrCode) {
            const uploadDir = path.resolve(__dirname, "../uploads/files");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fallbackPath = path.join(uploadDir, file.storedName || `${file._id}-${file.originalName}`);
            if (!fs.existsSync(fallbackPath)) {
                fs.writeFileSync(fallbackPath, "", "utf8");
            }
            file.path = fallbackPath;
            await file.save();
            return res.sendFile(fallbackPath);
        }

        return res.status(404).json({
            success: false,
            message: "File asset not found on storage disk.",
        });
    } catch (error) {
        console.error("Preview error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to serve file preview.",
        });
    }
};

const updateFileContent = async (req, res) => {
    try {
        const { content } = req.body;

        if (typeof content !== "string") {
            return res.status(400).json({
                success: false,
                message: "Content string is required.",
            });
        }

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

        const candidatePaths = [
            file.path ? path.resolve(file.path) : null,
            file.storedName ? path.join(__dirname, "../uploads/files", file.storedName) : null,
            file.storedName ? path.join(__dirname, "../uploads", file.storedName) : null,
            file.storedName ? path.resolve("uploads/files", file.storedName) : null,
            file.storedName ? path.resolve("uploads", file.storedName) : null,
            file.storedName ? path.join(__dirname, "../../uploads/files", file.storedName) : null,
        ].filter(Boolean);

        let targetPath = null;
        for (const p of candidatePaths) {
            if (fs.existsSync(p)) {
                targetPath = p;
                break;
            }
        }

        if (!targetPath) {
            // If path doesn't exist, create it in uploads/files
            const uploadDir = path.resolve(__dirname, "../uploads/files");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            targetPath = path.join(uploadDir, file.storedName || `${file._id}-${file.originalName}`);
            file.path = targetPath;
        }

        fs.writeFileSync(targetPath, content, "utf8");
        file.size = Buffer.byteLength(content, "utf8");
        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "EDIT_FILE",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
            metadata: { newSize: file.size },
        });

        res.status(200).json({
            success: true,
            message: "File content updated successfully.",
            file,
        });
    } catch (error) {
        console.error("Update content error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update file content.",
        });
    }
};

module.exports = { uploadFile, getFiles, downloadFile, deleteFile, renameFile, toggleFavoriteFile, previewFile, updateFileContent };