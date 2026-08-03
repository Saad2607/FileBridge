import { Grid, Skeleton } from "@mui/material";

function SharedFilesSkeleton() {

    return (

        <Grid
            container
            spacing={3}
        >

            {

                [...Array(6)].map((_, index) => (

                    <Grid
                        item
                        xs={12}
                        md={4}
                        key={index}
                    >

                        <Skeleton
                            variant="rounded"
                            height={190}
                        />

                    </Grid>

                ))

            }

        </Grid>

    );

}

export default SharedFilesSkeleton;