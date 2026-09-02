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
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {files.map((file) => (
                <Grid
                    size={{ xs: 12, sm: 6, md: 4 }}
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