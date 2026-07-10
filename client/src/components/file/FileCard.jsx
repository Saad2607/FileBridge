import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";

function FileCard({ file, onDownload }) {
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
                    </Box>

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                    >
                        Download
                    </Button>

                </Box>

            </CardContent>
        </Card>
    );
}

export default FileCard;