import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
} from "@mui/material";

import ActionMenu from "../common/ActionMenu";

import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";

function FileCard({ file, onDownload, onDelete }) {
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

                    <ActionMenu
                        items={[
                            {
                                label: "Download",
                                onClick: () => onDownload(file),
                            },
                            {
                                label: "Delete",
                                onClick: () => onDelete(file),
                            },
                        ]}
                    />

                </Box>

            </CardContent>
        </Card>
    );
}

export default FileCard;