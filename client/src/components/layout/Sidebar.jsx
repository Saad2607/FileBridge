import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Avatar,
    LinearProgress,
    Drawer,
    IconButton,
} from "@mui/material";

import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import InsertChartRoundedIcon from "@mui/icons-material/InsertChartRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import toast from "react-hot-toast";

import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import { clearToken, clearUser } from "../../utils/storage";
import { ROUTES } from "../../constants/routes";
import { getDashboardStats } from "../../services/dashboardService";
import { formatFileSize } from "../../utils/fileHelpers";

function SidebarContent({ onMobileClose }) {
    const location = useLocation();
    const navigate = useNavigate();

    const { user, setToken, setUser } = useContext(AuthContext);
    const [storageUsed, setStorageUsed] = useState(0);

    const initials = user?.username?.charAt(0)?.toUpperCase() || "U";
    const TOTAL_STORAGE = 5 * 1024 * 1024 * 1024; // 5 GB

    useEffect(() => {
        getDashboardStats()
            .then((data) => {
                const used = data?.stats?.storageUsed ?? data?.storageUsed ?? 0;
                setStorageUsed(used);
            })
            .catch(() => {});
    }, [location.pathname]);

    const handleNavigate = (path) => {
        if (onMobileClose) onMobileClose();
        navigate(path);
    };

    const mainNav = [
        {
            text: "My Files",
            icon: <FolderRoundedIcon sx={{ fontSize: 20 }} />,
            path: ROUTES.DASHBOARD,
        },
        {
            text: "Storage Insights",
            icon: <InsertChartRoundedIcon sx={{ fontSize: 20 }} />,
            path: ROUTES.STATISTICS,
        },
        {
            text: "Starred",
            icon: <StarRoundedIcon sx={{ fontSize: 20 }} />,
            path: ROUTES.FAVORITES,
        },
    ];

    const collaborateNav = [
        {
            text: "Shared Links",
            icon: <ShareRoundedIcon sx={{ fontSize: 20 }} />,
            path: ROUTES.SHARED_FILES,
        },
    ];

    const systemNav = [
        {
            text: "Recycle Bin",
            icon: <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />,
            path: ROUTES.RECYCLE_BIN,
        },
        {
            text: "Settings",
            icon: <SettingsRoundedIcon sx={{ fontSize: 20 }} />,
            path: ROUTES.SETTINGS,
        },
    ];

    const handleLogout = () => {
        if (onMobileClose) onMobileClose();
        clearToken();
        clearUser();
        setToken(null);
        setUser(null);
        toast.success("Logged out successfully.");
        navigate(ROUTES.LOGIN);
    };

    const storagePercent = Math.min(100, (storageUsed / TOTAL_STORAGE) * 100);

    const renderNavGroup = (items) => (
        <List sx={{ p: 0, mb: 1.5 }}>
            {items.map((item) => {
                const selected = location.pathname === item.path;

                return (
                    <ListItemButton
                        key={item.text}
                        component={Link}
                        to={item.path}
                        selected={selected}
                        onClick={() => {
                            if (onMobileClose) onMobileClose();
                        }}
                        sx={{
                            borderRadius: "10px",
                            py: 0.9,
                            px: 1.5,
                            mb: 0.4,
                            transition: "all .15s ease",
                            color: selected ? "#4F46E5" : "#475569",
                            bgcolor: selected ? "rgba(79, 70, 229, 0.08)" : "transparent",
                            "&:hover": {
                                bgcolor: selected ? "rgba(79, 70, 229, 0.12)" : "#F1F5F9",
                                color: selected ? "#4F46E5" : "#0F172A",
                            },
                            "&.Mui-selected": {
                                bgcolor: "rgba(79, 70, 229, 0.08)",
                                color: "#4F46E5",
                                "& .MuiListItemIcon-root": {
                                    color: "#4F46E5",
                                },
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 32,
                                color: selected ? "#4F46E5" : "#64748B",
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                fontWeight: selected ? 700 : 500,
                                fontSize: "0.85rem",
                            }}
                        />
                    </ListItemButton>
                );
            })}
        </List>
    );

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 2,
                boxSizing: "border-box",
                userSelect: "none",
                bgcolor: "#FFFFFF",
            }}
        >
            {/* Brand Logo Header */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2.5,
                    px: 1,
                    py: 0.5,
                }}
            >
                <Box
                    onClick={() => handleNavigate(ROUTES.DASHBOARD)}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1.25,
                        cursor: "pointer",
                        borderRadius: "10px",
                    }}
                >
                    <Avatar
                        sx={{
                            background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                            width: 34,
                            height: 34,
                            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                            borderRadius: "8px",
                        }}
                    >
                        <CloudRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />
                    </Avatar>

                    <Box>
                        <Typography variant="subtitle2" fontWeight={800} color="#0F172A" letterSpacing="-0.02em" lineHeight={1.2}>
                            FileBridge
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={500} fontSize="0.7rem">
                            Cloud &amp; Desktop
                        </Typography>
                    </Box>
                </Box>

                {onMobileClose && (
                    <IconButton
                        size="small"
                        onClick={onMobileClose}
                        sx={{
                            display: { xs: "flex", md: "none" },
                            color: "#64748B",
                            "&:hover": { bgcolor: "#F1F5F9", color: "#0F172A" },
                        }}
                    >
                        <CloseRoundedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                )}
            </Box>

            {/* Navigation Menus */}
            <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: "#94A3B8",
                        fontWeight: 700,
                        px: 1.5,
                        mb: 0.75,
                        display: "block",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontSize: "0.68rem",
                    }}
                >
                    WORKSPACE
                </Typography>
                {renderNavGroup(mainNav)}

                <Typography
                    variant="caption"
                    sx={{
                        color: "#94A3B8",
                        fontWeight: 700,
                        px: 1.5,
                        mb: 0.75,
                        display: "block",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontSize: "0.68rem",
                    }}
                >
                    COLLABORATION
                </Typography>
                {renderNavGroup(collaborateNav)}

                <Typography
                    variant="caption"
                    sx={{
                        color: "#94A3B8",
                        fontWeight: 700,
                        px: 1.5,
                        mb: 0.75,
                        display: "block",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontSize: "0.68rem",
                    }}
                >
                    SYSTEM
                </Typography>
                {renderNavGroup(systemNav)}
            </Box>

            {/* Storage Quota Card */}
            <Box
                sx={{
                    p: 1.75,
                    mb: 1.5,
                    bgcolor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        mb: 0.75,
                    }}
                >
                    <Typography variant="caption" fontWeight={700} color="#0F172A" fontSize="0.75rem">
                        Cloud Storage
                    </Typography>
                    <Typography variant="caption" color="#4F46E5" fontWeight={700} fontSize="0.75rem">
                        {storagePercent.toFixed(0)}%
                    </Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={storagePercent}
                    sx={{
                        height: 5,
                        borderRadius: 3,
                        bgcolor: "#E2E8F0",
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            background: storagePercent > 90 ? "#EF4444" : "linear-gradient(90deg, #4F46E5 0%, #0284C7 100%)",
                        },
                    }}
                />

                <Typography variant="caption" color="text.secondary" display="block" mt={0.75} fontWeight={500} fontSize="0.72rem">
                    {formatFileSize(storageUsed)} of 5 GB used
                </Typography>
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* User Profile Mini Bar */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 0.75,
                    borderRadius: "10px",
                    bgcolor: "#F8FAFC",
                }}
            >
                <Box
                    onClick={() => handleNavigate(ROUTES.SETTINGS)}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1.25,
                        cursor: "pointer",
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: "#4F46E5",
                            fontWeight: 700,
                            width: 30,
                            height: 30,
                            fontSize: "0.8rem",
                            borderRadius: "8px",
                        }}
                    >
                        {initials}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={700} fontSize="0.82rem" color="#1E293B" noWrap>
                            {user?.username || "Account"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="0.68rem" display="block" noWrap>
                            Personal Plan
                        </Typography>
                    </Box>
                </Box>

                <Box
                    onClick={handleLogout}
                    sx={{
                        p: 0.75,
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "#94A3B8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": {
                            bgcolor: "#FEF2F2",
                            color: "#EF4444",
                        },
                    }}
                    title="Sign Out"
                >
                    <LogoutRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
            </Box>
        </Box>
    );
}

function Sidebar({ mobileOpen = false, onMobileClose }) {
    return (
        <>
            {/* Desktop Permanent Sidebar */}
            <Box
                component="aside"
                sx={{
                    display: { xs: "none", md: "flex" },
                    width: 250,
                    height: "100%",
                    borderRight: "1px solid #E2E8F0",
                    flexShrink: 0,
                }}
            >
                <SidebarContent />
            </Box>

            {/* Mobile Temporary Drawer */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                    sx: {
                        width: 280,
                        bgcolor: "#FFFFFF",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                    },
                }}
                sx={{
                    display: { xs: "block", md: "none" },
                    zIndex: 1400,
                }}
            >
                <SidebarContent onMobileClose={onMobileClose} />
            </Drawer>
        </>
    );
}

export default Sidebar;
