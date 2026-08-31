const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const axios = require("axios");
const FormData = require("form-data");
const EventEmitter = require("events");

class SyncEngine extends EventEmitter {
    constructor() {
        super();
        this.watcher = null;
        this.syncDirectory = null;
        this.authToken = null;
        this.apiBaseUrl = process.env.API_URL || "http://localhost:5000/api";
        this.isSyncing = false;
        this.processedFiles = new Map(); // filepath -> { mtime, size }
        this.queue = [];
        this.processingQueue = false;
    }

    setAuthToken(token) {
        this.authToken = token;
    }

    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
    }

    setSyncDirectory(dirPath) {
        this.syncDirectory = dirPath;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    start() {
        if (!this.syncDirectory) {
            throw new Error("Sync directory is not configured.");
        }

        if (this.watcher) {
            this.stop();
        }

        this.isSyncing = true;
        this.emit("status", { state: "watching", directory: this.syncDirectory });

        this.watcher = chokidar.watch(this.syncDirectory, {
            ignored: /(^|[\/\\])\..|node_modules|\.tmp$/,
            persistent: true,
            ignoreInitial: false,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 200,
            },
        });

        this.watcher.on("add", (filePath) => this.enqueueFile(filePath, "add"));
        this.watcher.on("change", (filePath) => this.enqueueFile(filePath, "change"));
        this.watcher.on("unlink", (filePath) => this.handleLocalDelete(filePath));
        this.watcher.on("error", (err) => {
            console.error("[SyncEngine] Watcher error:", err);
            this.emit("error", err);
        });
    }

    stop() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
        this.isSyncing = false;
        this.emit("status", { state: "idle" });
    }

    enqueueFile(filePath, eventType) {
        try {
            if (!fs.existsSync(filePath)) return;
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) return;

            const existing = this.processedFiles.get(filePath);
            if (existing && existing.mtime === stats.mtimeMs && existing.size === stats.size) {
                return; // Already processed
            }

            this.queue.push({ filePath, stats, eventType });
            this.processQueue();
        } catch (err) {
            console.error("[SyncEngine] enqueue error:", err);
        }
    }

    async processQueue() {
        if (this.processingQueue || this.queue.length === 0) return;
        this.processingQueue = true;

        while (this.queue.length > 0) {
            const item = this.queue.shift();
            try {
                this.emit("file-sync-start", { file: path.basename(item.filePath) });
                await this.uploadLocalFile(item.filePath, item.stats);
                this.processedFiles.set(item.filePath, {
                    mtime: item.stats.mtimeMs,
                    size: item.stats.size,
                });
                this.emit("file-sync-complete", { file: path.basename(item.filePath) });
            } catch (error) {
                console.error(`[SyncEngine] Failed to sync ${item.filePath}:`, error.message);
                this.emit("file-sync-error", { file: path.basename(item.filePath), error: error.message });
            }
        }

        this.processingQueue = false;
        this.emit("status", { state: "watching", directory: this.syncDirectory });
    }

    async uploadLocalFile(filePath, stats) {
        if (!this.authToken) {
            console.warn("[SyncEngine] No auth token set; skipping cloud upload.");
            return;
        }

        const fileName = path.basename(filePath);
        const fileStream = fs.createReadStream(filePath);
        const form = new FormData();
        form.append("file", fileStream, fileName);

        await axios.post(`${this.apiBaseUrl}/files/upload`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${this.authToken}`,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });
    }

    handleLocalDelete(filePath) {
        this.processedFiles.delete(filePath);
        this.emit("file-deleted", { file: path.basename(filePath) });
    }

    getStatus() {
        return {
            isSyncing: this.isSyncing,
            syncDirectory: this.syncDirectory,
            queueLength: this.queue.length,
            authenticated: Boolean(this.authToken),
        };
    }
}

module.exports = new SyncEngine();
