import { useState, useEffect, useRef, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Slider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Chip,
    IconButton,
    CircularProgress,
    Divider,
    Grid,
    Tooltip,
    ButtonGroup,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import FlipRoundedIcon from "@mui/icons-material/FlipRounded";
import toast from "react-hot-toast";

import { formatFileSize, getFileUrl } from "../../utils/fileHelpers";
import { uploadFile, getFileBlob } from "../../services/fileService";

function ImageStudioDialog({ open, file, onClose, onFileSaved }) {
    const [originalImg, setOriginalImg] = useState(null);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [format, setFormat] = useState("webp");
    const [quality, setQuality] = useState(85);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);

    const [previewUrl, setPreviewUrl] = useState("");
    const [transformedBlob, setTransformedBlob] = useState(null);
    const [transformedSize, setTransformedSize] = useState(0);
    const [loadingImage, setLoadingImage] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [saving, setSaving] = useState(false);

    const naturalRatioRef = useRef(1);
    const objectUrlRef = useRef(null);

    // Load original image cleanly via authenticated Blob to prevent any canvas tainting
    useEffect(() => {
        if (!open || !file) return;

        let active = true;
        setLoadingImage(true);
        setOriginalImg(null);

        const setupImg = (objectUrl) => {
            const img = new Image();
            img.onload = () => {
                if (!active) return;
                setOriginalImg(img);
                const nw = img.naturalWidth || img.width || 400;
                const nh = img.naturalHeight || img.height || 400;
                setOriginalDimensions({ width: nw, height: nh });
                naturalRatioRef.current = nw / nh;
                setWidth(nw);
                setHeight(nh);
                setFormat("webp");
                setQuality(85);
                setBrightness(100);
                setContrast(100);
                setRotation(0);
                setFlipH(false);
                setLoadingImage(false);
            };
            img.onerror = () => {
                if (!active) return;
                toast.error("Failed to decode image data.");
                setLoadingImage(false);
            };
            img.src = objectUrl;
        };

        const loadImage = async () => {
            try {
                let blob = null;
                if (file._id || file.id) {
                    blob = await getFileBlob(file._id || file.id);
                } else {
                    const srcUrl = getFileUrl(file);
                    const res = await fetch(srcUrl);
                    if (!res.ok) throw new Error("Could not fetch image");
                    blob = await res.blob();
                }

                const objectUrl = URL.createObjectURL(blob);
                objectUrlRef.current = objectUrl;
                setupImg(objectUrl);
            } catch (err) {
                console.error("Primary load failed, trying fallback:", err);
                try {
                    const srcUrl = getFileUrl(file);
                    const res = await fetch(srcUrl);
                    const blob = await res.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    objectUrlRef.current = objectUrl;
                    setupImg(objectUrl);
                } catch (fallbackErr) {
                    console.error("All image load attempts failed:", fallbackErr);
                    if (active) {
                        toast.error("Failed to load image for editing.");
                        setLoadingImage(false);
                    }
                }
            }
        };

        loadImage();

        return () => {
            active = false;
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, [open, file]);

    // Canvas Transformation pipeline
    const renderCanvas = useCallback(() => {
        if (!originalImg || !width || !height) return;

        setProcessing(true);

        const canvas = document.createElement("canvas");
        const isRotated90or270 = rotation === 90 || rotation === 270;
        const targetW = isRotated90or270 ? height : width;
        const targetH = isRotated90or270 ? width : height;

        canvas.width = Math.max(1, targetW);
        canvas.height = Math.max(1, targetH);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            setProcessing(false);
            return;
        }

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

        // Apply rotation & flip
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        if (flipH) ctx.scale(-1, 1);
        ctx.drawImage(originalImg, -width / 2, -height / 2, width, height);
        ctx.restore();

        const mime = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
        const q = format === "png" ? 1.0 : quality / 100;

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    // Fallback to dataURL if toBlob fails
                    try {
                        const dataUrl = canvas.toDataURL(mime, q);
                        setPreviewUrl(dataUrl);
                        // Approximate size from base64
                        const approxSize = Math.round((dataUrl.length - 22) * 0.75);
                        setTransformedSize(approxSize);
                    } catch (e) {
                        console.error("DataURL fallback error:", e);
                    }
                    setProcessing(false);
                    return;
                }

                setTransformedBlob(blob);
                setTransformedSize(blob.size);
                const url = URL.createObjectURL(blob);
                setPreviewUrl((prev) => {
                    if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                    return url;
                });
                setProcessing(false);
            },
            mime,
            q
        );
    }, [originalImg, width, height, format, quality, brightness, contrast, rotation, flipH]);

    useEffect(() => {
        renderCanvas();
    }, [renderCanvas]);

    const handleWidthChange = (val) => {
        const num = Math.max(1, parseInt(val, 10) || 1);
        setWidth(num);
        if (aspectRatioLocked && naturalRatioRef.current) {
            setHeight(Math.max(1, Math.round(num / naturalRatioRef.current)));
        }
    };

    const handleHeightChange = (val) => {
        const num = Math.max(1, parseInt(val, 10) || 1);
        setHeight(num);
        if (aspectRatioLocked && naturalRatioRef.current) {
            setWidth(Math.max(1, Math.round(num * naturalRatioRef.current)));
        }
    };

    const handleScalePreset = (factor) => {
        if (!originalDimensions.width || !originalDimensions.height) return;
        const newW = Math.max(1, Math.round(originalDimensions.width * factor));
        const newH = Math.max(1, Math.round(originalDimensions.height * factor));
        setWidth(newW);
        setHeight(newH);
    };

    const handleReset = () => {
        if (!originalDimensions.width) return;
        setWidth(originalDimensions.width);
        setHeight(originalDimensions.height);
        setQuality(85);
        setFormat("webp");
        setBrightness(100);
        setContrast(100);
        setRotation(0);
        setFlipH(false);
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleFlip = () => {
        setFlipH((prev) => !prev);
    };

    const handleDownload = () => {
        if (!file || !previewUrl) return;
        const ext = format === "jpeg" ? "jpg" : format;
        const baseName = file.originalName ? file.originalName.replace(/\.[^/.]+$/, "") : "image";
        const newName = `${baseName}-studio.${ext}`;

        const a = document.createElement("a");
        a.href = previewUrl;
        a.download = newName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success(`Downloaded ${newName}`);
    };

    const handleSaveToCloud = async () => {
        if (!file) return;
        try {
            setSaving(true);
            const ext = format === "jpeg" ? "jpg" : format;
            const baseName = file.originalName ? file.originalName.replace(/\.[^/.]+$/, "") : "image";
            const newName = `${baseName}-studio.${ext}`;
            const mime = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";

            let blobToUpload = transformedBlob;
            if (!blobToUpload && previewUrl) {
                const res = await fetch(previewUrl);
                blobToUpload = await res.blob();
            }

            if (!blobToUpload) {
                toast.error("Unable to prepare image file.");
                return;
            }

            const newFile = new File([blobToUpload], newName, { type: mime });
            await uploadFile(newFile, file.folder || null);
            toast.success(`Saved "${newName}" to cloud storage!`);
            if (onFileSaved) onFileSaved();
            onClose();
        } catch (err) {
            console.error("Save to cloud error:", err);
            toast.error("Failed to save converted image.");
        } finally {
            setSaving(false);
        }
    };

    if (!file) return null;

    const originalSize = file.size || 0;
    const sizeDiff = originalSize - transformedSize;
    const percentSaved = originalSize > 0 && transformedSize > 0 ? ((sizeDiff / originalSize) * 100).toFixed(0) : 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: { borderRadius: "16px", overflow: "hidden" },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.5,
                    px: 2.5,
                    borderBottom: "1px solid #E2E8F0",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "8px",
                            bgcolor: "#EEF2FF",
                            color: "#4F46E5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <AutoFixHighRoundedIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                            Image Studio & Transformer
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            {file.originalName} ({originalDimensions.width} × {originalDimensions.height} px)
                        </Typography>
                    </Box>
                </Box>

                <IconButton onClick={onClose} size="small" aria-label="Close Studio">
                    <CloseRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#F8FAFC" }}>
                <Grid container spacing={3}>
                    {/* Left: Interactive Canvas Preview */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box
                            sx={{
                                width: "100%",
                                minHeight: { xs: 240, sm: 340 },
                                height: 360,
                                bgcolor: "#0F172A",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 2,
                                position: "relative",
                                overflow: "hidden",
                                backgroundImage: "linear-gradient(45deg, #1E293B 25%, transparent 25%), linear-gradient(-45deg, #1E293B 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1E293B 75%), linear-gradient(-45deg, transparent 75%, #1E293B 75%)",
                                backgroundSize: "16px 16px",
                                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                            }}
                        >
                            {loadingImage || processing ? (
                                <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
                                    <CircularProgress sx={{ color: "#38BDF8" }} size={36} />
                                    <Typography variant="caption" color="#94A3B8" fontWeight={600}>
                                        {loadingImage ? "Loading image asset..." : "Applying transformations..."}
                                    </Typography>
                                </Box>
                            ) : previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Transformed Preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                        borderRadius: "4px",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                                    }}
                                />
                            ) : (
                                <Typography color="#94A3B8" variant="body2">No preview available</Typography>
                            )}
                        </Box>

                        {/* Size Comparison Badge */}
                        <Box
                            sx={{
                                mt: 2,
                                p: 1.5,
                                borderRadius: "10px",
                                bgcolor: "#FFFFFF",
                                border: "1px solid #E2E8F0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                                    ORIGINAL
                                </Typography>
                                <Typography variant="body2" fontWeight={700} color="#64748B">
                                    {formatFileSize(originalSize)}
                                </Typography>
                            </Box>

                            <Typography variant="body2" fontWeight={800} color="#94A3B8">→</Typography>

                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                                    TRANSFORMED
                                </Typography>
                                <Typography variant="body2" fontWeight={800} color={transformedSize > 0 ? "#059669" : "#64748B"}>
                                    {transformedSize > 0 ? formatFileSize(transformedSize) : "Calculating..."}
                                </Typography>
                            </Box>

                            {Number(percentSaved) > 0 ? (
                                <Chip
                                    label={`🔥 -${percentSaved}% Smaller`}
                                    size="small"
                                    color="success"
                                    sx={{ fontWeight: 800, height: 24, fontSize: "0.75rem" }}
                                />
                            ) : (
                                <Chip
                                    label={`${width} × ${height} px`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 700, height: 24, fontSize: "0.75rem" }}
                                />
                            )}
                        </Box>
                    </Grid>

                    {/* Right: Controls */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* Format Selection */}
                            <FormControl size="small" fullWidth>
                                <InputLabel>Target Format</InputLabel>
                                <Select
                                    value={format}
                                    label="Target Format"
                                    onChange={(e) => setFormat(e.target.value)}
                                    sx={{ borderRadius: "8px", bgcolor: "#FFFFFF" }}
                                >
                                    <MenuItem value="webp">WebP (Modern, high compression)</MenuItem>
                                    <MenuItem value="jpeg">JPEG (Universal compatibility)</MenuItem>
                                    <MenuItem value="png">PNG (Lossless, transparency)</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Quality Slider (hidden on PNG) */}
                            {format !== "png" && (
                                <Box>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                                            COMPRESSION QUALITY
                                        </Typography>
                                        <Typography variant="caption" fontWeight={800} color="#4F46E5">
                                            {quality}%
                                        </Typography>
                                    </Box>
                                    <Slider
                                        value={quality}
                                        min={10}
                                        max={100}
                                        step={5}
                                        onChange={(_, v) => setQuality(v)}
                                        sx={{ color: "#4F46E5" }}
                                    />
                                </Box>
                            )}

                            {/* Dimensions & Quick Scale */}
                            <Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                                        DIMENSIONS (PX)
                                    </Typography>
                                    <Tooltip title={aspectRatioLocked ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}>
                                        <IconButton
                                            size="small"
                                            onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                                            sx={{ p: 0.5, color: aspectRatioLocked ? "#4F46E5" : "#94A3B8" }}
                                        >
                                            {aspectRatioLocked ? <LockRoundedIcon fontSize="small" /> : <LockOpenRoundedIcon fontSize="small" />}
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Box display="flex" gap={1.25} alignItems="center" mb={1}>
                                    <TextField
                                        size="small"
                                        label="Width"
                                        type="number"
                                        value={width}
                                        onChange={(e) => handleWidthChange(e.target.value)}
                                        sx={{ bgcolor: "#FFFFFF" }}
                                    />
                                    <Typography variant="body2" color="text.secondary">×</Typography>
                                    <TextField
                                        size="small"
                                        label="Height"
                                        type="number"
                                        value={height}
                                        onChange={(e) => handleHeightChange(e.target.value)}
                                        sx={{ bgcolor: "#FFFFFF" }}
                                    />
                                </Box>

                                {/* Quick Scale Presets */}
                                <ButtonGroup size="small" variant="outlined" sx={{ width: "100%" }}>
                                    <Button sx={{ flex: 1, fontSize: "0.72rem", textTransform: "none", py: 0.4 }} onClick={() => handleScalePreset(0.5)}>50%</Button>
                                    <Button sx={{ flex: 1, fontSize: "0.72rem", textTransform: "none", py: 0.4 }} onClick={() => handleScalePreset(0.75)}>75%</Button>
                                    <Button sx={{ flex: 1, fontSize: "0.72rem", textTransform: "none", py: 0.4 }} onClick={() => handleScalePreset(1.0)}>100%</Button>
                                    <Button sx={{ flex: 1, fontSize: "0.72rem", textTransform: "none", py: 0.4 }} onClick={() => handleScalePreset(1.5)}>150%</Button>
                                    <Button sx={{ flex: 1, fontSize: "0.72rem", textTransform: "none", py: 0.4 }} onClick={() => handleScalePreset(2.0)}>200%</Button>
                                </ButtonGroup>
                            </Box>

                            <Divider />

                            {/* Rotation & Flip + Color Filters */}
                            <Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                                        ORIENTATION & FILTERS
                                    </Typography>

                                    <Box display="flex" gap={0.5}>
                                        <Tooltip title="Rotate 90°">
                                            <IconButton size="small" onClick={handleRotate} sx={{ color: "#4F46E5" }}>
                                                <RotateRightRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Flip Horizontal">
                                            <IconButton size="small" onClick={handleFlip} sx={{ color: flipH ? "#4F46E5" : "#94A3B8" }}>
                                                <FlipRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>

                                <Grid container spacing={1.5}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Brightness: {brightness}%
                                        </Typography>
                                        <Slider
                                            size="small"
                                            value={brightness}
                                            min={50}
                                            max={150}
                                            onChange={(_, v) => setBrightness(v)}
                                            sx={{ color: "#0284C7" }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Contrast: {contrast}%
                                        </Typography>
                                        <Slider
                                            size="small"
                                            value={contrast}
                                            min={50}
                                            max={150}
                                            onChange={(_, v) => setContrast(v)}
                                            sx={{ color: "#0284C7" }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Reset Adjustments */}
                            <Button
                                size="small"
                                variant="text"
                                startIcon={<RefreshRoundedIcon />}
                                onClick={handleReset}
                                sx={{ textTransform: "none", color: "#64748B", alignSelf: "flex-start", fontWeight: 600, mt: -0.5 }}
                            >
                                Reset All Adjustments
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, px: 2.5, justifyContent: "space-between", bgcolor: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}>
                <Button onClick={onClose} sx={{ fontWeight: 600, color: "#64748B", textTransform: "none" }}>
                    Cancel
                </Button>

                <Box sx={{ display: "flex", gap: 1.25 }}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadRoundedIcon />}
                        onClick={handleDownload}
                        disabled={loadingImage || processing || !previewUrl}
                        sx={{ borderRadius: "8px", fontWeight: 700, textTransform: "none" }}
                    >
                        Download (.{format})
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <CloudUploadRoundedIcon />}
                        onClick={handleSaveToCloud}
                        disabled={loadingImage || processing || saving || !previewUrl}
                        sx={{
                            borderRadius: "8px",
                            fontWeight: 700,
                            textTransform: "none",
                            background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)",
                        }}
                    >
                        {saving ? "Saving..." : "Save to Cloud"}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default ImageStudioDialog;
