import { Grid, Fade } from "@mui/material";
import FolderCard from "./FolderCard";

function FolderGrid({
    folders,
    view,
    onOpen,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
}) {

    if (folders.length === 0) {
        return null;
    }

    return (

        <Grid container spacing={2}>

            {folders.map((folder) => (

                <Grid
                    item
                    xs={12}
                    md={view === "grid" ? 6 : 12}
                    lg={view === "grid" ? 4 : 12}
                    key={folder._id}
                >

                    <FolderCard
                        folder={folder}
                        view={view}
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