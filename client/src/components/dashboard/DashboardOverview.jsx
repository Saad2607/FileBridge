import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

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
                py={5}
            >
                <CircularProgress />
            </Box>
        );

    }

    if (!stats) {

        return null;

    }

    return (

        <Box sx={{ px: 4, pt: 4 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Dashboard
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 4 }}
            >
                Welcome back! Here's an overview of your storage.
            </Typography>

            <Grid
                container
                spacing={3}
            >

                <Grid
                    item
                    xs={12}
                >
                    <StorageCard
                        storageUsed={stats.storageUsed}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2.4}
                >
                    <StatsCard
                        title="Folders"
                        value={stats.folders}
                        icon={<FolderIcon  sx={{fontSize: 34}}/>}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2.4}
                >
                    <StatsCard
                        title="Files"
                        value={stats.files}
                        icon={<DescriptionIcon  sx={{fontSize: 34}} />}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2.4}
                >
                    <StatsCard
                        title="Favorites"
                        value={stats.favorites}
                        icon={<StarIcon  sx={{fontSize: 34}} />}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2.4}
                >
                    <StatsCard
                        title="Shared"
                        value={stats.shared}
                        icon={<ShareIcon  sx={{fontSize: 34}} />}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2.4}
                >
                    <StatsCard
                        title="Recycle Bin"
                        value={stats.recycleBin}
                        icon={<DeleteIcon  sx={{fontSize: 34}} />}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <RecentFiles
                        files={recentFiles}
                    />
                </Grid>

            </Grid>

        </Box>

    );

}

export default DashboardOverview;