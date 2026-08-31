import {
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Box,
    Avatar,
    Chip,
} from "@mui/material";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import { formatFileSize } from "../../utils/fileHelpers";

function StorageCard({ storageUsed = 0 }) {
    const totalStorage = 5 * 1024 * 1024 * 1024; // 5 GB
    const percentage = Math.min(100, (storageUsed / totalStorage) * 100);
    const freeBytes = Math.max(0, totalStorage - storageUsed);

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
                overflow: "hidden",
                transition: "all 0.2s ease",
                "&:hover": {
                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                    borderColor: "#CBD5E1",
                },
            }}
        >
            <Box
                sx={{
                    height: 5,
                    background: "linear-gradient(90deg, #1976D2 0%, #6366F1 100%)",
                }}
            />

            <CardContent sx={{ p: 3.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Box>
                        <Typography variant="h6" fontWeight={800} color="#0F172A">
                            Cloud Storage Capacity
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Live usage meter across all files
                        </Typography>
                    </Box>

                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: "#EFF6FF",
                            color: "#1976D2",
                            borderRadius: 3,
                        }}
                    >
                        <CloudQueueRoundedIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                </Box>

                <Box mb={2.5}>
                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: "#EEF2F6",
                            "& .MuiLinearProgress-bar": {
                                borderRadius: 5,
                                background: percentage > 90
                                    ? "linear-gradient(90deg, #EF4444 0%, #DC2626 100%)"
                                    : "linear-gradient(90deg, #1976D2 0%, #6366F1 100%)",
                            },
                        }}
                    />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            USED SPACE
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                            {formatFileSize(storageUsed)}
                        </Typography>
                    </Box>

                    <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            FREE SPACE
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                            {formatFileSize(freeBytes)}
                        </Typography>
                    </Box>

                    <Box textAlign="right">
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            UTILIZATION
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                            {percentage.toFixed(1)}%
                        </Typography>
                    </Box>
                </Box>

                <Box mt={3} pt={2} borderTop="1px solid #F1F5F9" display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                        icon={<CloudDoneRoundedIcon sx={{ fontSize: 16 }} />}
                        label="Active Plan: Free 5 GB"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                    />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Total Quota: 5.00 GB
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default StorageCard;