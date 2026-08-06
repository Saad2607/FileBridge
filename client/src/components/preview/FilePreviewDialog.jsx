import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";

import ImagePreview from "./ImagePreview";
import PdfPreview from "./PdfPreview";
import TextPreview from "./TextPreview";

function FilePreviewDialog({

    open,
    file,
    fileUrl,
    onClose,
    onDownload,

}) {

    if (!file) return null;

    const extension =
        file.originalName
            .split(".")
            .pop()
            .toLowerCase();

    const renderPreview = () => {

        if ([
            "png",
            "jpg",
            "jpeg",
            "gif",
            "webp",
        ].includes(extension)) {

            return (
                <ImagePreview
                    fileUrl={fileUrl}
                />
            );

        }

        if (extension === "pdf") {

            return (
                <PdfPreview
                    fileUrl={fileUrl}
                />
            );

        }

        if ([
            "txt",
            "json",
            "js",
            "jsx",
            "ts",
            "tsx",
            "css",
            "html",
            "md",
        ].includes(extension)) {

            return (
                <TextPreview
                    fileUrl={fileUrl}
                />
            );

        }

        return (

            <Box
                py={8}
                textAlign="center"
            >

                <Typography
                    variant="h6"
                >
                    Preview not available
                </Typography>

                <Typography
                    color="text.secondary"
                    mt={1}
                >
                    This file type cannot be previewed.
                </Typography>

            </Box>

        );

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
        >

            <DialogTitle
                sx={{
                    fontWeight: 700,
                }}
            >
                {file.originalName}
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    minHeight: 550,
                    bgcolor: "#F8FAFC",
                }}
            >

                {renderPreview()}

            </DialogContent>

            <DialogActions>

                <Button
                    startIcon={<CloseIcon />}
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