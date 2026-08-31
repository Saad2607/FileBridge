import { useContext, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip,
} from "@mui/material";

import { AuthContext } from "../../context/AuthContext";
import { clearToken, clearUser } from "../../utils/storage";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";

function Navbar({ title = "My Files" }) {
    const { user, setToken, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const isElectron = Boolean(window.electronAPI?.isElectron);
    const initials = user?.username?.charAt(0)?.toUpperCase() || "U";

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        clearToken();
        clearUser();
        setToken(null);
        setUser(null);
        toast.success("Logged out successfully.");
        navigate(ROUTES.LOGIN);
    };

    return (
        <Box
            component="header"
            sx={{
                height: 56,
                width: "100%",
                bgcolor: "#FFFFFF",
                borderBottom: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                px: { xs: 2, md: 3.5 },
                flexShrink: 0,
                zIndex: 100,
                boxSizing: "border-box",
            }}
        >
            {/* Left: Page Title & Platform Badge */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                    minWidth: 0,
                }}
            >
                <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    color="#0F172A"
                    letterSpacing="-0.02em"
                    noWrap
                >
                    {title}
                </Typography>

                {isElectron ? (
                    <Chip
                        icon={<LaptopMacRoundedIcon sx={{ fontSize: "14px !important", color: "#4F46E5 !important" }} />}
                        label="Desktop Client"
                        size="small"
                        sx={{
                            height: 22,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor: "#EEF2FF",
                            color: "#4F46E5",
                            border: "1px solid #C7D2FE",
                            borderRadius: "6px",
                        }}
                    />
                ) : (
                    <Chip
                        icon={<CloudDoneRoundedIcon sx={{ fontSize: "14px !important", color: "#059669 !important" }} />}
                        label="Web Cloud"
                        size="small"
                        sx={{
                            height: 22,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor: "#ECFDF5",
                            color: "#059669",
                            border: "1px solid #A7F3D0",
                            borderRadius: "6px",
                        }}
                    />
                )}
            </Box>

            {/* Right: User Profile Pill */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                    flexShrink: 0,
                }}
            >
                <Box
                    onClick={handleMenuOpen}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        p: "3px 8px 3px 4px",
                        borderRadius: "20px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        transition: "all 0.15s ease",
                        userSelect: "none",
                        "&:hover": {
                            bgcolor: "#F1F5F9",
                            borderColor: "#CBD5E1",
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: "#4F46E5",
                            width: 26,
                            height: 26,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                        }}
                    >
                        {initials}
                    </Avatar>

                    <Typography
                        fontWeight={600}
                        fontSize="0.82rem"
                        color="#1E293B"
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        {user?.username || "Account"}
                    </Typography>

                    <KeyboardArrowDownRoundedIcon
                        sx={{
                            fontSize: 16,
                            color: "#64748B",
                            transition: "transform 0.2s ease",
                            transform: open ? "rotate(180deg)" : "none",
                        }}
                    />
                </Box>

                {/* Dropdown Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    PaperProps={{
                        elevation: 8,
                        sx: {
                            mt: 1.25,
                            minWidth: 230,
                            borderRadius: "14px",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 8px 12px -6px rgba(15, 23, 42, 0.08)",
                            overflow: "hidden",
                            p: 0,
                        },
                    }}
                    MenuListProps={{
                        sx: { p: 1 },
                    }}
                >
                    <Box
                        sx={{
                            px: 1.5,
                            py: 1.25,
                            mb: 0.75,
                            bgcolor: "#F8FAFC",
                            borderRadius: "10px",
                            border: "1px solid #E2E8F0",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.5 }}>
                            <Avatar
                                sx={{
                                    bgcolor: "#4F46E5",
                                    width: 32,
                                    height: 32,
                                    fontSize: "0.82rem",
                                    fontWeight: 800,
                                    boxShadow: "0 2px 8px rgba(79, 70, 229, 0.25)",
                                }}
                            >
                                {initials}
                            </Avatar>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={800} color="#0F172A" fontSize="0.88rem" noWrap>
                                    {user?.name || user?.username || "saad"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontSize="0.72rem" display="block" noWrap>
                                    @{user?.username || "saad"}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, display: "block", mt: 0.25 }}>
                            {isElectron ? "⚡ Desktop Companion Active" : "☁️ Personal Cloud Plan"}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            navigate(ROUTES.SETTINGS);
                        }}
                        sx={{
                            borderRadius: "8px",
                            py: 0.85,
                            px: 1.5,
                            "&:hover": { bgcolor: "#F1F5F9" },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 28, color: "#64748B" }}>
                            <SettingsRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Settings"
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "0.84rem", color: "#334155" }}
                        />
                    </MenuItem>

                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            borderRadius: "8px",
                            py: 0.85,
                            px: 1.5,
                            color: "#EF4444",
                            "&:hover": { bgcolor: "#FEF2F2" },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 28, color: "#EF4444" }}>
                            <LogoutRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Sign Out"
                            primaryTypographyProps={{ fontWeight: 600, fontSize: "0.84rem" }}
                        />
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

export default Navbar;