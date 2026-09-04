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

        let fileBuffer = null;
        let textContent = null;

        if (req.file.path && fs.existsSync(req.file.path)) {
            try {
                fileBuffer = fs.readFileSync(req.file.path);
            } catch (e) {
                console.error("Error reading uploaded file buffer:", e.message);
            }
        } else if (req.file.buffer) {
            fileBuffer = req.file.buffer;
        }

        const ext = req.file.originalname ? req.file.originalname.split(".").pop().toLowerCase() : "";
        const isTextOrCode = (req.file.mimetype && req.file.mimetype.startsWith("text/")) || [
            "txt", "html", "htm", "css", "js", "jsx", "ts", "tsx", "json", "md", "markdown",
            "py", "sql", "env", "yaml", "yml", "xml", "csv", "log", "sh", "bat", "svg"
        ].includes(ext);

        if (fileBuffer && isTextOrCode) {
            try {
                textContent = fileBuffer.toString("utf8");
            } catch {}
        }

        const canStoreBuffer = fileBuffer && fileBuffer.length <= 15 * 1024 * 1024;

        const file = await File.create({
            originalName: req.file.originalname,
            storedName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            folder: req.body.folder || null,
            owner: req.user.id,
            fileData: canStoreBuffer ? fileBuffer : null,
            textContent: textContent || null,
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
        console.error("Upload error:", error);

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
        }).select("+fileData +textContent");

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

        if (file.fileData && file.fileData.length > 0) {
            try {
                const uploadDir = path.resolve(__dirname, "../uploads/files");
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
                const cachePath = path.join(uploadDir, file.storedName || `${file._id}-${file.originalName}`);
                fs.writeFileSync(cachePath, file.fileData);
                file.path = cachePath;
                await file.save();
            } catch {}

            res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
            res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.originalName)}"`);
            res.setHeader("Content-Length", file.fileData.length);
            return res.end(file.fileData);
        }

        if (file.textContent !== null && file.textContent !== undefined) {
            const buf = Buffer.from(file.textContent, "utf8");
            res.setHeader("Content-Type", file.mimeType || "text/plain; charset=utf-8");
            res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.originalName)}"`);
            res.setHeader("Content-Length", buf.length);
            return res.end(buf);
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
        }).select("+fileData +textContent");

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=86400");
        if (file.mimeType) {
            res.setHeader("Content-Type", file.mimeType);
        }

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
                return res.sendFile(p);
            }
        }

        if (file.url) {
            return res.redirect(file.url);
        }

        if (file.fileData && file.fileData.length > 0) {
            try {
                const uploadDir = path.resolve(__dirname, "../uploads/files");
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
                const cachePath = path.join(uploadDir, file.storedName || `${file._id}-${file.originalName}`);
                fs.writeFileSync(cachePath, file.fileData);
                file.path = cachePath;
                await file.save();
            } catch {}

            res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
            res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.originalName)}"`);
            res.setHeader("Content-Length", file.fileData.length);
            return res.end(file.fileData);
        }

        if (file.textContent !== null && file.textContent !== undefined) {
            const buf = Buffer.from(file.textContent, "utf8");
            res.setHeader("Content-Type", file.mimeType || "text/plain; charset=utf-8");
            res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.originalName)}"`);
            res.setHeader("Content-Length", buf.length);
            return res.end(buf);
        }

        const ext = file.originalName ? file.originalName.split(".").pop().toLowerCase() : "";
        const isTextOrCode = (file.mimeType && file.mimeType.startsWith("text/")) || [
            "txt", "html", "htm", "css", "js", "jsx", "ts", "tsx", "json", "md", "markdown",
            "py", "sql", "env", "yaml", "yml", "xml", "csv", "log", "sh", "bat", "svg"
        ].includes(ext);

        if (isTextOrCode) {
            res.setHeader("Content-Type", file.mimeType || "text/plain; charset=utf-8");
            return res.send("");
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

        const contentBuf = Buffer.from(content, "utf8");
        file.textContent = content;
        file.fileData = contentBuf;
        file.size = Buffer.byteLength(content, "utf8");

        try {
            const uploadDir = path.resolve(__dirname, "../uploads/files");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const targetPath = path.join(uploadDir, file.storedName || `${file._id}-${file.originalName}`);
            fs.writeFileSync(targetPath, content, "utf8");
            file.path = targetPath;
        } catch (e) {
            console.error("Local disk cache write skipped:", e.message);
        }

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