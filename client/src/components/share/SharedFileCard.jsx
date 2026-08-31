import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Button,
    Box,
    Avatar,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import toast from "react-hot-toast";

import {
    getFileIcon,
    getFileTypeLabel,
    formatFileSize,
} from "../../utils/fileHelpers";

import { copyShareLink } from "../../services/shareService";

function SharedFileCard({ file, onDisable }) {
    const FileIcon = getFileIcon(file.mimeType);

    const handleCopy = async () => {
        try {
            await copyShareLink(file.shareToken);
            toast.success("Share link copied to clipboard!");
        } catch {
            toast.error("Failed to copy share link.");
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all .2s ease",
                "&:hover": {
                    borderColor: "#CBD5E1",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                    <Avatar
                        sx={{
                            bgcolor: "#EFF6FF",
                            color: "#1976D2",
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                        }}
                    >
                        <FileIcon fontSize="medium" />
                    </Avatar>

                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="#0F172A"
                            noWrap
                            title={file.originalName}
                        >
                            {file.originalName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {getFileTypeLabel(file.mimeType)} • {formatFileSize(file.size)}
                        </Typography>
                    </Box>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5} mb={2}>
                    <Chip
                        label="Public Active"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                    />
                    <Chip
                        icon={file.sharePassword ? <LockOutlinedIcon fontSize="small" /> : <LockOpenOutlinedIcon fontSize="small" />}
                        label={file.sharePassword ? "Password Protected" : "No Password"}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500, fontSize: "0.72rem" }}
                    />
                </Stack>

                <Typography variant="caption" color="text.secondary" mb={3} display="block">
                    Expires: {file.shareExpiry ? new Date(file.shareExpiry).toLocaleDateString() : "Never"}
                </Typography>

                <Box mt="auto" display="flex" gap={1.5}>
                    <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        startIcon={<ContentCopyIcon />}
                        onClick={handleCopy}
                        sx={{ borderRadius: 2.5, fontWeight: 600, textTransform: "none" }}
                    >
                        Copy Link
                    </Button>

                    <Button
                        size="small"
                        color="error"
                        variant="soft"
                        startIcon={<LinkOffIcon />}
                        onClick={() => onDisable(file)}
                        sx={{
                            borderRadius: 2.5,
                            fontWeight: 600,
                            textTransform: "none",
                            bgcolor: "#FEF2F2",
                            color: "#EF4444",
                            "&:hover": { bgcolor: "#FEE2E2" },
                        }}
                    >
                        Disable
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default SharedFileCard;