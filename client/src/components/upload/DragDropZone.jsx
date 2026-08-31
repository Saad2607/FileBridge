import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import {
    Box,
    Typography,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function DragDropZone({

    children,
    onDrop,

}) {

    const handleDrop = useCallback(

        (acceptedFiles) => {

            if (acceptedFiles.length > 0) {

                onDrop(acceptedFiles);

            }

        },

        [onDrop]

    );

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({

        onDrop: handleDrop,

        multiple: true,

        noClick: true,

        noKeyboard: true,

    });

    return (

        <Box
            {...getRootProps()}
            sx={{
                position: "relative",
            }}
        >

            <input {...getInputProps()} />

            {children}

            {

                isDragActive && (

                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 999,
                            bgcolor: "rgba(25,118,210,0.08)",
                            border: "3px dashed #1976d2",
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >

                        <CloudUploadIcon
                            sx={{
                                fontSize: 70,
                                color: "primary.main",
                            }}
                        />

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            mt={2}
                        >
                            Drop files here
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Upload to the current folder
                        </Typography>

                    </Box>

                )

            }

        </Box>

    );

}

export default DragDropZone;