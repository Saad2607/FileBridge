const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    isElectron: true,
    platform: process.platform,

    // Window Controls
    window: {
        minimize: () => ipcRenderer.invoke("window:minimize"),
        maximize: () => ipcRenderer.invoke("window:maximize"),
        close: () => ipcRenderer.invoke("window:close"),
        isMaximized: () => ipcRenderer.invoke("window:is-maximized"),
    },

    // Dialog & System
    selectFile: () => ipcRenderer.invoke("dialog:open-file"),
    selectFolder: () => ipcRenderer.invoke("dialog:open-directory"),
    openInExplorer: (targetPath) => ipcRenderer.invoke("shell:open-path", targetPath),
    getAppVersion: () => ipcRenderer.invoke("app:get-version"),
    showNotification: (title, body) => ipcRenderer.invoke("notification:show", { title, body }),

    // Sync Engine IPC
    sync: {
        setToken: (token) => ipcRenderer.invoke("sync:set-token", token),
        setDirectory: (dirPath) => ipcRenderer.invoke("sync:set-directory", dirPath),
        start: () => ipcRenderer.invoke("sync:start"),
        stop: () => ipcRenderer.invoke("sync:stop"),
        getStatus: () => ipcRenderer.invoke("sync:get-status"),
        onStatusChange: (callback) => {
            const subscription = (_event, data) => callback(data);
            ipcRenderer.on("sync:status-changed", subscription);
            return () => ipcRenderer.removeListener("sync:status-changed", subscription);
        },
        onFileSync: (callback) => {
            const subscription = (_event, data) => callback(data);
            ipcRenderer.on("sync:file-event", subscription);
            return () => ipcRenderer.removeListener("sync:file-event", subscription);
        },
    },
});
