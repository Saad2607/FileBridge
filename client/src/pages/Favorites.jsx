import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import FolderGrid from "../components/folder/FolderGrid";
import FileGrid from "../components/file/FileGrid";

import { getFavorites } from "../services/favoriteService";

function Favorites() {

    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {

        try {

            const data = await getFavorites();

            setFolders(data.folders);

            setFiles(data.files);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <Box sx={{ p: 4 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                ⭐ Favorites
            </Typography>

            <Typography
                variant="h5"
                sx={{ mt: 3, mb: 2 }}
            >
                Folders
            </Typography>

            <FolderGrid
                folders={folders}
            />

            <Typography
                variant="h5"
                sx={{ mt: 4, mb: 2 }}
            >
                Files
            </Typography>

            <FileGrid
                files={files}
            />

        </Box>

    );

}

export default Favorites;