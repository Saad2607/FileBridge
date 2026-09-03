import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Grid,
    Chip,
    LinearProgress,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

import { getDashboardAnalytics } from "../../services/dashboardService";

function StorageAnalytics() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadAnalytics();

    }, []);

    const loadAnalytics = async () => {

        try {

            const data = await getDashboardAnalytics();

            setAnalytics(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const formatFileSize = (bytes) => {

        if (!bytes || bytes === 0) {
            return "0 Bytes";
        }

        const sizes = [
            "Bytes",
            "KB",
            "MB",
            "GB",
            "TB",
        ];

        const i = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, i)).toFixed(2) +
            " " +
            sizes[i]
        );

    };

    const formatFileType = (mimeType) => {

        if (!mimeType) {
            return "Unknown";
        }

        if (mimeType === "application/pdf") {
            return "PDF";
        }

        if (mimeType.startsWith("image/")) {
            return "Images";
        }

        if (mimeType.startsWith("video/")) {
            return "Videos";
        }

        if (mimeType.startsWith("audio/")) {
            return "Audio";
        }

        if (
            mimeType.includes("word") ||
            mimeType.includes("document")
        ) {
            return "Documents";
        }

        if (
            mimeType.includes("spreadsheet") ||
            mimeType.includes("excel")
        ) {
            return "Spreadsheets";
        }

        if (
            mimeType.includes("zip") ||
            mimeType.includes("rar") ||
            mimeType.includes("compressed")
        ) {
            return "Archives";
        }

        return mimeType
            .split("/")
            .pop()
            .toUpperCase();

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

    if (!analytics) {
        return null;
    }

    const fileTypeStats =
        analytics.fileTypeStats || [];

    const largestFiles =
        analytics.largestFiles || [];

    const totalStorage = fileTypeStats.reduce(
        (total, item) =>
            total + (item.totalSize || 0),
        0
    );

    return (

        <Box sx={{ mt: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} color="#0F172A" letterSpacing="-0.02em">
                    Storage Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Detailed breakdown of your files and cloud storage utilization.
                </Typography>
            </Box>

            {/* File Type Analytics */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: "14px",
                    border: "1px solid #E2E8F0",
                    mb: 3.5,
                    overflow: "hidden",
                }}
            >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.75}
                        mb={2.5}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "10px",
                                bgcolor: "#EEF2FF",
                                color: "#4F46E5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <DescriptionRoundedIcon sx={{ fontSize: 24 }} />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="#0F172A">
                                File Type Distribution
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Breakdown of file formats across your storage.
                            </Typography>
                        </Box>
                    </Box>

                    {fileTypeStats.length === 0 ? (
                        <Typography color="text.secondary" variant="body2" sx={{ py: 2, textAlign: "center" }}>
                            No file analytics available yet.
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {fileTypeStats.map((item) => {
                                const percentage =
                                    totalStorage > 0
                                        ? (item.totalSize / totalStorage) * 100
                                        : 0;

                                return (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id || "unknown"}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: "10px",
                                                bgcolor: "#F8FAFC",
                                                border: "1px solid #E2E8F0",
                                                transition: "border-color 0.15s ease",
                                                "&:hover": { borderColor: "#CBD5E1" },
                                            }}
                                        >
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
                                                <Typography fontWeight={700} fontSize="0.88rem" color="#0F172A">
                                                    {formatFileType(item._id)}
                                                </Typography>
                                                <Chip
                                                    label={`${item.count} files`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ height: 20, fontSize: "0.68rem", fontWeight: 600 }}
                                                />
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 1, fontSize: "0.8rem" }}>
                                                {formatFileSize(item.totalSize)}
                                            </Typography>

                                            <LinearProgress
                                                variant="determinate"
                                                value={percentage}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 4,
                                                    bgcolor: "#E2E8F0",
                                                    "& .MuiLinearProgress-bar": {
                                                        borderRadius: 4,
                                                        background: "linear-gradient(90deg, #4F46E5 0%, #0284C7 100%)",
                                                    },
                                                }}
                                            />

                                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75, fontSize: "0.72rem" }}>
                                                {percentage.toFixed(1)}% of total storage
                                            </Typography>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Largest Files */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: "14px",
                    border: "1px solid #E2E8F0",
                    overflow: "hidden",
                }}
            >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.75}
                        mb={2.5}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "10px",
                                bgcolor: "#FFF7ED",
                                color: "#EA580C",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <StorageRoundedIcon sx={{ fontSize: 24 }} />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="#0F172A">
                                Largest Files
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Your five largest files stored in the cloud.
                            </Typography>
                        </Box>
                    </Box>

                    {largestFiles.length === 0 ? (
                        <Typography color="text.secondary" variant="body2" sx={{ py: 2, textAlign: "center" }}>
                            No files available yet.
                        </Typography>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={1.25}>
                            {largestFiles.map((file) => (
                                <Box
                                    key={file._id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        p: 1.5,
                                        borderRadius: "10px",
                                        bgcolor: "#F8FAFC",
                                        border: "1px solid #E2E8F0",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "8px",
                                            bgcolor: "#EEF2FF",
                                            color: "#4F46E5",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <InsertDriveFileRoundedIcon sx={{ fontSize: 20 }} />
                                    </Box>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography fontWeight={600} fontSize="0.85rem" color="#0F172A" noWrap>
                                            {file.originalName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.72rem">
                                            {formatFileType(file.mimeType)}
                                        </Typography>
                                    </Box>

                                    <Typography fontWeight={700} fontSize="0.82rem" color="#334155" sx={{ whiteSpace: "nowrap" }}>
                                        {formatFileSize(file.size)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>

    );

}

export default StorageAnalytics;