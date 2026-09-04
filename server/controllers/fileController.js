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
        const { content, comment } = req.body;

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
        }).select("+textContent +fileData +versions");

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        // If file had previous text content and it's being changed, save a version snapshot
        if (file.textContent !== null && file.textContent !== undefined && file.textContent !== content) {
            const versionsList = file.versions || [];
            const versionNumber = versionsList.length + 1;
            versionsList.push({
                versionNumber,
                textContent: file.textContent,
                size: Buffer.byteLength(file.textContent, "utf8"),
                savedAt: new Date(),
                comment: comment || `Revision #${versionNumber}`,
            });

            // Keep max 25 historical revisions
            if (versionsList.length > 25) {
                versionsList.shift();
            }
            file.versions = versionsList;
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

const updateFileTags = async (req, res) => {
    try {
        const { tags } = req.body;

        if (!Array.isArray(tags)) {
            return res.status(400).json({
                success: false,
                message: "Tags must be an array.",
            });
        }

        const sanitizedTags = tags
            .filter((t) => t && typeof t.name === "string" && t.name.trim())
            .map((t) => ({
                name: t.name.trim().slice(0, 30),
                color: t.color || "#4F46E5",
            }))
            .slice(0, 10); // Max 10 tags per file

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

        file.tags = sanitizedTags;
        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "UPDATE_TAGS",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
            metadata: { tagCount: sanitizedTags.length },
        });

        res.status(200).json({
            success: true,
            message: "Tags updated successfully.",
            tags: file.tags,
            file,
        });
    } catch (error) {
        console.error("Update tags error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update tags.",
        });
    }
};

const batchUpdateTags = async (req, res) => {
    try {
        const { fileIds, tags, mode = "add" } = req.body;

        if (!Array.isArray(fileIds) || fileIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "fileIds must be a non-empty array.",
            });
        }

        if (!Array.isArray(tags)) {
            return res.status(400).json({
                success: false,
                message: "tags must be an array.",
            });
        }

        const sanitizedTags = tags
            .filter((t) => t && typeof t.name === "string" && t.name.trim())
            .map((t) => ({
                name: t.name.trim().slice(0, 30),
                color: t.color || "#4F46E5",
            }));

        const files = await File.find({
            _id: { $in: fileIds },
            owner: req.user.id,
            isDeleted: false,
        });

        for (const file of files) {
            if (mode === "replace") {
                file.tags = sanitizedTags.slice(0, 10);
            } else if (mode === "remove") {
                const namesToRemove = new Set(sanitizedTags.map((t) => t.name.toLowerCase()));
                file.tags = (file.tags || []).filter((t) => !namesToRemove.has(t.name.toLowerCase()));
            } else {
                // Add / Merge mode
                const existingNames = new Set((file.tags || []).map((t) => t.name.toLowerCase()));
                const merged = [...(file.tags || [])];
                for (const st of sanitizedTags) {
                    if (!existingNames.has(st.name.toLowerCase())) {
                        merged.push(st);
                        existingNames.add(st.name.toLowerCase());
                    }
                }
                file.tags = merged.slice(0, 10);
            }
            await file.save();
        }

        res.status(200).json({
            success: true,
            message: `Updated tags on ${files.length} file(s).`,
        });
    } catch (error) {
        console.error("Batch update tags error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to batch update tags.",
        });
    }
};

const getFileVersions = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: false,
        }).select("+versions +textContent");

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        const versions = (file.versions || []).map((v) => ({
            _id: v._id,
            versionNumber: v.versionNumber,
            textContent: v.textContent,
            size: v.size,
            savedAt: v.savedAt,
            comment: v.comment,
        }));

        res.status(200).json({
            success: true,
            versions: versions.reverse(),
            currentVersion: {
                size: file.size,
                textContent: file.textContent,
                updatedAt: file.updatedAt,
            },
        });
    } catch (error) {
        console.error("Get file versions error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch file version history.",
        });
    }
};

const restoreFileVersion = async (req, res) => {
    try {
        const { versionId } = req.params;

        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
            isDeleted: false,
        }).select("+textContent +fileData +versions");

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        const targetVersion = (file.versions || []).find(
            (v) => String(v._id) === String(versionId) || String(v.versionNumber) === String(versionId)
        );

        if (!targetVersion || typeof targetVersion.textContent !== "string") {
            return res.status(404).json({
                success: false,
                message: "Selected version snapshot not found.",
            });
        }

        // Save current content as a new version before rolling back
        if (file.textContent !== null && file.textContent !== undefined) {
            const versionsList = file.versions || [];
            const versionNumber = versionsList.length + 1;
            versionsList.push({
                versionNumber,
                textContent: file.textContent,
                size: Buffer.byteLength(file.textContent, "utf8"),
                savedAt: new Date(),
                comment: `Pre-rollback snapshot before restoring v${targetVersion.versionNumber || ""}`,
            });
            file.versions = versionsList;
        }

        const restoredContent = targetVersion.textContent;
        const restoredBuf = Buffer.from(restoredContent, "utf8");
        file.textContent = restoredContent;
        file.fileData = restoredBuf;
        file.size = Buffer.byteLength(restoredContent, "utf8");

        try {
            const uploadDir = path.resolve(__dirname, "../uploads/files");
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const targetPath = path.join(uploadDir, file.storedName || `${file._id}-${file.originalName}`);
            fs.writeFileSync(targetPath, restoredContent, "utf8");
            file.path = targetPath;
        } catch (e) {
            console.error("Local disk cache write skipped on restore:", e.message);
        }

        await file.save();

        logUserActivity({
            user: req.user.id,
            action: "RESTORE_VERSION",
            targetType: "file",
            targetId: file._id,
            targetName: file.originalName,
            metadata: { restoredVersion: targetVersion.versionNumber },
        });

        res.status(200).json({
            success: true,
            message: `Restored version ${targetVersion.versionNumber || ""} successfully.`,
            content: restoredContent,
            file,
        });
    } catch (error) {
        console.error("Restore version error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to restore file version.",
        });
    }
};

module.exports = {
    uploadFile,
    getFiles,
    downloadFile,
    deleteFile,
    renameFile,
    toggleFavoriteFile,
    previewFile,
    updateFileContent,
    updateFileTags,
    batchUpdateTags,
    getFileVersions,
    restoreFileVersion,
};