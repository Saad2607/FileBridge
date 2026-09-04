import { useState } from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import BrokenImageRoundedIcon from "@mui/icons-material/BrokenImageRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

function ImagePreview({ fileUrl }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    if (!fileUrl) {
        return (
            <Box py={8} textAlign="center">
                <BrokenImageRoundedIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                    No image URL available.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            sx={{
                width: "100%",
                minHeight: 400,
                bgcolor: "#00000008",
                borderRadius: "12px",
                p: 2,
            }}
        >
            {loading && !error && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        zIndex: 2,
                    }}
                >
                    <CircularProgress size={36} />
                    <Typography variant="caption" color="text.secondary">
                        Loading image...
                    </Typography>
                </Box>
            )}

            {error ? (
                <Box py={6} textAlign="center">
                    <BrokenImageRoundedIcon sx={{ fontSize: 54, color: "#EF4444", mb: 1.5 }} />
                    <Typography variant="subtitle1" fontWeight={700} color="#1E293B">
                        Image Preview Unavailable
                    </Typography>
                    <Typography variant="body2" color="text.secondary" maxWidth={360} mx="auto" mt={0.5} mb={2.5}>
                        The image could not be rendered directly. You can open the raw file stream or download it.
                    </Typography>
                    <Button
                        size="small"
                        variant="outlined"
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<OpenInNewRoundedIcon />}
                        sx={{ borderRadius: "8px", fontWeight: 600 }}
                    >
                        Open Raw Image
                    </Button>
                </Box>
            ) : (
                <img
                    src={fileUrl}
                    alt="Preview"
                    crossOrigin="anonymous"
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                    }}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "65vh",
                        borderRadius: "10px",
                        objectFit: "contain",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        display: loading ? "none" : "block",
                    }}
                />
            )}
        </Box>
    );
}

export default ImagePreview;
