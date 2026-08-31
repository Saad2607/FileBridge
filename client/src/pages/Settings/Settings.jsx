import { useState, useEffect, useContext } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Button,
    Chip,
    LinearProgress,
    Divider,
    Switch,
    FormControlLabel,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";
import { clearToken, clearUser } from "../../utils/storage";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/dashboardService";
import { formatFileSize } from "../../utils/fileHelpers";

function Settings() {
    const { user, setToken, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const isElectron = Boolean(window.electronAPI?.isElectron);

    const [stats, setStats] = useState(null);
    const [syncDir, setSyncDir] = useState("");
    const [autoSync, setAutoSync] = useState(true);

    const initials = user?.username?.charAt(0)?.toUpperCase() || "U";
    const TOTAL_QUOTA = 5 * 1024 * 1024 * 1024; // 5 GB default

    useEffect(() => {
        getDashboardStats()
            .then((data) => setStats(data))
            .catch(() => {});

        if (window.electronAPI?.sync) {
            window.electronAPI.sync.getStatus().then((s) => {
                if (s?.syncDirectory) setSyncDir(s.syncDirectory);
            });
        }
    }, []);

    const handleChangeSyncFolder = async () => {
        try {
            const dir = await window.electronAPI?.selectFolder();
            if (dir) {
                await window.electronAPI?.sync?.setDirectory(dir);
                await window.electronAPI?.sync?.start();
                setSyncDir(dir);
                toast.success(`Sync folder updated to: ${dir}`);
            }
        } catch {
            toast.error("Failed to select folder.");
        }
    };

    const handleOpenExplorer = () => {
        if (syncDir) {
            window.electronAPI?.openInExplorer(syncDir);
        }
    };

    const handleLogout = () => {
        clearToken();
        clearUser();
        setToken(null);
        setUser(null);
        toast.success("Logged out successfully.");
        navigate(ROUTES.LOGIN);
    };

    const storageUsed = stats?.stats?.storageUsed ?? stats?.storageUsed ?? 0;
    const fileCount = stats?.stats?.files ?? stats?.files ?? stats?.fileCount ?? 0;
    const folderCount = stats?.stats?.folders ?? stats?.folders ?? stats?.folderCount ?? 0;
    const storagePercent = Math.min(100, (storageUsed / TOTAL_QUOTA) * 100);
    const freeBytes = Math.max(0, TOTAL_QUOTA - storageUsed);

    return (
        <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1000, mx: "auto" }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight={800} color="#0F172A" letterSpacing="-0.03em">
                    Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Manage your account details, storage quota, and desktop synchronization.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* 1. Account Profile Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={0} sx={{ height: "100%", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.25, mb: 2.5 }}>
                                <PersonRoundedIcon sx={{ color: "#4F46E5" }} />
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Account Profile
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, mb: 2.5 }}>
                                <Avatar
                                    sx={{
                                        background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                                        width: 52,
                                        height: 52,
                                        fontSize: "1.25rem",
                                        fontWeight: 800,
                                        boxShadow: "0 6px 16px rgba(79,70,229,0.25)",
                                        borderRadius: "12px",
                                    }}
                                >
                                    {initials}
                                </Avatar>

                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                                        {user?.name || user?.username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        @{user?.username}
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mt: 0.75 }}>
                                        <Chip label="Personal Plan" size="small" variant="outlined" sx={{ fontWeight: 600, height: 22, fontSize: "0.72rem" }} />
                                        <Chip label="Free 5 GB" size="small" color="primary" sx={{ fontWeight: 700, height: 22, fontSize: "0.72rem" }} />
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                                {user?.name && (
                                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Full Name</Typography>
                                        <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                                    </Box>
                                )}
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Username</Typography>
                                    <Typography variant="body2" fontWeight={700}>@{user?.username}</Typography>
                                </Box>
                                {user?.email && (
                                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Email Address</Typography>
                                        <Typography variant="body2" fontWeight={700}>{user.email}</Typography>
                                    </Box>
                                )}
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Status</Typography>
                                    <Typography variant="body2" fontWeight={700} color="success.main">Active Account</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 2. Storage Quota Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={0} sx={{ height: "100%", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.25, mb: 2.5 }}>
                                <CloudQueueRoundedIcon sx={{ color: "#0284C7" }} />
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Cloud Storage Quota
                                </Typography>
                            </Box>

                            <Box mb={2}>
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
                                    <Typography variant="h5" fontWeight={800} color="#0F172A">
                                        {formatFileSize(storageUsed)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        of 5.00 GB used
                                    </Typography>
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={storagePercent}
                                    sx={{
                                        height: 7,
                                        borderRadius: "4px",
                                        bgcolor: "#EEF2F6",
                                        "& .MuiLinearProgress-bar": {
                                            borderRadius: "4px",
                                            background: "linear-gradient(90deg, #4F46E5 0%, #0284C7 100%)",
                                        },
                                    }}
                                />
                            </Box>

                            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                                {storagePercent.toFixed(1)}% of your cloud quota is utilized. You have {formatFileSize(freeBytes)} free space remaining.
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                                <Chip label={`${fileCount} Files`} size="small" variant="outlined" sx={{ fontWeight: 600, height: 22, fontSize: "0.72rem" }} />
                                <Chip label={`${folderCount} Folders`} size="small" variant="outlined" sx={{ fontWeight: 600, height: 22, fontSize: "0.72rem" }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 3. Desktop Sync Settings */}
                <Grid size={{ xs: 12 }}>
                    <Card elevation={0} sx={{ borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.25, mb: 2 }}>
                                <LaptopMacRoundedIcon sx={{ color: "#4F46E5" }} />
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Desktop Synchronization
                                </Typography>
                                <Chip
                                    label={isElectron ? "DESKTOP RUNNING" : "WEB CLOUD MODE"}
                                    size="small"
                                    color={isElectron ? "success" : "default"}
                                    sx={{ fontWeight: 700, height: 20, fontSize: "0.68rem" }}
                                />
                            </Box>

                            {isElectron ? (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        Local folder configured for automatic background synchronization.
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            alignItems: { xs: "flex-start", sm: "center" },
                                            justifyContent: "space-between",
                                            p: 2,
                                            borderRadius: "10px",
                                            bgcolor: "#F8FAFC",
                                            border: "1px solid #E2E8F0",
                                            gap: 2,
                                            mb: 2.5,
                                        }}
                                    >
                                        <Box minWidth={0} flex={1}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" fontSize="0.72rem">
                                                LOCAL SYNC DIRECTORY
                                            </Typography>
                                            <Typography variant="body2" fontWeight={700} fontFamily="monospace" noWrap>
                                                {syncDir || "C:\\Users\\User\\FileBridge"}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<FolderOpenRoundedIcon />}
                                                onClick={handleOpenExplorer}
                                                sx={{ borderRadius: "8px", fontWeight: 600 }}
                                            >
                                                Open in Explorer
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                startIcon={<EditRoundedIcon />}
                                                onClick={handleChangeSyncFolder}
                                                sx={{ borderRadius: "8px", fontWeight: 700 }}
                                            >
                                                Change Folder
                                            </Button>
                                        </Box>
                                    </Box>

                                    <FormControlLabel
                                        control={<Switch checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} color="primary" />}
                                        label={<Typography variant="body2" fontWeight={600}>Auto-start synchronization on desktop launch</Typography>}
                                    />
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        p: 2.5,
                                        borderRadius: "10px",
                                        bgcolor: "#F8FAFC",
                                        border: "1px solid #E2E8F0",
                                        display: "flex",
                                        flexDirection: { xs: "column", sm: "row" },
                                        justifyContent: "space-between",
                                        alignItems: { xs: "flex-start", sm: "center" },
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={700} color="#0F172A">
                                            Enable Local Background Sync
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Run the FileBridge Electron companion on your PC to watch a local directory and auto-upload changes.
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        href="https://github.com/Saad2607/FileBridge/releases/latest/download/FileBridge.Setup.1.0.0.exe"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        startIcon={<LaptopMacRoundedIcon />}
                                        sx={{
                                            borderRadius: "8px",
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                            background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                                            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                                        }}
                                    >
                                        Download Desktop App (.exe)
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 4. Security & Session */}
                <Grid size={{ xs: 12 }}>
                    <Card elevation={0} sx={{ borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                        <CardContent
                            sx={{
                                p: 3,
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                justifyContent: "space-between",
                                alignItems: { xs: "flex-start", sm: "center" },
                                gap: 2,
                            }}
                        >
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "10px",
                                        bgcolor: "#FEF2F2",
                                        color: "#EF4444",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <SecurityRoundedIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700} color="#0F172A">
                                        Session Security
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Active JWT Authentication session • Ready to sign out anytime
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<LogoutRoundedIcon />}
                                onClick={handleLogout}
                                sx={{
                                    borderRadius: "8px",
                                    fontWeight: 700,
                                    px: 2,
                                    borderColor: "#FCA5A5",
                                    "&:hover": { bgcolor: "#FEF2F2", borderColor: "#EF4444" },
                                }}
                            >
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Settings;
