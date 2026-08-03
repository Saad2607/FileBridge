import FolderIcon from "@mui/icons-material/Folder";

import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
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
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                transition: "all .25s ease",
                cursor: "pointer",
                overflow: "hidden",

                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,.12)",
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        width: "100%",
                    }}
                >
                    <Box

                        sx={{
                            cursor: "pointer", 
                            display: "flex",
                            gap: 2,
                            flex: 1,
                            minWidth: 0,
                        }}
                        onClick={() => onOpen(folder)}
                    >
                        <FolderIcon
                            sx={{
                                fontSize: 55,
                                color: "#1976d2",
                            }}
                        />

                        <Box flex={1}>
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
                                sx={{ mt: 0.5 }}
                            >
                                Created{" "}
                                {new Date(
                                    folder.createdAt
                                ).toLocaleDateString()}
                            </Typography>

                            {folder.favorite && (
                                <Chip
                                    label="Favorite"
                                    color="warning"
                                    size="small"
                                    sx={{ mt: 2 }}
                                />
                            )}
                        </Box>
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
                </Box>
            </CardContent>
        </Card>
    );
}

export default FolderCard;