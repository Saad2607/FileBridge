import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    Button,
    CircularProgress,
    List,
    ListItem,
    Chip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import { getFileVersions, restoreFileVersion } from "../../services/fileService";
import { formatFileSize } from "../../utils/fileHelpers";

function VersionHistoryDrawer({
    file,
    onClose,
    onRestore,
}) {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [restoringId, setRestoringId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (file?._id) {
            fetchVersions();
        } else {
            setVersions([]);
            setSelectedVersion(null);
            setError(null);
        }
    }, [file?._id]);

    const fetchVersions = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getFileVersions(file._id);
            if (res.success) {
                const list = res.versions || [];
                setVersions(list);
                if (list.length > 0) {
                    setSelectedVersion(list[0]);
                }
            } else {
                setError("Unable to load version history.");
            }
        } catch (err) {
            console.error("Failed to load versions:", err);
            setError("Unable to load version history.");
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (version) => {
        try {
            setRestoringId(version._id);
            const res = await restoreFileVersion(file._id, version._id);
            if (res.success) {
                if (onRestore) {
                    onRestore(res.file?.textContent || version.textContent);
                }
                onClose();
            }
        } catch (err) {
            console.error("Failed to restore version:", err);
            setError("Failed to restore version.");
        } finally {
            setRestoringId(null);
        }
    };

    const formatDateSafe = (dateStr) => {
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return { relative: "Recently", full: "" };

            const now = new Date();
            const diffMs = now - d;
            const diffSecs = Math.floor(diffMs / 1000);
            const diffMins = Math.floor(diffSecs / 60);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            let relative = "Just now";
            if (diffSecs < 60) relative = "Just now";
            else if (diffMins < 60) relative = `${diffMins}m ago`;
            else if (diffHours < 24) relative = `${diffHours}h ago`;
            else if (diffDays < 7) relative = `${diffDays}d ago`;
            else relative = d.toLocaleDateString();

            const full = d.toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });

            return { relative, full };
        } catch (e) {
            return { relative: "Recently", full: "" };
        }
    };

    return (
        <Box
            sx={{
                width: { xs: "100%", md: 400 },
                minWidth: { xs: "100%", md: 400 },
                height: "100%",
                bgcolor: "#0F172A",
                color: "#F8FAFC",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                zIndex: 10,
                position: "relative",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    bgcolor: "#1E293B",
                    flexShrink: 0,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "8px",
                            bgcolor: "rgba(99, 102, 241, 0.15)",
                            color: "#818CF8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <HistoryRoundedIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight={800} color="#F8FAFC" noWrap>
                            Version History
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94A3B8", display: "block" }} noWrap>
                            {file?.originalName}
                        </Typography>
                    </Box>
                </Box>

                <IconButton size="small" onClick={onClose} sx={{ color: "#94A3B8", "&:hover": { color: "#F8FAFC" } }}>
                    <CloseRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Box>

            {/* Content Area */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {loading ? (
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                        <CircularProgress size={28} sx={{ color: "#6366F1" }} />
                        <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                            Loading revision timeline...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography color="error" variant="caption" sx={{ display: "block" }}>{error}</Typography>
                        <Button onClick={fetchVersions} size="small" sx={{ mt: 1, color: "#818CF8", fontSize: "0.75rem" }}>
                            Retry
                        </Button>
                    </Box>
                ) : versions.length === 0 ? (
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3, textAlign: "center" }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                bgcolor: "rgba(255,255,255,0.05)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1.5,
                                color: "#64748B",
                            }}
                        >
                            <HistoryRoundedIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography variant="subtitle2" fontWeight={700} color="#F1F5F9" fontSize="0.85rem">
                            No Previous Versions Yet
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94A3B8", mt: 0.5, maxWidth: 280, display: "block" }}>
                            When you make edits and save (Ctrl+S), a revision snapshot will be saved here.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        {/* Timeline List */}
                        <Box sx={{ maxHeight: "45%", overflowY: "auto", borderBottom: "1px solid rgba(255,255,255,0.1)", p: 1.25, flexShrink: 0 }}>
                            <Typography variant="caption" fontWeight={700} sx={{ color: "#64748B", px: 0.5, py: 0.25, display: "block", fontSize: "0.68rem" }}>
                                REVISION TIMELINE ({versions.length})
                            </Typography>
                            <List sx={{ p: 0, display: "flex", flexDirection: "column", gap: 0.75 }}>
                                {versions.map((ver) => {
                                    const isSelected = selectedVersion?._id === ver._id;
                                    const dateInfo = formatDateSafe(ver.savedAt);
                                    return (
                                        <ListItem
                                            key={ver._id}
                                            onClick={() => setSelectedVersion(ver)}
                                            sx={{
                                                borderRadius: "8px",
                                                bgcolor: isSelected ? "rgba(99, 102, 241, 0.2)" : "rgba(30, 41, 59, 0.6)",
                                                border: `1px solid ${isSelected ? "#6366F1" : "rgba(255,255,255,0.06)"}`,
                                                p: 1,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                transition: "all 0.15s ease",
                                                "&:hover": {
                                                    bgcolor: isSelected ? "rgba(99, 102, 241, 0.28)" : "rgba(51, 65, 85, 0.5)",
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
                                                <Chip
                                                    label={`v${ver.versionNumber}`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: isSelected ? "#6366F1" : "#334155",
                                                        color: "#FFFFFF",
                                                        fontWeight: 800,
                                                        fontSize: "0.68rem",
                                                        height: 20,
                                                    }}
                                                />
                                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                                    <Typography variant="caption" fontWeight={700} color="#F8FAFC" display="block" noWrap>
                                                        {dateInfo.relative}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "0.65rem", display: "block" }} noWrap>
                                                        {formatFileSize(ver.size || 0)} • {dateInfo.full}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Button
                                                variant={isSelected ? "contained" : "outlined"}
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestore(ver);
                                                }}
                                                disabled={restoringId === ver._id}
                                                startIcon={restoringId === ver._id ? <CircularProgress size={10} color="inherit" /> : <RestoreRoundedIcon sx={{ fontSize: 14 }} />}
                                                sx={{
                                                    fontSize: "0.68rem",
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    borderRadius: "6px",
                                                    py: 0.25,
                                                    px: 1,
                                                    minWidth: 65,
                                                    bgcolor: isSelected ? "#4F46E5" : "transparent",
                                                    borderColor: isSelected ? "#4F46E5" : "rgba(255,255,255,0.2)",
                                                    color: "#FFFFFF",
                                                    "&:hover": {
                                                        bgcolor: isSelected ? "#4338CA" : "rgba(255,255,255,0.1)",
                                                    },
                                                }}
                                            >
                                                {restoringId === ver._id ? "Restoring" : "Restore"}
                                            </Button>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Box>

                        {/* Preview Selected Version */}
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", p: 1.5 }}>
                            {selectedVersion ? (
                                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                            <CodeRoundedIcon sx={{ fontSize: 16, color: "#818CF8" }} />
                                            <Typography variant="caption" fontWeight={700} sx={{ color: "#CBD5E1", fontSize: "0.72rem" }}>
                                                PREVIEW (v{selectedVersion.versionNumber})
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.65rem" }}>
                                            {formatFileSize(selectedVersion.size || 0)}
                                        </Typography>
                                    </Box>

                                    <Box
                                        component="pre"
                                        sx={{
                                            flex: 1,
                                            overflow: "auto",
                                            bgcolor: "#020617",
                                            p: 1.5,
                                            borderRadius: "8px",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            fontFamily: "'Fira Code', Consolas, Monaco, monospace",
                                            fontSize: "0.75rem",
                                            color: "#38BDF8",
                                            whiteSpace: "pre",
                                            margin: 0,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {selectedVersion.textContent || "(Empty snapshot)"}
                                    </Box>
                                </Box>
                            ) : null}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default VersionHistoryDrawer;

