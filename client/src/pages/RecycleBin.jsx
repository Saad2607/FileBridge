import { useEffect, useState } from "react";

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

function RecycleBin() {

    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);

    const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);

    const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);

    const [selectedFolder, setSelectedFolder] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        loadRecycleBin();
    }, []);

    const loadRecycleBin = async () => {

        try {

            const folderData = await getDeletedFolders();
            const fileData = await getDeletedFiles();

            setFolders(folderData.folders);
            setFiles(fileData.files);

        } catch (error) {
            console.error(error);
        }

    };

    const handleRestoreFolder = async (folder) => {

        try {

            await restoreFolder(folder._id);

            loadRecycleBin();

        } catch (error) {

            console.error(error);

        }

    };

    const handleRestoreFile = async (file) => {

        try {

            await restoreFile(file._id);

            loadRecycleBin();

        } catch (error) {

            console.error(error);

        }

    };

    const handleDeleteFolderForever = (folder) => {

        setSelectedFolder(folder);

        setDeleteFolderDialogOpen(true);

    };

    const confirmDeleteFolderForever = async () => {

        try {

            await deleteFolderForever(selectedFolder._id);

            setDeleteFolderDialogOpen(false);

            setSelectedFolder(null);

            loadRecycleBin();

        } catch (error) {

            console.error(error);

        }

    };

    const handleDeleteFileForever = (file) => {

        setSelectedFile(file);

        setDeleteFileDialogOpen(true);

    };

    const confirmDeleteFileForever = async () => {

        try {

            await deleteFileForever(selectedFile._id);

            setDeleteFileDialogOpen(false);

            setSelectedFile(null);

            loadRecycleBin();

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div>

            <h1>Recycle Bin</h1>

            <h2>Folders</h2>

            <RecycleFolderGrid
                folders={folders}
                onRestore={handleRestoreFolder}
                onDeleteForever={handleDeleteFolderForever}
            />

            <h2>Files</h2>

            <RecycleFileGrid
                files={files}
                onRestore={handleRestoreFile}
                onDeleteForever={handleDeleteFileForever}
            />

            <ConfirmDialog
                open={deleteFolderDialogOpen}
                title="Delete Folder Forever"
                message={
                    selectedFolder
                        ? `Permanently delete "${selectedFolder.name}"?`
                        : ""
                }
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
                        ? `Permanently delete "${selectedFile.originalName}"?`
                        : ""
                }
                onCancel={() => {

                    setDeleteFileDialogOpen(false);

                    setSelectedFile(null);

                }}
                onConfirm={confirmDeleteFileForever}
            />

        </div>



    );

}

export default RecycleBin;