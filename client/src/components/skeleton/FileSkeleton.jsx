import {
    Card,
    CardContent,
    Box,
    Skeleton,
} from "@mui/material";

function FileSkeleton() {

    return (

        <Card>

            <CardContent>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box
                        display="flex"
                        gap={2}
                        alignItems="center"
                    >

                        <Skeleton
                            variant="circular"
                            width={40}
                            height={40}
                        />

                        <Box>

                            <Skeleton
                                width={180}
                                height={25}
                            />

                            <Skeleton
                                width={120}
                            />

                        </Box>

                    </Box>

                    <Skeleton
                        variant="circular"
                        width={36}
                        height={36}
                    />

                </Box>

            </CardContent>

        </Card>

    );

}

export default FileSkeleton;