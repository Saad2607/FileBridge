import { useEffect, useState, useContext } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { FolderContext } from "../../context/FolderContext";

import Breadcrumb from "../folder/Breadcrumb";
import CreateFolder from "../../components/folder/CreateFolder";
import FileUpload from "../../components/file/FileUpload";

import { getFolders, createFolder, deleteFolder, renameFolder } from "../../services/folderService";
import { getFiles, uploadFile, downloadFile, deleteFile } from "../../services/fileService";

import FolderToolbar from "../folder/FolderToolbar";
import FolderGrid from "../folder/FolderGrid";
import FileGrid from "../file/FileGrid";

import ConfirmDialog from "../common/ConfirmDialog";
import RenameDialog from "../../components/common/RenameDialog";

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

    useEffect(() => {
        loadContent();
    }, [currentFolder]);

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

    return (
        <Box
            sx={{
                flex: 1,
                p: 4,
            }}
        >

            <Breadcrumb />

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
                folders={folders}
                onOpen={handleOpenFolder}
                onDelete={handleDeleteFolder}
                onRename={handleRenameFolder}
            />

            <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mt: 4, mb: 2 }}
            >
                Files
            </Typography>

            <FileGrid
                files={files}
                onDownload={handleDownload}
                onDelete={handleDeleteFile}
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
        </Box>
    );
}

export default MainContent;