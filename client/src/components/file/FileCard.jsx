import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Avatar,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import ArchiveIcon from "@mui/icons-material/Archive";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import ActionMenu from "../common/ActionMenu";

function FileCard({
    file,
    onOpen,
    onDownload,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
    onShare,
}) {

    const formatFileSize = (bytes) => {

        if (!bytes) return "0 Bytes";

        const sizes = ["Bytes", "KB", "MB", "GB"];

        const i = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, i)).toFixed(1) +
            " " +
            sizes[i]
        );

    };

    const extension =
        file.originalName
            .split(".")
            .pop()
            .toUpperCase();

    const getIcon = () => {

        const ext = extension.toLowerCase();

        switch (ext) {

            case "pdf":
                return {
                    icon: <PictureAsPdfIcon sx={{ fontSize: 34 }} />,
                    color: "#E53935",
                    bg: "#FDECEC",
                };

            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "webp":
                return {
                    icon: <ImageIcon sx={{ fontSize: 34 }} />,
                    color: "#43A047",
                    bg: "#E8F5E9",
                };

            case "zip":
            case "rar":
                return {
                    icon: <ArchiveIcon sx={{ fontSize: 34 }} />,
                    color: "#FB8C00",
                    bg: "#FFF3E0",
                };

            default:
                return {
                    icon: <DescriptionIcon sx={{ fontSize: 34 }} />,
                    color: "#1976d2",
                    bg: "#E3F2FD",
                };

        }

    };

    const fileIcon = getIcon();

    return (

        <Card
            elevation={0}
            onClick={() => onOpen(file)}
            sx={{

                height: "100%",

                borderRadius: 5,

                border: "1px solid #E8EDF3",

                cursor: "pointer",

                transition: ".25s",

                position: "relative",

                overflow: "hidden",

                "&:hover": {

                    transform: "translateY(-8px)",

                    borderColor: fileIcon.color,

                    boxShadow:
                        "0 18px 40px rgba(0,0,0,.12)",

                },

            }}
        >

            <Box
                sx={{
                    height: 6,
                    bgcolor: fileIcon.color,
                }}
            />

            <CardContent sx={{ p: 3 }}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                >

                    <Avatar
                        sx={{

                            width: 64,

                            height: 64,

                            bgcolor: fileIcon.bg,

                            color: fileIcon.color,

                        }}
                    >
                        {fileIcon.icon}
                    </Avatar>

                    <Box
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ActionMenu
                            items={[
                                {
                                    label: "Download",
                                    onClick: () => onDownload(file),
                                },
                                {
                                    label: "Rename",
                                    onClick: () => onRename(file),
                                },
                                {
                                    label: file.favorite
                                        ? "Remove Favorite"
                                        : "Add to Favorites",
                                    onClick: () => onFavorite(file),
                                },
                                {
                                    label: "Share",
                                    onClick: () => onShare(file),
                                },
                                {
                                    label: "Properties",
                                    onClick: () => onProperties(file),
                                },
                                {
                                    label: "Delete",
                                    onClick: () => onDelete(file),
                                },
                            ]}
                        />
                    </Box>

                </Box>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={3}
                    noWrap
                >
                    {file.originalName}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                >
                    Modified{" "}
                    {new Date(file.updatedAt).toLocaleDateString()}
                </Typography>

                <Box
                    mt={3}
                    display="flex"
                    gap={1}
                    flexWrap="wrap"
                >

                    <Chip
                        label={extension}
                        size="small"
                        variant="outlined"
                    />

                    <Chip
                        label={formatFileSize(file.size)}
                        size="small"
                    />

                    {file.favorite && (

                        <Chip
                            icon={
                                <FavoriteRoundedIcon />
                            }
                            label="Favorite"
                            color="warning"
                            size="small"
                        />

                    )}

                </Box>

            </CardContent>

        </Card>

    );

}

export default FileCard;