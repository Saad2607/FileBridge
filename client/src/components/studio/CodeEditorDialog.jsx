import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Chip,
    Tooltip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import WrapTextRoundedIcon from "@mui/icons-material/WrapTextRounded";
import toast from "react-hot-toast";

import { getFileUrl } from "../../utils/fileHelpers";
import { updateFileContent, getFileText } from "../../services/fileService";

function CodeEditorDialog({ open, file, onClose, onFileSaved }) {
    const [content, setContent] = useState("");
    const [originalContent, setOriginalContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [wordWrap, setWordWrap] = useState(false);

    const textareaRef = useRef(null);
    const lineGutterRef = useRef(null);

    useEffect(() => {
        if (!open || !file) return;

        let active = true;
        setLoading(true);

        const sanitizeContent = (input) => {
            if (!input) return "";
            if (typeof input === "object" && input.success === false) return "";
            if (typeof input === "string") {
                if (input.trim().startsWith("{") && input.includes('"success":false')) {
                    try {
                        const parsed = JSON.parse(input);
                        if (parsed.success === false) return "";
                    } catch {}
                }
                return input;
            }
            return JSON.stringify(input, null, 2);
        };

        const fetchContent = async () => {
            try {
                let text = "";
                if (file._id || file.id) {
                    text = await getFileText(file._id || file.id);
                } else {
                    const url = getFileUrl(file);
                    const res = await fetch(url);
                    if (res.ok) {
                        text = await res.text();
                    }
                }

                if (active) {
                    const clean = sanitizeContent(text);
                    setContent(clean);
                    setOriginalContent(clean);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Primary fetch code error, trying fallback:", err);
                try {
                    const url = getFileUrl(file);
                    const res = await fetch(url);
                    if (res.ok) {
                        const rawText = await res.text();
                        if (active) {
                            const clean = sanitizeContent(rawText);
                            setContent(clean);
                            setOriginalContent(clean);
                            setLoading(false);
                            return;
                        }
                    }
                } catch (fallbackErr) {
                    console.error("All text fetch attempts failed:", fallbackErr);
                }
                if (active) {
                    setContent("");
                    setOriginalContent("");
                    setLoading(false);
                }
            }
        };

        fetchContent();

        return () => {
            active = false;
        };
    }, [open, file]);

    // Synchronize gutter scroll with textarea scroll
    const handleScroll = () => {
        if (textareaRef.current && lineGutterRef.current) {
            lineGutterRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleSave = async () => {
        if (!file) return;
        try {
            setSaving(true);
            await updateFileContent(file._id, content);
            setOriginalContent(content);
            toast.success(`Saved changes to "${file.originalName}"!`);
            if (onFileSaved) onFileSaved();
        } catch {
            toast.error("Failed to save file changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleKeyDown = (e) => {
        // Ctrl+S or Cmd+S to Save
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            handleSave();
            return;
        }

        // Tab key support
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const tabSpaces = "    "; // 4 spaces

            const newContent = content.substring(0, start) + tabSpaces + content.substring(end);
            setContent(newContent);

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + tabSpaces.length;
            }, 0);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        toast.success("Content copied to clipboard!");
    };

    const handleRevert = () => {
        setContent(originalContent);
        toast("Reverted unsaved changes", { icon: "↩️" });
    };

    const handleDownload = () => {
        if (!file) return;
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.originalName || "edited_file.txt";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success(`Downloaded ${file.originalName}`);
    };

    if (!file) return null;

    const lines = content.split("\n");
    const lineCount = lines.length;
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const charCount = content.length;
    const hasUnsavedChanges = content !== originalContent;
    const extension = file.originalName ? file.originalName.split(".").pop().toUpperCase() : "TXT";

    const theme = {
        headerBg: darkMode ? "#0F172A" : "#FFFFFF",
        headerBorder: darkMode ? "#1E293B" : "#E2E8F0",
        gutterBg: darkMode ? "#0B1120" : "#F1F5F9",
        gutterColor: darkMode ? "#475569" : "#94A3B8",
        gutterBorder: darkMode ? "#1E293B" : "#E2E8F0",
        editorBg: darkMode ? "#020617" : "#FFFFFF",
        textColor: darkMode ? "#F1F5F9" : "#0F172A",
        footerBg: darkMode ? "#0F172A" : "#FFFFFF",
        footerBorder: darkMode ? "#1E293B" : "#E2E8F0",
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: "88vh",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.25,
                    px: 2.5,
                    bgcolor: theme.headerBg,
                    color: theme.textColor,
                    borderBottom: `1px solid ${theme.headerBorder}`,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "8px",
                            bgcolor: darkMode ? "rgba(56, 189, 248, 0.15)" : "#EEF2FF",
                            color: darkMode ? "#38BDF8" : "#4F46E5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <CodeRoundedIcon sx={{ fontSize: 20 }} />
                    </Box>

                    <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={800} noWrap>
                            {file.originalName}
                        </Typography>
                        <Chip
                            label={extension}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                bgcolor: darkMode ? "#1E293B" : "#F1F5F9",
                                color: darkMode ? "#94A3B8" : "#475569",
                            }}
                        />
                        {hasUnsavedChanges && (
                            <Chip
                                label="Modified"
                                size="small"
                                color="warning"
                                sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700 }}
                            />
                        )}
                    </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Tooltip title={wordWrap ? "Disable Word Wrap" : "Enable Word Wrap"}>
                        <IconButton
                            size="small"
                            onClick={() => setWordWrap(!wordWrap)}
                            sx={{ color: wordWrap ? "#38BDF8" : darkMode ? "#94A3B8" : "#64748B" }}
                        >
                            <WrapTextRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Copy all content">
                        <IconButton
                            size="small"
                            onClick={handleCopy}
                            sx={{ color: darkMode ? "#94A3B8" : "#64748B" }}
                        >
                            <ContentCopyRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>

                    {hasUnsavedChanges && (
                        <Tooltip title="Revert Changes">
                            <IconButton
                                size="small"
                                onClick={handleRevert}
                                sx={{ color: darkMode ? "#FBBF24" : "#D97706" }}
                            >
                                <RestartAltRoundedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}>
                        <IconButton
                            size="small"
                            onClick={() => setDarkMode(!darkMode)}
                            sx={{ color: darkMode ? "#FBBF24" : "#64748B" }}
                        >
                            {darkMode ? <LightModeRoundedIcon sx={{ fontSize: 18 }} /> : <DarkModeRoundedIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                    </Tooltip>

                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{ color: darkMode ? "#94A3B8" : "#64748B" }}
                    >
                        <CloseRoundedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>
            </DialogTitle>

            {/* Code Editor Body */}
            <DialogContent
                sx={{
                    p: 0,
                    bgcolor: theme.editorBg,
                    display: "flex",
                    flex: 1,
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                        <CircularProgress sx={{ color: "#38BDF8" }} />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            position: "relative",
                        }}
                    >
                        {/* Line Numbers Gutter */}
                        <Box
                            ref={lineGutterRef}
                            sx={{
                                width: 56,
                                py: 2,
                                px: 1,
                                bgcolor: theme.gutterBg,
                                color: theme.gutterColor,
                                textAlign: "right",
                                userSelect: "none",
                                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
                                fontSize: "0.85rem",
                                lineHeight: "24px",
                                overflowY: "hidden",
                                flexShrink: 0,
                                borderRight: `1px solid ${theme.gutterBorder}`,
                                boxSizing: "border-box",
                            }}
                        >
                            {lines.map((_, i) => (
                                <div key={i} style={{ height: "24px", overflow: "hidden" }}>
                                    {i + 1}
                                </div>
                            ))}
                        </Box>

                        {/* Text Area */}
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onScroll={handleScroll}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            style={{
                                flex: 1,
                                width: "100%",
                                height: "100%",
                                border: "none",
                                outline: "none",
                                resize: "none",
                                padding: "16px 20px",
                                backgroundColor: "transparent",
                                color: theme.textColor,
                                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
                                fontSize: "0.85rem",
                                lineHeight: "24px",
                                whiteSpace: wordWrap ? "pre-wrap" : "pre",
                                tabSize: 4,
                                overflow: "auto",
                                boxSizing: "border-box",
                            }}
                        />
                    </Box>
                )}
            </DialogContent>

            {/* Footer */}
            <DialogActions
                sx={{
                    p: 1.25,
                    px: 2.5,
                    justifyContent: "space-between",
                    bgcolor: theme.footerBg,
                    borderTop: `1px solid ${theme.footerBorder}`,
                }}
            >
                {/* Statistics Bar */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, color: darkMode ? "#94A3B8" : "#64748B" }}>
                    <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
                        Lines: <strong>{lineCount}</strong>
                    </Typography>
                    <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
                        Words: <strong>{wordCount}</strong>
                    </Typography>
                    <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
                        Characters: <strong>{charCount}</strong>
                    </Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1.25 }}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadRoundedIcon />}
                        onClick={handleDownload}
                        sx={{
                            borderRadius: "8px",
                            fontWeight: 600,
                            textTransform: "none",
                            color: darkMode ? "#CBD5E1" : "#475569",
                            borderColor: darkMode ? "#334155" : "#CBD5E1",
                        }}
                    >
                        Download
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}
                        onClick={handleSave}
                        disabled={saving || !hasUnsavedChanges}
                        sx={{
                            borderRadius: "8px",
                            fontWeight: 700,
                            textTransform: "none",
                            background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                        }}
                    >
                        {saving ? "Saving..." : "Save (Ctrl+S)"}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default CodeEditorDialog;
