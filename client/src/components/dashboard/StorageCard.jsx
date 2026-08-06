import {
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Box,
    Avatar,
    Chip,
} from "@mui/material";

import StorageIcon from "@mui/icons-material/Storage";
import CloudDoneIcon from "@mui/icons-material/CloudDone";

function StorageCard({ storageUsed }) {

    const totalStorage = 10 * 1024 * 1024 * 1024;

    const percentage = (storageUsed / totalStorage) * 100;

    const format = (bytes) =>
        (bytes / (1024 * 1024 * 1024)).toFixed(2);

    const freeStorage = (
        10 - parseFloat(format(storageUsed))
    ).toFixed(2);

    return (

        <Card
            elevation={0}
            sx={{

                borderRadius: 5,

                border: "1px solid #E8EDF3",

                overflow: "hidden",

                transition: ".25s",

                "&:hover": {

                    transform: "translateY(-8px)",

                    boxShadow:
                        "0 18px 40px rgba(0,0,0,.12)",

                    borderColor: "#1976d2",

                },

            }}
        >

            {/* Gradient Top */}

            <Box
                sx={{
                    height: 6,
                    background:
                        "linear-gradient(90deg,#1976d2,#42A5F5)",
                }}
            />

            <CardContent sx={{ p: 3.5 }}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Storage
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: .5 }}
                        >
                            Cloud Storage Overview
                        </Typography>

                    </Box>

                    <Avatar
                        sx={{

                            width: 62,

                            height: 62,

                            bgcolor: "#E3F2FD",

                            color: "#1976d2",

                        }}
                    >
                        <StorageIcon
                            sx={{
                                fontSize: 34,
                            }}
                        />
                    </Avatar>

                </Box>

                <Box mt={4}>

                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{

                            height: 12,

                            borderRadius: 20,

                            bgcolor: "#ECEFF1",

                            "& .MuiLinearProgress-bar": {

                                borderRadius: 20,

                                background:
                                    "linear-gradient(90deg,#1976d2,#42A5F5)",

                            },

                        }}
                    />

                </Box>

                <Box
                    mt={3}
                    display="flex"
                    justifyContent="space-between"
                >

                    <Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Used
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {format(storageUsed)} GB
                        </Typography>

                    </Box>

                    <Box textAlign="center">

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Free
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {freeStorage} GB
                        </Typography>

                    </Box>

                    <Box textAlign="right">

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Usage
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {percentage.toFixed(1)}%
                        </Typography>

                    </Box>

                </Box>

                <Box
                    mt={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Chip
                        icon={<CloudDoneIcon />}
                        label="Cloud Synced"
                        color="success"
                        variant="outlined"
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Total 10 GB
                    </Typography>

                </Box>

            </CardContent>

        </Card>

    );

}

export default StorageCard;