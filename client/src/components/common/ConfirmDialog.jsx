import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Avatar,
    Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

function ConfirmDialog({
    open,
    title,
    message,
    onCancel,
    onConfirm,
    confirmText = "Delete",
    confirmColor = "error",
}) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: "16px", p: 1 },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                        sx={{
                            bgcolor: confirmColor === "error" ? "#FEF2F2" : "#FFFBEB",
                            color: confirmColor === "error" ? "#EF4444" : "#F59E0B",
                            width: 40,
                            height: 40,
                            borderRadius: "10px",
                        }}
                    >
                        <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <DialogContentText sx={{ color: "#475569", fontSize: "0.9rem" }}>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
                <Button onClick={onCancel} sx={{ fontWeight: 600, color: "#64748B" }}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color={confirmColor}
                    onClick={onConfirm}
                    sx={{
                        borderRadius: "8px",
                        fontWeight: 700,
                        px: 2.5,
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;