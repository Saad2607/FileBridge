import { useEffect, useState, useContext } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { FolderContext } from "../../context/FolderContext";
import { UploadContext } from "../../context/UploadContext";

import Breadcrumb from "../folder/Breadcrumb";
import CreateFolder from "../../components/folder/CreateFolder";
import FileUpload from "../../components/file/FileUpload";

import { getFolders, createFolder, deleteFolder, renameFolder, toggleFavoriteFolder } from "../../services/folderService";
import { getFiles, uploadFile, downloadFile, deleteFile, renameFile, toggleFavoriteFile, createShareLink, disableShare } from "../../services/fileService";

import FolderToolbar from "../folder/FolderToolbar";
import FolderGrid from "../folder/FolderGrid";
import FileGrid from "../file/FileGrid";

import ConfirmDialog from "../common/ConfirmDialog";
import RenameDialog from "../../components/common/RenameDialog";

import SearchBar from "../common/SearchBar";
import { search } from "../../services/searchService";

import PropertiesDialog from "../common/PropertiesDialog";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import ShareDialog from "../share/ShareDialog";

import DragDropZone from "../upload/DragDropZone";

import EmptyState from "../../components/common/EmptyState";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import FolderSkeleton from "../skeleton/FolderSkeleton";
import FileSkeleton from "../skeleton/FileSkeleton";

