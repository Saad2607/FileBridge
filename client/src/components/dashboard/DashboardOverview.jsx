import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

import WelcomeBanner from "./WelcomeBanner";
import StatsCard from "./StatsCard";
import StorageCard from "./StorageCard";
import RecentFiles from "./RecentFiles";

import { getDashboardStats } from "../../services/dashboardService";

function DashboardOverview() {

    const [stats, setStats] = useState(null);
    const [recentFiles, setRecentFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const data = await getDashboardStats();

            setStats(data.stats);

            setRecentFiles(data.recentFiles);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                py={8}
            >
                <CircularProgress />
            </Box>

        );

    }

    if (!stats) return null;

    return (

        <Box
            sx={{
                mb: 5,
            }}
        >

            <WelcomeBanner />

            <Box sx={{ mb: 4 }}>

                <StorageCard
                    storageUsed={stats.storageUsed}
                />

            </Box>

            <Grid
                container
                spacing={3}
                sx={{
                    mb: 5,
                }}
            >

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatsCard
                        title="Folders"
                        value={stats.folders}
                        color="#1976d2"
                        icon={<FolderIcon sx={{ fontSize: 32 }} />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatsCard
                        title="Files"
                        value={stats.files}
                        color="#43A047"
                        icon={<DescriptionIcon sx={{ fontSize: 32 }} />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatsCard
                        title="Favorites"
                        value={stats.favorites}
                        color="#FB8C00"
                        icon={<StarIcon sx={{ fontSize: 32 }} />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatsCard
                        title="Shared"
                        value={stats.shared}
                        color="#8E24AA"
                        icon={<ShareIcon sx={{ fontSize: 32 }} />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatsCard
                        title="Recycle Bin"
                        value={stats.recycleBin}
                        color="#E53935"
                        icon={<DeleteIcon sx={{ fontSize: 32 }} />}
                    />
                </Grid>

            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    mb: 2,
                }}
            >
                Recent Files
            </Typography>

            <RecentFiles
                files={recentFiles}
            />

        </Box>

    );

}

export default DashboardOverview;