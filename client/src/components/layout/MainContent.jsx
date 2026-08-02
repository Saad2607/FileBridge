import { useEffect, useState, useContext } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { FolderContext } from "../../context/FolderContext";

import Breadcrumb from "../folder/Breadcrumb";
import CreateFolder from "../../components/folder/CreateFolder";
import FileUpload from "../../components/file/FileUpload";

import { getFolders, createFolder, deleteFolder, renameFolder, toggleFavoriteFolder } from "../../services/folderService";
import { getFiles, uploadFile, downloadFile, deleteFile, renameFile, toggleFavoriteFile, createShareLink } from "../../services/fileService";

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

import ShareDialog from "../common/ShareDialog";

function MainContent() {

    const {
        folders,
        setFolders,
        currentFolder,
        setCurrentFolder,
        breadcrumbs,
        setBreadcrumbs,
    } = useContext(FolderContext);

    const [files, setFiles] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);

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

            // Load folders
            const folderData = await getFolders(
                currentFolder?._id || null
            );

            setFolders(folderData.folders);

            // Load files
            const fileData = await getFiles(
                currentFolder?._id || null
            );

            setFiles(fileData.files);

        } catch (error) {

            console.log(error);

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

    const handleShare = async (
        file,
        expiry = "never"
    ) => {

        try {

            const data = await createShareLink(
                file._id,
                expiry
            );

            setShareLink(data.shareUrl);

            setShareDialogOpen(true);

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to generate share link."
            );

        }

    };

    const handleUpload = async (file) => {

        try {

            await uploadFile(
                file,
                currentFolder?._id || null
            );

            loadContent();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to upload file."
            );

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

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                {currentFolder ? currentFolder.name : "Home"}
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Store your files securely and access them from anywhere.
            </Typography>

            <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mt: 3, mb: 2 }}
            >
                Folders
            </Typography>

            <FolderGrid
                folders={displayedFolders}
                onOpen={handleOpenFolder}
                onDelete={handleDeleteFolder}
                onRename={handleRenameFolder}
                onProperties={handleFolderProperties}
                onFavorite={handleFavoriteFolder}
            />

            <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mt: 4, mb: 2 }}
            >
                Files
            </Typography>

            <FileGrid
                files={displayedFiles}
                onDownload={handleDownload}
                onDelete={handleDeleteFile}
                onRename={handleRenameFile}
                onProperties={handleFileProperties}
                onFavorite={handleFavoriteFile}
                onShare={handleShare}
            />

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
                }}
            />
        </Box>
    );
}

export default MainContent;