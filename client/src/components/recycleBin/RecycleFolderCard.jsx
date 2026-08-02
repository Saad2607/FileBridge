import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FolderIcon from "@mui/icons-material/Folder";

import { Card, CardContent, Typography, Box, Button } from "@mui/material";

function RecycleFolderCard({ folder, onRestore, onDeleteForever }) {
    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 2,
            }}
        >

            <CardContent>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >
                    <FolderIcon color="primary" />

                    <Box flex={1}>

                        <Typography variant="h6">
                            {folder.name}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Deleted:
                            {" "}
                            {new Date(folder.deletedAt).toLocaleString()}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    mt={2}
                    display="flex"
                    gap={1}
                >
                    <Button
                        variant="contained"
                        startIcon={
                            <RestoreFromTrashIcon />
                        }

                        onClick={() => onRestore(folder)}
                    >
                        Restore
                    </Button>

                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={
                            <DeleteForeverIcon />
                        }
                        onClick={() => onDeleteForever(folder)}
                    >
                        Delete Forever
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default RecycleFolderCard;