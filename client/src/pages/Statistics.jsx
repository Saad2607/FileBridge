import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import DashboardOverview from "../components/dashboard/DashboardOverview";
import StorageAnalytics from "../components/dashboard/StorageAnalytics";

function Statistics() {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                boxSizing: "border-box",

                p: {
                    xs: 1.5,
                    sm: 2.5,
                    md: 4,
                },
            }}
        >
            <Box sx={{ mb: 3.5 }}>
                <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                        fontSize: { xs: "1.45rem", sm: "2rem" },
                        mb: 0.5,
                        color: "#0F172A",
                    }}
                >
                    Statistics
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    Overview of your FileBridge storage and file activity.
                </Typography>
            </Box>

            <DashboardOverview />

            <StorageAnalytics />

        </Box>
    );
}

export default Statistics;