import { Grid, Fade } from "@mui/material";
import FolderCard from "./FolderCard";

function FolderGrid({
    folders,
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

        <Grid
            container
            spacing={3}
        >

            {

                folders.map((folder, index) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={3}
                        key={folder._id}
                    >

                        <Fade
                            in
                            timeout={300 + index * 100}
                        >

                            <div
                                style={{
                                    height: "100%",
                                }}
                            >

                                <FolderCard
                                    folder={folder}
                                    onOpen={onOpen}
                                    onDelete={onDelete}
                                    onRename={onRename}
                                    onProperties={onProperties}
                                    onFavorite={onFavorite}
                                />

                            </div>

                        </Fade>

                    </Grid>

                ))

            }

        </Grid>

    );

}

export default FolderGrid;