import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    CircularProgress,
} from "@mui/material";

import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";

import { getDashboardStats } from "../../services/dashboardService";

function DashboardStats() {

    const [stats, setStats] = useState({
        folders: 0,
        files: 0,
        storage: 0,
        shared: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadStats();

    }, []);

    const loadStats = async () => {

        try {

            const data = await getDashboardStats();

            setStats(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const cards = [

        {
            title: "Folders",
            value: stats.folders,
            icon: <FolderRoundedIcon />,
            color: "#1976d2",
        },

        {
            title: "Files",
            value: stats.files,
            icon: <DescriptionRoundedIcon />,
            color: "#43a047",
        },

        {
            title: "Storage",
            value: `${stats.storage} MB`,
            icon: <StorageRoundedIcon />,
            color: "#fb8c00",
        },

        {
            title: "Shared",
            value: stats.shared,
            icon: <ShareRoundedIcon />,
            color: "#8e24aa",
        },

    ];

    return (

        <Grid
            container
            spacing={3}
            mb={4}
        >

            {cards.map((card) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                    key={card.title}
                >

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            border: "1px solid #E5E7EB",
                            height: "100%",
                        }}
                    >

                        <CardContent>

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {card.title}
                                    </Typography>

                                    {loading ? (

                                        <CircularProgress
                                            size={22}
                                            sx={{ mt: 1 }}
                                        />

                                    ) : (

                                        <Typography
                                            variant="h4"
                                            fontWeight={700}
                                            mt={1}
                                        >
                                            {card.value}
                                        </Typography>

                                    )}

                                </Box>

                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: "50%",
                                        bgcolor: `${card.color}15`,
                                        color: card.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {card.icon}
                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

}

export default DashboardStats;