import { Grid, Typography } from "@mui/material";

import RecycleFileCard from "./RecycleFileCard";

function RecycleFileGrid({
    files,
    onRestore,
    onDeleteForever,
}) {

    if (files.length === 0) {

        return (
            <Typography
                color="text.secondary"
                textAlign="center"
                sx={{ mt: 2 }}
            >
                No deleted files.
            </Typography>
        );

    }

    return (
        <Grid container spacing={2}>
            {files.map((file) => (
                <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    key={file._id}
                >
                    <RecycleFileCard
                        file={file}
                        onRestore={onRestore}
                        onDeleteForever={onDeleteForever}
                    />
                </Grid>
            ))}
        </Grid>
    );

}

export default RecycleFileGrid;