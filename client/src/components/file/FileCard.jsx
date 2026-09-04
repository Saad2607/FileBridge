import { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Checkbox,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import MovieIcon from "@mui/icons-material/Movie";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import ArchiveIcon from "@mui/icons-material/Archive";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";

import ActionMenu from "../common/ActionMenu";
import { formatFileSize } from "../../utils/fileHelpers";

function getFileStyle(originalName) {
    const ext = originalName ? originalName.split(".").pop().toLowerCase() : "";

    if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext)) {
        return {
            icon: <ImageIcon sx={{ fontSize: 24 }} />,
            color: "#10B981",
            bg: "rgba(16, 185, 129, 0.1)",
            label: "Image",
        };
    }
    if (ext === "pdf") {
        return {
            icon: <PictureAsPdfIcon sx={{ fontSize: 24 }} />,
            color: "#EF4444",
            bg: "rgba(239, 68, 68, 0.1)",
            label: "PDF",
        };
    }
    if (["mp4", "webm", "mkv", "mov", "avi"].includes(ext)) {
        return {
            icon: <MovieIcon sx={{ fontSize: 24 }} />,
            color: "#8B5CF6",
            bg: "rgba(139, 92, 246, 0.1)",
            label: "Video",
        };
    }
    if (["mp3", "wav", "aac", "ogg", "flac"].includes(ext)) {
        return {
            icon: <AudioFileIcon sx={{ fontSize: 24 }} />,
            color: "#EC4899",
            bg: "rgba(236, 72, 153, 0.1)",
            label: "Audio",
        };
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
        return {
            icon: <ArchiveIcon sx={{ fontSize: 24 }} />,
            color: "#F59E0B",
            bg: "rgba(245, 158, 11, 0.1)",
            label: "Archive",
        };
    }
    if (["js", "jsx", "ts", "tsx", "json", "html", "css", "py", "java", "sql", "xml"].includes(ext)) {
        return {
            icon: <CodeRoundedIcon sx={{ fontSize: 24 }} />,
            color: "#06B6D4",
            bg: "rgba(6, 182, 212, 0.1)",
            label: "Code",
        };
    }

    return {
        icon: <DescriptionIcon sx={{ fontSize: 24 }} />,
        color: "#4F46E5",
        bg: "rgba(79, 70, 229, 0.1)",
        label: "Document",
    };
}

