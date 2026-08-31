import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Avatar,
    Typography,
} from "@mui/material";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";

function RenameDialog({
    open,
    title,
    initialValue,
    onCancel,
    onConfirm,
}) {
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(initialValue || "");
    }, [initialValue, open]);

    const handleConfirm = () => {
        if (!value.trim()) return;
        onConfirm(value.trim());
    };

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
                    <Avatar sx={{ bgcolor: "#EEF2FF", color: "#4F46E5", width: 40, height: 40, borderRadius: "10px" }}>
                        <DriveFileRenameOutlineRoundedIcon sx={{ fontSize: 22 }} />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 1.5 }}>
                <TextField
                    autoFocus
                    fullWidth
                    size="small"
                    margin="dense"
                    label="New Name"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleConfirm();
                        }
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
                <Button onClick={onCancel} sx={{ fontWeight: 600, color: "#64748B" }}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!value.trim()}
                    sx={{ borderRadius: "8px", fontWeight: 700, px: 2.5 }}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RenameDialog;