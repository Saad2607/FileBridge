const { app, BrowserWindow, ipcMain, dialog, shell, Tray, Menu, Notification } = require("electron");
const path = require("path");
const os = require("os");
const syncEngine = require("./sync/syncEngine");

let mainWindow = null;
let tray = null;
let isQuitting = false;

const defaultSyncDir = path.join(os.homedir(), "FileBridge");
syncEngine.setSyncDirectory(defaultSyncDir);

const iconPath = process.platform === "win32"
    ? path.join(__dirname, "assets", "icon.ico")
    : path.join(__dirname, "assets", "icon.png");

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 840,
        minWidth: 1024,
        minHeight: 700,
        frame: false, // Custom frameless titlebar
        title: "FileBridge - Cloud Storage",
        icon: iconPath,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
        },
        show: false,
        backgroundColor: "#F8FAFC",
    });

    // Load development server or production build
    const devServerUrl = "http://localhost:5173";
    const fallbackDevUrl = "http://localhost:5174";
    const prodPath = path.join(__dirname, "..", "client", "dist", "index.html");

    mainWindow.loadURL(devServerUrl).catch(() => {
        mainWindow.loadURL(fallbackDevUrl).catch(() => {
            mainWindow.loadFile(prodPath).catch((err) => {
                console.error("Failed to load FileBridge client:", err);
            });
        });
    });

    mainWindow.once("ready-to-show", () => {
        if (iconPath && fsExists(iconPath)) {
            mainWindow.setIcon(iconPath);
        }
        mainWindow.show();
    });

    mainWindow.on("close", (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    setupSyncEngineListeners();
}

function fsExists(filePath) {
    try {
        const fs = require("fs");
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

function setupTray() {
    try {
        const trayIconPath = path.join(__dirname, "assets", "icon.png");
        tray = new Tray(trayIconPath);
    } catch (err) {
        console.warn("Tray icon setup error:", err.message);
    }

    if (tray) {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: "Open FileBridge",
                click: () => {
                    if (mainWindow) {
                        mainWindow.show();
                        mainWindow.focus();
                    }
                },
            },
            {
                label: "Open Local Sync Folder",
                click: () => {
                    shell.openPath(syncEngine.syncDirectory);
                },
            },
            { type: "separator" },
            {
                label: "Pause Sync",
                click: () => syncEngine.stop(),
            },
            {
                label: "Resume Sync",
                click: () => syncEngine.start(),
            },
            { type: "separator" },
            {
                label: "Quit",
                click: () => {
                    isQuitting = true;
                    app.quit();
                },
            },
        ]);

        tray.setToolTip("FileBridge Desktop");
        tray.setContextMenu(contextMenu);
        tray.on("double-click", () => {
            if (mainWindow) {
                mainWindow.show();
                mainWindow.focus();
            }
        });
    }
}

function setupSyncEngineListeners() {
    syncEngine.on("status", (data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send("sync:status-changed", data);
        }
    });

    syncEngine.on("file-sync-start", (data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send("sync:file-event", { type: "start", ...data });
        }
    });

    syncEngine.on("file-sync-complete", (data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send("sync:file-event", { type: "complete", ...data });
        }
        if (Notification.isSupported()) {
            new Notification({
                title: "FileBridge Sync",
                body: `Synced: ${data.file}`,
            }).show();
        }
    });

    syncEngine.on("file-sync-error", (data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send("sync:file-event", { type: "error", ...data });
        }
    });
}

// ---------------- IPC HANDLERS ----------------

// Window Controls
ipcMain.handle("window:minimize", () => {
    if (mainWindow) mainWindow.minimize();
    return true;
});

ipcMain.handle("window:maximize", () => {
    if (!mainWindow) return false;
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
        return false;
    } else {
        mainWindow.maximize();
        return true;
    }
});

ipcMain.handle("window:close", () => {
    if (mainWindow) mainWindow.close();
    return true;
});

ipcMain.handle("window:is-maximized", () => {
    return mainWindow ? mainWindow.isMaximized() : false;
});

// Dialogs & System
ipcMain.handle("dialog:open-file", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ["openFile", "multiSelections"],
    });
    return canceled ? [] : filePaths;
});

ipcMain.handle("dialog:open-directory", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
    });
    return canceled ? null : filePaths[0];
});

ipcMain.handle("shell:open-path", async (_event, targetPath) => {
    return shell.openPath(targetPath);
});

ipcMain.handle("app:get-version", () => {
    return app.getVersion();
});

ipcMain.handle("notification:show", (_event, { title, body }) => {
    if (Notification.isSupported()) {
        new Notification({ title: title || "FileBridge", body: body || "" }).show();
        return true;
    }
    return false;
});

// Sync Engine
ipcMain.handle("sync:set-token", (_event, token) => {
    syncEngine.setAuthToken(token);
    return true;
});

ipcMain.handle("sync:set-directory", (_event, dirPath) => {
    syncEngine.setSyncDirectory(dirPath);
    return true;
});

ipcMain.handle("sync:start", () => {
    try {
        syncEngine.start();
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle("sync:stop", () => {
    syncEngine.stop();
    return { success: true };
});

ipcMain.handle("sync:get-status", () => {
    return syncEngine.getStatus();
});

app.whenReady().then(() => {
    if (process.platform === "win32") {
        app.setAppUserModelId("com.filebridge.app");
    }
    createWindow();
    setupTray();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        } else if (mainWindow) {
            mainWindow.show();
        }
    });
});

app.on("before-quit", () => {
    isQuitting = true;
    syncEngine.stop();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
