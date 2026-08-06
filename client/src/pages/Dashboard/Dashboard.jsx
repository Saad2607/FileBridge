import Navbar from "../../components/layout/Navbar";
import MainContent from "../../components/layout/MainContent";
import DashboardOverview from "../../components/dashboard/DashboardOverview";

import Box from "@mui/material/Box";

function Dashboard() {

    return (

        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#F6F8FB",
            }}
        >

            <Navbar />

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 4,
                }}
            >

                <DashboardOverview />

                <MainContent />

            </Box>

        </Box>

    );

}

export default Dashboard;