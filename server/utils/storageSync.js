const fs = require("fs");
const path = require("path");
const File = require("../models/File");

/**
 * Automatically backfills existing disk files into MongoDB Atlas so assets are 100% persistent across Localhost, Render, and Vercel.
 */
const syncExistingFilesToDatabase = async () => {
    try {
        const filesWithoutData = await File.find({
            isDeleted: false,
            $or: [{ fileData: null }, { fileData: { $exists: false } }],
        }).select("+fileData +textContent");

        if (!filesWithoutData || filesWithoutData.length === 0) {
            return;
        }

        console.log(`[FileBridge StorageSync] Checking ${filesWithoutData.length} files for database persistence backfill...`);

        let backfilledCount = 0;

        for (const file of filesWithoutData) {
            const candidatePaths = [
                file.path ? path.resolve(file.path) : null,
                file.storedName ? path.join(__dirname, "../uploads/files", file.storedName) : null,
                file.storedName ? path.join(__dirname, "../uploads", file.storedName) : null,
                file.storedName ? path.resolve("uploads/files", file.storedName) : null,
                file.storedName ? path.resolve("server/uploads/files", file.storedName) : null,
                file.storedName ? path.resolve("uploads", file.storedName) : null,
            ].filter(Boolean);

            let diskBuffer = null;
            for (const p of candidatePaths) {
                if (fs.existsSync(p)) {
                    try {
                        diskBuffer = fs.readFileSync(p);
                        break;
                    } catch {}
                }
            }

            if (diskBuffer && diskBuffer.length > 0 && diskBuffer.length <= 15 * 1024 * 1024) {
                file.fileData = diskBuffer;
                const ext = file.originalName ? file.originalName.split(".").pop().toLowerCase() : "";
                const isText = (file.mimeType && file.mimeType.startsWith("text/")) || [
                    "txt", "html", "htm", "css", "js", "jsx", "ts", "tsx", "json", "md", "markdown",
                    "py", "sql", "env", "yaml", "yml", "xml", "csv", "log", "sh", "bat", "svg"
                ].includes(ext);

                if (isText) {
                    try {
                        file.textContent = diskBuffer.toString("utf8");
                    } catch {}
                }

                await file.save();
                backfilledCount++;
            }
        }

        if (backfilledCount > 0) {
            console.log(`[FileBridge StorageSync] Successfully persisted ${backfilledCount} file assets directly into MongoDB Atlas.`);
        }
    } catch (err) {
        console.error("[FileBridge StorageSync] Error during database asset backfill:", err.message);
    }
};

module.exports = { syncExistingFilesToDatabase };
