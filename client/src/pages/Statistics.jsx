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
                    xs: 2,
                    md: 4,
                },
            }}
        >
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                        mb: 1,
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