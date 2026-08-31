import { Box, Typography, Button, Paper } from "@mui/material";

function EmptyState({
    icon,
    title,
    description,
    buttonText,
    onClick,
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 7,
                px: 3,
                textAlign: "center",
                borderRadius: 4,
                border: "1px dashed #CBD5E1",
                bgcolor: "rgba(248, 250, 252, 0.6)",
                my: 2,
            }}
        >
            <Box
                sx={{
                    fontSize: 64,
                    color: "#94A3B8",
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {icon}
            </Box>

            <Typography variant="h6" fontWeight={800} color="#0F172A" gutterBottom>
                {title}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    maxWidth: 440,
                    mb: buttonText ? 3 : 0,
                    lineHeight: 1.6,
                }}
            >
                {description}
            </Typography>

            {buttonText && (
                <Button
                    variant="contained"
                    size="medium"
                    onClick={onClick}
                    sx={{ borderRadius: 2.5, fontWeight: 700, px: 3 }}
                >
                    {buttonText}
                </Button>
            )}
        </Paper>
    );
}

export default EmptyState;