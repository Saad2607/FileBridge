import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import ActionMenu from "../common/ActionMenu";

import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";

function FileCard({ file, onDownload, onDelete, onRename, onProperties, onFavorite, onShare }) {
    return (
        <Card
            elevation={2}
            sx={{
                mb: 2,
                borderRadius: 2,
            }}
        >
            <CardContent>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <DescriptionIcon
                            color="action"
                        />

                        <Typography>
                            {file.originalName}
                        </Typography>

                        {file.favorite && (
                            <FavoriteIcon
                                color="warning"
                                fontSize="small"
                            />
                        )}
                    </Box>

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
                                label: "Delete",
                                onClick: () => onDelete(file),
                            },
                            {
                                label: "Properties",
                                onClick: () => onProperties(file),
                            },
                            {
                                label: file.favorite ? "Remove Favorite" : "Add to Favorites",
                                onClick: () => onFavorite(file),
                            },
                            {
                                label: "Share",
                                onClick: () => onShare(file),
                            }
                        ]}
                    />

                </Box>

            </CardContent>
        </Card>
    );
}

export default FileCard;