import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import SharedFileGrid from "../components/share/SharedFileGrid";

import { getSharedFiles, disableShare } from "../services/shareService";

import ConfirmDialog from "../components/common/ConfirmDialog";

function SharedFiles() {

    const [files, setFiles] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        loadFiles();
    }, []);

    const handleDisable = (file) => {

        setSelectedFile(file);

        setDialogOpen(true);

    };

    const confirmDisable = async () => {


        try {

            await disableShare(selectedFile._id);

            setDialogOpen(false);

            setSelectedFile(null);

            loadFiles();

        } catch (error) {

            console.error(error);

        }

    };

    const loadFiles = async () => {

        try {

            const data = await getSharedFiles();

            setFiles(data.files);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <Box sx={{ p: 4 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Shared Files
            </Typography>

            <Typography
                color="text.secondary"
                mb={4}
            >
                Manage all files you've shared with others.
            </Typography>

            <SharedFileGrid
                files={files}
                onDisable={handleDisable}
            />

            <ConfirmDialog
                open={dialogOpen}
                title="Disable Sharing"
                message={
                    selectedFile
                        ? `Disable sharing for "${selectedFile.originalName}"?`
                        : ""
                }
                confirmText="Disable"
                confirmColor="warning"
                onCancel={() => {

                    setDialogOpen(false);

                    setSelectedFile(null);

                }}
                onConfirm={confirmDisable}
            />

        </Box>

    );

}

export default SharedFiles;