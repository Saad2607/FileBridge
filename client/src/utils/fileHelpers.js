import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import MovieIcon from "@mui/icons-material/Movie";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import ArchiveIcon from "@mui/icons-material/Archive";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export const getFileIcon = (mimeType) => {

    if (!mimeType)
        return InsertDriveFileIcon;

    if (mimeType.includes("pdf"))
        return PictureAsPdfIcon;

    if (mimeType.startsWith("image/"))
        return ImageIcon;

    if (mimeType.startsWith("video/"))
        return MovieIcon;

    if (mimeType.startsWith("audio/"))
        return AudioFileIcon;

    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z"))
        return ArchiveIcon;

    if (mimeType.includes("text"))
        return DescriptionIcon;

    return InsertDriveFileIcon;
};

export const getFileTypeLabel = (mimeType) => {

    if (!mimeType)
        return "File";

    if (mimeType.includes("pdf"))
        return "PDF Document";

    if (mimeType.startsWith("image/"))
        return "Image";

    if (mimeType.startsWith("video/"))
        return "Video";

    if (mimeType.startsWith("audio/"))
        return "Audio";

    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z"))
        return "Archive";

    if (mimeType.includes("text"))
        return "Text File";

    return "File";
};

export const formatFileSize = (bytes) => {

    if (!bytes)
        return "0 Bytes";

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB"
    ];

    let size = bytes;

    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;

        index++;
    }

    return `${size.toFixed(2)} ${units[index]}`;
};