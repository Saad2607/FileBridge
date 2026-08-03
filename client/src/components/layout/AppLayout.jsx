import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

import Sidebar from "./Sidebar";

import { useContext } from "react";

import { UploadContext } from "../../context/UploadContext";

import UploadProgress from "../upload/UploadProgress";

function AppLayout() {

    const { uploading, progress, currentFile } = useContext(UploadContext);

    return (

        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
            }}
        >
            <Sidebar />

            <Box
                sx={{
                    flex: 1,
                }}
            >
                <Outlet />
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