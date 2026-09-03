import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    IconButton,
    Tooltip,
} from "@mui/material";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import toast from "react-hot-toast";

function DesktopSyncHub() {
    const [syncStatus, setSyncStatus] = useState({ isSyncing: true, syncDirectory: "" });
    const [isWatching, setIsWatching] = useState(true);

    useEffect(() => {
        if (!window.electronAPI?.sync) return;

        window.electronAPI.sync.getStatus().then((status) => {
            if (status) {
                setSyncStatus(status);
                setIsWatching(status.isSyncing);
            }
        });

        const unsub = window.electronAPI.sync.onStatusChange((data) => {
            setIsWatching(data.state === "watching");
            if (data.directory) {
                setSyncStatus((prev) => ({ ...prev, syncDirectory: data.directory }));
            }
        });

        return () => {
            if (unsub) unsub();
        };
    }, []);

    const handleChangeDirectory = async () => {
        try {
            const chosenDir = await window.electronAPI?.selectFolder();
            if (chosenDir) {
                await window.electronAPI?.sync?.setDirectory(chosenDir);
                await window.electronAPI?.sync?.start();
                setSyncStatus((prev) => ({ ...prev, syncDirectory: chosenDir }));
                setIsWatching(true);
                toast.success(`Sync directory updated: ${chosenDir}`);
            }
        } catch {
            toast.error("Failed to update sync folder.");
        }
    };

    const handleOpenInExplorer = () => {
        if (syncStatus.syncDirectory) {
            window.electronAPI?.openInExplorer(syncStatus.syncDirectory);
        }
    };

    const handleToggleSync = async () => {
        try {
            if (isWatching) {
                await window.electronAPI?.sync?.stop();
                setIsWatching(false);
                toast.success("Desktop sync paused.");
            } else {
                await window.electronAPI?.sync?.start();
                setIsWatching(true);
                toast.success("Desktop sync resumed.");
            }
        } catch {
            toast.error("Failed to toggle sync state.");
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
                p: 0.5,
                mb: 4,
            }}
        >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    justifyContent="space-between"
                    gap={2.5}
                >
                    {/* Left: Icon & Local Folder Path */}
                    <Box display="flex" alignItems="center" gap={2} minWidth={0} flex={1}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 3,
                                bgcolor: isWatching ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                                color: isWatching ? "#10B981" : "#F59E0B",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <FolderRoundedIcon sx={{ fontSize: 28 }} />
                        </Box>

                        <Box minWidth={0} flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={0.25}>
                                <Typography variant="subtitle1" fontWeight={700} color="#0F172A">
                                    Desktop Sync Folder
                                </Typography>
                                <Chip
                                    label={isWatching ? "Live Watching" : "Sync Paused"}
                                    size="small"
                                    color={isWatching ? "success" : "warning"}
                                    variant="filled"
                                    sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700 }}
                                />
                            </Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                sx={{
                                    display: "block",
                                    fontFamily: "monospace",
                                    bgcolor: "#F1F5F9",
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1.5,
                                    width: "fit-content",
                                    maxWidth: "100%",
                                }}
                            >
                                {syncStatus.syncDirectory || "C:\\Users\\User\\FileBridge"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right: Actions */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "stretch", sm: "center" },
                            gap: 1.25,
                            width: { xs: "100%", md: "auto" },
                            flexShrink: 0,
                        }}
                    >
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FolderOpenRoundedIcon />}
                            onClick={handleOpenInExplorer}
                            sx={{
                                borderRadius: "8px",
                                fontWeight: 600,
                                color: "#334155",
                                textTransform: "none",
                                py: 0.8,
                                px: 1.75,
                                width: { xs: "100%", sm: "auto" },
                            }}
                        >
                            Open in Explorer
                        </Button>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditRoundedIcon />}
                            onClick={handleChangeDirectory}
                            sx={{
                                borderRadius: "8px",
                                fontWeight: 600,
                                color: "#334155",
                                textTransform: "none",
                                py: 0.8,
                                px: 1.75,
                                width: { xs: "100%", sm: "auto" },
                            }}
                        >
                            Change Folder
                        </Button>

                        <Button
                            size="small"
                            variant="contained"
                            color={isWatching ? "inherit" : "primary"}
                            startIcon={isWatching ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                            onClick={handleToggleSync}
                            sx={{
                                borderRadius: "8px",
                                fontWeight: 700,
                                textTransform: "none",
                                py: 0.8,
                                px: 2,
                                width: { xs: "100%", sm: "auto" },
                                bgcolor: isWatching ? "#F1F5F9" : undefined,
                                color: isWatching ? "#475569" : undefined,
                                "&:hover": {
                                    bgcolor: isWatching ? "#E2E8F0" : undefined,
                                },
                            }}
                        >
                            {isWatching ? "Pause Sync" : "Resume Sync"}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default DesktopSyncHub;
