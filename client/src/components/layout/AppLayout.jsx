import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

import Sidebar from "./Sidebar";

import { useContext } from "react";
import { UploadContext } from "../../context/UploadContext";

import UploadProgress from "../upload/UploadProgress";

function AppLayout() {

    const {
        uploading,
        progress,
        currentFile,
    } = useContext(UploadContext);

    return (

        <Box
            sx={{
                display: "flex",
                height: "100vh",
                overflow: "hidden",
                bgcolor: "#F6F8FB",
            }}
        >

            <Sidebar />

            <Box
                sx={{
                    flex: 1,
                    overflow: "hidden",
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