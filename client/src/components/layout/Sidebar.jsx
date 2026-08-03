import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
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

    const { setToken, setUser } = useContext(AuthContext);

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
                width: 270,
                bgcolor: "#fff",
                borderRight: "1px solid #ECEFF1",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                p: 2,
            }}
        >

            {/* Logo */}

            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                mb={4}
            >

                <CloudIcon
                    sx={{
                        color: "#1976d2",
                        fontSize: 34,
                    }}
                />

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    FileBridge
                </Typography>

            </Box>

            <Typography
                variant="caption"
                sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    ml: 2,
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                }}
            >
                Workspace
            </Typography>

            <List
                sx={{
                    p: 0,
                }}
            >

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

                                    mb: 1,

                                    py: 1.2,

                                    transition: ".2s",

                                    "&:hover": {

                                        bgcolor: "#F4F8FF",

                                        transform:
                                            "translateX(4px)",

                                    },

                                    "&.Mui-selected": {

                                        bgcolor: "#E8F0FE",

                                        color: "#1976d2",

                                        fontWeight: 700,

                                        "& .MuiListItemIcon-root": {

                                            color: "#1976d2",

                                        },

                                    },

                                }}
                            >

                                <ListItemIcon
                                    sx={{
                                        minWidth: 42,
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

            <Divider sx={{ mb: 2 }} />

            <ListItemButton
                onClick={handleLogout}
                sx={{

                    borderRadius: 3,

                    color: "#d32f2f",

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
                />

            </ListItemButton>

        </Box>

    );

}

export default Sidebar;