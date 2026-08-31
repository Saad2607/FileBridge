import { Grid, Skeleton } from "@mui/material";

function DashboardSkeleton() {

    return (

        <Grid
            container
            spacing={3}
        >

            {

                [...Array(4)].map((_, index) => (

                    <Grid
                        item
                        xs={12}
                        md={3}
                        key={index}
                    >

                        <Skeleton
                            variant="rounded"
                            height={140}
                        />

                    </Grid>

                ))

            }

        </Grid>

    );

}

export default DashboardSkeleton;