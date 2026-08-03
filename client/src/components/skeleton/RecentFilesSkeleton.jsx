import {
    Card,
    CardContent,
    Skeleton,
} from "@mui/material";

function RecentFilesSkeleton() {

    return (

        <Card>

            <CardContent>

                {

                    [...Array(5)].map((_, index) => (

                        <Skeleton
                            key={index}
                            height={45}
                            sx={{ mb: 1 }}
                        />

                    ))

                }

            </CardContent>

        </Card>

    );

}

export default RecentFilesSkeleton;