import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    InputAdornment,
    IconButton,
    Divider,
    Typography,
    Box,
    Avatar,
    Tooltip,
} from "@mui/material";

import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import toast from "react-hot-toast";

function ShareDialog({
    open,
    link,
    onClose,
    onGenerate,
    onDisable,
}) {
    const [expiry, setExpiry] = useState("never");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!open) {
            setExpiry("never");
            setPassword("");
            setShowPassword(false);
            setCopied(false);
        }
    }, [open]);

    const handleCopy = async () => {
        if (!link) return;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            toast.error("Failed to copy link.");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: "16px", p: 1 },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "#EEF2FF", color: "#4F46E5", width: 40, height: 40, borderRadius: "10px" }}>
                        <ShareRoundedIcon sx={{ fontSize: 22 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                            Share File Link
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Create public access with optional passwords and limits
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 1, pb: 1 }}>
                <Stack spacing={2.25} sx={{ mt: 0.75 }}>
                    <Box>
                        <Box display="flex" alignItems="center" gap={0.75} mb={0.75}>
                            <AccessTimeRoundedIcon sx={{ fontSize: 16, color: "#4F46E5" }} />
                            <Typography variant="caption" fontWeight={700} color="#1E293B" fontSize="0.82rem">
                                Link Expiry
                            </Typography>
                        </Box>
                        <FormControl fullWidth size="small">
                            <Select
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                sx={{
                                    borderRadius: "10px",
                                    bgcolor: "#F8FAFC",
                                    fontSize: "0.88rem",
                                    fontWeight: 500,
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#E2E8F0",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#CBD5E1",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#4F46E5",
                                    },
                                }}
                            >
                                <MenuItem value="never">Never (Persistent)</MenuItem>
                                <MenuItem value="1h">1 Hour</MenuItem>
                                <MenuItem value="24h">24 Hours</MenuItem>
                                <MenuItem value="7d">7 Days</MenuItem>
                                <MenuItem value="30d">30 Days</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box>
                        <Box display="flex" alignItems="center" gap={0.75} mb={0.75}>
                            <LockOutlinedIcon sx={{ fontSize: 16, color: "#64748B" }} />
                            <Typography variant="caption" fontWeight={700} color="#1E293B" fontSize="0.82rem">
                                Password Protection (Optional)
                            </Typography>
                        </Box>
                        <TextField
                            size="small"
                            type={showPassword ? "text" : "password"}
                            placeholder="Leave empty for public access"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            InputProps={{
                                endAdornment: password ? (
                                    <InputAdornment position="end">
                                        <Tooltip title={showPassword ? "Hide password" : "Show password"} arrow placement="top">
                                            <IconButton
                                                size="small"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                sx={{ color: "#64748B", "&:hover": { color: "#4F46E5" } }}
                                            >
                                                {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ) : null,
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                    bgcolor: "#F8FAFC",
                                    fontSize: "0.88rem",
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
                        />
                    </Box>

                    <Button
                        variant="contained"
                        onClick={() => onGenerate(expiry, password)}
                        sx={{
                            borderRadius: "10px",
                            fontWeight: 700,
                            py: 1.1,
                            background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #4338CA 0%, #0369A1 100%)",
                                boxShadow: "0 6px 16px rgba(79, 70, 229, 0.35)",
                            },
                        }}
                    >
                        Generate / Update Link
                    </Button>

                    {link && (
                        <>
                            <Divider sx={{ my: 0.5 }} />

                            <Box>
                                <Typography variant="caption" fontWeight={700} color="text.secondary" mb={0.5} display="block" fontSize="0.72rem">
                                    PUBLIC SHARE URL
                                </Typography>

                                <TextField
                                    fullWidth
                                    size="small"
                                    value={link}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleCopy} size="small" color={copied ? "success" : "default"}>
                                                    {copied ? <CheckRoundedIcon sx={{ fontSize: 18 }} /> : <ContentCopyRoundedIcon sx={{ fontSize: 18 }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1, justifyContent: "space-between" }}>
                <Button
                    color="error"
                    disabled={!link}
                    startIcon={<LinkOffRoundedIcon />}
                    onClick={onDisable}
                    sx={{ fontWeight: 600 }}
                >
                    Disable Link
                </Button>

                <Button onClick={onClose} sx={{ fontWeight: 600, color: "#64748B" }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShareDialog;