import { useEffect, useState, useContext } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Divider,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import toast from "react-hot-toast";

import FolderGrid from "../components/folder/FolderGrid";
import FileGrid from "../components/file/FileGrid";
import EmptyState from "../components/common/EmptyState";
import SectionHeader from "../components/common/SectionHeader";
import FilePreviewDialog from "../components/preview/FilePreviewDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import RenameDialog from "../components/common/RenameDialog";
import PropertiesDialog from "../components/common/PropertiesDialog";
import ShareDialog from "../components/share/ShareDialog";
import ViewToggle from "../components/common/ViewToggle";

import { getFavorites } from "../services/favoriteService";
import {
    deleteFolder,
    renameFolder,
    toggleFavoriteFolder,
} from "../services/folderService";
import {
    downloadFile,
    deleteFile,
    renameFile,
    toggleFavoriteFile,
    createShareLink,
    disableShare,
} from "../services/fileService";
import { FolderContext } from "../context/FolderContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

function Favorites() {
    const navigate = useNavigate();
    const { setCurrentFolder, setBreadcrumbs } = useContext(FolderContext);

    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [view, setView] = useState("grid");

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);

    const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [selectedRenameFolder, setSelectedRenameFolder] = useState(null);

    const [renameFileDialogOpen, setRenameFileDialogOpen] = useState(false);
    const [selectedRenameFile, setSelectedRenameFile] = useState(null);

    const [propertiesOpen, setPropertiesOpen] = useState(false);
    const [propertiesTitle, setPropertiesTitle] = useState("");
    const [properties, setProperties] = useState([]);

    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const [selectedShareFile, setSelectedShareFile] = useState(null);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const data = await getFavorites();
            setFolders(data.folders || []);
            setFiles(data.files || []);
        } catch (error) {
            console.error(error);
            if (error.response?.status !== 401) {
                toast.error("Unable to load favorites.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFolder = (folder) => {
        setCurrentFolder(folder);
        setBreadcrumbs([
            { _id: null, name: "Home" },
            { _id: folder._id, name: folder.name },
        ]);
        navigate(ROUTES.DASHBOARD);
    };

    const handleUnfavoriteFolder = async (folder) => {
        try {
            await toggleFavoriteFolder(folder._id);
            toast.success(`Removed "${folder.name}" from Favorites`);
            loadFavorites();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update favorite.");
        }
    };

    const handleUnfavoriteFile = async (file) => {
        try {
            await toggleFavoriteFile(file._id);
            toast.success(`Removed "${file.originalName}" from Favorites`);
            loadFavorites();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update favorite.");
        }
    };

    const handleDownload = async (file) => {
        try {
            await downloadFile(file._id, file.originalName);
            toast.success(`Downloading "${file.originalName}"`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to download file.");
        }
    };

    const handlePreviewFile = (file) => {
        setPreviewFile(file);
        setPreviewOpen(true);
    };

    const filteredFolders = folders.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    const filteredFiles = files.filter((f) =>
        f.originalName.toLowerCase().includes(search.toLowerCase())
    );

    const totalCount = filteredFolders.length + filteredFiles.length;

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
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                flexWrap="wrap"
                gap={2}
                mb={4}
            >
                <Box>
                    <Typography variant="h4" fontWeight={800} color="#0F172A">
                        Favorites
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mt={0.5}>
                        Quickly access all your starred folders and files.
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                    <TextField
                        size="small"
                        placeholder="Search favorites..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            width: { xs: "100%", sm: 220 },
                            "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#FFFFFF" },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ fontSize: 20, color: "#94A3B8" }} />
                                </InputAdornment>
                            ),
                            endAdornment: search ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearch("")}>
                                        <ClearRoundedIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        }}
                    />

                    <ViewToggle view={view} onChange={setView} />
                </Box>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            ) : totalCount === 0 ? (
                <EmptyState
                    icon={<StarRoundedIcon sx={{ fontSize: 72, color: "#FBBF24" }} />}
                    title={search ? "No matches found" : "No Starred Items"}
                    description={search ? "Try searching for a different keyword." : "Star important folders and files to easily find them here anytime."}
                />
            ) : (
                <>
                    {filteredFolders.length > 0 && (
                        <Box mb={4}>
                            <SectionHeader title="Starred Folders" count={filteredFolders.length} />
                            <FolderGrid
                                folders={filteredFolders}
                                view={view}
                                onOpen={handleOpenFolder}
                                onFavorite={handleUnfavoriteFolder}
                                onDelete={(folder) => {
                                    setSelectedFolder(folder);
                                    setDeleteDialogOpen(true);
                                }}
                                onRename={(folder) => {
                                    setSelectedRenameFolder(folder);
                                    setRenameDialogOpen(true);
                                }}
                                onProperties={(folder) => {
                                    setPropertiesTitle("Folder Properties");
                                    setProperties([
                                        { label: "Name", value: folder.name },
                                        { label: "Created", value: new Date(folder.createdAt).toLocaleString() },
                                    ]);
                                    setPropertiesOpen(true);
                                }}
                            />
                        </Box>
                    )}

                    {filteredFolders.length > 0 && filteredFiles.length > 0 && <Divider sx={{ my: 4 }} />}

                    {filteredFiles.length > 0 && (
                        <Box mb={4}>
                            <SectionHeader title="Starred Files" count={filteredFiles.length} />
                            <FileGrid
                                files={filteredFiles}
                                view={view}
                                onOpen={handlePreviewFile}
                                onDownload={handleDownload}
                                onFavorite={handleUnfavoriteFile}
                                onDelete={(file) => {
                                    setSelectedFile(file);
                                    setDeleteFileDialogOpen(true);
                                }}
                                onRename={(file) => {
                                    setSelectedRenameFile(file);
                                    setRenameFileDialogOpen(true);
                                }}
                                onProperties={(file) => {
                                    setPropertiesTitle("File Properties");
                                    setProperties([
                                        { label: "Name", value: file.originalName },
                                        { label: "Type", value: file.mimeType },
                                        { label: "Size", value: `${(file.size / 1024).toFixed(2)} KB` },
                                    ]);
                                    setPropertiesOpen(true);
                                }}
                                onShare={(file) => {
                                    setSelectedShareFile(file);
                                    setShareDialogOpen(true);
                                }}
                            />
                        </Box>
                    )}
                </>
            )}

            <FilePreviewDialog
                open={previewOpen}
                file={previewFile}
                onClose={() => {
                    setPreviewOpen(false);
                    setPreviewFile(null);
                }}
                onDownload={handleDownload}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Folder"
                message={selectedFolder ? `Move "${selectedFolder.name}" to Recycle Bin?` : ""}
                confirmColor="error"
                onCancel={() => {
                    setDeleteDialogOpen(false);
                    setSelectedFolder(null);
                }}
                onConfirm={async () => {
                    try {
                        await deleteFolder(selectedFolder._id);
                        toast.success("Folder moved to Recycle Bin");
                        setDeleteDialogOpen(false);
                        setSelectedFolder(null);
                        loadFavorites();
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Unable to delete folder.");
                    }
                }}
            />

            <ConfirmDialog
                open={deleteFileDialogOpen}
                title="Delete File"
                message={selectedFile ? `Move "${selectedFile.originalName}" to Recycle Bin?` : ""}
                confirmColor="error"
                onCancel={() => {
                    setDeleteFileDialogOpen(false);
                    setSelectedFile(null);
                }}
                onConfirm={async () => {
                    try {
                        await deleteFile(selectedFile._id);
                        toast.success("File moved to Recycle Bin");
                        setDeleteFileDialogOpen(false);
                        setSelectedFile(null);
                        loadFavorites();
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Unable to delete file.");
                    }
                }}
            />

            <RenameDialog
                open={renameDialogOpen}
                title="Rename Folder"
                initialValue={selectedRenameFolder?.name || ""}
                onCancel={() => {
                    setRenameDialogOpen(false);
                    setSelectedRenameFolder(null);
                }}
                onConfirm={async (newName) => {
                    try {
                        await renameFolder(selectedRenameFolder._id, newName);
                        toast.success(`Renamed folder to "${newName}"`);
                        setRenameDialogOpen(false);
                        setSelectedRenameFolder(null);
                        loadFavorites();
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Unable to rename folder.");
                    }
                }}
            />

            <RenameDialog
                open={renameFileDialogOpen}
                title="Rename File"
                initialValue={selectedRenameFile?.originalName || ""}
                onCancel={() => {
                    setRenameFileDialogOpen(false);
                    setSelectedRenameFile(null);
                }}
                onConfirm={async (newName) => {
                    try {
                        await renameFile(selectedRenameFile._id, newName);
                        toast.success(`Renamed file to "${newName}"`);
                        setRenameFileDialogOpen(false);
                        setSelectedRenameFile(null);
                        loadFavorites();
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Unable to rename file.");
                    }
                }}
            />

            <PropertiesDialog
                open={propertiesOpen}
                title={propertiesTitle}
                properties={properties}
                onClose={() => setPropertiesOpen(false)}
            />

            <ShareDialog
                open={shareDialogOpen}
                link={shareLink}
                onClose={() => {
                    setShareDialogOpen(false);
                    setShareLink("");
                    setSelectedShareFile(null);
                }}
                onGenerate={async (expiry, password) => {
                    try {
                        const data = await createShareLink(selectedShareFile._id, expiry, password);
                        setShareLink(data.shareUrl);
                        toast.success("Share link generated!");
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Unable to generate share link.");
                    }
                }}
                onDisable={async () => {
                    try {
                        await disableShare(selectedShareFile._id);
                        setShareLink("");
                        toast.success("Sharing disabled successfully.");
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Unable to disable sharing.");
                    }
                }}
            />
        </Box>
    );
}

export default Favorites;