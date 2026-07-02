import { useEffect, useState, useContext } from "react";
import FolderIcon from "@mui/icons-material/Folder";

import { FolderContext } from "../../context/FolderContext";

import Breadcrumb from "../folder/Breadcrumb";
import CreateFolder from "../../components/folder/CreateFolder";
import FileUpload from "../../components/file/FileUpload";

import { getFolders, createFolder } from "../../services/folderService";
import { getFiles, uploadFile } from "../../services/fileService";

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

    return (
        <div
            style={{
                flex: 1,
                padding: "30px",
            }}
        >

            <Breadcrumb />

            <CreateFolder
                onCreate={handleCreateFolder}
            />

            <br />

            <FileUpload
                onSelect={handleUpload}
            />

            <br />
            <br />

            <h2>
                {currentFolder ? currentFolder.name : "Home"}
            </h2>

            <br />

            <h3>Folders</h3>

            {folders.length === 0 ? (

                <p>No folders found.</p>

            ) : (

                folders.map((folder) => (

                    <div
                        key={folder._id}
                        onClick={() => handleOpenFolder(folder)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "15px",
                            cursor: "pointer",
                        }}
                    >

                        <FolderIcon />

                        <span>{folder.name}</span>

                    </div>

                ))

            )}

            <br />

            <h3>Files</h3>

            {files.length === 0 ? (

                <p>No files found.</p>

            ) : (

                files.map((file) => (

                    <div
                        key={file._id}
                        style={{
                            marginBottom: "10px",
                        }}
                    >

                        📄 {file.originalName}

                    </div>

                ))

            )}

        </div>
    );
}

export default MainContent;