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
        <Grid container spacing={2}>
            {folders.map((folder) => (
                <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
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