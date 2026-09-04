import { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Typography,
    IconButton,
    Tooltip,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import toast from "react-hot-toast";
import { getFileText } from "../../services/fileService";

function TextPreview({ fileUrl, fileId, file }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("code"); // 'code' | 'preview'

    const extLower = file?.originalName ? file.originalName.split(".").pop().toLowerCase() : "";
    const isHtml = ["html", "htm"].includes(extLower);

    useEffect(() => {
        let active = true;
        const load = async () => {
            try {
                let text = "";
                if (fileId) {
                    text = await getFileText(fileId);
                } else if (fileUrl) {
                    const response = await fetch(fileUrl);
                    text = await response.text();
                }
                if (active) {
                    setContent(typeof text === "string" ? text : JSON.stringify(text, null, 2));
                }
            } catch {
                if (fileUrl) {
                    try {
                        const response = await fetch(fileUrl);
                        const text = await response.text();
                        if (active) {
                            setContent(typeof text === "string" ? text : JSON.stringify(text, null, 2));
                            return;
                        }
                    } catch {}
                }
                if (active) {
                    setContent("Unable to load preview.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [fileUrl, fileId]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        toast.success("Code copied to clipboard!");
    };

    if (loading) {
        return (
            <Box py={10} textAlign="center">
                <CircularProgress sx={{ color: "#4F46E5" }} />
            </Box>
        );
    }

    const lines = content.split("\n");

    return (
        <Box
            sx={{
                bgcolor: "#0F172A",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #1E293B",
                display: "flex",
                flexDirection: "column",
                minHeight: 380,
                maxHeight: "75vh",
            }}
        >
            {/* Toolbar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    bgcolor: "#090D16",
                    borderBottom: "1px solid #1E293B",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isHtml && (
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_, val) => val && setViewMode(val)}
                            size="small"
                            sx={{
                                height: 26,
                                bgcolor: "#1E293B",
                                borderRadius: "6px",
                                "& .MuiToggleButton-root": {
                                    px: 1,
                                    py: 0,
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    color: "#94A3B8",
                                    border: "none",
                                    "&.Mui-selected": {
                                        bgcolor: "#4F46E5",
                                        color: "#FFFFFF",
                                    },
                                },
                            }}
                        >
                            <ToggleButton value="code">
                                <CodeRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} /> Code
                            </ToggleButton>
                            <ToggleButton value="preview">
                                <VisibilityRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} /> Preview
                            </ToggleButton>
                        </ToggleButtonGroup>
                    )}
                    <Chip
                        label={`${lines.length} lines`}
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            bgcolor: "#1E293B",
                            color: "#94A3B8",
                        }}
                    />
                </Box>

                <Tooltip title="Copy all code">
                    <IconButton size="small" onClick={handleCopy} sx={{ color: "#94A3B8", "&:hover": { color: "#F8FAFC" } }}>
                        <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Content Area */}
            {isHtml && viewMode === "preview" ? (
                <Box sx={{ flex: 1, minHeight: 380, bgcolor: "#FFFFFF" }}>
                    <iframe
                        title="HTML Live Preview"
                        srcDoc={content}
                        sandbox="allow-scripts allow-modals"
                        style={{
                            width: "100%",
                            height: "100%",
                            minHeight: 380,
                            border: "none",
                            backgroundColor: "#FFFFFF",
                        }}
                    />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                        overflow: "auto",
                        bgcolor: "#020617",
                    }}
                >
                    {/* Line numbers gutter */}
                    <Box
                        sx={{
                            width: 48,
                            minWidth: 48,
                            py: 2,
                            px: 1,
                            bgcolor: "#0B1120",
                            color: "#475569",
                            textAlign: "right",
                            userSelect: "none",
                            fontFamily: "'Fira Code', Consolas, Monaco, monospace",
                            fontSize: "13px",
                            lineHeight: "22px",
                            borderRight: "1px solid #1E293B",
                            boxSizing: "border-box",
                        }}
                    >
                        {lines.map((_, i) => (
                            <div key={i} style={{ height: "22px", lineHeight: "22px" }}>
                                {i + 1}
                            </div>
                        ))}
                    </Box>

                    {/* Code block */}
                    <Box
                        component="pre"
                        sx={{
                            flex: 1,
                            m: 0,
                            py: 2,
                            px: 2,
                            color: "#F1F5F9",
                            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
                            fontSize: "13px",
                            lineHeight: "22px",
                            whiteSpace: "pre",
                            overflow: "auto",
                        }}
                    >
                        {content}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default TextPreview;