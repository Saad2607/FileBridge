import {
    Paper,
    Typography,
    LinearProgress,
    Box,
    Fade,
    Avatar,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";

function UploadProgress({ uploading, progress, currentFile }) {
    return (
        <Fade in={uploading} timeout={300}>
            <Paper
                elevation={10}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    width: 360,
                    p: 2.5,
                    borderRadius: 4,
                    zIndex: 2000,
                    bgcolor: "#0F172A",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Avatar
                        sx={{
                            bgcolor: "rgba(56, 189, 248, 0.15)",
                            color: "#38BDF8",
                            width: 42,
                            height: 42,
                            borderRadius: 2.5,
                        }}
                    >
                        <CloudUploadRoundedIcon />
                    </Avatar>

                    <Box flex={1} minWidth={0}>
                        <Typography variant="subtitle2" fontWeight={800} color="#FFFFFF">
                            Uploading File...
                        </Typography>
                        <Typography variant="caption" color="#94A3B8" noWrap display="block">
                            {currentFile || "Processing upload..."}
                        </Typography>
                    </Box>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(255, 255, 255, 0.12)",
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            background: "linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)",
                        },
                    }}
                />

                <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="#94A3B8">
                        Cloud Upload
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="#38BDF8">
                        {progress}%
                    </Typography>
                </Box>
            </Paper>
        </Fade>
    );
}

export default UploadProgress;