import FolderIcon from "@mui/icons-material/Folder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import StarIcon from "@mui/icons-material/Star";

import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Avatar,
} from "@mui/material";

import ActionMenu from "../common/ActionMenu";

function FolderCard({
    folder,
    onOpen,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
}) {

    return (

        <Card
            elevation={0}
            sx={{

                borderRadius: 5,

                border: "1px solid #E5E7EB",

                bgcolor: "#fff",

                overflow: "hidden",

                cursor: "pointer",

                transition: ".25s",

                "&:hover": {

                    transform: "translateY(-8px)",

                    boxShadow: "0 20px 45px rgba(0,0,0,.12)",

                    borderColor: "#1976d2",

                },

            }}
        >

            {/* Top Accent */}

            <Box
                sx={{
                    height: 6,
                    background:
                        "linear-gradient(90deg,#1976d2,#42a5f5)",
                }}
            />

            <CardContent sx={{ p: 3 }}>

                {/* Header */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                >

                    <Avatar
                        onClick={() => onOpen(folder)}
                        sx={{
                            bgcolor: "#E8F1FD",
                            width: 64,
                            height: 64,
                            cursor: "pointer",
                        }}
                    >
                        <FolderIcon
                            sx={{
                                fontSize: 38,
                                color: "#1976d2",
                            }}
                        />
                    </Avatar>

                    <ActionMenu
                        items={[
                            {
                                label: "Rename",
                                onClick: () => onRename(folder),
                            },
                            {
                                label: folder.favorite
                                    ? "Remove Favorite"
                                    : "Add to Favorites",
                                onClick: () => onFavorite(folder),
                            },
                            {
                                label: "Properties",
                                onClick: () => onProperties(folder),
                            },
                            {
                                label: "Delete",
                                onClick: () => onDelete(folder),
                            },
                        ]}
                    />

                </Box>

                {/* Folder Name */}

                <Box
                    mt={3}
                    onClick={() => onOpen(folder)}
                    sx={{ cursor: "pointer" }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        noWrap
                    >
                        {folder.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: .5,
                        }}
                    >
                        Your Folder
                    </Typography>

                </Box>

                {/* Info */}

                <Box
                    mt={3}
                    display="flex"
                    justifyContent="space-between"
                >

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={0.8}
                    >

                        <AccessTimeIcon
                            sx={{
                                fontSize: 18,
                                color: "#9E9E9E",
                            }}
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {new Date(
                                folder.createdAt
                            ).toLocaleDateString()}
                        </Typography>

                    </Box>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={0.8}
                    >

                        <InsertDriveFileIcon
                            sx={{
                                fontSize: 18,
                                color: "#9E9E9E",
                            }}
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Folder
                        </Typography>

                    </Box>

                </Box>

                {/* Bottom */}

                <Box
                    mt={3}
                    display="flex"
                    gap={1}
                    flexWrap="wrap"
                >

                    <Chip
                        label="Folder"
                        size="small"
                        variant="outlined"
                    />

                    {

                        folder.favorite && (

                            <Chip
                                icon={<StarIcon />}
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

export default FolderCard;