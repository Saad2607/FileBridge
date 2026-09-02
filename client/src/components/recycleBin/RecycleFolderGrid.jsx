import { Grid, Typography } from "@mui/material";

import RecycleFolderCard from "./RecycleFolderCard";

function RecycleFolderGrid({
    folders,
    onRestore,
    onDeleteForever,
}) {

    if (folders.length === 0) {

        return (
            <Typography
                color="text.secondary"
                textAlign="center"
                sx={{ mt: 2 }}
            >
                No deleted folders.
            </Typography>
        );

    }

    return (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {folders.map((folder) => (
                <Grid
                    size={{ xs: 12, sm: 6, md: 4 }}
                    key={folder._id}
                >
                    <RecycleFolderCard
                        folder={folder}
                        onRestore={onRestore}
                        onDeleteForever={onDeleteForever}
                    />
                </Grid>
            ))}
        </Grid>
    );

}

export default RecycleFolderGrid;