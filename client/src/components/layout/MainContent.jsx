import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";

import { FolderContext } from "../../context/FolderContext";
import { UploadContext } from "../../context/UploadContext";
import { ROUTES } from "../../constants/routes";

import Breadcrumb from "../folder/Breadcrumb";
import CreateFolder from "../../components/folder/CreateFolder";
import FileUpload from "../../components/file/FileUpload";

import {
    getFolders,
    createFolder,
    deleteFolder,
    renameFolder,
    toggleFavoriteFolder,
} from "../../services/folderService";
import {
    getFiles,
    uploadFile,
    downloadFile,
    deleteFile,
    renameFile,
    toggleFavoriteFile,
    createShareLink,
    disableShare,
} from "../../services/fileService";

import FolderGrid from "../folder/FolderGrid";
import FileGrid from "../file/FileGrid";

import ConfirmDialog from "../common/ConfirmDialog";
import RenameDialog from "../../components/common/RenameDialog";

import { search } from "../../services/searchService";
import PropertiesDialog from "../common/PropertiesDialog";
import ShareDialog from "../share/ShareDialog";
import DragDropZone from "../upload/DragDropZone";

import EmptyState from "../../components/common/EmptyState";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

import FolderSkeleton from "../skeleton/FolderSkeleton";
import FileSkeleton from "../skeleton/FileSkeleton";

import SectionHeader from "../common/SectionHeader";
import RecentActivity from "../dashboard/RecentActivity";
import QuickActions from "../dashboard/QuickActions";

import ExplorerToolbar from "../common/ExplorerToolbar";
import FilePreviewDialog from "../preview/FilePreviewDialog";
import DesktopSyncHub from "../desktop/DesktopSyncHub";
import WebDesktopBanner from "../web/WebDesktopBanner";
import MultiSelectToolbar from "../common/MultiSelectToolbar";

