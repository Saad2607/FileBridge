import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    IconButton,
    Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MovieIcon from "@mui/icons-material/Movie";
import AudioFileIcon from "@mui/icons-material/AudioFile";

function FilePreviewDialog({
    open,
    file,
    onClose,
    onDownload,
}) {

    if (!file) return null;

    const extension =
        file.originalName
            ?.split(".")
            .pop()
            ?.toLowerCase();

    const formatSize = (bytes) => {

        if (!bytes) return "0 Bytes";

        const sizes = ["Bytes", "KB", "MB", "GB"];

        const i = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, i)).toFixed(1) +
            " " +
            sizes[i]
        );

    };

    const renderPreview = () => {

        if (
            ["png", "jpg", "jpeg", "gif", "webp"].includes(extension)
        ) {

            return (

                <Box
                    component="img"
                    src={file.url}
                    alt={file.originalName}
                    sx={{
                        width: "100%",
                        maxHeight: 400,
                        objectFit: "contain",
                        borderRadius: 2,
                    }}
                />

            );

        }

        if (extension === "pdf") {

            return (

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    py={5}
                >

                    <PictureAsPdfIcon
                        color="error"
                        sx={{
                            fontSize: 90,
                        }}
                    />

                    <Typography mt={2}>
                        PDF Preview Coming Soon
                    </Typography>

                </Box>

            );

        }

        if (
            ["mp4", "webm"].includes(extension)
        ) {

            return (

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    py={5}
                >

                    <MovieIcon
                        color="primary"
                        sx={{
                            fontSize: 90,
                        }}
                    />

                    <Typography mt={2}>
                        Video Preview Coming Soon
                    </Typography>

                </Box>

            );

        }

        if (
            ["mp3", "wav"].includes(extension)
        ) {

            return (

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    py={5}
                >

                    <AudioFileIcon
                        color="primary"
                        sx={{
                            fontSize: 90,
                        }}
                    />

                    <Typography mt={2}>
                        Audio Preview Coming Soon
                    </Typography>

                </Box>

            );

        }

        return (

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                py={5}
            >

                <DescriptionIcon
                    sx={{
                        fontSize: 90,
                        color: "#616161",
                    }}
                />

                <Typography mt={2}>
                    Preview not available
                </Typography>

            </Box>

        );

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >

                File Preview

                <IconButton
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>

            </DialogTitle>

            <Divider />

            <DialogContent>

                {renderPreview()}

                <Box mt={3}>

                    <Typography variant="h6">
                        {file.originalName}
                    </Typography>

                    <Typography color="text.secondary">
                        Type: {extension.toUpperCase()}
                    </Typography>

                    <Typography color="text.secondary">
                        Size: {formatSize(file.size)}
                    </Typography>

                    <Typography color="text.secondary">
                        Created:
                        {" "}
                        {new Date(file.createdAt).toLocaleString()}
                    </Typography>

                </Box>

            </DialogContent>

            <Divider />

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Close
                </Button>

                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => onDownload(file)}
                >
                    Download
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default FilePreviewDialog;