import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Avatar,
    Typography,
    Chip,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const COLOR_PRESETS = [
    { name: "Indigo", hex: "#4F46E5" },
    { name: "Emerald", hex: "#10B981" },
    { name: "Amber", hex: "#F59E0B" },
    { name: "Rose", hex: "#EF4444" },
    { name: "Purple", hex: "#8B5CF6" },
    { name: "Cyan", hex: "#06B6D4" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Slate", hex: "#64748B" },
];

const SUGGESTED_TAGS = [
    { name: "Important", color: "#EF4444" },
    { name: "Work", color: "#4F46E5" },
    { name: "Personal", color: "#10B981" },
    { name: "Draft", color: "#F59E0B" },
    { name: "Review", color: "#8B5CF6" },
    { name: "Archive", color: "#64748B" },
];

function TagManagerDialog({
    open,
    file,
    isBatch = false,
    selectedCount = 1,
    onClose,
    onSave,
}) {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState("");
    const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].hex);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (file && Array.isArray(file.tags)) {
                setTags([...file.tags]);
            } else {
                setTags([]);
            }
            setNewTagName("");
            setSelectedColor(COLOR_PRESETS[0].hex);
        }
    }, [open, file]);

    const handleAddTag = (nameToAdd, colorToAdd) => {
        const trimmed = (nameToAdd || newTagName).trim();
        if (!trimmed) return;

        const color = colorToAdd || selectedColor;

        // Check if tag already exists (case-insensitive)
        if (tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
            return;
        }

        setTags([...tags, { name: trimmed, color }]);
        setNewTagName("");
    };

    const handleRemoveTag = (tagName) => {
        setTags(tags.filter((t) => t.name !== tagName));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await onSave(tags);
            onClose();
        } catch (err) {
            console.error("Failed to save tags:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: "16px", p: 1 },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "#EEF2FF", color: "#4F46E5", width: 40, height: 40, borderRadius: "10px" }}>
                        <LocalOfferRoundedIcon sx={{ fontSize: 22 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                            {isBatch ? `Tag ${selectedCount} Selected Files` : "Manage File Tags"}
                        </Typography>
                        {file && !isBatch && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {file.originalName}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 1.5, display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Active Tags */}
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
                        CURRENT TAGS ({tags.length})
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, minHeight: 36, p: 1, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px dashed #CBD5E1", alignItems: "center" }}>
                        {tags.length === 0 ? (
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic", pl: 0.5 }}>
                                No tags assigned yet
                            </Typography>
                        ) : (
                            tags.map((tag) => (
                                <Chip
                                    key={tag.name}
                                    label={tag.name}
                                    onDelete={() => handleRemoveTag(tag.name)}
                                    size="small"
                                    sx={{
                                        bgcolor: tag.color || "#4F46E5",
                                        color: "#FFFFFF",
                                        fontWeight: 700,
                                        fontSize: "0.75rem",
                                        "& .MuiChip-deleteIcon": {
                                            color: "rgba(255,255,255,0.7)",
                                            "&:hover": { color: "#FFFFFF" },
                                        },
                                    }}
                                />
                            ))
                        )}
                    </Box>
                </Box>

                {/* Add New Tag */}
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
                        ADD NEW TAG
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tag name (e.g. Work, Invoice)"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => handleAddTag()}
                            disabled={!newTagName.trim()}
                            startIcon={<AddRoundedIcon />}
                            sx={{ borderRadius: "8px", fontWeight: 700, textTransform: "none", minWidth: 90, height: 40 }}
                        >
                            Add
                        </Button>
                    </Box>

                    {/* Color Swatches */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mr: 0.5 }}>
                            Color:
                        </Typography>
                        {COLOR_PRESETS.map((color) => (
                            <Tooltip key={color.hex} title={color.name} arrow>
                                <Box
                                    onClick={() => setSelectedColor(color.hex)}
                                    sx={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        bgcolor: color.hex,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "transform 0.15s ease",
                                        transform: selectedColor === color.hex ? "scale(1.2)" : "scale(1)",
                                        boxShadow: selectedColor === color.hex ? `0 0 0 2px #FFFFFF, 0 0 0 4px ${color.hex}` : "none",
                                    }}
                                >
                                    {selectedColor === color.hex && (
                                        <CheckRoundedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
                                    )}
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                </Box>

                {/* Suggested Quick Tags */}
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.75, display: "block" }}>
                        SUGGESTED TAGS
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
                        {SUGGESTED_TAGS.map((sug) => {
                            const isAdded = tags.some((t) => t.name.toLowerCase() === sug.name.toLowerCase());
                            return (
                                <Chip
                                    key={sug.name}
                                    label={`+ ${sug.name}`}
                                    size="small"
                                    onClick={() => !isAdded && handleAddTag(sug.name, sug.color)}
                                    disabled={isAdded}
                                    variant="outlined"
                                    sx={{
                                        fontSize: "0.7rem",
                                        fontWeight: 600,
                                        borderColor: sug.color,
                                        color: isAdded ? "#94A3B8" : sug.color,
                                        cursor: isAdded ? "default" : "pointer",
                                        "&:hover": {
                                            bgcolor: isAdded ? "transparent" : `${sug.color}15`,
                                        },
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
                <Button onClick={onClose} disabled={loading} sx={{ fontWeight: 600, color: "#64748B" }}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{ borderRadius: "8px", fontWeight: 700, px: 2.5 }}
                >
                    {loading ? "Saving..." : "Save Tags"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TagManagerDialog;
