import { Card, CardContent, Skeleton } from "@mui/material";

function FolderSkeleton() {

    return (

        <Card>

            <CardContent>

                <Skeleton
                    variant="rounded"
                    width={60}
                    height={60}
                />

                <Skeleton
                    sx={{ mt: 2 }}
                    width="70%"
                    height={30}
                />

                <Skeleton
                    width="45%"
                    height={20}
                />

            </CardContent>

        </Card>

    );

}

export default FolderSkeleton;