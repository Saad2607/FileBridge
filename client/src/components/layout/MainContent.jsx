import { useEffect, useState, useContext } from "react";
import FolderIcon from "@mui/icons-material/Folder";

import { getFolders } from "../../services/folderService";
import { FolderContext } from "../../context/FolderContext";
import CreateFolder from "../../components/folder/CreateFolder";
import { createFolder } from "../../services/folderService";
import Breadcrumb from "../folder/Breadcrumb";


function MainContent() {

    const { folders, setFolders, currentFolder, setCurrentFolder, breadcrumbs, setBreadcrumbs } = useContext(FolderContext);

    useEffect(() => {
        loadFolders();
    }, [currentFolder]);

    const loadFolders = async () => {
        try {
            const data = await getFolders(currentFolder?._id || null);

            setFolders(data.folders);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenFolder = (folder) => {
        console.log(folder);

        setCurrentFolder(folder);

        setBreadcrumbs((previous) => [
            ...previous,
            folder,
        ]);
    };

    const handleCreateFolder = async (folderName) => {
        try {
            await createFolder(
                folderName,
                currentFolder?._id || null
            );

            loadFolders();
        } catch (error) {
            alert(
                error.response?.data?.message || "Unable to create folder."
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

            <CreateFolder onCreate={handleCreateFolder} />
            <br />
            <h2>
                {currentFolder ? currentFolder.name : "Home"}
            </h2>
            <br />

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
                            marginBottom: "20px",
                            cursor: "pointer"
                        }}
                    >
                        <FolderIcon />

                        <span>{folder.name}</span>
                    </div>
                ))
            )}
        </div>
    );
}

export default MainContent;