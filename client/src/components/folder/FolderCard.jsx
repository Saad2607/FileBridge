import FolderIcon from "@mui/icons-material/Folder";
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
} from "@mui/material";

function FolderCard({ folder, onOpen }) {
    return (
        <Card
            elevation={2}
            sx={{
                mb: 2,
                borderRadius: 2,
                transition: "0.2s",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 6,
                },
            }}
        >
            <CardActionArea
                onClick={() => onOpen(folder)}
            >
                <CardContent>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <FolderIcon
                            color="primary"
                            fontSize="large"
                        />

                        <Typography
                            variant="h6"
                        >
                            {folder.name}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default FolderCard;