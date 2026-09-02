import { useEffect, useState } from "react";
import {
    Grid,
    Box,
    Typography,
    CircularProgress,
    Divider,
} from "@mui/material";

import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

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
            setStats(data.stats || data);
            setRecentFiles(data.recentFiles || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress size={36} />
            </Box>
        );
    }

    if (!stats) return null;

    return (
        <Box sx={{ mb: 5 }}>
            <WelcomeBanner />

            <Box sx={{ mb: 4 }}>
                <StorageCard storageUsed={stats.storageUsed} />
            </Box>

            <Grid container spacing={{ xs: 1.5, sm: 2.5 }} sx={{ mb: 4 }}>
                <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
                    <StatsCard
                        title="Folders"
                        value={stats.folders}
                        color="#1976D2"
                        icon={<FolderRoundedIcon sx={{ fontSize: 30 }} />}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
                    <StatsCard
                        title="Files"
                        value={stats.files}
                        color="#10B981"
                        icon={<DescriptionRoundedIcon sx={{ fontSize: 30 }} />}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
                    <StatsCard
                        title="Favorites"
                        value={stats.favorites}
                        color="#F59E0B"
                        icon={<StarRoundedIcon sx={{ fontSize: 30 }} />}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
                    <StatsCard
                        title="Shared"
                        value={stats.shared}
                        color="#8B5CF6"
                        icon={<ShareRoundedIcon sx={{ fontSize: 30 }} />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <StatsCard
                        title="Recycle Bin"
                        value={stats.recycleBin}
                        color="#EF4444"
                        icon={<DeleteOutlineRoundedIcon sx={{ fontSize: 30 }} />}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ mb: 3.5 }} />

            <Typography variant="h6" fontWeight={800} color="#0F172A" sx={{ mb: 2 }}>
                Recent Files
            </Typography>

            <RecentFiles files={recentFiles} />
        </Box>
    );
}

export default DashboardOverview;