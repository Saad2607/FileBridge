import { Outlet, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { useContext } from "react";

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
    const {
        uploading,
        progress,
        currentFile,
    } = useContext(UploadContext);

    const isElectron = Boolean(window.electronAPI?.isElectron);
    const title = getPageTitle(location.pathname);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
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
                }}
            >
                <Sidebar />

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                        minWidth: 0,
                    }}
                >
                    <Navbar title={title} />

                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
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