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
    ToggleButtonGroup,
    ToggleButton,
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
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VerticalSplitRoundedIcon from "@mui/icons-material/VerticalSplitRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
    const [viewMode, setViewMode] = useState("code"); // 'code' | 'split' | 'preview'
    const [templateAnchor, setTemplateAnchor] = useState(null);

    const textareaRef = useRef(null);
    const lineGutterRef = useRef(null);

    const extLower = file?.originalName ? file.originalName.split(".").pop().toLowerCase() : "";
    const isHtml = ["html", "htm"].includes(extLower);

    useEffect(() => {
        if (!open || !file) return;

        let active = true;
        setLoading(true);
        setViewMode("code");

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

    useEffect(() => {
        if (!loading) {
            requestAnimationFrame(() => {
                if (textareaRef.current) textareaRef.current.scrollTop = 0;
                if (lineGutterRef.current) lineGutterRef.current.scrollTop = 0;
            });
        }
    }, [loading, open]);

    // Synchronize gutter scroll with textarea scroll
    const handleScroll = (e) => {
        if (lineGutterRef.current && e?.target) {
            lineGutterRef.current.scrollTop = e.target.scrollTop;
        } else if (textareaRef.current && lineGutterRef.current) {
            lineGutterRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleFormatCode = () => {
        if (!content) return;
        // Clean up excessive blank lines (more than 2 consecutive newlines -> 1 newline)
        let cleaned = content.replace(/\n{3,}/g, "\n\n");
        // Trim trailing spaces on each line
        cleaned = cleaned.split("\n").map((line) => line.trimEnd()).join("\n");
        setContent(cleaned);
        toast.success("Code formatted & empty lines cleaned!");
    };

    const handleApplyTemplate = (type) => {
        let template = "";
        if (type === "html") {
            template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FileBridge Document</title>
</head>
<body>
    <h1>Hello from FileBridge!</h1>
    <p>This is a cloud-synced HTML document.</p>
</body>
</html>`;
        } else if (type === "json") {
            template = `{\n    "name": "FileBridge Document",\n    "version": "1.0.0",\n    "status": "active"\n}`;
        } else if (type === "js") {
            template = `// FileBridge JavaScript Module\nfunction main() {\n    console.log("Hello, FileBridge!");\n}\n\nmain();`;
        } else if (type === "css") {
            template = `/* FileBridge Stylesheet */\n* {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n}\n\nbody {\n    font-family: system-ui, sans-serif;\n    background-color: #0F172A;\n    color: #F8FAFC;\n}`;
        }
        setTemplateAnchor(null);
        setContent(template);
        toast.success(`Inserted ${type.toUpperCase()} template!`);
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
        gutterBg: darkMode ? "#0B1120" : "#F8FAFC",
        gutterColor: darkMode ? "#64748B" : "#94A3B8",
        gutterBorder: darkMode ? "#1E293B" : "#E2E8F0",
        editorBg: darkMode ? "#020617" : "#FFFFFF",
        textColor: darkMode ? "#F1F5F9" : "#0F172A",
        footerBg: darkMode ? "#0F172A" : "#FFFFFF",
        footerBorder: darkMode ? "#1E293B" : "#E2E8F0",
        previewBg: "#FFFFFF",
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: { xs: "92vh", sm: "88vh" },
                    maxHeight: "900px",
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

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    {/* View Mode Toggle (Code / Split / Preview) for HTML & web files */}
                    {isHtml && (
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_, val) => val && setViewMode(val)}
                            size="small"
                            sx={{
                                height: 28,
                                bgcolor: darkMode ? "#1E293B" : "#F1F5F9",
                                borderRadius: "8px",
                                mr: 1,
                                "& .MuiToggleButton-root": {
                                    px: 1.25,
                                    py: 0,
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    color: darkMode ? "#94A3B8" : "#64748B",
                                    border: "none",
                                    "&.Mui-selected": {
                                        bgcolor: darkMode ? "#0284C7" : "#4F46E5",
                                        color: "#FFFFFF",
                                        "&:hover": {
                                            bgcolor: darkMode ? "#0369A1" : "#4338CA",
                                        },
                                    },
                                },
                            }}
                        >
                            <ToggleButton value="code">
                                <CodeRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Code
                            </ToggleButton>
                            <ToggleButton value="split">
                                <VerticalSplitRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Split
                            </ToggleButton>
                            <ToggleButton value="preview">
                                <VisibilityRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Preview
                            </ToggleButton>
                        </ToggleButtonGroup>
                    )}

                    <Tooltip title="Format Code & Clean Blank Lines">
                        <IconButton
                            size="small"
                            onClick={handleFormatCode}
                            sx={{ color: darkMode ? "#38BDF8" : "#0284C7" }}
                        >
                            <AutoFixHighRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Insert Starter Template">
                        <IconButton
                            size="small"
                            onClick={(e) => setTemplateAnchor(e.currentTarget)}
                            sx={{ color: darkMode ? "#94A3B8" : "#64748B" }}
                        >
                            <PlaylistAddRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={templateAnchor}
                        open={Boolean(templateAnchor)}
                        onClose={() => setTemplateAnchor(null)}
                    >
                        <MenuItem onClick={() => handleApplyTemplate("html")} sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            HTML5 Boilerplate
                        </MenuItem>
                        <MenuItem onClick={() => handleApplyTemplate("js")} sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            JavaScript Module
                        </MenuItem>
                        <MenuItem onClick={() => handleApplyTemplate("css")} sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            CSS Stylesheet
                        </MenuItem>
                        <MenuItem onClick={() => handleApplyTemplate("json")} sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            JSON Template
                        </MenuItem>
                    </Menu>

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
                    flexDirection: "column",
                    flex: "1 1 auto",
                    minHeight: { xs: 450, sm: 520 },
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%" flex={1}>
                        <CircularProgress sx={{ color: "#38BDF8" }} />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            flex: 1,
                            minHeight: 0,
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                flexDirection: "row",
                                overflow: "hidden",
                            }}
                        >
                            {/* Editor Section (shown in 'code' or 'split' view) */}
                            {viewMode !== "preview" && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        flex: viewMode === "split" ? 1 : "1 1 100%",
                                        width: viewMode === "split" ? "50%" : "100%",
                                        height: "100%",
                                        minHeight: 0,
                                        borderRight: viewMode === "split" ? `1px solid ${theme.headerBorder}` : "none",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Line Numbers Gutter */}
                                    <Box
                                        ref={lineGutterRef}
                                        sx={{
                                            width: 56,
                                            minWidth: 56,
                                            height: "100%",
                                            minHeight: "100%",
                                            py: "16px",
                                            px: 1.25,
                                            bgcolor: theme.gutterBg,
                                            color: theme.gutterColor,
                                            textAlign: "right",
                                            userSelect: "none",
                                            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
                                            fontSize: "13.5px",
                                            lineHeight: "24px",
                                            overflowY: "hidden",
                                            overflowX: "hidden",
                                            flexShrink: 0,
                                            borderRight: `1px solid ${theme.gutterBorder}`,
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        {lines.map((_, i) => (
                                            <div key={i} style={{ height: "24px", lineHeight: "24px", overflow: "hidden" }}>
                                                {i + 1}
                                            </div>
                                        ))}
                                    </Box>

                                    {/* Text Area - Full Height & Instant Visibility */}
                                    <textarea
                                        ref={textareaRef}
                                        value={content}
                                        rows={Math.max(30, lines.length + 10)}
                                        onChange={(e) => setContent(e.target.value)}
                                        onScroll={handleScroll}
                                        onKeyDown={handleKeyDown}
                                        spellCheck={false}
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            minHeight: "100%",
                                            width: "100%",
                                            height: "100%",
                                            maxHeight: "100%",
                                            display: "block",
                                            border: "none",
                                            outline: "none",
                                            resize: "none",
                                            margin: 0,
                                            padding: "16px 18px",
                                            backgroundColor: "transparent",
                                            color: theme.textColor,
                                            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
                                            fontSize: "13.5px",
                                            lineHeight: "24px",
                                            whiteSpace: wordWrap ? "pre-wrap" : "pre",
                                            tabSize: 4,
                                            overflow: "auto",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </Box>
                            )}

                            {/* Live Webpage / HTML Preview Section (shown in 'split' or 'preview' view) */}
                            {isHtml && viewMode !== "code" && (
                                <Box
                                    sx={{
                                        flex: viewMode === "split" ? 1 : "1 1 100%",
                                        width: viewMode === "split" ? "50%" : "100%",
                                        height: "100%",
                                        minHeight: 0,
                                        bgcolor: theme.previewBg,
                                        display: "flex",
                                        flexDirection: "column",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            py: 0.75,
                                            px: 2,
                                            bgcolor: darkMode ? "#1E293B" : "#F1F5F9",
                                            borderBottom: `1px solid ${theme.headerBorder}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography variant="caption" fontWeight={700} color={darkMode ? "#94A3B8" : "#475569"}>
                                            🌐 LIVE HTML BROWSER PREVIEW
                                        </Typography>
                                        <Chip label="Interactive" size="small" color="success" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }} />
                                    </Box>
                                    <iframe
                                        title="Live HTML Preview"
                                        srcDoc={content}
                                        sandbox="allow-scripts allow-modals"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            border: "none",
                                            backgroundColor: "#FFFFFF",
                                            flex: 1,
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
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