function FileCard({
    file,
    view,
    isSelected = false,
    onToggleSelect,
    onOpen,
    onDownload,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
    onShare,
    onStudio,
    onEdit,
    onManageTags,
}) {
    const [isHovered, setIsHovered] = useState(false);

    const extLower = file.originalName ? file.originalName.split(".").pop().toLowerCase() : "";
    const isImage = ["png", "jpg", "jpeg", "webp", "gif", "bmp"].includes(extLower);
    const isTextOrCode = [
        "txt", "html", "htm", "css", "js", "jsx", "ts", "tsx", "json", "md", "markdown",
        "py", "sql", "env", "yaml", "yml", "xml", "csv", "log", "sh", "bat", "svg"
    ].includes(extLower);

    const extension = file.originalName
        ? file.originalName.split(".").pop().toUpperCase()
        : "FILE";

    const styleConfig = getFileStyle(file.originalName);
    const tags = Array.isArray(file.tags) ? file.tags : [];

    const actionMenuItems = [
        { label: "Preview", onClick: () => onOpen(file) },
        ...(isImage && onStudio ? [{ label: "Image Studio", onClick: () => onStudio(file) }] : []),
        ...(isTextOrCode && onEdit ? [{ label: "Edit File", onClick: () => onEdit(file) }] : []),
        ...(onManageTags ? [{ label: "Manage Tags", onClick: () => onManageTags(file) }] : []),
        { label: "Download", onClick: () => onDownload(file) },
        { label: "Rename", onClick: () => onRename(file) },
        {
            label: file.favorite ? "Unstar" : "Star",
            onClick: () => onFavorite(file),
        },
        { label: "Share", onClick: () => onShare(file) },
        { label: "Properties", onClick: () => onProperties(file) },
        { label: "Delete", onClick: () => onDelete(file) },
    ];

    if (view === "list") {
        return (
            <Card
                elevation={0}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    borderRadius: "12px",
                    border: isSelected ? "1.5px solid #4F46E5" : "1px solid #E2E8F0",
                    bgcolor: isSelected ? "#EEF2FF" : "#FFFFFF",
                    transition: "all 0.15s ease",
                    "&:hover": {
                        borderColor: isSelected ? "#4F46E5" : "#CBD5E1",
                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                    },
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.25,
                        px: 2,
                        "&:last-child": { pb: 1.25 },
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
                        {onToggleSelect && (
                            <Checkbox
                                size="small"
                                checked={isSelected}
                                onChange={() => onToggleSelect(file._id, "file")}
                                sx={{
                                    p: 0.5,
                                    color: "#94A3B8",
                                    opacity: isSelected || isHovered ? 1 : 0.3,
                                    "&.Mui-checked": { color: "#4F46E5" },
                                }}
                            />
                        )}

                        <Avatar
                            onClick={() => onOpen(file)}
                            sx={{
                                bgcolor: styleConfig.bg,
                                color: styleConfig.color,
                                width: 38,
                                height: 38,
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            {styleConfig.icon}
                        </Avatar>

                        <Box flex={1} minWidth={0} onClick={() => onOpen(file)} sx={{ cursor: "pointer" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography fontWeight={700} fontSize="0.9rem" color="#0F172A" noWrap>
                                    {file.originalName}
                                </Typography>
                                {tags.map((tag) => (
                                    <Chip
                                        key={tag.name}
                                        label={tag.name}
                                        size="small"
                                        sx={{
                                            height: 18,
                                            fontSize: "0.65rem",
                                            fontWeight: 700,
                                            bgcolor: tag.color || "#4F46E5",
                                            color: "#FFFFFF",
                                            borderRadius: "4px",
                                        }}
                                    />
                                ))}
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                {extension} • {formatFileSize(file.size)} • Modified {new Date(file.updatedAt || file.createdAt).toLocaleDateString()}
                            </Typography>
                            {file.matchSnippet && (
                                <Box
                                    sx={{
                                        mt: 0.5,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        bgcolor: "#FEF3C7",
                                        color: "#92400E",
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: "4px",
                                        fontSize: "0.72rem",
                                        fontFamily: "monospace",
                                        maxWidth: "95%",
                                    }}
                                >
                                    <FindInPageRoundedIcon sx={{ fontSize: 13 }} />
                                    <Typography variant="caption" sx={{ fontFamily: "inherit", fontWeight: 600 }}>
                                        {file.matchSnippet}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Action buttons */}
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="Preview">
                            <IconButton
                                size="small"
                                onClick={() => onOpen(file)}
                                sx={{
                                    color: "#64748B",
                                    "&:hover": { bgcolor: "#EEF2FF", color: "#4F46E5" },
                                }}
                            >
                                <VisibilityRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Download">
                            <IconButton
                                size="small"
                                onClick={() => onDownload(file)}
                                sx={{
                                    color: "#64748B",
                                    "&:hover": { bgcolor: "#EEF2FF", color: "#4F46E5" },
                                }}
                            >
                                <DownloadRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={file.favorite ? "Starred" : "Star"}>
                            <IconButton
                                size="small"
                                onClick={() => onFavorite(file)}
                                sx={{
                                    color: file.favorite ? "#F59E0B" : "#94A3B8",
                                    "&:hover": { bgcolor: "#FEF3C7", color: "#D97706" },
                                }}
                            >
                                {file.favorite ? <StarRoundedIcon fontSize="small" /> : <StarOutlineRoundedIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Tags">
                            <IconButton
                                size="small"
                                onClick={() => onManageTags && onManageTags(file)}
                                sx={{
                                    color: tags.length > 0 ? "#4F46E5" : "#64748B",
                                    "&:hover": { bgcolor: "#EEF2FF", color: "#4F46E5" },
                                }}
                            >
                                <LocalOfferRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Share">
                            <IconButton
                                size="small"
                                onClick={() => onShare(file)}
                                sx={{
                                    color: "#64748B",
                                    opacity: isHovered ? 1 : 0,
                                    transition: "opacity 0.15s",
                                    "&:hover": { bgcolor: "#F5F3FF", color: "#8B5CF6" },
                                }}
                            >
                                <ShareRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <ActionMenu items={actionMenuItems} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // Grid View
    return (
        <Card
            elevation={0}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                borderRadius: "14px",
                border: isSelected ? "2px solid #4F46E5" : "1px solid #E2E8F0",
                bgcolor: isSelected ? "#EEF2FF" : "#FFFFFF",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: isSelected ? "#4F46E5" : "#CBD5E1",
                    boxShadow: "0 8px 20px -4px rgba(15, 23, 42, 0.08)",
                },
            }}
        >
            <CardContent sx={{ p: { xs: 1.25, sm: 2 }, "&:last-child": { pb: { xs: 1.25, sm: 2 } } }}>
                {/* Header: Checkbox / Icon / Quick Actions */}
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", mb: 1.25 }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                        {onToggleSelect && (
                            <Checkbox
                                size="small"
                                checked={isSelected}
                                onChange={() => onToggleSelect(file._id, "file")}
                                sx={{
                                    p: 0,
                                    color: "#94A3B8",
                                    opacity: isSelected || isHovered ? 1 : 0.2,
                                    "&.Mui-checked": { color: "#4F46E5" },
                                }}
                            />
                        )}
                        <Avatar
                            onClick={() => onOpen(file)}
                            sx={{
                                bgcolor: styleConfig.bg,
                                color: styleConfig.color,
                                width: { xs: 38, sm: 44 },
                                height: { xs: 38, sm: 44 },
                                borderRadius: "10px",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                "&:hover": { transform: "scale(1.03)" },
                            }}
                        >
                            {styleConfig.icon}
                        </Avatar>
                    </Box>

                    {/* Quick Action Buttons & Menu */}
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0.25 }} onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="Preview">
                            <IconButton
                                size="small"
                                onClick={() => onOpen(file)}
                                sx={{
                                    display: { xs: "none", sm: "inline-flex" },
                                    color: "#64748B",
                                    "&:hover": { bgcolor: "#EEF2FF", color: "#4F46E5" },
                                }}
                            >
                                <VisibilityRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Download">
                            <IconButton
                                size="small"
                                onClick={() => onDownload(file)}
                                sx={{
                                    display: { xs: "none", sm: "inline-flex" },
                                    color: "#64748B",
                                    "&:hover": { bgcolor: "#EEF2FF", color: "#4F46E5" },
                                }}
                            >
                                <DownloadRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={file.favorite ? "Starred" : "Star"}>
                            <IconButton
                                size="small"
                                onClick={() => onFavorite(file)}
                                sx={{
                                    color: file.favorite ? "#F59E0B" : "#94A3B8",
                                    "&:hover": { bgcolor: "#FEF3C7", color: "#D97706" },
                                }}
                            >
                                {file.favorite ? <StarRoundedIcon fontSize="small" /> : <StarOutlineRoundedIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        <ActionMenu items={actionMenuItems} />
                    </Box>
                </Box>

                {/* File Name & Info */}
                <Box onClick={() => onOpen(file)} sx={{ cursor: "pointer" }}>
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="#0F172A"
                        noWrap
                        title={file.originalName}
                        mb={0.25}
                    >
                        {file.originalName}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block" fontSize="0.75rem">
                        {formatFileSize(file.size)} • Modified {new Date(file.updatedAt || file.createdAt).toLocaleDateString()}
                    </Typography>

                    {/* Deep Search Snippet Match */}
                    {file.matchSnippet && (
                        <Box
                            sx={{
                                mt: 0.75,
                                p: 0.6,
                                px: 0.8,
                                borderRadius: "6px",
                                bgcolor: "#FEF3C7",
                                color: "#92400E",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                fontSize: "0.72rem",
                                fontFamily: "monospace",
                                border: "1px solid #FDE68A",
                            }}
                        >
                            <FindInPageRoundedIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption" noWrap sx={{ fontFamily: "inherit", fontWeight: 600 }}>
                                {file.matchSnippet}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Bottom Tags */}
                <Box mt={1.5} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                        <Chip
                            label={extension}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                bgcolor: styleConfig.bg,
                                color: styleConfig.color,
                                borderRadius: "4px",
                            }}
                        />
                        {tags.slice(0, 2).map((tag) => (
                            <Chip
                                key={tag.name}
                                label={tag.name}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    bgcolor: tag.color || "#4F46E5",
                                    color: "#FFFFFF",
                                    borderRadius: "4px",
                                }}
                            />
                        ))}
                        {tags.length > 2 && (
                            <Chip
                                label={`+${tags.length - 2}`}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    bgcolor: "#E2E8F0",
                                    color: "#475569",
                                    borderRadius: "4px",
                                }}
                            />
                        )}
                    </Box>

                    {file.favorite && (
                        <Chip
                            icon={<StarRoundedIcon sx={{ fontSize: 12, color: "#D97706 !important" }} />}
                            label="Starred"
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                bgcolor: "#FEF3C7",
                                color: "#B45309",
                                borderRadius: "4px",
                            }}
                        />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default FileCard;