function MainContent() {
    const navigate = useNavigate();
    const isElectron = Boolean(window.electronAPI?.isElectron);

    const {
        folders,
        setFolders,
        currentFolder,
        setCurrentFolder,
        breadcrumbs,
        setBreadcrumbs,
    } = useContext(FolderContext);

    const {
        uploading,
        setUploading,
        progress,
        setProgress,
        currentFile,
        setCurrentFile,
    } = useContext(UploadContext);

    const [files, setFiles] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [selectedFile, setSelectedFile] = useState(null);
    const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);

    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [selectedRenameFolder, setSelectedRenameFolder] = useState(null);

    const [renameFileDialogOpen, setRenameFileDialogOpen] = useState(false);
    const [selectedRenameFile, setSelectedRenameFile] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchFolders, setSearchFolders] = useState([]);
    const [searchFiles, setSearchFiles] = useState([]);

    const [propertiesOpen, setPropertiesOpen] = useState(false);
    const [propertiesTitle, setPropertiesTitle] = useState("");
    const [properties, setProperties] = useState([]);

    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const [selectedShareFile, setSelectedShareFile] = useState(null);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    // Multi-Select State
    const [selectedFolderIds, setSelectedFolderIds] = useState([]);
    const [selectedFileIds, setSelectedFileIds] = useState([]);
    const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);

    const [view, setView] = useState("grid");
    const [sort, setSort] = useState("Newest");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        loadContent();
        handleClearSelection();
    }, [currentFolder]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery.trim()) {
                setSearchFolders([]);
                setSearchFiles([]);
                return;
            }

            try {
                const data = await search(searchQuery);
                setSearchFolders(data.folders || []);
                setSearchFiles(data.files || []);
            } catch (error) {
                console.error(error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadContent = async () => {
        try {
            setLoading(true);

            const folderData = await getFolders(currentFolder?._id || null);
            setFolders(folderData.folders || []);

            const fileData = await getFiles(currentFolder?._id || null);
            setFiles(fileData.files || []);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load contents.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFolder = (folder) => {
        setCurrentFolder(folder);
        setBreadcrumbs((previous) => [
            ...previous,
            {
                _id: folder._id,
                name: folder.name,
            },
        ]);
    };

    const handleCreateFolder = async (folderName) => {
        try {
            await createFolder(folderName, currentFolder?._id || null);
            toast.success(`Created folder "${folderName}"`);
            loadContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to create folder.");
        }
    };

    const handleDeleteFolder = (folder) => {
        setSelectedFolder(folder);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteFolder = async () => {
        try {
            await deleteFolder(selectedFolder._id);
            toast.success(`Moved folder "${selectedFolder.name}" to Recycle Bin`);
            setDeleteDialogOpen(false);
            setSelectedFolder(null);
            loadContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to delete folder.");
        }
    };

    const handleDeleteFile = (file) => {
        setSelectedFile(file);
        setDeleteFileDialogOpen(true);
    };

    const confirmDeleteFile = async () => {
        try {
            await deleteFile(selectedFile._id);
            toast.success(`Moved file "${selectedFile.originalName}" to Recycle Bin`);
            setDeleteFileDialogOpen(false);
            setSelectedFile(null);
            loadContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to delete file.");
        }
    };

    const handleRenameFolder = (folder) => {
        setSelectedRenameFolder(folder);
        setRenameDialogOpen(true);
    };

    const confirmRenameFolder = async (newName) => {
        try {
            await renameFolder(selectedRenameFolder._id, newName);
            toast.success(`Renamed folder to "${newName}"`);
            setRenameDialogOpen(false);
            setSelectedRenameFolder(null);
            loadContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to rename folder.");
        }
    };

    const handleRenameFile = (file) => {
        setSelectedRenameFile(file);
        setRenameFileDialogOpen(true);
    };

    const confirmRenameFile = async (newName) => {
        try {
            await renameFile(selectedRenameFile._id, newName);
            toast.success(`Renamed file to "${newName}"`);
            setRenameFileDialogOpen(false);
            setSelectedRenameFile(null);
            loadContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to rename file.");
        }
    };

    const handleFolderProperties = (folder) => {
        setPropertiesTitle("Folder Properties");
        setProperties([
            { label: "Name", value: folder.name },
            { label: "Created", value: new Date(folder.createdAt).toLocaleString() },
            { label: "Last Updated", value: new Date(folder.updatedAt).toLocaleString() },
        ]);
        setPropertiesOpen(true);
    };

    const handleFileProperties = (file) => {
        const sizeKB = (file.size / 1024).toFixed(2);
        setPropertiesTitle("File Properties");
        setProperties([
            { label: "Name", value: file.originalName },
            { label: "Type", value: file.mimeType },
            { label: "Size", value: `${sizeKB} KB` },
            { label: "Created", value: new Date(file.createdAt).toLocaleString() },
            { label: "Last Updated", value: new Date(file.updatedAt).toLocaleString() },
        ]);
        setPropertiesOpen(true);
    };

    const handleFavoriteFolder = async (folder) => {
        try {
            const data = await toggleFavoriteFolder(folder._id);
            toast.success(data.favorite ? "Added to Favorites" : "Removed from Favorites");
            loadContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update favorite.");
        }
    };

    const handleFavoriteFile = async (file) => {
        try {
            const data = await toggleFavoriteFile(file._id);
            toast.success(data.favorite ? "Added to Favorites" : "Removed from Favorites");
            loadContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update favorite.");
        }
    };

    const handleShare = (file) => {
        setSelectedShareFile(file);
        setShareDialogOpen(true);
    };

    const generateShareLink = async (expiry, password) => {
        try {
            const data = await createShareLink(
                selectedShareFile._id,
                expiry,
                password
            );
            setShareLink(data.shareUrl);
            toast.success("Share link generated!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to generate share link.");
        }
    };

    const handleDisableShare = async () => {
        try {
            await disableShare(selectedShareFile._id);
            setShareLink("");
            toast.success("Sharing disabled successfully.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to disable sharing.");
        }
    };

    const handleDropUpload = async (acceptedFiles) => {
        try {
            setUploading(true);
            for (const file of acceptedFiles) {
                setCurrentFile(file.name);
                setProgress(0);
                await uploadFile(
                    file,
                    currentFolder?._id || null,
                    (value) => setProgress(value)
                );
                toast.success(`Uploaded "${file.name}"`);
            }
            loadContent();
        } catch (error) {
            console.error(error);
            toast.error("Upload failed.");
        } finally {
            setUploading(false);
            setProgress(0);
            setCurrentFile("");
        }
    };

    const handleUpload = async (file) => {
        try {
            setUploading(true);
            setCurrentFile(file.name);
            setProgress(0);

            await uploadFile(
                file,
                currentFolder?._id || null,
                (value) => setProgress(value)
            );

            toast.success(`Uploaded "${file.name}"`);
            loadContent();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to upload file.");
        } finally {
            setUploading(false);
            setProgress(0);
            setCurrentFile("");
        }
    };

    const handleDownload = async (file) => {
        try {
            await downloadFile(file._id, file.originalName);
            toast.success(`Downloading "${file.originalName}"`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to download file.");
        }
    };

    const handlePreviewFile = (file) => {
        setPreviewFile(file);
        setPreviewOpen(true);
    };

    // Multi-Select Handlers
    const handleToggleSelect = (id, type) => {
        if (type === "folder") {
            setSelectedFolderIds((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            );
        } else {
            setSelectedFileIds((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            );
        }
    };

    const handleClearSelection = () => {
        setSelectedFolderIds([]);
        setSelectedFileIds([]);
    };

    const handleBatchDelete = () => {
        setBatchDeleteDialogOpen(true);
    };

    const confirmBatchDelete = async () => {
        try {
            for (const folderId of selectedFolderIds) {
                await deleteFolder(folderId);
            }
            for (const fileId of selectedFileIds) {
                await deleteFile(fileId);
            }
            toast.success(`Moved ${selectedFolderIds.length + selectedFileIds.length} items to Recycle Bin.`);
            handleClearSelection();
            setBatchDeleteDialogOpen(false);
            loadContent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete selected items.");
        }
    };

    const handleBatchFavorite = async () => {
        try {
            for (const folderId of selectedFolderIds) {
                await toggleFavoriteFolder(folderId);
            }
            for (const fileId of selectedFileIds) {
                await toggleFavoriteFile(fileId);
            }
            toast.success("Updated favorites for selected items.");
            handleClearSelection();
            loadContent();
        } catch (error) {
            toast.error("Failed to update favorites.");
        }
    };

    const displayedFolders = [...(searchQuery.trim() ? searchFolders : folders)];
    const displayedFiles = [...(searchQuery.trim() ? searchFiles : files)];

    // ---------- SORTING ----------
    const sortByNameAsc = (a, b) => (a.name || a.originalName).localeCompare(b.name || b.originalName);
    const sortByNameDesc = (a, b) => (b.name || b.originalName).localeCompare(a.name || a.originalName);
    const sortByNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
    const sortByOldest = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
    const sortByLargest = (a, b) => (b.size || 0) - (a.size || 0);
    const sortBySmallest = (a, b) => (a.size || 0) - (b.size || 0);

    switch (sort) {
        case "Name (A-Z)":
            displayedFolders.sort(sortByNameAsc);
            displayedFiles.sort(sortByNameAsc);
            break;
        case "Name (Z-A)":
            displayedFolders.sort(sortByNameDesc);
            displayedFiles.sort(sortByNameDesc);
            break;
        case "Oldest":
            displayedFolders.sort(sortByOldest);
            displayedFiles.sort(sortByOldest);
            break;
        case "Largest":
            displayedFiles.sort(sortByLargest);
            break;
        case "Smallest":
            displayedFiles.sort(sortBySmallest);
            break;
        default:
            displayedFolders.sort(sortByNewest);
            displayedFiles.sort(sortByNewest);
    }

    // ---------- FILTERING ----------
    let filteredFolders = displayedFolders;
    let filteredFiles = displayedFiles;

    switch (filter) {
        case "Folders":
            filteredFiles = [];
            break;
        case "Files":
            filteredFolders = [];
            break;
        case "Favorites":
            filteredFolders = displayedFolders.filter((f) => f.favorite);
            filteredFiles = displayedFiles.filter((f) => f.favorite);
            break;
        case "Images":
            filteredFolders = [];
            filteredFiles = displayedFiles.filter((file) => {
                const ext = file.originalName.split(".").pop().toLowerCase();
                return ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext);
            });
            break;
        case "PDF":
            filteredFolders = [];
            filteredFiles = displayedFiles.filter((file) =>
                file.originalName.toLowerCase().endsWith(".pdf")
            );
            break;
        case "Archives":
            filteredFolders = [];
            filteredFiles = displayedFiles.filter((file) => {
                const ext = file.originalName.split(".").pop().toLowerCase();
                return ["zip", "rar", "7z", "tar", "gz"].includes(ext);
            });
            break;
        case "Videos":
            filteredFolders = [];
            filteredFiles = displayedFiles.filter((file) => {
                const ext = file.originalName.split(".").pop().toLowerCase();
                return ["mp4", "mkv", "mov", "avi", "webm"].includes(ext);
            });
            break;
        case "Audio":
            filteredFolders = [];
            filteredFiles = displayedFiles.filter((file) => {
                const ext = file.originalName.split(".").pop().toLowerCase();
                return ["mp3", "wav", "aac", "ogg", "flac"].includes(ext);
            });
            break;
        default:
            break;
    }

    const totalSelected = selectedFolderIds.length + selectedFileIds.length;

    return (
        <DragDropZone onDrop={handleDropUpload}>
            <Box sx={{ flex: 1, p: { xs: 2.5, md: 4 }, maxWidth: 1400, mx: "auto" }}>
                {/* Platform-Specific Companion Banner */}
                {isElectron ? <DesktopSyncHub /> : <WebDesktopBanner />}

                {/* Top Action Bar: Breadcrumbs on Left, Actions on Right */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Breadcrumb />

                    <Stack direction="row" spacing={1.5}>
                        <CreateFolder onCreate={handleCreateFolder} />
                        <FileUpload onSelect={handleUpload} />
                    </Stack>
                </Box>

                {/* Search & Explorer Toolbar */}
                <ExplorerToolbar
                    totalItems={filteredFolders.length + filteredFiles.length}
                    search={searchQuery}
                    onSearch={setSearchQuery}
                    sort={sort}
                    onSort={setSort}
                    filter={filter}
                    onFilter={setFilter}
                    view={view}
                    onViewChange={setView}
                />

                {/* File/Folder Explorer Section */}
                {loading ? (
                    <>
                        <SectionHeader title="Folders" count={filteredFolders.length} />
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(auto-fill, minmax(260px, 1fr))"
                            gap={2.5}
                            mb={4}
                        >
                            {[...Array(4)].map((_, index) => (
                                <FolderSkeleton key={index} />
                            ))}
                        </Box>

                        <SectionHeader title="Files" count={filteredFiles.length} />
                        <Box display="flex" flexDirection="column" gap={2}>
                            {[...Array(4)].map((_, index) => (
                                <FileSkeleton key={index} />
                            ))}
                        </Box>
                    </>
                ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
                    <EmptyState
                        icon={<FolderOpenRoundedIcon sx={{ fontSize: 64 }} />}
                        title="Your workspace is clean"
                        description="Create your first folder or drop files anywhere to start organizing your files."
                    />
                ) : (
                    <>
                        {filteredFolders.length > 0 && (
                            <Box mb={4}>
                                <SectionHeader title="Folders" count={filteredFolders.length} />
                                <FolderGrid
                                    folders={filteredFolders}
                                    view={view}
                                    selectedIds={selectedFolderIds}
                                    onToggleSelect={handleToggleSelect}
                                    onOpen={handleOpenFolder}
                                    onDelete={handleDeleteFolder}
                                    onRename={handleRenameFolder}
                                    onProperties={handleFolderProperties}
                                    onFavorite={handleFavoriteFolder}
                                />
                            </Box>
                        )}

                        <Box mb={4}>
                            <SectionHeader title="Files" count={filteredFiles.length} />

                            {filteredFiles.length === 0 ? (
                                <EmptyState
                                    icon={<InsertDriveFileRoundedIcon sx={{ fontSize: 48 }} />}
                                    title="No files in this folder"
                                    description="Drag and drop files here or click 'Upload File' above."
                                />
                            ) : (
                                <FileGrid
                                    files={filteredFiles}
                                    view={view}
                                    selectedIds={selectedFileIds}
                                    onToggleSelect={handleToggleSelect}
                                    onOpen={handlePreviewFile}
                                    onDownload={handleDownload}
                                    onDelete={handleDeleteFile}
                                    onRename={handleRenameFile}
                                    onProperties={handleFileProperties}
                                    onFavorite={handleFavoriteFile}
                                    onShare={handleShare}
                                />
                            )}
                        </Box>
                    </>
                )}

                {/* Secondary Activity Feed & Quick Actions */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "2fr 1fr",
                        },
                        gap: 3,
                        mt: 6,
                        pt: 4,
                        borderTop: "1px solid #E2E8F0",
                    }}
                >
                    <RecentActivity />

                    <QuickActions
                        onCreateFolder={() => {
                            const btn = document.querySelector('button:has(svg[data-testid="CreateNewFolderIcon"])');
                            if (btn) btn.click();
                        }}
                        onUploadFile={() => {
                            const fileInput = document.getElementById("file-upload");
                            if (fileInput) fileInput.click();
                        }}
                        onUploadFolder={() => {
                            const fileInput = document.getElementById("file-upload");
                            if (fileInput) fileInput.click();
                        }}
                        onSharedFiles={() => {
                            navigate(ROUTES.SHARED_FILES);
                        }}
                    />
                </Box>

                {/* Floating Multi-Select Capsule */}
                <MultiSelectToolbar
                    selectedCount={totalSelected}
                    onClearSelection={handleClearSelection}
                    onBatchDelete={handleBatchDelete}
                    onBatchFavorite={handleBatchFavorite}
                />

                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="Delete Folder"
                    message={
                        selectedFolder
                            ? `Are you sure you want to move "${selectedFolder.name}" to the Recycle Bin?`
                            : ""
                    }
                    confirmColor="error"
                    onCancel={() => {
                        setDeleteDialogOpen(false);
                        setSelectedFolder(null);
                    }}
                    onConfirm={confirmDeleteFolder}
                />

                <ConfirmDialog
                    open={deleteFileDialogOpen}
                    title="Delete File"
                    message={
                        selectedFile
                            ? `Are you sure you want to move "${selectedFile.originalName}" to the Recycle Bin?`
                            : ""
                    }
                    confirmColor="error"
                    onCancel={() => {
                        setDeleteFileDialogOpen(false);
                        setSelectedFile(null);
                    }}
                    onConfirm={confirmDeleteFile}
                />

                <ConfirmDialog
                    open={batchDeleteDialogOpen}
                    title="Delete Selected Items"
                    message={`Are you sure you want to move ${totalSelected} selected item(s) to the Recycle Bin?`}
                    confirmColor="error"
                    onCancel={() => setBatchDeleteDialogOpen(false)}
                    onConfirm={confirmBatchDelete}
                />

                <RenameDialog
                    open={renameDialogOpen}
                    title="Rename Folder"
                    initialValue={selectedRenameFolder?.name || ""}
                    onCancel={() => {
                        setRenameDialogOpen(false);
                        setSelectedRenameFolder(null);
                    }}
                    onConfirm={confirmRenameFolder}
                />

                <RenameDialog
                    open={renameFileDialogOpen}
                    title="Rename File"
                    initialValue={selectedRenameFile?.originalName || ""}
                    onCancel={() => {
                        setRenameFileDialogOpen(false);
                        setSelectedRenameFile(null);
                    }}
                    onConfirm={confirmRenameFile}
                />

                <PropertiesDialog
                    open={propertiesOpen}
                    title={propertiesTitle}
                    properties={properties}
                    onClose={() => setPropertiesOpen(false)}
                />

                <FilePreviewDialog
                    open={previewOpen}
                    file={previewFile}
                    onClose={() => {
                        setPreviewOpen(false);
                        setPreviewFile(null);
                    }}
                    onDownload={handleDownload}
                />

                <ShareDialog
                    open={shareDialogOpen}
                    link={shareLink}
                    onClose={() => {
                        setShareDialogOpen(false);
                        setShareLink("");
                        setSelectedShareFile(null);
                    }}
                    onGenerate={generateShareLink}
                    onDisable={handleDisableShare}
                />
            </Box>
        </DragDropZone>
    );
}

export default MainContent;