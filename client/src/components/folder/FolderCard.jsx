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
    view,
    onOpen,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
}) {

    if (view === "list") {

        return (

            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #E5E7EB",
                    transition: ".25s",
                    "&:hover": {
                        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                    },
                }}
            >

                <CardContent
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 2,
                    }}
                >

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        flex={1}
                        onClick={() => onOpen(folder)}
                        sx={{
                            cursor: "pointer",
                        }}
                    >

                        <Avatar
                            sx={{
                                bgcolor: "#E8F1FD",
                            }}
                        >

                            <FolderIcon
                                sx={{
                                    color: "#1976d2",
                                }}
                            />

                        </Avatar>

                        <Box flex={1}>

                            <Typography
                                fontWeight={700}
                            >
                                {folder.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Created {new Date(folder.createdAt).toLocaleDateString()}
                            </Typography>

                        </Box>

                        {folder.favorite && (

                            <Chip
                                icon={<StarIcon />}
                                label="Favorite"
                                color="warning"
                                size="small"
                            />

                        )}

                    </Box>

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

                </CardContent>

            </Card>

        );

    }

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
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,.12)",
                },
            }}
        >

            <Box
                sx={{
                    height: 6,
                    background:
                        "linear-gradient(90deg,#1976d2,#42a5f5)",
                }}
            />

            <CardContent sx={{ p: 3 }}>

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

                <Box
                    mt={3}
                    onClick={() => onOpen(folder)}
                    sx={{
                        cursor: "pointer",
                    }}
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
                        mt={0.5}
                    >
                        Your Folder
                    </Typography>

                </Box>

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
                            {new Date(folder.createdAt).toLocaleDateString()}
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

                    {folder.favorite && (

                        <Chip
                            icon={<StarIcon />}
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

export default FolderCard;