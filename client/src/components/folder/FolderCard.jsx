import { useState } from "react";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";

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

import ActionMenu from "../common/ActionMenu";

function FolderCard({
    folder,
    view,
    isSelected = false,
    onToggleSelect,
    onOpen,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
}) {
    const [isHovered, setIsHovered] = useState(false);

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
                                onChange={() => onToggleSelect(folder._id, "folder")}
                                sx={{
                                    p: 0.5,
                                    color: "#94A3B8",
                                    opacity: isSelected || isHovered ? 1 : 0.3,
                                    "&.Mui-checked": { color: "#4F46E5" },
                                }}
                            />
                        )}

                        <Avatar
                            onClick={() => onOpen(folder)}
                            sx={{
                                bgcolor: "#EEF2FF",
                                color: "#4F46E5",
                                width: 38,
                                height: 38,
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            <FolderRoundedIcon sx={{ fontSize: 22 }} />
                        </Avatar>

                        <Box flex={1} minWidth={0} onClick={() => onOpen(folder)} sx={{ cursor: "pointer" }}>
                            <Typography fontWeight={700} fontSize="0.9rem" color="#0F172A" noWrap>
                                {folder.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                Folder • Created {new Date(folder.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Action buttons */}
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0.5 }}>
                        <Tooltip title={folder.favorite ? "Starred" : "Star"}>
                            <IconButton
                                size="small"
                                onClick={() => onFavorite(folder)}
                                sx={{
                                    color: folder.favorite ? "#F59E0B" : "#94A3B8",
                                    "&:hover": { bgcolor: "#FEF3C7", color: "#D97706" },
                                }}
                            >
                                {folder.favorite ? <StarRoundedIcon fontSize="small" /> : <StarOutlineRoundedIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Rename">
                            <IconButton
                                size="small"
                                onClick={() => onRename(folder)}
                                sx={{
                                    color: "#94A3B8",
                                    opacity: isHovered ? 1 : 0,
                                    transition: "opacity 0.15s",
                                    "&:hover": { bgcolor: "#F1F5F9", color: "#334155" },
                                }}
                            >
                                <EditRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                onClick={() => onDelete(folder)}
                                sx={{
                                    color: "#94A3B8",
                                    opacity: isHovered ? 1 : 0,
                                    transition: "opacity 0.15s",
                                    "&:hover": { bgcolor: "#FEF2F2", color: "#EF4444" },
                                }}
                            >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <ActionMenu
                            items={[
                                { label: "Rename", onClick: () => onRename(folder) },
                                {
                                    label: folder.favorite ? "Unstar" : "Star",
                                    onClick: () => onFavorite(folder),
                                },
                                { label: "Properties", onClick: () => onProperties(folder) },
                                { label: "Delete", onClick: () => onDelete(folder) },
                            ]}
                        />
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
            <CardContent sx={{ p: 2 }}>
                {/* Header: Checkbox / Icon / Quick Actions */}
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.25 }}>
                        {onToggleSelect && (
                            <Checkbox
                                size="small"
                                checked={isSelected}
                                onChange={() => onToggleSelect(folder._id, "folder")}
                                sx={{
                                    p: 0,
                                    color: "#94A3B8",
                                    opacity: isSelected || isHovered ? 1 : 0.2,
                                    "&.Mui-checked": { color: "#4F46E5" },
                                }}
                            />
                        )}
                        <Avatar
                            onClick={() => onOpen(folder)}
                            sx={{
                                bgcolor: "#EEF2FF",
                                color: "#4F46E5",
                                width: 44,
                                height: 44,
                                borderRadius: "10px",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                "&:hover": { bgcolor: "#E0E7FF", transform: "scale(1.03)" },
                            }}
                        >
                            <FolderRoundedIcon sx={{ fontSize: 26 }} />
                        </Avatar>
                    </Box>

                    {/* Quick Action Buttons & Menu */}
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0.25 }} onClick={(e) => e.stopPropagation()}>
                        <Tooltip title={folder.favorite ? "Starred" : "Star"}>
                            <IconButton
                                size="small"
                                onClick={() => onFavorite(folder)}
                                sx={{
                                    color: folder.favorite ? "#F59E0B" : "#94A3B8",
                                    "&:hover": { bgcolor: "#FEF3C7", color: "#D97706" },
                                }}
                            >
                                {folder.favorite ? <StarRoundedIcon fontSize="small" /> : <StarOutlineRoundedIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        <ActionMenu
                            items={[
                                { label: "Rename", onClick: () => onRename(folder) },
                                {
                                    label: folder.favorite ? "Unstar" : "Star",
                                    onClick: () => onFavorite(folder),
                                },
                                { label: "Properties", onClick: () => onProperties(folder) },
                                { label: "Delete", onClick: () => onDelete(folder) },
                            ]}
                        />
                    </Box>
                </Box>

                {/* Folder Info */}
                <Box onClick={() => onOpen(folder)} sx={{ cursor: "pointer" }}>
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="#0F172A"
                        noWrap
                        title={folder.name}
                        mb={0.25}
                    >
                        {folder.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block" fontSize="0.75rem">
                        {new Date(folder.createdAt).toLocaleDateString()}
                    </Typography>
                </Box>

                {/* Bottom Status Tags */}
                <Box mt={1.5} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Chip
                        label="Folder"
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            bgcolor: "#F1F5F9",
                            color: "#475569",
                            borderRadius: "4px",
                        }}
                    />
                    {folder.favorite && (
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

export default FolderCard;