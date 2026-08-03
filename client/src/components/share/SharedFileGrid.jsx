import Grid from "@mui/material/Grid";

import SharedFileCard from "./SharedFileCard";

function SharedFileGrid({ files, onDisable }) {

    if (files.length === 0) {

        return <p>No shared files.</p>;

    }

    return (

        <Grid
            container
            spacing={2}
        >

            {
                files.map((file) => (

                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        key={file._id}
                    >

                        <SharedFileCard
                            file={file}
                            onDisable={onDisable}
                        />

                    </Grid>

                ))
            }

        </Grid>

    );

}

export default SharedFileGrid;