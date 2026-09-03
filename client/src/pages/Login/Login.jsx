import { useContext, useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    CircularProgress,
    Avatar,
    Paper,
    Grid,
    Link as MuiLink,
    Tooltip,
} from "@mui/material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

import { login } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { saveToken, saveUser, getToken } from "../../utils/storage";
import { ROUTES } from "../../constants/routes";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { token, setToken, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Prevent authenticated users from visiting the login page
    useEffect(() => {
        if (token || getToken()) {
            navigate(ROUTES.DASHBOARD, { replace: true });
        }
    }, [token, navigate]);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (!username.trim() || !password) {
            toast.error("Please enter both username and password.");
            return;
        }

        try {
            setLoading(true);
            const data = await login(username.trim(), password);

            saveToken(data.token);
            saveUser(data.user);

            setToken(data.token);
            setUser(data.user);

            toast.success(`Welcome back, ${data.user.name || data.user.username}!`);
            navigate(ROUTES.DASHBOARD, { replace: true });
        } catch (error) {
            const message = error.response?.data?.message || "Invalid credentials. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #090D16 0%, #0F172A 50%, #090D16 100%)",
                p: { xs: 2, sm: 4, md: 6 },
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient Background Glows */}
            <Box
                sx={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, rgba(79,70,229,0) 70%)",
                    top: "-15%",
                    right: "-10%",
                    pointerEvents: "none",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(2,132,199,0.18) 0%, rgba(2,132,199,0) 70%)",
                    bottom: "-15%",
                    left: "-10%",
                    pointerEvents: "none",
                }}
            />

            <Grid
                container
                spacing={5}
                alignItems="center"
                justifyContent="center"
                sx={{ maxWidth: 1080, position: "relative", zIndex: 1 }}
            >
                {/* Left Side: Product Showcase (Hidden on Mobile) */}
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
                    <Box pr={2}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, mb: 2 }}>
                            <Avatar
                                src="/favicon.svg"
                                sx={{
                                    background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                                    width: 48,
                                    height: 48,
                                    boxShadow: "0 8px 24px rgba(79,70,229,0.45)",
                                    borderRadius: "14px",
                                }}
                            >
                                <CloudRoundedIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
                            </Avatar>
                            <Typography
                                variant="h4"
                                fontWeight={800}
                                letterSpacing="-0.03em"
                                sx={{ color: "#FFFFFF !important", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                            >
                                FileBridge
                            </Typography>
                        </Box>

                        <Typography
                            variant="h4"
                            fontWeight={800}
                            lineHeight={1.25}
                            letterSpacing="-0.02em"
                            mb={2}
                            sx={{ color: "#FFFFFF !important", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
                        >
                            Personal cloud &amp; desktop file management, perfected.
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ color: "#94A3B8 !important", mb: 4, lineHeight: 1.6, fontSize: "0.95rem" }}
                        >
                            Store, synchronize, share, and preview all your digital assets seamlessly across web browsers and your desktop environment.
                        </Typography>

                        {/* Feature Highlights */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(56, 189, 248, 0.15)", color: "#38BDF8", width: 40, height: 40, borderRadius: "10px" }}>
                                    <SyncRoundedIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#FFFFFF !important" }}>
                                        Desktop Folder Watcher
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#94A3B8 !important" }}>
                                        Sync local folders automatically with real-time background file monitoring.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.15)", color: "#10B981", width: 40, height: 40, borderRadius: "10px" }}>
                                    <VisibilityRoundedIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#FFFFFF !important" }}>
                                        Universal Media Preview
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#94A3B8 !important" }}>
                                        Preview images, stream video &amp; audio, inspect PDFs, and view code files.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(139, 92, 246, 0.15)", color: "#8B5CF6", width: 40, height: 40, borderRadius: "10px" }}>
                                    <SecurityRoundedIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#FFFFFF !important" }}>
                                        Secure Link Sharing
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#94A3B8 !important" }}>
                                        Generate UUID download links with optional passwords and expiration timers.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Side: Login Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 420,
                            mx: "auto",
                            borderRadius: "18px",
                            bgcolor: "#FFFFFF",
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            overflow: "hidden",
                        }}
                    >
                        {/* Top Gradient Bar */}
                        <Box
                            sx={{
                                height: 4,
                                background: "linear-gradient(90deg, #4F46E5 0%, #0284C7 100%)",
                            }}
                        />

                        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                                <Avatar
                                    src="/favicon.svg"
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                                        boxShadow: "0 6px 18px rgba(79,70,229,0.35)",
                                        mb: 1.25,
                                        borderRadius: "12px",
                                    }}
                                >
                                    <CloudRoundedIcon sx={{ fontSize: 26, color: "#FFFFFF" }} />
                                </Avatar>

                                <Typography variant="h6" fontWeight={800} color="#0F172A" letterSpacing="-0.02em">
                                    Sign In to FileBridge
                                </Typography>

                                <Typography variant="caption" color="text.secondary" mt={0.25}>
                                    Enter your credentials to access your cloud files
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handleLogin} noValidate>
                                <Box mb={2}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary" mb={0.5} display="block" fontSize="0.72rem">
                                        USERNAME OR EMAIL
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Enter your username or email"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={loading}
                                        autoFocus
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonOutlineRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                <Box mb={3.5}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary" mb={0.5} display="block" fontSize="0.72rem">
                                        PASSWORD
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px",
                                                bgcolor: "#F8FAFC",
                                                "& fieldset": { borderColor: "#E2E8F0" },
                                                "&:hover fieldset": { borderColor: "#CBD5E1" },
                                                "&.Mui-focused fieldset": { borderColor: "#4F46E5" },
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
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            size="small"
                                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                                            sx={{ color: "#64748B", "&:hover": { color: "#4F46E5" } }}
                                                        >
                                                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={loading || !username.trim() || !password}
                                    endIcon={!loading && <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                                    sx={{
                                        py: 1.3,
                                        mt: 0.5,
                                        borderRadius: "10px",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                                        boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #4338CA 0%, #0369A1 100%)",
                                            boxShadow: "0 6px 18px rgba(79, 70, 229, 0.4)",
                                        },
                                    }}
                                >
                                    {loading ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
                                </Button>
                            </Box>

                            {/* Create Account Link */}
                            <Box textAlign="center" mt={2.5}>
                                <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                                    Don't have an account?{" "}
                                    <MuiLink
                                        component={Link}
                                        to={ROUTES.REGISTER}
                                        sx={{
                                            color: "#4F46E5",
                                            fontWeight: 700,
                                            textDecoration: "none",
                                            "&:hover": { textDecoration: "underline" },
                                        }}
                                    >
                                        Create Account
                                    </MuiLink>
                                </Typography>
                            </Box>

                            <Paper
                                elevation={0}
                                sx={{
                                    mt: 2.5,
                                    p: 1.25,
                                    borderRadius: "8px",
                                    bgcolor: "#F8FAFC",
                                    border: "1px solid #E2E8F0",
                                    textAlign: "center",
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                    Secure cloud storage • <strong>FileBridge</strong> v2.0
                                </Typography>
                            </Paper>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Login;
