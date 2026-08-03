import {
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Box,
} from "@mui/material";

import StorageIcon from "@mui/icons-material/Storage";

function StorageCard({ storageUsed }) {

    const totalStorage = 10 * 1024 * 1024 * 1024;

    const percentage =
        (storageUsed / totalStorage) * 100;

    const format = (bytes) =>
        (bytes / (1024 * 1024 * 1024)).toFixed(2);

    return (

        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                overflow: "hidden",
                transition: "all .25s ease",

                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,.12)",
                },
            }}
        >

            {/* Accent Bar */}

            <Box
                sx={{
                    height: 5,
                    bgcolor: "#1976d2",
                }}
            />

            <CardContent
                sx={{
                    p: 3,
                }}
            >

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Storage Usage
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {format(storageUsed)} GB of 10 GB used
                        </Typography>

                    </Box>

                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            bgcolor: "#1976d215",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#1976d2",
                        }}
                    >
                        <StorageIcon
                            sx={{
                                fontSize: 30,
                            }}
                        />
                    </Box>

                </Box>

                <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                        height: 10,
                        borderRadius: 10,

                        backgroundColor: "#ECEFF1",

                        "& .MuiLinearProgress-bar": {
                            borderRadius: 10,
                        },
                    }}
                />

                <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={1.5}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {percentage.toFixed(1)}%
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {(10 - format(storageUsed)).toFixed(2)} GB Free
                    </Typography>

                </Box>

            </CardContent>

        </Card>

    );

}

export default StorageCard;