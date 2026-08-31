import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Avatar,
    Divider,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function PropertiesDialog({ open, title = "Properties", properties = [], onClose }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: "16px", p: 1 },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "#EEF2FF", color: "#4F46E5", width: 40, height: 40, borderRadius: "10px" }}>
                        <InfoOutlinedIcon sx={{ fontSize: 22 }} />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 1.5 }}>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: "12px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.25,
                    }}
                >
                    {properties.map((property, index) => (
                        <Box key={index}>
                            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary" fontSize="0.75rem">
                                    {property.label}
                                </Typography>
                                <Typography variant="body2" fontWeight={600} color="#0F172A">
                                    {property.value}
                                </Typography>
                            </Box>
                            {index !== properties.length - 1 && <Divider sx={{ mt: 1.25 }} />}
                        </Box>
                    ))}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: "8px", fontWeight: 700 }}
                >
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PropertiesDialog;