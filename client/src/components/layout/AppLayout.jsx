import { Outlet, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import DesktopTitlebar from "../desktop/DesktopTitlebar";
import { UploadContext } from "../../context/UploadContext";
import UploadProgress from "../upload/UploadProgress";
import { ROUTES } from "../../constants/routes";

function getPageTitle(pathname) {
    switch (pathname) {
        case ROUTES.DASHBOARD:
            return "My Files";
        case ROUTES.STATISTICS:
            return "Statistics & Storage";
        case ROUTES.FAVORITES:
            return "Favorites";
        case ROUTES.SHARED_FILES:
            return "Shared Files";
        case ROUTES.RECYCLE_BIN:
            return "Recycle Bin";
        case ROUTES.SETTINGS:
            return "Settings";
        default:
            return "Dashboard";
    }
}

function AppLayout() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const {
        uploading,
        progress,
        currentFile,
    } = useContext(UploadContext);

    const isElectron = Boolean(window.electronAPI?.isElectron);
    const title = getPageTitle(location.pathname);

    const handleMobileToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMobileClose = () => {
        setMobileOpen(false);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100dvh",
                minHeight: "100dvh",
                overflow: "hidden",
                bgcolor: "#F8FAFC",
            }}
        >
            {/* Desktop Titlebar (Rendered only in Electron) */}
            {isElectron && <DesktopTitlebar />}

            {/* Main Application Body */}
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    overflow: "hidden",
                    minHeight: 0,
                }}
            >
                <Sidebar
                    mobileOpen={mobileOpen}
                    onMobileClose={handleMobileClose}
                />

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                        minWidth: 0,
                        minHeight: 0,
                    }}
                >
                    <Navbar
                        title={title}
                        onMobileToggle={handleMobileToggle}
                    />

                    <Box
                        component="main"
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            minHeight: 0,
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        <Outlet />
                    </Box>
                </Box>
            </Box>

            <UploadProgress
                uploading={uploading}
                progress={progress}
                currentFile={currentFile}
            />
        </Box>
    );
}

export default AppLayout;