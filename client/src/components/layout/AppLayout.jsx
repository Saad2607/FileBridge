import { Outlet } from "react-router-dom";
import  Box  from "@mui/material/Box";

import Sidebar from "./Sidebar";

function AppLayout() {
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
        </Box>
    );
}

export default AppLayout;