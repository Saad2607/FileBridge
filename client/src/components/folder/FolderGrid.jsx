import { Grid } from "@mui/material";
import FolderCard from "./FolderCard";

function FolderGrid({ folders, onOpen, onDelete, onRename, onProperties, onFavorite }) {

    if (folders.length === 0) {
        return <p>No folders found.</p>;
    }

    return (
        <Grid container spacing={2}>
            {folders.map((folder) => (
                <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    key={folder._id}
                >
                    <FolderCard
                        folder={folder}
                        onOpen={onOpen}
                        onDelete={onDelete}
                        onRename={onRename}
                        onProperties={onProperties}
                        onFavorite={onFavorite}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default FolderGrid;