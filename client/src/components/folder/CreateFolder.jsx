import { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Typography,
    Avatar,
} from "@mui/material";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";

function CreateFolder({ onCreate }) {
    const [open, setOpen] = useState(false);
    const [folderName, setFolderName] = useState("");

    const handleCreate = () => {
        if (!folderName.trim()) return;
        onCreate(folderName.trim());
        setFolderName("");
        setOpen(false);
    };

    const handleClose = () => {
        setFolderName("");
        setOpen(false);
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<CreateNewFolderRoundedIcon />}
                onClick={() => setOpen(true)}
                sx={{
                    borderRadius: "10px",
                    fontWeight: 600,
                    px: 2,
                    py: 0.85,
                    color: "#334155",
                    borderColor: "#CBD5E1",
                    "&:hover": {
                        borderColor: "#4F46E5",
                        color: "#4F46E5",
                        bgcolor: "#EEF2FF",
                    },
                }}
            >
                New Folder
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: { borderRadius: "16px", p: 1 },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: "#EEF2FF", color: "#4F46E5", width: 40, height: 40, borderRadius: "10px" }}>
                            <CreateNewFolderRoundedIcon sx={{ fontSize: 22 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                                New Folder
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Organize your workspace directory
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ pt: 1.5 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Folder Name"
                        placeholder="e.g. Projects, Invoices"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleCreate();
                            }
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button onClick={handleClose} sx={{ fontWeight: 600, color: "#64748B" }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={!folderName.trim()}
                        sx={{ borderRadius: "8px", fontWeight: 700, px: 2.5 }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreateFolder;