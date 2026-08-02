import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import LogoutIcon from "@mui/icons-material/Logout";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";

import { AuthContext } from "../../context/AuthContext";

import { clearToken, clearUser } from "../../utils/storage";

import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    }

    return (
        <Box
            sx={{
                width: 250,
                borderRight: "1px solid #e0e0e0",
                minHeight: "100vh",
                bgcolor: "#fafafa",
                p: 2,
            }}
        >
            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mb: 3 }}
            >
                FileBridge
            </Typography>

            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                        }}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.text}
                        />
                    </ListItemButton>

                ))}
            </List>

            <ListItemButton
                onClick={handleLogout}
                sx={{ borderRadius: 2, mt: 2 }}
            >
                <ListItemIcon>
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