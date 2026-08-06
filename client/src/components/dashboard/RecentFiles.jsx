import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Divider,
    Chip,
    Button,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArchiveIcon from "@mui/icons-material/Archive";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function RecentFiles({ files }) {

    const formatFileSize = (bytes) => {

        if (!bytes) return "0 B";

        const sizes = ["B", "KB", "MB", "GB"];

        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        return (
            (bytes / Math.pow(1024, i)).toFixed(1) +
            " " +
            sizes[i]
        );

    };

    const getIcon = (name) => {

        const ext = name.split(".").pop().toLowerCase();

        switch (ext) {

            case "pdf":
                return <PictureAsPdfIcon color="error" />;

            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "webp":
                return <ImageIcon color="success" />;

            case "zip":
            case "rar":
                return <ArchiveIcon color="warning" />;

            default:
                return <DescriptionIcon color="primary" />;

        }

    };

    const getExtension = (name) => {

        if (!name.includes(".")) return "FILE";

        return name
            .split(".")
            .pop()
            .toUpperCase();

    };

    return (

        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                overflow: "hidden",
                bgcolor: "#fff",
            }}
        >

            <CardContent sx={{ p: 3 }}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Recent Files
                    </Typography>

                    <Button
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        View All
                    </Button>

                </Box>

                {

                    files.length === 0 ? (

                        <Box
                            textAlign="center"
                            py={7}
                        >

                            <InsertDriveFileIcon
                                sx={{
                                    fontSize: 70,
                                    color: "#CFD8DC",
                                }}
                            />

                            <Typography
                                mt={2}
                                fontWeight={600}
                            >
                                No Recent Files
                            </Typography>

                            <Typography
                                color="text.secondary"
                                mt={1}
                            >
                                Uploaded files will appear here.
                            </Typography>

                        </Box>

                    ) : (

                        files.map((file, index) => (

                            <Box key={file._id}>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{
                                        px: 2,
                                        py: 2,
                                        borderRadius: 3,
                                        transition: ".25s",

                                        "&:hover": {
                                            bgcolor: "#F8FAFC",
                                            transform: "translateX(6px)",
                                        },
                                    }}
                                >

                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={2}
                                    >

                                        <Avatar
                                            sx={{
                                                bgcolor: "#EEF4FF",
                                                width: 48,
                                                height: 48,
                                            }}
                                        >
                                            {getIcon(file.originalName)}
                                        </Avatar>

                                        <Box>

                                            <Typography
                                                fontWeight={600}
                                            >
                                                {file.originalName}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {new Date(
                                                    file.createdAt
                                                ).toLocaleDateString()}
                                            </Typography>

                                        </Box>

                                    </Box>

                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={2}
                                    >

                                        <Chip
                                            label={getExtension(file.originalName)}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />

                                        <Typography
                                            fontWeight={600}
                                            color="text.secondary"
                                            minWidth={70}
                                            textAlign="right"
                                        >
                                            {formatFileSize(file.size)}
                                        </Typography>

                                    </Box>

                                </Box>

                                {

                                    index !== files.length - 1 && (

                                        <Divider />

                                    )

                                }

                            </Box>

                        ))

                    )

                }

            </CardContent>

        </Card>

    );

}

export default RecentFiles;