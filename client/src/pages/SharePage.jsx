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
    Avatar,
    Chip,
    InputAdornment,
    IconButton,
    Tooltip,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import toast from "react-hot-toast";

import ShareStatusCard from "../components/share/ShareStatusCard";
import { getFileIcon, getFileTypeLabel, formatFileSize } from "../utils/fileHelpers";
import { getShareInfo, downloadSharedFile } from "../services/shareService";

function SharePage() {
    const { token } = useParams();

    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        loadShare();
    }, [token]);

    const loadShare = async () => {
        try {
            setLoading(true);
            const data = await getShareInfo(token);
            setFile(data.file);
        } catch (err) {
            if (err.response?.status === 404) {
                setStatus("not-found");
            } else if (err.response?.status === 410) {
                setStatus("expired");
            } else {
                setStatus("network");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setError("");
            setDownloading(true);
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

            toast.success(`Downloaded "${file.originalName}"`);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Incorrect password.");
                toast.error("Incorrect password.");
                return;
            }
            if (err.response?.status === 410) {
                setError("This share link has expired.");
                toast.error("This share link has expired.");
                return;
            }
            if (err.response?.status === 404) {
                setError("Shared file not found.");
                toast.error("Shared file not found.");
                return;
            }
            setError("Unable to download file.");
            toast.error("Unable to download file.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #090D16 0%, #0F172A 100%)",
                }}
            >
                <CircularProgress sx={{ color: "#6366F1" }} />
            </Box>
        );
    }

    if (status === "not-found") {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#090D16",
                    p: 3,
                }}
            >
                <ShareStatusCard
                    icon={<ErrorOutlineIcon color="error" sx={{ fontSize: 72 }} />}
                    title="Shared File Not Found"
                    description="This file may have been removed or the link is invalid."
                />
            </Box>
        );
    }

    if (status === "expired") {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#090D16",
                    p: 3,
                }}
            >
                <ShareStatusCard
                    icon={<AccessTimeFilledIcon color="warning" sx={{ fontSize: 72 }} />}
                    title="Share Link Expired"
                    description="This link is no longer valid. Contact the owner for a new link."
                />
            </Box>
        );
    }

    if (status === "network") {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#090D16",
                    p: 3,
                }}
            >
                <ShareStatusCard
                    icon={<CloudOffIcon color="disabled" sx={{ fontSize: 72 }} />}
                    title="Connection Error"
                    description="Unable to connect to FileBridge server."
                />
            </Box>
        );
    }

    const FileIcon = getFileIcon(file?.mimeType);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #090D16 0%, #0F172A 50%, #090D16 100%)",
                p: { xs: 2, sm: 3 },
            }}
        >
            {/* Top Brand Banner */}
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, mb: 3.5 }}>
                <Avatar
                    src="/favicon.svg"
                    sx={{
                        background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                        width: 42,
                        height: 42,
                        borderRadius: "12px",
                        boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                    }}
                >
                    <CloudRoundedIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />
                </Avatar>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography
                        variant="h5"
                        fontWeight={800}
                        letterSpacing="-0.02em"
                        sx={{ color: "#FFFFFF !important", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
                    >
                        FileBridge
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        fontWeight={500}
                        sx={{ color: "#94A3B8 !important" }}
                    >
                        Share
                    </Typography>
                </Box>
            </Box>

            <Card
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    borderRadius: "18px",
                    bgcolor: "#FFFFFF",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        height: 4,
                        background: "linear-gradient(90deg, #4F46E5 0%, #0284C7 100%)",
                    }}
                />

                <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <Avatar
                            sx={{
                                bgcolor: "#EEF2FF",
                                color: "#4F46E5",
                                width: 72,
                                height: 72,
                                mb: 2,
                                borderRadius: "16px",
                            }}
                        >
                            <FileIcon sx={{ fontSize: 38 }} />
                        </Avatar>

                        <Typography variant="h6" fontWeight={800} color="#0F172A" mb={0.5} sx={{ wordBreak: "break-word" }}>
                            {file.originalName}
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 3, flexWrap: "wrap", justifyContent: "center" }}>
                            <Chip label={getFileTypeLabel(file.mimeType)} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                            <Chip label={formatFileSize(file.size)} size="small" color="primary" sx={{ fontWeight: 700 }} />
                            {file.burnAfterDownload && (
                                <Chip
                                    label="🔥 Burn on Download"
                                    size="small"
                                    color="error"
                                    sx={{ fontWeight: 700, bgcolor: "#FFE4E6", color: "#E11D48", border: "1px solid #FECDD3" }}
                                />
                            )}
                        </Box>

                        {file.burnAfterDownload && (
                            <Box
                                sx={{
                                    width: "100%",
                                    p: 1.25,
                                    mb: 2.5,
                                    borderRadius: "8px",
                                    bgcolor: "#FFF1F2",
                                    border: "1px solid #FECDD3",
                                    textAlign: "center",
                                }}
                            >
                                <Typography variant="caption" color="#9F1239" fontWeight={700}>
                                    ⚠️ Single-Use Link: This file will automatically self-destruct once downloaded.
                                </Typography>
                            </Box>
                        )}

                        {file.requiresPassword && (
                            <Box width="100%" sx={{ mb: 2.75 }} textAlign="left">
                                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={0.75} fontSize="0.75rem" letterSpacing="0.04em">
                                    PASSWORD REQUIRED
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter access password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={Boolean(error)}
                                    helperText={error}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "10px",
                                            bgcolor: "#F8FAFC",
                                            "& fieldset": {
                                                borderColor: "#E2E8F0",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#CBD5E1",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#4F46E5",
                                            },
                                        },
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title={showPassword ? "Hide password" : "Show password"} arrow placement="top">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                                            sx={{ color: "#4F46E5", p: 0.75 }}
                                                        >
                                                            {showPassword ? <VisibilityOff sx={{ fontSize: 19 }} /> : <Visibility sx={{ fontSize: 19 }} />}
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title={showPassword ? "Hide password" : "Show password"} arrow placement="top">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                        sx={{ color: "#4F46E5", p: 0.75 }}
                                                    >
                                                        {showPassword ? <VisibilityOff sx={{ fontSize: 19 }} /> : <Visibility sx={{ fontSize: 19 }} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={!downloading && <DownloadRoundedIcon />}
                            onClick={handleDownload}
                            disabled={downloading || (file.requiresPassword && !password.trim())}
                            sx={{
                                py: 1.3,
                                mt: 0.5,
                                borderRadius: "12px",
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #4338CA 0%, #0369A1 100%)",
                                    boxShadow: "0 6px 18px rgba(79, 70, 229, 0.4)",
                                },
                            }}
                        >
                            {downloading ? <CircularProgress size={22} color="inherit" /> : "Download File"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="caption" sx={{ color: "#94A3B8", mt: 3, fontSize: "0.75rem" }}>
                Shared via <strong style={{ color: "#FFFFFF" }}>FileBridge</strong> Secure Cloud
            </Typography>
        </Box>
    );
}

export default SharePage;