function MainContent() {

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

    useEffect(() => {
        loadContent();
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

                setSearchFolders(data.folders);
                setSearchFiles(data.files);
            } catch (error) {
                console.error(error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadContent = async () => {

        try {

            setLoading(true);

            const folderData = await getFolders(
                currentFolder?._id || null
            );

            setFolders(folderData.folders);

            const fileData = await getFiles(
                currentFolder?._id || null
            );

            setFiles(fileData.files);

        } catch (error) {

            console.error(error);

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

            await createFolder(
                folderName,
                currentFolder?._id || null
            );

            loadContent();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to create folder."
            );

        }

    };

    const handleDeleteFolder = (folder) => {

        setSelectedFolder(folder);

        setDeleteDialogOpen(true);

    };

    const confirmDeleteFolder = async () => {

        try {

            await deleteFolder(selectedFolder._id);

            setDeleteDialogOpen(false);

            setSelectedFolder(null);

            loadContent();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete folder."
            );

        }

    };

    const handleDeleteFile = (file) => {

        setSelectedFile(file);

        setDeleteFileDialogOpen(true);

    };

    const confirmDeleteFile = async () => {

        try {

            await deleteFile(selectedFile._id);

            setDeleteFileDialogOpen(false);

            setSelectedFile(null);

            loadContent();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete file."
            );

        }

    };

    const handleRenameFolder = (folder) => {

        setSelectedRenameFolder(folder);

        setRenameDialogOpen(true);

    };

    const confirmRenameFolder = async (newName) => {

        try {

            await renameFolder(
                selectedRenameFolder._id,
                newName
            );

            setRenameDialogOpen(false);

            setSelectedRenameFolder(null);

            loadContent();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to rename folder."
            );

        }

    };

    const handleRenameFile = (file) => {
        setSelectedRenameFile(file);

        setRenameFileDialogOpen(true);
    };

    const confirmRenameFile = async (newName) => {
        try {
            await renameFile(
                selectedRenameFile._id,
                newName,
            );

            setRenameFileDialogOpen(false);
            setSelectedRenameFile(null);

            loadContent();
        } catch (error) {
            alert(
                error.response?.data?.message || "Unable to rename file."
            );
        }
    };

    const handleFolderProperties = (folder) => {
        setPropertiesTitle("Folder Properties");

        setProperties([
            {
                label: "Name",
                value: folder.name
            },
            {
                label: "Created",
                value: new Date(folder.createdAt).toLocaleString(),
            },
            {
                label: "Last Updated",
                value: new Date(folder.updatedAt).toLocaleString()
            },
        ]);

        setPropertiesOpen(true);
    };

    const handleFileProperties = (file) => {
        const sizeKB = (file.size / 1024).toFixed(2);

        setPropertiesTitle("File Properties");

        setProperties([
            {
                label: "Name",
                value: file.originalName
            },
            {
                label: "Type",
                value: file.mimeType,
            },
            {
                label: "Size",
                value: `${sizeKB} KB`,
            },
            {
                label: "Created",
                value: new Date(file.createdAt).toLocaleString(),
            },
            {
                label: "Last Updated",
                value: new Date(file.updatedAt).toLocaleString()
            }
        ]);

        setPropertiesOpen(true);
    };

    const handleFavoriteFolder = async (folder) => {

        try {
            await toggleFavoriteFolder(folder._id);

            loadContent();
        } catch (error) {

            alert(
                error.response?.data?.message || "Unable to update favorite."
            );
        }
    };

    const handleFavoriteFile = async (file) => {

        try {
            await toggleFavoriteFile(file._id);

            loadContent();
        } catch (error) {

            alert(
                error.response?.data?.message || "Unable to update favorite."
            );
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
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message || "Unable to generate share link."
            );
        }
    };

    const handleDisableShare = async () => {

        try {
            await disableShare(selectedShareFile._id);

            setShareLink("");

            alert("Sharing disabled");
        } catch (error) {

            alert(
                error.response?.data?.message || "Unable to disable sharing."
            );
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

                    (value) => {

                        setProgress(value);

                    }

                );

            }

            loadContent();

        }

        catch (error) {

            console.error(error);

        }

        finally {

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

                (value) => {

                    setProgress(value);

                }

            );

            loadContent();

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Unable to upload file."

            );

        }

        finally {

            setUploading(false);

            setProgress(0);

            setCurrentFile("");

        }

    };

    const handleDownload = async (file) => {
        try {
            await downloadFile(
                file._id,
                file.originalName
            );
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message || "Unable to download file."
            );
        }
    };

    const displayedFolders = searchQuery.trim() ? searchFolders : folders;

    const displayedFiles = searchQuery.trim() ? searchFiles : files;


    return (
        <DragDropZone
            onDrop={handleDropUpload}
        >
            <Box
                sx={{
                    flex: 1,
                    p: 4,
                }}
            >

                <Breadcrumb />

                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                />

                <FolderToolbar>
                    <CreateFolder
                        onCreate={handleCreateFolder}
                    />

                    <FileUpload
                        onSelect={handleUpload}
                    />
                </FolderToolbar>

                {
                    displayedFolders.length === 0 &&
                    displayedFiles.length === 0 && (

                        <EmptyState
                            icon={<FolderOpenIcon fontSize="inherit" />}
                            title="Welcome to FileBridge"
                            description="Create your first folder or upload your first file to start organizing your documents."
                        />

                    )
                }

                {
                    loading ? (

                        <>

                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Folders
                            </Typography>

                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(auto-fill,minmax(280px,1fr))"
                                gap={3}
                            >
                                {[...Array(6)].map((_, index) => (
                                    <FolderSkeleton key={index} />
                                ))}
                            </Box>

                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{ mt: 4, mb: 2 }}
                            >
                                Files
                            </Typography>

                            <Box
                                display="flex"
                                flexDirection="column"
                                gap={2}
                            >
                                {[...Array(6)].map((_, index) => (
                                    <FileSkeleton key={index} />
                                ))}
                            </Box>

                        </>

                    ) : displayedFolders.length === 0 &&
                        displayedFiles.length === 0 ? (

                        <EmptyState
                            icon={<FolderOpenIcon fontSize="inherit" />}
                            title="Welcome to FileBridge"
                            description="Create your first folder or upload your first file to start organizing your documents."
                        />

                    ) : (

                        <>

                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Folders
                            </Typography>

                            {
                                displayedFolders.length === 0 ? (

                                    <EmptyState
                                        icon={<FolderOpenIcon fontSize="inherit" />}
                                        title="No folders found"
                                        description="Create your first folder to organize your files."
                                    />

                                ) : (

                                    <FolderGrid
                                        folders={displayedFolders}
                                        onOpen={handleOpenFolder}
                                        onDelete={handleDeleteFolder}
                                        onRename={handleRenameFolder}
                                        onProperties={handleFolderProperties}
                                        onFavorite={handleFavoriteFolder}
                                    />

                                )
                            }

                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{ mt: 4, mb: 2 }}
                            >
                                Files
                            </Typography>

                            {
                                displayedFiles.length === 0 ? (

                                    <EmptyState
                                        icon={<FolderOpenIcon fontSize="inherit" />}
                                        title="No files found"
                                        description="Upload your first file to start building your library."
                                    />

                                ) : (

                                    <FileGrid
                                        files={displayedFiles}
                                        onDownload={handleDownload}
                                        onDelete={handleDeleteFile}
                                        onRename={handleRenameFile}
                                        onProperties={handleFileProperties}
                                        onFavorite={handleFavoriteFile}
                                        onShare={handleShare}
                                    />

                                )
                            }

                        </>

                    )
                }

                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="Delete Folder"
                    message={
                        selectedFolder
                            ? `Are you sure you want to delete "${selectedFolder.name}"?`
                            : ""
                    }
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
                            ? `Are you sure you want to delete "${selectedFile.originalName}"?`
                            : ""
                    }
                    onCancel={() => {

                        setDeleteFileDialogOpen(false);

                        setSelectedFile(null);

                    }}
                    onConfirm={confirmDeleteFile}
                />

                <RenameDialog
                    open={renameDialogOpen}
                    title="Rename Folder"
                    initialValue={
                        selectedRenameFolder?.name || ""
                    }
                    onCancel={() => {

                        setRenameDialogOpen(false);

                        setSelectedRenameFolder(null);

                    }}
                    onConfirm={confirmRenameFolder}
                />

                <RenameDialog
                    open={renameFileDialogOpen}
                    title="Rename File"
                    initialValue={
                        selectedRenameFile?.originalName || ""
                    }
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