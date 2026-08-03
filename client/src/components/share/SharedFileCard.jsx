import {

    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Button,

} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkOffIcon from "@mui/icons-material/LinkOff";

import {

    getFileIcon,
    getFileTypeLabel,
    formatFileSize,

} from "../../utils/fileHelpers";

import { copyShareLink } from "../../services/shareService";

function SharedFileCard({ file, onDisable }) {

    const FileIcon = getFileIcon(file.mimeType);

    return (

        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
            }}
        >

            <CardContent>

                <Stack
                    spacing={2}
                >

                    <FileIcon
                        color="primary"
                        sx={{
                            fontSize: 50,
                        }}
                    />

                    <Typography
                        variant="h6"
                    >
                        {file.originalName}
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        {getFileTypeLabel(file.mimeType)}
                    </Typography>

                    <Typography>

                        {formatFileSize(file.size)}

                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                    >

                        <Chip
                            label="Public"
                            color="success"
                        />

                        <Chip
                            label={
                                file.sharePassword
                                    ? "Password"
                                    : "No Password"
                            }
                        />

                    </Stack>

                    <Typography
                        variant="body2"
                    >

                        Expires:

                        {" "}

                        {

                            file.shareExpiry

                                ? new Date(
                                    file.shareExpiry
                                ).toLocaleDateString()

                                : "Never"

                        }

                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                    >

                        <Button
                            variant="outlined"
                            startIcon={<ContentCopyIcon />}
                            onClick={() => {

                                copyShareLink(file.shareToken);

                                alert("Share link copied!");

                            }}
                        >
                            Copy Link
                        </Button>

                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<LinkOffIcon />}
                            onClick={() => onDisable(file)}
                        >
                            Disable
                        </Button>

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default SharedFileCard;