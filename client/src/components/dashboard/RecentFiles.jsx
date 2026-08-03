import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Divider,
    Chip,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArchiveIcon from "@mui/icons-material/Archive";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function RecentFiles({ files }) {

    const formatFileSize = (bytes) => {

        if (!bytes) return "0 Bytes";

        const sizes = [
            "Bytes",
            "KB",
            "MB",
            "GB",
        ];

        const i = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, i)).toFixed(1) +
            " " +
            sizes[i]
        );

    };

    const getIcon = (name) => {

        const ext =
            name.split(".").pop().toLowerCase();

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

    return (

        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                overflow: "hidden",
                transition: "all .25s ease",

                "&:hover": {
                    boxShadow:
                        "0 12px 30px rgba(0,0,0,.12)",
                },
            }}
        >

            <Box
                sx={{
                    height: 5,
                    bgcolor: "#1976d2",
                }}
            />

            <CardContent
                sx={{
                    p: 3,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={3}
                >
                    Recent Files
                </Typography>

                {

                    files.length === 0 ? (

                        <Box
                            py={5}
                            textAlign="center"
                        >

                            <InsertDriveFileIcon
                                sx={{
                                    fontSize: 60,
                                    color: "#BDBDBD",
                                }}
                            />

                            <Typography
                                mt={2}
                                color="text.secondary"
                            >
                                No recent files
                            </Typography>

                        </Box>

                    ) : (

                        files.map((file, index) => (

                            <Box
                                key={file._id}
                            >

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                    sx={{
                                        py: 1.5,
                                        px: 1,
                                        borderRadius: 2,
                                        cursor: "pointer",

                                        transition:
                                            ".2s",

                                        "&:hover": {

                                            bgcolor:
                                                "#F8FAFC",

                                        },

                                    }}
                                >

                                    <Avatar
                                        sx={{
                                            bgcolor:
                                                "#EEF4FF",
                                        }}
                                    >
                                        {
                                            getIcon(
                                                file.originalName
                                            )
                                        }
                                    </Avatar>

                                    <Box
                                        flex={1}
                                    >

                                        <Typography
                                            fontWeight={600}
                                            noWrap
                                        >
                                            {
                                                file.originalName
                                            }
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {
                                                new Date(
                                                    file.createdAt
                                                ).toLocaleDateString()
                                            }
                                        </Typography>

                                    </Box>

                                    <Chip
                                        label={
                                            formatFileSize(
                                                file.size
                                            )
                                        }
                                        size="small"
                                        variant="outlined"
                                    />

                                </Box>

                                {

                                    index !==
                                        files.length - 1 && (
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