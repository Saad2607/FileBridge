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

        <Box sx={{ mt: 5 }}>

            {/* Header */}

            <Box sx={{ mb: 3 }}>

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Storage Analytics
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Detailed breakdown of your files and storage usage.
                </Typography>

            </Box>

            {/* File Type Analytics */}

            <Card
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: "1px solid #E5E7EB",
                    mb: 4,
                }}
            >

                <CardContent sx={{ p: 3 }}>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        mb={3}
                    >

                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: 3,
                                bgcolor: "#E3F2FD",
                                color: "#1976D2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <DescriptionRoundedIcon />
                        </Box>

                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                File Type Distribution
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                See how your files are distributed by type.
                            </Typography>

                        </Box>

                    </Box>

                    {fileTypeStats.length === 0 ? (

                        <Typography
                            color="text.secondary"
                        >
                            No file analytics available yet.
                        </Typography>

                    ) : (

                        <Grid
                            container
                            spacing={2}
                        >

                            {fileTypeStats.map((item) => {

                                const percentage =
                                    totalStorage > 0
                                        ? (
                                            (item.totalSize /
                                                totalStorage) *
                                            100
                                        )
                                        : 0;

                                return (

                                    <Grid
                                        size={{ xs: 12, sm: 6, md: 4 }}
                                        key={item._id || "unknown"}
                                    >

                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                bgcolor: "#F8FAFC",
                                                border: "1px solid #EEF2F6",
                                            }}
                                        >

                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                mb={1}
                                            >

                                                <Typography
                                                    fontWeight={700}
                                                >
                                                    {formatFileType(item._id)}
                                                </Typography>

                                                <Chip
                                                    label={`${item.count} files`}
                                                    size="small"
                                                    variant="outlined"
                                                />

                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 1 }}
                                            >
                                                {formatFileSize(
                                                    item.totalSize
                                                )}
                                            </Typography>

                                            <LinearProgress
                                                variant="determinate"
                                                value={percentage}
                                                sx={{
                                                    height: 7,
                                                    borderRadius: 5,
                                                }}
                                            />

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    display: "block",
                                                    mt: 0.8,
                                                }}
                                            >
                                                {percentage.toFixed(1)}%
                                                {" "}of total storage
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
                    borderRadius: 4,
                    border: "1px solid #E5E7EB",
                }}
            >

                <CardContent sx={{ p: 3 }}>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        mb={3}
                    >

                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: 3,
                                bgcolor: "#FFF3E0",
                                color: "#FB8C00",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <StorageRoundedIcon />
                        </Box>

                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Largest Files
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Your five largest files by storage size.
                            </Typography>

                        </Box>

                    </Box>

                    {largestFiles.length === 0 ? (

                        <Typography
                            color="text.secondary"
                        >
                            No files available.
                        </Typography>

                    ) : (

                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={1.5}
                        >

                            {largestFiles.map((file, index) => (

                                <Box
                                    key={file._id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        p: 2,
                                        borderRadius: 3,
                                        bgcolor: "#F8FAFC",
                                        border: "1px solid #EEF2F6",
                                    }}
                                >

                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                            bgcolor: "#E3F2FD",
                                            color: "#1976D2",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <InsertDriveFileRoundedIcon />
                                    </Box>

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >

                                        <Typography
                                            fontWeight={600}
                                            noWrap
                                        >
                                            {file.originalName}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {formatFileType(
                                                file.mimeType
                                            )}
                                        </Typography>

                                    </Box>

                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
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