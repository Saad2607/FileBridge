import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Divider,
    Chip,
    Button,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import MovieRoundedIcon from "@mui/icons-material/MovieRounded";
import AudioFileRoundedIcon from "@mui/icons-material/AudioFileRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatFileSize } from "../../utils/fileHelpers";

function getFileIcon(originalName = "") {
    const ext = originalName.split(".").pop().toLowerCase();

    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
        return <ImageRoundedIcon sx={{ color: "#10B981" }} />;
    }
    if (ext === "pdf") {
        return <PictureAsPdfRoundedIcon sx={{ color: "#EF4444" }} />;
    }
    if (["mp4", "mkv", "mov", "webm"].includes(ext)) {
        return <MovieRoundedIcon sx={{ color: "#8B5CF6" }} />;
    }
    if (["mp3", "wav", "aac", "ogg"].includes(ext)) {
        return <AudioFileRoundedIcon sx={{ color: "#EC4899" }} />;
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
        return <ArchiveRoundedIcon sx={{ color: "#F59E0B" }} />;
    }

    return <DescriptionRoundedIcon sx={{ color: "#1976D2" }} />;
}

function RecentFiles({ files = [] }) {
    const navigate = useNavigate();

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Typography variant="h6" fontWeight={800} color="#0F172A">
                        Recently Uploaded
                    </Typography>

                    <Button
                        endIcon={<ArrowForwardRoundedIcon />}
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                        sx={{ textTransform: "none", fontWeight: 700 }}
                    >
                        Explorer
                    </Button>
                </Box>

                {files.length === 0 ? (
                    <Box textAlign="center" py={6}>
                        <InsertDriveFileRoundedIcon sx={{ fontSize: 60, color: "#CBD5E1", mb: 1 }} />
                        <Typography fontWeight={700} color="#0F172A">
                            No files uploaded yet
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Your recent uploads will be cataloged here.
                        </Typography>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={1}>
                        {files.map((file, index) => {
                            const ext = file.originalName ? file.originalName.split(".").pop().toUpperCase() : "FILE";

                            return (
                                <Box
                                    key={file._id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        p: 1.5,
                                        px: 2,
                                        borderRadius: 3,
                                        bgcolor: "#F8FAFC",
                                        border: "1px solid #F1F5F9",
                                        transition: "all .18s ease",
                                        "&:hover": {
                                            bgcolor: "#FFFFFF",
                                            borderColor: "#CBD5E1",
                                            transform: "translateX(4px)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                                        },
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} minWidth={0} flex={1}>
                                        <Avatar
                                            sx={{
                                                bgcolor: "#FFFFFF",
                                                border: "1px solid #E2E8F0",
                                                width: 42,
                                                height: 42,
                                                borderRadius: 2.5,
                                            }}
                                        >
                                            {getFileIcon(file.originalName)}
                                        </Avatar>

                                        <Box minWidth={0} flex={1}>
                                            <Typography fontWeight={700} fontSize="0.9rem" color="#0F172A" noWrap>
                                                {file.originalName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(file.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Chip
                                            label={ext}
                                            size="small"
                                            sx={{
                                                height: 22,
                                                fontSize: "0.7rem",
                                                fontWeight: 700,
                                                bgcolor: "#FFFFFF",
                                                border: "1px solid #E2E8F0",
                                                color: "#475569",
                                            }}
                                        />
                                        <Typography variant="body2" fontWeight={700} color="#0F172A" minWidth={70} textAlign="right">
                                            {formatFileSize(file.size)}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default RecentFiles;