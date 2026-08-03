import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import FavoriteIcon from "@mui/icons-material/Favorite";

import ActionMenu from "../common/ActionMenu";

function FileCard({
    file,
    onDownload,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
    onShare,
}) {

    const formatFileSize = (bytes) => {

        if (!bytes) return "0 Bytes";

        const sizes = [
            "Bytes",
            "KB",
            "MB",
            "GB",
        ];

        const i = Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, i)).toFixed(1) +
            " " +
            sizes[i]
        );

    };

    const extension =
        file.originalName.split(".").pop().toUpperCase();

    return (

        <Card
            elevation={0}
            sx={{

                borderRadius: 4,

                border: "1px solid #E5E7EB",

                transition: "all .25s ease",

                cursor: "pointer",

                overflow: "hidden",

                "&:hover": {

                    transform: "translateY(-6px)",

                    boxShadow:
                        "0 12px 32px rgba(0,0,0,.12)",

                },

            }}
        >

            <CardContent
                sx={{
                    p: 3,
                }}
            >

                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <DescriptionIcon
                        sx={{
                            fontSize: 55,
                            color: "#616161",
                        }}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            top: -12,
                            right: -12,
                        }}
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
                    mt={2}
                    noWrap
                >
                    {file.originalName}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                    }}
                >
                    {extension} • {formatFileSize(file.size)}
                </Typography>

                <Box
                    mt={2}
                    display="flex"
                    gap={1}
                    flexWrap="wrap"
                >

                    <Chip
                        label={extension}
                        size="small"
                        variant="outlined"
                    />

                    {
                        file.favorite && (

                            <Chip
                                icon={
                                    <FavoriteIcon />
                                }
                                label="Favorite"
                                color="warning"
                                size="small"
                            />

                        )
                    }

                </Box>

            </CardContent>

        </Card>

    );

}

export default FileCard;