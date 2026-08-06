import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Avatar,
    Chip,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import LogoutIcon from "@mui/icons-material/Logout";
import CloudIcon from "@mui/icons-material/Cloud";

import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import { clearToken, clearUser } from "../../utils/storage";
import { ROUTES } from "../../constants/routes";

function Sidebar() {

    const location = useLocation();

    const navigate = useNavigate();

    const { user, setToken, setUser } = useContext(AuthContext);

    const initials =
        user?.username?.charAt(0)?.toUpperCase() || "U";

    const menuItems = [
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: ROUTES.DASHBOARD,
        },
        {
            text: "Documents",
            icon: <FolderIcon />,
            path: ROUTES.DASHBOARD,
        },
        {
            text: "Favorites",
            icon: <StarIcon />,
            path: ROUTES.FAVORITES,
        },
        {
            text: "Shared Files",
            icon: <ShareIcon />,
            path: ROUTES.SHARED_FILES,
        },
        {
            text: "Recycle Bin",
            icon: <DeleteIcon />,
            path: ROUTES.RECYCLE_BIN,
        },
        {
            text: "Settings",
            icon: <SettingsIcon />,
            path: "#",
        },
    ];

    const handleLogout = () => {

        clearToken();
        clearUser();

        setToken(null);
        setUser(null);

        navigate(ROUTES.LOGIN);

    };

    return (

        <Box
            sx={{
                width: 280,
                bgcolor: "#FFFFFF",
                borderRight: "1px solid #ECEFF1",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                p: 3,
            }}
        >

            {/* Logo */}

            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                mb={4}
            >

                <Avatar
                    sx={{
                        bgcolor: "#1976d2",
                        width: 46,
                        height: 46,
                    }}
                >
                    <CloudIcon />
                </Avatar>

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        FileBridge
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Cloud Storage
                    </Typography>

                </Box>

            </Box>

            {/* User */}

            <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={4}
                p={2}
                sx={{
                    bgcolor: "#F8FAFC",
                    borderRadius: 3,
                }}
            >

                <Avatar
                    sx={{
                        bgcolor: "#1976d2",
                    }}
                >
                    {initials}
                </Avatar>

                <Box>

                    <Typography
                        fontWeight={600}
                    >
                        {user?.username}
                    </Typography>

                    <Chip
                        size="small"
                        label="Free Plan"
                        color="primary"
                        sx={{
                            mt: .5,
                        }}
                    />

                </Box>

            </Box>

            <Typography
                variant="caption"
                sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    mb: 1.5,
                    ml: 1,
                    letterSpacing: 1,
                }}
            >
                WORKSPACE
            </Typography>

            <List sx={{ p: 0 }}>

                {

                    menuItems.map((item) => {

                        const selected =
                            location.pathname === item.path;

                        return (

                            <ListItemButton
                                key={item.text}
                                component={Link}
                                to={item.path}
                                selected={selected}
                                sx={{

                                    borderRadius: 3,

                                    py: 1.3,

                                    px: 2,

                                    mb: 1,

                                    transition: ".25s",

                                    "&:hover": {

                                        bgcolor: "#F5F9FF",

                                        transform:
                                            "translateX(6px)",

                                    },

                                    "&.Mui-selected": {

                                        bgcolor: "#1976d2",

                                        color: "#fff",

                                        boxShadow:
                                            "0 10px 20px rgba(25,118,210,.25)",

                                        "& .MuiListItemIcon-root": {

                                            color: "#fff",

                                        },

                                    },

                                }}
                            >

                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.text}
                                />

                            </ListItemButton>

                        );

                    })

                }

            </List>

            <Box flex={1} />

            <Divider sx={{ my: 2 }} />

            <ListItemButton
                onClick={handleLogout}
                sx={{

                    borderRadius: 3,

                    py: 1.3,

                    "&:hover": {

                        bgcolor: "#FFEBEE",

                    },

                }}
            >

                <ListItemIcon
                    sx={{
                        color: "#d32f2f",
                    }}
                >

                    <LogoutIcon />

                </ListItemIcon>

                <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                        color: "#d32f2f",
                        fontWeight: 600,
                    }}
                />

            </ListItemButton>

        </Box>

    );

}

export default Sidebar;