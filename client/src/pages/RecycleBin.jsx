import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Divider,
    Paper,
} from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import toast from "react-hot-toast";

import {
    getDeletedFolders,
    getDeletedFiles,
    restoreFolder,
    restoreFile,
    deleteFolderForever,
    deleteFileForever,
} from "../services/recycleBinService";

import RecycleFolderGrid from "../components/recycleBin/RecycleFolderGrid";
import RecycleFileGrid from "../components/recycleBin/RecycleFileGrid";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import SectionHeader from "../components/common/SectionHeader";

function RecycleBin() {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
    const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        loadRecycleBin();
    }, []);

    const loadRecycleBin = async () => {
        try {
            setLoading(true);
            const folderData = await getDeletedFolders();
            const fileData = await getDeletedFiles();

            setFolders(folderData.folders || []);
            setFiles(fileData.files || []);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load recycle bin.");
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreFolder = async (folder) => {
        try {
            await restoreFolder(folder._id);
            toast.success(`Restored folder "${folder.name}"`);
            loadRecycleBin();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to restore folder.");
        }
    };

    const handleRestoreFile = async (file) => {
        try {
            await restoreFile(file._id);
            toast.success(`Restored file "${file.originalName}"`);
            loadRecycleBin();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to restore file.");
        }
    };

    const handleDeleteFolderForever = (folder) => {
        setSelectedFolder(folder);
        setDeleteFolderDialogOpen(true);
    };

    const confirmDeleteFolderForever = async () => {
        try {
            await deleteFolderForever(selectedFolder._id);
            toast.success(`Permanently deleted "${selectedFolder.name}"`);
            setDeleteFolderDialogOpen(false);
            setSelectedFolder(null);
            loadRecycleBin();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to delete folder permanently.");
        }
    };

    const handleDeleteFileForever = (file) => {
        setSelectedFile(file);
        setDeleteFileDialogOpen(true);
    };

    const confirmDeleteFileForever = async () => {
        try {
            await deleteFileForever(selectedFile._id);
            toast.success(`Permanently deleted "${selectedFile.originalName}"`);
            setDeleteFileDialogOpen(false);
            setSelectedFile(null);
            loadRecycleBin();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to delete file permanently.");
        }
    };

    const totalDeleted = folders.length + files.length;

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
            {/* Header */}
            <Box mb={4}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="h4" fontWeight={800} color="#0F172A">
                        Recycle Bin
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" mt={0.5}>
                    Items in the Recycle Bin will be permanently removed when deleted.
                </Typography>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            ) : totalDeleted === 0 ? (
                <EmptyState
                    icon={<DeleteSweepIcon sx={{ fontSize: 72, color: "#94A3B8" }} />}
                    title="Recycle Bin is Empty"
                    description="Deleted folders and files will appear here until you restore or permanently delete them."
                />
            ) : (
                <>
                    {folders.length > 0 && (
                        <Box mb={4}>
                            <SectionHeader title="Deleted Folders" count={folders.length} />
                            <RecycleFolderGrid
                                folders={folders}
                                onRestore={handleRestoreFolder}
                                onDeleteForever={handleDeleteFolderForever}
                            />
                        </Box>
                    )}

                    {folders.length > 0 && files.length > 0 && <Divider sx={{ my: 4 }} />}

                    {files.length > 0 && (
                        <Box mb={4}>
                            <SectionHeader title="Deleted Files" count={files.length} />
                            <RecycleFileGrid
                                files={files}
                                onRestore={handleRestoreFile}
                                onDeleteForever={handleDeleteFileForever}
                            />
                        </Box>
                    )}
                </>
            )}

            <ConfirmDialog
                open={deleteFolderDialogOpen}
                title="Delete Folder Forever"
                message={
                    selectedFolder
                        ? `Are you sure you want to permanently delete "${selectedFolder.name}"? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete Forever"
                confirmColor="error"
                onCancel={() => {
                    setDeleteFolderDialogOpen(false);
                    setSelectedFolder(null);
                }}
                onConfirm={confirmDeleteFolderForever}
            />

            <ConfirmDialog
                open={deleteFileDialogOpen}
                title="Delete File Forever"
                message={
                    selectedFile
                        ? `Are you sure you want to permanently delete "${selectedFile.originalName}"? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete Forever"
                confirmColor="error"
                onCancel={() => {
                    setDeleteFileDialogOpen(false);
                    setSelectedFile(null);
                }}
                onConfirm={confirmDeleteFileForever}
            />
        </Box>
    );
}

export default RecycleBin;