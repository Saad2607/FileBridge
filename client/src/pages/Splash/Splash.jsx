import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Avatar, Chip } from "@mui/material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

import { getToken } from "../../utils/storage";
import { ROUTES } from "../../constants/routes";

function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (getToken()) {
                navigate(ROUTES.DASHBOARD);
            } else {
                navigate(ROUTES.LOGIN);
            }
        }, 900);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #090D16 0%, #0F172A 50%, #090D16 100%)",
                color: "#FFFFFF",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient background glow */}
            <Box
                sx={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, rgba(79,70,229,0) 70%)",
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 1,
                }}
            >
                <Avatar
                    sx={{
                        width: 72,
                        height: 72,
                        background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                        color: "#FFFFFF",
                        boxShadow: "0 12px 36px rgba(79,70,229,0.45)",
                        borderRadius: "20px",
                        mb: 2.5,
                    }}
                >
                    <CloudRoundedIcon sx={{ fontSize: 40 }} />
                </Avatar>

                <Typography
                    variant="h4"
                    fontWeight={800}
                    letterSpacing="-0.03em"
                    sx={{
                        background: "linear-gradient(90deg, #FFFFFF 0%, #94A3B8 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 0.5,
                    }}
                >
                    FileBridge
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#94A3B8",
                        fontWeight: 500,
                        mb: 3,
                    }}
                >
                    Cloud &amp; Desktop File Platform
                </Typography>

                <CircularProgress
                    size={24}
                    thickness={4}
                    sx={{
                        color: "#6366F1",
                        mb: 2.5,
                    }}
                />

                <Chip
                    label="v2.0 Ready"
                    size="small"
                    sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        bgcolor: "rgba(255, 255, 255, 0.08)",
                        color: "#94A3B8",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                />
            </Box>
        </Box>
    );
}

export default Splash;