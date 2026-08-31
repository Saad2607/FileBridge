import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Chip,
    IconButton,
} from "@mui/material";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import ImagePreview from "./ImagePreview";
import PdfPreview from "./PdfPreview";
import TextPreview from "./TextPreview";
import { formatFileSize, getFileUrl } from "../../utils/fileHelpers";

function FilePreviewDialog({
    open,
    file,
    fileUrl: explicitFileUrl,
    onClose,
    onDownload,
}) {
    if (!file) return null;

    const fileUrl = explicitFileUrl || getFileUrl(file);

    const extension = file.originalName
        ? file.originalName.split(".").pop().toLowerCase()
        : "";

    const renderPreview = () => {
        if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(extension)) {
            return <ImagePreview fileUrl={fileUrl} />;
        }

        if (extension === "pdf") {
            return <PdfPreview fileUrl={fileUrl} />;
        }

        if (["mp4", "webm", "ogg", "mov"].includes(extension)) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        minHeight: 400,
                        bgcolor: "#000",
                        borderRadius: "12px",
                        p: 2,
                    }}
                >
                    <video
                        controls
                        src={fileUrl}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "65vh",
                            borderRadius: "8px",
                        }}
                    >
                        Your browser does not support the video tag.
                    </video>
                </Box>
            );
        }

        if (["mp3", "wav", "aac", "ogg", "flac"].includes(extension)) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 6,
                        gap: 2.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 88,
                            height: 88,
                            borderRadius: "20px",
                            bgcolor: "#EEF2FF",
                            color: "#4F46E5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 25px rgba(79,70,229,0.15)",
                        }}
                    >
                        <DescriptionRoundedIcon sx={{ fontSize: 44 }} />
                    </Box>
                    <audio controls src={fileUrl} style={{ width: "80%", maxWidth: 450 }}>
                        Your browser does not support the audio element.
                    </audio>
                </Box>
            );
        }

        if (
            [
                "txt",
                "json",
                "js",
                "jsx",
                "ts",
                "tsx",
                "css",
                "html",
                "md",
                "csv",
                "xml",
                "sql",
                "env",
                "yaml",
                "yml",
            ].includes(extension)
        ) {
            return <TextPreview fileUrl={fileUrl} />;
        }

        return (
            <Box sx={{ py: 6, textAlign: "center" }}>
                <DescriptionRoundedIcon sx={{ fontSize: 64, color: "#94A3B8", mb: 1.5 }} />
                <Typography variant="subtitle1" fontWeight={700} color="#1E293B">
                    Preview not available
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5} mb={2}>
                    This file format (.{extension}) cannot be previewed directly in the viewer.
                </Typography>
                {onDownload && (
                    <Button
                        variant="outlined"
                        startIcon={<DownloadRoundedIcon />}
                        onClick={() => onDownload(file)}
                        sx={{ borderRadius: "8px" }}
                    >
                        Download File
                    </Button>
                )}
            </Box>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.5,
                    px: 2.5,
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {file.originalName}
                    </Typography>
                    <Chip
                        label={extension.toUpperCase()}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22, bgcolor: "#EEF2F6" }}
                    />
                    <Chip
                        label={formatFileSize(file.size)}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", height: 22 }}
                    />
                </Box>

                <IconButton onClick={onClose} size="small">
                    <CloseRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    minHeight: 400,
                    bgcolor: "#F8FAFC",
                    p: 2.5,
                }}
            >
                {renderPreview()}
            </DialogContent>

            <DialogActions sx={{ px: 2.5, py: 1.5, justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                    Created: {new Date(file.createdAt || Date.now()).toLocaleDateString()}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button onClick={onClose} sx={{ fontWeight: 600, color: "#64748B" }}>Close</Button>
                    {onDownload && (
                        <Button
                            variant="contained"
                            startIcon={<DownloadRoundedIcon />}
                            onClick={() => onDownload(file)}
                            sx={{ borderRadius: "8px", fontWeight: 700 }}
                        >
                            Download
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default FilePreviewDialog;