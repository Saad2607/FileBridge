import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { Card, CardContent, Typography, Box, Button } from "@mui/material";

function RecycleFileCard({ file, onRestore, onDeleteForever }) {
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
                    <InsertDriveFileIcon color="primary" />

                    <Box flex={1}>

                        <Typography variant="h6">
                            {file.originalName}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Deleted:
                            {" "}
                            {new Date(file.deletedAt).toLocaleString()}
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

                        onClick={() => onRestore(file)}
                    >
                        Restore
                    </Button>

                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={
                            <DeleteForeverIcon />
                        }
                        onClick={() => onDeleteForever(file)}
                    >
                        Delete Forever
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default RecycleFileCard;