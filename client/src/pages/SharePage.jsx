import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Button,
    TextField,
} from "@mui/material";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CloudOffIcon from "@mui/icons-material/CloudOff";

import ShareStatusCard from "../components/share/ShareStatusCard";

import { getFileIcon, getFileTypeLabel, formatFileSize } from "../utils/fileHelpers";

import { getShareInfo, downloadSharedFile } from "../services/shareService";

function SharePage() {

    const { token } = useParams();

    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [unlocked, setUnlocked] = useState(false);

    const [status, setStatus] = useState(null);

    useEffect(() => {
        loadShare();
    }, []);

    const loadShare = async () => {

        try {

            const data = await getShareInfo(token);

            setFile(data.file);

        } catch (error) {

            if (error.response?.status === 404) {

                setStatus("not-found");

            } else if (
                error.response?.status === 410
            ) {

                setStatus("expired");

            } else {

                setStatus("network");

            }

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={10}
            >
                <CircularProgress />
            </Box>

        );

    }

    if (status === "not-found") {

        return (
            <ShareStatusCard
                icon={
                    <ErrorOutlineIcon
                        color="error"
                        sx={{ fontSize: 80 }}
                    />
                }
                title="Shared File Not Found"
                description="This file may have been removed or the link is invalid."
            />
        );

    }

    if (status === "expired") {

        return (
            <ShareStatusCard
                icon={
                    <AccessTimeFilledIcon
                        color="warning"
                        sx={{ fontSize: 80 }}
                    />
                }
                title="Share Link Expired"
                description="Ask the owner to generate a new share link."
            />
        );

    }

    if (status === "network") {

        return (
            <ShareStatusCard
                icon={
                    <CloudOffIcon
                        color="disabled"
                        sx={{ fontSize: 80 }}
                    />
                }
                title="Connection Error"
                description="Unable to connect to the server."
            />
        );

    }

    const handleDownload = async () => {

        try {
            setError("");

            const response = await downloadSharedFile(token, password);

            const blob = new Blob([response.data]);

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = file.originalName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Incorrect Password.");
                return;
            }

            if (error.response?.status === 410) {
                setError("This share link has expired.");
                return;
            }

            if (error.response?.status === 404) {
                setError("Share file not found.");
                return
            }

            setError("Unable to download file.");
        }
    };

    const FileIcon = getFileIcon(file.mimeType);

    return (

        <Box
            display="flex"
            justifyContent="center"
            mt={8}
        >

            <Card
                sx={{
                    width: 500,
                    borderRadius: 3,
                    boxShadow: 5,
                }}
            >

                <CardContent>

                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >

                        <FileIcon
                            color="primary"
                            sx={{
                                fontSize: 80,
                            }}
                        />

                        <Typography
                            variant="h5"
                            mt={2}
                        >
                            {file.originalName}
                        </Typography>

                        <Typography
                            color="text.secondary"
                            mt={1}
                        >
                            {getFileTypeLabel(file.mimeType)}
                        </Typography>

                        <Typography
                            mt={1}
                        >
                            {formatFileSize(file.size)}
                        </Typography>

                        {
                            file.requiresPassword && (

                                <Box
                                    mt={3}
                                    width="100%"
                                >

                                    <Typography
                                        gutterBottom
                                    >
                                        🔒 Password Protected
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                    />

                                </Box>
                            )
                        }

                        <Box
                            mt={3}
                        >

                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleDownload}
                            >
                                Download
                            </Button>

                        </Box>

                        {
                            error && (

                                <Typography
                                    color="error"
                                    mt={2}
                                >
                                    {error}
                                </Typography>

                            )
                        }

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );

}

export default SharePage;