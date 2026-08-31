import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    IconButton,
    Chip,
} from "@mui/material";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function WebDesktopBanner() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <>
            <Box
                sx={{
                    mb: 3.5,
                    p: 2,
                    px: 3,
                    borderRadius: 3.5,
                    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                    color: "#FFFFFF",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    boxShadow: "0 4px 20px rgba(15, 23, 42, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2.5,
                            bgcolor: "rgba(56, 189, 248, 0.15)",
                            color: "#38BDF8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <LaptopMacRoundedIcon sx={{ fontSize: 22 }} />
                    </Box>

                    <Box>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="#FFFFFF">
                                FileBridge Desktop Companion
                            </Typography>
                            <Chip
                                label="NEW"
                                size="small"
                                sx={{
                                    height: 18,
                                    fontSize: "0.65rem",
                                    fontWeight: 800,
                                    bgcolor: "#38BDF8",
                                    color: "#0F172A",
                                    borderRadius: "4px",
                                }}
                            />
                        </Box>
                        <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                            Auto-sync your local folders, access files offline, and manage files from the system tray.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => setDialogOpen(true)}
                        sx={{
                            bgcolor: "#38BDF8",
                            color: "#0F172A",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 2,
                            "&:hover": {
                                bgcolor: "#7DD3FC",
                            },
                        }}
                    >
                        Explore Desktop App
                    </Button>

                    <IconButton
                        size="small"
                        onClick={() => setDismissed(true)}
                        sx={{ color: "#94A3B8", "&:hover": { color: "#FFFFFF" } }}
                    >
                        <CloseRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Modal Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 4, overflow: "hidden" },
                }}
            >
                <DialogTitle
                    sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #E2E8F0",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                        <LaptopMacRoundedIcon color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                            FileBridge for Windows
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setDialogOpen(false)}>
                        <CloseRoundedIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3, bgcolor: "#F8FAFC" }}>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Install the FileBridge Electron companion to unlock bi-directional background synchronization directly with your local PC folders.
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#FFFFFF", height: "100%", border: "1px solid #E2E8F0" }}>
                                <SyncRoundedIcon sx={{ color: "#10B981", fontSize: 30, mb: 1 }} />
                                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                                    Live Folder Watcher
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Files saved to your local <code style={{ color: "#0F172A", background: "#F1F5F9", padding: "2px 4px", borderRadius: "4px" }}>~/FileBridge</code> directory upload automatically in the background.
                                </Typography>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#FFFFFF", height: "100%", border: "1px solid #E2E8F0" }}>
                                <SpeedRoundedIcon sx={{ color: "#38BDF8", fontSize: 30, mb: 1 }} />
                                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                                    Native Speed & OS Bridge
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Native OS file dialogs, frameless titlebar controls, and Windows Explorer shortcuts.
                                </Typography>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#FFFFFF", height: "100%", border: "1px solid #E2E8F0" }}>
                                <NotificationsActiveRoundedIcon sx={{ color: "#F59E0B", fontSize: 30, mb: 1 }} />
                                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                                    System Tray Control
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Quickly pause or resume sync and inspect sync progress right from the taskbar tray.
                                </Typography>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#FFFFFF", height: "100%", border: "1px solid #E2E8F0" }}>
                                <LaptopMacRoundedIcon sx={{ color: "#8B5CF6", fontSize: 30, mb: 1 }} />
                                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                                    Single-Sign On
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Log in once and your authentication session automatically mirrors to the desktop companion.
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 2.5, px: 3, justifyContent: "space-between", bgcolor: "#FFFFFF" }}>
                    <Typography variant="caption" color="text.secondary">
                        Run <code style={{ fontWeight: 700, color: "#1976D2" }}>cd desktop &amp;&amp; npm start</code> to launch
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => setDialogOpen(false)}
                        sx={{ borderRadius: 2.5, fontWeight: 700 }}
                    >
                        Got It
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default WebDesktopBanner;
