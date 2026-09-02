import { Box, Paper, Typography, Button, IconButton, Chip, Slide } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function MultiSelectToolbar({
    selectedCount,
    onClearSelection,
    onBatchDelete,
    onBatchFavorite,
}) {
    const open = selectedCount > 0;

    return (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <Paper
                elevation={6}
                sx={{
                    position: "fixed",
                    bottom: { xs: 16, sm: 28 },
                    left: "50%",
                    transform: "translateX(-50%) !important",
                    zIndex: 1300,
                    borderRadius: { xs: "16px", sm: 999 },
                    px: { xs: 1.5, sm: 3 },
                    py: { xs: 1, sm: 1.25 },
                    width: { xs: "calc(100% - 32px)", sm: "auto" },
                    maxWidth: 500,
                    bgcolor: "#0F172A",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: { xs: 1, sm: 2 },
                    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
            >
                <Box display="flex" alignItems="center" gap={1.25}>
                    <Chip
                        label={selectedCount}
                        size="small"
                        sx={{
                            bgcolor: "#38BDF8",
                            color: "#0F172A",
                            fontWeight: 800,
                            height: 22,
                            minWidth: 22,
                        }}
                    />
                    <Typography variant="body2" fontWeight={600} color="#FFFFFF" noWrap sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                        {selectedCount === 1 ? "selected" : "selected"}
                    </Typography>
                </Box>

                <Box sx={{ height: 20, width: "1px", bgcolor: "rgba(255, 255, 255, 0.2)" }} />

                <Box display="flex" alignItems="center" gap={1}>
                    {onBatchFavorite && (
                        <Button
                            size="small"
                            variant="text"
                            startIcon={<StarOutlineRoundedIcon sx={{ color: "#FBBF24" }} />}
                            onClick={onBatchFavorite}
                            sx={{
                                color: "#E2E8F0",
                                fontWeight: 600,
                                borderRadius: 999,
                                px: 1.5,
                                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                            }}
                        >
                            Star
                        </Button>
                    )}

                    {onBatchDelete && (
                        <Button
                            size="small"
                            variant="contained"
                            color="error"
                            startIcon={<DeleteOutlineRoundedIcon />}
                            onClick={onBatchDelete}
                            sx={{
                                borderRadius: 999,
                                fontWeight: 700,
                                px: 2,
                                bgcolor: "#EF4444",
                                "&:hover": { bgcolor: "#DC2626" },
                            }}
                        >
                            Delete
                        </Button>
                    )}

                    <IconButton
                        size="small"
                        onClick={onClearSelection}
                        sx={{ color: "#94A3B8", ml: 0.5, "&:hover": { color: "#FFFFFF" } }}
                    >
                        <CloseRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            </Paper>
        </Slide>
    );
}

export default MultiSelectToolbar;
