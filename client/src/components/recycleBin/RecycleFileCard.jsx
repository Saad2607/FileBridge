import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Avatar,
} from "@mui/material";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import RestoreFromTrashRoundedIcon from "@mui/icons-material/RestoreFromTrashRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { formatFileSize } from "../../utils/fileHelpers";

function RecycleFileCard({ file, onRestore, onDeleteForever }) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                transition: "all .2s ease",
                "&:hover": {
                    borderColor: "#CBD5E1",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                },
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Avatar
                        sx={{
                            bgcolor: "#FEF2F2",
                            color: "#EF4444",
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                        }}
                    >
                        <InsertDriveFileRoundedIcon />
                    </Avatar>

                    <Box flex={1} minWidth={0}>
                        <Typography fontWeight={700} fontSize="0.95rem" color="#0F172A" noWrap title={file.originalName}>
                            {file.originalName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatFileSize(file.size)} • Deleted {new Date(file.deletedAt || file.updatedAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" gap={1.25} pt={1} borderTop="1px solid #F1F5F9">
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<RestoreFromTrashRoundedIcon />}
                        onClick={() => onRestore(file)}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            flex: 1,
                            borderColor: "#CBD5E1",
                            color: "#334155",
                            "&:hover": { bgcolor: "#F1F5F9" },
                        }}
                    >
                        Restore
                    </Button>

                    <Button
                        size="small"
                        color="error"
                        variant="soft"
                        startIcon={<DeleteForeverRoundedIcon />}
                        onClick={() => onDeleteForever(file)}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            flex: 1,
                            bgcolor: "#FEF2F2",
                            color: "#EF4444",
                            "&:hover": { bgcolor: "#FEE2E2" },
                        }}
                    >
                        Delete Forever
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default RecycleFileCard;