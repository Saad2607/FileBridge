import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import toast from "react-hot-toast";

import SharedFileGrid from "../components/share/SharedFileGrid";
import { getSharedFiles, disableShare } from "../services/shareService";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import SectionHeader from "../components/common/SectionHeader";

function SharedFiles() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
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
            toast.success(`Sharing disabled for "${selectedFile.originalName}"`);
            setDialogOpen(false);
            setSelectedFile(null);
            loadFiles();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to disable sharing.");
        }
    };

    const loadFiles = async () => {
        try {
            setLoading(true);
            const data = await getSharedFiles();
            setFiles(data.files || []);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load shared files.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                boxSizing: "border-box",
                p: { xs: 2.5, md: 4 },
            }}
        >
            <Box mb={4}>
                <Typography variant="h4" fontWeight={800} color="#0F172A">
                    Shared Files
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={0.5}>
                    Manage all active public links and passwords for shared files.
                </Typography>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            ) : files.length === 0 ? (
                <EmptyState
                    icon={<ShareRoundedIcon sx={{ fontSize: 72, color: "#94A3B8" }} />}
                    title="No Shared Files"
                    description="When you share a file, you can manage the active links, set passwords, and revoke access here."
                />
            ) : (
                <Box>
                    <SectionHeader title="Active Shared Links" count={files.length} />
                    <SharedFileGrid files={files} onDisable={handleDisable} />
                </Box>
            )}

            <ConfirmDialog
                open={dialogOpen}
                title="Disable Sharing"
                message={
                    selectedFile
                        ? `Are you sure you want to disable sharing for "${selectedFile.originalName}"? Anyone with the link will lose access immediately.`
                        : ""
                }
                confirmText="Disable Link"
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