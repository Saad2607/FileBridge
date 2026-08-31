import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Chip, Tooltip, Avatar } from "@mui/material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PauseCircleFilledRoundedIcon from "@mui/icons-material/PauseCircleFilledRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CropSquareRoundedIcon from "@mui/icons-material/CropSquareRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function DesktopTitlebar() {
    const [syncStatus, setSyncStatus] = useState({ state: "idle", directory: "" });
    const [isSyncingFile, setIsSyncingFile] = useState(false);
    const [syncingFileName, setSyncingFileName] = useState("");

    useEffect(() => {
        if (!window.electronAPI?.sync) return;

        // Fetch initial status
        window.electronAPI.sync.getStatus().then((status) => {
            if (status) {
                setSyncStatus({
                    state: status.isSyncing ? "watching" : "idle",
                    directory: status.syncDirectory || "",
                });
            }
        });

        // Listen for sync status changes
        const unsubStatus = window.electronAPI.sync.onStatusChange((data) => {
            setSyncStatus(data);
        });

        // Listen for file events
        const unsubFiles = window.electronAPI.sync.onFileSync((event) => {
            if (event.type === "start") {
                setIsSyncingFile(true);
                setSyncingFileName(event.file);
            } else {
                setIsSyncingFile(false);
                setSyncingFileName("");
            }
        });

        return () => {
            if (unsubStatus) unsubStatus();
            if (unsubFiles) unsubFiles();
        };
    }, []);

    const handleMinimize = () => {
        window.electronAPI?.window?.minimize();
    };

    const handleMaximize = () => {
        window.electronAPI?.window?.maximize();
    };

    const handleClose = () => {
        window.electronAPI?.window?.close();
    };

    const handleOpenFolder = () => {
        if (syncStatus.directory) {
            window.electronAPI?.openInExplorer(syncStatus.directory);
        }
    };

    return (
        <Box
            className="draggable-region"
            sx={{
                height: 38,
                bgcolor: "#0F172A",
                color: "#E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                zIndex: 9999,
                userSelect: "none",
            }}
        >
            {/* Left: Branding & Sync Status */}
            <Box display="flex" alignItems="center" gap={1.5} className="no-drag">
                <Box display="flex" alignItems="center" gap={0.75}>
                    <Avatar
                        src="/favicon.svg"
                        alt="FileBridge Logo"
                        sx={{
                            background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                            width: 22,
                            height: 22,
                            borderRadius: "6px",
                            boxShadow: "0 2px 6px rgba(79, 70, 229, 0.3)",
                        }}
                    >
                        <CloudRoundedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
                    </Avatar>
                    <Typography fontSize="0.8rem" fontWeight={700} color="#FFFFFF">
                        FileBridge
                    </Typography>
                    <Chip
                        label="DESKTOP"
                        size="small"
                        sx={{
                            height: 16,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            bgcolor: "rgba(56, 189, 248, 0.15)",
                            color: "#38BDF8",
                            border: "1px solid rgba(56, 189, 248, 0.3)",
                            borderRadius: "4px",
                        }}
                    />
                </Box>

                {/* Sync Pill */}
                {isSyncingFile ? (
                    <Tooltip title={`Syncing: ${syncingFileName}`}>
                        <Chip
                            icon={<SyncRoundedIcon sx={{ fontSize: 13, color: "#38BDF8 !important", animation: "spin 1.5s linear infinite" }} />}
                            label={`Syncing ${syncingFileName}`}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                bgcolor: "rgba(56, 189, 248, 0.12)",
                                color: "#38BDF8",
                                maxWidth: 180,
                            }}
                        />
                    </Tooltip>
                ) : syncStatus.state === "watching" ? (
                    <Tooltip title="Local folder is synced and up to date with cloud">
                        <Chip
                            icon={<CheckCircleRoundedIcon sx={{ fontSize: 13, color: "#10B981 !important" }} />}
                            label="Synced"
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                bgcolor: "rgba(16, 185, 129, 0.12)",
                                color: "#10B981",
                            }}
                        />
                    </Tooltip>
                ) : (
                    <Chip
                        icon={<PauseCircleFilledRoundedIcon sx={{ fontSize: 13, color: "#94A3B8 !important" }} />}
                        label="Sync Idle"
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            bgcolor: "rgba(148, 163, 184, 0.12)",
                            color: "#94A3B8",
                        }}
                    />
                )}
            </Box>

            {/* Center: Draggable Spacer */}
            <Box flex={1} height="100%" />

            {/* Right: Actions & Window Controls */}
            <Box display="flex" alignItems="center" gap={0.5} className="no-drag">
                {syncStatus.directory && (
                    <Tooltip title="Open Local Sync Folder in File Explorer">
                        <IconButton
                            size="small"
                            onClick={handleOpenFolder}
                            sx={{
                                color: "#94A3B8",
                                p: 0.5,
                                mr: 1,
                                "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.1)" },
                            }}
                        >
                            <FolderOpenRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                )}

                {/* Minimize */}
                <IconButton
                    size="small"
                    onClick={handleMinimize}
                    sx={{
                        color: "#94A3B8",
                        borderRadius: 0,
                        width: 32,
                        height: 28,
                        "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.1)" },
                    }}
                >
                    <RemoveRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>

                {/* Maximize */}
                <IconButton
                    size="small"
                    onClick={handleMaximize}
                    sx={{
                        color: "#94A3B8",
                        borderRadius: 0,
                        width: 32,
                        height: 28,
                        "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.1)" },
                    }}
                >
                    <CropSquareRoundedIcon sx={{ fontSize: 12 }} />
                </IconButton>

                {/* Close */}
                <IconButton
                    size="small"
                    onClick={handleClose}
                    sx={{
                        color: "#94A3B8",
                        borderRadius: 0,
                        width: 36,
                        height: 28,
                        "&:hover": { color: "#FFFFFF", bgcolor: "#EF4444" },
                    }}
                >
                    <CloseRoundedIcon sx={{ fontSize: 15 }} />
                </IconButton>
            </Box>
        </Box>
    );
}

export default DesktopTitlebar;
