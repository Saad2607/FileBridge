import { Paper, Typography, Box, Avatar } from "@mui/material";
import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function WelcomeBanner() {
    const { user } = useContext(AuthContext);

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 4,
                p: { xs: 3, md: 3.5 },
                borderRadius: 4,
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                color: "#FFFFFF",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
            }}
        >
            <Box>
                <Box display="flex" alignItems="center" gap={1.25} mb={0.5}>
                    <WavingHandRoundedIcon sx={{ color: "#FBBF24", fontSize: 28 }} />
                    <Typography variant="h5" fontWeight={800} color="#FFFFFF" letterSpacing="-0.3px">
                        Welcome back, {user?.username || "Explorer"}!
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                    Manage, search, and synchronize your cloud and local workspace from one unified hub.
                </Typography>
            </Box>
        </Paper>
    );
}

export default WelcomeBanner;