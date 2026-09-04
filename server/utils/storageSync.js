const fs = require("fs");
const path = require("path");
const File = require("../models/File");

/**
 * Automatically backfills existing disk files into MongoDB Atlas so assets are 100% persistent across Localhost, Render, and Vercel.
 */
const syncExistingFilesToDatabase = async () => {
    try {
        const filesToSync = await File.find({
            isDeleted: false,
            $or: [
                { fileData: null },
                { fileData: { $exists: false } },
                { textContent: null },
                { textContent: { $exists: false } },
            ],
        }).select("+fileData +textContent");

        if (!filesToSync || filesToSync.length === 0) {
            return;
        }

        console.log(`[FileBridge StorageSync] Checking ${filesToSync.length} files for persistence and text search indexing...`);

        let backfilledCount = 0;

        for (const file of filesToSync) {
            const ext = file.originalName ? file.originalName.split(".").pop().toLowerCase() : "";
            const isText = (file.mimeType && file.mimeType.startsWith("text/")) || [
                "txt", "html", "htm", "css", "js", "jsx", "ts", "tsx", "json", "md", "markdown",
                "py", "sql", "env", "yaml", "yml", "xml", "csv", "log", "sh", "bat", "svg"
            ].includes(ext);

            let buffer = file.fileData;

            if (!buffer || buffer.length === 0) {
                const candidatePaths = [
                    file.path ? path.resolve(file.path) : null,
                    file.storedName ? path.join(__dirname, "../uploads/files", file.storedName) : null,
                    file.storedName ? path.join(__dirname, "../uploads", file.storedName) : null,
                    file.storedName ? path.resolve("uploads/files", file.storedName) : null,
                    file.storedName ? path.resolve("server/uploads/files", file.storedName) : null,
                    file.storedName ? path.resolve("uploads", file.storedName) : null,
                ].filter(Boolean);

                for (const p of candidatePaths) {
                    if (fs.existsSync(p)) {
                        try {
                            buffer = fs.readFileSync(p);
                            break;
                        } catch {}
                    }
                }
            }

            let modified = false;
            if (buffer && buffer.length > 0 && buffer.length <= 15 * 1024 * 1024) {
                if (!file.fileData) {
                    file.fileData = buffer;
                    modified = true;
                }
                if (isText && !file.textContent) {
                    try {
                        file.textContent = buffer.toString("utf8");
                        modified = true;
                    } catch {}
                }
            }

            if (modified) {
                await file.save();
                backfilledCount++;
            }
        }

        if (backfilledCount > 0) {
            console.log(`[FileBridge StorageSync] Successfully persisted and indexed ${backfilledCount} file assets.`);
        }
    } catch (err) {
        console.error("[FileBridge StorageSync] Error during database asset backfill:", err.message);
    }
};

module.exports = { syncExistingFilesToDatabase };
