import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Chip,
    CircularProgress,
} from "@mui/material";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RestoreFromTrashRoundedIcon from "@mui/icons-material/RestoreFromTrashRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import { getRecentActivities } from "../../services/activityService";

function formatTimeAgo(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

function getActivityConfig(activity) {
    switch (activity.action) {
        case "UPLOAD_FILE":
            return {
                icon: <UploadFileRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Uploaded "${activity.targetName}"`,
                subtitle: "File uploaded to storage",
                color: "#4F46E5",
            };
        case "CREATE_FOLDER":
            return {
                icon: <CreateNewFolderRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Created folder "${activity.targetName}"`,
                subtitle: "New directory created",
                color: "#10B981",
            };
        case "DELETE_FILE":
        case "DELETE_FOLDER":
            return {
                icon: <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Moved "${activity.targetName}" to Bin`,
                subtitle: activity.targetType === "folder" ? "Folder deleted" : "File deleted",
                color: "#F59E0B",
            };
        case "RESTORE_FILE":
        case "RESTORE_FOLDER":
            return {
                icon: <RestoreFromTrashRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Restored "${activity.targetName}"`,
                subtitle: "Restored from Recycle Bin",
                color: "#0284C7",
            };
        case "PERMANENT_DELETE_FILE":
        case "PERMANENT_DELETE_FOLDER":
            return {
                icon: <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Permanently deleted "${activity.targetName}"`,
                subtitle: "Item purged",
                color: "#EF4444",
            };
        case "SHARE_FILE":
            return {
                icon: <ShareRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Shared "${activity.targetName}"`,
                subtitle: "Public link generated",
                color: "#8B5CF6",
            };
        case "UNSHARE_FILE":
            return {
                icon: <ShareRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Disabled sharing for "${activity.targetName}"`,
                subtitle: "Share link revoked",
                color: "#64748B",
            };
        case "FAVORITE_FILE":
        case "FAVORITE_FOLDER":
            return {
                icon: <StarRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Starred "${activity.targetName}"`,
                subtitle: "Added to Favorites",
                color: "#F59E0B",
            };
        case "UNFAVORITE_FILE":
        case "UNFAVORITE_FOLDER":
            return {
                icon: <StarRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Unstarred "${activity.targetName}"`,
                subtitle: "Removed from Favorites",
                color: "#94A3B8",
            };
        case "RENAME_FILE":
        case "RENAME_FOLDER":
            return {
                icon: <DriveFileRenameOutlineRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Renamed to "${activity.targetName}"`,
                subtitle: activity.metadata?.oldName ? `Was "${activity.metadata.oldName}"` : "Name updated",
                color: "#4F46E5",
            };
        case "DOWNLOAD_FILE":
            return {
                icon: <FileDownloadRoundedIcon sx={{ fontSize: 18 }} />,
                title: `Downloaded "${activity.targetName}"`,
                subtitle: "File downloaded",
                color: "#059669",
            };
        default:
            return {
                icon: <HistoryRoundedIcon sx={{ fontSize: 18 }} />,
                title: `${activity.action} on ${activity.targetName}`,
                subtitle: "Activity logged",
                color: "#64748B",
            };
    }
}

function RecentActivity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const data = await getRecentActivities(6);
            setActivities(data.activities || []);
        } catch (error) {
            console.error("Failed to load activities", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle1" fontWeight={800} color="#0F172A" mb={2}>
                    Recent Activity
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress size={24} sx={{ color: "#4F46E5" }} />
                    </Box>
                ) : activities.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 4,
                            flex: 1,
                        }}
                    >
                        <HistoryRoundedIcon sx={{ fontSize: 40, color: "#CBD5E1", mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            No recent activity yet
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                            Your file operations will appear here in real time.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {activities.map((activity, index) => {
                            const config = getActivityConfig(activity);

                            return (
                                <Box
                                    key={activity._id || index}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 1.5,
                                        py: 1.25,
                                        borderBottom:
                                            index !== activities.length - 1
                                                ? "1px solid #F1F5F9"
                                                : "none",
                                        transition: ".15s ease",
                                        "&:hover": {
                                            bgcolor: "#F8FAFC",
                                            borderRadius: "8px",
                                            px: 0.75,
                                            mx: -0.75,
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: `${config.color}15`,
                                            color: config.color,
                                            width: 36,
                                            height: 36,
                                            borderRadius: "8px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {config.icon}
                                    </Avatar>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            fontWeight={600}
                                            fontSize="0.85rem"
                                            color="#1E293B"
                                            noWrap
                                        >
                                            {config.title}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            fontSize="0.72rem"
                                            noWrap
                                            display="block"
                                        >
                                            {config.subtitle}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={formatTimeAgo(activity.createdAt)}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            height: 20,
                                            fontSize: "0.68rem",
                                            fontWeight: 600,
                                            color: "#64748B",
                                            borderColor: "#E2E8F0",
                                            bgcolor: "#F8FAFC",
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default RecentActivity;